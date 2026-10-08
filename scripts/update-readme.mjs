// Rewrites the pet table in README.md from pets.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { applyTable } from './lib.mjs';

const p = (f) => fileURLToPath(new URL(`../${f}`, import.meta.url));
const registry = JSON.parse(readFileSync(p('pets.json'), 'utf8'));
const readme = readFileSync(p('README.md'), 'utf8');
const next = applyTable(readme, registry);
if (next === readme) console.log('README.md table already up to date');
else { writeFileSync(p('README.md'), next); console.log(`README.md table updated (${registry.pets.length} pets)`); }
