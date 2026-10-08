// Pixel-art toolkit for the Cage's pets: 32x32, full colour, soft tinted outlines, rim light and
// shadow, dot eyes and pink cheeks. Everything is symmetric about x = 15.5, so mirror(x) = 31 - x.
import { deflateSync } from 'node:zlib';

export const W = 32, H = 32;
export const mirror = (x) => 31 - x;

/* ---------- colour ---------- */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return hex(A.map((v, i) => v + (B[i] - v) * t)); };
export const darker = (c, t = 0.25) => mix(c, '#000000', t);
export const lighter = (c, t = 0.3) => mix(c, '#ffffff', t);

/* ---------- canvas ---------- */
export class Cv {
  constructor() { this.px = new Array(W * H).fill(null); }
  set(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && x < W && y >= 0 && y < H) this.px[y * W + x] = c; }
  get(x, y) { return x < 0 || x >= W || y < 0 || y >= H ? null : this.px[y * W + x]; }
  both(x, y, c) { this.set(x, y, c); this.set(mirror(x), y, c); }
}

/* ---------- shapes (sets of y*W+x) ---------- */
const K = (x, y) => y * W + x;
export function ellipse(cx, cy, rx, ry) {
  const m = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    if (dx * dx + dy * dy <= 1) m.add(K(x, y));
  }
  return m;
}
/** Ellipse rotated by deg (clockwise on screen). rx is the half-width, ry the half-height before rotating. */
export function ellipseRot(cx, cy, rx, ry, deg) {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), m = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = x - cx, dy = y - cy, u = dx * c + dy * s, v = -dx * s + dy * c;
    if ((u / rx) ** 2 + (v / ry) ** 2 <= 1) m.add(K(x, y));
  }
  return m;
}
export function rrect(x0, y0, x1, y1, r = 0) {
  const m = new Set();
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const nx = Math.max(x0 + r, Math.min(x, x1 - r)), ny = Math.max(y0 + r, Math.min(y, y1 - r));
    if ((x - nx) ** 2 + (y - ny) ** 2 <= r * r + 0.5) m.add(K(x, y));
  }
  return m;
}
export const union = (...ms) => { const o = new Set(); ms.forEach((m) => m.forEach((k) => o.add(k))); return o; };
export const minus = (a, b) => { const o = new Set(); a.forEach((k) => { if (!b.has(k)) o.add(k); }); return o; };
export const cells = (list) => new Set(list.map(([x, y]) => K(x, y)));
export function mirrored(m) { const o = new Set(m); m.forEach((k) => o.add(K(mirror(k % W), (k / W) | 0))); return o; }
export function poly(fn) { const m = new Set(); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (fn(x, y)) m.add(K(x, y)); return m; }

/* ---------- painting ---------- */
export function paint(cv, m, base, { hi = lighter(base, 0.3), lo = darker(base, 0.22), band = 1, flat = false } = {}) {
  for (const k of m) {
    const x = k % W, y = (k / W) | 0;
    let c = base;
    if (!flat) {
      const isLo = !m.has(k + W * band) || !m.has(k + band);
      const isHi = !m.has(k - W * band) || !m.has(k - band);
      if (isLo && !isHi) c = lo; else if (isHi && !isLo) c = hi;
    }
    cv.set(x, y, c);
  }
}
/** Soft coloured outline: each outline pixel is a dark version of the colour it touches. */
export function outline(cv, ink = '#1b1226', strength = 0.72) {
  const add = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (cv.get(x, y) != null) continue;
    const n = [cv.get(x, y + 1), cv.get(x - 1, y), cv.get(x + 1, y), cv.get(x, y - 1)].find((c) => c != null);
    if (n) add.push([x, y, mix(n, ink, strength)]);
  }
  add.forEach(([x, y, c]) => cv.set(x, y, c));
}
export function tint(cv, target, t) {
  for (let i = 0; i < cv.px.length; i++) if (cv.px[i]) cv.px[i] = mix(cv.px[i], target, t);
}

/* ---------- stamps: little pictures drawn from strings ---------- */
export function stamp(cv, x, y, rows, pal, { flip = false } = {}) {
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    const c = pal[ch]; if (!c) return;
    cv.set(flip ? x + row.length - 1 - i : x + i, y + j, c);
  }));
}
/** A sticker gets its own dark halo so it reads on any background. */
export function sticker(cv, x, y, rows, pal, halo = '#1b1226') {
  const t = new Cv();
  stamp(t, x, y, rows, pal);
  const add = [];
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
    if (t.get(xx, yy) == null && [t.get(xx + 1, yy), t.get(xx - 1, yy), t.get(xx, yy + 1), t.get(xx, yy - 1)].some((c) => c != null)) add.push([xx, yy]);
  }
  add.forEach(([xx, yy]) => { if (cv.get(xx, yy) == null) cv.set(xx, yy, mix(halo, '#ffffff', 0.12)); });
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (t.get(xx, yy) != null) cv.set(xx, yy, t.get(xx, yy));
}

