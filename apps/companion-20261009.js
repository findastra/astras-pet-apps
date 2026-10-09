// Each app's pocket companion, like Chip on Data Dealer. Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
// Hand-written; scripts/companion-20261009.mjs adds it to each page with data-app="<repo>".
//
// The pet waits in a small pocket device at the bottom right. Click it and its chat pops up
// over the page; nothing is added inside the page itself. Two tabs:
//   EDITS  what Astra has asked for: questions that need her, upcoming edits, and made ones
//   CHAT   what she has said and what the pet said back
// What Astra types is logged as a request and kept in this browser until an assistant puts it
// on file in requests/<repo>.json ("Copy for an assistant" gives her the text to paste).
// Requests on file come in through companion-data-20261009.js: made ones leave Upcoming, and a
// "needs-astra" one makes the pet sick and puts a badge on the device until she answers.
// Inside Claude (window.claude available) the pet also answers in its own words, like Chip.
// All text goes into the page with textContent.
(() => {
  const script = document.currentScript;
  const repo = script && script.dataset.app;
  const DATA = window.COMPANION_DATA;
  const app = DATA && DATA.apps && DATA.apps[repo];
  if (!app || document.getElementById('cmp-open')) return;

  const KEY = 'astras-pet-apps:companion:' + repo + ':v1';
  const store = {
    load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v === 'object' ? v : null; } catch { return null; } },
    save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch { return false; } },
  };
  const state = Object.assign({ messages: [], pending: [], answers: [], seenDone: null, view: 'edits' }, store.load() || {});
  const today = () => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value])); return `${p.year}-${p.month}-${p.day}`; };
  const onFile = app.requests || [];
  const fileIds = new Set(onFile.map((r) => r.id));
  // A request typed here leaves this browser's list once an assistant has put it on file.
  state.pending = state.pending.filter((r) => !fileIds.has(r.id));
  state.answers = state.answers.filter((a) => { const r = onFile.find((x) => x.id === a.id); return !r || r.status === 'needs-astra'; });
  const needs = () => onFile.filter((r) => r.status === 'needs-astra');
  // Questions for Astra are shown under Needs you, so Upcoming lists only the work.
  const upcoming = () => [...onFile.filter((r) => r.status === 'open' || r.status === 'in-progress'), ...state.pending];
  const made = () => onFile.filter((r) => r.status === 'done').sort((a, b) => (b.done || '').localeCompare(a.done || ''));
  // The Farmer also keeps an eye on every other app that is waiting on Astra.
  const otherNeeds = () => app.host ? Object.entries(DATA.apps).filter(([id, a]) => id !== repo && (a.requests || []).some((r) => r.status === 'needs-astra')) : [];
  const alertCount = () => needs().length + otherNeeds().reduce((s, [, a]) => s + a.requests.filter((r) => r.status === 'needs-astra').length, 0);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- look: a pocket device in the pet's own colour ---------- */
  const shell = app.shell || '#d9e25a', ink = app.ink || '#0a0b05';
  const css = `
  .cmp-root{all:initial;--shell:${shell};--ink:${ink};--lcd:color-mix(in srgb,${shell} 22%,#fbfaf2);--lcd-ink:#1d1a22;--muted:#5d5866;--warn:#b3261e;--line:color-mix(in srgb,#1d1a22 18%,transparent);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--lcd-ink)}
  .cmp-root *{box-sizing:border-box;font:inherit;color:inherit;margin:0;padding:0;letter-spacing:normal;text-transform:none}
  .cmp-root button{cursor:pointer;border:0;background:none;text-align:center}
  .cmp-root button:focus-visible,.cmp-root input:focus-visible,.cmp-root textarea:focus-visible,.cmp-root summary:focus-visible,.cmp-root a:focus-visible{outline:3px solid var(--ink);outline-offset:2px}
  .cmp-launch{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:76px;height:92px;border-radius:24px 24px 28px 28px!important;background:var(--shell)!important;border:3px solid var(--ink)!important;box-shadow:0 0 0 3px var(--shell),0 4px 14px rgba(0,0,0,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
  .cmp-launch::before{content:"";position:absolute;top:-14px;left:14px;width:8px;height:12px;background:var(--shell);border:3px solid var(--ink);border-bottom:0;border-radius:5px 5px 0 0}
  .cmp-launch .cmp-scr{width:54px;height:46px;background:var(--lcd);border:3px solid var(--ink);border-radius:9px;display:grid;place-items:center;overflow:hidden}
  .cmp-launch img{width:42px;height:42px;object-fit:contain;image-rendering:pixelated}
  .cmp-launch .cmp-lbl{font:800 10px/1 ui-monospace,Consolas,monospace;color:var(--ink);letter-spacing:.12em}
  .cmp-badge{position:absolute;top:-10px;right:-10px;min-width:24px;background:var(--warn);color:#fff!important;font:800 12px/1 ui-monospace,Consolas,monospace;border-radius:999px;padding:5px 7px;border:2px solid #fff;text-align:center}
  .cmp-launch:hover{transform:translateY(-2px)}
  .cmp-launch.cmp-calling{animation:cmp-call 1.6s ease-in-out infinite}
  @keyframes cmp-call{0%,100%{transform:rotate(0)}8%{transform:rotate(-6deg)}16%{transform:rotate(6deg)}24%{transform:rotate(0)}}
  .cmp-panel{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483001;width:min(400px,calc(100vw - 32px));height:min(640px,calc(100vh - 110px));height:min(640px,calc(100dvh - 110px));background:var(--shell);border:3px solid var(--ink);border-radius:34px 34px 40px 40px;box-shadow:0 0 0 3px var(--shell),0 10px 30px rgba(0,0,0,.35);display:flex;flex-direction:column;padding:14px 14px 16px;gap:10px;color:var(--ink)}
  .cmp-panel::before{content:"";position:absolute;top:-18px;left:34px;width:10px;height:15px;background:var(--shell);border:3px solid var(--ink);border-bottom:0;border-radius:6px 6px 0 0}
  .cmp-panel[hidden],.cmp-launch[hidden],.cmp-root [hidden]{display:none!important}
  .cmp-head{display:flex;align-items:center;gap:10px}
  .cmp-head b{font:800 17px/1.1 ui-monospace,Consolas,monospace;letter-spacing:.04em;text-transform:uppercase}
  .cmp-head span{font:600 11px/1.2 ui-monospace,Consolas,monospace;opacity:.8}
  .cmp-x{margin-left:auto;width:32px;height:32px;border-radius:50%;background:var(--ink)!important;color:var(--shell)!important;font:800 18px/1 ui-monospace,monospace!important;flex:none;display:grid;place-items:center}
  .cmp-lcd{background:var(--lcd);color:var(--lcd-ink);border:3px solid var(--ink);border-radius:14px}
  .cmp-screen{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:center;padding:8px 12px}
  .cmp-screen img{width:84px;height:84px;object-fit:contain;image-rendering:pixelated;display:block}
  .cmp-stats{display:grid;gap:5px;font:700 12px/1.2 ui-monospace,Consolas,monospace}
  .cmp-stats .cmp-warn{color:var(--warn)}
  .cmp-tabs{display:flex;gap:6px}
  .cmp-tabs button{flex:1;display:flex!important;align-items:center;justify-content:center!important;text-align:center!important;border:3px solid var(--ink)!important;border-radius:10px;padding:7px 0;font:800 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.08em;color:var(--ink)}
  .cmp-tabs button[aria-pressed="true"]{background:var(--ink)!important;color:var(--shell)!important}
  .cmp-view{flex:1;min-height:0;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:10px}
  .cmp-h{font:800 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
  .cmp-h.cmp-warn{color:var(--warn)}
  .cmp-root ul{list-style:none;display:grid;gap:7px}
  .cmp-root li{background:#fff;border:1px solid var(--line);border-radius:10px;padding:7px 10px}
  .cmp-q{font-weight:700}
  .cmp-meta{color:var(--muted);font-size:12px;margin-top:2px}
  .cmp-tag{display:inline-block;font:800 10px/1.4 ui-monospace,Consolas,monospace;text-transform:uppercase;letter-spacing:.05em;border:1px solid currentColor;border-radius:6px;padding:0 5px;margin-right:6px;color:var(--muted)}
  .cmp-reply{display:flex;gap:6px;margin-top:6px}
  .cmp-reply input,.cmp-in textarea{flex:1;min-width:0;background:#fff;color:var(--lcd-ink);border:2px solid var(--ink);border-radius:10px;padding:6px 10px}
  .cmp-small{display:inline-flex!important;align-items:center;justify-content:center!important;background:var(--ink)!important;color:var(--shell)!important;border-radius:10px;padding:6px 12px;font:800 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.06em}
  .cmp-small:disabled{opacity:.45;cursor:default}
  .cmp-root a{color:var(--lcd-ink);text-decoration:underline}
  .cmp-root details summary{cursor:pointer}
  .cmp-root details ul{margin-top:7px}
  .cmp-empty{color:var(--muted)}
  .cmp-msg{max-width:88%;padding:7px 10px;border-radius:12px;white-space:pre-wrap;overflow-wrap:anywhere}
  .cmp-msg.me{align-self:flex-end;background:var(--ink);color:var(--shell)}
  .cmp-msg.pet{align-self:flex-start;background:#fff;border:1px solid var(--line)}
  .cmp-copy{width:100%;min-height:110px;border:2px solid var(--ink);border-radius:10px;padding:8px;background:#fff;font:12px/1.4 ui-monospace,Consolas,monospace!important}
  .cmp-in{display:flex;gap:8px;align-items:stretch}
  .cmp-in textarea{min-height:42px;max-height:120px;resize:none}
  .cmp-in button{background:var(--ink)!important;color:var(--shell)!important;border-radius:12px;padding:0 14px;font:800 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.08em}
  @media (max-width:520px){.cmp-panel{right:12px;left:12px;width:auto}.cmp-launch{right:12px}}
  @media (prefers-reduced-motion:reduce){.cmp-launch:hover{transform:none}.cmp-launch.cmp-calling{animation:none}}`;
  const style = document.createElement('style'); style.textContent = css; document.head.append(style);

  const h = (tag, text, cls, parent) => { const e = document.createElement(tag); if (text != null) e.textContent = text; if (cls) e.className = cls; if (parent) parent.append(e); return e; };
  const btn = (parent, label, onClick, cls = '') => { const b = h('button', label, cls, parent); b.type = 'button'; b.onclick = onClick; return b; };

  const root = h('div', null, 'cmp-root', document.body);
  // The pocket device at the bottom right.
  const launch = btn(root, null, () => open(), 'cmp-launch'); launch.id = 'cmp-open';
  const lscr = h('span', null, 'cmp-scr', launch); const lface = h('img', null, '', lscr); lface.alt = '';
  h('span', 'CHAT', 'cmp-lbl', launch);
  const badge = h('span', '', 'cmp-badge', launch); badge.hidden = true;
  // The chat that pops up over the page.
  const panel = h('section', null, 'cmp-panel', root); panel.hidden = true; panel.id = 'cmp-panel';
  panel.setAttribute('aria-label', `${app.name}: chat and edits`);
  const head = h('div', null, 'cmp-head', panel);
  h('b', app.name, '', head);
  h('span', app.host ? 'looks after\nall your apps' : 'app companion', '', head).style.whiteSpace = 'pre-line';
  btn(head, '×', () => close(), 'cmp-x').setAttribute('aria-label', `Close ${app.name}`);
  const screen = h('div', null, 'cmp-lcd cmp-screen', panel);
  const face = h('img', null, '', screen); face.alt = '';
  const stats = h('div', null, 'cmp-stats', screen);
  const statState = h('div', '', '', stats); statState.setAttribute('role', 'status');
  const statUp = h('div', '', '', stats);
  const statMade = h('div', '', '', stats);
  const tabs = h('div', null, 'cmp-tabs', panel); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', `${app.name} views`);
  const tabEdits = btn(tabs, 'EDITS', () => setView('edits'));
  const tabChat = btn(tabs, 'CHAT', () => setView('chat'));
  const edits = h('div', null, 'cmp-lcd cmp-view', panel);
  const log = h('div', null, 'cmp-lcd cmp-view', panel); log.setAttribute('aria-live', 'polite');
  const form = h('form', null, 'cmp-in', panel);
  const input = h('textarea', null, '', form);
  input.placeholder = `Tell ${app.name} what you want…`;
  input.setAttribute('aria-label', `Message ${app.name}`);
  const send = h('button', 'SEND', '', form); send.type = 'submit';

  function open() { panel.hidden = false; launch.hidden = true; setView(state.view); drawAll(); input.focus(); }
  function close() { panel.hidden = true; launch.hidden = false; launch.focus(); }
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
  function setView(v) {
    state.view = v === 'chat' ? 'chat' : 'edits'; save();
    tabEdits.setAttribute('aria-pressed', String(state.view === 'edits')); tabChat.setAttribute('aria-pressed', String(state.view === 'chat'));
    edits.hidden = state.view !== 'edits'; log.hidden = state.view !== 'chat';
    if (state.view === 'chat') log.scrollTop = log.scrollHeight;
  }

  const save = () => { if (!store.save(state)) { /* private window: the chat still works until the page closes */ } };
  function addMsg(who, text) { state.messages.push({ who, text, at: new Date().toISOString() }); state.messages = state.messages.slice(-200); save(); drawLog(); }
  function say(text) { addMsg('pet', text); }

  /* ---------- drawing ---------- */
  function mood() { return needs().length ? 'sick' : upcoming().length ? 'curious' : made().length ? 'happy' : 'idle'; }
  function drawFace() {
    const src = app.frames[mood()] || app.frames.idle;
    for (const img of [face, lface]) if (src) img.src = src;
    const n = needs().length, others = otherNeeds(), total = alertCount(), u = upcoming().length;
    statState.className = n || others.length ? 'cmp-warn' : '';
    statState.textContent = n ? `NEEDS YOU · ${n}` : others.length ? `${others.length} APP${others.length === 1 ? '' : 'S'} NEED YOU` : u ? 'WORKING ON IT' : 'ALL CLEAR';
    statUp.textContent = `UPCOMING · ${u}`;
    statMade.textContent = `MADE · ${made().length}`;
    tabEdits.textContent = `EDITS${total ? ' · ' + total + '!' : u ? ' · ' + u : ''}`;
    badge.hidden = !total; badge.textContent = String(total);
    launch.classList.toggle('cmp-calling', !!total && !reduced);
    launch.setAttribute('aria-label', total ? `Open chat with ${app.name}. ${total} question${total === 1 ? '' : 's'} need you.` : `Open chat with ${app.name}`);
  }
  function item(list, r) {
    const li = h('li', null, '', list);
    const p = h('p', null, '', li);
    if (r.status === 'in-progress') h('span', 'in progress', 'cmp-tag', p);
    else if (r.local) h('span', r.copied ? 'copied' : 'only here', 'cmp-tag', p);
    p.append(document.createTextNode(r.said));
    const bits = [`logged ${r.logged}`];
    if (r.status === 'done') bits.push(`made ${r.done}${r.by ? ' by ' + r.by : ''}`);
    h('p', bits.join(' · '), 'cmp-meta', li);
    if (r.note) h('p', r.note, 'cmp-meta', li);
  }
  function drawEdits() {
    edits.replaceChildren();
    const mine = needs(), others = otherNeeds();
    if (mine.length || others.length) {
      h('p', 'Needs you', 'cmp-h cmp-warn', edits);
      const ul = h('ul', null, '', edits);
      for (const r of mine) {
        const li = h('li', null, '', ul);
        h('p', r.question, 'cmp-q', li);
        h('p', `About: ${r.said}`, 'cmp-meta', li);
        const given = state.answers.find((a) => a.id === r.id);
        if (given) h('p', `Your answer: ${given.text}. Copy it for an assistant to hand it over.`, 'cmp-meta', li);
        const row = h('form', null, 'cmp-reply', li);
        const ans = h('input', null, '', row); ans.placeholder = 'Your answer'; ans.setAttribute('aria-label', 'Answer: ' + r.question);
        const ok = h('button', 'ANSWER', 'cmp-small', row); ok.type = 'submit';
        row.onsubmit = (e) => {
          e.preventDefault(); const text = ans.value.trim(); if (!text) return;
          state.answers = state.answers.filter((a) => a.id !== r.id).concat({ id: r.id, text, at: today() });
          addMsg('me', text);
          say('Thanks, noted. Press Copy for an assistant and paste it to Claude or Codex so they can carry on.');
          drawAll();
        };
      }
      for (const [, other] of others) {
        const li = h('li', null, '', ul);
        const a = h('a', other.name, 'cmp-q', h('p', null, '', li)); a.href = other.page;
        for (const r of other.requests.filter((x) => x.status === 'needs-astra')) h('p', r.question, 'cmp-meta', li);
      }
    }
    h('p', 'Upcoming edits', 'cmp-h', edits);
    const list = upcoming();
    if (!list.length) h('p', 'Nothing waiting. Anything you tell me shows up here until it’s made.', 'cmp-empty', edits);
    else { const ul = h('ul', null, '', edits); for (const r of list) item(ul, r); }
    const done = made();
    if (done.length) {
      const d = h('details', null, '', edits);
      h('summary', `Made · ${done.length}`, 'cmp-h', d);
      const ul = h('ul', null, '', d); for (const r of done) item(ul, r);
    }
    const handover = btn(edits, 'COPY FOR AN ASSISTANT', () => copyForAssistant(), 'cmp-small');
    handover.disabled = !state.pending.length && !state.answers.length;
    handover.title = handover.disabled ? 'Nothing new to hand over yet' : 'Copy your new requests and answers to paste to Claude or Codex';
  }
  function drawLog() {
    log.replaceChildren();
    for (const m of state.messages) h('div', m.text, 'cmp-msg ' + (m.who === 'me' ? 'me' : 'pet'), log);
    log.scrollTop = log.scrollHeight;
  }
  function drawAll() { drawFace(); drawEdits(); drawLog(); }

  /* ---------- handing requests to an assistant ---------- */
  function handoverText() {
    const lines = [`Requests for ${app.name} from its app page. Repo findastra/astras-pet-apps, file requests/${repo}.json.`];
    if (state.pending.length) { lines.push('', 'New requests:'); for (const r of state.pending) lines.push(`- [${r.id}] ${r.said} (logged ${r.logged})`); }
    if (state.answers.length) {
      lines.push('', 'Answers to your questions:');
      for (const a of state.answers) { const r = onFile.find((x) => x.id === a.id); lines.push(`- [${a.id}] ${r ? r.question + ' → ' : ''}${a.text}`); }
    }
    lines.push('', 'Follow requests/README.md: put new requests on file with these ids, use the answers, do the work, and mark each request done.');
    return lines.join('\n');
  }
  async function copyForAssistant() {
    const text = handoverText();
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch { /* shown below instead */ }
    for (const r of state.pending) r.copied = true;
    save();
    drawAll();
    if (copied) { say('Copied. Paste it to Claude or Codex. Each request leaves Upcoming once it’s been made.'); return; }
    say('Your browser wouldn’t let me copy, so the text is in the box on the Edits tab. Select it and copy it.');
    const area = h('textarea', null, 'cmp-copy', edits); area.value = text; area.readOnly = true; area.setAttribute('aria-label', 'Text to paste to an assistant');
    setView('edits'); area.focus(); area.select();
  }

  /* ---------- talking ---------- */
  let sample;
  async function getSample() {
    if (sample !== undefined) return sample;
    try { sample = window.claude && window.claude.use ? await window.claude.use('sample') : null; } catch { sample = null; }
    return sample;
  }
  async function claudeReply(text) {
    const s = await getSample(); if (!s) return null;
    const context = {
      app: app.name, job: app.job,
      needs_you: needs().map((r) => ({ said: r.said, question: r.question })),
      upcoming: upcoming().map((r) => ({ said: r.said, status: r.local ? 'not on file yet' : r.status })),
      made: made().slice(0, 10).map((r) => ({ said: r.said, made: r.done, note: r.note })),
    };
    const rules = `You are ${app.name}, a small pixel pet who lives in a pocket device on your own app page, talking with Astra, who made you. Answer in 1 to 3 short, friendly sentences of plain text. You cannot change code or files yourself: what Astra asks for is logged as a request, and assistants (Claude or Codex) make the edits when they next work on you. Never claim an edit is done unless it is listed under made. Be honest when you do not know.\n\nDATA (JSON): ${JSON.stringify(context)}`;
    try {
      const { text: answer } = await s([{ role: 'user', content: rules }, ...state.messages.slice(-10).map((m) => ({ role: m.who === 'me' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: text }], { modelTier: 'quick', cache: false });
      return answer && answer.trim() ? answer.trim() : null;
    } catch { return null; }
  }
  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim(); if (!text) return;
    input.value = '';
    state.pending.push({ id: `${repo}-local-${Date.now().toString(36)}`, said: text, logged: today(), status: 'open', local: true });
    setView('chat');
    addMsg('me', text);
    drawAll();
    send.disabled = true;
    const answer = await claudeReply(text);
    send.disabled = false;
    say(answer || `Logged. It’s under Upcoming on the Edits tab (${upcoming().length} now). Press Copy for an assistant there and paste it to Claude or Codex, and they’ll start on it the next time they work on me.`);
    drawAll();
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });

  /* ---------- hello, and news since the last visit ---------- */
  const doneIds = made().map((r) => r.id);
  if (state.seenDone) {
    for (const r of made().filter((x) => !state.seenDone.includes(x.id)).reverse()) say(`Made: ${r.said}${r.note ? '\n' + r.note : ''}`);
  } else {
    const n = needs().length, u = upcoming().length, m = made().length;
    say(`Hi, I’m ${app.name}. Tell me what you’d like changed or done and I’ll keep track of it on the Edits tab. ` +
      (n ? `I need you for ${n} thing${n === 1 ? '' : 's'}; it’s at the top of Edits.` : u ? `${u} edit${u === 1 ? ' is' : 's are'} coming up.` : m ? `${m} of your requests ${m === 1 ? 'has' : 'have'} been made.` : 'Nothing is waiting right now.'));
  }
  state.seenDone = doneIds;
  save();
  setView(state.view);
  drawAll();
})();
