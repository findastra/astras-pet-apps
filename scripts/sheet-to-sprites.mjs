// Turns a generated 3x3 mood sheet into the Cage's sprite format.
//
//   node scripts/sheet-to-sprites.mjs <sheet.png> <art-id> [--colours 20] [--size N] [--out dir]
//
// The sheet is one image holding the same character nine times, one per mood, on a plain
// light background. One generation per pet is what keeps the character identical across its
// moods; nine separate generations would give nine slightly different creatures.
//
// Order matters here. The generator antialiases its edges, so the image arrives with hundreds
// of near-identical shades and no clean pixel grid. Quantise first, then the runs of constant
// colour are honest and the art's own pixel pitch can be measured from them; sampling that
// grid is then effectively lossless. Resampling to a guessed size instead majority-votes thin
// features away - the one-pixel black outline and the small beak and feet simply vanish.
//
// Output is the same { pal, rows } shape the hand-drawn pets use, so everything downstream
// (cage-data.js, the roster, cage.html, the tests) keeps working.
//
// Node built-ins only, like the rest of this repo.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { basename } from 'node:path';

export const MOODS = ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep'];
const KEYS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

/* ---------- PNG decode (8-bit truecolour, with or without alpha, no interlace) ---------- */
export function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8, width = 0, height = 0, depth = 0, type = 0, interlace = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const tag = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (tag === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      depth = data[8]; type = data[9]; interlace = data[12];
    } else if (tag === 'IDAT') idat.push(data);
    else if (tag === 'IEND') break;
    pos += 12 + len;
  }
  if (depth !== 8) throw new Error(`need an 8-bit PNG, got ${depth}-bit`);
  if (type !== 2 && type !== 6) throw new Error(`need a truecolour PNG (type 2 or 6), got ${type}`);
  if (interlace) throw new Error('interlaced PNG is not supported');

  const ch = type === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const out = Buffer.alloc(width * height * 4);
  let prev = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = Buffer.from(raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride));
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? line[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      line[i] = v & 255;
    }
    for (let x = 0; x < width; x++) {
      const s = x * ch, d = (y * width + x) * 4;
      out[d] = line[s]; out[d + 1] = line[s + 1]; out[d + 2] = line[s + 2];
      out[d + 3] = ch === 4 ? line[s + 3] : 255;
    }
    prev = line;
  }
  return { width, height, rgba: out };
}

/* ---------- background removal ----------
   Flood fill inward from the border. A plain colour key would punch holes in the white
   highlight inside each eye; only background connected to an edge is removed. */
