// Stamps the shared mood indicators onto a generated sprite.
//
//   node scripts/indicators.mjs <id>        write a preview to art/generated/<id>-moods.png
//
// Astra's rule: the little floating symbols must be IDENTICAL on every pet, so the mood can
// be read at a glance without learning each character. That only works if one set is stamped
// by code. The generator is told never to draw them (see generate-pets.mjs STYLE), and they
// are added here instead, from the one sticker set in art-kit.mjs.
//
// This does not modify the converted art. It returns a new sprite, so the raw conversion in
// art/generated/ stays pristine and re-running is idempotent.
import { readFileSync, writeFileSync } from 'node:fs';
import { STICKERS, png } from './art-kit.mjs';
import { MOODS } from './sheet-to-sprites.mjs';

/* Which sticker each mood carries, and which corner it sits in.
   "sleep", "curious" and "alarmed" are the three Astra named; the rest follow the same idea
   so all nine moods read the same way on every pet. "idle", "blink" and "happy" carry none:
   a calm pet should not have a badge floating next to it. */
export const INDICATORS = {
  curious: { sticker: 'ask', corner: 'tr' },
  worried: { sticker: 'sweat', corner: 'tl' },
  sad: { sticker: 'tear', corner: 'tl' },
  sick: { sticker: 'plaster', corner: 'tr' },
  alarmed: { sticker: 'bang', corner: 'tr' },
  sleep: { sticker: 'zzz', corner: 'tr' },
};

/** Tight box of drawn pixels in a frame. */
function frameBounds(frame, W, H) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  frame.rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '.') return;
    if (x < x0) x0 = x; if (y < y0) y0 = y;
    if (x > x1) x1 = x; if (y > y1) y1 = y;
  }));
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

/** Rows of a frame as a mutable grid of palette keys. */
const toGrid = (frame) => frame.rows.map((r) => [...r]);

function repack(grid, pal) {
  const used = new Set();
  for (const row of grid) for (const c of row) if (c !== '.') used.add(c);
  const out = {};
  for (const k of used) if (pal[k]) out[k] = pal[k];
  return { pal: out, rows: grid.map((r) => r.join('')) };
}

/** Add a colour to a frame's palette, reusing the key if it is already there. */
const KEYS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function keyFor(pal, hex) {
  for (const [k, v] of Object.entries(pal)) if (v === hex) return k;
  for (const k of KEYS) if (!(k in pal)) { pal[k] = hex; return k; }
  return null; // palette full: skip rather than corrupt the frame
}

/**
 * Stamp the indicators onto a sprite.
 * The badge is placed just outside the character's own bounding box, so it never covers the
 * face, and it is scaled with the sprite so a 64px pet gets a badge twice the size a 32px one
 * would. Anything that would fall off the canvas is pulled back inside.
 */
export function addIndicators(sprite, { scale = 0 } = {}) {
  const [W, H] = sprite.size;
  const s = scale || Math.max(1, Math.round(H / 32));
  const frames = {};

  for (const mood of MOODS) {
    const src = sprite.frames[mood];
    if (!src) continue;
    const spec = INDICATORS[mood];
    if (!spec) { frames[mood] = { pal: { ...src.pal }, rows: [...src.rows] }; continue; }

    const art = STICKERS[spec.sticker];
    const grid = toGrid(src);
    const pal = { ...src.pal };
    const box = frameBounds(src, W, H) || { x0: 0, y0: 0, x1: W - 1, y1: H - 1 };

    const sw = art.rows[0].length * s, sh = art.rows.length * s;
    // Overlap the character's corner rather than sitting entirely outside it. Sitting outside
    // needs as much clear margin as the widest sticker, and the widest two ("?" and "Z", four
    // cells across) do not fit: they end up jammed flush against the canvas edge and read as
    // cut off. Overlapping by about a third keeps every badge inside the frame whatever the
    // pet's shape, and still reads as a badge floating by the head.
    const bite = Math.round(sw * 0.35);
    let ox = spec.corner === 'tl' ? box.x0 - sw + bite : box.x1 + 1 - bite;
    let oy = box.y0 - Math.round(sh * 0.55);
    ox = Math.max(0, Math.min(W - sw, ox));
    oy = Math.max(0, Math.min(H - sh, oy));

    art.rows.forEach((row, ry) => [...row].forEach((ch, rx) => {
      const hex = art.pal[ch];
      if (!hex) return;
      const k = keyFor(pal, hex);
      if (!k) return;
      for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) {
        const px = ox + rx * s + dx, py = oy + ry * s + dy;
        if (px < 0 || py < 0 || px >= W || py >= H) continue;
        grid[py][px] = k;
      }
    }));

    frames[mood] = repack(grid, pal);
  }
  return { ...sprite, frames };
}

/* ---------- CLI preview ---------- */
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('indicators.mjs')) {
  const id = process.argv[2];
  if (!id) { console.error('Usage: node scripts/indicators.mjs <id>'); process.exit(2); }
  const sprite = addIndicators(JSON.parse(readFileSync(`art/generated/${id}.json`, 'utf8')));
  const [W, H] = sprite.size;
  const SC = 6, GAP = 4;
  const bw = (W * SC + GAP) * 3 + GAP, bh = (H * SC + GAP) * 3 + GAP;
  const buf = Buffer.alloc(bw * bh * 4);
  for (let i = 0; i < bw * bh; i++) { buf[i * 4] = 0x1d; buf[i * 4 + 1] = 0x18; buf[i * 4 + 2] = 0x24; buf[i * 4 + 3] = 255; }
  MOODS.forEach((mood, n) => {
    const f = sprite.frames[mood];
    const ox = GAP + (n % 3) * (W * SC + GAP), oy = GAP + Math.floor(n / 3) * (H * SC + GAP);
    f.rows.forEach((row, y) => [...row].forEach((c, x) => {
      const hex = f.pal[c];
      if (!hex) return;
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      for (let dy = 0; dy < SC; dy++) for (let dx = 0; dx < SC; dx++) {
        const i = ((oy + y * SC + dy) * bw + ox + x * SC + dx) * 4;
        buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
      }
    }));
  });
  writeFileSync(`art/generated/${id}-moods.png`, png(bw, bh, buf));
  console.log(`art/generated/${id}-moods.png`);
}
