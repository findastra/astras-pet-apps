// Pet words: pets.json `words` and PET-WORDS.md agree, and the Cage's own docs use them.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(root + f, 'utf8');
const registry = JSON.parse(read('pets.json'));
const words = registry.words;
const glossary = read('PET-WORDS.md');
const norm = (s) => s.toLowerCase().replace(/’/g, "'");
const retired = (words?.parts || []).flatMap((p) => p.retired.map((r) => ({ from: r, to: p.say })));

// Find a retired phrase as whole words, ignoring case and apostrophe style.
const finds = (text, phrase) => {
  const esc = norm(phrase).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}\\p{N}])`, 'u').test(norm(text));
};

test('pets.json has a well-formed words list', () => {
  assert.ok(words && Array.isArray(words.parts) && words.parts.length >= 8, 'pets.json needs words.parts');
  const says = new Set();
  for (const p of words.parts) {
    assert.equal(typeof p.say, 'string');
    assert.equal(typeof p.means, 'string');
    assert.ok(Array.isArray(p.retired), `${p.say}: retired must be a list`);
    assert.ok(!says.has(p.say), `${p.say} is listed twice`);
    says.add(p.say);
  }
  const seen = new Set();
  for (const { from } of retired) {
    assert.ok(!seen.has(norm(from)), `"${from}" is retired twice`);
    assert.ok(!says.has(from), `"${from}" is both a current and a retired word`);
    seen.add(norm(from));
  }
});

test('every word in pets.json is in PET-WORDS.md, and the reverse', () => {
  for (const p of words.parts) assert.ok(glossary.includes(`**${p.say}**`), `PET-WORDS.md does not define **${p.say}**`);
  for (const { from } of retired) assert.ok(finds(glossary, from), `PET-WORDS.md does not list the retired "${from}"`);
  const table = glossary.split('## The pet\'s art')[0];
  const bold = [...table.matchAll(/^\| [^|]+ \| \*\*([^*]+)\*\* \|/gm)].map((m) => m[1]);
  for (const b of bold) assert.ok(words.parts.some((p) => p.say === b), `PET-WORDS.md names **${b}** but pets.json words does not`);
});

test('the Cage\'s own docs and registry text use the current words', () => {
  const docs = ['README.md', 'PET-FILES.md', 'AGENTS.md', 'CLAUDE.md', 'ROSTER.md', 'docs/farmer-dock-20261008.md'];
  const registryText = registry.pets.flatMap((p) => [p.job, p.note || '']).join('\n');
  for (const [name, text] of [...docs.map((f) => [f, read(f)]), ['pets.json jobs and notes', registryText]]) {
    for (const { from, to } of retired) assert.ok(!finds(text, from), `${name} says "${from}"; say "${to}" (PET-WORDS.md)`);
  }
});
