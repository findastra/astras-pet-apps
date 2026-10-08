// Shared by update-readme.mjs, check-cage.mjs, build-art.mjs and the tests.
export const OWNER = 'findastra';
export const START = '<!-- pets:start (generated from pets.json by scripts/update-readme.mjs; do not edit by hand) -->';
export const END = '<!-- pets:end -->';
export const STATUSES = ['hatching', 'growing', 'grown'];
export const ROLES = ['host', 'pet'];
export const ENTRY_KEYS = ['repo', 'pet', 'role', 'status', 'job', 'art', 'added'];

const esc = (s) => s.replace(/\|/g, '\\|');

export function buildTable(registry) {
  const rows = (registry.pets || []).map((p) => {
    const repo = `https://github.com/${OWNER}/${p.repo}`;
    const get = p.published === false ? 'not on GitHub yet' : `[Download ZIP](${repo}/archive/refs/heads/main.zip)`;
    const name = p.published === false ? `**${esc(p.pet)}**` : `**[${esc(p.pet)}](${repo})**`;
    return `| ${name} | ${p.role} | ${p.status} | ${esc(p.job)} | ${get} |`;
  });
  return ['| Pet | Role | Status | What it does | Get it |', '|---|---|---|---|---|', ...rows].join('\n');
}

export function applyTable(readme, registry) {
  const a = readme.indexOf(START), b = readme.indexOf(END);
  if (a < 0 || b < a) throw new Error('README.md is missing the pets:start / pets:end markers');
  return readme.slice(0, a) + START + '\n' + buildTable(registry) + '\n' + readme.slice(b);
}

/** Problems with pets.json, the README table, and (when given) the drawn art. Empty list = fine. */
export function validate(registry, readme, art) {
  const problems = [];
  if (!registry || !Array.isArray(registry.pets)) return ['pets.json has no "pets" array'];
  const seen = new Set(), arts = new Set();
  for (const p of registry.pets) {
    for (const k of ENTRY_KEYS) if (!p[k]) problems.push(`${p.repo || '(entry)'}: missing "${k}"`);
    if (p.repo && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.repo)) problems.push(`${p.repo}: repo names are lowercase words joined by hyphens`);
    if (p.status && !STATUSES.includes(p.status)) problems.push(`${p.repo}: status must be ${STATUSES.join(', ')}`);
    if (p.role && !ROLES.includes(p.role)) problems.push(`${p.repo}: role must be ${ROLES.join(' or ')}`);
    if (seen.has(p.repo)) problems.push(`${p.repo}: listed twice`);
    if (arts.has(p.art)) problems.push(`${p.repo}: art "${p.art}" is used twice`);
    seen.add(p.repo); arts.add(p.art);
    for (const c of p.companions || []) { if (arts.has(c)) problems.push(`${p.repo}: companion art "${c}" is used twice`); arts.add(c); }
    for (const id of Object.keys(p.says || {})) if (id !== p.art && !(p.companions || []).includes(id)) problems.push(`${p.repo}: "says" lists ${id}, which is not one of its characters`);
  }
  const hosts = registry.pets.filter((p) => p.role === 'host');
  if (hosts.length !== 1) problems.push(`there must be exactly one host (the Cage's own pet); found ${hosts.length}`);
  else if (hosts[0].repo !== registry.cage) problems.push(`the host's repo must be the Cage repo "${registry.cage}"`);
  for (const m of registry.mascots || []) { if (!m.art || !m.name) problems.push('a mascot needs "name" and "art"'); arts.add(m.art); }
  if (art) for (const id of arts) if (!art.sprites[id]) problems.push(`no art drawn for "${id}" (add it to scripts/pets-art.mjs and run npm run build)`);
  if (art) for (const id of Object.keys(art.sprites)) if (!arts.has(id)) problems.push(`art "${id}" is drawn but not listed in pets.json`);
  try { if (applyTable(readme, registry) !== readme) problems.push('README.md pet table is out of date: run npm run build'); }
  catch (e) { problems.push(e.message); }
  return problems;
}
