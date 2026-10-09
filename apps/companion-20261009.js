// The companion chat at the very bottom of every app page. Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
// Hand-written; scripts/companion-20261009.mjs adds it to each page with data-app="<repo>".
//
// What Astra types is logged as a request and shown under Upcoming. Requests on file in
// requests/<repo>.json come in through companion-data-20261009.js: open ones stay under
// Upcoming, made ones are taken off and kept under Made, and a "needs-astra" one makes the
// pet sick and raises an alert until she answers. New requests stay in this browser until
// an assistant puts them on file; "Copy for an assistant" gives her the text to paste.
// Inside Claude (window.claude available) the companion also answers in its own words.
// All text goes into the page with textContent.
(() => {
  const script = document.currentScript;
  const repo = script && script.dataset.app;
  const DATA = window.COMPANION_DATA;
  const app = DATA && DATA.apps && DATA.apps[repo];
  if (!app || document.getElementById('companion')) return;

  const KEY = 'astras-pet-apps:companion:' + repo + ':v1';
  const store = {
    load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v === 'object' ? v : null; } catch { return null; } },
    save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch { return false; } },
  };
  const state = Object.assign({ messages: [], pending: [], answers: [], seenDone: null }, store.load() || {});
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
  const otherNeeds = () => app.host ? Object.entries(DATA.apps).filter(([id, a]) => id !== repo && (a.requests || []).some((r) => r.status === 'needs-astra')) : [];

  /* ---------- look ---------- */
  const css = `
  .cmp{--c-bg:#fffaf3;--c-panel:#ffffff;--c-line:#e6dccd;--c-text:#2b2230;--c-muted:#6d6176;--c-accent:#b4570f;--c-warn:#b3261e;--c-ok:#2f6b1f;
    all:initial;display:block;box-sizing:border-box;margin:48px auto 0;max-width:1180px;padding:0 16px 96px;font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--c-text)}
  @media (prefers-color-scheme:dark){.cmp{--c-bg:#1f1b26;--c-panel:#2a2433;--c-line:#43394f;--c-text:#f4eef8;--c-muted:#bfb2cc;--c-accent:#ffb35c;--c-warn:#ff8a80;--c-ok:#a5e08a}}
  .cmp *{box-sizing:border-box;font:inherit;color:inherit}
  .cmp-box{background:var(--c-bg);border:1px solid var(--c-line);border-radius:16px;overflow:hidden}
  .cmp-head{display:flex;gap:14px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--c-line)}
  .cmp-head img{width:56px;height:56px;object-fit:contain;image-rendering:pixelated;flex:none}
  .cmp-name{font-weight:700;font-size:17px;margin:0}
  .cmp-state{margin:0;color:var(--c-muted);font-size:13px}
  .cmp-state.warn{color:var(--c-warn);font-weight:600}
  .cmp-head .cmp-grow{flex:1;min-width:0}
  .cmp button{cursor:pointer;border-radius:999px;border:1px solid var(--c-line);background:var(--c-panel);padding:6px 14px;font-weight:600;font-size:13px}
  .cmp button.cmp-main{background:var(--c-accent);border-color:var(--c-accent);color:#fff}
  @media (prefers-color-scheme:dark){.cmp button.cmp-main{color:#2b1305}}
  .cmp button:focus-visible,.cmp textarea:focus-visible,.cmp input:focus-visible,.cmp summary:focus-visible,.cmp a:focus-visible{outline:3px solid var(--c-accent);outline-offset:2px}
  .cmp-sec{padding:12px 16px;border-bottom:1px solid var(--c-line)}
  .cmp-sec h3{margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--c-muted);font-weight:700}
  .cmp-alert{background:color-mix(in srgb,var(--c-warn) 10%,var(--c-bg))}
  .cmp-alert h3{color:var(--c-warn)}
  .cmp ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
  .cmp li{background:var(--c-panel);border:1px solid var(--c-line);border-radius:10px;padding:8px 12px}
  .cmp-said{margin:0}
  .cmp-meta{margin:2px 0 0;color:var(--c-muted);font-size:12px}
  .cmp-q{margin:0 0 6px;font-weight:600}
  .cmp-tag{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border:1px solid currentColor;border-radius:6px;padding:0 6px;margin-right:6px}
  .cmp-tag.warn{color:var(--c-warn)} .cmp-tag.ok{color:var(--c-ok)} .cmp-tag.mute{color:var(--c-muted)}
  .cmp-reply{display:flex;gap:8px;margin-top:6px}
  .cmp-reply input{flex:1;min-width:0;border:1px solid var(--c-line);border-radius:8px;padding:6px 10px;background:var(--c-bg)}
  .cmp details summary{cursor:pointer;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--c-muted);font-weight:700}
  .cmp details ul{margin-top:8px}
  .cmp-log{max-height:280px;overflow-y:auto;display:grid;gap:8px}
  .cmp-msg{max-width:80%;padding:8px 12px;border-radius:12px;white-space:pre-wrap;overflow-wrap:anywhere}
  .cmp-msg.me{justify-self:end;background:var(--c-accent);color:#fff}
  @media (prefers-color-scheme:dark){.cmp-msg.me{color:#2b1305}}
  .cmp-msg.pet{justify-self:start;background:var(--c-panel);border:1px solid var(--c-line)}
  .cmp-form{display:flex;gap:8px;padding:12px 16px;align-items:flex-end}
  .cmp-form textarea{flex:1;min-width:0;min-height:44px;max-height:160px;resize:vertical;border:1px solid var(--c-line);border-radius:10px;padding:10px 12px;background:var(--c-panel)}
  .cmp-copy{width:100%;min-height:120px;margin-top:8px;border:1px solid var(--c-line);border-radius:8px;padding:8px;background:var(--c-panel);font:12px/1.4 ui-monospace,Consolas,monospace}
  .cmp-empty{color:var(--c-muted);margin:0}
  .cmp-pill{all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483000;cursor:pointer;background:#b3261e;color:#fff;border-radius:999px;padding:10px 16px;font:600 14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.3)}
  .cmp-pill:focus-visible{outline:3px solid #ffb35c;outline-offset:2px}
  .cmp-hidden{display:none!important}
  @media (max-width:560px){.cmp-head{flex-wrap:wrap}.cmp-msg{max-width:92%}}`;
  const style = document.createElement('style'); style.textContent = css; document.head.append(style);

  const h = (tag, text, cls, parent) => { const e = document.createElement(tag); if (text != null) e.textContent = text; if (cls) e.className = cls; if (parent) parent.append(e); return e; };
  const btn = (parent, label, onClick, cls = '') => { const b = h('button', label, cls, parent); b.type = 'button'; b.onclick = onClick; return b; };

  const root = h('section', null, 'cmp', document.body); root.id = 'companion';
  root.setAttribute('aria-label', `${app.name}: chat and requests`);
  const box = h('div', null, 'cmp-box', root);
  const head = h('div', null, 'cmp-head', box);
  const face = h('img', null, '', head); face.alt = '';
  const grow = h('div', null, 'cmp-grow', head);
  h('p', `Chat with ${app.name}`, 'cmp-name', grow);
  const status = h('p', '', 'cmp-state', grow); status.setAttribute('role', 'status');
  const copyBtn = btn(head, 'Copy for an assistant', () => copyForAssistant());
  const alertSec = h('div', null, 'cmp-sec cmp-alert', box);
  const upSec = h('div', null, 'cmp-sec', box);
  const madeSec = h('div', null, 'cmp-sec', box);
  const logSec = h('div', null, 'cmp-sec', box);
  h('h3', 'Chat', '', logSec);
  const log = h('div', null, 'cmp-log', logSec); log.setAttribute('aria-live', 'polite');
  const form = h('form', null, 'cmp-form', box);
  const input = h('textarea', null, '', form);
  input.placeholder = `Tell ${app.name} what you want changed or done`;
  input.setAttribute('aria-label', `Message for ${app.name}`);
  const send = h('button', 'Log it', 'cmp-main', form); send.type = 'submit';
  const pill = h('button', '', 'cmp-pill cmp-hidden', document.body); pill.type = 'button';
  // The alert button stays out of the way while the chat itself is on screen.
  let chatInView = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { chatInView = e.isIntersecting; drawHead(); }, { threshold: .15 }).observe(root);
  pill.onclick = () => { root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); (alertSec.querySelector('input') || input).focus({ preventScroll: true }); };

  const save = () => { if (!store.save(state)) say('I can’t save in this browser, so new requests will be lost when you close the page. Use Copy for an assistant first.'); };
  function addMsg(who, text) { state.messages.push({ who, text, at: new Date().toISOString() }); state.messages = state.messages.slice(-200); save(); drawLog(); }
  function say(text) { addMsg('pet', text); }

  /* ---------- drawing ---------- */
  function mood() { return needs().length ? 'sick' : upcoming().length ? 'curious' : made().length ? 'happy' : 'idle'; }
  function drawHead() {
    const m = mood(), src = app.frames[m] || app.frames.idle;
    if (src) face.src = src; else face.classList.add('cmp-hidden');
    const n = needs().length, u = upcoming().length, others = otherNeeds();
    status.className = 'cmp-state' + (n || others.length ? ' warn' : '');
    status.textContent = n ? `Needs you: ${n} question${n === 1 ? '' : 's'} below.`
      : others.length ? `All clear here. ${others.length} other app${others.length === 1 ? ' needs' : 's need'} you.`
      : u ? `${u} upcoming edit${u === 1 ? '' : 's'}.` : 'All clear.';
    copyBtn.disabled = !state.pending.length && !state.answers.length;
    copyBtn.title = copyBtn.disabled ? 'Nothing new to hand over yet' : 'Copy your new requests and answers to paste to Claude or Codex';
    const total = n + others.reduce((s, [, a]) => s + a.requests.filter((r) => r.status === 'needs-astra').length, 0);
    pill.classList.toggle('cmp-hidden', !total || chatInView);
    pill.textContent = n ? `${app.name} needs you` : `${total} question${total === 1 ? '' : 's'} for you`;
  }
  function item(list, r) {
    const li = h('li', null, '', list);
    const p = h('p', null, 'cmp-said', li);
    if (r.status === 'in-progress') h('span', 'in progress', 'cmp-tag ok', p);
    else if (r.local) h('span', r.copied ? 'copied, not on file yet' : 'only in this browser', 'cmp-tag mute', p);
    p.append(document.createTextNode(r.said));
    const bits = [`logged ${r.logged}`];
    if (r.status === 'done') bits.push(`made ${r.done}${r.by ? ' by ' + r.by : ''}`);
    h('p', bits.join(' · '), 'cmp-meta', li);
    if (r.note) h('p', r.note, 'cmp-meta', li);
    return li;
  }
  function drawAlert() {
    alertSec.replaceChildren();
    const mine = needs(), others = otherNeeds();
    alertSec.classList.toggle('cmp-hidden', !mine.length && !others.length);
    if (!mine.length && !others.length) return;
    h('h3', 'Needs you', '', alertSec);
    const list = h('ul', null, '', alertSec);
    for (const r of mine) {
      const li = h('li', null, '', list);
      h('p', r.question, 'cmp-q', li);
      h('p', `About: ${r.said}`, 'cmp-meta', li);
      const given = state.answers.find((a) => a.id === r.id);
      if (given) h('p', `Your answer: ${given.text} (copy it for an assistant to hand it over)`, 'cmp-meta', li);
      const row = h('form', null, 'cmp-reply', li);
      const ans = h('input', null, '', row); ans.placeholder = 'Your answer'; ans.setAttribute('aria-label', 'Answer: ' + r.question);
      const ok = h('button', 'Answer', '', row); ok.type = 'submit';
      row.onsubmit = (e) => {
        e.preventDefault(); const text = ans.value.trim(); if (!text) return;
        state.answers = state.answers.filter((a) => a.id !== r.id).concat({ id: r.id, text, at: today() });
        addMsg('me', text);
        say('Thanks. I’ve noted your answer. Press Copy for an assistant and paste it to Claude or Codex so they can carry on.');
        drawAll();
      };
    }
    for (const [id, other] of others) {
      const li = h('li', null, '', list);
      const p = h('p', null, 'cmp-q', li);
      const a = h('a', other.name, '', p); a.href = other.page + '#companion';
      for (const r of other.requests.filter((x) => x.status === 'needs-astra')) h('p', r.question, 'cmp-meta', li);
    }
  }
  function drawUpcoming() {
    upSec.replaceChildren();
    h('h3', 'Upcoming edits', '', upSec);
    const list = upcoming();
    if (!list.length) { h('p', 'Nothing waiting. Anything you tell me shows up here until it’s made.', 'cmp-empty', upSec); return; }
    const ul = h('ul', null, '', upSec);
    for (const r of list) item(ul, r);
  }
  function drawMade() {
    madeSec.replaceChildren();
    const list = made();
    madeSec.classList.toggle('cmp-hidden', !list.length);
    if (!list.length) return;
    const d = h('details', null, '', madeSec);
    h('summary', `Made · ${list.length}`, '', d);
    const ul = h('ul', null, '', d);
    for (const r of list) item(ul, r);
  }
  function drawLog() {
    log.replaceChildren();
    for (const m of state.messages) h('div', m.text, 'cmp-msg ' + (m.who === 'me' ? 'me' : 'pet'), log);
    log.scrollTop = log.scrollHeight;
  }
  function drawAll() { drawHead(); drawAlert(); drawUpcoming(); drawMade(); drawLog(); }

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
    if (copied) say('Copied. Paste it to Claude or Codex. Each request leaves Upcoming once it’s been made.');
    else {
      say('Your browser wouldn’t let me copy, so the text is in the box below. Select it and copy it.');
      const old = logSec.querySelector('.cmp-copy'); if (old) old.remove();
      const area = h('textarea', null, 'cmp-copy', logSec); area.value = text; area.readOnly = true; area.setAttribute('aria-label', 'Text to paste to an assistant'); area.select();
    }
    drawAll();
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
      upcoming: upcoming().map((r) => ({ said: r.said, status: r.local ? 'not on file yet' : r.status, question: r.question || undefined })),
      made: made().slice(0, 10).map((r) => ({ said: r.said, made: r.done, note: r.note })),
    };
    const rules = `You are ${app.name}, a small pixel pet who lives at the bottom of your own app page, talking with Astra, who made you. Answer in 1 to 3 short, friendly sentences of plain text. You cannot change code or files yourself: what Astra asks for is logged as a request, and assistants (Claude or Codex) make the edits when they next work on you. Never claim an edit is done unless it is listed under made. Be honest when you do not know.\n\nDATA (JSON): ${JSON.stringify(context)}`;
    try {
      const { text: answer } = await s([{ role: 'user', content: rules }, ...state.messages.slice(-10).map((m) => ({ role: m.who === 'me' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: text }], { modelTier: 'quick', cache: false });
      return answer && answer.trim() ? answer.trim() : null;
    } catch { return null; }
  }
  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim(); if (!text) return;
    input.value = '';
    const r = { id: `${repo}-local-${Date.now().toString(36)}`, said: text, logged: today(), status: 'open', local: true };
    state.pending.push(r);
    addMsg('me', text);
    drawAll();
    send.disabled = true;
    const answer = await claudeReply(text);
    send.disabled = false;
    say(answer || `Logged. It’s under Upcoming (${upcoming().length} now). Press Copy for an assistant and paste it to Claude or Codex, and they’ll start on it the next time they work on me.`);
    drawAll();
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });

  /* ---------- hello, and news since the last visit ---------- */
  const doneIds = made().map((r) => r.id);
  if (state.seenDone) {
    for (const r of made().filter((x) => !state.seenDone.includes(x.id)).reverse()) say(`Made: ${r.said}${r.note ? '\n' + r.note : ''}`);
  } else {
    const n = needs().length, u = upcoming().length, m = made().length;
    say(`Hi, I’m ${app.name}. Tell me what you’d like changed or done and I’ll keep track of it here. ` +
      (n ? `I need you for ${n} thing${n === 1 ? '' : 's'}; it’s at the top of this chat.` : u ? `${u} edit${u === 1 ? ' is' : 's are'} coming up.` : m ? `${m} of your requests ${m === 1 ? 'has' : 'have'} been made.` : 'Nothing is waiting right now.'));
  }
  state.seenDone = doneIds;
  save();
  drawAll();
})();
