// Builds ROSTER.md (the running list) from pets.json. The count here is the count everywhere.
import { OWNER, assetPaths } from './lib.mjs';

export function counts(registry) {
  const apps = registry.pets || [], mascots = registry.mascots || [];
  const companions = apps.reduce((n, p) => n + (p.companions || []).length, 0);
  return { apps: apps.length, companions, mascots: mascots.length, characters: apps.length + companions + mascots.length, published: apps.filter((p) => p.published !== false).length };
}

/** Every drawn character in sheet order: mascots, then each app's pet followed by its companions. */
export function order(registry) {
  return [...(registry.mascots || []).map((m) => ({ id: m.art, note: m.note })), ...(registry.pets || []).flatMap((p) => [{ id: p.art, note: p.note }, ...(p.companions || []).map((id) => ({ id, note: `Companion in ${p.pet}.` }))])];
}

export function buildRoster(registry, moods, names = {}, frames = {}) {
  const img = (id, mood, w = 64) => `<img src="${frames[id]?.[mood] || assetPaths(registry, id).frame(mood)}" width="${w}" height="${w}" alt="${id} ${mood}">`;
  const n = counts(registry);
  const out = [];
  out.push('# Roster', '', '*The running list of everyone who lives in the Cage. Generated from [pets.json](pets.json) by `npm run build`; edit `pets.json`, not this file.*', '');
  out.push(`**${n.apps} pet apps so far, drawn as ${n.characters} characters (${n.apps} app pets, ${n.companions} companion${n.companions === 1 ? '' : 's'}, ${n.mascots} mascot${n.mascots === 1 ? '' : 's'}). ${n.published} of the ${n.apps} pet apps have a repo on GitHub.**`, '');
  out.push(`Whether each of those repos carries its \`pet.json\` and the \`pet-app\` topic is not recorded here. Run \`npm run check -- --online\` to ask GitHub.`, '');
  out.push(`Last updated ${registry.updated}. Drawings below are **drafts** unless their notes record Astra's approval. The pets are generated pixel art; how they are made is in [PET-FILES.md](PET-FILES.md).`, '');
  out.push('![Every character in every mood](art/roster.png)', '', `Sheet order: rows are ${order(registry).map((o) => names[o.id] || o.id).join(', ')}; columns are ${moods.join(', ')}.`, '');

  out.push('## Pet apps', '', '| # | Pet | Role | Status | On GitHub | What it does | Art |', '|---|---|---|---|---|---|---|');
  (registry.pets || []).forEach((p, i) => {
    const where = p.published === false ? 'not yet' : p.visibility === 'private' ? 'private repo' : `[${p.repo}](https://github.com/${OWNER}/${p.repo})`;
    out.push(`| ${i + 1} | **${p.pet}** | ${p.role} | ${p.status} | ${where} | ${p.job} | ${[p.art, ...(p.companions || [])].map((id) => img(id, 'idle', 48)).join(' ')} |`);
  });
  if ((registry.mascots || []).length) {
    out.push('', '## Mascots', '', '| Name | Where it lives | What it does | Art |', '|---|---|---|---|');
    for (const m of registry.mascots) out.push(`| **${m.name}** | ${m.lives} | ${m.job} | ${img(m.art, 'idle', 48)} |`);
  }

  out.push('', '## Every mood', '');
  for (const c of order(registry)) {
    out.push(`### ${names[c.id] || c.id}`, '', c.note ? `*${c.note}*` : '', '', '| ' + moods.join(' | ') + ' |', '|' + moods.map(() => ':-:').join('|') + '|', '| ' + moods.map((m) => img(c.id, m, 56)).join(' | ') + ' |', '');
  }

  out.push('## Candidates (not counted until Astra says yes)', '', 'Public repos or local projects that might be pets. The Goldfish flags none of these, because none has a `pet.json` or the `pet-app` topic yet.', '');
  for (const c of registry.candidates || []) out.push(`- **${c.name}** (\`${c.repo}\`): ${c.why}`);
  out.push('', '## How a new pet joins', '', 'See [PET-FILES.md](PET-FILES.md): add its entry to `pets.json` and its prompt to `scripts/generate-pets.mjs`, generate its sheet, run `npm run build`, and the count, README table, roster and page update together.', '');
  return out.join('\n');
}
