// One shared fix for the pet frame (.pet-well) in the rail-style pet apps.
// The frame was sized by min-height, so its shape followed the rail width:
// 176×190 on desktop, 151×190 on laptops, 70×77 on phones. It is now a square
// at every width (aspect-ratio) and the pet scales with it.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
//
// Usage: node scripts/square-pet-well-20261009.mjs <file.html> [...]
// Idempotent. Throws if a file has a pet frame this fix does not recognise,
// so a new layout is reviewed rather than silently skipped.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RULES = [
  // Desktop frame: height came from min-height, width from the rail.
  ['.pet-well{background:radial-gradient(ellipse,#5c4056 0%,#342637 65%);border:1px solid #6a4b61;border-radius:24px;min-height:190px;display:grid;place-items:center}',
   '.pet-well{background:radial-gradient(ellipse,#5c4056 0%,#342637 65%);border:1px solid #6a4b61;border-radius:24px;aspect-ratio:1/1;display:grid;place-items:center}'],
  // The pet keeps the old proportion (165 of 190) instead of a fixed 165px that overflowed narrow rails.
  ['.pet-well img{width:165px;height:165px;object-fit:contain;image-rendering:pixelated}',
   '.pet-well img{width:87%;height:auto;aspect-ratio:1/1;object-fit:contain;image-rendering:pixelated}'],
  // Phone frame: was stretched across two grid rows to 70×77.
  ['.pet-well{min-height:70px;width:70px;border-radius:15px;grid-row:2/4}.pet-well img{width:70px;height:70px}',
   '.pet-well{width:70px;border-radius:15px;grid-row:2/4;align-self:center}'],
];

export function squarePetWell(html) {
  let out = html;
  for (const [before, after] of RULES) {
    if (out.includes(after)) continue;
    if (!out.includes(before)) throw new Error('Unrecognised pet frame rule; expected: ' + before.slice(0, 60) + '…');
    out = out.replace(before, after);
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = process.argv.slice(2);
  if (!files.length) throw new Error('Name the HTML files to fix.');
  for (const file of files) {
    const before = readFileSync(file, 'utf8');
    const after = squarePetWell(before);
    if (after !== before) writeFileSync(file, after);
    console.log((after === before ? 'already square ' : 'squared        ') + file);
  }
}
