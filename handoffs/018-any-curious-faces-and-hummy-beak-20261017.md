status: open (waiting on Astra: OpenAI API credits, about $1.05 for five sheets)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: PET-FILES.md ("Making or redoing a pet's art", `--match`), scripts/generate-pets.mjs, art/frames/index.json
---
## What I did
Carried over from the Claude chat of 2026-10-08/09 that built the generated-art pipeline (now on `main`:
`sheet-to-sprites.mjs`, `indicators.mjs`, `accessories.mjs`, `build-frames.mjs`, `generate-pets.mjs --match`).

- Measured every `curious` frame against its pet's `idle` face (2026-10-09). Lopsided eyes: **Finance Finch**
  (+10.0 % face asymmetry) and **VSCode Angel** (+5.4 %). Eye style changes but stays symmetric: **Python Panther**
  (slits become wide circles) and **Patty / Paper Girl** (small eyes become large ovals). Chip is not affected: it
  uses the original Data Dealer drawing code.
- Rewrote the `curious` instruction in the shared `STYLE` (both eyes identical and forward; curiosity only from a
  raised brow and a small open mouth). It is on `main`; no sheet has been regenerated with it yet.
- **Health Hummy's beak** was regenerated once with a "long thin needle" prompt (2026-10-08). It came back better
  but still short. Not redone.
- Nothing regenerated: the OpenAI API account answered `429 You have no credits remaining` on 2026-10-09.
- This card is on branch `claude/chat-reconcile-20261017` of this repo.

## Task
1. When Astra has topped up credits and says go:
   `node scripts/generate-pets.mjs finance-finch vscode-angel python-panther paper-girl --match`
   (`--match` keeps each pet's approved body; never a plain regeneration of approved art).
2. Health Hummy: one sheet with the beak drawn side-on as a long straight needle; also `--match`.
3. `npm run build`, look at `art/roster.png`, `npm test`.

## Done when
All four `curious` faces keep the same eye shape as `idle`, Health Hummy has a needle beak, and Astra has looked
at the roster.

## Return
Update `## What I did` (sheets, cost, tests), set `status: done`, commit on a branch, PR for Astra.
