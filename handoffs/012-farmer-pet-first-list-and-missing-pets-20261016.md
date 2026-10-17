status: open (waiting on Astra: pet name for #77, homes, Chat Rat's registration, Workflow Whale's repo)
for: farmer
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-16
needs: skills/pet-organizer/SKILL.md, skills/pet-finder/SKILL.md, pet-programs.json, findastra/findastra README.md
---
## What I did
Astra asked (2026-10-16) for the pet name to come first in every listing on her profile, a check of the other repos
for missing pets, and two Friendly Farmer skills: pet-organizer and pet-finder.

**This repo, branch `claude/pet-first-profile-20261016` (not on `main`; merges only with Astra's OK):**
- `scripts/farmer-profile-20261009.mjs`: pet lines are now `N. **Pet** · *Home* · [`repo`](link) -- job [status]`.
  It still reads the old repo-first lines, so the next round converts them. `Planned: …` → `[planned]`,
  `Not decided yet: …` → `[job not chosen yet]`. Two-word names that open a line ("Startup Star: …") keep their capitals.
- `pet-programs.json`: #45 Closet Cat's repo is `the-cats-closet` (it was `pet-program-45`, which does not exist, so
  she sat in Web & More as "closet Cat"). #35 Chat Rat's job from chat-rat's own `pet.json`. #39 Procreate Panda's job
  from Astra (redlines in Procreate, her Procreate tools and drawings); also in `pets.json` seeds.
- New: `scripts/pet-finder-20261016.mjs` (read-only tool of The Farm), `skills/pet-organizer/SKILL.md`,
  `skills/pet-finder/SKILL.md`, `test/pet-first-test-20261016.mjs`; `test/rounds-test-20261009.mjs` expects pet first.
- `npm run build` (PET-PROGRAMS.md, cage-data.js, system-map-20261012.html regenerated), `npm test`: 82 of 82 pass.

**findastra/github-goldfish, branch `claude/pet-first-roster-20261016`:** `rosterChecks` reads pet-first lines and
flags repo-first ones; style doc updated. 48 of 48 tests pass.

**findastra/findastra:** README regenerated with the new script (see the commit there).

**Nothing on Astra's PC was changed.** Read only: `%USERPROFILE%\Documents\Astra's Pet Apps\workflow-whirlpool`.

## What pet-finder found (2026-10-16)
- Fixed: Closet Cat (#45) pointed at a repo that does not exist.
- **Chat Rat** (#35, pipeline) is not in `pets.json`. Registering moves it through the gate: Astra decides.
- **#77** is still `pet-program-77-icon-77` (vet-clinic triage). Needs a pet name.
- **Workflow Whale** (Workflow Whirlpool, OpenAI Codex 2026-10-16) exists only on the PC
  (`workflow-whirlpool-candidate-20261016.json`, `enrollment: candidate-not-enrolled`): no repo, no number.
- Names differ between pet-programs.json and the pet's own pet.json: #11 Patty / Paper Girl, #17 Gone Ghost / Ghost
  Protocol (the 2026-10-12 renames are not in those repos yet).
- 67 listed pets have no home yet; each has a suggested `idea` in pet-programs.json for Astra to approve.
- Not pets (no pet.json): startup-star (tool), the-kennel, the-shed, vet-clinic, role-fairy, worlds, Discord apps.

## Task
When Astra answers: put #77's name in `pet-programs.json` (and the repo's pet.json), approve homes by setting
`program` + `assigned: true`, register Chat Rat if she says so, and give Workflow Whale a number once its repo exists.
Then `npm run build`, `npm test`, and let the profile round run.

## Done when
pet-finder reports nothing but approved seeds without repos.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
