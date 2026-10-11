// Desktop-only sheet slicing. OpenAI Codex (GPT-6), 2026-10-11.
// Preserve generated RGBA pixels and black outlines: the legacy grey-background
// converter keys by RGB and would mistake transparent black for the outline.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePng, MOODS } from './sheet-to-sprites.mjs';
import { png } from './art-kit.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const external = args[0] === '--directory' ? args[1] : null;
const ids = external ? [basename(resolve(external))] : args;
if (!ids.length) throw new Error('Pass one or more desktop-art pet directory names.');
for (const id of ids) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Invalid pet id.');
  const dir = external ? resolve(external) : resolve(root, 'desktop-art', id);
  const src = decodePng(readFileSync(resolve(dir, 'sheet-20261011.png')));
  const cells = MOODS.map((mood, i) => {
    const x0 = Math.round((i % 3) * src.width / 3), y0 = Math.round(Math.floor(i / 3) * src.height / 3);
    const x1 = Math.round((i % 3 + 1) * src.width / 3), y1 = Math.round((Math.floor(i / 3) + 1) * src.height / 3);
    let left = x1, top = y1, right = x0, bottom = y0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (src.rgba[(y * src.width + x) * 4 + 3] < 32) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x + 1); bottom = Math.max(bottom, y + 1);
    }
    if (right <= left || bottom <= top) throw new Error(`${id}/${mood} is empty.`);
    return { mood, x0, y0, x1, y1, left, top, right, bottom };
  });
  const side = Math.max(...cells.flatMap(c => [c.right - c.left, c.bottom - c.top])) / 0.8;
  for (const c of cells) {
    const out = Buffer.alloc(256 * 256 * 4);
    const cx = (c.left + c.right) / 2, cy = (c.top + c.bottom) / 2;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const sx = Math.floor(cx + (x + 0.5 - 128) * side / 256);
      const sy = Math.floor(cy + (y + 0.5 - 128) * side / 256);
      if (sx < c.x0 || sx >= c.x1 || sy < c.y0 || sy >= c.y1) continue;
      const from = (sy * src.width + sx) * 4, to = (y * 256 + x) * 4;
      src.rgba.copy(out, to, from, from + 4);
    }
    writeFileSync(resolve(dir, `${c.mood}-20261011.png`), png(256, 256, out));
  }
  console.log(`${id}: 9 transparent 256px frames, shared scale, original alpha preserved.`);
}