export function keyBackground(img, tolerance = 30) {
  const { width: w, height: h, rgba } = img;
  const bg = [rgba[0], rgba[1], rgba[2]];
  const near = (i) => Math.abs(rgba[i] - bg[0]) + Math.abs(rgba[i + 1] - bg[1]) + Math.abs(rgba[i + 2] - bg[2]) <= tolerance * 3;
  const out = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { if (x >= 0 && y >= 0 && x < w && y < h && !out[y * w + x] && near((y * w + x) * 4)) { out[y * w + x] = 1; stack.push(x, y); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) { const y = stack.pop(), x = stack.pop(); push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  return out;
}

/* ---------- quantise ----------
   Snap every foreground pixel to a small palette. This is what turns antialiased mush back
   into flat pixel art, and it is what makes the pitch measurable below. */
export function quantize(img, mask, limit = 20) {
  const counts = new Map();
  for (let i = 0; i < img.width * img.height; i++) {
    if (mask[i]) continue;
    const o = i * 4;
    counts.set(hex(img.rgba[o], img.rgba[o + 1], img.rgba[o + 2]), (counts.get(hex(img.rgba[o], img.rgba[o + 1], img.rgba[o + 2])) || 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([h]) => h);
  // Keep the most common colours that are not near-duplicates of one already kept.
  const keep = [];
  for (const h of ranked) {
    if (keep.length >= limit) break;
    if (keep.every((k) => dist2(rgb(h), rgb(k)) > 900)) keep.push(h);
  }
  if (!keep.length) keep.push('#000000');
  const keepRgb = keep.map(rgb);
  const cache = new Map();
  const snapOne = (h) => {
    let v = cache.get(h);
    if (v) return v;
    const c = rgb(h);
    let best = keep[0], d = Infinity;
    for (let i = 0; i < keep.length; i++) { const dd = dist2(c, keepRgb[i]); if (dd < d) { d = dd; best = keep[i]; } }
    cache.set(h, best);
    return best;
  };
  const pix = new Array(img.width * img.height).fill(null);
  for (let i = 0; i < pix.length; i++) {
    if (mask[i]) continue;
    const o = i * 4;
    pix[i] = snapOne(hex(img.rgba[o], img.rgba[o + 1], img.rgba[o + 2]));
  }
  return { pix, palette: keep };
}

/* ---------- geometry ---------- */
const cellRect = (img, i) => {
  const cw = Math.floor(img.width / 3), ch = Math.floor(img.height / 3);
  return { x: (i % 3) * cw, y: Math.floor(i / 3) * ch, w: cw, h: ch };
};

/* Drop specks before measuring.
   The generator leaves stray marks in the margins - a stripe, a dropped pixel, half an extra
   limb. The crop box is shared across all nine cells, so one speck in one cell pushes the box
   out and every frame ends up small and off-centre. Keep only blobs big enough to be part of
   the character. */
export function despeckle(pix, width, r, minFraction = 0.004) {
  const seen = new Uint8Array(r.w * r.h);
  const min = Math.max(12, Math.floor(r.w * r.h * minFraction));
  const kept = new Uint8Array(r.w * r.h);
  for (let sy = 0; sy < r.h; sy++) for (let sx = 0; sx < r.w; sx++) {
    if (seen[sy * r.w + sx] || !pix[(r.y + sy) * width + (r.x + sx)]) continue;
    const blob = [], stack = [sx, sy];
    seen[sy * r.w + sx] = 1;
    while (stack.length) {
      const y = stack.pop(), x = stack.pop();
      blob.push(y * r.w + x);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= r.w || ny >= r.h) continue;
        if (seen[ny * r.w + nx] || !pix[(r.y + ny) * width + (r.x + nx)]) continue;
        seen[ny * r.w + nx] = 1; stack.push(nx, ny);
      }
    }
    if (blob.length >= min) for (const i of blob) kept[i] = 1;
  }
  return kept;
}

function bounds(kept, r) {
  let x0 = r.w, y0 = r.h, x1 = -1, y1 = -1;
  for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) {
    if (kept[y * r.w + x]) {
      if (x < x0) x0 = x; if (y < y0) y0 = y;
      if (x > x1) x1 = x; if (y > y1) y1 = y;
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

/* ---------- pixel pitch ----------
   On the quantised image, a horizontal scan gives runs that are whole multiples of the art's
   pixel size. The pitch is the shortest length that occurs often; everything else is a
   multiple of it. */
export function detectPitch(pix, width, rects, box, max = 28) {
  // Where the colour changes along each scan line, relative to the left edge of the box.
  const changes = [];
  for (const r of rects) {
    for (let y = box.y0; y <= box.y1; y++) {
      if (y < 0 || y >= r.h) continue;
      let prev;
      for (let x = box.x0; x <= box.x1; x++) {
        if (x < 0 || x >= r.w) continue;
        const cur = pix[(r.y + y) * width + (r.x + x)] || 'bg';
        if (prev !== undefined && cur !== prev) changes.push(x - box.x0);
        prev = cur;
      }
    }
  }
  if (changes.length < 20) return 1;

  // On a pixel grid of pitch P every change sits on a multiple of P. Divisors of P score just
  // as well, so take the LARGEST pitch that still explains almost every change.
  const score = (p) => {
    const bins = new Array(p).fill(0);
    for (const c of changes) bins[((c % p) + p) % p]++;
    return Math.max(...bins) / changes.length;
  };
  let best = 1;
  for (let p = 2; p <= max; p++) if (score(p) >= 0.9) best = p;
  return best;
}

/* Downsample a block to one pixel.
   A plain majority vote loses the one-pixel black outline, because an edge block is mostly
   body colour with only a sliver of outline in it. So dark ink gets priority: if the darkest
   colour present holds even a fifth of the block, it wins. That is what keeps the silhouette
   crisp, and it is also what keeps small features like the beak and feet from dissolving. */
const lum = (h) => { const [r, g, b] = rgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

function blockSample(pix, width, r, box, cols, rowsOut = cols, kept = null, inkBias = 0.2) {
  const bw = box.x1 - box.x0 + 1, bh = box.y1 - box.y0 + 1;
  const rows = [];
  for (let ty = 0; ty < rowsOut; ty++) {
    const sy0 = box.y0 + Math.floor((ty * bh) / rowsOut), sy1 = box.y0 + Math.max(Math.floor(((ty + 1) * bh) / rowsOut), Math.floor((ty * bh) / rowsOut) + 1);
    const row = [];
    for (let tx = 0; tx < cols; tx++) {
      const sx0 = box.x0 + Math.floor((tx * bw) / cols), sx1 = box.x0 + Math.max(Math.floor(((tx + 1) * bw) / cols), Math.floor((tx * bw) / cols) + 1);
      const tally = new Map();
      let total = 0, fore = 0;
      for (let y = sy0; y < sy1; y++) for (let x = sx0; x < sx1; x++) {
        if (x < 0 || y < 0 || x >= r.w || y >= r.h) continue;
        total++;
        if (kept && !kept[y * r.w + x]) continue; // a speck the despeckler rejected
        const c = pix[(r.y + y) * width + (r.x + x)];
        if (!c) continue;
        fore++;
        tally.set(c, (tally.get(c) || 0) + 1);
      }
      if (!total || fore * 2 < total) { row.push(null); continue; }
      let darkest = null;
      for (const c of tally.keys()) if (darkest === null || lum(c) < lum(darkest)) darkest = c;
      if (darkest !== null && tally.get(darkest) >= fore * inkBias && lum(darkest) < 110) { row.push(darkest); continue; }
      let best = null, n = 0;
      for (const [c, k] of tally) if (k > n) { n = k; best = c; }
      row.push(best);
    }
    rows.push(row);
  }
  return rows;
}

function pack(rows) {
  const pal = {}, seen = new Map();
  const out = rows.map((row) => row.map((h) => {
    if (!h) return '.';
    if (!seen.has(h)) { const k = KEYS[seen.size]; if (!k) throw new Error('too many colours in one frame'); seen.set(h, k); pal[k] = h; }
    return seen.get(h);
  }).join(''));
  return { pal, rows: out };
}

/* ---------- the conversion ---------- */
export function sheetToSprite(buf, { size = 0, colours = 20, tolerance = 30, aspect = 1, pad = 0.14 } = {}) {
  const img = decodePng(buf);
  const mask = keyBackground(img, tolerance);
  const { pix, palette } = quantize(img, mask, colours);

  const rects = MOODS.map((_, i) => cellRect(img, i));
  const keeps = rects.map((r) => despeckle(pix, img.width, r));
  const boxes = rects.map((r, i) => bounds(keeps[i], r));
  const missing = boxes.map((b, i) => (b ? null : MOODS[i])).filter(Boolean);
  if (missing.length) throw new Error(`empty cell(s) in the sheet: ${missing.join(', ')}`);

  // One crop SIZE for all nine cells, but centred on each cell's own content.
  //
  // The generator does not put the character in exactly the same spot in every cell: a pair
  // of characters can sit 47 pixels further left in one mood than another. Sharing a single
  // box across cells has to span every extreme, which leaves a sprite that is mostly empty
  // air. Sharing only the size keeps the scale identical between moods - so the character
  // does not breathe as it animates - while removing the position drift.
  const box = {
    x0: 0, y0: 0,
    x1: Math.max(...boxes.map((b) => b.x1 - b.x0)),
    y1: Math.max(...boxes.map((b) => b.y1 - b.y0)),
  };
  // aspect 1 is a square sprite. "auto" takes the shape of what was actually drawn, which is
  // what a pet of two characters wants: forcing a flat 2:1 just pads empty space around a pair
  // who were drawn standing close together.
  const boxW = box.x1 - box.x0 + 1, boxH = box.y1 - box.y0 + 1;
  const ratio = aspect === 'auto' ? Math.min(3, Math.max(0.75, boxW / boxH)) : aspect;
  // A margin around the character. The mood indicators (?, !, Z) are stamped into the corners
  // afterwards, and a sprite drawn edge to edge leaves them nowhere to sit; it also looks
  // cramped. See indicators.mjs.
  const grow = 1 + pad * 2;
  const h = Math.round(Math.max(boxH, boxW / ratio) * grow);
  const w = Math.round(h * ratio);
  // Each cell gets the same w x h window, placed over the middle of that cell's own content.
  const crops = boxes.map((b) => {
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    return { x0: Math.round(cx - w / 2), y0: Math.round(cy - h / 2), x1: Math.round(cx + w / 2), y1: Math.round(cy + h / 2) };
  });
  const crop = crops[0];

  const pitch = detectPitch(pix, img.width, rects, crop);
  const gridH = size || (pitch > 2 ? Math.max(32, Math.min(96, Math.round(h / pitch))) : 64);
  const gridW = Math.round(gridH * ratio);

  const frames = {};
  MOODS.forEach((m, i) => { frames[m] = pack(blockSample(pix, img.width, rects[i], crops[i], gridW, gridH, keeps[i])); });
  return { size: [gridW, gridH], moods: MOODS, frames, pitch, palette };
}

/* ---------- CLI ---------- */
const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('sheet-to-sprites.mjs');
if (invokedDirectly) {
  const args = process.argv.slice(2);
  const flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
  const size = Number(flag('--size', 0));
  const colours = Number(flag('--colours', 20));
  const outDir = flag('--out', 'art/generated');
  const [sheet, id] = args;
  if (!sheet || !id) { console.error('Usage: node scripts/sheet-to-sprites.mjs <sheet.png> <art-id> [--colours 20] [--size N] [--out dir]'); process.exit(2); }

  const sprite = sheetToSprite(readFileSync(sheet), { size, colours });
  mkdirSync(outDir, { recursive: true });
  const file = `${outDir}/${id}.json`;
  writeFileSync(file, JSON.stringify({ id, name: id, source: basename(sheet), ...sprite }, null, 1));
  const used = new Set(Object.values(sprite.frames).flatMap((f) => Object.values(f.pal)));
  const filled = Object.values(sprite.frames).map((f) => f.rows.join('').replace(/\./g, '').length);
  console.log(`${id}: ${sprite.size[0]}x${sprite.size[1]} (pitch ${sprite.pitch}px), 9 moods, ${used.size} colours, ${Math.min(...filled)}-${Math.max(...filled)} px/frame -> ${file}`);
}
