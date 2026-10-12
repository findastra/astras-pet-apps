// Seeded pets: approved names that are not pet apps yet. Claude Opus 5.5 (claude-opus-5-5), 2026-10-11.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const registry = JSON.parse(readFileSync(new URL('../pets.json', import.meta.url), 'utf8'));

test('seeds are named once, never counted as pets, and do not reuse a pet name', () => {
  const seeds = registry.seeds.pets;
  assert.ok(seeds.length > 0);
  const known = new Set([...registry.pets, ...registry.pipeline].map((p) => p.pet.toLowerCase()));
  const names = seeds.map((s) => s.pet.toLowerCase());
  assert.equal(new Set(names).size, names.length, 'each seed is listed once');
  for (const s of seeds) {
    assert.ok(!known.has(s.pet.toLowerCase()), `${s.pet} is already a pet or in the pipeline`);
    assert.ok(typeof s.job === 'string' && s.job, `${s.pet} says its job or "undecided"`);
  }
  for (const p of registry.pets) assert.ok(!names.includes(p.pet.toLowerCase()));
});

test('a renamed pet waits for Astra instead of getting an invented name', () => {
  for (const r of registry.seeds.renames) { assert.ok(r.from); assert.ok(r.to === null || typeof r.to === 'string'); assert.ok(r.why); }
});
