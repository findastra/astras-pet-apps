// Generates a 3x3 mood sheet for every pet, then converts each one into the Cage's sprite format.
//
//   node scripts/generate-pets.mjs                 everything still missing
//   node scripts/generate-pets.mjs goldfish chip   just these
//   node scripts/generate-pets.mjs --dry           print the prompts, generate nothing
//   node scripts/generate-pets.mjs --force         redo sheets that already exist
//   node scripts/generate-pets.mjs <ids> --match   redo them, holding the body they already have
//
// --match is the safe way to redo a pet whose art is approved. A plain regeneration re-rolls
// the character and the body comes back different (this is how the penguin got slimmer once).
// --match keeps a copy of the pet's current sheet and feeds it back as the reference image, so
// the model redraws the expressions around the body that already exists.
//
// Each pet costs one image. Sheets already on disk are skipped, so this is safe to re-run
// after a failure. It stops on the first billing or rate-limit error rather than burning
// through the rest of the list.
//
// Needs the image bridge (../image-bridge/imagine.mjs) and OPENAI_API_KEY. Override the
// bridge location with IMAGE_BRIDGE=/path/to/imagine.mjs.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { sheetToSprite } from './sheet-to-sprites.mjs';
import { assetPaths } from './lib.mjs';

const BRIDGE = process.env.IMAGE_BRIDGE || '../image-bridge/imagine.mjs';
const SHEETS = 'art/sheets';
const OUT = 'art/generated';

/* One shared style. Everything that makes the pets a family lives here; everything that makes
   them tell apart lives in the per-pet line below. The mood symbols (? ! Z tear sweat bandage)
   are deliberately banned: they are composited afterwards from the one shared sticker set in
   art-kit.mjs, so they are pixel-identical on every pet instead of redrawn nine hundred ways. */
const STYLE = [
  'A 3x3 grid sprite sheet of the SAME pixel-art character shown nine times with nine facial expressions.',
  'VERY FINE pixel art with SMALL pixels, high pixel density, roughly 80 pixels tall per sprite, polished SNES-era detail.',
  'Flat solid colours, crisp hard pixel edges, no anti-aliasing, no gradients, no dithering, no 3D shading, no soft rendering.',
  'CRITICAL: every sprite has a solid BLACK outline exactly one pixel thick tracing the entire outside silhouette.',
  'The background is PLAIN SOLID MEDIUM GREY, completely uniform, so the black outline is clearly visible. Never a black background.',
  'Simple dot eyes with a single white highlight pixel, small pink blush cheeks, friendly and cute.',
  'Identical body, identical colours, identical size and identical centred pose in every cell - ONLY the facial expression changes.',
  'Nine cells, left to right then top to bottom: calm neutral, eyes closed, big happy smile, curious, worried, sad, unwell, shocked, asleep.',
  // "curious" was the one mood that kept going wrong: the model reads it as a head tilt or a
  // sideways glance, which at sprite size turns into one lopsided or misshapen eye. The
  // expression has to come from the brows and the mouth, never from the eyes themselves.
  'IMPORTANT for the curious cell: both eyes stay exactly the same shape, the same size and perfectly symmetric, looking straight ahead, identical to the calm neutral cell. Show curiosity ONLY with a slightly raised eyebrow and a small open mouth. Never tilt the head, never draw a sideways glance, never make one eye larger than the other.',
  'In every cell both eyes must match each other in shape and size unless the pose is winking.',
  'Do NOT draw any symbols, letters, punctuation, question marks, exclamation marks, Z letters, tears, sweat drops or bandages anywhere. Face only.',
  'Evenly spaced 3x3 grid, no grid lines, no borders, no text, no labels, no numbers, no shadows.',
].join(' ');

