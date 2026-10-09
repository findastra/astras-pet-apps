// The Cage's characters, drawn in code so every pet shares one style and one set of moods.
// DRAFTS for Astra's approval. Chip and the Farmer in particular are best guesses.
import {
  Cv, W, H, mirror, ellipse, ellipseRot, rrect, union, minus, cells, mirrored, poly, paint, outline, tint, stamp, put,
  eyes, brows, mouth, cheeks, text, mix, darker, lighter,
} from './art-kit.mjs';

export const MOODS = ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep'];

/* What each mood does to the standard face. */
const MOOD = {
  idle:    { eyes: 'open',    brow: null,      mouth: 'smile', cheeks: true },
  blink:   { eyes: 'blink',   brow: null,      mouth: 'smile', cheeks: true },
  happy:   { eyes: 'happy',   brow: null,      mouth: 'open',  cheeks: true, st: ['spark'] },
  curious: { eyes: 'open',    brow: null,      mouth: 'small', cheeks: true, st: ['ask'] },
  worried: { eyes: 'glossy',  brow: 'worried', mouth: 'wavy',  cheeks: false, st: ['sweat@tl'] },
  sad:     { eyes: 'glossy',  brow: 'sad',     mouth: 'frown', cheeks: false, tear: true },
  sick:    { eyes: 'sick',    brow: null,      mouth: 'wavy',  cheeks: false, plaster: true, st: ['sweat@tl'] },
  alarmed: { eyes: 'alarmed', brow: 'alarmed', mouth: 'oh',    cheeks: false, st: ['bang'] },
  sleep:   { eyes: 'sleep',   brow: null,      mouth: 'small', cheeks: true, st: ['zzz'] },
};
const TINT = { sick: ['#9cc267', 0.38], sad: ['#7d93d6', 0.16], sleep: ['#8a90cf', 0.12] };
const PINK = '#ff8fb0';
const droop = (mood) => mood === 'sad' || mood === 'sleep' || mood === 'sick';

/** Standard face for creatures with a skin-like face. spec: ex, ey (left eye col/top row), my (mouth row), cx, cy (cheek), tr, tl, pl.
 *  Optional spec.eye colours open eyes (the twins' green and blue, the panther's yellow); spec.line colours closed eyes, brows and mouth. */
function standardFace(cv, mood, spec, ink = '#2a1a2e') {
  const m = MOOD[mood], line = spec.line || ink;
  const openKind = ['open', 'glossy', 'alarmed'].includes(m.eyes);
  const ce = { ink: openKind && spec.eye ? spec.eye : line, white: '#ffffff', tongue: '#ff7d9c' };
  const cl = { ink: line, white: '#ffffff', tongue: '#ff7d9c' };
  eyes(cv, m.eyes, spec.ex, spec.ey, ce);
  if (m.brow) brows(cv, m.brow, spec.ex, spec.ey, cl);
  if (!spec.noMouth) mouth(cv, m.mouth, spec.my, cl);
  if (m.cheeks) cheeks(cv, spec.cx, spec.cy, PINK);
  if (m.tear) for (const y of [spec.ey + 3, spec.ey + 4]) { cv.both(spec.ex, y, y === spec.ey + 3 ? '#4fa3ea' : '#d9f1ff'); }
  if (m.plaster) stamp(cv, spec.pl[0], spec.pl[1], ['.t.', 'ttt', '.t.'], { t: '#f3d3a2' });
  for (const s of m.st || []) {
    const [name, where] = s.split('@');
    const [x, y] = where === 'tl' ? spec.tl : spec.tr;
    put(cv, name, x, y);
  }
}

/* ---------- GitHub Goldfish ---------- */
const goldfish = {
  id: 'goldfish', name: 'GitHub Goldfish', ink: '#3a1a10',
  body(cv, mood) {
    const down = droop(mood);
    paint(cv, poly((x, y) => y >= 22 && y <= 31 && Math.abs(x - 15.5) <= 2 + (y - 22) * 1.0 && !(y >= 29 && Math.abs(x - 15.5) <= (y - 28) * 1.2)), '#ffc266', { hi: '#ffe0a8', lo: '#e89a30' });
    paint(cv, poly((x, y) => y >= 2 && y <= 9 && Math.abs(x - 15.5) <= (y - 2) * 0.62 + 0.6), '#ff8a1c', { hi: '#ffb15c' });
    const fin = down ? ellipse(4.5, 21, 3, 3.5) : ellipse(4.5, 18, 3, 4.5);
    paint(cv, union(fin, mirrored(fin)), '#ffb347', { hi: '#ffd58a' });
    paint(cv, ellipse(15.5, 16.5, 10.5, 10), '#ff9a2e', { hi: '#ffc266', lo: '#e0660f', band: 2 });
    paint(cv, ellipse(15.5, 21, 6, 4), '#ffd9a3', { flat: true });
    for (const [x, y] of [[8, 21], [9, 23], [22, 21], [23, 23], [13, 10], [18, 10]]) cv.set(x, y, '#e8760f');
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 10, ey: 13, my: 18, cx: 8, cy: 16, tr: [25, 1], tl: [2, 3], pl: [20, 8] }, this.ink); },
};

