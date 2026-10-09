import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../cage.html', import.meta.url), 'utf8');
const data = readFileSync(new URL('../cage-data.js', import.meta.url), 'utf8');

// Execute the actual page script with a small DOM/canvas adapter; no production test hooks.
function boot({ reduced = true, storage = new Map() } = {}) {
  const listeners = new Map(), nodes = new Map(), timers = new Map(), images = [], opened = [];
  let milliseconds = 1000, nextTimer = 1;
  const context2d = new Proxy({ drawImage: (...args) => images.push(args) }, { get: (o, k) => o[k] || (() => {}) });
  class Element {
    constructor(tag = 'div', id = '') { this.tagName = tag; this.id = id; this.children = []; this.style = {}; this.dataset = {}; this.attributes = {}; this.hidden = false; this.captured = null; }
    append(child) { child.parent = this; this.children.push(child); }
    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return this.attributes[k]; }
    insertRow() { const e = new Element('tr'); this.append(e); return e; }
    insertCell() { const e = new Element('td'); this.append(e); return e; }
    getContext() { return context2d; }
    closest(selector) { const selectors = selector.split(',').map(x => x.trim()); for (let n = this; n; n = n.parent) if (selectors.some(s => s[0] === '#' ? n.id === s.slice(1) : n.tagName === s)) return n; return null; }
    setPointerCapture(id) { this.captured = id; }
    hasPointerCapture(id) { return this.captured === id; }
    releasePointerCapture() { this.captured = null; }
    focus() {}
    click() { if (this.tagName === 'a') opened.push(this.href); }
  }
  const get = (id) => { if (!nodes.has(id)) nodes.set(id, new Element(['egg', 'door', 'cage-move'].includes(id) ? 'button' : 'div', id)); return nodes.get(id); };
  get('roster').tBodies = [new Element('tbody')];
  const body = new Element('body');
  const document = { body, getElementById: get, createElement: tag => new Element(tag), addEventListener(type, fn, capture = false) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push({ fn, capture }); } };
  const win = { devicePixelRatio: 1 };
  const context = { window: win, document, Element, innerWidth: 1280, innerHeight: 800, location: new URL('http://127.0.0.1:8765/cage.html'), URL,
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) }, matchMedia: () => ({ matches: reduced }),
    Image: class { constructor() { this.complete = true; this.naturalWidth = this.naturalHeight = 256; } },
    performance: { now: () => milliseconds }, requestAnimationFrame: () => 1, cancelAnimationFrame() {}, addEventListener() {},
    setTimeout(fn, delay) { const id = nextTimer++; timers.set(id, { fn, time: milliseconds + delay }); return id; }, clearTimeout: id => timers.delete(id), console };
  vm.createContext(context); vm.runInContext(data, context);
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1].replace(/\}\)\(\);\s*$/, 'globalThis.controls = { actors, petHeight, petWidth, petBounds, tagGames, moveCage, layout, addGuest, sprite, step, setVisible, get layoutState() { return L; }, get bounds() { return cageBounds; }, get visible() { return visible; }, get drag() { return cageDrag; }, get door() { return want; }, P, S };})();');
  vm.runInContext(script, context);
  const emit = (type, x, y, target = body, extra = {}) => { const e = { clientX: x, clientY: y, pointerId: 1, button: 0, detail: 1, target, preventDefault() {}, stopPropagation() {}, ...extra }; for (const { fn } of [...(listeners.get(type) || [])].sort((a, b) => Number(b.capture) - Number(a.capture))) fn(e); return e; };
  const tick = (ms) => { milliseconds += ms; for (const [id, t] of [...timers]) if (t.time <= milliseconds) { timers.delete(id); t.fn(); } };
  return { api: context.controls, get, emit, tick, body, storage, opened, images, clickStar: () => get('egg').onclick({ detail: 1, preventDefault() {} }) };
}

