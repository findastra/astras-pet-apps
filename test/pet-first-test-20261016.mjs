// Pet-first profile lines and the pet-finder (Astra, 2026-10-16). Claude Opus 5.5 (claude-opus-5-5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { syncProfile, splitStatus } from '../scripts/farmer-profile-20261009.mjs';
import { findPets } from '../scripts/pet-finder-20261016.mjs';

const registry = { pets: [], pipeline: [] };
const prog = (number, icon, repo, text, over = {}) => ({ number, icon, repo, program: over.program || `pet-program-${number}`, assigned: !!over.program, stage: over.stage || 'seed', idea: over.idea || null, mini_descriptor: { text } });
const programs = [
  prog(1, 'Friendly Farmer', 'astras-pet-os', 'Organizes the pets.', { program: 'The Farm', stage: 'registered' }),
  prog(18, 'Project Parrot', 'project-parrot', 'Planned: periodically reviews OneNote for new project ideas.'),
  prog(35, 'Chat Rat', 'chat-rat', 'Not decided yet: Chat Rat’s job is Astra’s to choose.'),
  prog(45, 'Closet Cat', 'the-cats-closet', 'Organizes your closet.'),
];
const repos = ['astras-pet-os', 'project-parrot', 'chat-rat', 'the-cats-closet', 'startup-star'].map((name) => ({ name, private: false, description: name === 'startup-star' ? 'Startup Star: the tray tool.' : '' }));
const readme = `<h2 align="center">Hi</h2>

### Web & More
- [\`startup-star\`](https://github.com/findastra/startup-star) -- Startup Star: the tray tool
- [\`the-cats-closet\`](https://github.com/findastra/the-cats-closet) -- closet Cat's pet program (#45, seed)

### Astra's PetOS

1. [\`astras-pet-os\`](https://github.com/findastra/astras-pet-os) -- **Friendly Farmer** · *The Farm*: organizes the pets
`;

test('status is not a job: it moves to [brackets] at the end', () => {
  assert.deepEqual(splitStatus('Planned: reviews OneNote.'), { job: 'Reviews OneNote.', status: 'planned' });
  assert.deepEqual(splitStatus('Not decided yet: Chat Rat’s job is Astra’s to choose.'), { job: '', status: 'job not chosen yet' });
  assert.deepEqual(splitStatus('Keeps notes.'), { job: 'Keeps notes.', status: null });
});

test('every pet line starts with the pet, then its home, then its repo', () => {
  const { text } = syncProfile(readme, registry, repos, programs);
  const lines = text.split('\n').filter((l) => /^\d+\. /.test(l));
  assert.equal(lines.length, 4);
  for (const l of lines) assert.match(l, /^\d+\. \*\*[^*]+\*\* · /, `pet first: ${l}`);
  assert.ok(lines.includes('1. **Friendly Farmer** · *The Farm* · [`astras-pet-os`](https://github.com/findastra/astras-pet-os) -- organizes the pets'));
  assert.ok(lines.includes('18. **Project Parrot** · [`project-parrot`](https://github.com/findastra/project-parrot) -- periodically reviews OneNote for new project ideas [planned]'));
  assert.ok(lines.includes('35. **Chat Rat** · [`chat-rat`](https://github.com/findastra/chat-rat) -- [job not chosen yet]'));
  assert.match(text, /^45\. \*\*Closet Cat\*\* · \[`the-cats-closet`\]/m, 'a pet program repo moves into the numbered list');
  assert.doesNotMatch(text.split("### Astra's PetOS")[0], /the-cats-closet/, 'and out of Web & More');
  assert.match(text, /startup-star`\]\([^)]*\) -- Startup Star: the tray tool/, 'a two-word name keeps its capitals');
  assert.deepEqual(syncProfile(text, registry, repos, programs).changes, [], 'a second run changes nothing');
});

test('pet-finder reports a pet repo listed under the wrong repo, pets missing from the registry, placeholders and PC-only pets', () => {
  const wrong = programs.map((p) => (p.number === 45 ? { ...p, repo: 'pet-program-45' } : p));
  const withPetJson = repos.map((r) => (r.name === 'the-cats-closet' ? { ...r, petJson: { pet: 'Closet Cat', number: 45 } } : r));
  const f = findPets({ programs: [...wrong, prog(77, 'pet-program-77-icon-77', 'pet-program-77', 'Triages tickets.')], registry: { pets: [], pipeline: [] }, repos: [...withPetJson, { name: 'pet-program-77', private: false }], local: [{ folder: 'workflow-whirlpool', onGitHub: false, pet: 'Workflow Whale', program: 'Workflow Whirlpool', file: 'x.json' }] });
  const kinds = f.map((x) => x.kind);
  assert.ok(f.some((x) => x.kind === 'wrong-repo' && x.repo === 'the-cats-closet' && x.number === 45));
  assert.ok(!f.some((x) => x.kind === 'no-repo' && x.number === 45), 'the wrong repo is reported once, as wrong-repo');
  assert.ok(f.some((x) => x.kind === 'not-in-registry' && x.repo === 'astras-pet-os'));
  assert.ok(f.some((x) => x.kind === 'placeholder-name' && x.number === 77));
  assert.ok(f.some((x) => x.kind === 'pc-only' && x.pet === 'Workflow Whale'));
  assert.ok(kinds.includes('no-home'));
  assert.ok(!f.some((x) => x.repo === 'startup-star'), 'a tool without pet.json is not a pet');
});

test('hidden repos leave the profile; a pet’s home, then its tools, sit under its line (Astra, 2026-10-16)', () => {
  const reg = { pets: [], pipeline: [], profile: { hidden: ['startup-star'], tools: { 'astras-pet-os': { home_note: 'moving to its own repo, the-farm', tools: ['the-kennel'] } } } };
  const rs = [...repos, { name: 'the-kennel', private: false, description: 'Pets made by other people.' }];
  const md = readme.replace("### Astra's PetOS", '- [`the-kennel`](https://github.com/findastra/the-kennel) -- pets made by other people\n\n### Astra\'s PetOS');
  const { text } = syncProfile(md, reg, rs, programs);
  assert.doesNotMatch(text, /startup-star/);
  const [before, petos] = text.split("### Astra's PetOS");
  assert.doesNotMatch(before, /the-kennel/);
  assert.match(petos, /^1\. \*\*Friendly Farmer\*\*[^\n]*\n   - \*The Farm\* · \[`astras-pet-os`\][^\n]* -- home \[moving to its own repo, the-farm\]\n   - \[`the-kennel`\]\([^)]*\) -- pets made by other people\n18\. /m);
  assert.deepEqual(syncProfile(text, reg, rs, programs).changes, [], 'a second run changes nothing');
});
