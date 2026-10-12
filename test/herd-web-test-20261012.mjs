// The Herd Web: every link names a known node, kind and state, and the page is up to date.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-12.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { herdWebData, buildHerdWeb, petIcons, HERD_WEB } from '../scripts/herd-web-20261012.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(root + f, 'utf8');
const registry = JSON.parse(read('pets.json'));
const extra = JSON.parse(read(HERD_WEB.extra));

test('every Herd Web link has known ends, kind and state', () => {
  const data = herdWebData(registry, extra); // throws on an unknown node, kind or state
  const ids = new Set(data.nodes.map((n) => n.id));
  for (const l of data.links) { assert.ok(ids.has(l.from)); assert.ok(ids.has(l.to)); }
  for (const n of data.nodes) assert.ok(data.types[n.type], `unknown node type: ${n.type}`);
});

test('the Farmer reaches every pet, and every seed and roadmap pet is his to hatch', () => {
  const data = herdWebData(registry, extra);
  const host = data.nodes.find((n) => n.type === 'host').id;
  for (const n of data.nodes.filter((x) => ['pet', 'pipeline', 'seed', 'roadmap'].includes(x.type)))
    assert.ok(data.links.some((l) => (l.from === host && l.to === n.id) || (l.to === host && l.from === n.id)), `${n.name} is not linked to the Farmer`);
});

test('private pets send nothing but their own registry entry to the Farmer', () => {
  const data = herdWebData(registry, extra);
  const host = data.nodes.find((n) => n.type === 'host').id;
  for (const p of registry.relations.private)
    for (const l of data.links.filter((x) => x.from === p))
      assert.ok(l.to === host && l.carries === 'registry', `${p} is private but sends ${l.carries} to ${l.to}`);
});

test('herd-web-20261012.html is up to date (run npm run build)', () => {
  process.chdir(root);
  assert.equal(read(HERD_WEB.output), buildHerdWeb(registry, extra, read(HERD_WEB.template), petIcons(JSON.parse(read('art/frames/index.json')))));
});

test('every node sits on one of the six architecture layers, and every link has a layer', () => {
  const data = herdWebData(registry, extra);
  for (const n of data.nodes) assert.ok(data.layers[n.layer], `${n.id} has no layer`);
  for (const l of data.links) assert.ok([0, 1, 2, 3, 4, 5, 6].includes(l.layer));
  const pet = data.links.find((l) => l.from === 'mail-snail' && l.to === 'finance-finch');
  assert.equal(pet.layer, 4, 'pet to pet is layer 4');
  assert.equal(data.links.find((l) => l.from === 'openai' && l.carries === 'art').layer, 0, 'the art pipeline is development, not runtime');
  assert.equal(data.links.find((l) => l.from === 'claude-bot' && l.to === 'claude').layer, 5, 'a pet calling a model is the harness layer');
  assert.ok(!data.links.some((l) => l.carries === 'builds' && data.nodes.find((n) => n.id === l.from).type === 'model'), 'models do not build pets; assistants do');
});
