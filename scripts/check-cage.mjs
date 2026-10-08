// Usage: node scripts/check-cage.mjs [--online]
// Checks pets.json and the README table. --online also asks GitHub whether each pet's repo
// exists, carries the pet-app topic, and has a pet.json.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { OWNER, validate } from './lib.mjs';

const p = (f) => fileURLToPath(new URL(`../${f}`, import.meta.url));
const registry = JSON.parse(readFileSync(p('pets.json'), 'utf8'));
const art = JSON.parse(readFileSync(p('art/sprites.json'), 'utf8'));
const problems = validate(registry, readFileSync(p('README.md'), 'utf8'), art);

if (process.argv.includes('--online')) {
  for (const pet of registry.pets) {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${pet.repo}`, { headers: { Accept: 'application/vnd.github+json' } });
    if (r.status === 404) { problems.push(`${pet.repo}: not on GitHub yet (or private)`); continue; }
    if (!r.ok) { problems.push(`${pet.repo}: GitHub answered ${r.status}`); continue; }
    const repo = await r.json();
    if (!(repo.topics || []).includes('pet-app')) problems.push(`${pet.repo}: add the GitHub topic pet-app`);
    const pj = await fetch(`https://raw.githubusercontent.com/${OWNER}/${pet.repo}/${repo.default_branch}/pet.json`);
    if (!pj.ok) problems.push(`${pet.repo}: no pet.json on ${repo.default_branch}`);
  }
}
if (problems.length) { console.error(problems.map((s) => '- ' + s).join('\n')); process.exit(1); }
console.log(`Cage OK: ${registry.pets.length} pet apps, ${(registry.mascots || []).length} mascot(s), ${Object.keys(art.sprites).length} characters drawn.`);
