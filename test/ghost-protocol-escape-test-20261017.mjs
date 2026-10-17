// Ghost Protocol shows checklist text as HTML, so typed and AI-suggested text must arrive escaped (finding 6 in
// docs/security-assessment-20261016.md). Runs the page's own functions. Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const page = readFileSync(new URL('../apps/ghost-protocol-20261008.html', import.meta.url), 'utf8');
const fn = (name) => {
  const start = page.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} is in the page`);
  let depth = 0;
  for (let i = page.indexOf('{', start); i < page.length; i++) {
    if (page[i] === '{') depth++;
    else if (page[i] === '}' && --depth === 0) return page.slice(start, i + 1);
  }
  throw new Error(`${name} has no end`);
};
const ctx = vm.createContext({});
vm.runInContext(`${fn('escapeHTML')}\n${fn('parseSuggestJSON')}`, ctx);

const attack = '<img src=x onerror=alert(1)>';

test('AI-suggested items are escaped before they are shown or saved', () => {
  const reply = `Here you go: ${JSON.stringify([{ t: attack, b: `"quoted" & 'single'`, d: '<b>bold</b>' }])}`;
  const [item] = ctx.parseSuggestJSON(reply);
  assert.equal(item.t, '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(item.b, '&quot;quoted&quot; &amp; &#39;single&#39;');
  assert.equal(item.d, '&lt;b&gt;bold&lt;/b&gt;');
  for (const v of Object.values(item)) assert.doesNotMatch(v, /[<>"']/);
});

test('typed items go through the same escape', () => {
  assert.match(fn('addCustomItem'), /t:escapeHTML\(title\)/);
  assert.equal(ctx.escapeHTML(attack), '&lt;img src=x onerror=alert(1)&gt;');
});