/* ---------- Chip (Data Dealer): a poker-chip character. DRAFT: guessed from the name. ---------- */
const chip = {
  id: 'chip', name: 'Chip', ink: '#3a1018',
  body(cv, mood) {
    paint(cv, ellipse(15.5, 16, 11.5, 11.5), '#dc4a4a', { hi: '#f27d6f', lo: '#a62d3a', band: 2 });
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4, x = 15.5 + Math.cos(a) * 10, y = 16 + Math.sin(a) * 10;
      paint(cv, rrect(Math.round(x - 1), Math.round(y - 1), Math.round(x), Math.round(y), 0), '#fff1d6', { flat: true });
    }
    paint(cv, ellipse(15.5, 16, 7.5, 7.5), '#fff1d6', { hi: '#ffffff', lo: '#f0d3a8' });
    const arm = ellipse(3, 17, 2, 2.5);
    paint(cv, union(arm, mirrored(arm)), '#dc4a4a', { hi: '#f27d6f', lo: '#a62d3a' });
    const foot = rrect(9, 27, 13, 30, 1);
    paint(cv, union(foot, mirrored(foot)), '#a62d3a', { hi: '#c9475a' });
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 13, my: 18, cx: 9, cy: 17, tr: [24, 1], tl: [2, 2], pl: [19, 9] }, this.ink); },
};

/* ---------- API Fairy ---------- */
const fairy = {
  id: 'api-fairy', name: 'API Fairy', ink: '#3a1030',
  body(cv, mood) {
    const down = droop(mood);
    const wing = down ? ellipse(5.5, 19, 3.5, 6.5) : ellipse(4.5, 12, 4, 8);
    paint(cv, union(wing, mirrored(wing)), '#c9f3e6', { hi: '#e9fff8', lo: '#8fd9c0' });
    paint(cv, ellipse(15.5, 12, 10, 9.5), '#ff8fc8', { hi: '#ffb8de', lo: '#d95fa0', band: 2 });
    const lock = rrect(6, 13, 8, 22, 1);
    paint(cv, union(lock, mirrored(lock)), '#e873b3', { hi: '#ff8fc8' });
    paint(cv, ellipse(15.5, 16.5, 8, 7), '#ffe6ef', { hi: '#fff6fa', lo: '#f3b9d0' });
    const bangs = cells([
      ...[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((x) => [x, 10]),
      ...[9, 10, 11, 14, 15, 16, 17, 20, 21, 22].map((x) => [x, 11]),
      [9, 12], [22, 12],
    ]);
    paint(cv, bangs, '#ff8fc8', { hi: '#ffb8de', lo: '#d95fa0' });
    paint(cv, poly((x, y) => y >= 24 && y <= 28 && Math.abs(x - 15.5) <= 3.5 + (y - 24) * 0.7), '#ff9fd0', { hi: '#ffc2e3', lo: '#d6639f' });
    for (const [x, y] of [[13, 29], [14, 29]]) cv.both(x, y, '#ffe6ef');
    cv.both(22, 5, '#8fe8c8'); cv.both(23, 5, '#8fe8c8');
  },
  face(cv, mood) {
    standardFace(cv, mood, { ex: 11, ey: 15, my: 20, cx: 9, cy: 19, tr: [26, 0], tl: [1, 3], pl: [20, 11] }, this.ink);
    if (mood === 'alarmed') put(cv, 'key', 22, 24);
  },
};

/* ---------- Friendly Farmer: host, manager and auditor of Astra's Pet Apps (astras-pet-apps). DRAFT. ---------- */
const farmer = {
  id: 'farmer', name: 'Friendly Farmer', ink: '#3a2010',
  body(cv, mood) {
    const sideburn = rrect(7, 12, 8, 17, 1);
    paint(cv, union(sideburn, mirrored(sideburn)), '#b5651d', { hi: '#d98b3a' });
    paint(cv, ellipse(15.5, 16, 8, 7.5), '#ffd9b3', { hi: '#ffe9d1', lo: '#e8b184' });
    // overalls over a red shirt
    const arm = ellipse(7, 26.5, 2.6, 2.6);
    paint(cv, union(arm, mirrored(arm)), '#d8473f', { hi: '#f06d62', lo: '#a82f2c' });
    paint(cv, rrect(10, 24, 21, 29, 2), '#d8473f', { hi: '#f06d62', lo: '#a82f2c' });
    paint(cv, rrect(11, 26, 20, 29, 1), '#4a7fd1', { hi: '#74a3ee', lo: '#2f5aa3' });
    for (const x of [11, 12]) cv.both(x, 25, '#4a7fd1');
    cv.set(14, 27, '#ffd24d'); cv.set(17, 27, '#ffd24d');
    const boot = rrect(11, 30, 14, 31, 0);
    paint(cv, union(boot, mirrored(boot)), '#7a4a2a', { hi: '#9a6a44' });
    // straw hat
    paint(cv, ellipse(15.5, 9.5, 12.5, 3), '#f2c75c', { hi: '#ffe28f', lo: '#c9962f' });
    paint(cv, rrect(9, 2, 22, 9, 3), '#f2c75c', { hi: '#ffe28f', lo: '#c9962f' });
    paint(cv, rrect(9, 7, 22, 8, 0), '#d8473f', { flat: true });
    // clipboard: he audits
    paint(cv, rrect(23, 23, 27, 29, 0), '#fff6e0', { hi: '#ffffff', lo: '#e0d2ae' });
    cv.set(24, 23, '#7a4a2a'); cv.set(25, 23, '#7a4a2a'); cv.set(26, 23, '#7a4a2a');
    for (const y of [25, 27]) { cv.set(24, y, '#7ab87a'); cv.set(25, y, '#a8a08a'); cv.set(26, y, '#a8a08a'); }
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 14, my: 19, cx: 9, cy: 18, tr: [26, 0], tl: [1, 2], pl: [21, 14] }, this.ink); },
};