// NEON, deliberately unnatural colours. No two pets share a palette: that is the thing that
// makes them tell apart at sprite size, more than the silhouette does.
export const PETS = [
  { id: 'farmer', what: 'the same friendly round farmer as the approved reference outfit: yellow straw hat, visible blond fringe and side locks, coral short-sleeve shirt, lime overalls, brown shoes. Holds a different fruit or vegetable in each cell: apple, carrot, pear, tomato, broccoli, bell pepper, strawberry, corn, cucumber. No clipboard', colours: 'yellow straw hat, golden-blond hair, bright lime overalls, coral shirt, peach skin, assorted colorful produce' },
  { id: 'goldfish', what: 'a chubby round goldfish with big flowing fins and a flowing tail, seen face on', colours: 'neon tangerine-orange body, hot pink fins and tail, pale cream belly' },
  { id: 'chip', what: 'the original Data Dealer pocket assistant: an upright almost-square integrated circuit character with four horizontal pins on each side, a small top-centre orientation notch dipping inward, a small pin-one dot in its upper left, two symmetric vertical dot eyes, a friendly face and two thin legs ending in wide small feet, no circuit traces and no props', colours: 'neon yellow package body, dark olive-black outline and features, lime-yellow pins, tiny coral blush cheeks' },
  { id: 'api-fairy', what: 'a tiny fairy with pointed ears and translucent insect wings, holding a small key', colours: 'neon violet dress, pale lilac wings, bright mint-green hair, gold key' },
  { id: 'unity-unicorn', what: 'a chubby little unicorn with a spiral horn and a flowing mane and tail', colours: 'bright white body, neon rainbow mane in magenta and cyan and lime, gold spiral horn' },
  { id: 'python-panther', what: 'a sleek panther cat sitting upright with a long curling tail and pointed ears', colours: 'deep indigo-violet fur, glowing acid-yellow eyes, neon lime collar' },
  // Astra is one of the Mommy's dancers in a different colourway, not a copy of the Meep
  // avatar: that package's terms say edits must not be made public, and this repo is public.
  // She is generated from the Mommies' own sheet so the body is the same character, and the
  // star above her head is her own motif, the one thing that tells her apart from them.
  // The reference sheet holds two characters per cell, so the scale has to be overridden
  // explicitly or she comes out half the size of every other pet.
  { id: 'astra-wisp', ref: 'art/sheets/mommys-mommies.png', what: 'ONE single girl dancer ALONE, by herself, with exactly the same character design, face, body and proportions as the girls in the reference image, but drawn LARGE so that she fills her cell from top to bottom like a single-character sprite - she must be about twice the size she is in the reference, because the reference shows two girls sharing a cell and this is one girl in her own cell. She has a small five-pointed star floating above her head', colours: 'silver-lilac hair, glowing cyan eyes, electric violet dance outfit, bright gold star' },
  // A hummingbird's beak is a long straight needle, not a duck bill or an open mouth.
  { id: 'health-hummy', what: 'a plump hummingbird whose beak is a LONG THIN STRAIGHT NEEDLE pointing forward, like a drinking straw, never a wide flat duck bill and never an open mouth, with wide swept wings and a small heart shape on its chest', colours: 'neon spring-green body, turquoise wings, hot coral heart, thin black needle beak' },
  { id: 'finance-finch', what: 'a small round canary finch perched upright, holding one gold coin', colours: 'neon yellow body, emerald-green wings, bright orange beak and feet, gold coin' },
  // The Mommies are one pet, not two. They are never drawn apart, so they share a single
  // double-wide sprite. Identical bodies, faces and proportions: only hair and outfit differ.
  { id: 'mommys-mommies', what: 'TWO girl dancers standing side by side together, touching shoulders, as one pair. They stand close together and fit inside a square frame the same size as a single-character sprite. They are IDENTICAL twins with exactly the same body, same face, same proportions and same pose - the ONLY differences between them are hair colour and outfit colour. The girl on the left has long straight BLONDE hair; the girl on the right has long straight DARK BRUNETTE hair and small white curved horns. Both wear the same style of dance outfit', colours: 'left girl bright golden-blonde hair with a hot pink outfit, right girl dark brunette hair with a deep magenta outfit, both with white trim' },
  { id: 'paper-girl', what: 'a rolled-up NEWSPAPER character with a face on it, feminine and sweet: a folded broadsheet newspaper standing upright with little arms and feet, long eyelashes and a ribbon bow tied around its middle. It is a newspaper, not a person', colours: 'cream-white newsprint with charcoal text lines, hot coral ribbon bow, teal accents' },
  { id: 'file-master', what: 'a manila folder creature: a folder with a tab on its top left, white papers poking out of the top, with little arms and feet and a face on the front panel', colours: 'neon amber-orange folder, electric blue tab label, bright white papers' },
  // Discord Damsel is told apart by a crown, not a hood.
  { id: 'discord-damsel', what: 'a girl wearing a SMALL delicate golden tiara resting on her head, dainty and low, not a tall crown, no hood and no hat, holding a small game controller', colours: 'small bright gold tiara, blurple indigo dress, neon cyan trim, white controller, pale blonde hair' },
  { id: 'drum-dog', what: 'a floppy-eared dog standing upright wearing chunky over-ear headphones, behind a small square drum-pad sampler with four pads', colours: 'neon tangerine fur, electric blue headphones, acid lime glowing drum pads' },
  { id: 'vscode-angel', what: 'an ETHEREAL and FEMININE angel woman, serene and graceful, with long flowing hair, a softly glowing translucent gown that fades at the hem, large soft feathered wings and a glowing halo, holding a faintly glowing page of code', colours: 'luminous pale azure gown fading to translucent, white feathered wings, soft gold halo, silver-white hair, glowing cyan page' },
  { id: 'portfolio-puffer', what: 'a chubby round penguin standing upright with flippers at its sides, a clear beak and webbed feet, wearing CUTE ROUND wire-rimmed spectacles on his face, the round Harry Potter kind', colours: 'electric magenta body, glowing cyan belly, bright neon yellow beak and feet' },
  { id: 'ghost-protocol', what: 'a friendly small floating ghost with a rounded sheet-like head, two tiny soft arms and a gently scalloped floating hem, no legs, no props and no lettering', colours: 'pale mint and seafoam body, bright teal inner folds, dark charcoal dot eyes, tiny coral blush cheeks' },
  { id: 'project-parrot', what: 'a compact friendly parrot perched upright with a small curved beak, folded wings and a neat short tail, no props and no lettering', colours: 'scarlet-red primary body, electric ultramarine wings and tail, bright gold beak and feet' },
];

