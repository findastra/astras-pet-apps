// The Friendly Farmer's rounds. Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
//
// Daily, from .github/workflows/farmer-daily-rounds.yml (or by hand: node scripts/farmer-rounds-20261009.mjs):
//   1. find pet repos on GitHub that the Cage does not know yet, and add them to the pipeline;
//   2. take each pet's submission (the "cage.submit" block in its own pet.json);
//   3. run the self-audits that are due (each pet on its own cadence and day);
//   4. write status/pets-status.json: every pet's mood and one-line bubble, and what it needs from Astra.
// Then npm run build (metadata only) and the Farmer's desk rebuild show the result.
//
// The pure functions below are what the tests exercise. Nothing here writes outside the Cage repo.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

export const OWNER = 'findastra';
export const CAGE = 'astras-pet-apps';
export const ORDER = ['sleep', 'idle', 'blink', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad'];
export const MOODS = ['idle', 'blink', 'happy', 'curious', 'worried', 'sad', 'sick', 'alarmed', 'sleep'];
export const STATUSES = ['hatching', 'growing', 'grown'];
const DAY = 86400000;

/* ---------------- who is who ---------------- */

/** Every pet the Cage knows: registered pets first, then the pipeline, in order. */
export function allPets(registry) {
  return [
    ...(registry.pets || []).map((p) => ({ ...p, stage: 'registered' })),
    ...(registry.pipeline || []).map((p) => ({ ...p, stage: 'pipeline' })),
  ];
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** What each of the nine moods means for this pet, filled from the shared key and its audit block. */
export function moodKey(registry, pet) {
  const key = registry.mood_key || {};
  const a = pet.audit || {};
  const subject = a.subject || 'my repo', needs = (a.needs || 'something only you can do').replace(/[.?]$/, '');
  const out = {};
  for (const m of MOODS) {
    const line = (pet.moods && pet.moods[m]) || key[m] || '';
    out[m] = line.replaceAll('{Subject}', cap(subject)).replaceAll('{subject}', subject).replaceAll('{needs}', needs).replace(/\.\.$/, '.');
  }
  return out;
}

/** Which weekday (0 = Sunday) a weekly pet audits itself: spread evenly through the week. */
export function auditDay(registry, repo) {
  const i = allPets(registry).findIndex((p) => p.repo === repo);
  return ((i < 0 ? 0 : i) % 7);
}

/** Is this pet's self-audit due today? */
export function isDue(registry, pet, last, today) {
  const cadence = (pet.audit && pet.audit.cadence) || 'weekly';
  const days = (registry.rounds && registry.rounds.cadences && registry.rounds.cadences[cadence]) || 7;
  if (!last || !last.checked) return true;
  const age = (Date.parse(today) - Date.parse(last.checked.slice(0, 10))) / DAY;
  if (days === 7) return (new Date(today + 'T12:00:00Z').getUTCDay() === auditDay(registry, pet.repo) && age >= 1) || age > 7; // its own day, or catch up if it was missed
  return age >= days;
}

/** The mood a status shows right now: a clean check turns to idle after a day. */
export function displayMood(status, nowIso) {
  if (!status) return 'sleep';
  if (status.mood === 'happy' && status.checked && Date.parse(nowIso) - Date.parse(status.checked) > DAY) return 'idle';
  return status.mood;
}

/* ---------------- the self-audit ---------------- */

const short = (s, n = 90) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

// "001-astra-judge-calibration.md" -> "card 001 (judge calibration)"
const cardLabel = (name) => { const [num, ...rest] = name.replace(/\.md$/, '').split('-'); return `card ${num} (${rest.filter((w, i) => i || !/^(astra|any|farmer|goldfish|claude|codex)$/.test(w)).join(' ')})`; };

/** Needs Astra has to answer: an undecided job, or a card waiting on her. */
export function needsFromSnapshot(pet, snap) {
  const needs = [];
  const job = (snap.petJson && snap.petJson.job) || pet.job || '';
  if (/^placeholder\b|not decided/i.test(job)) needs.push((pet.audit && pet.audit.needs) || 'a job: what should I do?');
  for (const card of snap.cards || []) {
    const head = card.text.split('\n').slice(0, 6).join('\n');
    const status = /^status:\s*(.+)$/im.exec(head);
    const forLine = /^for:\s*(.+)$/im.exec(head);
    if (!status || /^done\b/i.test(status[1].trim())) continue;
    const waiting = /waiting on astra[:,]?\s*([^)\n]*)/i.exec(status[1]) || /needs? astra'?s? ([^)\n]+)/i.exec(status[1]);
    if (waiting) needs.push(waiting[1].trim() || cardLabel(card.name));
    else if (forLine && /^astra\b/i.test(forLine[1].trim())) needs.push(cardLabel(card.name));
  }
  return [...new Set(needs.map((n) => n.replace(/[.?]$/, '')))];
}

/** One pet's self-audit, from a snapshot of its repo. Returns { mood, says, needs, findings }. */
export function auditPet(registry, pet, snap) {
  if (!snap || !snap.readable) {
    return { mood: 'sleep', says: snap && snap.private ? "Not checked: the Farmer can't see my private repo yet." : 'Not checked yet.', needs: [], findings: [] };
  }
  const findings = [];
  const f = (sev, msg, label) => findings.push({ sev, msg, label: label || msg });
  const has = (path) => (snap.files || []).includes(path);
  const pj = snap.petJson;
  if (snap.petJsonError) f('error', `pet.json is not valid JSON (${snap.petJsonError}).`, 'fix pet.json');
  else if (!pj) f('error', 'No pet.json, so the Cage cannot read me.', 'add pet.json');
  else {
    for (const k of ['pet', 'job', 'entry', 'status']) if (!pj[k]) f('warn', `pet.json is missing "${k}".`, `add "${k}" to pet.json`);
    if (pj.status && !STATUSES.includes(pj.status)) f('warn', `pet.json status "${pj.status}" is not hatching, growing or grown.`, 'fix my status');
    for (const k of ['entry', 'sprite']) if (typeof pj[k] === 'string' && /\.\w+$/.test(pj[k]) && !has(pj[k])) f('warn', `pet.json "${k}" points at ${pj[k]}, which is not in the repo.`, `my ${k} file is missing`);
    const submitted = pj.cage && pj.cage.submit;
    if (pj.job && pet.job && pj.job !== pet.job && !submitted) f('note', 'My pet.json describes my job differently from the Cage. Submit the one I want (cage.submit) or copy the Cage\'s.', 'my job wording differs from the Cage');
  }
  const readme = snap.readme;
  if (readme == null) f('warn', 'No README.md.', 'add a README');
  else {
    if (!/A pet app by Astra/i.test(readme.split('\n').slice(0, 10).join('\n'))) f('warn', 'README does not open with "A pet app by Astra."', 'my README needs the credit line');
    if (!/^#+ .*(run|start|install|use|get it|open)/im.test(readme)) f('warn', 'README has no "how to run it" section.', 'my README needs "how to run it"');
    if (!/^#+ .*(limit|not done)/im.test(readme)) f('warn', 'README has no "Limits" section.', 'my README needs "Limits"');
  }
  if (!has('AGENTS.md')) f('warn', 'No AGENTS.md, so assistants have no rules for me.', 'add AGENTS.md');
  else if (snap.agents != null && !/astras-pet-apps/.test(snap.agents)) f('warn', 'AGENTS.md does not point at the Cage (astras-pet-apps), so I do not know how to submit changes to the Farmer.', 'my AGENTS.md should point at the Cage');
  if (!has('CLAUDE.md')) f('note', 'No CLAUDE.md.', 'add CLAUDE.md');
  if (!snap.private && !has('LICENSE')) f('warn', 'No LICENSE.', 'add a LICENSE');
  if (!snap.private && Array.isArray(snap.topics) && !snap.topics.includes('pet-app')) f('warn', 'Missing the pet-app topic, so the Cage and the Goldfish cannot find me by topic.', 'add the pet-app topic');

  const needs = needsFromSnapshot(pet, snap);
  const problems = findings.filter((x) => x.sev !== 'note');
  const errors = problems.filter((x) => x.sev === 'error').length;
  let mood, says;
  if (needs.length) { mood = 'sick'; says = `Need: ${needs[0]}${needs.length > 1 ? ` (+${needs.length - 1} more)` : ''}`; }
  else if (errors || problems.length > 5) { mood = 'alarmed'; says = `${problems.length} to fix: ${problems[0].label}${problems.length > 1 ? ', …' : ''}`; }
  else if (problems.length) { mood = 'worried'; says = `${problems.length === 1 ? 'To fix' : problems.length + ' to fix'}: ${problems[0].label}${problems.length > 1 ? ', …' : ''}`; }
  else { mood = 'happy'; says = 'All good.'; }
  return { mood, says: short(says), needs, findings };
}

/** The Farmer audits himself: the registry, the pipeline, and whether he can see every repo. */
export function auditFarmer(registry, ctx) {
  const findings = [], needs = [];
  for (const p of ctx.validateProblems || []) findings.push({ sev: 'error', msg: p });
  if ((ctx.unreadable || []).length) needs.push(`${registry.pets.find((p) => p.role === 'host').audit.needs} (${ctx.unreadable.length} private: ${ctx.unreadable.join(', ')})`);
  const waiting = (registry.pipeline || []).length;
  if (waiting) findings.push({ sev: 'warn', msg: `${waiting} pet${waiting === 1 ? '' : 's'} on GitHub wait to be registered in the Cage.` });
  for (const m of ctx.missing || []) findings.push({ sev: 'warn', msg: `${m} is in the registry but not on GitHub.` });
  const problems = findings.filter((x) => x.sev !== 'note');
  let mood, says;
  if (needs.length) { mood = 'sick'; says = `Need: ${needs[0]}`; }
  else if (problems.some((x) => x.sev === 'error') || problems.length > 5) { mood = 'alarmed'; says = `${problems.length} to fix: ${problems[0].msg}`; }
  else if (problems.length) { mood = 'worried'; says = problems[0].msg; }
  else { mood = 'happy'; says = 'Rounds done: everyone is where they should be.'; }
  return { mood, says: short(says, 140), needs, findings };
}

/* ---------------- submissions and discovery ---------------- */

/**
 * A pet submits a change by editing the "cage.submit" block in its own pet.json, with a date.
 * The Farmer takes it when that date is newer than the last one he took. Returns the list of changes.
 */
export function adoptSubmission(registry, entry, petJson) {
  const sub = petJson && petJson.cage && petJson.cage.submit;
  if (!sub || typeof sub !== 'object' || !/^\d{4}-\d{2}-\d{2}$/.test(sub.date || '')) return [];
  if (entry.submitted && entry.submitted >= sub.date) return [];
  const changes = [];
  const set = (key, value, label = key) => { if (JSON.stringify(entry[key]) !== JSON.stringify(value)) { entry[key] = value; changes.push(label); } };
  if (typeof sub.pet === 'string' && sub.pet.trim()) set('pet', sub.pet.trim().slice(0, 40), 'name');
  if (typeof sub.job === 'string' && sub.job.trim()) set('job', sub.job.trim().slice(0, 300));
  if (STATUSES.includes(sub.status)) set('status', sub.status);
  if (Array.isArray(sub.says)) {
    const lines = sub.says.filter((l) => typeof l === 'string' && l.trim()).map((l) => l.trim().slice(0, 80)).slice(0, 20);
    if (lines.length) set('says', { ...(entry.says || {}), [entry.art || entry.repo]: lines }, 'bubble lines');
  }
  if (sub.moods && typeof sub.moods === 'object') {
    const moods = {};
    for (const m of MOODS) if (typeof sub.moods[m] === 'string' && sub.moods[m].trim()) moods[m] = sub.moods[m].trim().slice(0, 120);
    if (Object.keys(moods).length) set('moods', moods, 'mood key');
  }
  if (sub.audit && typeof sub.audit === 'object') {
    const a = { ...(entry.audit || {}) };
    if (registry.rounds.cadences[sub.audit.cadence]) a.cadence = sub.audit.cadence;
    for (const k of ['subject', 'needs']) if (typeof sub.audit[k] === 'string' && sub.audit[k].trim()) a[k] = sub.audit[k].trim().slice(0, 120);
    set('audit', a, 'audit');
  }
  entry.submitted = sub.date;
  return changes;
}

/** Pet repos on GitHub that the Cage does not list yet become pipeline entries. */
export function discover(registry, repos, today) {
  const known = new Set([...allPets(registry).map((p) => p.repo), registry.cage]);
  const added = [];
  for (const r of repos) {
    if (known.has(r.name) || r.fork || r.archived) continue;
    if (!r.isPet) continue;
    const pj = r.petJson || {};
    const job = typeof pj.job === 'string' && pj.job ? pj.job : (r.description || 'Job not decided yet.');
    const entry = {
      repo: r.name, pet: typeof pj.pet === 'string' && pj.pet ? pj.pet : r.name, visibility: r.private ? 'private' : 'public',
      status: STATUSES.includes(pj.status) ? pj.status : 'hatching', job, added: today,
      audit: { cadence: 'weekly', subject: 'my plan', needs: /^placeholder\b|not decided/i.test(job) ? 'a job: what should I do?' : 'something only you can do' },
      note: `Found on GitHub by the Farmer's round, ${today}.`,
    };
    (registry.pipeline ||= []).push(entry);
    added.push(entry);
  }
  return added;
}

/* ---------------- GitHub (only used by the CLI) ---------------- */

async function gh(path, token, accept = 'application/vnd.github+json') {
  const r = await fetch('https://api.github.com' + path, { headers: { Accept: accept, 'User-Agent': 'friendly-farmer', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${path}`);
  return accept.includes('raw') ? r.text() : r.json();
}

/** The repo list: with a token for the account it includes private repos. */
export async function listRepos(token, ownerToken) {
  const out = [];
  for (let page = 1; page < 10; page++) {
    const path = ownerToken ? `/user/repos?affiliation=owner&per_page=100&page=${page}` : `/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`;
    const batch = await gh(path, ownerToken || token);
    if (!batch || !batch.length) break;
    out.push(...batch.filter((r) => r.owner.login === OWNER));
    if (batch.length < 100) break;
  }
  return out.map((r) => ({ name: r.name, private: r.private, fork: r.fork, archived: r.archived, description: r.description || '', topics: r.topics || [], created: r.created_at, branch: r.default_branch }));
}

/** What the self-audit needs from one repo. */
export async function snapshot(repo, token, full) {
  const raw = (p) => gh(`/repos/${OWNER}/${repo.name}/contents/${p}`, token, 'application/vnd.github.raw');
  const tree = await gh(`/repos/${OWNER}/${repo.name}/git/trees/${repo.branch || 'HEAD'}?recursive=1`, token);
  if (!tree) return { readable: false, private: repo.private };
  const files = tree.tree.filter((t) => t.type === 'blob').map((t) => t.path);
  const snap = { readable: true, private: repo.private, topics: repo.topics, files };
  if (files.includes('pet.json')) {
    const text = await raw('pet.json');
    try { snap.petJson = JSON.parse(text.replace(/^﻿/, '')); } catch (e) { snap.petJsonError = e.message.split('\n')[0]; }
  }
  if (!full) return snap;
  if (files.includes('README.md')) snap.readme = await raw('README.md');
  if (files.includes('AGENTS.md')) snap.agents = await raw('AGENTS.md');
  snap.cards = [];
  for (const name of files.filter((p) => /^handoffs\/\d{3}-.+\.md$/.test(p)).slice(-12)) snap.cards.push({ name: name.slice(9), text: await raw(name) });
  return snap;
}

/* ---------------- the round ---------------- */

export function denverDate(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

export async function runRound({ registry, status, token, ownerToken, validateProblems = [], now = new Date(), log = console.log, only = null, all = false, github = { listRepos, snapshot } }) {
  const today = denverDate(now);
  const repos = await github.listRepos(token, ownerToken);
  const byName = new Map(repos.map((r) => [r.name, r]));
  const report = { today, discovered: [], submissions: [], audited: [], unreadable: [], missing: [] };

  // 1. Discovery: a repo with a pet.json or the pet-app topic is a pet.
  const unknown = repos.filter((r) => !allPets(registry).some((p) => p.repo === r.name) && r.name !== registry.cage && !r.fork && !r.archived);
  for (const r of unknown) {
    const snap = await github.snapshot(r, ownerToken || token, false);
    r.isPet = !!(snap.petJson || r.topics.includes('pet-app'));
    r.petJson = snap.petJson;
  }
  report.discovered = discover(registry, unknown, today).map((p) => p.repo);

  // 2 and 3. Submissions every day; self-audits when due.
  status.pets ||= {};
  registry.pipeline ||= [];
  for (const pet of allPets(registry)) {
    if (pet.repo === registry.cage) continue;
    const entry = [...registry.pets, ...registry.pipeline].find((p) => p.repo === pet.repo);
    const r = byName.get(pet.repo);
    if (!r) {
      if (pet.visibility === 'private' && !ownerToken) report.unreadable.push(pet.repo);
      else report.missing.push(pet.repo);
      status.pets[pet.repo] = { pet: pet.pet, ...auditPet(registry, pet, { readable: false, private: pet.visibility === 'private' }), checked: status.pets[pet.repo]?.checked || null };
      continue;
    }
    if (entry.visibility !== (r.private ? 'private' : 'public')) entry.visibility = r.private ? 'private' : 'public';
    const due = all || (only ? only.includes(pet.repo) : isDue(registry, pet, status.pets[pet.repo], today));
    let snap = await github.snapshot(r, ownerToken || token, due);
    const changes = adoptSubmission(registry, entry, snap.petJson);
    if (changes.length) report.submissions.push({ repo: pet.repo, changes });
    if (due || changes.length) {
      if (!due) snap = await github.snapshot(r, ownerToken || token, true); // a submission is checked straight away
      status.pets[pet.repo] = { pet: entry.pet, ...auditPet(registry, entry, snap), checked: now.toISOString() };
      report.audited.push(pet.repo);
    }
    log(`${pet.repo}: ${status.pets[pet.repo]?.mood || 'not due'}`);
  }

  // 4. The Farmer, daily.
  const host = registry.pets.find((p) => p.role === 'host');
  report.unreadable = [...new Set(report.unreadable)];
  status.pets[host.repo] = { pet: host.pet, ...auditFarmer(registry, { validateProblems, unreadable: report.unreadable, missing: report.missing }), checked: now.toISOString() };
  status.updated = now.toISOString();
  status.needs_astra = allPets(registry).filter((p) => status.pets[p.repo]?.mood === 'sick').map((p) => ({ repo: p.repo, pet: p.pet, need: status.pets[p.repo].needs[0] }));
  return report;
}

/* ---------------- CLI ---------------- */

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const { fileURLToPath } = await import('node:url');
  const { validate } = await import('./lib.mjs');
  process.chdir(fileURLToPath(new URL('..', import.meta.url)));
  const args = process.argv.slice(2);
  const registry = JSON.parse(readFileSync('pets.json', 'utf8'));
  const statusFile = registry.rounds.status_file;
  const status = existsSync(statusFile) ? JSON.parse(readFileSync(statusFile, 'utf8')) : {};
  const art = existsSync('art/frames/index.json') ? JSON.parse(readFileSync('art/frames/index.json', 'utf8')) : undefined;
  const validateProblems = validate(registry, readFileSync('README.md', 'utf8'), art).filter((p) => !/out of date/.test(p));
  const onlyArg = args.find((a) => a.startsWith('--only='));
  const report = await runRound({
    registry, status, validateProblems,
    token: process.env.GITHUB_TOKEN, ownerToken: process.env.FARMER_TOKEN || null,
    only: onlyArg ? onlyArg.slice(7).split(',') : null, all: args.includes('--all'),
  });
  if (!args.includes('--dry-run')) {
    if (report.discovered.length || report.submissions.length || JSON.stringify(registry) !== readFileSync('pets.json', 'utf8')) registry.updated = report.today;
    writeFileSync('pets.json', JSON.stringify(registry, null, 2) + '\n');
    mkdirSync(statusFile.split('/').slice(0, -1).join('/'), { recursive: true });
    writeFileSync(statusFile, JSON.stringify(status, null, 2) + '\n');
  }
  const lines = [
    `Farmer's round, ${report.today}.`,
    report.discovered.length ? `New pets found: ${report.discovered.join(', ')}.` : '',
    ...report.submissions.map((s) => `${s.repo} submitted: ${s.changes.join(', ')}.`),
    `Self-audits run: ${report.audited.length}.`,
    report.unreadable.length ? `Can't see (private, no FARMER_TOKEN): ${report.unreadable.join(', ')}.` : '',
    `Needs Astra: ${status.needs_astra.length}.`,
  ].filter(Boolean);
  console.log(lines.join('\n'));
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `summary=${lines.join(' ').replace(/[\r\n%]/g, ' ')}\n`, { flag: 'a' });
}
