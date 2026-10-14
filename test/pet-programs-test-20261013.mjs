// Pet Program numbers and the four intelligence levels (Astra, 2026-10-13). Claude Opus 5.5 (claude-opus-5-5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MARK, applyBlock, GROUPS_START, GROUPS_END, buildLevelGroups, buildProgramList } from '../scripts/lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(root + f, 'utf8');
const registry = JSON.parse(read('pets.json'));
const nums = registry.pet_programs.numbers;

test('Pet Program numbers run 1, 2, 3… with no gaps and no repo twice', () => {
  nums.forEach((n, i) => assert.equal(n.no, i + 1, `${n.pet} should be #${i + 1}`));
  assert.equal(new Set(nums.map((n) => n.repo)).size, nums.length);
  for (const n of nums) {
    assert.match(n.created, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(n.evidence.length > 10, `${n.pet}: say how its number was worked out`);
    for (const k of ['root', 'program', 'harness']) assert.ok(MARK[n.levels[k]], `${n.pet}: level ${k} must be yes, part or no`);
    for (const e of n.errors) assert.ok(registry.pet_programs.errors[e], `${n.pet}: unknown error ${e}`);
  }
  for (let i = 1; i < nums.length; i++) assert.ok(nums[i].created >= nums[i - 1].created, `#${nums[i].no} is older than #${nums[i - 1].no}`);
});

test('every registered and pipeline pet has a Pet Program number', () => {
  for (const p of [...registry.pets, ...registry.pipeline]) assert.ok(nums.some((n) => n.repo === p.repo), `${p.pet} has no Pet Program #`);
});

test('README and INTELLIGENCE-LEVELS.md list every Pet Program # with the same level marks', () => {
  const readme = read('README.md'), levels = read('INTELLIGENCE-LEVELS.md');
  assert.ok(readme.includes(buildProgramList(registry)), 'README Pet Program list is out of date: run npm run build');
  assert.equal(applyBlock(levels, GROUPS_START, GROUPS_END, buildLevelGroups(registry)), levels, 'INTELLIGENCE-LEVELS.md groups are out of date: run npm run build');
  for (const n of nums) {
    const row = levels.split('\n').find((l) => l.startsWith(`| ${n.no} |`));
    assert.ok(row, `INTELLIGENCE-LEVELS.md has no row for #${n.no} ${n.pet}`);
    assert.ok(row.includes(`**${n.pet}**`), `row #${n.no} should be ${n.pet}`);
    const cells = row.split(' | ');
    assert.ok(cells[5].startsWith(MARK[n.levels.root]), `#${n.no} level 1 mark`);
    assert.ok(cells[6].startsWith(MARK[n.levels.program]), `#${n.no} level 2 mark`);
    assert.ok(cells[7].startsWith(MARK[n.levels.harness]), `#${n.no} level 3 mark`);
  }
});
