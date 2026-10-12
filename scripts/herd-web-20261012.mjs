// Builds herd-web-20261012.html: the 3D map of every pet, model, program and piece of
// infrastructure in Astra's PetOS, and everything that flows between them.
// Sources: pets.json (pets, pipeline, seeds, relations) and herd-web.json (everything that is not a
// pet with a repo). Run by npm run build. Claude Opus 5.5 (claude-opus-5-5), 2026-10-12.
import { readFileSync } from 'node:fs';
import { allPets } from './farmer-rounds-20261009.mjs';

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Every node and link, checked: a link to an unknown node throws instead of vanishing. */
export function herdWebData(registry, extra) {
  const nodes = new Map();
  const add = (n) => { if (nodes.has(n.id)) throw new Error(`duplicate node ${n.id}`); nodes.set(n.id, n); };
  for (const p of allPets(registry)) {
    add({ id: p.repo, name: p.repo === 'spoonfed' ? 'Spoonfed Sugarcube' : p.pet,
      type: p.role === 'host' ? 'host' : p.stage === 'pipeline' ? 'pipeline' : 'pet',
      state: 'now', job: p.job || '', status: p.status || null, repo: p.repo, visibility: p.visibility || null, art: p.art || null });
  }
  for (const s of registry.seeds?.pets || []) {
    add({ id: slug(s.pet), name: s.pet, type: 'seed', state: 'planned', job: s.job === 'undecided' ? 'Job undecided.' : s.job, repo: null });
  }
  add({ id: 'astra', name: 'Astra (you)', type: 'you', state: 'now', job: 'Every pet reports to you, and you approve anything that matters.' });
  for (const n of extra.nodes) add({ ...n });
  for (const n of nodes.values()) {
    n.layer ??= extra.type_layers[n.type];
    if (!extra.layers[n.layer]) throw new Error(`${n.id} has no layer`);
  }

  const group = (t) => [...nodes.values()].filter((n) => n.type === t).map((n) => n.id);
  const expand = (id) => id === '@pets' || id === 'pets' ? [...group('pet'), ...group('pipeline')]
    : id === '@seeds' ? group('seed') : id === '@roadmap' ? group('roadmap') : [id];
  const links = [];
  const push = (from, to, carries, state, why, herdWide = false) => {
    for (const a of expand(from)) for (const b of expand(to)) {
      if (!nodes.has(a)) throw new Error(`unknown "from": ${a}`);
      if (!nodes.has(b)) throw new Error(`unknown "to": ${b}`);
      if (a === b) continue;
      links.push({ from: a, to: b, carries, state, why, herdWide });
    }
  };
  for (const l of registry.relations.links) push(l.from, l.to, l.carries, l.state, l.why);
  for (const s of registry.seeds?.pets || []) for (const w of s.works_with || []) push(slug(s.pet), w.pet, 'findings', 'planned', w.why);
  for (const l of extra.links) push(l.from, l.to, l.carries, l.state, l.why, [l.from, l.to].includes('@pets'));

  // Which architecture layer a link belongs to, so its colour matches Astra's chart:
  // 1 anything touching you, a device or the Farm; 2 the registry (Pet Directory, Program Manager);
  // 5 anything touching an AI model or the harness, or code an assistant builds; 3 anything else the
  // Farmer does; 6 anything touching a real program; 4 pet talking directly to pet.
  const L = (id) => nodes.get(id).layer;
  for (const l of links) {
    const ends = [l.from, l.to], has = (layer) => ends.some((id) => L(id) === layer);
    l.layer = has(1) ? 1 : (l.carries === 'registry' || has(2)) ? 2
      : (has(5) || ['model', 'builds'].includes(l.carries)) ? 5
      : ends.some((id) => nodes.get(id).type === 'host') ? 3
      : (has(6) || ['opens', 'manages', 'runs-on'].includes(l.carries)) ? 6 : 4;
  }
  const carries = { ...registry.relations.carries, ...extra.carries };
  const states = { ...extra.states };
  for (const l of links) {
    if (!carries[l.carries]) throw new Error(`unknown kind: ${l.carries}`);
    if (!states[l.state]) throw new Error(`unknown state: ${l.state}`);
  }
  return { nodes: [...nodes.values()], links, carries, states, types: extra.types, layers: extra.layers };
}

/** Each pet's idle mood frame, embedded so icons also work when the page is opened by double-click. */
export function petIcons(index) {
  return Object.fromEntries(Object.entries(index.pets).map(([art, p]) => [art, 'data:image/png;base64,' + readFileSync(p.frames.idle).toString('base64')]));
}

export function buildHerdWeb(registry, extra, template, icons = {}) {
  const data = herdWebData(registry, extra);
  for (const n of data.nodes) { n.icon = (n.art && icons[n.art]) || null; delete n.art; }
  return template.replace('__DATA__', () => JSON.stringify(data).replaceAll('<', '\\u003c'));
}

export const HERD_WEB = { output: 'herd-web-20261012.html', template: 'scripts/herd-web-template-20261012.html', extra: 'herd-web.json' };
export const readHerdWebSources = () => ({ extra: JSON.parse(readFileSync(HERD_WEB.extra, 'utf8')), template: readFileSync(HERD_WEB.template, 'utf8'),
  icons: petIcons(JSON.parse(readFileSync('art/frames/index.json', 'utf8'))) });
