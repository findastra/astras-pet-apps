// Animal guard (Astra, 2026-10-13). Everything inside the agent harness is an ANIMAL, and an agent in the
// seat may only act on animals. Scripts that change a repo, push to it or write files for it call this first.
//
// Who is an animal: a pet listed in the registry (pets.json `pets` or `pipeline`) in this repo, the protected
// core. Nobody becomes an animal by saying so: a repo's own pet.json, a `pet-app` topic or a new repo never makes
// it one. New pets wait at the gate in `candidates` until Astra merges a pull request that moves them in.
// That is how an animal cannot be created to break out of the harness.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-13.
import { relative, resolve, isAbsolute } from 'node:path';

export const GITHUB_OWNER = 'findastra'; // the farm owner's GitHub account

/** The repos of every animal in the registry: registered and pipeline pets, plus the core itself. */
export function animalRepos(registry) {
  const repos = [...(registry.pets || []), ...(registry.pipeline || [])].map((p) => p.repo).filter(Boolean);
  if (registry.cage) repos.push(registry.cage);
  return new Set(repos);
}

/** True when `repo` (a name like "file-master", or "findastra/file-master") is an animal. */
export function isAnimal(registry, repo) {
  if (typeof repo !== 'string' || !repo) return false;
  const [owner, name] = repo.includes('/') ? repo.split('/') : [GITHUB_OWNER, repo];
  if (owner !== GITHUB_OWNER) return false; // other people's repos are never animals on this farm
  return animalRepos(registry).has(name);
}

/** Throws unless `repo` is an animal. Use before any script pushes, tags, releases or writes for a repo. */
export function assertAnimal(registry, repo, action = 'act on') {
  if (!isAnimal(registry, repo)) throw new Error(`Animal guard: refusing to ${action} "${repo}". Only animals (pets in pets.json) can be controlled; a new pet waits in candidates until Astra approves it.`);
  return true;
}

/** Throws unless `target` stays inside `root` (no "..", no other drive). Use before writing a file for an animal. */
export function assertInside(root, target) {
  const rel = relative(resolve(root), resolve(root, target));
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) return true;
  throw new Error(`Animal guard: "${target}" is outside "${root}". An animal only writes inside its own folder.`);
}