/* ---------- Nullbot: stands on the Cage. DRAFT, my own drawing in the same style. ---------- */
const SCREEN = {
  idle: '#ff4a4a', blink: '#a02a2a', happy: '#7dff9e', curious: '#6ee7ff', worried: '#ffc247',
  sad: '#6fa8ff', sick: '#cfe8cf', alarmed: '#ff4a4a', sleep: '#4a5280',
};
const nullbot = {
  id: 'nullbot', name: 'Nullbot', ink: '#14162a',
  body(cv, mood) {
    const d = droop(mood);
    paint(cv, rrect(5, 8, 26, 26, 4), '#454a6e', { hi: '#6a70a0', lo: '#2c3050' });
    const arm = rrect(2, d ? 17 : 14, 4, d ? 23 : 20, 1);
    paint(cv, union(arm, mirrored(arm)), '#454a6e', { hi: '#6a70a0', lo: '#2c3050' });
    const leg = rrect(9, 27, 13, 30, 1);
    paint(cv, union(leg, mirrored(leg)), '#2c3050', { hi: '#454a6e' });
    cv.set(9, 24, '#ff5a5f'); cv.set(11, 24, '#ffd166'); cv.set(20, 24, '#7ee787'); cv.set(22, 24, '#6ee7ff');
    // antenna: curly cord and a bulb that droops when it is unhappy
    const cord = d ? [[16, 7], [17, 6], [18, 6], [19, 7], [19, 8]] : [[16, 7], [16, 6], [15, 5], [15, 4], [16, 3], [17, 3]];
    for (const [x, y] of cord) cv.set(x, y, '#8a90b8');
    const bulb = d ? [20, 9] : [18, 2];
    const bulbCol = { sad: '#4a6aa8', sick: '#7a9a7a', sleep: '#3a4068', alarmed: '#ff4a4a', happy: '#7dff9e', worried: '#ffc247' }[mood] || '#6ee7ff';
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) cv.set(bulb[0] + dx, bulb[1] + dy, bulbCol);
    this._tintMood = mood;
  },
  face(cv, mood) {
    const bg = mood === 'sleep' ? '#0c0e18' : '#080a14';
    paint(cv, rrect(7, 10, 24, 21, 2), '#1a1c2e', { flat: true });
    paint(cv, rrect(8, 11, 23, 20, 1), bg, { flat: true });
    const col = SCREEN[mood];
    const c = { ink: col, white: '#ffffff', tongue: col };
    if (mood === 'idle') text(cv, 'NULL', 8, 13, col);
    else if (mood === 'blink') { text(cv, 'NULL', 8, 13, col); for (let x = 8; x <= 23; x++) cv.set(x, 15, bg); }
    else if (mood === 'sick') {
      let s = 7; const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
      for (let y = 11; y <= 20; y++) for (let x = 8; x <= 23; x++) if (rnd() < 0.3) cv.set(x, y, rnd() < 0.5 ? '#2a4a2e' : '#587a58');
      eyes(cv, 'sick', 11, 13, c); mouth(cv, 'wavy', 17, c);
    } else {
      const m = MOOD[mood];
      eyes(cv, m.eyes, 11, 13, c);
      if (m.brow && mood !== 'alarmed') brows(cv, m.brow, 11, 13, c);
      mouth(cv, m.mouth, mood === 'alarmed' ? 17 : 17, c);
      if (m.tear) { cv.both(11, 16, '#4fa3ea'); }
    }
    const m = MOOD[mood];
    for (const s of m.st || []) { const [name, where] = s.split('@'); const [x, y] = where === 'tl' ? [1, 3] : [26, 1]; put(cv, name, x, y); }
  },
};

