// One list of names (Astra, 2026-10-16): every other list must agree with pet-programs.json. Claude Opus 5.5.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nameDrift } from '../scripts/name-list-20261016.mjs';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

test('pets.json, system-map.json and INTELLIGENCE-LEVELS.md use the names in pet-programs.json', () => {
  const drift = nameDrift({ programs: JSON.parse(read('pet-programs.json')).programs, registry: JSON.parse(read('pets.json')), systemMap: JSON.parse(read('system-map.json')), intelligence: read('INTELLIGENCE-LEVELS.md') });
  assert.deepEqual(drift, [], 'change the name in pet-programs.json first, then the others');
});

test('the drift check catches a renamed pet, a missing seed program and a duplicate name', () => {
  const programs = [{ number: 1, icon: 'Chat Rat', program: 'Chat Nest', assigned: true, repo: 'chat-rat' }, { number: 2, icon: 'Chat Rat', program: 'pet-program-2', assigned: false, repo: 'x' }];
  const registry = { pets: [{ repo: 'chat-rat', pet: 'Chat Mouse' }], seeds: { pets: [{ pet: 'Chat Rat' }] } };
  const d = nameDrift({ programs, registry });
  assert.ok(d.some((x) => /used by #1 and #2/.test(x)));
  assert.ok(d.some((x) => /"Chat Mouse", the list says "Chat Rat"/.test(x)));
  const seed = nameDrift({ programs: [programs[0]], registry: { seeds: { pets: [{ pet: 'Chat Rat' }] } } });
  assert.ok(seed.some((x) => /program is "\(none\)", the list says "Chat Nest"/.test(x)));
});