test('Cage starts visible with a 30px star and only Ghost at 75 percent height', () => {
  const t = boot();
  assert.equal(t.api.visible, true); assert.equal(t.get('stage').hidden, false);
  assert.match(html, /\.star-core \{ width: 30px; height: 30px;/);
  assert.match(html, /\.star-orbit \{[^}]*width: 48px; height: 48px;/);
  for (const p of [...t.api.actors.pets, t.api.actors.farmer]) assert.equal(t.api.petHeight(p) * 2, p.id === 'ghost-protocol' ? 44.0625 : 58.75);
  assert.ok(Number.isFinite(parseFloat(t.get('egg').style.left)));
  assert.ok(parseFloat(t.get('egg').style.top) >= 0);
});

for (const handle of ['cage', 'rail', 'farmer', 'robot', 'visiting-robot', 'star']) test(`Dragging ${handle} moves and saves the group without activating clicks`, () => {
  const t = boot(), a = t.api;
  a.addGuest({ complete: true, naturalWidth: 1536, naturalHeight: 1872 });
  const robot = a.actors.pets.find(p => p.guest);
  if (handle === 'visiting-robot') { robot.docked = false; robot.mode = 'caged'; a.layout(); robot.x = a.layoutState.x0 + 8; robot.y = a.layoutState.top; }
  a.moveCage((a.bounds.x0 + a.bounds.x1) / 2, 200);
  const outsider = a.actors.pets.find(p => !p.guest); outsider.mode = 'out'; outsider.x = 200; outsider.y = 150;
  const before = { x: a.layoutState.x0, y: a.layoutState.roof, farmer: { x: a.actors.farmer.x, y: a.actors.farmer.y }, robot: { x: robot.x, y: robot.y }, star: { x: parseFloat(t.get('egg').style.left), y: parseFloat(t.get('egg').style.top) } };
  let x, y, target = t.body;
  if (handle === 'farmer' || handle.includes('robot')) { const actor = handle === 'farmer' ? a.actors.farmer : robot; x = (actor.x + a.P / 2) * 2; y = (actor.y + a.P / 2) * 2; }
  else if (handle === 'star') { target = t.get('egg'); x = before.star.x + 30; y = before.star.y + 30; }
  else { x = (a.layoutState.x0 + 20) * 2; y = (a.layoutState.roof + 4) * 2; if (handle === 'rail') target = t.get('cage-move'); }
  t.emit('pointerdown', x, y, target);
  assert.ok(a.drag, handle + ' begins a gesture');
  assert.equal(a.drag.capture.hasPointerCapture(1), true);
  t.emit('pointermove', x + 2, y - 2, target);
  assert.equal(a.layoutState.roof, before.y, 'under 4 CSS pixels does not move');
  t.emit('pointermove', x + 4, y - 40, target);
  t.emit('pointerup', x + 4, y - 40, target);
  if (handle === 'star') t.clickStar();
  const dx = a.layoutState.x0 - before.x, dy = a.layoutState.roof - before.y;
  assert.equal(dx, 2); assert.equal(dy, -20);
  assert.equal(a.actors.farmer.x - before.farmer.x, dx); assert.equal(a.actors.farmer.y - before.farmer.y, dy);
  assert.equal(robot.x - before.robot.x, dx); assert.equal(robot.y - before.robot.y, dy);
  assert.equal(parseFloat(t.get('egg').style.left) - before.star.x, dx * 2); assert.equal(parseFloat(t.get('egg').style.top) - before.star.y, dy * 2);
  assert.equal(outsider.x, 200); assert.equal(outsider.y, 150);
  assert.ok(t.storage.has('cage.position')); assert.equal(a.drag, null);
  t.tick(500); assert.equal(a.door, 'closed'); assert.equal(a.visible, true); assert.deepEqual(t.opened, []);
  const restored = boot({ storage: t.storage });
  assert.equal(JSON.parse(restored.storage.get('cage.position')).y, JSON.parse(t.storage.get('cage.position')).y);
});

test('Farmer click toggles the door; double-click opens its interface once without toggling', () => {
  const t = boot(), a = t.api, f = a.actors.farmer, x = (f.x + a.P / 2) * 2, y = (f.y + a.P / 2) * 2;
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(450); assert.equal(a.door, 'open');
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(100); t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(500);
  assert.equal(t.opened.length, 1); assert.match(t.opened[0], /astras-pet-apps-20261008\.html$/); assert.equal(a.door, 'open');
});

test('Star click hides once, releases capture, and cannot drag the hidden group', () => {
  const t = boot(), a = t.api, star = t.get('egg'), x = parseFloat(star.style.left) + 30, y = parseFloat(star.style.top) + 30;
  const before = a.layoutState.roof;
  t.emit('pointerdown', x, y, star); t.emit('pointerup', x, y, star); t.clickStar();
  assert.equal(a.visible, false); assert.equal(a.drag, null); assert.equal(star.hasPointerCapture(1), false);
  t.emit('pointermove', x + 40, y - 50, star); assert.equal(a.layoutState.roof, before);
  t.tick(200); t.emit('pointerdown', x, y, star); assert.equal(a.drag, null); t.clickStar(); assert.equal(a.visible, true);
});

test('Pointer cancellation saves completed movement without acting like a click', () => {
  const t = boot(), a = t.api, star = t.get('egg'); a.moveCage(40, 200);
  t.emit('pointerdown', 20, 440, star); t.emit('pointermove', 20, 400, star); t.emit('pointercancel', 20, 400, star); t.tick(500);
  assert.equal(a.drag, null); assert.equal(a.visible, true); assert.ok(t.storage.has('cage.position')); assert.equal(a.door, 'closed');
});

test('The complete BSOD frame is draggable at its antenna, face, jump extents and feet over page links', () => {
  for (const [frameX, frameY] of [[96, 1], [60, 20], [96, 58], [1, 104], [191, 104], [96, 207]]) {
    const t = boot(), a = t.api;
    a.addGuest({ complete: true, naturalWidth: 1536, naturalHeight: 1872 });
    a.moveCage((a.bounds.x0 + a.bounds.x1) / 2, 200);
    const p = a.actors.pets.find(p => p.guest), scale = 80 / 192;
    const x = (p.x + a.P / 2) * 2 + (frameX - 96) * scale;
    const y = (p.y + a.P) * 2 + (frameY - 198) * scale;
    const link = t.get('underlying-link'); link.tagName = 'a';
    t.emit('pointerdown', x, y, link);
    assert.equal(a.drag?.target.p, p, `frame pixel ${frameX},${frameY} hits BSOD over a link`);
    const before = a.layoutState.roof;
    t.emit('pointermove', x, y - 20, link); t.emit('pointerup', x, y - 20, link);
    assert.equal(a.layoutState.roof, before - 10); assert.deepEqual(t.opened, []);
  }
});

test('Farmer remains draggable over a button while uncovered page controls keep their behavior', () => {
  const t = boot(), a = t.api; a.moveCage(40, 200);
  const f = a.actors.farmer, x = (f.x + a.P / 2) * 2, y = (f.y + a.P / 2) * 2, button = t.get('door');
  t.emit('pointerdown', x, y, button); assert.equal(a.drag?.target.kind, 'farmer');
  t.emit('pointermove', x, y - 20, button); t.emit('pointerup', x, y - 20, button);
  assert.equal(a.door, 'closed');
  t.emit('pointerdown', 500, 20, button); assert.equal(a.drag, null);
  button.onclick(); assert.equal(a.door, 'open');
});

/* ---------- cage life (pets.json cage_life), added 2026-10-09 ---------- */
const registry = JSON.parse(readFileSync(new URL('../pets.json', import.meta.url), 'utf8'));
const life = registry.cage_life;
function outside(t) {
  for (const p of t.api.actors.pets) { if (p.docked) continue; p.mode = 'out'; p.x = 100 + Math.random() * 400; p.y = t.api.petBounds(p).y1; }
}
function run(t, seconds) { for (let i = 0; i < seconds * 20; i++) { t.tick(50); t.api.step(.05); } }
const pet = (t, id) => t.api.actors.pets.find(p => p.id === id);

test('Every pet has a known kind, and every rule names a real pet or kind', () => {
  const kinds = new Set(Object.keys(life.kinds)), arts = new Set(registry.pets.map(p => p.art));
  for (const p of registry.pets) assert.ok(kinds.has(p.kind), `${p.pet} has kind ${p.kind}`);
  for (const name of [...life.friends.flat(), ...life.tag.flat(), ...life.chases.flat()]) assert.ok(arts.has(name) || kinds.has(name), name);
  for (const k of Object.values(life.kinds)) assert.ok(['sky', 'swim', 'ground'].includes(k.zone));
});

test('Sky pets stay high, the fish swims mid-height, and ground pets stay on the floor', () => {
  const t = boot({ reduced: false }); outside(t);
  for (const p of t.api.actors.pets) if (p.kind === 'bird') p.mode = 'caged'; // no one chasing the fish
  run(t, 20);
  for (const p of t.api.actors.pets) {
    const b = t.api.petBounds(p), zone = life.kinds[p.kind].zone, h = b.y1 - b.y0, at = (p.y - b.y0) / h;
    if (p.mode !== 'out' || p.id === 'python-panther') continue; // the cat climbs walls
    if (zone === 'sky') assert.ok(at <= .4, `${p.id} is high (${at.toFixed(2)})`);
    if (zone === 'swim') assert.ok(at >= .3 && at <= .8, `${p.id} swims mid (${at.toFixed(2)})`);
    if (zone === 'ground') assert.equal(p.y, b.y1, `${p.id} is on the ground`);
  }
});

test('Birds fly together and the friend groups hang out', () => {
  const t = boot({ reduced: false }); outside(t);
  pet(t, 'goldfish').mode = 'caged'; // keep the birds from chasing the fish for this check
  run(t, 25);
  const birds = t.api.actors.pets.filter(p => p.kind === 'bird');
  const spread = Math.max(...birds.map(p => p.x)) - Math.min(...birds.map(p => p.x));
  assert.ok(spread < 70, `flock spread ${spread.toFixed(1)}`);
  for (const group of life.friends) {
    const crew = group.map(id => pet(t, id)), xs = crew.map(p => p.x);
    assert.ok(Math.max(...xs) - Math.min(...xs) < 70, `${group.join(', ')} are together`);
  }
});

test('A new bug runs from the birds and the fish chases it; the fish runs from the birds', () => {
  const t = boot({ reduced: false }); outside(t);
  const fish = pet(t, 'goldfish'), finch = pet(t, 'finance-finch');
  const bug = { id: 'test-bug', kind: 'bug', name: 'Test Bug', flying: false, mode: 'out', x: 300, y: 0, vx: 0, vy: 0, t: 0, poked: 0, until: 0, sleepUntil: 0 };
  t.api.actors.pets.push(bug); bug.y = t.api.petBounds(bug).y1;
  for (const p of t.api.actors.pets) if (p !== finch && p !== bug) p.mode = 'caged'; // just the finch and the bug
  finch.x = bug.x - 20; finch.y = bug.y - 10;
  const before = Math.abs(bug.x - finch.x);
  run(t, 2);
  assert.ok(Math.abs(bug.x - finch.x) > before, 'the bug runs from the bird');
  finch.mode = 'caged'; fish.mode = 'out';
  bug.x = 300; bug.vx = 0; fish.x = bug.x + 100; fish.y = bug.y - 30; fish.vx = fish.vy = 0; const gap = Math.hypot(fish.x - bug.x, fish.y - bug.y);
  run(t, 1);
  assert.ok(Math.hypot(fish.x - bug.x, fish.y - bug.y) < gap, 'the fish closes on the bug');
  finch.mode = 'out'; finch.x = fish.x - 15; finch.y = fish.y; t.api.step(.05);
  assert.equal(fish.fleeing, true, 'the fish runs from the bird');
});

test('Cat and dog play tag, and the cat escapes up a wall', () => {
  const t = boot({ reduced: false }); outside(t);
  const cat = pet(t, 'python-panther'), dog = pet(t, 'drum-dog'), b = t.api.petBounds(cat);
  cat.x = b.x1 - 1; dog.x = b.x1 - 20;
  run(t, 1);
  assert.ok(cat.wall || cat.airborne, 'the chased cat went up the wall');
  assert.ok(cat.y < b.y1, 'the cat is off the floor');
  run(t, 6);
  dog.x = 300; cat.x = 302; cat.wall = 0; cat.airborne = false; cat.y = dog.y;
  const [game] = [...t.api.tagGames.values()]; game.graceUntil = 0; game.it = 'drum-dog';
  t.api.step(.05);
  assert.equal(game.it, 'python-panther', 'tagged: the cat is it');
});

test('Humans hop as they walk', () => {
  const t = boot({ reduced: false }); outside(t); run(t, 6);
  for (const p of t.api.actors.pets.filter(p => p.kind === 'human')) assert.ok(p.playHopAt, `${p.id} hopped`);
});
