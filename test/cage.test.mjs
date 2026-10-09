import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { validate, buildTable, applyTable, assetPaths, START, END } from '../scripts/lib.mjs';
import { frameDirectory } from '../scripts/build-frames.mjs';
import { counts, order } from '../scripts/roster.mjs';
import { decodePng, sheetToSprite, MOODS } from '../scripts/sheet-to-sprites.mjs';
import { STICKERS, png } from '../scripts/art-kit.mjs';
import { PETS as PROMPTS } from '../scripts/generate-pets.mjs';
import { originalChipPixels, chipLayout, CHIP_COLOURS } from '../scripts/chip-original-20261008.mjs';

const path = (f) => fileURLToPath(new URL(`../${f}`, import.meta.url));
const read = (f) => readFileSync(path(f), 'utf8');
const registry = JSON.parse(read('pets.json'));
const art = JSON.parse(read('art/frames/index.json'));
const frame = (id, mood) => decodePng(readFileSync(path(art.pets[id].frames[mood])));
const hex = (img, i) => '#' + [img.rgba[i], img.rgba[i + 1], img.rgba[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
const countColour = (img, colour) => {
  let n = 0;
  for (let i = 0; i < img.width * img.height; i++) if (img.rgba[i * 4 + 3] > 127 && hex(img, i * 4) === colour) n++;
  return n;
};

/* ---------- the registry ---------- */

test('the real registry, README table and built frames all agree', () => {
  assert.deepEqual(validate(registry, read('README.md'), art), []);
});

test('exactly one host, and it is the Cage itself', () => {
  const hosts = registry.pets.filter((p) => p.role === 'host');
  assert.equal(hosts.length, 1);
  assert.equal(hosts[0].repo, registry.cage);
  assert.equal(hosts[0].pet, 'Friendly Farmer');
});

test('the count is derived, and drawn characters match it', () => {
  const n = counts(registry);
  assert.equal(n.apps, registry.pets.length);
  assert.equal(n.characters, Object.keys(art.pets).length);
  assert.equal(order(registry).length, n.characters);
});

test("Mommy's Mommies are one pet in one sprite: they never appear apart", () => {
  const m = registry.pets.find((p) => p.repo === 'mommys');
  assert.equal(m.art, 'mommys-mommies');
  assert.equal((m.companions || []).length, 0);
  assert.ok(m.says['mommys-mommies'].length > 0);
  assert.ok(art.pets['mommys-mommies']);
});

test('every registered pet has a generation prompt, and every prompt belongs to a pet', () => {
  const arts = new Set(registry.pets.flatMap((p) => [p.art, ...(p.companions || [])]));
  const prompted = new Set(PROMPTS.map((p) => p.id));
  for (const id of arts) assert.ok(prompted.has(id), `${id} has no prompt in generate-pets.mjs, so it can never be regenerated`);
  for (const id of prompted) assert.ok(arts.has(id), `generate-pets.mjs has a prompt for "${id}", which is not in pets.json`);
});

test('no two pets share a neon palette description', () => {
  const seen = new Map();
  for (const p of PROMPTS) {
    assert.ok(!seen.has(p.colours), `${p.id} and ${seen.get(p.colours)} have the same colours`);
    seen.set(p.colours, p.id);
  }
});

/* ---------- the frames ---------- */

test('every pet has all nine moods as square transparent PNGs of the built size', () => {
  for (const id of Object.keys(art.pets)) {
    for (const mood of MOODS) {
      assert.ok(existsSync(path(art.pets[id].frames[mood])), `${id}/${mood} is missing`);
      const img = frame(id, mood);
      assert.equal(img.width, art.size, `${id}/${mood} width`);
      assert.equal(img.height, art.size, `${id}/${mood} height`);
      assert.equal(img.rgba[3], 0, `${id}/${mood}: the corner is not transparent, so the background was not removed`);
    }
  }
});

test('no two moods of a pet are the same picture', () => {
  for (const id of Object.keys(art.pets)) {
    const seen = new Set(MOODS.map((m) => readFileSync(path(art.pets[id].frames[m])).toString('base64')));
    assert.equal(seen.size, MOODS.length, `${id}: two moods are identical`);
  }
});

test('every idle frame draws a whole character, not a speck', () => {
  for (const id of Object.keys(art.pets)) {
    const img = frame(id, 'idle');
    let n = 0;
    for (let i = 0; i < img.width * img.height; i++) if (img.rgba[i * 4 + 3] > 127) n++;
    assert.ok(n > img.width * img.height * 0.08, `${id} covers only ${n} pixels`);
  }
});

// The bug Astra spotted on 2026-10-08: the "?" and "Z" badges were jammed against the right
// edge and read as cut off. Nothing may touch the edge of its frame.
test('nothing in any frame touches the edge of the canvas', () => {
  for (const id of Object.keys(art.pets)) {
    for (const mood of MOODS) {
      const img = frame(id, mood), W = img.width, H = img.height;
      const opaque = (x, y) => img.rgba[(y * W + x) * 4 + 3] > 127;
      for (let x = 0; x < W; x++) assert.ok(!opaque(x, 0) && !opaque(x, H - 1), `${id}/${mood} touches the top or bottom edge`);
      for (let y = 0; y < H; y++) assert.ok(!opaque(0, y) && !opaque(W - 1, y), `${id}/${mood} touches the left or right edge`);
    }
  }
});

// Astra's rule: the mood symbols are the same on every pet, so they come from one set.
test('the shared indicators are stamped on every pet: ? when curious, ! when alarmed, Z asleep', () => {
  const badge = { curious: STICKERS.ask.pal['#'], alarmed: STICKERS.bang.pal['#'], sleep: STICKERS.zzz.pal['#'] };
  for (const id of Object.keys(art.pets)) {
    const idle = frame(id, 'idle');
    for (const [mood, colour] of Object.entries(badge)) {
      assert.ok(countColour(frame(id, mood), colour) > countColour(idle, colour), `${id}/${mood} is missing its ${mood} badge`);
    }
  }
});

test('a pet is only marked as placeholder art when its sheet really is missing', () => {
  for (const [id, a] of Object.entries(art.pets)) {
    if (a.placeholder) assert.ok(!existsSync(path(assetPaths(registry, id).sheet)), `${id} is marked placeholder but has a sheet: rebuild it`);
  }
});

test('the contact sheet exists', () => {
  assert.ok(existsSync(path('art/roster.png')));
});

test('dated assets keep one art id and use the registered frame paths throughout', () => {
  const ghost = assetPaths(registry, 'ghost-protocol');
  assert.equal(ghost.sheet, 'art/sheets/ghost-protocol-20261008.png');
  assert.equal(ghost.frame('idle'), 'art/frames/ghost-protocol/idle-20261008.png');
  assert.equal(assetPaths(registry, 'goldfish').frame('idle'), 'art/frames/goldfish/idle.png');
  assert.ok(art.pets['ghost-protocol']);
  assert.ok(!art.pets['ghost-protocol-20261008'], 'a dated sheet is not a second pet');
  for (const mood of MOODS) assert.ok(read('ROSTER.md').includes(art.pets['ghost-protocol'].frames[mood]));
});

test('frame cleanup rejects paths outside the expected per-pet directory', () => {
  for (const id of ['..', '../sheets', 'ghost/../../..', 'C:\\', 'ghost\\protocol', '']) {
    assert.throws(() => frameDirectory(id), /Invalid frame directory id/);
  }
  assert.throws(() => assetPaths(registry, '../sheets'), /Invalid art id/);
  assert.throws(() => assetPaths({ pets: [{ art: 'ghost', asset_date: '../escape' }] }, 'ghost'), /asset_date/);
});

test('Chip preserves every pixel of the original Data Dealer happy drawing', () => {
  const pixels = originalChipPixels('happy');
  // Independently captured from the original app's drawPet canvas output.
  assert.equal(createHash('sha256').update(pixels.join(',')).digest('hex'), 'a3fc9068ce610774b758ce5b3b40260e04c40f7ea50f2dd9cf3853e8089ea5c2');
  const at = (x, y) => pixels[y * 32 + x];
  for (const y of [6, 9, 12, 15]) assert.equal(at(7, y), CHIP_COLOURS.ink, `left pin at ${y}`);
  assert.equal(at(15, 4), CHIP_COLOURS.lcd, 'inward notch');
  assert.equal(at(15, 5), CHIP_COLOURS.ink, 'notch floor');
  assert.equal(at(11, 6), CHIP_COLOURS.mid, 'pin-one mark');
  for (const x of [13, 18]) assert.equal(at(x, 9), CHIP_COLOURS.ink, 'original eyes');
});

test('Chip frame embeds the original LCD at integer scale in the original yellow shell', () => {
  assert.equal(art.pets.chip.art_kind, 'original-code');
  assert.equal(art.pets.chip.source, 'scripts/chip-original-20261008.mjs');
  const img = frame('chip', 'idle'), original = originalChipPixels('happy');
  const { scale, lcdX, lcdY } = chipLayout(art.size);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 32; x++) {
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      assert.equal(hex(img, ((lcdY + y * scale + dy) * img.width + lcdX + x * scale + dx) * 4), original[y * 32 + x]);
    }
  }
  assert.ok(countColour(img, CHIP_COLOURS.neon) > 1000, 'original #d9e25a shell colour');
});

