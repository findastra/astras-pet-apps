// Draws accessories onto a converted sprite, for details the generator will not place
// reliably.
//
//   node scripts/accessories.mjs <id> glasses     preview to art/generated/<id>-acc.png
//
// Why this exists: asking the generator for a small detail re-rolls the whole character, and
// the body that comes back is not the body that was approved. Portfolio Puffer's round
// spectacles are drawn here instead, over the penguin Astra already signed off on.
import { readFileSync, writeFileSync } from 'node:fs';
import { sheetToSprite, MOODS } from './sheet-to-sprites.mjs';
import { png } from './art-kit.mjs';

const lum = (h) => {
  const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Find the two eyes in a frame.
 * Dark connected blobs, ignoring the big one (that is the character's outline) and anything
 * in the lower half (feet, shadows). Returns the two largest remaining, left to right.
 */
export function findEyes(frame, W, H) {
  const dark = new Uint8Array(W * H);
  frame.rows.forEach((row, y) => [...row].forEach((c, x) => {
    const hex = frame.pal[c];
    // 45, not 80: luminance is green-weighted, so a hot magenta body scores about 74 and a
    // looser threshold swallows the whole character into one blob instead of finding eyes.
    if (hex && lum(hex) < 45) dark[y * W + x] = 1;
  }));
  const seen = new Uint8Array(W * H);
  const blobs = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!dark[y * W + x] || seen[y * W + x]) continue;
    const cells = [], stack = [x, y];
    seen[y * W + x] = 1;
    while (stack.length) {
      const cy = stack.pop(), cx = stack.pop();
      cells.push([cx, cy]);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (!dark[ny * W + nx] || seen[ny * W + nx]) continue;
        seen[ny * W + nx] = 1; stack.push(nx, ny);
      }
    }
    const xs = cells.map((p) => p[0]), ys = cells.map((p) => p[1]);
    blobs.push({
      n: cells.length,
      x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys),
      cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2,
    });
  }
  const area = W * H;
  const candidates = blobs
    .filter((b) => b.n < area * 0.03 && b.n > area * 0.0002)   // not the outline, not a speck
    .filter((b) => b.cy < H * 0.6)                              // eyes live in the upper face
    .filter((b) => (b.x1 - b.x0) < W * 0.25 && (b.y1 - b.y0) < H * 0.25)
    .sort((a, b) => b.n - a.n)
    .slice(0, 2)
    .sort((a, b) => a.cx - b.cx);
  return candidates.length === 2 ? candidates : null;
}

const KEYS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function keyFor(pal, hex) {
  for (const [k, v] of Object.entries(pal)) if (v === hex) return k;
  for (const k of KEYS) if (!(k in pal)) { pal[k] = hex; return k; }
  return null;
}

/** Round wire spectacles over both eyes, with a bridge and temple arms. */
export function addGlasses(sprite, { colour = '#241a2e', shine = '#f2f2ff' } = {}) {
  const [W, H] = sprite.size;
  const frames = {};

  // Place from the idle frame and reuse that geometry everywhere: the body is identical in
  // every mood (that is the point of generating one sheet), so the glasses must not wander.
  const ref = findEyes(sprite.frames.idle, W, H);
  if (!ref) throw new Error('could not find two eyes in the idle frame');
  const [L, R] = ref;
  const gap = R.cx - L.cx;
  const rad = Math.max(5, Math.round(gap * 0.36));
  const thick = Math.max(2, Math.round(W / 95));

  for (const mood of MOODS) {
    const src = sprite.frames[mood];
    if (!src) continue;
    const pal = { ...src.pal };
    const grid = src.rows.map((r) => [...r]);
    const k = keyFor(pal, colour), kh = keyFor(pal, shine);
    const put = (x, y, key, onBodyOnly = false) => {
      x = Math.round(x); y = Math.round(y);
      if (x < 0 || y < 0 || x >= W || y >= H || !key) return;
      // The temple arms must stop at the edge of the head. Without this they carry on into
      // empty space and read as whiskers rather than glasses.
      if (onBodyOnly && grid[y][x] === '.') return;
      grid[y][x] = key;
    };
    const ring = (cx, cy) => {
      for (let a = 0; a < 360; a += 1.2) {
        const t = (a * Math.PI) / 180;
        for (let d = 0; d < thick; d++) put(cx + Math.cos(t) * (rad - d), cy + Math.sin(t) * (rad - d), k);
      }
      // a small highlight on the upper left of each lens, so they read as glass
      for (let a = 200; a < 250; a += 3) {
        const t = (a * Math.PI) / 180;
        put(cx + Math.cos(t) * (rad - thick - 1), cy + Math.sin(t) * (rad - thick - 1), kh);
      }
    };
    ring(L.cx, L.cy);
    ring(R.cx, R.cy);
    // bridge
    for (let x = L.cx + rad; x <= R.cx - rad; x++) for (let d = 0; d < thick; d++) put(x, L.cy - 1 + d, k);
    // temple arms, clipped to the head
    for (let i = 0; i < Math.round(rad * 1.6); i++) for (let d = 0; d < thick; d++) {
      put(L.cx - rad - i, L.cy - Math.round(i * 0.2) + d, k, true);
      put(R.cx + rad + i, R.cy - Math.round(i * 0.2) + d, k, true);
    }

    const used = new Set();
    for (const row of grid) for (const c of row) if (c !== '.') used.add(c);
    const outPal = {};
    for (const key of used) if (pal[key]) outPal[key] = pal[key];
    frames[mood] = { pal: outPal, rows: grid.map((r) => r.join('')) };
  }
  return { ...sprite, frames };
}

export const ACCESSORIES = { glasses: addGlasses };

/* ---------- CLI preview ---------- */
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('accessories.mjs')) {
  const [id, which = 'glasses'] = process.argv.slice(2);
  if (!id) { console.error('Usage: node scripts/accessories.mjs <id> [glasses]'); process.exit(2); }
  const sprite = ACCESSORIES[which](sheetToSprite(readFileSync(`art/sheets/${id}.png`), { size: 256, colours: 24 }));
  const [W, H] = sprite.size, GAP = 6;
  const bw = (W + GAP) * 3 + GAP, bh = (H + GAP) * 3 + GAP;
  const buf = Buffer.alloc(bw * bh * 4);
  for (let i = 0; i < bw * bh; i++) { buf[i * 4] = 0x80; buf[i * 4 + 1] = 0x80; buf[i * 4 + 2] = 0x80; buf[i * 4 + 3] = 255; }
  MOODS.forEach((m, n) => {
    const f = sprite.frames[m], ox = GAP + (n % 3) * (W + GAP), oy = GAP + Math.floor(n / 3) * (H + GAP);
    f.rows.forEach((row, y) => [...row].forEach((c, x) => {
      const hex = f.pal[c];
      if (!hex) return;
      const i = ((oy + y) * bw + ox + x) * 4;
      buf[i] = parseInt(hex.slice(1, 3), 16); buf[i + 1] = parseInt(hex.slice(3, 5), 16); buf[i + 2] = parseInt(hex.slice(5, 7), 16); buf[i + 3] = 255;
    }));
  });
  writeFileSync(`art/generated/${id}-acc.png`, png(bw, bh, buf));
  console.log(`art/generated/${id}-acc.png`);
}
