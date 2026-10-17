// Idle Flash Audit: the read-only auditor. Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
// How to run it: docs/idle-flash-audit-20261017.md.
//   node scripts/idle-flash-audit-20261017.mjs <out-dir> [3,4,5]   (AUDIT_REF=<branch> audits that branch where it exists)
// Reads every pet program in astras-pet-os/pet-programs.json through the GitHub API (default
// branch, private repos included via gh), reuses Goldfish's preflight, adds the static checks
// it lacks, and writes an evidence ledger. Never executes repository code, never writes to a repo.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Goldfish's local preflight (github-goldfish/scripts/flash-audit-local-20261015.mjs) adds the
// framework checks. Without it those checks are reported Not verified.
const PREFLIGHT = process.env.FLASH_PREFLIGHT || resolve(dirname(fileURLToPath(import.meta.url)), '../../github-goldfish/scripts/flash-audit-local-20261015.mjs');
let inspectSnapshot = () => [{ check: 'A18', status: 'Not verified', detail: `Goldfish preflight not found at ${PREFLIGHT}.` }];
try { ({ inspectSnapshot } = await import(pathToFileURL(PREFLIGHT).href)); } catch { console.error(`Goldfish preflight not found (${PREFLIGHT}): its checks are Not verified.`); }

const OWNER = 'findastra';
const HUB = 'astras-pet-os';
const OUT = process.argv[2] || 'audit-out';
const ONLY = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
mkdirSync(OUT, { recursive: true });

const ghRaw = (path, accept) => {
  try {
    return execFileSync('gh', ['api', ...(accept ? ['-H', `Accept: ${accept}`] : []), path], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { return null; }
};
const gh = (path) => { const t = ghRaw(path); try { return t ? JSON.parse(t) : null; } catch { return null; } };
const file = (repo, path, ref) => ghRaw(`repos/${OWNER}/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`, 'application/vnd.github.raw');
const treeCache = {};
const tree = (repo, ref) => (treeCache[repo + '@' + ref] ??= (gh(`repos/${OWNER}/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`)?.tree || []).map((t) => t.path));

const hubFile = (p) => file(HUB, p, 'main');
const catalog = JSON.parse(hubFile('pet-programs.json')).programs;
const registry = JSON.parse(hubFile('pets.json'));
const systemMap = JSON.parse(hubFile('system-map.json'));
const frames = JSON.parse(hubFile('art/frames/index.json'));
const levels = hubFile('INTELLIGENCE-LEVELS.md');
const hubTree = tree(HUB, 'main');

// INTELLIGENCE-LEVELS.md rows, keyed by repo.
const levelRows = {};
for (const line of levels.split('\n')) {
  if (!line.startsWith('| <img')) continue;
  const c = line.split('|').map((s) => s.trim());
  const repo = (c[4].match(/\]\(https:\/\/github\.com\/findastra\/([^)]+)\)/) || [])[1] || c[4];
  levelRows[repo] = { pet: c[2], kind: c[3], program: c[5], runtime: c[6], updates: c[7], harness: c[8], errors: c[9] };
}

const regEntry = (repo) => {
  for (const [stage, list] of [['registered', registry.pets], ['pipeline', registry.pipeline], ['seed', (registry.seeds && registry.seeds.pets) || registry.seeds], ['candidate', registry.candidates]]) {
    const e = (Array.isArray(list) ? list : []).find((x) => x.repo === repo);
    if (e) return { stage, e };
  }
  return { stage: null, e: null };
};

