// Builds every pet's final frames.
//
//   node scripts/build-frames.mjs [ids…] [--size 256] [--colours 24]
//
// For each pet in pets.json: convert its sheet from art/sheets/, draw on any accessories,
// stamp the shared mood indicators, and write nine transparent PNGs to
// art/frames/<id>/<mood>.png. art/frames/index.json records what was built and how.
//
// Why PNG and not the { pal, rows } text the hand-drawn pets used: at the resolution this art
// deserves, text rows are the wrong container. Measured on one pet, nine frames:
//
//     128x128    18 KB as PNG     151 KB as text
//     256x256    50 KB as PNG     ~590 KB as text
//
// Flat colour compresses enormously well, so PNG is about twelve times smaller AND lets the
// art stay at four times the resolution. The whole set is well under a megabyte.
//
// Resolution matters more than it looks: at 64x64 the downsampling was quietly destroying
// detail the generator had drawn correctly. Portfolio Puffer's round spectacles turned into
// speckles and Discord Damsel's tiara vanished into her hair. Both were fine at 256.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, lstatSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sheetToSprite, MOODS } from './sheet-to-sprites.mjs';
import { addIndicators } from './indicators.mjs';
import { ACCESSORIES } from './accessories.mjs';
import { png } from './art-kit.mjs';
import { assetPaths } from './lib.mjs';
import { chipOriginalSprite } from './chip-original-20261008.mjs';

const SHEETS = 'art/sheets';
const OUT = 'art/frames';

/** Refuse recursive removal outside this repository's real art/frames directory. */
export function frameDirectory(id) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) throw new Error(`Invalid frame directory id: ${id}`);
  const root = resolve(fileURLToPath(new URL('../art/frames/', import.meta.url)));
  const dir = resolve(root, id);
  if (dirname(dir) !== root || resolve(OUT) !== root) throw new Error(`Frame directory is outside the intended output: ${dir}`);
  for (const target of [dirname(root), root, dir]) {
    if (!existsSync(target)) continue;
    if (lstatSync(target).isSymbolicLink() || !lstatSync(target).isDirectory() || resolve(realpathSync(target)).toLowerCase() !== target.toLowerCase()) {
      throw new Error(`Refusing a redirected or non-directory frame output: ${target}`);
    }
  }
  return dir;
}

/* Details drawn on afterwards rather than generated.
   Asking the generator for one small addition re-rolls the whole character and the body that
   comes back is not the body that was approved. Portfolio Puffer's round spectacles go on
   here, over the penguin Astra signed off on. */
export const WEARS = { 'portfolio-puffer': ['glasses'] };

/** One frame of { pal, rows } to a transparent PNG. */
function framePng(frame, W, H) {
  const rgba = Buffer.alloc(W * H * 4); // all zero: fully transparent
  frame.rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const hex = frame.pal[ch];
    if (!hex) return;
    const i = (y * W + x) * 4;
    rgba[i] = parseInt(hex.slice(1, 3), 16);
    rgba[i + 1] = parseInt(hex.slice(3, 5), 16);
    rgba[i + 2] = parseInt(hex.slice(5, 7), 16);
    rgba[i + 3] = 255;
  }));
  return png(W, H, rgba);
}

/** Nearest-neighbour enlargement of a small sprite onto a size x size canvas, for the
 *  placeholder path only. The old small conversions were drawn edge to edge, so the
 *  enlargement is kept to about 80% and centred: the same margin a real conversion has,
 *  which the mood badges need and which the tests require. */
function enlarge(sprite, size) {
  const [W, H] = sprite.size;
  const k = Math.max(1, Math.floor((size * 0.8) / Math.max(W, H)));
  const ox = Math.floor((size - W * k) / 2), oy = Math.floor((size - H * k) / 2);
  const blank = '.'.repeat(size);
  const frames = {};
  for (const [mood, f] of Object.entries(sprite.frames)) {
    const rows = Array.from({ length: oy }, () => blank);
    for (const row of f.rows) {
      const wide = '.'.repeat(ox) + [...row].map((c) => c.repeat(k)).join('');
      const line = (wide + blank).slice(0, size);
      for (let i = 0; i < k; i++) rows.push(line);
    }
    while (rows.length < size) rows.push(blank);
    frames[mood] = { pal: f.pal, rows: rows.slice(0, size) };
  }
  return { ...sprite, size: [size, size], frames };
}

const artIds = (registry) => [
  ...(registry.mascots || []).map((m) => m.art),
  ...(registry.pets || []).flatMap((p) => [p.art, ...(p.companions || [])]),
];

