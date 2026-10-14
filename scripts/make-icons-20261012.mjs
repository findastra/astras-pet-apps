// Small icons for pets whose art lives outside this repo's registered frames: pipeline pets
// (art in their own repos), Chat Rat, and seeds (draft art). The System Map and the
// intelligence-levels chart use them. Astra, 2026-10-12.
//
//   node scripts/make-icons-20261012.mjs        fetch or read every source, write art/icons/<id>-20261012.png
//
// Pipeline art is fetched from each pet's public repo on GitHub; seed sheets are read from
// art/seeds/ (generate-seeds-20261012.mjs). A sheet's calm top-left cell becomes the icon.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { decodePng, keyBackground } from './sheet-to-sprites.mjs';
import { png } from './art-kit.mjs';
import { pathToFileURL } from 'node:url';

const SIZE = 96;
const RAW = (repo, path, branch = 'main') => `https://raw.githubusercontent.com/findastra/${repo}/${branch}/${path}`;
const desk = (repo, art = repo) => RAW(repo, `desktop-art/${art}/idle-20261011.png`);
export const SOURCES = {
  // pipeline pets: their own repos
  'spoonfed': desk('spoonfed', 'spoonfed-sugarcube'),
  'claude-bot': desk('claude-bot'),
  'rgbee': desk('rgbee'),
  'mine-mole': RAW('mine-mole', 'draft-art/mine-mole/idle-20261011.png'),
  'mail-snail': desk('mail-snail'),
  'patch-cat': desk('patch-cat'),
  'meme-fiend': desk('meme-fiend'),
  'astras-gif-maker': desk('astras-gif-maker', 'gif-giraffe'),
  'backup-beaver': desk('backup-beaver'),
  'rift-rabbit': desk('rift-rabbit'),
  'fuzzboi-friend': RAW('fuzzboi-friend', 'art/idle-20261009.png'),
  'wifi-butterfly': desk('wifi-butterfly'),
  'deck-duck': desk('deck-duck'),
  'mesh-moth': desk('mesh-moth'),
  'raspberry-berry': desk('raspberry-berry'),
  'chat-rat': desk('chat-rat'),
  // seeds: Pole Puff's approved draft, and the draft sheets made on 2026-10-12
  'pole-puff': RAW('astras-pet-os', 'drafts/pole-puff/art/frames/neutral-20261011.png', 'claude/pole-puff-draft-20261012'),
  'osc-sealion': 'art/seeds/osc-sealion-sheet-20261012.png',
  'piranesi-nessi': 'art/seeds/piranesi-nessi-sheet-20261012.png',
  'procreate-panda': 'art/seeds/procreate-panda-sheet-20261012.png',
  'platform-platypus': 'art/seeds/platform-platypus-sheet-20261012.png',
  'skill-scout': 'art/seeds/skill-scout-sheet-20261012.png',
  'photo-dodo': 'art/seeds/photo-dodo-sheet-20261012.png',
  'video-vulture': 'art/seeds/video-vulture-sheet-20261012.png',
};

SOURCES['closet-cat'] = 'art/seeds/closet-cat-sheet-20261012.png';
// Registered pets: their newest look. That is the October 11 desktop art where it exists (what the
// desktop actually shows, Astra 2026-10-12: "the icons are outdated"), otherwise their mood frames.
const registry = JSON.parse(readFileSync('pets.json', 'utf8'));
const frames = JSON.parse(readFileSync('art/frames/index.json', 'utf8'));
for (const p of registry.pets) {
  const desk = `desktop-art/${p.art}/idle-20261011.png`;
  SOURCES[p.repo] = existsSync(desk) ? desk : frames.pets[p.art]?.frames.idle;
}

export function crop(img, x0, y0, w, h) {
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) out.set(img.rgba.subarray(((y0 + y) * img.width + x0) * 4, ((y0 + y) * img.width + x0 + w) * 4), y * w * 4);
  return { width: w, height: h, rgba: out };
}
/** Make the background transparent unless the image already has transparency. */
export function clearBackground(img) {
  let hasAlpha = false;
  for (let i = 3; i < img.rgba.length; i += 4) if (img.rgba[i] < 250) { hasAlpha = true; break; }
  if (hasAlpha) return img;
  const bg = keyBackground(img, 30);
  const rgba = new Uint8Array(img.rgba);
  for (let i = 0; i < bg.length; i++) if (bg[i]) rgba[i * 4 + 3] = 0;
  return { ...img, rgba };
}
export function trim(img) {
  let x0 = img.width, y0 = img.height, x1 = -1, y1 = -1;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (img.rgba[(y * img.width + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  if (x1 < 0) throw new Error('empty image');
  return crop(img, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
}
/** Nearest-neighbour fit into a SIZE x SIZE transparent square: keeps pixel art crisp. */
function fit(img) {
  const s = Math.min(SIZE / img.width, SIZE / img.height), w = Math.max(1, Math.round(img.width * s)), h = Math.max(1, Math.round(img.height * s));
  const ox = Math.floor((SIZE - w) / 2), oy = SIZE - h; // stand on the bottom edge, like the desktop pets
  const out = Buffer.alloc(SIZE * SIZE * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = Math.min(img.width - 1, Math.floor(x / s)), sy = Math.min(img.height - 1, Math.floor(y / s));
    const si = (sy * img.width + sx) * 4, di = ((oy + y) * SIZE + ox + x) * 4;
    for (let k = 0; k < 4; k++) out[di + k] = img.rgba[si + k];
  }
  return png(SIZE, SIZE, out);
}

export async function load(src) {
  if (/^https?:/.test(src)) { const r = await fetch(src); if (!r.ok) throw new Error(`${r.status} ${src}`); return Buffer.from(await r.arrayBuffer()); }
  if (!existsSync(src)) throw new Error(`missing ${src}`);
  return readFileSync(src);
}

// Run only when called directly; make-tokens-20261014.mjs imports the helpers above.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
mkdirSync('art/icons', { recursive: true });
let made = 0;
for (const [id, src] of Object.entries(SOURCES)) {
  try {
    let img = decodePng(await load(src));
    if (/-sheet-\d{8}\.png$/.test(src)) img = crop(img, 0, 0, Math.floor(img.width / 3), Math.floor(img.height / 3)); // calm neutral cell
    writeFileSync(`art/icons/${id}-20261012.png`, fit(trim(clearBackground(img))));
    made++;
  } catch (e) { console.log(`${id}: skipped (${e.message})`); }
}
console.log(`${made} icons in art/icons/`);
}