/* ---------- Unity Unicorn ---------- */
const unicorn = {
  id: 'unity-unicorn', name: 'Unity Unicorn', ink: '#3a2058',
  body(cv, mood) {
    const tail = ellipse(26, 27, 2.6, 3);
    paint(cv, tail, '#b58cff', { hi: '#d4b8ff' });
    // rainbow mane: layered tufts at the sides
    for (const [col, cx, cy, rx, ry] of [['#ff7eb6', 4.5, 15, 3, 7], ['#ffb86b', 5, 17, 2.4, 5.5], ['#7ee0a8', 5.5, 19, 1.8, 4]]) {
      const m = ellipse(cx, cy, rx, ry);
      paint(cv, union(m, mirrored(m)), col, { hi: lighter(col, 0.3), lo: darker(col, 0.15) });
    }
    paint(cv, rrect(9, 24, 22, 29, 2), '#f4f0ff', { hi: '#ffffff', lo: '#cfc4ee' });
    const hoof = rrect(10, 30, 13, 31, 0);
    paint(cv, union(hoof, mirrored(hoof)), '#b58cff', { hi: '#d4b8ff' });
    const ear = poly((x, y) => y >= 3 && y <= 8 && Math.abs(x - 10.5) <= (y - 3) * 0.5 + 0.5);
    paint(cv, union(ear, mirrored(ear)), '#f4f0ff', { hi: '#ffffff', lo: '#cfc4ee' });
    paint(cv, ellipse(15.5, 15, 9, 8), '#f4f0ff', { hi: '#ffffff', lo: '#cfc4ee' });
    paint(cv, poly((x, y) => y >= 0 && y <= 7 && Math.abs(x - 15.5) <= (y + 0.5) * 0.28 + 0.4), '#ffd24d', { hi: '#fff0a0', lo: '#d9a52a' });
    cv.set(15, 3, '#d9a52a'); cv.set(16, 5, '#d9a52a');
    const fore = cells([[14, 8], [15, 8], [16, 8], [17, 8], [14, 9], [17, 9]]);
    paint(cv, fore, '#ff7eb6', { hi: '#ffa6cf' });
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 14, my: 19, cx: 9, cy: 18, tr: [26, 0], tl: [1, 2], pl: [21, 9] }, this.ink); },
};

/* ---------- Python Panther: attached to Learn Python. Python's blue and yellow on dark fur. ---------- */
const panther = {
  id: 'python-panther', name: 'Python Panther', ink: '#0b1020',
  body(cv, mood) {
    const d = droop(mood);
    const tail = cells(d ? [[24, 29], [25, 29], [26, 28], [27, 27], [27, 26], [26, 26]] : [[24, 27], [25, 27], [26, 26], [27, 25], [27, 24], [27, 23], [26, 22], [25, 22], [26, 23], [26, 24]]);
    paint(cv, tail, '#2d3a5a', { hi: '#4a5b86', lo: '#1b2338' });
    paint(cv, ellipse(15.5, 25.5, 8, 5), '#2d3a5a', { hi: '#4a5b86', lo: '#1b2338' });
    const paw = ellipse(11.5, 29.2, 2.8, 1.8);
    paint(cv, union(paw, mirrored(paw)), '#46567f', { hi: '#6a7aa8', lo: '#2a3556' });
    const ear = poly((x, y) => y >= 3 && y <= 9 && Math.abs(x - 9.5) <= (y - 3) * 0.55 + 0.6);
    paint(cv, union(ear, mirrored(ear)), '#2d3a5a', { hi: '#4a5b86', lo: '#1b2338' });
    const inner = poly((x, y) => y >= 5 && y <= 8 && Math.abs(x - 9.5) <= (y - 5) * 0.35 + 0.3);
    paint(cv, union(inner, mirrored(inner)), '#ff9fb8', { flat: true });
    paint(cv, ellipse(15.5, 14.5, 9.5, 8.5), '#2d3a5a', { hi: '#4a5b86', lo: '#1b2338', band: 2 });
    paint(cv, ellipse(15.5, 18.5, 4.8, 3.2), '#5a6a95', { hi: '#7e8eb8', lo: '#3c4a73' });
    cv.both(15, 17, '#ff8fb0');
    paint(cv, rrect(10, 22, 21, 23, 0), '#ffd43b', { hi: '#ffe887', lo: '#d9b32a' });
    paint(cv, rrect(15, 24, 16, 25, 0), '#4b8bbe', { flat: true });
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 10, ey: 12, my: 19, cx: 7, cy: 16, eye: '#ffd43b', line: '#ffe887', tr: [26, 0], tl: [1, 1], pl: [20, 8] }, this.ink); },
};

