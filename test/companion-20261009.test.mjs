// The companion chat on every app page and the requests behind it. Claude Opus 5.5, 2026-10-09.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { loadRequests, validateRequests, needsByArt, SKIP } from '../scripts/companion-20261009.mjs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const registry = JSON.parse(read('pets.json'));
const files = loadRequests(new URL('requests', root).pathname);
const data = (() => { const c = { window: {} }; vm.runInNewContext(read('apps/companion-data-20261009.js'), c); return c.window.COMPANION_DATA; })();

test('the request files are valid', () => {
  assert.deepEqual(validateRequests(files, registry), []);
  assert.ok(Object.keys(files).length > 0);
});

test('bad requests are caught', () => {
  const bad = { 'file-master': { app: 'file-master', requests: [
    { id: 'x', said: 'a', logged: '2026-10-09', status: 'later' },
    { id: 'x', said: '', logged: 'today', status: 'done' },
    { id: 'y', said: 'b', logged: '2026-10-09', status: 'needs-astra' },
  ] }, 'no-such-app': { app: 'no-such-app', requests: [] } };
  const problems = validateRequests(bad, registry).join('\n');
  for (const words of ['status must be', 'used twice', '"said" is empty', 'YYYY-MM-DD', 'needs "done"', 'needs a "question"', 'no pet app has repo']) assert.match(problems, new RegExp(words.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('every app page except Data Dealer has exactly one companion, for its own app', () => {
  const pages = readdirSync(new URL('apps', root)).filter((n) => n.endsWith('.html'));
  for (const p of registry.pets) {
    const page = [p.interface_local_url, p.interface_url].find((u) => /^apps\/.+\.html$/.test(u || ''));
    if (!page) continue;
    const html = read(page), blocks = html.split('companion:start').length - 1;
    if (SKIP.has(p.repo)) { assert.equal(blocks, 0, `${p.pet} keeps its own chat`); continue; }
    assert.equal(blocks, 1, `${p.pet} has one companion`);
    assert.match(html, new RegExp(`companion-20261009\\.js" data-app="${p.repo}"`));
    assert.ok(data.apps[p.repo], `${p.pet} has companion data`);
    assert.ok(html.lastIndexOf('companion:end') < html.lastIndexOf('</body>') || !html.includes('</body>'), `${p.pet}: chat is at the very bottom`);
  }
  assert.equal(pages.length, registry.pets.length);
});

test('the pages carry the requests on file, and questions make pets sick on pets.html', () => {
  for (const [repo, file] of Object.entries(files)) assert.equal(JSON.stringify(data.apps[repo].requests), JSON.stringify(file.requests));
  const needs = needsByArt(files, registry);
  const pets = (() => { const c = { window: {} }; vm.runInNewContext(read('pets-data.js'), c); return c.window.PETS_DATA; })();
  assert.equal(JSON.stringify(pets.needs), JSON.stringify(needs));
  assert.match(read('pets.html'), /D\.needs && D\.needs\[p\.id\] \? 'sick'/);
});

test('the companion puts text in the page safely', () => {
  const js = read('apps/companion-20261009.js');
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/);
});
