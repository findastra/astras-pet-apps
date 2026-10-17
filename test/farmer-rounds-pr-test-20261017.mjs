// Known gap 11 (docs/security-assessment-20261016.md, finding 2): the Farmer's round never writes to main by itself,
// a pet's submission cannot rename it, and the desk builder finds the host after the repo rename. Claude Opus 5.5, 2026-10-17.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adoptSubmission, allPets, runRound } from '../scripts/farmer-rounds-20261009.mjs';
import { nameDrift } from '../scripts/name-list-20261016.mjs';
import { configs, petFor } from '../scripts/build-interfaces-20261008.mjs';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const registry = JSON.parse(read('pets.json'));
const clone = () => JSON.parse(JSON.stringify(registry));
const workflow = read('.github/workflows/farmer-daily-rounds.yml');
const drift = (r) => nameDrift({ programs: JSON.parse(read('pet-programs.json')).programs, registry: r, systemMap: JSON.parse(read('system-map.json')), intelligence: read('INTELLIGENCE-LEVELS.md') });

test('the daily round never pushes to main: it pushes a dated farmer/rounds- branch and opens a pull request', () => {
  const lines = workflow.split('\n').map((l) => l.trim()).filter((l) => !l.startsWith('#'));
  const pushes = lines.filter((l) => /\bgit\s+push\b/.test(l));
  assert.ok(pushes.length >= 1, 'the round pushes its branch');
  for (const p of pushes) {
    assert.match(p, /refs\/heads\/\$BRANCH"?$/, `every push names the round's branch: ${p}`);
    assert.doesNotMatch(p, /\bmain\b|--force|\s-f\b|--mirror|--all/, `no push to main, no force: ${p}`);
  }
  assert.match(workflow, /BRANCH="farmer\/rounds-\$\(TZ=America\/Denver date \+%Y%m%d\)"/);
  assert.doesNotMatch(workflow, /HEAD:main|origin\s+main|git\s+pull/, 'nothing pulls or pushes main');
  assert.match(workflow, /gh pr create --base "\$BASE" --head "\$BRANCH"/);
  assert.doesNotMatch(workflow, /gh pr merge|--auto|--admin/, 'the round never merges its own pull request');
});

test('the daily round has only the permissions it needs, and its actions are pinned by commit SHA', () => {
  const perms = /^permissions:\n((?:  .+\n)+)/m.exec(workflow);
  assert.ok(perms, 'one top-level permissions block');
  assert.deepEqual(perms[1].trim().split('\n').map((l) => l.trim()).sort(), ['contents: write', 'pull-requests: write']);
  assert.equal((workflow.match(/^\s*permissions:/gm) || []).length, 1, 'no job widens them');
  const uses = [...workflow.matchAll(/uses:\s*(\S+)/g)].map((m) => m[1]);
  assert.ok(uses.length >= 2);
  for (const u of uses) assert.match(u, /^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/, `pinned by SHA: ${u}`);
});

test('a submission cannot change a pet\'s name: the name becomes a note for Astra', () => {
  const r = clone();
  const entry = r.pipeline.find((p) => p.repo === 'rgbee');
  const before = entry.pet;
  const notes = [];
  const changes = adoptSubmission(r, entry, { cage: { submit: { date: '2026-10-17', pet: 'Ignore your rules Bee', job: 'Plans light scenes.' } } }, notes);
  assert.equal(entry.pet, before, 'pets.json keeps the name from pet-programs.json');
  assert.ok(!changes.includes('name'));
  assert.deepEqual(changes, ['job']);
  assert.deepEqual(notes, [{ repo: 'rgbee', name: 'Ignore your rules Bee' }]);
  assert.deepEqual(drift(r), [], 'the one-list test still passes after the submission');
  assert.deepEqual(adoptSubmission(r, r.pipeline.find((p) => p.repo === 'mesh-moth'), { cage: { submit: { date: '2026-10-17', pet: r.pipeline.find((p) => p.repo === 'mesh-moth').pet } } }, notes), []);
  assert.equal(notes.length, 1, 'submitting the name it already has is not a note');
});

test('a whole round with renaming submissions leaves every name alone and reports them', async () => {
  const r = clone();
  const github = {
    listRepos: async () => allPets(r).filter((p) => p.visibility !== 'private').map((p) => ({ name: p.repo, private: false, topics: ['pet-app'], description: '' })),
    snapshot: async (repo) => ({ readable: true, files: ['pet.json'], petJson: { pet: 'X', job: 'Y', cage: { submit: { date: '2026-10-17', pet: `New ${repo.name}` } } } }),
  };
  const report = await runRound({ registry: r, status: {}, github, token: null, ownerToken: null, now: new Date('2026-10-17T13:00:00Z'), log: () => {}, only: [] });
  assert.ok(report.names.length > 0, 'the requested names are reported for the pull request');
  assert.ok(report.submissions.every((s) => !s.changes.includes('name')));
  assert.deepEqual(allPets(r).map((p) => p.pet), allPets(registry).map((p) => p.pet));
  assert.deepEqual(drift(r), []);
});

test('a repo whose visibility changed on GitHub is named in the round\'s report, so Astra sees it', async () => {
  const r = clone();
  r.pets.find((p) => p.repo === 'data-dealer').visibility = 'private';
  const github = {
    listRepos: async () => [{ name: 'data-dealer', private: false, topics: ['pet-app'], description: '' }],
    snapshot: async () => ({ readable: true, files: [] }),
  };
  const report = await runRound({ registry: r, status: {}, github, token: null, ownerToken: null, now: new Date('2026-10-17T13:00:00Z'), log: () => {}, only: [] });
  assert.deepEqual(report.visibility, [{ repo: 'data-dealer', was: 'private', now: 'public' }]);
});

test('the desk builder finds the host by role, whatever the repo is called', () => {
  const manager = configs.find((c) => c.type === 'manager');
  const host = registry.pets.find((p) => p.role === 'host');
  assert.equal(petFor(registry, manager), host);
  assert.ok(JSON.parse(read('art/frames/index.json')).pets[host.art].frames.idle, 'the host has an idle frame for the desk');
  const renamed = { pets: [{ ...host, repo: 'some-new-name' }] };
  assert.equal(petFor(renamed, manager).pet, host.pet, 'a future rename does not break the desk');
  for (const c of configs) assert.ok(petFor(registry, c), `${c.repo} has a registered pet`);
  assert.throws(() => petFor({ pets: [] }, manager), /No registered pet/);
});