/* ---------- Astra Wisp: the pet for VRChat AI Astra ---------- */
const wisp = {
  id: 'astra-wisp', name: 'Astra Wisp', ink: '#1c1244',
  body(cv, mood) {
    const d = droop(mood);
    paint(cv, ellipse(15.5, d ? 26 : 27, 4, d ? 2.5 : 3), '#a58cff', { hi: '#cbb9ff' });
    paint(cv, poly((x, y) => y >= 24 && y <= 30 && Math.abs(x - 15.5) <= 1.2 + (30 - y) * 0.3), '#8a6bff', { hi: '#b09cff' });
    paint(cv, ellipse(15.5, 16.5, 10, 9.5), '#7b5cff', { hi: '#a58cff', lo: '#4a35b0', band: 2 });
    paint(cv, rrect(7, 12, 24, 19, 2), '#1d1a3a', { flat: true });
    // star on top
    const star = cells([[15, 1], [16, 1], [14, 2], [15, 2], [16, 2], [17, 2], [12, 3], [13, 3], [14, 3], [15, 3], [16, 3], [17, 3], [18, 3], [19, 3], [14, 4], [15, 4], [16, 4], [17, 4], [13, 5], [14, 5], [17, 5], [18, 5]]);
    paint(cv, star, '#ffe27a', { hi: '#fff3b8', lo: '#e0b030' });
  },
  // One shared face like every other pet, so the eyes read as the same creature family.
  // She used to hand-roll this: glossy collapsed to open and she had no brows at all, which
  // left worried, sad and alarmed with no expression. "eye" and "line" keep her glow on the
  // dark visor, where the house ink would be invisible.
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 13, my: 21, cx: 8, cy: 20, eye: '#5ff0ff', line: '#7fd8ff', tr: [26, 0], tl: [1, 4], pl: [20, 8] }, this.ink); },
};

/* ---------- Health Hummy: a hummingbird (guess from the name) ---------- */
const hummy = {
  id: 'health-hummy', name: 'Health Hummy', ink: '#0c3a26',
  body(cv, mood) {
    const d = droop(mood);
    const wing = d ? ellipseRot(5, 21, 2.6, 6, 38) : ellipseRot(4, 14, 2.6, 7.5, -58);
    paint(cv, union(wing, mirrored(wing)), '#bff2d4', { hi: '#e6fff1', lo: '#7fd1a4' });
    paint(cv, poly((x, y) => y >= 25 && y <= 30 && Math.abs(x - 15.5) <= 1 + (y - 25) * 0.8 && !(y >= 29 && Math.abs(x - 15.5) <= 0.8)), '#1f8f58', { hi: '#35c27a' });
    paint(cv, ellipse(15.5, 17, 8.5, 8.5), '#35c27a', { hi: '#6be3a0', lo: '#1f8f58', band: 2 });
    paint(cv, ellipse(15.5, 21.5, 5, 3.5), '#fff3d9', { flat: true });
    stamp(cv, 14, 20, ['r.r', 'rrr', '.r.'], { r: '#e8434f' });
    const beak = rrect(15, 17, 16, 21, 0);
    paint(cv, beak, '#ffb347', { hi: '#ffd58a', lo: '#d98a1a' });
    cv.set(15, 21, '#d98a1a'); cv.set(16, 21, '#d98a1a');
    paint(cv, ellipse(15.5, 22.5, 2.5, 1.2), '#e8434f', { flat: true });
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 12, my: 99, cx: 9, cy: 16, noMouth: true, tr: [26, 0], tl: [1, 1], pl: [20, 8] }, this.ink); },
};

/* ---------- Finance Finch: a yellow canary ---------- */
const finch = {
  id: 'finance-finch', name: 'Finance Finch', ink: '#4a3000',
  body(cv, mood) {
    const d = droop(mood);
    const leg = rrect(12, 27, 13, 30, 0);
    paint(cv, union(leg, mirrored(leg)), '#ff9a2e', { hi: '#ffc266' });
    for (const x of [11, 12, 13]) cv.both(x, 31, '#ff9a2e');
    paint(cv, cells([[14, 3], [15, 2], [16, 2], [17, 3], [15, 4], [16, 4], [14, 4], [17, 4], [15, 5], [16, 5]]), '#ffe14d', { hi: '#fff08a', lo: '#e0b520' });
    const wing = d ? ellipse(4.5, 22, 3, 4.5) : ellipse(4.5, 20, 3, 4.5);
    paint(cv, union(wing, mirrored(wing)), '#f5c81f', { hi: '#ffe14d', lo: '#c99a0a' });
    paint(cv, ellipse(15.5, 16.5, 10.5, 10), '#ffe14d', { hi: '#fff08a', lo: '#e0b520', band: 2 });
    paint(cv, ellipse(15.5, 22, 6, 4), '#fff4b0', { flat: true });
    paint(cv, rrect(14, 17, 17, 19, 0), '#ff9a2e', { hi: '#ffc266', lo: '#d96f10' });
    paint(cv, ellipse(26.5, 24, 2.5, 2.5), '#ffd24d', { hi: '#fff0a0', lo: '#c99a0a' });
    cv.set(26, 24, '#c99a0a'); cv.set(27, 24, '#c99a0a');
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 10, ey: 12, my: 99, cx: 8, cy: 16, noMouth: true, tr: [25, 0], tl: [1, 2], pl: [20, 8] }, this.ink); },
};