/* ---------- faces ---------- */
const EYES = {
  open:    ['o#', '##', '##'],
  glossy:  ['##', 'o#', '##'],
  blink:   ['###'],
  happy:   ['.#.', '#.#'],
  sleep:   ['#.#', '.#.'],
  alarmed: ['###', '#o#', '###'],
  sick:    ['#.#', '.#.', '#.#'],
};
const BROWS = {
  worried: ['..#', '##.'],
  sad:     ['..#', '.#.', '#..'],
  alarmed: ['#.#'],
  curious: ['.##', '...'],
};
const MOUTHS = {
  smile:   ['#..#', '.##.'],
  open:    ['####', '.pp.'],
  neutral: ['##'],
  frown:   ['.##.', '#..#'],
  wavy:    ['.#.#', '#.#.'],
  oh:      ['##', '##'],
  small:   ['##'],
  tiny:    ['#.'],
};
const sym = (c) => ({ '#': c.ink, o: c.white || '#ffffff', p: c.tongue || '#ff7d9c' });

/** Eyes at left-eye column ex, top row ey, mirrored for the right eye. Eye art is 2 or 3 wide. */
export function eyes(cv, kind, ex, ey, c) {
  const rows = EYES[kind]; const pal = sym(c);
  const w = rows[0].length;
  const x0 = w === 3 ? ex - 1 : ex;
  const y0 = kind === 'blink' ? ey + 1 : kind === 'happy' || kind === 'sleep' ? ey + 1 : ey;
  rows.forEach((row, j) => [...row].forEach((ch, i) => { if (pal[ch]) cv.both(x0 + i, y0 + j, pal[ch]); }));
}
export function brows(cv, kind, ex, ey, c) {
  const rows = BROWS[kind]; if (!rows) return;
  const x0 = ex - 1, y0 = ey - rows.length - (kind === 'curious' ? 0 : 0);
  rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#' || ch === '.' && false) cv.both(x0 + i, y0 + j, c.ink); }));
}
/** Centered mouth: its left edge sits at 16 - width/2 so it is symmetric. */
export function mouth(cv, kind, y, c) {
  const rows = MOUTHS[kind]; const pal = sym(c);
  const w = rows[0].length, x0 = 16 - w / 2;
  rows.forEach((row, j) => [...row].forEach((ch, i) => { if (pal[ch]) cv.set(x0 + i, y + j, pal[ch]); }));
}
export function cheeks(cv, x, y, color) { cv.both(x, y, color); cv.both(x + 1, y, color); }

/* ---------- common mood stickers ---------- */
export const STICKERS = {
  sweat: { rows: ['.b.', 'bwb', 'bwb', '.b.'], pal: { b: '#4fa3ea', w: '#d9f1ff' } },
  tear:  { rows: ['b', 'w', 'b'], pal: { b: '#4fa3ea', w: '#d9f1ff' } },
  zzz:   { rows: ['####', '..#.', '.#..', '####'], pal: { '#': '#9fb4ff' } },
  zz:    { rows: ['###', '.#.', '###'], pal: { '#': '#9fb4ff' } },
  bang:  { rows: ['##', '##', '##', '##', '..', '##'], pal: { '#': '#ff5a5f' } },
  ask:   { rows: ['.##.', '#..#', '..#.', '.#..', '....', '.#..'], pal: { '#': '#ffd166' } },
  heart: { rows: ['.r.r.', 'rrrrr', '.rrr.', '..r..'], pal: { r: '#ff5d8f' } },
  spark: { rows: ['.y.', 'yyy', '.y.'], pal: { y: '#fff0a0' } },
  plaster: { rows: ['.t.', 'ttt', '.t.'], pal: { t: '#f3d3a2' } },
  key:   { rows: ['.gg.....', 'g..gggggg', '.gg..g.g.', '........'], pal: { g: '#ffd24d' } },
};
export function put(cv, name, x, y) { const s = STICKERS[name]; sticker(cv, x, y, s.rows, s.pal); }

/* ---------- tiny 3x5 font for the Nullbot screen ---------- */
export const FONT = {
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'], U: ['#.#', '#.#', '#.#', '#.#', '###'], L: ['#..', '#..', '#..', '#..', '###'],
  E: ['###', '#..', '##.', '#..', '###'], R: ['##.', '#.#', '##.', '#.#', '#.#'], '!': ['.#.', '.#.', '.#.', '...', '.#.'],
  '?': ['##.', '..#', '.#.', '...', '.#.'],
};
export function text(cv, str, x, y, color) {
  let cx = x;
  for (const ch of str) { stamp(cv, cx, y, FONT[ch], { '#': color }); cx += FONT[ch][0].length + 1; }
}

/* ---------- PNG ---------- */
const crcTable = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
export function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) { raw[y * (width * 4 + 1)] = 0; rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
/** Draw a Cv (or {pal,rows}) scaled up into an RGBA buffer at (ox, oy). */
export function blit(buf, bw, cvPixels, scale, ox, oy) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = cvPixels[y * W + x]; if (!c) continue;
    const [r, g, b] = rgb(c);
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      const i = ((oy + y * scale + dy) * bw + ox + x * scale + dx) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    }
  }
}
