// Card numbers never repeat (skills/handoff), across main and every branch: handoffs/README.md keeps the table.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../handoffs/', import.meta.url);
const readme = readFileSync(new URL('README.md', dir), 'utf8');
const cards = readdirSync(dir).filter((f) => /^\d{3}-.+\.md$/.test(f));

/** Numbers the README's "Card numbers on every branch" table gives to a named card file. */
export function reservedNumbers(text) {
  const out = new Map();
  for (const m of text.matchAll(/^\| (\d{3}) \| `(\d{3}-[^`]+\.md)` \|/gm)) out.set(m[1], m[2]);
  return out;
}

/** One line per broken rule; empty when the cards and the table agree. */
export function numberProblems(files, text) {
  const problems = [];
  const seen = new Map();
  for (const f of files) {
    const n = f.slice(0, 3);
    if (seen.has(n)) problems.push(`card ${n} is used twice: ${seen.get(n)} and ${f}`);
    seen.set(n, f);
  }
  const reserved = reservedNumbers(text);
  for (const f of files) {
    const want = reserved.get(f.slice(0, 3));
    if (want && want !== f) problems.push(`card ${f.slice(0, 3)} belongs to ${want}, not ${f}: take the next free number`);
    if (!text.includes(f)) problems.push(`${f} is not listed in handoffs/README.md`);
  }
  const next = /Next free number: (\d{3})/.exec(text);
  const used = [...files.map((f) => +f.slice(0, 3)), ...[...reserved.keys()].map(Number)];
  if (!next) problems.push('handoffs/README.md does not say the next free number');
  else if (used.some((n) => n >= +next[1])) problems.push(`next free number ${next[1]} is already used`);
  return problems;
}

test('every card number is used once and matches the table in handoffs/README.md', () => {
  assert.deepEqual(numberProblems(cards, readme), []);
});

test('the check catches a repeated number, a number given to another card and a stale next number', () => {
  const text = '| 017 | `017-security.md` | x |\nNext free number: 018.\n012-a.md 012-b.md 017-other.md';
  const p = numberProblems(['012-a.md', '012-b.md', '017-other.md'], text);
  assert.ok(p.some((x) => /card 012 is used twice/.test(x)));
  assert.ok(p.some((x) => /card 017 belongs to 017-security\.md/.test(x)));
  assert.ok(numberProblems(['018-x.md'], 'Next free number: 018. 018-x.md').some((x) => /already used/.test(x)));
});
