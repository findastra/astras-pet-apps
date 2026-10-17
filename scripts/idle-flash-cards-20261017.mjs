// Idle Flash Audit: owner-facing round cards (Flash Audit section 5) from the evidence ledger.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
//   node scripts/idle-flash-cards-20261017.mjs <ledger.json> <fix-results.json> <names.json> <out-dir> [branch-ledger.json]
// Writes <out-dir>/README.md (index) and one round-NN-<repo>.md per program, for reading on a
// phone or iPad in GitHub. Images are relative to docs/flash-audit-rounds-<date>/ in the hub.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';

const [ledgerPath, fixPath, namesPath, OUT, branchPath] = process.argv.slice(2);
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8')).sort((a, b) => a.number - b.number);
const fixes = existsSync(fixPath) ? JSON.parse(readFileSync(fixPath, 'utf8')) : {};
const names = JSON.parse(readFileSync(namesPath, 'utf8'));
const branch = branchPath && existsSync(branchPath) ? Object.fromEntries(JSON.parse(readFileSync(branchPath, 'utf8')).map((r) => [r.number, r])) : {};
const DATE = '2026-10-17';
const HUB = 'https://github.com/findastra/astras-pet-os';
const UP = '../..';
// The iPad answer sheet (an Artifact made by idle-flash-answers-page-20261017.mjs) for this run.
const ANSWERS = process.env.FLASH_ANSWERS_URL || 'https://claude.ai/artifact/W6FMZthEzhj9EWxBgggCyc';
mkdirSync(OUT, { recursive: true });

// Matrix order (section 3), most important first.
const ORDER = ['A06', 'A07', 'A01', 'A53', 'A09', 'A11', 'A10', 'A54', 'A08', 'A13', 'A14', 'A15', 'A56', 'A57', 'A16', 'A17', 'A55', 'A02', 'A03', 'A04', 'A05', 'A18', 'A19', 'A21', 'A20', 'A48', 'A26', 'A25', 'A27', 'A42', 'A28', 'A22', 'A52', 'A23', 'A24', 'A43', 'A44', 'A45', 'A46', 'A47', 'A50', 'A51', 'A41', 'A39', 'A38', 'A12', 'A31', 'A36', 'A37', 'A40', 'A29', 'A30', 'A32', 'A33', 'A34', 'A35'];
const rank = (c) => { const i = ORDER.indexOf(c); return i < 0 ? 999 : i; };
const TITLE = { A06: 'Pet name', A07: 'Program name', A01: 'Icon', A53: 'Icon matches folder', A09: 'Program page', A10: 'Website route', A54: 'Third-party programs', A13: 'Repo', A14: 'Required files', A15: 'README and credit', A56: 'Saved in its own folder', A57: 'Current names only', A16: 'pet.json', A17: 'Git branches', A55: 'Pictures', A02: 'Nine emotions', A05: 'Art format', A18: 'Tool list', A26: 'Privacy', A52: 'L3 activity bubble', A44: 'Yellow phone', A45: 'Paper and zoom', A41: 'Clicker Training', A31: 'Links' };
const MOODS = [['sleep', 'Sleepy'], ['blink', 'Awake'], ['idle', 'Idle'], ['curious', 'Curious'], ['happy', 'Happy'], ['worried', 'Worried'], ['alarmed', 'Alarmed'], ['sick', 'Sick'], ['sad', 'Sad']];
const PLANNED = new Set(['seed', 'roadmap']);
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
const prShort = (url) => url ? url.replace('https://github.com/findastra/', '').replace('/pull/', '#') : '';

// Retired names and paths are reported under A57 (added tonight), not A56.
const isName = (r) => r.check === 'A56' && /retired/.test(r.detail);
const isPath = (r) => (r.check === 'A56' && !isName(r)) || r.check === 'A26';

