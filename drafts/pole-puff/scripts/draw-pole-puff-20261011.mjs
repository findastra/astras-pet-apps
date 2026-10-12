// Draws Pole Puff's nine mood frames (256x256, transparent) and a 3x3 sheet on grey.
// Hand-drawn stand-in until the generated house art lands (that costs money and waits on Astra's OK).
// No dependencies: Node's built-in zlib writes the PNGs. Run: node scripts/draw-pole-puff-20261011.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATE = '20261011';
const N = 64; // drawing grid; scaled 4x to 256
const MOODS = ['neutral', 'blink', 'happy', 'curious', 'worried', 'sad', 'unwell', 'shocked', 'sleeping'];

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 255];
const C = {
  fluff: hex('#7A8CFF'),  // neon periwinkle-blue puff
  shade: hex('#5A63E8'),  // deeper periwinkle tufts
  light: hex('#B9C4FF'),  // pale highlight tufts
  stripeA: hex('#FF5A7A'), // hot coral stripe on the pole tuft
  stripeB: hex('#FFFFFF'),
  knob: hex('#C6FF1A'),   // acid-lime knob and nub arms
  eye: hex('#000000'),
  hi: hex('#FFFFFF'),
  blush: hex('#FFB3D1'),
  sick: hex('#6FB34A'),
  out: hex('#000000'),
};

function canvas(w, h) { return { w, h, px: new Uint8Array(w * h * 4) }; }
function put(c, x, y, col) {
  if (x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  c.px.set(col, (y * c.w + x) * 4);
}
function rect(c, col, x, y, w = 1, h = 1) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(c, x + i, y + j, col); }
const alpha = (c, x, y) => (x < 0 || y < 0 || x >= c.w || y >= c.h ? 0 : c.px[(y * c.w + x) * 4 + 3]);

function draw(mood) {
  const c = canvas(N, N);
  const cx = 32, cy = 38, R = 19;
  // the puff: a circle with a scalloped, fluffy edge
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = x - cx, dy = y - cy;
    const a = Math.atan2(dy, dx);
    const r = R + 1.6 * Math.cos(a * 9);
    if (dx * dx + dy * dy <= r * r) put(c, x, y, C.fluff);
  }
  // fluff texture: a few deeper and paler tufts
  for (const [x, y] of [[18, 44], [44, 46], [22, 52], [40, 53], [47, 36], [16, 34]]) rect(c, C.shade, x, y, 3, 2);
  for (const [x, y] of [[24, 25], [37, 24], [20, 30]]) rect(c, C.light, x, y, 3, 2);
  // the pole tuft on top: a short candy-striped pole with a lime knob (a nod to the Infinite Pole)
  for (let y = 9; y <= 20; y++) rect(c, (Math.floor((y - 9) / 2) % 2 === 0) ? C.stripeA : C.stripeB, 31, y, 3, 1);
  rect(c, C.knob, 30, 6, 5, 3);
  // little nub arms; it floats, so no feet
  rect(c, C.knob, 11, 40, 3, 3);
  rect(c, C.knob, 50, 40, 3, 3);
  // blush
  rect(c, C.blush, 21, 41, 4, 2); rect(c, C.blush, 39, 41, 4, 2);

  const L = 25, Rr = 37, ey = 35;
  switch (mood) {
    case 'blink': rect(c, C.eye, L, ey + 1, 3, 1); rect(c, C.eye, Rr, ey + 1, 3, 1); break;
    case 'sleeping': for (const x of [L, Rr]) { put(c, x, ey + 1, C.eye); put(c, x + 1, ey + 2, C.eye); put(c, x + 2, ey + 1, C.eye); } break;
    case 'happy': for (const x of [L, Rr]) { put(c, x, ey + 1, C.eye); put(c, x + 1, ey, C.eye); put(c, x + 2, ey + 1, C.eye); } break;
    case 'shocked': for (const x of [L, Rr]) { rect(c, C.eye, x, ey - 1, 3, 3); put(c, x, ey - 1, C.hi); } break;
    case 'unwell': for (const x of [L, Rr]) rect(c, C.eye, x, ey + 1, 3, 1); rect(c, C.sick, L - 1, ey - 1, 4, 1); rect(c, C.sick, Rr - 1, ey - 1, 4, 1); break;
    default: for (const x of [L, Rr]) { rect(c, C.eye, x, ey, 2, 2); put(c, x, ey, C.hi); }
  }
  // brows
  if (mood === 'curious') { rect(c, C.eye, L, ey - 3, 3, 1); rect(c, C.eye, Rr, ey - 4, 3, 1); }
  if (mood === 'worried') { rect(c, C.eye, L - 1, ey - 2, 2, 1); rect(c, C.eye, L + 1, ey - 3, 2, 1); rect(c, C.eye, Rr, ey - 3, 2, 1); rect(c, C.eye, Rr + 2, ey - 2, 2, 1); }
  if (mood === 'sad') { rect(c, C.eye, L - 1, ey - 3, 2, 1); rect(c, C.eye, L + 1, ey - 2, 2, 1); rect(c, C.eye, Rr, ey - 2, 2, 1); rect(c, C.eye, Rr + 2, ey - 3, 2, 1); }
  // mouth
  const my = 43;
  if (mood === 'happy') { rect(c, C.eye, 30, my, 4, 1); put(c, 29, my - 1, C.eye); put(c, 34, my - 1, C.eye); }
  else if (mood === 'shocked') { rect(c, C.eye, 30, my - 1, 3, 3); }
  else if (mood === 'sad' || mood === 'unwell' || mood === 'worried') { rect(c, C.eye, 30, my - 1, 4, 1); put(c, 29, my, C.eye); put(c, 34, my, C.eye); }
  else if (mood === 'sleeping') { rect(c, C.eye, 31, my, 2, 1); }
  else { rect(c, C.eye, 30, my, 4, 1); }

  // one-pixel black outline around the whole silhouette
  const o = canvas(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4;
    if (c.px[i + 3]) { o.px.set(c.px.subarray(i, i + 4), i); continue; }
    if (alpha(c, x + 1, y) || alpha(c, x - 1, y) || alpha(c, x, y + 1) || alpha(c, x, y - 1)) o.px.set(C.out, i);
  }
  // scale 4x, nearest neighbour
  const big = canvas(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const s = ((y >> 2) * N + (x >> 2)) * 4;
    big.px.set(o.px.subarray(s, s + 4), (y * 256 + x) * 4);
  }
  return big;
}

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(c) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(c.w, 0); ihdr.writeUInt32BE(c.h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((c.w * 4 + 1) * c.h);
  for (let y = 0; y < c.h; y++) Buffer.from(c.px.buffer, y * c.w * 4, c.w * 4).copy(raw, y * (c.w * 4 + 1) + 1);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const frames = join(root, 'art', 'frames'), sheets = join(root, 'art', 'sheets');
mkdirSync(frames, { recursive: true }); mkdirSync(sheets, { recursive: true });
const sheet = canvas(768, 768);
sheet.px.fill(0x80); // grey background, opaque
MOODS.forEach((mood, i) => {
  const f = draw(mood);
  writeFileSync(join(frames, `${mood}-${DATE}.png`), png(f));
  const ox = (i % 3) * 256, oy = Math.floor(i / 3) * 256;
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const s = (y * 256 + x) * 4;
    if (f.px[s + 3]) sheet.px.set(f.px.subarray(s, s + 4), ((oy + y) * 768 + ox + x) * 4);
  }
});
writeFileSync(join(sheets, `pole-puff-${DATE}.png`), png(sheet));
console.log(`Drew ${MOODS.length} frames and the sheet.`);
