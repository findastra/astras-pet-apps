// A labelled contact sheet of the built frames in art/frames/.
//
//   node scripts/frames-sheet.mjs [--thumb 96] [--out art/roster.png]
//
// The frames are 256px each, so nine of them across is far too wide to look at. This
// downsamples each one to --thumb for the sheet only; the frames themselves are untouched.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { png } from './art-kit.mjs';
import { decodePng } from './sheet-to-sprites.mjs';
import { drawText, textWidth, GLYPH_H } from './label-font.mjs';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const THUMB = Number(flag('--thumb', 96));
const out = flag('--out', 'art/roster.png');
const TS = 2, PAD = 8, GAP = 4;

const index = JSON.parse(readFileSync('art/frames/index.json', 'utf8'));
const MOODS = index.moods;

const names = {};
let order = Object.keys(index.pets);
try {
  const reg = JSON.parse(readFileSync('pets.json', 'utf8'));
  for (const p of reg.pets || []) names[p.art] = p.pet;
  const wanted = [...(reg.mascots || []).map((m) => m.art), ...(reg.pets || []).flatMap((p) => [p.art, ...(p.companions || [])])];
  const known = wanted.filter((id) => index.pets[id]);
  order = [...known, ...order.filter((id) => !known.includes(id))];
} catch { /* no registry: alphabetical */ }
const label = (id) => (names[id] || id.replace(/-/g, ' ')).toUpperCase();

const gutter = Math.max(...order.map((id) => textWidth(label(id), TS))) + PAD * 2;
const header = GLYPH_H * TS + PAD * 2;
const cell = THUMB + GAP;
const bw = gutter + cell * MOODS.length + GAP;
const bh = header + cell * order.length + GAP;
const buf = Buffer.alloc(bw * bh * 4);

const fill = (x0, y0, x1, y1, c) => {
  for (let y = Math.max(0, y0); y < Math.min(bh, y1); y++) for (let x = Math.max(0, x0); x < Math.min(bw, x1); x++) {
    const i = (y * bw + x) * 4; buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
  }
};
fill(0, 0, bw, bh, [0x1d, 0x18, 0x24]);

order.forEach((id, r) => MOODS.forEach((_, c) => {
  const ox = gutter + c * cell, oy = header + r * cell;
  fill(ox, oy, ox + THUMB, oy + THUMB, r % 2 ? [0x34, 0x2c, 0x3e] : [0x3b, 0x32, 0x47]);
}));

MOODS.forEach((mood, c) => {
  const w = textWidth(mood, TS);
  drawText(buf, bw, mood, gutter + c * cell + Math.floor((THUMB - w) / 2), PAD, '#cdbfe3', TS);
});

order.forEach((id, r) => {
  drawText(buf, bw, label(id), PAD, header + r * cell + Math.floor((THUMB - GLYPH_H * TS) / 2), '#ffffff', TS);
  MOODS.forEach((mood, c) => {
    const file = index.pets[id].frames[mood];
    if (!existsSync(file)) return;
    const img = decodePng(readFileSync(file));
    const ox = gutter + c * cell, oy = header + r * cell;
    for (let y = 0; y < THUMB; y++) for (let x = 0; x < THUMB; x++) {
      const sx = Math.floor((x * img.width) / THUMB), sy = Math.floor((y * img.height) / THUMB);
      const s = (sy * img.width + sx) * 4;
      if (img.rgba[s + 3] < 128) continue; // transparent: leave the tile showing
      const d = ((oy + y) * bw + ox + x) * 4;
      buf[d] = img.rgba[s]; buf[d + 1] = img.rgba[s + 1]; buf[d + 2] = img.rgba[s + 2]; buf[d + 3] = 255;
    }
  });
});

writeFileSync(out, png(bw, bh, buf));
console.log(`${out} (${bw}x${bh}), ${order.length} pets at ${index.size}px, shown at ${THUMB}px`);
