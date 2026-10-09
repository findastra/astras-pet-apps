import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../pets.html', import.meta.url), 'utf8');
const data = readFileSync(new URL('../pets-data.js', import.meta.url), 'utf8');

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
  const get = (id) => { if (!nodes.has(id)) nodes.set(id, new Element(['egg', 'meet-ghost', 'invite-bsod', 'bsod-place'].includes(id) ? 'button' : 'div', id)); return nodes.get(id); };
  get('roster').tBodies = [new Element('tbody')];
  const body = new Element('body');
  const document = { body, getElementById: get, createElement: tag => new Element(tag), addEventListener(type, fn, capture = false) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push({ fn, capture }); } };
  const win = { devicePixelRatio: 1 };
  const context = { window: win, document, Element, innerWidth: 1280, innerHeight: 800, location: new URL('http://127.0.0.1:8765/pets.html'), URL,
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) }, matchMedia: () => ({ matches: reduced }),
    Image: class { constructor() { this.complete = true; this.naturalWidth = this.naturalHeight = 256; } },
    performance: { now: () => milliseconds }, requestAnimationFrame: () => 1, cancelAnimationFrame() {}, addEventListener() {},
    setTimeout(fn, delay) { const id = nextTimer++; timers.set(id, { fn, time: milliseconds + delay }); return id; }, clearTimeout: id => timers.delete(id), console };
  vm.createContext(context); vm.runInContext(data, context);
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1].replace(/\}\)\(\);\s*$/, 'globalThis.controls = { actors, petHeight, petWidth, petBounds, tagGames, moveGroup, layout, addGuest, sprite, step, setVisible, free, get layoutState() { return L; }, get bounds() { return groupBounds; }, get visible() { return visible; }, get drag() { return drag; }, P, S };})();');
  vm.runInContext(script, context);
  const emit = (type, x, y, target = body, extra = {}) => { const e = { clientX: x, clientY: y, pointerId: 1, button: 0, detail: 1, target, preventDefault() {}, stopPropagation() {}, ...extra }; for (const { fn } of [...(listeners.get(type) || [])].sort((a, b) => Number(b.capture) - Number(a.capture))) fn(e); return e; };
  const tick = (ms) => { milliseconds += ms; for (const [id, t] of [...timers]) if (t.time <= milliseconds) { timers.delete(id); t.fn(); } };
  return { api: context.controls, get, emit, tick, body, storage, opened, images, clickStar: () => get('egg').onclick({ detail: 1, preventDefault() {} }) };
}
const centre = (a, actor) => [(actor.x + a.P / 2) * a.S, (actor.y + a.P / 2) * a.S];

