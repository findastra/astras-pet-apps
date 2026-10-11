// Uneven generated sheets must not leak neighboring pets into desktop frames.
// OpenAI Codex (GPT-6), 2026-10-11.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { png } from '../scripts/art-kit.mjs';
import { decodePng, MOODS } from '../scripts/sheet-to-sprites.mjs';

const helper = fileURLToPath(new URL('../scripts/build-desktop-art-20261011.mjs', import.meta.url));

function convert(t, rgba, label) {
  const directory = resolve(tmpdir(), `desktop-art-${label}-${randomUUID()}-20261011`);
  mkdirSync(directory);
  t.after(() => {
    const child = relative(resolve(tmpdir()), directory);
    assert.ok(child && !child.startsWith('..') && !isAbsolute(child), 'cleanup stays within the temporary directory');
    rmSync(directory, { recursive: true });
  });
  writeFileSync(resolve(directory, 'sheet-20261011.png'), png(300, 300, rgba));
  const result = spawnSync(process.execPath, [helper, '--directory', directory], { encoding: 'utf8', timeout: 15_000 });
  assert.ifError(result.error);
  return { directory, result };
}

test('desktop art uses uneven transparent gutters and preserves every pose without neighboring fragments', (t) => {
  const rgba = Buffer.alloc(300 * 300 * 4);
  // Several poses cross 100px/200px, so exact-third slicing corrupts this sheet.
  const columns = [[10, 116], [128, 182], [194, 291]];
  const rows = [[8, 74], [88, 206], [218, 293]];
  const colors = MOODS.map((_, i) => [31 + i * 23, 220 - i * 17, 47 + i * 11]);
  MOODS.forEach((_, i) => {
    const [left, right] = columns[i % 3], [top, bottom] = rows[Math.floor(i / 3)];
    for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
      const offset = (y * 300 + x) * 4;
      rgba.set([...colors[i], x === left ? 64 : 255], offset);
    }
  });
  const { directory, result } = convert(t, rgba, 'uneven');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readdirSync(directory).length, 10, 'one sheet plus nine derived frames');
  MOODS.forEach((mood, i) => {
    const frame = decodePng(readFileSync(resolve(directory, `${mood}-20261011.png`)));
    assert.equal(frame.width, 256);
    assert.equal(frame.height, 256);
    let opaque = 0, translucent = 0, clear = 0;
    for (let offset = 0; offset < frame.rgba.length; offset += 4) {
      const alpha = frame.rgba[offset + 3];
      if (!alpha) { clear++; continue; }
      assert.deepEqual([...frame.rgba.subarray(offset, offset + 3)], colors[i], `${mood} contains another pose's pixels`);
      assert.ok(alpha === 64 || alpha === 255, `${mood} changed the source alpha`);
      if (alpha === 64) translucent++; else opaque++;
    }
    assert.ok(opaque > 1000, `${mood} retained its body`);
    assert.ok(translucent > 0, `${mood} retained its translucent outer edge`);
    assert.ok(clear > 1000, `${mood} retained transparent padding`);
  });
});

test('desktop art rejects missing clear gutters before writing any derived frames', (t) => {
  for (const axis of ['x', 'y']) {
    const rgba = Buffer.alloc(300 * 300 * 4);
    for (let y = 0; y < 300; y++) for (let x = 0; x < 300; x++) {
      // For the y case, x has valid gutters so validation reaches the other axis.
      if (axis === 'y' && ((x >= 90 && x <= 110) || (x >= 190 && x <= 210))) continue;
      rgba.set([50, 100, 150, 255], (y * 300 + x) * 4);
    }
    const { directory, result } = convert(t, rgba, `blocked-${axis}`);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(`No clear ${axis} gutter`));
    assert.deepEqual(readdirSync(directory), ['sheet-20261011.png']);
  }
});