/* ---------- Mommy's twins, after the mascots on the Mommy's website ---------- */
function twin({ id, name, hair, hair2, horns, eye }) {
  return {
    id, name, ink: '#3a1030',
    body(cv, mood) {
      const lock = rrect(5, 12, 7, 27, 1);
      paint(cv, union(lock, mirrored(lock)), hair2, { hi: lighter(hair2, 0.25), lo: darker(hair2, 0.18) });
      paint(cv, poly((x, y) => y >= 22 && y <= 29 && Math.abs(x - 15.5) <= 4.4 + (y - 22) * 0.75), '#ff2e7e', { flat: true });
      paint(cv, poly((x, y) => y >= 23 && y <= 28 && Math.abs(x - 15.5) <= 3.5 + (y - 23) * 0.75), '#fff6fb', { hi: '#ffffff', lo: '#f0d4e4' });
      const shoe = rrect(12, 30, 14, 31, 0);
      paint(cv, union(shoe, mirrored(shoe)), '#ff8fd0', { hi: '#ffb8e3' });
      paint(cv, ellipse(15.5, 12, 10, 9.5), hair, { hi: lighter(hair, 0.28), lo: darker(hair, 0.18), band: 2 });
      paint(cv, ellipse(15.5, 15.5, 8, 7.2), '#f9d8c4', { hi: '#ffe7d6', lo: '#e5b8a2' });
      const bangs = cells([
        ...[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((x) => [x, 9]),
        ...[8, 9, 10, 11, 12, 15, 16, 19, 20, 21, 22, 23].map((x) => [x, 10]),
        [8, 11], [9, 11], [22, 11], [23, 11], [8, 12], [23, 12],
      ]);
      paint(cv, bangs, hair, { hi: lighter(hair, 0.28), lo: darker(hair, 0.18) });
      if (horns) {
        const horn = cells([[9, 7], [10, 7], [8, 6], [9, 6], [8, 5], [9, 5], [8, 4], [9, 4], [9, 3]]);
        paint(cv, union(horn, mirrored(horn)), '#fff6fb', { hi: '#ffffff', lo: '#ff8fd0' });
      }
    },
    face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 14, my: 19, cx: 9, cy: 18, eye, tr: [26, 0], tl: [1, 2], pl: [21, 11] }, this.ink); },
  };
}
const twinAstra = twin({ id: 'mommys-astra', name: "Astra (Mommy's twin)", hair: '#edeaf6', hair2: '#c9cce8', horns: false, eye: '#2fd6a0' });
const twinDevilish = twin({ id: 'mommys-devilish', name: "Devilish (Mommy's twin)", hair: '#2a1330', hair2: '#5b2a66', horns: true, eye: '#3fa8ff' });

/* ---------- Paper Girl: the science discovery desk. Mauve and pink, a folded paper hat, a rolled paper. ---------- */
const paperGirl = {
  id: 'paper-girl', name: 'Paper Girl', ink: '#2a1830',
  body(cv, mood) {
    const bob = rrect(6, 12, 8, 20, 2);
    paint(cv, union(bob, mirrored(bob)), '#7a5a78', { hi: '#9a789a', lo: '#533a52' });
    paint(cv, rrect(24, 22, 27, 29, 1), '#fff6fb', { hi: '#ffffff', lo: '#e0d0e0' });
    for (const [x, y] of [[25, 24], [26, 24], [25, 26], [26, 27]]) cv.set(x, y, '#c2aab9');
    cv.set(24, 25, '#efa9c5'); cv.set(27, 25, '#efa9c5');
    paint(cv, poly((x, y) => y >= 23 && y <= 29 && Math.abs(x - 15.5) <= 3.6 + (y - 23) * 0.7), '#efa9c5', { hi: '#ffcfe0', lo: '#c77e9e' });
    cv.both(14, 23, '#fff6fb'); cv.both(15, 23, '#fff6fb');
    const shoe = rrect(12, 30, 14, 31, 0);
    paint(cv, union(shoe, mirrored(shoe)), '#68485f', { hi: '#8a6680' });
    paint(cv, ellipse(15.5, 12.5, 9.5, 9), '#7a5a78', { hi: '#9a789a', lo: '#533a52', band: 2 });
    paint(cv, ellipse(15.5, 16, 7.6, 6.8), '#ffe3d6', { hi: '#fff0e8', lo: '#efbfae' });
    const bangs = cells([...[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((x) => [x, 10]), ...[8, 9, 10, 12, 13, 18, 19, 21, 22, 23].map((x) => [x, 11]), [8, 12], [23, 12]]);
    paint(cv, bangs, '#7a5a78', { hi: '#9a789a', lo: '#533a52' });
    // folded paper hat with a pink band
    paint(cv, poly((x, y) => y >= 2 && y <= 8 && Math.abs(x - 15.5) <= 3 + (y - 2) * 1.0), '#fff6fb', { hi: '#ffffff', lo: '#e0d0e0' });
    paint(cv, rrect(8, 8, 23, 9, 0), '#efa9c5', { flat: true });
    cv.set(15, 4, '#d9c4d6'); cv.set(16, 5, '#d9c4d6'); cv.set(15, 6, '#d9c4d6');
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 14, my: 19, cx: 9, cy: 18, tr: [27, 0], tl: [1, 2], pl: [20, 12] }, this.ink); },
};

