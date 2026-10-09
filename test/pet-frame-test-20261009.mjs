// The pet well (.pet-well) in every rail-style app is square. Claude Opus 5.5, 2026-10-09.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { squarePetWell } from '../scripts/square-pet-well-20261009.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const apps = readdirSync(root + 'apps').filter((f) => f.endsWith('.html'))
  .map((f) => ({ f, html: readFileSync(root + 'apps/' + f, 'utf8') }))
  .filter(({ html }) => html.includes('.pet-well'));
const petWellRules = (html) => [...html.matchAll(/\.pet-well\{([^}]*)\}/g)].map((m) => m[1]);

test('rail-style apps are found', () => {
  assert.ok(apps.length >= 8, `expected the 8 rail-style apps, found ${apps.length}`);
});

test('every pet frame is square, never sized by min-height', () => {
  for (const { f, html } of apps) {
    const rules = petWellRules(html);
    assert.ok(rules.some((r) => r.includes('aspect-ratio:1/1')), `${f}: pet frame has no aspect-ratio:1/1`);
    for (const r of rules) assert.doesNotMatch(r, /(?:^|;)(?:min-)?height:/, `${f}: pet frame height is set separately from its width: ${r}`);
    assert.equal(squarePetWell(html), html, `${f}: run scripts/square-pet-well-20261009.mjs`);
  }
});

test('the shared fix converts the old frame and is idempotent', () => {
  const old = '<style>.pet-well{background:radial-gradient(ellipse,#5c4056 0%,#342637 65%);border:1px solid #6a4b61;border-radius:24px;min-height:190px;display:grid;place-items:center}.pet-well img{width:165px;height:165px;object-fit:contain;image-rendering:pixelated}@media(max-width:820px){.pet-well{min-height:70px;width:70px;border-radius:15px;grid-row:2/4}.pet-well img{width:70px;height:70px}}</style>';
  const fixed = squarePetWell(old);
  assert.doesNotMatch(fixed, /min-height/);
  assert.equal(squarePetWell(fixed), fixed);
  assert.throws(() => squarePetWell('<style>.pet-well{height:200px}</style>'), /Unrecognised pet frame/);
});