/* ---------- the converter, on a sheet made here (no API, no money) ---------- */

test('sheetToSprite slices a 3x3 sheet, removes the background and keeps nine moods', () => {
  const S = 300, cell = 100, buf = Buffer.alloc(S * S * 4, 255); // white
  const colours = [[255, 0, 128], [0, 200, 255], [255, 220, 0], [120, 255, 0], [160, 80, 255], [255, 120, 0], [0, 255, 170], [255, 60, 60], [90, 140, 255]];
  for (let c = 0; c < 9; c++) {
    const ox = (c % 3) * cell, oy = Math.floor(c / 3) * cell;
    for (let y = 25; y < 75; y++) for (let x = 25; x < 75; x++) {
      const edge = x < 28 || x > 71 || y < 28 || y > 71;
      const i = ((oy + y) * S + ox + x) * 4;
      const [r, g, b] = edge ? [0, 0, 0] : colours[c];
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    }
  }
  const sprite = sheetToSprite(png(S, S, buf), { size: 40 });
  assert.deepEqual(Object.keys(sprite.frames), MOODS);
  assert.deepEqual(sprite.size, [40, 40]);
  for (const mood of MOODS) {
    const f = sprite.frames[mood];
    assert.equal(f.rows.length, 40);
    assert.equal(f.rows[0][0], '.', `${mood}: white background was not removed`);
    assert.ok(f.rows.join('').replace(/\./g, '').length > 400, `${mood}: the square went missing`);
    assert.ok(Object.values(f.pal).includes('#000000'), `${mood}: the black outline was lost`);
  }
  // Compare actual colours, not palette letters: letters are assigned per frame in order of
  // appearance, so nine same-shaped squares in nine colours share identical rows.
  const asColours = (f) => f.rows.map((r) => [...r].map((c) => f.pal[c] || '.').join(',')).join('/');
  assert.equal(new Set(MOODS.map((m) => asColours(sprite.frames[m]))).size, 9);
});