/* ---------- File Master: a manila folder creature that never deletes anything.
   Drawn as a real folder: back panel, a tab on the left, filed papers peeking over the
   top, and a front panel with a crisp fold line. The face lives on the front panel. ---------- */
const fileMaster = {
  id: 'file-master', name: 'File Master', ink: '#4a2e10',
  body(cv, mood) {
    const d = droop(mood);
    // back panel of the folder
    paint(cv, rrect(4, 8, 27, 28, 1), '#e0ae58', { hi: '#f6cf86', lo: '#b4832c', band: 2 });
    // the tab, top left: the thing that makes it read as a folder and not a box
    paint(cv, rrect(4, 4, 12, 9, 1), '#e0ae58', { hi: '#f6cf86', lo: '#b4832c' });
    paint(cv, rrect(6, 6, 11, 7, 0), '#fff6e0', { flat: true });
    for (const x of [7, 8, 9, 10]) cv.set(x, 6, '#4a7fd1');
    // filed papers peeking over the top edge
    paint(cv, rrect(14, 5, 24, 14, 0), '#ffffff', { hi: '#ffffff', lo: '#d8d2e4' });
    paint(cv, rrect(13, 3, 22, 14, 0), '#fdf8ec', { hi: '#ffffff', lo: '#ddd6c6' });
    for (const y of [5, 7]) for (let x = 15; x <= 20; x++) cv.set(x, y, '#b9b2c8');
    // front panel, with a hard fold line along its top
    paint(cv, rrect(4, 13, 27, 28, 1), '#f7cd7e', { hi: '#ffe6ac', lo: '#cf9c3e', band: 2 });
    for (let x = 5; x <= 26; x++) cv.set(x, 13, '#c7922f');
    const arm = ellipse(2.5, d ? 22 : 19, 2, 2.6);
    paint(cv, union(arm, mirrored(arm)), '#e0ae58', { hi: '#f6cf86', lo: '#b4832c' });
    const foot = rrect(9, 29, 13, 31, 1);
    paint(cv, union(foot, mirrored(foot)), '#b4832c', { hi: '#d2a04a' });
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 17, my: 22, cx: 8, cy: 21, tr: [27, 0], tl: [1, 10], pl: [21, 17] }, this.ink); },
};

/* ---------- Role Fairy: Mommy's role picker. Wings in the role colours. ---------- */
const roleFairy = {
  id: 'role-fairy', name: 'Role Fairy', ink: '#2a1a4a',
  body(cv, mood) {
    const d = droop(mood);
    const up = d ? ellipse(5.5, 20, 3.2, 6) : ellipseRot(5, 9, 4, 7, -35);
    paint(cv, union(up, mirrored(up)), '#568bff', { hi: '#8fb2ff', lo: '#3866c9' });
    const lo = d ? ellipse(8, 22, 2.4, 4) : ellipseRot(6, 19, 3, 5, 25);
    paint(cv, union(lo, mirrored(lo)), '#f59ac2', { hi: '#ffc2dc', lo: '#c9689a' });
    const lock = rrect(6, 13, 8, 21, 1);
    paint(cv, union(lock, mirrored(lock)), '#9a6fd8', { hi: '#b184ed' });
    paint(cv, ellipse(15.5, 12, 9.5, 9), '#b184ed', { hi: '#cfaeff', lo: '#8a5fc8', band: 2 });
    paint(cv, ellipse(15.5, 16.5, 7.8, 7), '#ffe6ef', { hi: '#fff6fa', lo: '#f3b9d0' });
    const bangs = cells([...[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((x) => [x, 10]), ...[8, 9, 10, 14, 15, 16, 17, 21, 22, 23].map((x) => [x, 11]), [8, 12], [23, 12]]);
    paint(cv, bangs, '#b184ed', { hi: '#cfaeff', lo: '#8a5fc8' });
    paint(cv, cells([[15, 2], [16, 2], [14, 3], [15, 3], [16, 3], [17, 3], [13, 4], [14, 4], [15, 4], [16, 4], [17, 4], [18, 4]]), '#fff2ad', { hi: '#fffbd8', lo: '#e0c850' });
    paint(cv, poly((x, y) => y >= 24 && y <= 29 && Math.abs(x - 15.5) <= 3.5 + (y - 24) * 0.7), '#a7dfff', { hi: '#d4f0ff', lo: '#6fb4dc' });
    cv.both(13, 29, '#ffe6ef'); cv.both(14, 29, '#ffe6ef');
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 15, my: 20, cx: 9, cy: 19, tr: [26, 0], tl: [1, 3], pl: [20, 12] }, this.ink); },
};