function fixedBy(rec, row) {
  const fx = fixes[rec.audited?.repo];
  if (!fx?.pr) return false;
  if (branch[rec.number]) return !!row._fixed;
  const log = fx.log.join('\n');
  if (isName(row)) { const f = row.detail.split(':')[0]; return log.includes(f) && /\.(md|json|html?|txt|ya?ml|svg)$/i.test(f); }
  if (row.fix?.type === 'link') return /Retired names/.test(log) && !/handoffs\/008-farmer/.test(row.detail);
  if (row.fix?.type === 'petjson-job') return /job now matches/.test(log);
  if (row.fix?.type === 'petjson-audit') return /audit block copied/.test(log);
  if (row.fix?.type === 'petjson-name') return /pet "/.test(log);
  if (row.fix?.type === 'credit') return /credit line/.test(log);
  if (row.fix?.type === 'limits') return /Limits section/.test(log);
  if (row.check === 'A14' && /Required files/.test(row.detail)) return row.detail.replace(/^.*?:\s*/, '').split(/,\s*/).every((f) => log.includes(`Added ${f}`));
  if (row.check === 'A14' && /topic/.test(row.detail)) return TOPIC_ADDED.has(rec.audited.repo);
  return false;
}
const TOPIC_ADDED = new Set(['learn-python', 'claude-bot', 'rgbee', 'role-fairy']);

function nextStep(rec, row) {
  const c = row.check, d = row.detail;
  if (row.status === 'On a branch') return `It is built on unmerged branch \`${row.onBranch}\` ([compare](${row.link})): merging that branch passes this.`;
  if (c === 'A01' || c === 'A02' || c === 'A05') return 'Needs pet art. Generating art costs money, so it waits for your OK.';
  if (c === 'A07' || c === 'A06') return 'Your pick: see Decisions.';
  if (c === 'A10' && /sign-in/.test(d)) return 'Not verified: the route needs a sign-in, so nobody else can open it. Decide where this program should live publicly.';
  if (c === 'A10') return 'Give it a real program page, or point the route at one.';
  if (c === 'A13' && /repo_exists/.test(d)) return 'The hub PR for tonight fixes the catalog.';
  if (c === 'A13') return 'The catalog still names the old repo; GitHub redirects it. The hub catalog fix follows the GitHub name.';
  if (c === 'A16' && /submitted|differs/.test(d)) return 'The pet submitted a different job to the Farmer: see Decisions.';
  if (c === 'A16') return 'Framework metadata comes with the shared page framework (Codex\'s branch); not added by hand tonight.';
  if (c === 'A17') return 'See Decisions: open a pull request, merge, or leave each branch.';
  if (c === 'A18') return 'No tool list yet. It comes with the shared page framework.';
  if (c === 'A55' && row.status === 'In progress') return 'The pictures session has a branch for this.';
  if (c === 'A55') return 'Needs real pictures of the program working (you take some: card 026).';
  if (c === 'A54') return 'The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.';
  if (c === 'A31' && /008-farmer/.test(d)) return 'Card 008 (new placeholders) is an old draft on hub PR #5; the pet is already a pipeline pet. The fix PR replaces this line.';
  if (c === 'A31') return 'Fix or remove the link.';
  if (isPath(row)) return 'A stray PC path in code or docs; moving files goes through a File Master plan.';
  if (isName(row)) return 'Inside code (a storage key or a name the code looks for), so it was left alone tonight.';
  if (c === 'A15' && PRODUCT_README.has(rec.audited?.repo)) return 'This README is the product\'s own, so tonight only names and links changed in it. Add a Limits section there?';
  if (c === 'A15' && /title/.test(d)) return 'The title is a naming choice, so it was left alone. Rename the heading?';
  if (c === 'A15') return 'Small README fix.';
  if (c === 'A09') return 'Add the program page and declare it as `entry` in pet.json.';
  return 'Open.';
}

