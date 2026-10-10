// The Farmer's rounds, the mood key, relations and the profile round. Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { allPets, moodKey, isDue, auditPet, auditFarmer, adoptSubmission, discover, displayMood, needsFromSnapshot, runRound, MOODS } from '../scripts/farmer-rounds-20261009.mjs';
import { buildRelations, buildMoodKey } from '../scripts/relations-20261009.mjs';
import { syncProfile } from '../scripts/farmer-profile-20261009.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(root + f, 'utf8');
const registry = JSON.parse(read('pets.json'));
const clone = () => JSON.parse(JSON.stringify(registry));
const goodSnap = (over = {}) => ({
  readable: true, private: false, topics: ['pet-app'],
  files: ['pet.json', 'README.md', 'AGENTS.md', 'CLAUDE.md', 'LICENSE', 'app.html'],
  petJson: { pet: 'P', job: 'Does a thing.', entry: 'app.html', status: 'hatching' },
  readme: '# P\n\n*A pet app by Astra.*\n\n## How to run it\n\nOpen it.\n\n## Limits\n\nSome.\n',
  agents: 'Rules. The Cage is findastra/astras-pet-apps.', cards: [], ...over,
});
const pet = (over = {}) => ({ repo: 'p', pet: 'P', job: 'Does a thing.', audit: { cadence: 'weekly', subject: 'my stuff', needs: 'a thing only you can do' }, ...over });

test('every pet, registered or in the pipeline, has an audit block with a known cadence', () => {
  for (const p of allPets(registry)) {
    assert.ok(p.audit && p.audit.subject && p.audit.needs, `${p.repo} has no audit block`);
    assert.ok(registry.rounds.cadences[p.audit.cadence], `${p.repo}: unknown cadence ${p.audit.cadence}`);
  }
  const repos = allPets(registry).map((p) => p.repo);
  assert.equal(new Set(repos).size, repos.length, 'a repo is both registered and in the pipeline');
});

test('the mood key fills all nine moods for every pet, with no leftover placeholders', () => {
  for (const p of allPets(registry)) {
    const k = moodKey(registry, p);
    for (const m of MOODS) assert.ok(k[m] && !/[{}]/.test(k[m]), `${p.repo} ${m}: "${k[m]}"`);
  }
  const k = moodKey(registry, pet({ moods: { happy: 'Buzzing.' } }));
  assert.equal(k.happy, 'Buzzing.');
  assert.equal(k.sick, 'I need you: a thing only you can do.');
  assert.equal(k.idle, 'My stuff was fine at my last check.');
});