/* ---------- Discord Damsel: manages the Discord presence apps and others. Blurple hennin and a veil. ---------- */
const damsel = {
  id: 'discord-damsel', name: 'Discord Damsel', ink: '#1c2060',
  body(cv, mood) {
    paint(cv, poly((x, y) => x >= 16 && x <= 29 && y >= (x - 16) * 0.55 + 1 && y <= (x - 16) * 0.55 + 4), '#e8e4ff', { hi: '#ffffff', lo: '#b8b0f0' });
    const braid = rrect(6, 14, 8, 26, 1);
    paint(cv, union(braid, mirrored(braid)), '#e8c45a', { hi: '#f5d77a', lo: '#b8923a' });
    paint(cv, poly((x, y) => y >= 23 && y <= 29 && Math.abs(x - 15.5) <= 3.8 + (y - 23) * 0.75), '#5865f2', { hi: '#8c95ff', lo: '#3a44c4' });
    cv.both(14, 23, '#ffffff'); cv.both(15, 23, '#ffffff');
    const shoe = rrect(12, 30, 14, 31, 0);
    paint(cv, union(shoe, mirrored(shoe)), '#3a44c4', { hi: '#5865f2' });
    paint(cv, ellipse(15.5, 14, 9.5, 8.5), '#f5d77a', { hi: '#fff0a8', lo: '#c9a43a', band: 2 });
    paint(cv, ellipse(15.5, 16.5, 7.6, 6.6), '#ffe3d6', { hi: '#fff0e8', lo: '#efbfae' });
    const bangs = cells([...[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((x) => [x, 11]), ...[8, 9, 10, 13, 14, 17, 18, 21, 22, 23].map((x) => [x, 12]), [8, 13], [23, 13]]);
    paint(cv, bangs, '#f5d77a', { hi: '#fff0a8', lo: '#c9a43a' });
    paint(cv, poly((x, y) => y >= 0 && y <= 10 && Math.abs(x - 15.5) <= y * 0.55 + 0.5), '#5865f2', { hi: '#8c95ff', lo: '#3a44c4' });
    paint(cv, rrect(9, 10, 22, 10, 0), '#ffffff', { flat: true });
  },
  face(cv, mood) { standardFace(cv, mood, { ex: 11, ey: 15, my: 20, cx: 9, cy: 19, eye: '#5865f2', tr: [26, 4], tl: [1, 4], pl: [20, 13] }, this.ink); },
};

export const PETS = [nullbot, farmer, goldfish, chip, fairy, unicorn, panther, wisp, hummy, finch, twinAstra, twinDevilish, paperGirl, fileMaster, roleFairy, damsel];

export function render(def, mood) {
  const cv = new Cv();
  def.body(cv, mood);
  outline(cv, def.ink);
  const t = TINT[mood];
  if (t) tint(cv, t[0], t[1]);
  def.face(cv, mood);
  return cv;
}

const SYMS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
/** Cv -> { pal, rows } with '.' for empty. */
export function pack(cv) {
  const pal = {}, idx = new Map();
  const rows = [];
  for (let y = 0; y < H; y++) {
    let row = '';
    for (let x = 0; x < W; x++) {
      const c = cv.get(x, y);
      if (!c) { row += '.'; continue; }
      if (!idx.has(c)) { const s = SYMS[idx.size]; if (!s) throw new Error('too many colours in one frame'); idx.set(c, s); pal[s] = c; }
      row += idx.get(c);
    }
    rows.push(row);
  }
  return { pal, rows };
}

export function allSprites() {
  const out = {};
  for (const def of PETS) {
    out[def.id] = { name: def.name, frames: Object.fromEntries(MOODS.map((m) => [m, pack(render(def, m))])) };
  }
  return out;
}