// Group rows by check and status so a card stays short.
function groups(rec, rows) {
  const out = new Map();
  for (const r of rows) {
    const check = isName(r) ? 'A57' : r.check;
    const key = `${check}|${r.status}|${fixedBy(rec, r) ? 'fixed' : 'open'}|${r.onBranch || ''}`;
    if (!out.has(key)) out.set(key, { check, status: r.status, fixed: fixedBy(rec, r), rows: [] });
    out.get(key).rows.push(r);
  }
  return [...out.values()].sort((a, b) => rank(a.check) - rank(b.check) || (a.fixed - b.fixed));
}
function sentence(g) {
  const r = g.rows[0];
  if (g.check === 'A57') return `Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\\Projects) in ${g.rows.map((x) => '`' + x.detail.split(':')[0] + '`').filter((v, i, a) => a.indexOf(v) === i).join(', ')}.`;
  if (g.check === 'A31' && g.rows.length > 1) return `${g.rows.length} links point at the old hub name or a missing file: ${g.rows.map((x) => (x.detail.match(/link (\S+):/) || [])[1]).filter(Boolean).map((u) => `<${u}>`).slice(0, 4).join(', ')}.`;
  if (['A41', 'A44', 'A45', 'A52'].includes(g.check) && r.status === 'On a branch') return r.detail.replace(/ It exists on unmerged branch .*$/, '');
  return g.rows.map((x) => x.detail).join(' ');
}

// With a ledger of the fix branches, "open" is what that branch still shows and "fixed" is what
// the branch no longer shows. Stray-name rows compare by file, so a partly fixed file stays open.
// Rows whose wording changes with the branch (A17 names it; the preflight's A16 "Metadata:" lists what is
// missing) are one row per check, so they are never shown as both open and fixed.
const rowKey = (r) => (r.check === 'A56' || r.check === 'A26') ? `${r.check}|${r.detail.split(':')[0]}|${/retired/.test(r.detail) ? 'name' : 'path'}`
  : r.check === 'A17' ? 'A17' : (r.check === 'A16' && /^Metadata:/.test(r.detail)) ? 'A16|Metadata' : `${r.check}|${r.detail}`;