const prompt = (p) => `${STYLE} The character is ${p.what}, in NEON unconventional colours: ${p.colours}. It must clearly read as ${p.what.split(',')[0]}.`;

/* ---------- run ----------
   Only when this file is run directly. Importing it (the tests read PETS) must never spend
   money: once, a command that merely imported it started a paid batch. */
const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('generate-pets.mjs');
if (invokedDirectly) await main();

async function main() {
  const registry = JSON.parse(readFileSync('pets.json', 'utf8'));
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const match = args.includes('--match');
  const force = args.includes('--force') || match;
  const only = args.filter((a) => !a.startsWith('--'));
  const KEEP = 'art/sheets/.approved';
  // A pet generated from another pet's sheet has to run after it, whatever order the table is
  // written in. PETS order stays the roster's row order; this only reorders the work.
  // Two explicit passes, not a sort: a pairwise comparator cannot express "after" when most
  // pairs are unordered, and Array.sort quietly gets it wrong.
  const picked = PETS.filter((p) => (only.length ? only.includes(p.id) : true) && !registry.pets.find((r) => r.art === p.id)?.art_source);
  for (const id of only) if (registry.pets.find((r) => r.art === id)?.art_source) console.log(`${id}: uses original drawing code; rebuild it with npm run build.`);
  const todo = [...picked.filter((p) => !p.ref), ...picked.filter((p) => p.ref)];

  mkdirSync(SHEETS, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  let made = 0, skipped = 0, converted = 0;
  for (const pet of todo) {
    const paths = assetPaths(registry, pet.id);
    const sheet = paths.sheet;
    if (dry) { console.log(`\n--- ${pet.id} ---\n${prompt(pet)}`); continue; }

    if (existsSync(sheet) && !force) { skipped++; }
    else {
      process.stdout.write(`${pet.id}: generating… `);
      try {
        // A pair of characters needs a wider cell than a single one.
        const canvas = (pet.aspect || 1) > 1 ? '1536x1024' : '1024x1024';
        const argv = [BRIDGE, prompt(pet), sheet, '--size', canvas, '--quality', 'high'];
        // Some pets are generated from another pet's sheet so they share its character design.
        let ref = pet.ref;
        // --match: hold this pet's own approved body still while the expressions are redrawn.
        if (match && existsSync(sheet)) {
          mkdirSync(KEEP, { recursive: true });
          const kept = paths.approved;
          if (!existsSync(kept)) copyFileSync(sheet, kept); // keep the FIRST approved one, not a later drift
          ref = kept;
        }
        if (ref) {
          if (!existsSync(ref)) { console.error(`\n${pet.id}: needs ${ref} first — generate that pet before this one.`); continue; }
          argv.push('--ref', ref);
        }
        execFileSync(process.execPath, argv, { stdio: ['ignore', 'pipe', 'pipe'] });
        made++;
        console.log('done');
      } catch (e) {
        const msg = `${e.stderr || ''}${e.stdout || ''}`.trim() || e.message;
        console.error(`\n${pet.id}: FAILED — ${msg}`);
        if (/billing|quota|insufficient|rate.?limit|429|402/i.test(msg)) {
          console.error('\nStopping: this looks like a billing or rate limit, not a bad prompt.');
          console.error(`Generated ${made} this run. Re-run the same command to pick up where it stopped.`);
          process.exit(1);
        }
        continue;
      }
    }

    try {
      const sprite = sheetToSprite(readFileSync(sheet), { aspect: pet.aspect || 1 });
      writeFileSync(paths.fallback, JSON.stringify({ id: pet.id, name: pet.id, source: sheet.slice(sheet.lastIndexOf('/') + 1), ...sprite }, null, 1));
      const used = new Set(Object.values(sprite.frames).flatMap((f) => Object.values(f.pal)));
      console.log(`  ${pet.id}: ${sprite.size[0]}x${sprite.size[1]}, ${used.size} colours`);
      converted++;
    } catch (e) {
      console.error(`  ${pet.id}: conversion failed — ${e.message}`);
    }
  }

  if (!dry) console.log(`\n${made} generated, ${skipped} already had a sheet, ${converted} converted into ${OUT}/.`);
}