export function buildFrames({ size = 256, colours = 24, only = [], log = console.log } = {}) {
  const registry = JSON.parse(readFileSync('pets.json', 'utf8'));
  const registered = artIds(registry);
  const sheetIds = new Map(registered.map((id) => [assetPaths(registry, id).sheet, id]));
  // Earlier dated sheets are references for the same character, not extra pets.
  const sheetId = (file) => sheetIds.get(`${SHEETS}/${file}`)
    || registered.find((id) => file === `${id}.png` || new RegExp(`^${id}-\\d{8}(?:-\\d{6})?\\.png$`).test(file))
    || file.slice(0, -4);
  const ids = [...new Set([
    ...registered,
    ...(existsSync(SHEETS) ? readdirSync(SHEETS).filter((f) => f.endsWith('.png')).map(sheetId) : []),
  ])];
  const previous = existsSync(`${OUT}/index.json`) ? JSON.parse(readFileSync(`${OUT}/index.json`, 'utf8')) : { pets: {} };
  const index = { size, moods: MOODS, pets: {} };
  const missing = [];
  let bytes = 0;

  mkdirSync(OUT, { recursive: true });
  for (const id of ids) {
    const paths = assetPaths(registry, id);
    const sheet = paths.sheet;
    const originalArt = registry.pets.find((p) => p.art === id)?.art_source === 'chip-original-20261008';
    const rebuild = !only.length || only.includes(id);

    // No sheet and not being rebuilt: keep whatever frames are already there.
    if (!rebuild || (!originalArt && !existsSync(sheet) && !existsSync(paths.fallback))) {
      if (previous.pets[id] && MOODS.every((m) => previous.pets[id].frames[m] && existsSync(previous.pets[id].frames[m]))) { index.pets[id] = previous.pets[id]; continue; }
      if (!existsSync(sheet)) { missing.push(id); continue; }
    }

    let sprite, placeholder = false;
    try {
      if (originalArt) {
        sprite = chipOriginalSprite({ size });
      } else if (existsSync(sheet)) {
        sprite = sheetToSprite(readFileSync(sheet), { size, colours });
      } else {
        // The sheet is gone (it happened to the Farmer): fall back to the last small conversion,
        // enlarged. Marked as a placeholder so nobody mistakes it for finished art.
        sprite = enlarge(JSON.parse(readFileSync(paths.fallback, 'utf8')), size);
        placeholder = true;
      }
      for (const name of WEARS[id] || []) sprite = ACCESSORIES[name](sprite);
      sprite = addIndicators(sprite);
    } catch (e) {
      log(`${id}: ${e.message}`);
      missing.push(id);
      continue;
    }

    const [W, H] = sprite.size;
    const dir = frameDirectory(id);
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true }); // never leave a stale mood behind
    mkdirSync(dir, { recursive: true });
    let petBytes = 0;
    for (const mood of MOODS) {
      const buf = framePng(sprite.frames[mood], W, H);
      writeFileSync(paths.frame(mood), buf);
      petBytes += buf.length;
    }
    bytes += petBytes;
    index.pets[id] = {
      size: [W, H],
      frames: Object.fromEntries(MOODS.map((m) => [m, paths.frame(m)])),
      ...(originalArt ? { source: 'scripts/chip-original-20261008.mjs', art_kind: 'original-code' } : existsSync(sheet) ? { sheet } : {}),
      ...(placeholder ? { placeholder: 'Enlarged from an old 64px conversion because its sheet is missing. Regenerate it.' } : {}),
      ...(WEARS[id] ? { wears: WEARS[id] } : {}),
    };
    log(`${id.padEnd(20)} ${W}x${H}  ${(petBytes / 1024).toFixed(0).padStart(4)} KB${placeholder ? '  PLACEHOLDER' : ''}`);
  }

  // Frames for an id that is no longer registered or sheeted are stale: remove them.
  if (existsSync(OUT)) for (const d of readdirSync(OUT, { withFileTypes: true })) {
    if (d.isDirectory() && !index.pets[d.name] && !ids.includes(d.name)) rmSync(frameDirectory(d.name), { recursive: true, force: true });
  }

  writeFileSync(`${OUT}/index.json`, JSON.stringify(index, null, 1) + '\n');
  return { index, missing, bytes };
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('build-frames.mjs')) {
  const args = process.argv.slice(2);
  const flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
  const size = Number(flag('--size', 256)), colours = Number(flag('--colours', 24));
  const only = args.filter((a) => !a.startsWith('--'));
  const { index, missing, bytes } = buildFrames({ size, colours, only });
  console.log(`\n${Object.keys(index.pets).length} pets in art/frames/${bytes ? `, ${(bytes / 1024 / 1024).toFixed(2)} MB written` : ''}.`);
  if (missing.length) { console.error(`No art at all for: ${missing.join(', ')}`); process.exit(1); }
}
