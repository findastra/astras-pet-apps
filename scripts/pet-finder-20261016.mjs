// pet-finder: a tool of The Farm (Friendly Farmer). Finds pets that are missing from the pet list, or listed wrong.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-16. Skill: skills/pet-finder/SKILL.md.
//
// Read-only. It compares three places a pet can live and reports what does not line up:
//   1. pet-programs.json (every pet program, numbered; the profile list is written from it),
//   2. pets.json (the registry: registered pets and the pipeline),
//   3. the repos on GitHub (and, with --local, the pet folders on Astra's PC).
// It never adds a pet anywhere: nobody becomes an animal by saying so (skills/farm-security). Astra decides.
//
//   node scripts/pet-finder-20261016.mjs                       # asks GitHub (GITHUB_TOKEN optional)
//   node scripts/pet-finder-20261016.mjs --repos repos.json    # offline: [{ name, private, description, petJson }]
//   node scripts/pet-finder-20261016.mjs --local "%USERPROFILE%\Documents\Astra's Pet Apps"
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OWNER = 'findastra';
const PLACEHOLDER = /pet-program-\d+|icon-\d+/i;

/**
 * @param {{ programs: object[], registry: object, repos: object[], local?: object[] }} input
 *   repos: [{ name, private, description, petJson }] (petJson is the repo's pet.json, or null)
 *   local: [{ folder, onGitHub, pet, program, file }] pet metadata found in folders on the PC
 * @returns {{ kind: string, pet: string|null, repo: string|null, number: number|null, detail: string }[]}
 */
export function findPets({ programs, registry, repos, local = [] }) {
  const out = [];
  const add = (kind, f) => out.push({ kind, pet: null, repo: null, number: null, ...f });
  const online = new Map(repos.filter((r) => !r.fork && !r.archived && r.name !== OWNER).map((r) => [r.name, r]));
  const byRepo = new Map(programs.map((p) => [p.repo, p]));
  const byNumber = new Map(programs.map((p) => [p.number, p]));
  const registered = new Set([...(registry.pets || []), ...(registry.pipeline || [])].map((p) => p.repo));

  // 1. A repo on GitHub that is a pet (pet.json, or "pet program (#N)" in its description) but has no line.
  for (const r of online.values()) {
    if (byRepo.has(r.name)) continue;
    const pj = r.petJson || null;
    const num = pj && Number.isInteger(pj.number) ? pj.number : Number((/pet program \(#(\d+)/i.exec(r.description || '') || [])[1]) || null;
    if (!pj && !num) continue;
    const listed = num ? byNumber.get(num) : null;
    if (listed) add('wrong-repo', { pet: listed.icon, repo: r.name, number: num, detail: `#${num} ${listed.icon} lives in ${r.name}, but pet-programs.json says ${listed.repo}. Change its repo to ${r.name}.` });
    else add('not-listed', { pet: pj?.pet || null, repo: r.name, number: num, detail: `${r.name} is a pet repo${pj?.pet ? ` (${pj.pet})` : ''} with no pet program number. Astra decides whether it joins.` });
  }

  for (const p of programs) {
    const r = online.get(p.repo);
    // 2. A listed pet whose repo is not on GitHub: it cannot show on the profile.
    if (!r) { if (!out.some((f) => f.kind === 'wrong-repo' && f.number === p.number)) add('no-repo', { pet: p.icon, repo: p.repo, number: p.number, detail: `#${p.number} ${p.icon}: no ${p.repo} repo on GitHub, so it is left off the profile.` }); continue; }
    // 3. The pet's own pet.json calls it something else.
    const pj = r.petJson;
    if (pj?.pet && pj.pet !== p.icon) add('name-mismatch', { pet: p.icon, repo: p.repo, number: p.number, detail: `#${p.number}: pet-programs.json says ${p.icon}, ${p.repo}/pet.json says ${pj.pet}.` });
    // 4. Registered or pipeline pet programs that the registry does not know.
    if (['registered', 'pipeline'].includes(p.stage) && !registered.has(p.repo)) add('not-in-registry', { pet: p.icon, repo: p.repo, number: p.number, detail: `#${p.number} ${p.icon} (${p.stage}) is missing from pets.json. Registering it moves it through the gate, so Astra decides.` });
  }
  // 5. Placeholder names and missing homes (the profile shows them as they are; Astra names them).
  for (const p of programs) {
    if (PLACEHOLDER.test(p.icon)) add('placeholder-name', { pet: p.icon, repo: p.repo, number: p.number, detail: `#${p.number} has a placeholder for a pet name: "${p.icon}".` });
  }
  const homeless = programs.filter((p) => !p.assigned && online.has(p.repo));
  if (homeless.length) add('no-home', { detail: `${homeless.length} listed pets have no home yet: ${homeless.map((p) => `#${p.number} ${p.icon}${p.idea ? ` (idea: ${p.idea})` : ''}`).join(', ')}.` });

  // 6. Pets that live only on the PC.
  for (const l of local) {
    if (l.onGitHub || byRepo.has(l.folder)) continue;
    add('pc-only', { pet: l.pet, repo: l.folder, detail: `${l.pet || l.folder}${l.program ? ` (${l.program})` : ''} is only on the PC (${l.file}), not on GitHub.` });
  }
  return out;
}

// Pet metadata in the folders on the PC: pet.json, or a *-candidate-*.json with a "pet" field.
export function scanLocal(dir, onGitHub) {
  const found = [];
  for (const folder of readdirSync(dir)) {
    const path = join(dir, folder);
    if (!statSync(path).isDirectory()) continue;
    const files = readdirSync(path).filter((f) => f === 'pet.json' || /-candidate-\d{8}\.json$/.test(f));
    for (const file of files) {
      try {
        const j = JSON.parse(readFileSync(join(path, file), 'utf8'));
        if (j.pet) { found.push({ folder, onGitHub: onGitHub.has(folder), pet: j.pet, program: j.program || null, file }); break; }
      } catch { /* not pet metadata */ }
    }
  }
  return found;
}

async function gh(path, token) {
  const r = await fetch(`https://api.github.com${path}`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'friendly-farmer', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${path}`);
  return r.json();
}

async function githubRepos(token) {
  const out = [];
  for (let page = 1; page < 10; page++) {
    const batch = await gh(`/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`, token);
    for (const x of batch) {
      const file = await gh(`/repos/${OWNER}/${x.name}/contents/pet.json`, token).catch(() => null);
      let petJson = null;
      try { petJson = file?.content ? JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')) : null; } catch { /* broken pet.json */ }
      out.push({ name: x.name, private: x.private, fork: x.fork, archived: x.archived, description: x.description || '', petJson });
    }
    if (batch.length < 100) break;
  }
  return out;
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1].replace(/\\/g, '/')).href) {
  const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
  const programs = JSON.parse(readFileSync(arg('--programs') || 'pet-programs.json', 'utf8')).programs;
  const registry = JSON.parse(readFileSync(arg('--registry') || 'pets.json', 'utf8'));
  const repos = arg('--repos') ? JSON.parse(readFileSync(arg('--repos'), 'utf8')) : await githubRepos(process.env.GITHUB_TOKEN);
  const localDir = arg('--local');
  const local = localDir && existsSync(localDir) ? scanLocal(localDir, new Set(repos.map((r) => r.name))) : [];
  const findings = findPets({ programs, registry, repos, local });
  console.log(findings.length ? findings.map((f) => `- [${f.kind}] ${f.detail}`).join('\n') : 'Every pet is listed and lines up.');
}