test('decodePng reads back exactly what png() wrote', () => {
  const rgba = Buffer.from([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 0, 10, 20, 30, 255]);
  const img = decodePng(png(2, 2, rgba));
  assert.equal(img.width, 2); assert.equal(img.height, 2);
  assert.deepEqual([...img.rgba], [...rgba]);
});

/* ---------- README, safety ---------- */

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
  const unpublished = JSON.parse(JSON.stringify(base)); delete unpublished.pets[1].published;
  assert.ok(validate(unpublished, applyTable(readme, unpublished)).some((p) => /"published" must be true or false/.test(p)));
  assert.ok(validate(base, readme.replace('| host |', '| hosted |'), art).some((p) => /out of date/.test(p)));
  assert.ok(validate(base, '# no markers', art).some((p) => /markers/.test(p)));
});

test('the table only links pets that are on GitHub', () => {
  const sample = structuredClone(registry);
  Object.assign(sample.pets.find((p) => p.repo === 'github-goldfish'), { published: false });
  const table = buildTable(sample);
  assert.ok(!/\[GitHub Goldfish\]\(/.test(table), 'unpublished pets have no link');
  assert.match(table, /\[Paper Girl\]\(https:\/\/github\.com\/findastra\/paper-girl\)/);
  assert.match(table, /not on GitHub yet/);
  assert.match(table, /\*\*Chip\*\*.*private repo/);
  assert.ok(!table.includes('github.com/findastra/data-dealer'), 'private repositories have no public download link');
});

test('every pet has a bundled app interface and safe launch route', () => {
  for (const pet of registry.pets) {
    assert.ok(pet.interface_url, `${pet.pet}: no launch route`);
    assert.ok(existsSync(path(pet.interface_local_url)), `${pet.pet}: no packaged local interface`);
    assert.match(read(pet.interface_local_url), /<(?:html|title)\b/i, `${pet.pet}: local interface is not HTML`);
  }
  const bad = structuredClone(registry); bad.pets[0].interface_url = 'javascript:alert(1)';
  assert.ok(validate(bad, applyTable(read('README.md'), bad), art).some((p) => p.includes('interface_url must be')));
});

test('README markers are present and ordered', () => {
  const r = read('README.md');
  assert.ok(r.indexOf(START) > 0 && r.indexOf(END) > r.indexOf(START));
});

test('no personal data, tokens or work info in the repo files', () => {
  for (const f of ['README.md', 'ROSTER.md', 'AGENTS.md', 'PET-FILES.md', 'pets.json', 'cage.html', 'cage-data.js', 'scripts/generate-pets.mjs']) {
    const t = read(f);
    assert.ok(!/ghp_[A-Za-z0-9]{20}/.test(t), `${f} has a GitHub token`);
    assert.ok(!/sk-[A-Za-z0-9_-]{20}/.test(t), `${f} has an API key`);
    assert.ok(!/C:\\Users\\/.test(t), `${f} has a personal path`);
  }
});
