// Draft art for seeds (approved pet names with no repo yet), in the one shared pet style.
// Astra asked for it on 2026-10-12 ("generate it if necessary"). Each seed costs one image.
//
//   node scripts/generate-seeds-20261012.mjs              every seed still missing a sheet
//   node scripts/generate-seeds-20261012.mjs skill-scout  just this one
//
// Sheets go to art/seeds/<id>-sheet-20261012.png, kept apart from registered pets' art.
// The shared STYLE and the prompt shape are read from generate-pets.mjs so the family matches.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BRIDGE = process.env.IMAGE_BRIDGE || '../image-bridge/imagine.mjs';
const OUT = 'art/seeds';
const src = readFileSync('scripts/generate-pets.mjs', 'utf8');
const body = src.slice(src.indexOf('const STYLE = [') + 'const STYLE = ['.length, src.indexOf("].join(' ');"));
const STYLE = new Function(`return [${body}]`)().join(' ');
const prompt = (p) => `${STYLE} The character is ${p.what}, in NEON unconventional colours: ${p.colours}. It must clearly read as ${p.what.split(',')[0]}.`;

export const SEEDS = [
  { id: 'osc-sealion', what: 'a plump friendly sea lion sitting upright on its front flippers, with long whiskers, wearing small over-ear headphones', colours: 'electric cobalt-blue body, ice-white belly and whiskers, neon orange headphones' },
  { id: 'piranesi-nessi', what: 'a cute small long-necked lake monster, like a baby Loch Ness monster, with a round head on a long curved neck, a plump body with two small humps and four paddle flippers', colours: 'sea-glass mint body with marble-white spots, dusty gold flippers and belly' },
  { id: 'procreate-panda', what: 'a chubby round panda artist wearing a small beret and holding a drawing stylus', colours: 'white body with charcoal-black ears, eye patches and limbs, hot magenta beret, neon mint stylus' },
  { id: 'platform-platypus', what: 'a cheerful platypus standing upright, with a wide flat duck-like bill, a flat paddle tail and webbed feet, holding a small smartphone', colours: 'deep plum-purple fur, bright banana-yellow bill and feet, neon cyan phone' },
  { id: 'photo-dodo', what: 'a plump round dodo bird with a big hooked beak, tiny stubby wings and a little tuft of tail feathers, wearing a small camera on a strap around its neck', colours: 'soft neon peach body, teal hooked beak, lemon-yellow feet and strap, small black camera' },
  { id: 'video-vulture', what: 'a friendly chubby vulture with a bald round head, a fluffy neck ruff and folded wings, holding a small film clapperboard', colours: 'slate-blue wings and body, bright salmon bald head, cream fluffy neck ruff, neon lime clapperboard' },
  // An original sailor-style girl in the Mommies' design (Astra's own characters), not a copy
  // of any existing character: no buns, no tiara, no borrowed colour scheme.
  { id: 'skill-scout', ref: 'art/sheets/mommys-mommies.png', what: 'ONE single girl ALONE, by herself, with exactly the same character design, face, body and proportions as the girls in the reference image, but drawn LARGE so that she fills her cell from top to bottom like a single-character sprite, about twice the size she is in the reference. She has VERY LONG hair in two long braids that reach her knees, and wears an original sailor-style outfit: a wide sailor collar, a big bow at the chest, a short pleated skirt and ankle boots. She holds a small open notebook', colours: 'bright lavender hair, white top with a deep teal sailor collar and a hot coral bow, deep teal pleated skirt, coral ankle boots' },
];

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
mkdirSync(OUT, { recursive: true });
for (const seed of SEEDS.filter((s) => !only.length || only.includes(s.id))) {
  const sheet = `${OUT}/${seed.id}-sheet-20261012.png`;
  if (existsSync(sheet)) { console.log(`${seed.id}: already has ${sheet}`); continue; }
  const argv = [BRIDGE, prompt(seed), sheet, '--size', '1024x1024', '--quality', 'high'];
  if (seed.ref) argv.push('--ref', seed.ref);
  process.stdout.write(`${seed.id}: generating… `);
  try {
    execFileSync(process.execPath, argv, { stdio: ['ignore', 'pipe', 'pipe'] });
    console.log('done');
  } catch (e) {
    const msg = `${e.stderr || ''}${e.stdout || ''}`.trim() || e.message;
    console.error(`FAILED: ${msg}`);
    if (/billing|quota|insufficient|rate.?limit|429|402/i.test(msg)) { console.error('Stopping: billing or rate limit.'); process.exit(1); }
  }
}