test('self-audit moods follow PET-FILES: happy, worried, alarmed, sick, sleep', () => {
  assert.equal(auditPet(registry, pet(), goodSnap()).mood, 'happy');
  const w = auditPet(registry, pet(), goodSnap({ readme: '# P\n\nhello\n' }));
  assert.equal(w.mood, 'worried');
  assert.equal(w.says, '3 to fix: my README needs the credit line, …');
  assert.equal(auditPet(registry, pet(), goodSnap({ petJson: null, petJsonError: 'bad' })).mood, 'alarmed');
  assert.equal(auditPet(registry, pet(), { readable: false, private: true }).mood, 'sleep');
  assert.match(auditPet(registry, pet(), { readable: false, private: true }).says, /can't see my private repo/);
  const s = auditPet(registry, pet({ job: 'Placeholder: a pet.' }), goodSnap({ petJson: { ...goodSnap().petJson, job: 'Placeholder: a pet.' } }));
  assert.equal(s.mood, 'sick');
  assert.equal(s.says, 'Need: a thing only you can do');
});

test('a card waiting on Astra makes a pet sick and says what it needs', () => {
  const cards = [
    { name: '001-any-light-control.md', text: 'status: open (waiting on Astra: the brand and model of each light)\nfor: any\n---\n' },
    { name: '002-x.md', text: 'status: done\nfor: astra\n---\n' },
    { name: '003-y.md', text: 'status: open\nfor: any\n---\n' },
  ];
  assert.deepEqual(needsFromSnapshot(pet(), { cards }), ['the brand and model of each light']);
  const r = auditPet(registry, pet(), goodSnap({ cards }));
  assert.equal(r.mood, 'sick');
  assert.equal(r.says, 'Need: the brand and model of each light');
});

test('a pet that does not point at the Cage is told to, and a job drift without a submission is flagged', () => {
  const r = auditPet(registry, pet(), goodSnap({ agents: 'Rules only.' }));
  assert.ok(r.findings.some((f) => /does not point at the Cage/.test(f.msg)));
  const d = auditPet(registry, pet({ job: 'Old job.' }), goodSnap());
  assert.ok(d.findings.some((f) => /describes my job differently/.test(f.msg) && f.sev === 'note'));
});

test('cadence: weekly pets audit on their own day, daily every day, never-checked at once', () => {
  const p = registry.pets[1];
  assert.equal(isDue(registry, p, null, '2026-10-10'), true);
  const dueDays = [];
  for (let d = 11; d <= 17; d++) if (isDue(registry, p, { checked: '2026-10-10T12:00:00Z' }, `2026-10-${d}`)) dueDays.push(d);
  assert.equal(dueDays.length, 1, `due on ${dueDays.join(',')}`);
  assert.equal(isDue(registry, registry.pets[0], { checked: '2026-10-10T12:00:00Z' }, '2026-10-11'), true);
  assert.equal(isDue(registry, registry.pets[0], { checked: '2026-10-11T12:00:00Z' }, '2026-10-11'), false);
});

test('a clean check shows idle after a day', () => {
  assert.equal(displayMood({ mood: 'happy', checked: '2026-10-10T00:00:00Z' }, '2026-10-10T20:00:00Z'), 'happy');
  assert.equal(displayMood({ mood: 'happy', checked: '2026-10-10T00:00:00Z' }, '2026-10-12T00:00:00Z'), 'idle');
  assert.equal(displayMood(null, '2026-10-12T00:00:00Z'), 'sleep');
});

test('submissions: taken once, only when dated, only known keys', () => {
  const r = clone();
  const entry = r.pipeline.find((p) => p.repo === 'rgbee');
  const pj = { cage: { submit: { date: '2026-10-11', job: 'New job.', says: ['bzz', 42, ''], moods: { happy: 'All lit.', nope: 'x' }, audit: { cadence: 'daily', needs: 'light brands' }, kind: 'dragon' } } };
  const changes = adoptSubmission(r, entry, pj);
  assert.deepEqual(changes, ['job', 'bubble lines', 'mood key', 'audit']);
  assert.equal(entry.job, 'New job.');
  assert.deepEqual(entry.says, { rgbee: ['bzz'] });
  assert.deepEqual(entry.moods, { happy: 'All lit.' });
  assert.equal(entry.audit.cadence, 'daily');
  assert.equal(entry.kind, undefined, 'kind belongs to the Farmer');
  assert.equal(entry.submitted, '2026-10-11');
  assert.deepEqual(adoptSubmission(r, entry, pj), [], 'the same submission is not taken twice');
  assert.deepEqual(adoptSubmission(r, entry, { cage: { submit: { job: 'undated' } } }), []);
});

test('discovery adds unknown pet repos to the pipeline and ignores everything else', () => {
  const r = clone();
  const added = discover(r, [
    { name: 'new-newt', isPet: true, private: true, petJson: { pet: 'New Newt', job: 'Placeholder: a newt.' } },
    { name: 'not-a-pet', isPet: false },
    { name: 'rgbee', isPet: true },
    { name: 'forked', isPet: true, fork: true },
  ], '2026-10-10');
  assert.deepEqual(added.map((p) => p.repo), ['new-newt']);
  const e = r.pipeline.at(-1);
  assert.equal(e.pet, 'New Newt');
  assert.equal(e.visibility, 'private');
  assert.equal(e.audit.needs, 'a job: what should I do?');
});

test('the Farmer is sick when he cannot see private repos, and worried while pets wait', () => {
  assert.equal(auditFarmer(registry, { unreadable: ['x'] }).mood, 'sick');
  const r = auditFarmer(registry, {});
  assert.equal(r.mood, registry.pipeline.length ? 'worried' : 'happy');
});

test('a whole round, against a pretend GitHub', async () => {
  const r = clone();
  const status = {};
  const github = {
    listRepos: async () => [
      ...allPets(r).filter((p) => p.visibility !== 'private').map((p) => ({ name: p.repo, private: false, topics: ['pet-app'], description: '' })),
      { name: 'new-newt', private: false, topics: ['pet-app'], description: 'A newt.' },
    ],
    snapshot: async (repo) => (repo.name === 'new-newt' ? { readable: true, files: ['pet.json'], petJson: { pet: 'New Newt', job: 'Watches newts.' } } : goodSnap({ petJson: { pet: 'X', job: allPets(r).find((p) => p.repo === repo.name)?.job, entry: 'app.html', status: 'hatching' } })),
  };
  const report = await runRound({ registry: r, status, github, token: null, ownerToken: null, now: new Date('2026-10-10T13:00:00Z'), log: () => {}, all: true });
  assert.deepEqual(report.discovered, ['new-newt']);
  assert.ok(report.unreadable.includes('data-dealer'), 'private pets are unreadable without FARMER_TOKEN');
  assert.equal(status.pets['astras-pet-apps'].mood, 'sick');
  assert.equal(status.pets['data-dealer'].mood, 'sleep');
  assert.ok(status.needs_astra.some((n) => n.repo === 'astras-pet-apps'));
  assert.ok(['happy', 'sick', 'worried'].includes(status.pets['github-goldfish'].mood));
});

test('relations only name pets the Cage knows, with known kinds and states', () => {
  const known = new Set([...allPets(registry).map((p) => p.repo), 'astra', 'profile', 'pets']);
  for (const l of registry.relations.links) {
    assert.ok(known.has(l.from), `unknown "from": ${l.from}`);
    assert.ok(known.has(l.to), `unknown "to": ${l.to}`);
    assert.ok(registry.relations.carries[l.carries], `unknown kind: ${l.carries}`);
    assert.ok(['now', 'planned', 'idea'].includes(l.state), `unknown state: ${l.state}`);
  }
  for (const r of registry.relations.private) for (const l of registry.relations.links) assert.notEqual(l.from, r, `${r} is private but sends ${l.carries}`);
});

test('RELATIONS.md and MOOD-KEY.md are up to date (run npm run build)', () => {
  assert.equal(read('RELATIONS.md'), buildRelations(registry));
  assert.equal(read('MOOD-KEY.md'), buildMoodKey(registry));
});

const profile = `<h2 align="center">Hi</h2>

<p align="center">tagline</p>

### VR & VRChat

- [\`astras-infinite-pole\`](https://github.com/findastra/astras-infinite-pole) -- Astra's own words

### Astra's Pet Apps

1. [\`astras-pet-apps\`](https://github.com/findastra/astras-pet-apps) -- **Friendly Farmer** · her blurb

### Web & More

- [\`gone-repo\`](https://github.com/findastra/gone-repo) -- deleted
- \`secret\` *(private)* -- private thing
- [\`rgbee\`](https://github.com/findastra/rgbee) -- in the wrong place
`;
const online = (extra = []) => [...['astras-infinite-pole', 'astras-pet-apps', 'rgbee', 'claude-bot', 'findastra'].map((name) => ({ name, private: false, description: '' })), ...extra];

test('profile round: numbered pets in Cage order, her blurbs kept, gone repos dropped, new repos sorted', () => {
  const { text, changes } = syncProfile(profile, registry, online([{ name: 'detour-into-vr', private: false, description: 'Takes detours into VR.' }, { name: 'tool-x', private: false, description: 'A small tool.' }]));
  assert.match(text, /^1\. \[`astras-pet-apps`\].* -- \*\*Friendly Farmer\*\* · her blurb$/m, 'her blurb is kept');
  assert.match(text, /- \[`astras-infinite-pole`\].* -- Astra's own words/);
  assert.ok(!/gone-repo/.test(text), 'a deleted repo is dropped');
  assert.match(text, /`secret` \*\(private\)\*/, 'a private line is kept');
  assert.ok(!/in the wrong place/.test(text.split("### Web & More")[1]), 'a pet is moved out of Web & More');
  assert.match(text.split("### Astra's Pet Apps")[1], /\*\*RGBee\*\* · in the wrong place/, 'and keeps its blurb in the pet list');
  assert.match(text.split('### VR & VRChat')[1].split('###')[0], /detour-into-vr.* -- takes detours into VR$/m);
  assert.match(text.split('### Web & More')[1], /tool-x.* -- a small tool$/m);
  assert.match(text, /\*\*Chip\*\*/, 'a private registered pet is listed unlinked');
  assert.match(text, /`data-dealer` \*\(private\)\*/);
  assert.ok(text.startsWith('<h2 align="center">Hi</h2>\n\n<p align="center">tagline</p>'), 'header untouched');
  assert.ok(changes.length > 0);
  assert.deepEqual(syncProfile(text, registry, online([{ name: 'detour-into-vr', private: false, description: 'Takes detours into VR.' }, { name: 'tool-x', private: false, description: 'A small tool.' }])).changes, [], 'a second run changes nothing');
});
