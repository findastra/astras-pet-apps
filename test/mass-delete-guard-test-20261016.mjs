// mass-delete guard (Astra, 2026-10-16). Claude Opus 5.5.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planDelete, notices } from '../scripts/mass-delete-guard-20261016.mjs';

const registry = { cage: 'astras-pet-os', pets: [{ repo: 'file-master' }, { repo: 'github-goldfish' }], pipeline: [{ repo: 'meme-fiend' }] };
const base = { registry, runId: '20261016-1', root: '/farm/meme-fiend' };

test('a granted pet can plan a delete only inside its own folder; File Master and Goldfish are told', () => {
  const plan = planDelete({ ...base, pet: 'meme-fiend', grants: { 'meme-fiend': ['file-master-v1.0-mass-delete-v1.0'] }, paths: ['old/a.png', 'old/b.png'] });
  assert.equal(plan.count, 2);
  assert.equal(plan.items[0].moveTo, '_to_delete/20261016-1/old/a.png', 'moved, never hard-deleted');
  assert.match(plan.needs, /L4 approval/);
  assert.deepEqual(notices(plan).map((n) => n.to), ['file-master', 'github-goldfish']);
});

test('refused: no grant, another pet, outside the folder, protected files, the core, too many, not an animal', () => {
  assert.throws(() => planDelete({ ...base, pet: 'meme-fiend', paths: ['a'] }), /no grant/);
  const g = { 'meme-fiend': ['file-master-v1.0-mass-delete-v1.0'] };
  assert.throws(() => planDelete({ ...base, pet: 'meme-fiend', grants: g, paths: ['../file-master/x'] }), /outside/);
  assert.throws(() => planDelete({ ...base, pet: 'meme-fiend', grants: g, paths: ['.git/config'] }), /protected/);
  assert.throws(() => planDelete({ ...base, pet: 'meme-fiend', grants: g, paths: ['pet.json'] }), /protected/);
  assert.throws(() => planDelete({ ...base, pet: 'astras-pet-os', paths: ['a'] }), /core/);
  assert.throws(() => planDelete({ ...base, pet: 'meme-fiend', grants: g, paths: Array.from({ length: 201 }, (_, i) => `f${i}`) }), /limit/);
  assert.throws(() => planDelete({ ...base, pet: 'stranger', paths: ['a'] }), /Animal guard/);
});

test('File Master owns the tool and needs no grant, but still only inside his own folder', () => {
  const plan = planDelete({ ...base, root: '/farm/file-master', pet: 'file-master', paths: ['tmp/x'] });
  assert.equal(plan.pet, 'file-master');
  assert.throws(() => planDelete({ ...base, root: '/farm/file-master', pet: 'file-master', paths: ['/etc/passwd'] }), /outside/);
});
