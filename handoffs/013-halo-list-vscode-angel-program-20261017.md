status: open (waiting on Astra: approve the design and tool levels in docs/halo-list-20261017.md, then the branch merge)
for: any
from: Claude Haiku 5.5 (claude-haiku-5-5), 2026-10-17
needs: PET-PROGRAM-FRAMEWORK.md, PET-FILES.md, TOOLS-AND-TRICKS.md, PROTECTION-RINGS.md, docs/halo-list-20261017.md, pet-programs.json (#16), vscode-angel's README.md and AGENTS.md
---
## What I did

Astra asked (2026-10-17) for a pet program for VSCode Angel: open any pet program, tool or trick in VS Code, rate how vibe-coded it is, list its errors, suggest a structure, and guide updates with `##` Markdown notes and the VS Code AI. Its one goal: stop anyone from not understanding their code. The AI parts are an L3 action.

The program is **Halo List, pet program #16** (already registered in `pet-programs.json` with the icon VSCode Angel). I did not create a new program or repo.

**This repo, branch `claude/halo-list-program-20261017` (local worktree at `.claude/worktrees/halo-list-20261017`, not pushed, not on `main`):**
- `pet-programs.json`: #16's `mini_descriptor.text` now describes the new job. `reviewed` stays `false`. The label is unchanged.
- `docs/halo-list-20261017.md`: the design. Five tools with their levels (open-in-vscode L2, initial-assessment L2, explainer L3, guided-update L3, notes L2), the rating checklist, the suggested structure, data, security, connections, moods, checklist and gates.
- `handoffs/013-…md` (this card) and its row in `handoffs/README.md`.

**`findastra/vscode-angel`, branch `claude/halo-list-pet-json-20261017`** (local clone at `%USERPROFILE%\Documents\Astra's Pet Apps\vscode-angel`, not pushed):
- See that branch's commit for `pet.json` and `AGENTS.md` changes (framework, audit block, public visibility, corrected Cage link, the job text). Those belong to the pet's own repo, so they go through its `cage.submit`.

**Not done:**
- No tool code is written. The Notes tool's start is the existing offline record app in `vscode-angel`.
- `npm run build` and `npm test` have not run. Node is not installed on this PC, so `profile` and generated files are stale until it runs.
- Nothing is pushed. Pushing a branch to a public repo needs Astra's OK.
- L4 has not approved the program or its AI tools. Private projects must not send code to an AI until L4 decides.

## Task
1. Astra approves `docs/halo-list-20261017.md`, or changes the tool levels.
2. Decide whether private projects may ever send code to an AI.
3. Approve pushing the two branches.
4. Run `npm run build` and `npm test` on a machine with Node, then merge.
5. Build the first two tools (open-in-vscode and initial-assessment) before any AI tool.

## Done when
Astra has approved the design, the branch is merged, and `npm test` passes.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
