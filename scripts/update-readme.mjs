// Rewrites the pet table in README.md from pets.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { applyTable, applyBlock, GROUPS_START, GROUPS_END, buildLevelGroups } from './lib.mjs';

const p = (f) => fileURLToPath(new URL(`../${f}`, import.meta.url));
const registry = JSON.parse(readFileSync(p('pets.json'), 'utf8'));
const readme = readFileSync(p('README.md'), 'utf8');
const next = applyTable(readme, registry);
if (next === readme) console.log('README.md table already up to date');
else { writeFileSync(p('README.md'), next); console.log(`README.md table updated (${registry.pets.length} pets)`); }

// INTELLIGENCE-LEVELS.md: the Pet Programs grouped by what each level needs (Astra, 2026-10-13).
const levels = readFileSync(p('INTELLIGENCE-LEVELS.md'), 'utf8');
const nextLevels = applyBlock(levels, GROUPS_START, GROUPS_END, buildLevelGroups(registry));
if (nextLevels !== levels) { writeFileSync(p('INTELLIGENCE-LEVELS.md'), nextLevels); console.log('INTELLIGENCE-LEVELS.md groups updated'); }
