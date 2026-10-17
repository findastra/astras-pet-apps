// Idle Flash Audit: the iPad answer sheet (an Artifact page). Claude Opus 5.5, 2026-10-17.
//   node scripts/idle-flash-answers-page-20261017.mjs <decisions.json> <ledger.json> <fix-results.json> <hub-dir> <out.html> <cards-base-url>
// Every decision from the round cards becomes a tap-to-answer card. Answers are saved in the
// page's db (collection "answers", one document per decision), where the next assistant reads them.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

const [decPath, ledgerPath, fixPath, hubDir, outPath, cardsBase] = process.argv.slice(2);
const decisions = JSON.parse(readFileSync(decPath, 'utf8'));
const ledger = Object.fromEntries(JSON.parse(readFileSync(ledgerPath, 'utf8')).map((r) => [r.number, r]));
const fixes = JSON.parse(readFileSync(fixPath, 'utf8'));
const icons = {};
const slug = (s) => String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const iconFor = (n) => {
  let p = ledger[n]?.iconPath;
  if (!p && ledger[n]) { const f = readdirSync(`${hubDir}/art/icons`).find((x) => x.startsWith(`${slug(ledger[n].icon)}-`) && x.endsWith('.png')); if (f) p = `art/icons/${f}`; }
  if (!p || !existsSync(`${hubDir}/${p}`)) return null;
  icons[n] ??= 'data:image/png;base64,' + readFileSync(`${hubDir}/${p}`).toString('base64');
  return n;
};
const strip = (s) => String(s || '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '').trim();
const links = (s) => [...String(s || '').matchAll(/\[([^\]]+)\]\((https:[^)]+)\)/g)].map((m) => ({ label: m[1].replace(/`/g, ''), url: m[2] }));

const OPTIONS = {
  'Job': ['Keep the pet’s own job', 'Keep the registry’s job', 'Neither: I’ll write it'],
  'Branches': ['Open pull requests so I can look', 'Merge them', 'Leave them for now'],
  'Visibility': null,
  'Art': ['Yes, generate the art', 'Not now'],
  'Route': ['Give it a public page', 'Keep it private'],
};
const items = [];
// The questions that matter most, first.
const prCount = Object.values(fixes).filter((f) => f.pr).length;
items.push({ id: 'top-merge-all', group: 'First', title: `Merge the ${prCount} fix pull requests?`, body: `Each one holds only fixes that need no decision: today's names, missing files, README credit and Limits, pet.json catching up with the registry. Say how you want them merged.`, options: ['Merge all of them', 'Merge all except the ones I note', 'I’ll tap through them myself'] });
items.push({ id: 'top-codex-framework', group: 'First', title: 'Codex’s shared page framework', body: 'Clicker Training, the yellow phone, paper and zoom, and the L3 activity bubble (A41, A44, A45, A52) are built on Codex branches such as codex/l3-activity-20261016, with no pull requests. Merging them clears four checks on most pets.', options: ['Ask Codex to open pull requests', 'Merge them', 'Leave them for now'] });
items.push({ id: 'top-old-hub-prs', group: 'First', title: 'Close four old hub pull requests?', body: '#5 is an old draft card 008 that registers five placeholder pets, which are already pipeline pets (the card table lists that draft as dropped; tonight’s fix PRs replace the README lines that pointed at it). #4 adds Backup Beaver as a candidate and #3 registers Meme Fiend in the Cage: both are pipeline pets now. #1 describes how pets move in the Cage, which is retired.', options: ['Close all four', 'Close the ones I note', 'Keep them'], links: [5, 4, 3, 1].map((n) => ({ label: 'Hub PR #' + n, url: 'https://github.com/findastra/astras-pet-os/pull/' + n })) });
items.push({ id: 'top-folder-rename', group: 'First', title: 'Rename the folder to Astra’s PetOS', body: 'Tried at 04:16 and Windows said the folder was in use (most likely the Claude app’s open chats), so nothing changed. To finish: close the Claude app and Codex, then run the rename script from File Master’s plan folder (or ask an assistant to).', options: ['I’ll close the apps; rename it next', 'Wait'] });
for (const d of decisions) {
  if (d.kind === 'Merge') continue;
  const id = `r${d.round}-${d.kind.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  let options = OPTIONS[d.kind];
  if (d.kind === 'Visibility') options = /Spoonfed/.test(d.text) ? ['Make it private again', 'Keep it public (update the registry)'] : ['Make it public', 'Keep it private'];
  if (d.options) options = d.options.map(([n]) => n);
  const body = d.kind === 'Job' ? d.text.split('\n').slice(1).map((l) => strip(l.replace(/^\s*-\s*/, ''))).join('\n') : strip(d.text);
  items.push({ id, group: d.kind === 'Program name' || d.kind === 'Pet name' ? 'Names' : 'Other', round: d.round, pet: d.pet, program: d.program, icon: iconFor(d.round), kind: d.kind,
    title: d.kind === 'Program name' ? `${d.pet}: program name` : d.kind === 'Pet name' ? `Round ${d.round}: pet name` : `${d.pet}: ${d.kind.toLowerCase()}`,
    body: d.options ? '' : body, reasons: d.options ? d.options.map(([, why]) => why) : null, options, own: !!d.options || d.kind === 'Job',
    links: [{ label: `Round ${d.round} card`, url: `${cardsBase}/${d.card}` }, ...links(d.text).filter((l) => /compare|pull/.test(l.url)).slice(0, 6)] });
}
const data = { generated: '2026-10-17', cardsIndex: `${cardsBase}/README.md`, items, icons };
const json = JSON.stringify(data).replaceAll('<', '\\u003c');

const html = `<title>Flash Audit Answers</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500;700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap">
<style>
/* Layout: one tall column of answer cards, like a clipboard of pet check-ups; a sticky tally on top. */
:root {
  --paper: #e6e5ec; --card: #f7f6fb; --ink: #16141c; --muted: #5a5668; --line: #16141c;
  --pick: #ff2fa8; --pick-ink: #16141c; --chip: #ffffff; --done: #12a26a; --soft: #d9d7e3;
  --display: "Pixelify Sans", "Courier New", monospace; --body: "Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --paper: #15131b; --card: #1f1c28; --ink: #f1eff7; --muted: #aaa5bb; --line: #f1eff7; --pick: #ff4fb8; --pick-ink: #15131b; --chip: #2a2635; --done: #3ddc97; --soft: #2f2b3b; color-scheme: dark } }
:root[data-theme="dark"] { --paper: #15131b; --card: #1f1c28; --ink: #f1eff7; --muted: #aaa5bb; --line: #f1eff7; --pick: #ff4fb8; --pick-ink: #15131b; --chip: #2a2635; --done: #3ddc97; --soft: #2f2b3b; color-scheme: dark }
* { box-sizing: border-box }
body { background: var(--paper); color: var(--ink); font: 17px/1.5 var(--body); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 0 48px }
.wrap { max-width: 760px; margin: 0 auto; display: grid; gap: 18px }
header.top { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 2; background: var(--paper); padding-block: 14px 10px; border-bottom: 2px solid var(--line); display: grid; gap: 8px }
h1 { font: 700 1.6rem/1.1 var(--display); margin: 0; letter-spacing: .01em; text-wrap: balance }
.tally { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: .95rem; color: var(--muted) }
.bar { flex: 1 1 160px; height: 12px; border: 2px solid var(--line); background: var(--chip); min-width: 120px }
.bar i { display: block; height: 100%; width: 0; background: var(--done); transition: width .3s }
.filters { display: flex; gap: 8px; flex-wrap: wrap }
button, .chip { font: inherit }
.filter { border: 2px solid var(--line); background: var(--chip); color: var(--ink); padding: 6px 12px; min-height: 40px; cursor: pointer }
.filter[aria-pressed="true"] { background: var(--ink); color: var(--paper) }
.note-top { font-size: .92rem; color: var(--muted); margin: 0 }
.status { font-size: .9rem; padding: 8px 12px; border: 2px dashed var(--line); background: var(--card) }
h2 { font: 700 1.15rem/1.2 var(--display); margin: 12px 0 0; text-transform: uppercase; letter-spacing: .06em }
.card { background: var(--card); border: 2px solid var(--line); box-shadow: 4px 4px 0 var(--line); padding: 16px; display: grid; gap: 12px; min-width: 0 }
.card.answered { box-shadow: 4px 4px 0 var(--done) }
.head { display: flex; gap: 12px; align-items: center }
.head img { width: 56px; height: 56px; image-rendering: pixelated; flex: none }
.head .ph { width: 56px; height: 56px; flex: none; border: 2px dashed var(--muted); display: grid; place-items: center; font: 700 .8rem var(--display); color: var(--muted) }
h3 { font: 700 1.12rem/1.25 var(--body); margin: 0; text-wrap: balance }
.round { font-size: .82rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em }
.body { margin: 0; white-space: pre-line; color: var(--ink) }
.opts { display: grid; gap: 8px }
.opt { display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: start; text-align: left; border: 2px solid var(--line); background: var(--chip); color: var(--ink); padding: 10px 12px; min-height: 48px; cursor: pointer }
.opt b { font-weight: 700 }
.opt small { display: block; color: var(--muted); font-size: .88rem }
.opt .key { font: 700 .95rem var(--display); width: 1.6em; text-align: center }
.opt[aria-pressed="true"] { background: var(--pick); color: var(--pick-ink); }
.opt[aria-pressed="true"] small { color: var(--pick-ink) }
.opt:focus-visible, .filter:focus-visible, textarea:focus-visible, a:focus-visible { outline: 3px solid var(--pick); outline-offset: 2px }
label.own { font-size: .9rem; color: var(--muted); display: grid; gap: 4px }
textarea { font: inherit; width: 100%; min-height: 48px; border: 2px solid var(--line); background: var(--chip); color: var(--ink); padding: 8px 10px; resize: vertical }
.links { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: .9rem }
.links a { color: var(--ink); text-decoration-color: var(--pick); text-decoration-thickness: 2px; text-underline-offset: 3px; overflow-wrap: anywhere }
.saved { font-size: .85rem; color: var(--done); min-height: 1.2em }
.copy { border: 2px solid var(--line); background: var(--ink); color: var(--paper); padding: 10px 14px; min-height: 44px; cursor: pointer; justify-self: start }
footer { font-size: .85rem; color: var(--muted) }
@media (prefers-reduced-motion: reduce) { .bar i { transition: none } }
</style>
<div class="wrap">
  <header class="top">
    <h1>Flash Audit Answers</h1>
    <div class="tally"><span id="count">0 answered</span><span class="bar" aria-hidden="true"><i id="fill"></i></span></div>
    <div class="filters" role="group" aria-label="Show">
      <button class="filter" id="f-open" aria-pressed="true" type="button">Still to answer</button>
      <button class="filter" id="f-all" aria-pressed="false" type="button">Everything</button>
    </div>
  </header>
  <p class="note-top">From the Idle Flash Audit of 17 October. Tap an answer; it saves right away, and the next assistant reads it from here. Nothing changes on GitHub until an assistant acts on your answers. The full round cards, with pictures and every finding: <a id="cards" href="#">all rounds</a>.</p>
  <div class="status" id="status" hidden></div>
  <main id="list" class="wrap"></main>
  <button class="copy" id="copy" type="button">Copy my answers as text</button>
  <footer>Made by Claude Opus 5.5 for Astra’s PetOS. Answers are kept in this page’s own store.</footer>
</div>
<script type="application/json" id="data">${json}</script>
<script>
(function () {
  const DATA = JSON.parse(document.getElementById('data').textContent);
  document.getElementById('cards').href = DATA.cardsIndex;
  const answers = {};               // id -> {choice, note}
  let db = null, mode = 'open';
  const list = document.getElementById('list');
  const status = document.getElementById('status');
  const say = (t) => { status.hidden = !t; status.textContent = t || ''; };
  const local = { get() { try { return JSON.parse(localStorage.getItem('fa-answers') || '{}'); } catch { return {}; } }, set(v) { try { localStorage.setItem('fa-answers', JSON.stringify(v)); } catch {} } };

  function el(tag, attrs, ...kids) { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs || {})) { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v); } for (const k of kids) if (k) e.append(k); return e; }

  function render() {
    list.replaceChildren();
    let group = null, shown = 0;
    for (const it of DATA.items) {
      const a = answers[it.id];
      const isDone = !!(a && (a.choice || (a.note || '').trim()));
      if (mode === 'open' && isDone && !it._keep) continue;
      if (it.group !== group) { group = it.group; list.append(el('h2', { text: group === 'First' ? 'Answer these first' : group === 'Names' ? 'Names to choose' : 'Other decisions' })); }
      shown++;
      const card = el('section', { class: 'card' + (isDone ? ' answered' : ''), id: 'c-' + it.id });
      const head = el('div', { class: 'head' });
      if (it.icon && DATA.icons[it.icon]) head.append(el('img', { src: DATA.icons[it.icon], alt: (it.pet || '') + ' icon' }));
      else if (it.round) head.append(el('div', { class: 'ph', text: String(it.round) }));
      const ht = el('div', {});
      if (it.round) ht.append(el('div', { class: 'round', text: 'Round ' + it.round + (it.program ? ' · ' + it.program : '') }));
      ht.append(el('h3', { text: it.title }));
      head.append(ht); card.append(head);
      if (it.body) card.append(el('p', { class: 'body', text: it.body }));
      const opts = el('div', { class: 'opts', role: 'group', 'aria-label': it.title });
      (it.options || []).forEach((o, i) => {
        const b = el('button', { class: 'opt', type: 'button', id: 'o-' + it.id + '-' + i, 'aria-pressed': String(a && a.choice === o) });
        b.append(el('span', { class: 'key', text: it.reasons ? String.fromCharCode(65 + i) : '•' }));
        const t = el('span', {}); t.append(el('b', { text: o })); if (it.reasons && it.reasons[i]) t.append(el('small', { text: it.reasons[i] }));
        b.append(t);
        b.addEventListener('click', () => { it._keep = true; save(it.id, { choice: a && a.choice === o ? '' : o }); });
        opts.append(b);
      });
      card.append(opts);
      const lab = el('label', { class: 'own', for: 'n-' + it.id, text: it.own ? 'Or write your own (and any note):' : 'Note (optional):' });
      const ta = el('textarea', { id: 'n-' + it.id, rows: '1' }); ta.value = (a && a.note) || '';
      let timer = null;
      ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { it._keep = true; save(it.id, { note: ta.value }); }, 900); });
      lab.append(ta); card.append(lab);
      if (it.links && it.links.length) { const l = el('div', { class: 'links' }); for (const k of it.links) l.append(el('a', { href: k.url, target: '_blank', rel: 'noopener', text: k.label })); card.append(l); }
      card.append(el('div', { class: 'saved', id: 's-' + it.id, text: a && a.at ? 'Saved' : '' }));
      list.append(card);
    }
    if (!shown) list.append(el('p', { class: 'status', text: 'Everything has an answer. Tap “Everything” to look them over.' }));
    const n = DATA.items.filter((it) => { const a = answers[it.id]; return a && (a.choice || (a.note || '').trim()); }).length;
    document.getElementById('count').textContent = n + ' of ' + DATA.items.length + ' answered';
    document.getElementById('fill').style.width = (100 * n / DATA.items.length) + '%';
  }

  const busy = {};
  async function save(id, patch) {
    const it = DATA.items.find((x) => x.id === id);
    const next = Object.assign({ choice: '', note: '' }, answers[id] || {}, patch, { at: new Date().toISOString() });
    answers[id] = next;
    const focusId = document.activeElement && document.activeElement.id;
    render();
    if (focusId) { const f = document.getElementById(focusId); if (f) f.focus({ preventScroll: true }); }
    local.set(answers);
    if (!db) return;
    while (busy[id]) await busy[id];
    const body = { round: it.round || 0, pet: it.pet || '', kind: it.kind || it.group, question: it.title, choice: next.choice, note: next.note, at: next.at };
    busy[id] = db.collection('answers').doc(id).set(body).then(() => { const s = document.getElementById('s-' + id); if (s) s.textContent = 'Saved'; }, (e) => { say(e && e.code === 'invalid_argument' ? 'This view can read answers but not save them. Your taps are kept in this browser; use “Copy my answers”.' : 'Could not save just now (' + (e && e.code) + '). Your answer is kept in this browser; tap it again later.'); }).finally(() => { busy[id] = null; });
  }

  document.getElementById('f-open').addEventListener('click', () => { mode = 'open'; DATA.items.forEach((i) => { i._keep = false; }); document.getElementById('f-open').setAttribute('aria-pressed', 'true'); document.getElementById('f-all').setAttribute('aria-pressed', 'false'); render(); });
  document.getElementById('f-all').addEventListener('click', () => { mode = 'all'; document.getElementById('f-all').setAttribute('aria-pressed', 'true'); document.getElementById('f-open').setAttribute('aria-pressed', 'false'); render(); });
  document.getElementById('copy').addEventListener('click', async (ev) => {
    const lines = DATA.items.filter((it) => answers[it.id] && (answers[it.id].choice || answers[it.id].note)).map((it) => (it.round ? 'Round ' + it.round + ' ' : '') + it.title + ': ' + [answers[it.id].choice, answers[it.id].note].filter(Boolean).join(' — '));
    const text = lines.join('\\n') || 'No answers yet.';
    try { await navigator.clipboard.writeText(text); ev.target.textContent = 'Copied'; } catch { say(text); }
    setTimeout(() => { ev.target.textContent = 'Copy my answers as text'; }, 1800);
  });

  Object.assign(answers, local.get());
  render();
  (async () => {
    try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch { db = null; }
    if (!db) { say('Answers are kept in this browser only here. Open the page in Claude while signed in to save them for the assistant, or use “Copy my answers”.'); return; }
    db.collection('answers').onSnapshot((snap) => {
      for (const d of snap.docs) { const v = d.data() || {}; answers[d.id] = { choice: v.choice || '', note: v.note || '', at: v.at || '' }; }
      local.set(answers);
      if (!document.activeElement || document.activeElement.tagName !== 'TEXTAREA') render();
    }, () => say('Live updates stopped. Reload the page to see the newest answers.'));
  })();
})();
</script>
`;
writeFileSync(outPath, html);
console.error(`answer sheet: ${items.length} questions, ${Object.keys(icons).length} icons, ${(html.length / 1024).toFixed(0)} KB`);
