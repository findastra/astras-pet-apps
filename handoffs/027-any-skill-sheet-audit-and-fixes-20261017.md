status: open (waiting on Astra: rename pet-program-40 to skill-scout; adopt pet-app v2; yes or no per fix batch)
for: any
from: Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-17
needs: findastra/pet-program-40 (Skill Scout) docs/skill-sheet-audit-20261017.md, skills/skill-fix/SKILL.md, proposals/pet-app/SKILL.md
---
## What I did
Astra asked (2026-10-17, overnight session) for a thorough audit of the skill sheets, Skill Scout's own tools and
tricks, a proposed new skill sheet, the work pushed to "the skill-scout repo", and readiness to fix every sheet.

- **findastra/pet-program-40** (Skill Scout's repo; there is no `skill-scout` repo), branch
  `claude/skill-scout-v0.1-20261017`, commit `b02f3a9`, **not on `main`**:
  - `skill-scout-20261017.mjs`: census, lint (rules SS001 to SS062), diff and public snapshot. Node built-ins, read-only.
  - `rules/skill-scout-rules-20261017.json`: retired names, old folders, known conflicts (data, not code).
  - `test/skill-scout-test-20261017.mjs`: 29 tests, each rule with a "does not fire" case. `npm test` passes.
  - Tricks: `skills/skill-census`, `skills/skill-fix`, `skills/write-a-skill`; `templates/` for SKILL.md and AGENTS.md.
  - `proposals/pet-app/SKILL.md`: pet-app v2; review of v1 in `docs/pet-app-skill-review-20261017.md`.
  - `docs/skill-sheet-audit-20261017.md`: the audit (what to fix and why, systemic errors, future paths, fix plan).
  - `index.html` (pet program page to the framework), `pet.json` (first pet with an `intelligence_levels` block),
    README, AGENTS.md, CLAUDE.md, `data/catalog-public-20261017.*` (public catalog), `art/` (the 2026-10-12 seed icon,
    copied from this repo; no new art was generated).
- **This branch** `claude/skill-scout-audit-20261017` of astras-pet-os: this card and its row, and two fixes where the
  core contradicted itself: AGENTS.md ("on a branch merged that day" → "on a branch Astra merges"; "who hosts the Cage
  today" → "whose pet program is The Farm") and `skills/handoff` ("the Cage's host" → "runs The Farm"). `npm test`: 93 pass.
- **On Astra's PC:** the full private catalog and report in `%LOCALAPPDATA%\astras-pet-os\pet-program-40\`
  (`catalog-20261017.json`, `report-20261017.md`). Working copies are in the session scratchpad, not in
  `Documents\Astra's PetOS`; nothing in the pet folders was changed. A hub worktree was added under the scratchpad.
- **Not done:** the repo rename (blocked for agents; Astra's call), no sheet in any other repo was edited, the
  `pet.json` job of the Friendly Farmer still says "Hosts the Cage" (it is in the one-list registry: change it with
  the Farmer's submission so the lists stay in step), `repo_exists` in pet-programs.json is still false for repos that
  exist (37 to 77, iron-gates, the-recovery-room).

## Task
Run the fix batches in Skill Scout's audit, in order, following `skills/skill-fix` in pet-program-40:
A errors (unity-unicorn's garbled account name, startup-star's hidden control character, File Master's agent and
weekly task paths), B core contradictions (Goldfish's 32×32 and its README line shape vs pet-organizer), C the old hub
name and the Cage in the 2026-10-08/09 pet repos, D one copy per trick, E changelog cleanup. Batches A (the
`~\.claude` files), D and E need Astra's yes first.

## Done when
A new census (`node skill-scout-20261017.mjs census --branches --github findastra --hub <astras-pet-os>`) shows the
batch's finding ids gone for the repos touched, and each repo's branch is pushed.

## Return
Update `## What I did` here with every repo, branch and commit; set status: done when all approved batches are in.
