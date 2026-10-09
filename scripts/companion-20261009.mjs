// Each app's pocket companion (like Chip on Data Dealer). Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
//
// Reads pets.json, art/frames/index.json and requests/<repo>.json, then:
//   apps/companion-data-20261009.js   each app's pet, frames and requests, for the pages
//   apps/*.html                       one marked <script> block before </body> (idempotent);
//                                     it adds nothing inside the page, only the pocket device
// The client code is apps/companion-20261009.js (hand-written, not generated).
// Data Dealer is skipped: its page already has Chip's own chat.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { decodePng } from './sheet-to-sprites.mjs';

export const STATUSES = ['open', 'in-progress', 'needs-astra', 'done'];
export const SKIP = new Set(['data-dealer']);
const START = '<!-- companion:start (added by scripts/companion-20261009.mjs; do not edit by hand) -->';
const END = '<!-- companion:end -->';
const DATED = /^\d{4}-\d{2}-\d{2}$/;

export function loadRequests(dir = 'requests') {
  const out = {};
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.json')).sort()) {
    const file = JSON.parse(readFileSync(`${dir}/${name}`, 'utf8'));
    out[name.slice(0, -5)] = file;
  }
  return out;
}

// Every problem as a sentence; empty when the files are good.
export function validateRequests(files, registry) {
  const problems = [], ids = new Set(), repos = new Set(registry.pets.map((p) => p.repo));
  for (const [repo, file] of Object.entries(files)) {
    if (!repos.has(repo)) problems.push(`requests/${repo}.json: no pet app has repo "${repo}"`);
    if (file.app !== repo) problems.push(`requests/${repo}.json: "app" must be "${repo}"`);
    if (!Array.isArray(file.requests)) { problems.push(`requests/${repo}.json: "requests" must be a list`); continue; }
    for (const r of file.requests) {
      const where = `requests/${repo}.json ${r && r.id}`;
      if (!r || typeof r.id !== 'string' || !r.id) { problems.push(`requests/${repo}.json: every request needs an id`); continue; }
      if (ids.has(r.id)) problems.push(`${where}: id is used twice`);
      ids.add(r.id);
      if (typeof r.said !== 'string' || !r.said.trim()) problems.push(`${where}: "said" is empty`);
      if (!DATED.test(r.logged || '')) problems.push(`${where}: "logged" must be a YYYY-MM-DD date`);
      if (!STATUSES.includes(r.status)) problems.push(`${where}: status must be one of ${STATUSES.join(', ')}`);
      if (r.status === 'done' && (!DATED.test(r.done || '') || !r.by)) problems.push(`${where}: a done request needs "done" (date) and "by" (model)`);
      if (r.status === 'needs-astra' && !(typeof r.question === 'string' && r.question.trim())) problems.push(`${where}: a needs-astra request needs a "question"`);
    }
  }
  return problems;
}

// What pets.html needs to make a pet sick and say why: art id -> open questions.
export function needsByArt(files, registry) {
  const out = {};
  for (const p of registry.pets) {
    const qs = ((files[p.repo] || {}).requests || []).filter((r) => r.status === 'needs-astra').map((r) => r.question);
    if (qs.length) out[p.art] = qs;
  }
  return out;
}

// The local copy of each app in apps/. Paper Girl and Ghost Protocol also have live sites, which
// live in their own repos and do not get this chat.
// The pocket device is painted in the pet's own main colour: the commonest strongly coloured
// pixel of its idle frame, with black or white text, whichever reads better on it.
export function shellColours(pngPath) {
  const { rgba } = decodePng(readFileSync(pngPath));
  const counts = new Map();
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] < 200) continue;
    const [r, g, b] = [rgba[i], rgba[i + 1], rgba[i + 2]], max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 510, s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
    if (s < .5 || l < .3 || l > .7) continue; // strong colours only, so skin tones and outlines do not win
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  if (!counts.size) return { shell: '#d9e25a', ink: '#0a0b05' };
  const key = [...counts].sort((a, b) => b[1] - a[1])[0][0];
  const rgb = [(key >> 8) & 15, (key >> 4) & 15, key & 15].map((v) => v * 16 + 8);
  const lin = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  const lum = .2126 * lin(rgb[0]) + .7152 * lin(rgb[1]) + .0722 * lin(rgb[2]);
  const dark = (lum + .05) / .0525, light = 1.05 / (lum + .05);
  return { shell: '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join(''), ink: dark >= light ? '#0d0b10' : '#ffffff' };
}

const pageFor = (p) => [p.interface_local_url, p.interface_url].find((u) => typeof u === 'string' && /^apps\/[a-z0-9-]+\.html$/.test(u))?.slice(5) || null;

export function buildCompanion({ quiet = false } = {}) {
  const registry = JSON.parse(readFileSync('pets.json', 'utf8'));
  const art = JSON.parse(readFileSync('art/frames/index.json', 'utf8'));
  const files = loadRequests();
  const problems = validateRequests(files, registry);
  if (problems.length) throw new Error('Request files have problems:\n' + problems.join('\n'));
  const apps = {};
  for (const p of registry.pets) {
    const page = pageFor(p);
    if (!page || SKIP.has(p.repo)) continue;
    const frames = (art.pets[p.art] || {}).frames || {};
    apps[p.repo] = {
      name: p.pet, job: p.job, host: p.role === 'host', page,
      ...(frames.idle ? shellColours(frames.idle) : {}),
      // Paths are relative to apps/, where the pages live.
      frames: Object.fromEntries(['idle', 'happy', 'curious', 'sick', 'sleep'].filter((m) => frames[m]).map((m) => [m, '../' + frames[m]])),
      requests: (files[p.repo] || {}).requests || [],
    };
  }
  const data = { generated: new Date().toISOString().slice(0, 10), apps };
  writeFileSync('apps/companion-data-20261009.js', `// Generated by scripts/companion-20261009.mjs from pets.json and requests/. Do not edit by hand.\nwindow.COMPANION_DATA = ${JSON.stringify(data).replaceAll('<', '\\u003c')};\n`);
  let pages = 0;
  for (const [repo, app] of Object.entries(apps)) {
    const file = 'apps/' + app.page;
    if (!existsSync(file)) continue;
    let html = readFileSync(file, 'utf8');
    const at = html.indexOf(START);
    if (at >= 0) html = html.slice(0, at) + html.slice(html.indexOf(END, at) + END.length);
    const block = `${START}<script src="companion-data-20261009.js"></script><script src="companion-20261009.js" data-app="${repo}"></script>${END}`;
    const close = html.lastIndexOf('</body>');
    html = close >= 0 ? html.slice(0, close) + block + html.slice(close) : html + block;
    writeFileSync(file, html);
    pages++;
  }
  if (!quiet) console.log(`Companion chat on ${pages} app pages; ${Object.values(files).reduce((n, f) => n + f.requests.length, 0)} requests on file.`);
  return { pages, apps, files, registry };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  buildCompanion();
}
