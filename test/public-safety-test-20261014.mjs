// Public pages never show operational details (docs/local-services-20261014.md).
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-14.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { redactData, redactText, assertPublic, findSensitive } from '../scripts/public-safety-20261014.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

test('addresses and ports become descriptions; the relationship stays', () => {
  const changes = [];
  const data = redactData({ links: [{ from: 'a', to: 'b', why: 'Opens the controls at http://127.0.0.1:38761/ and localhost:8080.' }] }, 'map', changes);
  assert.equal(data.links[0].why, 'Opens the controls at a local service on this PC and a local service on this PC.');
  assert.equal(data.links[0].from, 'a');
  assert.deepEqual(changes, [{ path: 'map.links[0].why', kind: 'local service address' }]);
  assert.equal(redactText('The Pi is at 192.168.4.20:22.'), 'The Pi is at a device on the local network.');
  assert.equal(redactText('Saved in C:\\Users\\someone\\Documents'), 'Saved in %USERPROFILE%\\Documents');
});

test('words that are not addresses stay', () => {
  for (const text of ['The Farm is not a localhost dashboard.', "['localhost', '127.0.0.1'].includes(location.hostname)", 'version 1.2.3.4', 'C:\\Users\\example\\x'])
    assert.equal(redactText(text), text);
});

test('a secret stops the build instead of being hidden', () => {
  const fake = 'sk-' + 'x'.repeat(30);
  assert.throws(() => redactData({ note: fake }, 'pets.json'), /API key is in pets\.json\.note/);
  assert.throws(() => assertPublic('ok ' + fake, 'page.html'), /page\.html would publish 1 OpenAI or Anthropic API key/);
  assert.doesNotThrow(() => assertPublic('nothing to see', 'page.html'));
});

test('no committed file publishes a secret, a local service address or a personal folder path', () => {
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
    .filter((f) => !/\.(png|gif|jpe?g|ico|webp|zip|exe|wav|mp3|ogg|ttf|woff2?)$/i.test(f))
    .filter((f) => f !== 'test/public-safety-test-20261014.mjs'); // this file's own made-up examples
  const problems = [];
  for (const f of files) {
    let text; try { text = readFileSync(`${root}/${f}`, 'utf8'); } catch { continue; }
    // Teaching material may name a local network address (Ghost Protocol's router tips), so that kind is only
    // checked in generated data, where the build removes it.
    for (const hit of findSensitive(text)) if (hit.kind !== 'local network address') problems.push(`${f}: ${hit.count} ${hit.kind}`);
  }
  assert.deepEqual(problems, []);
});