test('The pets start out roaming free across the whole page, with a 40px star, a smaller Ghost, File Master and Bug', () => {
  const t = boot(), a = t.api;
  assert.equal(a.visible, true); assert.equal(t.get('stage').hidden, false);
  assert.match(html, /\.star-core \{ width: 40px; height: 40px;/);
  assert.match(html, /\.star-orbit \{[^}]*width: 48px; height: 48px;/);
  for (const p of [...a.actors.pets, a.actors.farmer]) assert.equal(a.petHeight(p) * 2, { 'ghost-protocol': 44.0625, 'file-master': 58.75 * .75, 'voicemeeter-bug': 58.75 * .85 }[p.id] ?? 58.75);
  for (const p of a.actors.pets) assert.equal(p.mode, 'out', `${p.name} is free from the start`);
  const b = a.free(), xs = a.actors.pets.map(p => p.x);
  assert.ok(Math.max(...xs) - Math.min(...xs) > (b.x1 - b.x0) * .75, 'everyone is spread across the window at once');
  for (const p of a.actors.pets) assert.ok(p.x >= b.x0 - 1 && p.x <= b.x1 + 1 && p.y >= b.y0 - 1 && p.y <= b.y1 + 1, `${p.name} starts inside the page`);
  assert.ok(Number.isFinite(parseFloat(t.get('egg').style.left)));
  assert.ok(parseFloat(t.get('egg').style.top) >= 0);
});

test('Nothing on the page or in its data is an enclosure', () => {
  const word = new RegExp('ca' + 'ge', 'i');
  assert.doesNotMatch(html, word);
  assert.doesNotMatch(data.replace(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+/gi, ''), word);
  assert.doesNotMatch(html, /id="door"|Open the /);
});

for (const handle of ['farmer', 'robot', 'star']) test(`Dragging the ${handle} moves and saves the star and Farmer without activating clicks`, () => {
  const t = boot(), a = t.api;
  a.addGuest({ complete: true, naturalWidth: 1536, naturalHeight: 1872 });
  const robot = a.actors.pets.find(p => p.guest);
  a.moveGroup((a.bounds.x0 + a.bounds.x1) / 2, 200);
  const roamer = a.actors.pets.find(p => !p.guest); roamer.x = 200; roamer.y = 150;
  const before = { x: a.layoutState.x, y: a.layoutState.y, farmer: { x: a.actors.farmer.x, y: a.actors.farmer.y }, robot: { x: robot.x, y: robot.y }, star: { x: parseFloat(t.get('egg').style.left), y: parseFloat(t.get('egg').style.top) } };
  let x, y, target = t.body;
  if (handle === 'star') { target = t.get('egg'); x = before.star.x + 30; y = before.star.y + 30; }
  else [x, y] = centre(a, handle === 'farmer' ? a.actors.farmer : robot);
  t.emit('pointerdown', x, y, target);
  assert.ok(a.drag, handle + ' begins a gesture');
  assert.equal(a.drag.capture.hasPointerCapture(1), true);
  t.emit('pointermove', x + 2, y - 2, target);
  assert.equal(a.layoutState.y, before.y, 'under 4 CSS pixels does not move');
  t.emit('pointermove', x + 4, y - 40, target);
  t.emit('pointerup', x + 4, y - 40, target);
  if (handle === 'star') t.clickStar();
  const dx = a.layoutState.x - before.x, dy = a.layoutState.y - before.y;
  assert.equal(dx, 2); assert.equal(dy, -20);
  assert.equal(a.actors.farmer.x - before.farmer.x, dx); assert.equal(a.actors.farmer.y - before.farmer.y, dy);
  assert.equal(robot.x - before.robot.x, dx); assert.equal(robot.y - before.robot.y, dy);
  assert.equal(parseFloat(t.get('egg').style.left) - before.star.x, dx * 2); assert.equal(parseFloat(t.get('egg').style.top) - before.star.y, dy * 2);
  assert.equal(roamer.x, 200); assert.equal(roamer.y, 150, 'roaming pets do not follow the group');
  assert.ok(t.storage.has('pets.position')); assert.equal(a.drag, null);
  t.tick(500); assert.equal(a.visible, true); assert.deepEqual(t.opened, []);
  const restored = boot({ storage: t.storage });
  assert.equal(JSON.parse(restored.storage.get('pets.position')).y, JSON.parse(t.storage.get('pets.position')).y);
});

test('A roaming pet, or BSOD roaming with them, cannot drag the star and Farmer', () => {
  const t = boot(), a = t.api;
  a.addGuest({ complete: true, naturalWidth: 1536, naturalHeight: 1872 });
  const robot = a.actors.pets.find(p => p.guest); robot.docked = false; robot.mode = 'out'; a.layout();
  const pet = a.actors.pets.find(p => !p.guest);
  for (const actor of [pet, robot]) {
    for (const other of a.actors.pets) { other.x = 600; other.y = 20; }
    actor.x = 120; actor.y = 120;
    const before = { ...a.layoutState }, [x, y] = centre(a, actor);
    t.emit('pointerdown', x, y); t.emit('pointermove', x + 30, y - 30); t.emit('pointerup', x + 30, y - 30);
    assert.deepEqual({ ...a.layoutState }, before, `${actor.name} only reacts to clicks`);
    assert.equal(t.storage.has('pets.position'), false);
  }
});

test('Farmer click makes him hop; double-click opens his desk once', () => {
  const t = boot(), a = t.api, [x, y] = centre(a, a.actors.farmer);
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(450);
  assert.equal(t.get('status').textContent, 'Friendly Farmer is happy.'); assert.deepEqual(t.opened, []);
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(100); t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(500);
  assert.equal(t.opened.length, 1); assert.match(t.opened[0], /astras-pet-apps-20261008\.html$/);
});

test('The browser Bug opens its local instructions on double-click without claiming a repair', () => {
  const t = boot(), a = t.api, bug = a.actors.pets.find(p => p.id === 'voicemeeter-bug');
  assert.ok(bug, 'the Bug is present in the generated pet data');
  for (const other of a.actors.pets) { other.x = 600; other.y = 20; }
  bug.x = 100; bug.y = 100;
  const x = (bug.x + a.P / 2) * a.S, y = (bug.y + a.P - a.petHeight(bug) / 2) * a.S;
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(500);
  assert.deepEqual(t.opened, []);
  assert.equal(t.get('status').textContent, 'Voicemeeter Bug is happy.');
  bug.x = 100; bug.y = 100;
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(100);
  t.emit('pointerdown', x, y); t.emit('pointerup', x, y); t.tick(500);
  assert.deepEqual(t.opened, ['http://127.0.0.1:8765/apps/voicemeeter-bug-20261008.html']);
});

test('Star click hides everyone at once, releases capture, and cannot drag the hidden group; a second click brings them all back', () => {
  const t = boot(), a = t.api, star = t.get('egg'), x = parseFloat(star.style.left) + 30, y = parseFloat(star.style.top) + 30;
  const before = a.layoutState.y;
  t.emit('pointerdown', x, y, star); t.emit('pointerup', x, y, star); t.clickStar();
  assert.equal(a.visible, false); assert.equal(t.get('stage').hidden, true); assert.equal(a.drag, null); assert.equal(star.hasPointerCapture(1), false);
  assert.equal(t.storage.get('pets.visible'), '0');
  t.emit('pointermove', x + 40, y - 50, star); assert.equal(a.layoutState.y, before);
  t.tick(200); t.emit('pointerdown', x, y, star); assert.equal(a.drag, null); t.clickStar();
  assert.equal(a.visible, true); assert.equal(t.get('stage').hidden, false);
  for (const p of a.actors.pets) assert.equal(p.mode, 'out');
  assert.equal(t.storage.get('pets.visible'), '1');
});

test('Arrow keys on the star move the star and Farmer', () => {
  const t = boot(), a = t.api; a.moveGroup(40, 200);
  const before = { ...a.layoutState };
  let prevented = false;
  t.get('egg').onkeydown({ key: 'ArrowRight', shiftKey: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(a.layoutState.x - before.x, 16); assert.equal(a.layoutState.y, before.y);
  assert.ok(t.storage.has('pets.position'));
});

test('Pointer cancellation saves completed movement without acting like a click', () => {
  const t = boot(), a = t.api, star = t.get('egg'); a.moveGroup(40, 200);
  const x = parseFloat(star.style.left) + 30, y = parseFloat(star.style.top) + 30;
  t.emit('pointerdown', x, y, star); t.emit('pointermove', x, y - 40, star); t.emit('pointercancel', x, y - 40, star); t.tick(500);
  assert.equal(a.drag, null); assert.equal(a.visible, true); assert.ok(t.storage.has('pets.position'));
});

test('The complete BSOD frame is draggable at its antenna, face, jump extents and feet over page links', () => {
  for (const [frameX, frameY] of [[96, 1], [60, 20], [96, 58], [1, 104], [191, 104], [96, 207]]) {
    const t = boot(), a = t.api;
    a.addGuest({ complete: true, naturalWidth: 1536, naturalHeight: 1872 });
    a.moveGroup((a.bounds.x0 + a.bounds.x1) / 2, 200);
    const p = a.actors.pets.find(p => p.guest), scale = 80 / 192;
    const x = (p.x + a.P / 2) * 2 + (frameX - 96) * scale;
    const y = (p.y + a.P) * 2 + (frameY - 198) * scale;
    const link = t.get('underlying-link'); link.tagName = 'a';
    t.emit('pointerdown', x, y, link);
    assert.equal(a.drag?.target.p, p, `frame pixel ${frameX},${frameY} hits BSOD over a link`);
    const before = a.layoutState.y;
    t.emit('pointermove', x, y - 20, link); t.emit('pointerup', x, y - 20, link);
    assert.equal(a.layoutState.y, before - 10); assert.deepEqual(t.opened, []);
  }
});

test('Farmer remains draggable over a button while uncovered page controls keep their behavior', () => {
  const t = boot(), a = t.api; a.moveGroup(40, 200);
  const [x, y] = centre(a, a.actors.farmer), button = t.get('meet-ghost');
  t.emit('pointerdown', x, y, button); assert.equal(a.drag?.target.kind, 'farmer');
  t.emit('pointermove', x, y - 20, button); t.emit('pointerup', x, y - 20, button);
  assert.equal(a.drag, null);
  t.emit('pointerdown', 1500, 20, button); assert.equal(a.drag, null);
  button.onclick(); assert.match(t.get('status').textContent, /^Meet Ghost Protocol/);
});

/* ---------- pet life (pets.json pet_life), added 2026-10-09 ---------- */
const registry = JSON.parse(readFileSync(new URL('../pets.json', import.meta.url), 'utf8'));
const life = registry.pet_life;
function run(t, seconds) { for (let i = 0; i < seconds * 20; i++) { t.tick(50); t.api.step(.05); } }
const pet = (t, id) => t.api.actors.pets.find(p => p.id === id);
const only = (t, ...keep) => { for (const p of t.api.actors.pets) p.docked = !keep.includes(p); }; // set the others aside

test('Every pet has a known kind, and every movement rule names a real pet or kind', () => {
  const kinds = new Set(Object.keys(life.kinds)), arts = new Set(registry.pets.map(p => p.art));
  for (const p of registry.pets) assert.ok(kinds.has(p.kind), `${p.pet} has kind ${p.kind}`);
  for (const name of [...life.friends.flat(), ...life.tag.flat(), ...life.chases.flat()]) assert.ok(arts.has(name) || kinds.has(name), name);
  for (const k of Object.values(life.kinds)) assert.ok(['sky', 'swim', 'ground'].includes(k.zone));
  assert.equal(registry.pets.find(p => p.art === 'voicemeeter-bug').kind, 'bug');
});

test('Sky pets stay high, the fish swims mid-height, and ground pets stay on the grass', () => {
  const t = boot({ reduced: false });
  for (const p of t.api.actors.pets) if (p.kind === 'bird' || p.kind === 'bug') p.docked = true; // no chases pulling anyone out of their zone
  run(t, 20);
  for (const p of t.api.actors.pets) {
    if (p.docked || p.id === 'python-panther') continue; // the cat climbs the sides
    const b = t.api.petBounds(p), zone = life.kinds[p.kind].zone, at = (p.y - b.y0) / (b.y1 - b.y0);
    if (zone === 'sky') assert.ok(at <= .4, `${p.id} is high (${at.toFixed(2)})`);
    if (zone === 'swim') assert.ok(at >= .3 && at <= .8, `${p.id} swims mid (${at.toFixed(2)})`);
    if (zone === 'ground') assert.equal(p.y, b.y1, `${p.id} is on the grass`);
  }
});

test('Birds fly together and the friend groups hang out', () => {
  const t = boot({ reduced: false });
  pet(t, 'goldfish').docked = true; pet(t, 'voicemeeter-bug').docked = true; // nothing for the birds to chase
  run(t, 25);
  const birds = t.api.actors.pets.filter(p => p.kind === 'bird');
  const spread = Math.max(...birds.map(p => p.x)) - Math.min(...birds.map(p => p.x));
  assert.ok(spread < 80, `flock spread ${spread.toFixed(1)}`);
  for (const group of life.friends) {
    const xs = group.map(id => pet(t, id).x);
    assert.ok(Math.max(...xs) - Math.min(...xs) < 80, `${group.join(', ')} are together`);
  }
});

test('Voicemeeter Bug runs from the birds and the fish chases it; the fish runs from the birds', () => {
  const t = boot({ reduced: false });
  const fish = pet(t, 'goldfish'), finch = pet(t, 'finance-finch'), bug = pet(t, 'voicemeeter-bug');
  only(t, finch, bug);
  bug.x = 300; bug.vx = 0; bug.y = t.api.petBounds(bug).y1; finch.x = bug.x - 20; finch.y = bug.y - 10;
  const before = Math.abs(bug.x - finch.x);
  run(t, 2);
  assert.ok(Math.abs(bug.x - finch.x) > before, 'the bug runs from the bird');
  only(t, fish, bug);
  bug.x = 300; bug.vx = 0; fish.x = bug.x + 100; fish.y = bug.y - 30; fish.vx = fish.vy = 0;
  const gap = Math.hypot(fish.x - bug.x, fish.y - bug.y);
  run(t, 1);
  assert.ok(Math.hypot(fish.x - bug.x, fish.y - bug.y) < gap, 'the fish closes on the bug');
  finch.docked = false; finch.x = fish.x - 15; finch.y = fish.y; t.api.step(.05);
  assert.equal(fish.fleeing, true, 'the fish runs from the bird');
});

test('A second bug is chased with no code change', () => {
  const t = boot({ reduced: false });
  const finch = pet(t, 'finance-finch'), first = pet(t, 'voicemeeter-bug');
  const bug2 = { ...first, id: 'another-bug', name: 'Another Bug', x: 300, vx: 0, wall: 0 };
  t.api.actors.pets.push(bug2); only(t, finch, bug2);
  finch.x = 280; finch.y = bug2.y - 10; run(t, 1);
  assert.equal(bug2.fleeing, true);
});

test('Cat and dog play tag, and the cat escapes up a wall', () => {
  const t = boot({ reduced: false });
  const cat = pet(t, 'python-panther'), dog = pet(t, 'drum-dog'), b = t.api.petBounds(cat);
  only(t, cat, dog);
  cat.x = b.x1 - 1; dog.x = b.x1 - 20;
  run(t, 1);
  assert.ok(cat.wall || cat.airborne, 'the chased cat went up the wall');
  assert.ok(cat.y < b.y1, 'the cat is off the grass');
  run(t, 6);
  dog.x = 300; cat.x = 302; cat.wall = 0; cat.airborne = false; cat.y = dog.y;
  const [game] = [...t.api.tagGames.values()]; game.graceUntil = 0; game.it = 'drum-dog';
  t.api.step(.05);
  assert.equal(game.it, 'python-panther', 'tagged: the cat is it');
});

test('Humans hop as they walk', () => {
  const t = boot({ reduced: false }); run(t, 6);
  for (const p of t.api.actors.pets.filter(p => p.kind === 'human')) assert.ok(p.playHopAt, `${p.id} hopped`);
});
