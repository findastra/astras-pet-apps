import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validate, buildTable, applyTable, START, END } from '../scripts/lib.mjs';
import { counts, order } from '../scripts/roster.mjs';
import { allSprites, MOODS, PETS } from '../scripts/pets-art.mjs';

const read = (f) => readFileSync(fileURLToPath(new URL(`../${f}`, import.meta.url)), 'utf8');
const registry = JSON.parse(read('pets.json'));
const art = JSON.parse(read('art/sprites.json'));

test('the real registry, README table and art all agree', () => {
  assert.deepEqual(validate(registry, read('README.md'), art), []);
});

test('exactly one host, and it is the Cage itself', () => {
  const hosts = registry.pets.filter((p) => p.role === 'host');
  assert.equal(hosts.length, 1);
  assert.equal(hosts[0].repo, registry.cage);
  assert.equal(hosts[0].pet, 'Friendly Farmer');
});

test('Nullbot is a mascot, not a pet app', () => {
  assert.ok(registry.mascots.some((m) => m.art === 'nullbot'));
  assert.ok(!registry.pets.some((p) => p.art === 'nullbot'));
});

test('the count is derived, and drawn characters match it', () => {
  const n = counts(registry);
  assert.equal(n.apps, registry.pets.length);
  assert.equal(n.characters, Object.keys(art.sprites).length);
  assert.equal(order(registry).length, n.characters);
});

test('every character has every mood, 32 rows of 32, and the moods differ', () => {
  for (const [id, s] of Object.entries(art.sprites)) {
    assert.deepEqual(Object.keys(s.frames), MOODS, id);
    const seen = new Set();
    for (const mood of MOODS) {
      const f = s.frames[mood];
      assert.equal(f.rows.length, 32, `${id}/${mood} rows`);
      assert.ok(f.rows.every((r) => r.length === 32), `${id}/${mood} width`);
      for (const ch of new Set(f.rows.join('').replace(/\./g, ''))) assert.ok(f.pal[ch], `${id}/${mood} palette ${ch}`);
      seen.add(f.rows.join('/'));
    }
    assert.equal(seen.size, MOODS.length, `${id}: two moods look identical`);
  }
});

test('every character draws something substantial in its idle frame', () => {
  for (const [id, s] of Object.entries(art.sprites)) {
    const filled = s.frames.idle.rows.join('').replace(/\./g, '').length;
    assert.ok(filled > 150, `${id} has only ${filled} pixels`);
  }
});

test('PNGs exist for every frame and the contact sheet', () => {
  assert.ok(existsSync(fileURLToPath(new URL('../art/roster-sheet.png', import.meta.url))));
  for (const def of PETS) for (const m of MOODS) assert.ok(existsSync(fileURLToPath(new URL(`../art/png/${def.id}/${m}.png`, import.meta.url))), `${def.id}/${m}`);
});

test('drawing is deterministic', () => {
  assert.deepEqual(allSprites(), art.sprites);
});

test('validate catches the mistakes it exists for', () => {
  const base = JSON.parse(JSON.stringify(registry));
  const readme = applyTable(read('README.md'), base);
  const dup = JSON.parse(JSON.stringify(base)); dup.pets.push({ ...dup.pets[1] });
  assert.ok(validate(dup, readme).some((p) => /listed twice/.test(p)));
  const noHost = JSON.parse(JSON.stringify(base)); noHost.pets[0].role = 'pet';
  assert.ok(validate(noHost, applyTable(readme, noHost)).some((p) => /exactly one host/.test(p)));
  const badStatus = JSON.parse(JSON.stringify(base)); badStatus.pets[1].status = 'swimming';
  assert.ok(validate(badStatus, applyTable(readme, badStatus)).some((p) => /status must be/.test(p)));
  const noArt = JSON.parse(JSON.stringify(base)); noArt.pets[1].art = 'missing-pet';
  assert.ok(validate(noArt, applyTable(readme, noArt), art).some((p) => /no art drawn for "missing-pet"/.test(p)));
  assert.ok(validate(base, readme.replace('| host |', '| hosted |'), art).some((p) => /out of date/.test(p)));
  assert.ok(validate(base, '# no markers', art).some((p) => /markers/.test(p)));
});

test('the table only links pets that are on GitHub', () => {
  const table = buildTable(registry);
  assert.ok(!/\[GitHub Goldfish\]\(/.test(table), 'unpublished pets have no link');
  assert.match(table, /\[Paper Girl\]\(https:\/\/github\.com\/findastra\/paper-girl\)/);
  assert.match(table, /not on GitHub yet/);
});

test('README markers are present and ordered', () => {
  const r = read('README.md');
  assert.ok(r.indexOf(START) > 0 && r.indexOf(END) > r.indexOf(START));
});

test('the Mommy\'s twins carry their own lines and both are drawn', () => {
  const m = registry.pets.find((p) => p.repo === 'mommys');
  assert.deepEqual(m.companions, ['mommys-devilish']);
  assert.ok(m.says['mommys-astra'].length > 0 && m.says['mommys-devilish'].length > 0);
  assert.ok(art.sprites['mommys-astra'] && art.sprites['mommys-devilish']);
});

test('no personal data, tokens or work info in the repo files', () => {
  for (const f of ['README.md', 'ROSTER.md', 'AGENTS.md', 'PET-FILES.md', 'pets.json', 'cage.html']) {
    const t = read(f);
    assert.ok(!/ghp_[A-Za-z0-9]{20}/.test(t), `${f} has a token`);
    assert.ok(!/C:\\Users\\/.test(t), `${f} has a personal path`);
  }
});
