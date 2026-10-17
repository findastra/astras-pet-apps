// mass-delete guard (Astra, 2026-10-16). Rules for file-master-v1.0-mass-delete-v1.0, File Master's shared tool.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-16. Policy: skills/farm-security/SKILL.md, section 10.
//
// Who may use it: File Master owns it. Any other animal (a pet in pets.json) may use it only with a grant, and
// only on its OWN repo folder or its declared data folder, never another pet's, never the core, never `.git`.
// What it does: it never hard-deletes. It plans, shows the list, waits for Astra (L4), then MOVES the items into
// `_to_delete/<run-id>/` inside the same folder with an undo manifest. Emptying `_to_delete` is Astra's job.
// Who is told: every plan and every run sends a notice to File Master and GitHub Goldfish (and the Pet Police
// Officer watches the write). The notice is data for them; it grants nothing.
import { relative, resolve, isAbsolute, sep } from 'node:path';
import { assertAnimal, assertInside } from './animal-guard-20261013.mjs';

export const OWNER = 'file-master';
export const NOTIFY = ['file-master', 'github-goldfish'];
export const LIMITS = { maxItems: 200 }; // a bigger run is split, so each list stays reviewable
const NEVER = [/(^|[\\/])\.git([\\/]|$)/, /(^|[\\/])_to_delete([\\/]|$)/, /(^|[\\/])pet\.json$/, /(^|[\\/])(AGENTS|CLAUDE)\.md$/, /(^|[\\/])LICENSE$/];

/**
 * Checks a delete request and returns the plan (or throws with the reason it is refused).
 * @param {object} req { pet, root, paths, grants, registry, runId, coreRepo }
 *   pet: the repo of the pet asking; root: that pet's own folder; grants: pets.json `grants` (Iron Gates).
 */
export function planDelete({ pet, root, paths, grants = {}, registry, runId, coreRepo = 'astras-pet-os' }) {
  assertAnimal(registry, pet, 'mass-delete for');
  if (pet === coreRepo) throw new Error('mass-delete: never in the core (ring 0). Core changes go through a pull request Astra merges.');
  if (pet !== OWNER && !(grants[pet] || []).includes(`${OWNER}-v1.0-mass-delete-v1.0`)) throw new Error(`mass-delete: ${pet} has no grant for File Master's mass-delete tool. Iron Gates asks, Astra approves.`);
  if (!Array.isArray(paths) || !paths.length) throw new Error('mass-delete: nothing to delete.');
  if (paths.length > LIMITS.maxItems) throw new Error(`mass-delete: ${paths.length} items is over the limit of ${LIMITS.maxItems}; split the run.`);
  const items = paths.map((p) => {
    assertInside(root, p);
    const rel = relative(resolve(root), resolve(root, p));
    if (!rel || isAbsolute(rel)) throw new Error(`mass-delete: "${p}" is the whole folder, not an item in it.`);
    if (NEVER.some((re) => re.test(rel))) throw new Error(`mass-delete: "${rel}" is protected (git history, rules, pet.json, licence or the bin itself).`);
    return { path: rel.split(sep).join('/'), moveTo: `_to_delete/${runId}/${rel.split(sep).join('/')}` };
  });
  return {
    tool: `${OWNER}-v1.0-mass-delete-v1.0`, pet, runId, items, count: items.length,
    needs: 'L4 approval of this exact list before anything moves',
    undo: `_to_delete/${runId}/undo-${runId}.json`,
    notify: NOTIFY.map((to) => ({ to, about: `${pet} asked to remove ${items.length} item(s) in its own folder (run ${runId})` })),
  };
}

/** The notices File Master and GitHub Goldfish receive for a plan or a finished run. */
export function notices(plan, stage = 'planned') {
  return plan.notify.map((n) => ({ to: n.to, from: plan.pet, tool: plan.tool, run: plan.runId, stage, count: plan.count, items: plan.items.map((i) => i.path) }));
}