const titleCase = (s) => s.split('-').map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
const norm = (s) => (s || '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const placeholder = (s) => /pet-program-\d+|icon-\d+|placeholder|not decided|to be decided/i.test(s || '');
const STRAY = [
  // Made-up user folders in examples and test fixtures (you, example, <name>) are not personal paths.
  [/[A-Z]:\\{1,2}Users\\{1,2}(?!(?:you|example|user|name|<[^>]*>)\\)[^\\\s"'`]+/gi, 'a personal C:\\Users path'],
  [/Documents[\\/]Projects/g, 'the retired Documents\\Projects folder'],
  [/Astra['’]s Pet Apps/g, "the retired name Astra's Pet Apps"],
  [/astras-pet-apps/g, 'the retired repo name astras-pet-apps'],
  [/findastra-pet-apps/g, 'the retired repo name findastra-pet-apps'],
  [/Documents[\\/](Codex|ChatGPT)[\\/]/g, 'a dated chat folder'],
];

async function checkUrl(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch(url, { method, redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': 'astras-petos-flash-audit' } });
      clearTimeout(t);
      if (method === 'HEAD' && (r.status === 405 || r.status === 403)) continue;
      return { status: r.status, final: r.url };
    } catch (e) { if (method === 'GET') return { status: 0, final: url, error: String(e.name || e) }; }
  }
}
const urlCache = {};
const check = (u) => (urlCache[u] ??= checkUrl(u));

// A findastra GitHub link: check it with gh (private repos 404 to anonymous fetches).
function checkGithubLink(u) {
  const m = u.match(/^https:\/\/github\.com\/findastra\/([^/#?]+)(?:\/(blob|tree)\/([^/]+)\/([^#?]*))?/);
  if (!m) return null;
  const [, repo, kind, ref, path] = m;
  const meta = gh(`repos/${OWNER}/${repo}`);
  if (!meta) return { ok: false, why: `repo findastra/${repo} does not exist` };
  if (meta.name !== repo) return { ok: false, why: `repo renamed: ${repo} is now ${meta.name}`, fix: u.replace(`/findastra/${repo}`, `/findastra/${meta.name}`) };
  if (kind && path) {
    const t = tree(repo, ref);
    const p = decodeURIComponent(path).replace(/\/$/, '');
    if (t.length && !t.includes(p) && !t.some((x) => x.startsWith(p + '/'))) return { ok: false, why: `${p} is not on ${ref} of ${repo}` };
  }
  return { ok: true, private: meta.private };
}

const pagesUrl = (repo) => `https://findastra.github.io/${repo}/`;
const ledger = [];

for (const prog of catalog) {
  if (prog.number < 3) continue;
  if (ONLY.length && !ONLY.includes(prog.number)) continue;
  const rows = [];
  const add = (check, status, detail, extra = {}) => rows.push({ check, status, detail, ...extra });
  const { stage: regStage, e: reg } = regEntry(prog.repo);
  const rec = { number: prog.number, icon: prog.icon, program: prog.program, assigned: prog.assigned, idea: prog.idea, stage: prog.stage, repo: prog.repo, regStage, rows, fixes: [], decisions: [] };

  // ---- 1. Is it a pet, and is it named
  if (placeholder(prog.icon)) { add('A06', 'Missing', `Pet name is still the placeholder "${prog.icon}".`); rec.decisions.push({ kind: 'pet-name' }); }
  if (!prog.assigned || placeholder(prog.program)) { add('A07', 'Missing', `Program name not chosen${prog.idea ? ` (suggested idea: ${typeof prog.idea === 'string' ? prog.idea : JSON.stringify(prog.idea)})` : ''}.`); rec.decisions.push({ kind: 'program-name', idea: prog.idea }); }

  // Always ask GitHub: the catalog's repo_exists can be stale (it said false for 41 repos made 2026-10-14).
  const meta = prog.repo ? gh(`repos/${OWNER}/${prog.repo}`) : null;
  if (meta && prog.repo_exists === false) add('A13', 'Incorrect', `Catalog says repo_exists false, but ${meta.name} is on GitHub.`, { fix: { type: 'catalog-exists' } });
  rec.repoMeta = meta ? { private: meta.private, default_branch: meta.default_branch, pushed_at: meta.pushed_at, homepage: meta.homepage, topics: meta.topics, renamed: meta.name !== prog.repo ? meta.name : null, archived: meta.archived } : null;

  if (!meta) {
    if (prog.stage === 'seed' || prog.stage === 'roadmap') add('A13', 'Missing (planned)', `No repo yet (${prog.stage}).`);
    else add('A13', 'Missing', `Catalog says repo ${prog.repo} but it is not on GitHub.`);
    ledger.push(rec); writeFileSync(`${OUT}/ledger.json`, JSON.stringify(ledger, null, 1));
    console.error(`#${prog.number} ${prog.icon}: no repo`); continue;
  }
  if (meta.name !== prog.repo) add('A13', 'Incorrect', `Catalog repo ${prog.repo} redirects to ${meta.name}.`, { fix: { type: 'catalog-repo', to: meta.name } });

  // AUDIT_REF audits a named branch where it exists (used to see what a fix branch leaves).
  const wantRef = process.env.AUDIT_REF;
  const ref = wantRef && gh(`repos/${OWNER}/${meta.name}/branches/${encodeURIComponent(wantRef)}`) ? wantRef : meta.default_branch;
  const head = gh(`repos/${OWNER}/${meta.name}/commits/${ref}`)?.sha;
  rec.audited = { repo: meta.name, ref, commit: head };
  const t = tree(meta.name, ref);
  const read = (p) => (t.includes(p) ? file(meta.name, p, ref) : null);
  const petRaw = read('pet.json');
  let pet = null; try { pet = petRaw ? JSON.parse(petRaw) : null; } catch { add('A16', 'Incorrect', 'pet.json is not valid JSON.'); }
  rec.pet = pet;
  const readme = read('README.md') || '';
  const entryPath = pet?.entry && t.includes(pet.entry) ? pet.entry : null;
  const entry = entryPath ? read(entryPath) || '' : '';
  rec.entryPath = entryPath;

  // Names across every list (A06 / A07).
  const names = { catalog: prog.icon, registry: reg?.pet, 'pet.json': pet?.pet, 'INTELLIGENCE-LEVELS': levelRows[prog.repo]?.pet };
  const mapNode = systemMap.nodes.find((n) => n.id === prog.repo || (reg?.art && n.id === reg.art));
  if (mapNode) names['System Map'] = mapNode.name;
  const differ = Object.entries(names).filter(([, v]) => v && norm(v) !== norm(prog.icon));
  if (differ.length) add('A06', 'Incorrect', `Pet name differs from the catalog ("${prog.icon}"): ${differ.map(([k, v]) => `${k} says "${v}"`).join('; ')}.`, { fix: differ.some(([k]) => k === 'pet.json') ? { type: 'petjson-name', to: prog.icon } : null });
  const title = (entry.match(/<title>([^<]*)<\/title>/i) || [])[1];
  rec.pageTitle = title;
  if (title && prog.assigned && !norm(title).includes(norm(prog.program)) && !norm(title).includes(norm(prog.icon))) add('A07', 'Incorrect', `Page title "${title}" names neither the pet nor the program "${prog.program}".`);

  // A01 icon, A02/A05 frames.
  const art = reg?.art;
  const icon = hubTree.find((p) => p.startsWith('art/icons/') && (p.includes(`/${prog.repo}-`) || (art && p.includes(`/${art}-`))));
  rec.iconPath = icon || null;
  if (!icon) add('A01', 'Missing', 'No icon in astras-pet-os art/icons.');
  const fr = art ? frames.pets[art] : null;
  rec.frames = fr ? fr.frames : null;
  if (regStage === 'registered' && !fr) add('A02', 'Missing', `Registered, but art "${art}" has no frames in art/frames/index.json.`);
  if (fr && fr.placeholder) add('A05', 'Incorrect', `Frames are a placeholder: ${fr.placeholder}`);

  // A53 is checked on the PC separately (folder icons and shortcuts).

  // A09 interface and A10 route.
  if (!pet?.entry) add('A09', 'Missing', 'pet.json declares no entry (the program page).');
  else if (!entryPath) add('A09', 'Missing', `Entry ${pet.entry} is not in the repo.`);
  const routes = [...new Set([reg?.interface_live_url, meta.homepage, !meta.private ? pagesUrl(meta.name) : null].filter((u) => u && /^https?:/.test(u)))];
  rec.routes = [];
  for (const u of routes) {
    const r = await check(u);
    rec.routes.push({ url: u, ...r });
    if (u === pagesUrl(meta.name) && u !== reg?.interface_live_url && u !== meta.homepage) continue; // only informative
    if (!r || r.status >= 400 || r.status === 0) add('A10', 'Incorrect', `Program route ${u} answers ${r?.status || r?.error}.`);
    else if (/^https:\/\/github\.com\/findastra\/[^/]+\/?$/.test(r.final)) add('A10', 'Incorrect', `Program route ${u} is a repo page posing as the program.`);
    else if (/claude\.ai|accounts\.google|login/.test(r.final)) add('A10', 'Not verified', `Program route ${u} lands behind a sign-in (${new URL(r.final).host}).`);
  }
  if (!routes.length) add('A10', 'Missing', 'No program URL (private repo with no hosted page, or none configured).');

  // A54 third-party programs.
  const madeByOthers = ((levelRows[prog.repo]?.program || '').split('**Made by others:**')[1] || '').replace(/<[^>]+>/g, '').trim();
  rec.thirdParty = { levels: madeByOthers || null, pet: pet?.third_party_programs || pet?.third_party || null, page: /Third Party Programs/i.test(entry) };
  if (madeByOthers && !/Third Party Programs/i.test(entry) && entryPath) add('A54', 'Missing', `INTELLIGENCE-LEVELS lists programs made by others (${madeByOthers.slice(0, 120)}) but the page has no Third Party Programs row.`);

  // ---- 2. Where the work lives
  const pre = inspectSnapshot({ files: t, metadata: pet, entry });
  for (const r of pre) if (r.status !== 'Pass' && !['A19', 'A20', 'A21', 'A22', 'A25', 'A26', 'A27', 'A28', 'A29', 'A30', 'A32', 'A39', 'A43', 'A46', 'A47', 'A48', 'A49', 'A50', 'A51'].includes(r.check)) add(r.check, r.status, r.detail, { source: 'goldfish preflight' });
  const required = ['LICENSE', 'AGENTS.md', 'CLAUDE.md'].filter((f) => !t.includes(f));
  if (required.length) rec.fixes.push({ type: 'add-files', files: required });
  if (!meta.private && !(meta.topics || []).includes('pet-app')) add('A14', 'Missing', 'Public pet repo without the pet-app topic.', { fix: { type: 'topic' } });

  // A15 README.
  const h1 = (readme.match(/^#\s+(.+)$/m) || [])[1];
  const want = titleCase(meta.name);
  if (!readme) add('A15', 'Missing', 'No README.md.');
  else {
    if (h1 && norm(h1) !== norm(want) && norm(h1) !== norm(prog.icon)) add('A15', 'Incorrect', `README title "${h1}" is neither the repo name in Title Case ("${want}") nor the pet name.`);
    if (!/A pet app by Astra/i.test(readme)) add('A15', 'Missing', 'README lacks the credit line "*A pet app by Astra.*".', { fix: { type: 'credit' } });
    if (!/^#{2,3}\s.*(run|start|install|use|open|get it|download|quick)/im.test(readme)) add('A15', 'Missing', 'README has no "how to run it" section.');
    if (!/^#{2,3}\s.*(limit|not done|known|what.*(can|doesn))/im.test(readme)) add('A15', 'Missing', 'README has no Limits section.', { fix: { type: 'limits' } });
    if (!/(Claude|Codex|GPT|Opus|Sonnet|Haiku)[^\n]{0,80}20\d\d-\d\d-\d\d/.test(readme + (pet?.built_with || ''))) add('A15', 'Missing', 'No model, version and date recorded.');
  }

  // A56 stray paths and retired names, in every text file at the top of the repo plus the entry.
  const textFiles = t.filter((p) => /\.(md|json|html|js|mjs|cjs|ps1|cmd|bat|cs|txt|yml|yaml)$/i.test(p) && !p.includes('node_modules') && !/^handoffs\//.test(p) && !/^docs\/.*(handoff|publications|audit)/.test(p)).slice(0, 120);
  rec.stray = [];
  for (const p of textFiles) {
    const txt = p === entryPath ? entry : (p === 'README.md' ? readme : (p === 'pet.json' ? petRaw : read(p)));
    if (!txt) continue;
    for (const [re, what] of STRAY) {
      const m = txt.match(re);
      if (m) rec.stray.push({ file: p, what, count: m.length, sample: m[0].replace(/C:\\Users\\[^\\]+/, '%USERPROFILE%') });
    }
  }
  for (const s of rec.stray) add(s.what.includes('personal') ? 'A26' : 'A56', 'Incorrect', `${s.file}: ${s.count}× ${s.what} (e.g. "${s.sample}").`, { fix: { type: 'stray', file: s.file, what: s.what } });

  // A16 metadata vs registry.
  if (pet && reg) {
    if (reg.job && pet.job && norm(reg.job) !== norm(pet.job)) add('A16', 'Incorrect', `pet.json job differs from the registry. pet.json: "${pet.job.slice(0, 140)}"`, { fix: { type: 'petjson-job', to: reg.job } });
    if (reg.status && pet.status && reg.status !== pet.status) add('A16', 'Incorrect', `pet.json status "${pet.status}" differs from the registry "${reg.status}".`);
    if (reg.audit && !pet.audit) add('A16', 'Missing', 'pet.json has no audit block (the registry has one).', { fix: { type: 'petjson-audit', audit: reg.audit } });
  }
  if (pet?.cage?.repository && /astras-pet-apps|findastra-pet-apps/.test(pet.cage.repository)) rec.fixes.push({ type: 'petjson-hub-link' });

  // A17 git: unmerged branches and the local copy.
  const branches = gh(`repos/${OWNER}/${meta.name}/branches?per_page=100`) || [];
  rec.branches = [];
  for (const b of branches) {
    if (b.name === ref) continue;
    const cmp = gh(`repos/${OWNER}/${meta.name}/compare/${encodeURIComponent(ref)}...${encodeURIComponent(b.name)}`);
    if (cmp && cmp.ahead_by > 0) rec.branches.push({ name: b.name, ahead: cmp.ahead_by, behind: cmp.behind_by });
  }
  const prs = gh(`repos/${OWNER}/${meta.name}/pulls?state=open&per_page=50`) || [];
  rec.openPRs = prs.map((p) => ({ number: p.number, title: p.title, url: p.html_url, head: p.head.ref }));
  const unmergedNoPR = rec.branches.filter((b) => !prs.some((p) => p.head.ref === b.name) && !/pictures-20261017/.test(b.name));
  if (unmergedNoPR.length) add('A17', 'Incorrect', `${unmergedNoPR.length} branch(es) with work not on ${ref} and no open pull request: ${unmergedNoPR.map((b) => `${b.name} (+${b.ahead})`).join(', ')}.`);

  // Framework parts missing on the default branch may exist on an unmerged branch: say where.
  const markers = { A41: 'Clicker Training', A44: 'data-astra-phone-baseline', A45: 'data-astra-paper-data', A52: 'data-astra-l3-config' };
  const missingFw = rows.filter((r) => markers[r.check] && r.status === 'Missing');
  if (missingFw.length && entryPath) {
    for (const b of [...rec.branches].sort((a, b2) => b2.ahead - a.ahead)) {
      const src = file(meta.name, entryPath, b.name) || '';
      for (const r of missingFw) if (!r.onBranch && src.includes(markers[r.check])) {
        r.onBranch = b.name; r.status = 'On a branch';
        r.detail += ` It exists on unmerged branch ${b.name}.`;
        r.link = `https://github.com/${OWNER}/${meta.name}/compare/${ref}...${b.name}`;
      }
    }
  }

  // A55 pictures.
  const imgs = (readme.match(/!\[[^\]]*\]\([^)]+\)|<img\s/gi) || []).length;
  const picsBranch = rec.branches.find((b) => /pictures-20261017/.test(b.name));
  if (imgs < 2) add('A55', picsBranch ? 'In progress' : 'Missing', `README shows ${imgs} picture(s).${picsBranch ? ' Pictures are being added on claude/pictures-20261017 by another session tonight.' : ''}`);

  // Links in README and pet.json.
  const urls = [...new Set([...(readme.match(/https?:\/\/[^\s)\]>"'`]+/g) || []), ...((petRaw || '').match(/https?:\/\/[^\s"]+/g) || [])].map((u) => u.replace(/[.,;:]+$/, '')))];
  rec.links = [];
  for (const u of urls.slice(0, 60)) {
    const g = checkGithubLink(u);
    if (g) { if (!g.ok) rec.links.push({ url: u, problem: g.why, fix: g.fix || null }); continue; }
    if (/localhost|127\.0\.0\.1|example\.(com|org)/.test(u)) continue;
    const r = await check(u);
    if (!r || r.status === 0 || r.status === 404 || r.status === 410) rec.links.push({ url: u, problem: r?.error || `answers ${r?.status}` });
  }
  // Relative links in the README to files that are not in the repo.
  for (const m of readme.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)/g)) {
    const p = decodeURIComponent(m[1]).replace(/^\.\//, '');
    if (!t.includes(p) && !t.some((x) => x.startsWith(p.replace(/\/$/, '') + '/'))) rec.links.push({ url: m[1], problem: 'relative link to a file that is not in the repo' });
  }
  for (const l of rec.links) add('A31', 'Incorrect', `Broken link ${l.url}: ${l.problem}.`, { fix: l.fix ? { type: 'link', from: l.url, to: l.fix } : null });

  ledger.push(rec);
  writeFileSync(`${OUT}/ledger.json`, JSON.stringify(ledger, null, 1));
  console.error(`#${prog.number} ${prog.icon}: ${rows.length} findings`);
}
console.error('done');
