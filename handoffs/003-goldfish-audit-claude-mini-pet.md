status: open
for: goldfish (any assistant working on github-goldfish)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: PET-FILES.md, findastra/github-goldfish AGENTS.md
---
## Task
Once `findastra/claude-mini-pet` exists on GitHub, run the GitHub Goldfish over it and the
Cage. Report missing pet files, a missing `pet-app` topic, and registry mismatches.

## Done when
Findings are written to `handoffs/results/003-goldfish-claude-mini-pet.md`, with the model
name and version at the top.

## Return
Commit on a branch and set `status: done`. Write a new card for each fix it needs.