// A row read from a fix branch is worded against main, which is where Astra merges.
const asMain = (r, fixRef, mainRef) => { if (!fixRef || fixRef === mainRef) return r; const s = (v) => typeof v === 'string' ? v.split(`compare/${fixRef}...`).join(`compare/${mainRef}...`).split(`not on ${fixRef}`).join(`not on ${mainRef}`) : v; return { ...r, detail: s(r.detail), link: s(r.link) }; };
const PRODUCT_README = new Set(['data-dealer']);
const FALSE = existsSync(`${OUT}/false-alarms.json`) ? JSON.parse(readFileSync(`${OUT}/false-alarms.json`, 'utf8')) : [];
const seedSheets = (() => { try { return readdirSync(`${OUT}/${UP}/art/seeds`).filter((f) => f.endsWith('.png')); } catch { return []; } })();
const hubIcons = (() => { try { return readdirSync(`${OUT}/${UP}/art/icons`); } catch { return []; } })();
// The auditor finds icons by repo name; seed and roadmap icons are filed under the pet's name.
const iconOf = (rec) => rec.iconPath || ((f) => f ? `art/icons/${f}` : null)(hubIcons.find((f) => f.startsWith(`${slug(rec.icon)}-`) && f.endsWith('.png')));
const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const index = [];
const allDecisions = [];
for (const rec of ledger) {
  const fx = fixes[rec.audited?.repo] || {};
  const planned = PLANNED.has(rec.stage);
  const b0 = fx.pr && branch[rec.number];
  const b = b0 && { ...b0, rows: b0.rows.map((r) => asMain(r, b0.audited?.ref, rec.audited?.ref)) };
  const keep = (r) => !(r.check === 'A13' && r.status === 'Missing (planned)');
  const fixedRows = b ? rec.rows.filter(keep).filter((r) => !b.rows.some((x) => rowKey(x) === rowKey(r))) : [];
  for (const r of fixedRows) r._fixed = true;
  const rows = b ? [...b.rows.filter(keep), ...fixedRows] : rec.rows.filter(keep);
  // Seeds and roadmap pets: unbuilt parts are Missing (planned), listed on one line.
  const plannedChecks = planned ? rows.filter((r) => (r.check !== 'A01' || !iconOf(rec)) && ['A01', 'A02', 'A05', 'A09', 'A16', 'A18', 'A41', 'A44', 'A45', 'A52', 'A55'].includes(r.check) && r.status !== 'On a branch') : [];
  // False alarms checked by hand (false-alarms.json beside the cards): kept out of the exceptions, said once.
  const isFalse = (r) => FALSE.find((f) => f.repo === rec.audited?.repo && f.check === r.check && r.detail.includes(f.match));
  const falseNotes = [...new Set(rows.filter(isFalse).map((r) => isFalse(r).why))];
  const shown = rows.filter((r) => !isFalse(r) && !plannedChecks.includes(r) && !(planned && r.check === 'A15' && /how to run|model, version|title/.test(r.detail)));
  const gs = groups(rec, shown);
  const open = gs.filter((g) => !g.fixed), done = gs.filter((g) => g.fixed);
  const decisions = [];
  const fname = `round-${String(rec.number).padStart(2, '0')}-${rec.audited?.repo || rec.repo}.md`;

  // Decisions.
  if (names[`${rec.number}-pet`]) decisions.push({ kind: 'Pet name', text: `**Pet name** (it is still \`${rec.icon}\`). Pick one, or write your own:`, options: names[`${rec.number}-pet`] });
  if (names[rec.number] && (!rec.assigned || /^pet-program-/.test(rec.program))) decisions.push({ kind: 'Program name', text: `**Program name** for ${rec.icon} (now \`${rec.program}\`). Pick one, or write your own:`, options: names[rec.number] });
  for (const l of fx.log || []) if (/^Not changed: pet.json job/.test(l)) decisions.push({ kind: 'Job', text: `**Job:** ${rec.icon} submitted its own job to the Farmer (${(l.match(/on (\d{4}-\d\d-\d\d)/) || [])[1] || 'date unknown'}), and the registry says something else. Which one is right?\n  - Pet's own: "${esc(rec.pet?.cage?.submit?.job || rec.pet?.job)}"\n  - Registry: "${esc(rec.rows.find((r) => r.fix?.type === 'petjson-job')?.fix.to)}"` });
  const unmerged = rec.rows.find((r) => r.check === 'A17');
  if (unmerged) decisions.push({ kind: 'Branches', text: `**Branches with work not on ${rec.audited.ref}** and no pull request: ${(rec.branches || []).filter((b) => !(rec.openPRs || []).some((p) => p.head === b.name) && !/pictures-20261017|flash-audit-fixes-20261017/.test(b.name)).map((b) => `[\`${b.name}\`](https://github.com/findastra/${rec.audited.repo}/compare/${rec.audited.ref}...${encodeURIComponent(b.name)}) (+${b.ahead})`).join(', ')}. Open a PR, merge, or leave?` });
  if (rec.repo === 'spoonfed') decisions.push({ kind: 'Visibility', text: '**Spoonfed is public on GitHub**, but the registry and its own provenance file say it is a private, artwork-only repo. Make it private again, or keep it public and update the registry?' });
  if (rec.audited?.repo === 'role-fairy') decisions.push({ kind: 'Art', text: '**Role Fairy needs art** before the Farmer can register it (card 020). Generating art costs money: OK to generate?' });
  if (['pet-program-81', 'the-threshold'].includes(rec.audited?.repo)) decisions.push({ kind: 'Visibility', text: `**Started tonight as a private repo** (the overnight permission check would not create public repos). The other 41 seed and roadmap repos are public. Make it public?` });
  if (/data-dealer/.test(rec.audited?.repo || '') && rec.rows.some((r) => r.check === 'A10')) decisions.push({ kind: 'Route', text: '**Data Dealer\'s program route** is a claude.ai artifact behind a sign-in. Should the route point somewhere public (a GitHub Pages page), or stay private?' });
  if (fx.pr) decisions.push({ kind: 'Merge', text: `**Merge the fix PR** [${prShort(fx.pr)}](${fx.pr})? It only holds fixes that need no decision (listed above).` });
  for (const d of decisions) allDecisions.push({ rec, fname, ...d });

  // The card.
  const L = [];
  L.push(`# Round ${rec.number}: ${rec.icon} — ${rec.program}`, '');
  L.push(`[All rounds](README.md) · Stage: **${rec.stage}** · Repo: ${rec.audited ? `[findastra/${rec.audited.repo}](https://github.com/findastra/${rec.audited.repo}) (${rec.repoMeta?.private ? 'private' : 'public'})` : 'none'}${rec.audited?.commit ? ` · audited \`${rec.audited.ref}\` at \`${rec.audited.commit.slice(0, 7)}\`` : ''}`, '');
  const icon = iconOf(rec) ? `<img src="${UP}/${iconOf(rec)}" width="88" alt="${esc(rec.icon)} icon">` : '*Icon: Missing*';
  L.push(icon, '');
  if (rec.frames && Object.keys(rec.frames).length) {
    L.push(`| ${MOODS.map(([, n]) => n).join(' | ')} |`, `|${MOODS.map(() => ':-:').join('|')}|`);
    L.push(`| ${MOODS.map(([m]) => rec.frames[m] ? `<img src="${UP}/${rec.frames[m]}" width="64" alt="${m}">` : '—').join(' | ')} |`, '');
  } else {
    const sheet = seedSheets.find((f) => f.startsWith(`${slug(rec.icon)}-sheet-`));
    if (sheet) L.push(`<img src="${UP}/art/seeds/${sheet}" width="360" alt="${esc(rec.icon)} draft sheet"><br>*Draft seed sheet (not approved art; no frames in the hub yet).*`, '');
    else L.push('*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*', '');
  }
  if (fx.pr) L.push(`**Fix PR waiting for you:** [${prShort(fx.pr)}](${fx.pr})`, '');

  L.push('### Exceptions', '');
  if (!open.length && !plannedChecks.length) L.push('No exceptions left in the checks completed (live clicking, desktop launch and tutorials are Not verified overnight).');
  let n = 0;
  for (const g of open) L.push(`${++n}. **${g.check} ${TITLE[g.check] || ''}** — ${g.status}. ${sentence(g)}  \n   *Next:* ${nextStep(rec, g.rows[0])}`);
  for (const w of falseNotes) L.push(`${++n}. **Checked by hand, not a problem:** ${w}`);
  if (plannedChecks.length) L.push(`${++n}. **Not built yet (planned):** ${[...new Set(plannedChecks.map((r) => r.check))].sort((a, b) => rank(a) - rank(b)).map((c) => `${c} ${TITLE[c] || ''}`.trim()).join(', ')}. Normal for a ${rec.stage}; not a failure.`);
  L.push('');
  if (done.length) {
    L.push('### Fixed tonight (in the fix PR, waiting for your merge)', '');
    for (const g of done) L.push(`- **${g.check} ${TITLE[g.check] || ''}** — ${sentence(g)}`);
    L.push('');
  }
  if (fx.log?.length) { L.push('<details><summary>What the fix PR changes, exactly</summary>', ''); for (const l of fx.log) L.push(`- ${l}`); L.push('', '</details>', ''); }

  L.push('### Decisions', '');
  if (!decisions.length) L.push('None.');
  let k = 0;
  for (const d of decisions) {
    L.push(`${++k}. ${d.text}`);
    if (d.options) for (const [i, [nm, why]] of d.options.entries()) L.push(`   - **${String.fromCharCode(65 + i)}. ${nm}** — ${why}`);
  }
  L.push('');
  L.push('**Tools:** none declared in pet.json yet (A18).  ', '**Tutorial tools:** Play with, Care for — Not verified overnight.', '');
  L.push(`<sub>Idle Flash Audit, ${DATE}, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>`, '');
  writeFileSync(`${OUT}/${fname}`, L.join('\n'));
  index.push({ rec, fname, open: open.length + (plannedChecks.length ? 1 : 0), fixed: done.length, decisions: decisions.filter((d) => d.kind !== 'Merge').length, pr: fx.pr });
}

// Index.
const I = [];
I.push('# Flash Audit rounds, 2026-10-17 (Idle Flash Audit)', '');
I.push(`Rounds 3 to 83, one card per pet program, in the [Flash Audit](${HUB}/blob/main/docs/flash-audit-20261014.md) owner-round format: pictures, then exceptions (most important first), then decisions. Rounds 1 (Farmer) and 2 (Goldfish) were done with Codex on 2026-10-14. How this run works: [Idle Flash Audit](../idle-flash-audit-20261017.md).`, '');
I.push('**On the iPad:** answer on the [Flash Audit Answers](' + ANSWERS + ') page (open it in Claude; every tap saves, and the next assistant reads the answers there), or tap a round below and answer in chat in any shape, for example `31 A`, `59 wait`, `merge all`. Nothing changes until you answer.', '');
I.push('## Answer these first', '');
const top = [
  ['Merge the fix PRs', `${Object.values(fixes).filter((f) => f.pr).length} pull requests hold only fixes that need no decision. Tap through them below, or say **merge all** and Claude merges each one whose checks pass.`],
  ['Spoonfed is public', 'The registry and its provenance file say it is a private, artwork-only repo. [Round 20](round-20-spoonfed.md).'],
  ['Codex\'s shared page framework', 'Clicker Training, the yellow phone, paper and zoom, and the L3 bubble (A41, A44, A45, A52) are built on Codex branches (`codex/l3-activity-20261016` and others) with no pull requests. Merging them clears four checks on most pets. See each round\'s Branches decision.'],
  ['Four old hub PRs', '[#5](https://github.com/findastra/astras-pet-os/pull/5) is an old draft card 008 for five placeholder pets that are already pipeline pets (tonight\'s fix PRs replace the eight README lines that pointed at it); [#4](https://github.com/findastra/astras-pet-os/pull/4) (Backup Beaver candidate) and [#3](https://github.com/findastra/astras-pet-os/pull/3) (Meme Fiend in the Cage) are pipeline pets now; [#1](https://github.com/findastra/astras-pet-os/pull/1) is about the retired Cage. Close them?'],
  ['Two new repos are private', '`pet-program-81` (Intel Owl) and `the-threshold` (Door Dormouse) were started tonight as private repos; the other 41 seed and roadmap repos are public. Make them public?'],
  ['Folder rename', 'Renaming `Documents\\Astra\'s Pet Apps` to `Astra\'s PetOS` was tried at 04:16 and Windows said the folder was in use (most likely the Claude app\'s open chats), so nothing changed. Close the Claude app and Codex, then run `rename-petos-folder-20261017.ps1 -Apply` from File Master\'s plan folder (`file-master\\reports\\2026-10-17_rename-astras-petos`), or ask an assistant to.'],
  ['Pending pet submissions','The Astral Plane, Mail Snail, Raspberry Pi Berry and Voicemeeter Bug each submitted a job that differs from the registry. Their rounds show both.'],
];
for (const [h, t] of top) I.push(`- **${h}.** ${t}`);
I.push('');
I.push('## Every round', '');
I.push('| Round | Pet | Program | Stage | Open | Fixed in PR | Decisions | Fix PR |', '|--:|---|---|---|--:|--:|--:|---|');
for (const x of index) {
  const ic = iconOf(x.rec) ? `<img src="${UP}/${iconOf(x.rec)}" width="28" alt=""> ` : '';
  I.push(`| [${x.rec.number}](${x.fname}) | ${ic}[${esc(x.rec.icon)}](${x.fname}) | ${esc(x.rec.program)} | ${x.rec.stage} | ${x.open} | ${x.fixed} | ${x.decisions} | ${x.pr ? `[${prShort(x.pr)}](${x.pr})` : '—'} |`);
}
I.push('');
I.push('## All fix PRs in one list', '');
for (const x of index) if (x.pr) I.push(`- [${prShort(x.pr)}](${x.pr}) — Round ${x.rec.number}, ${x.rec.icon}`);
I.push('');
I.push(`<sub>Idle Flash Audit, ${DATE}, Claude Opus 5.5 (\`claude-opus-5-5\`). Built by \`scripts/idle-flash-cards-20261017.mjs\` from the evidence ledger in this folder.</sub>`, '');
writeFileSync(`${OUT}/README.md`, I.join('\n'));
writeFileSync(`${OUT}/decisions.json`, JSON.stringify(allDecisions.map((d) => ({ round: d.rec.number, pet: d.rec.icon, program: d.rec.program, repo: d.rec.audited?.repo || d.rec.repo, card: d.fname, kind: d.kind, text: d.text, options: d.options || null })), null, 1));
console.error(`wrote ${index.length} rounds and the index to ${OUT}`);
