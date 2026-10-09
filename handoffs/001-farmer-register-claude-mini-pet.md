status: open
for: farmer (any assistant working on astras-pet-apps)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: PET-FILES.md "Adding a pet to the Cage", pets.json, scripts/generate-pets.mjs, handoffs/002-any-build-claude-mini-pet.md
---
## Task
Welcome a new pet to the Cage: **Claude Mini Pet** (`claude-mini-pet`), a small always-on-top
Windows control for Claude, like the Codex/ChatGPT desktop "Mini" pet. Astra asked for an
orange face.

1. Add the `pets.json` entry: `repo: "claude-mini-pet"`, `role: "pet"`, `status: "hatching"`,
   `published: false`, `added: "2026-10-09"`, `asset_date: "20261009"`,
   job: "A small floating Claude control on the Windows desktop: an orange face, a status
   bubble and a quick-chat box."
2. Add its prompt to `PETS` in `scripts/generate-pets.mjs`: an original orange-faced
   character. Its palette must not match another pet. It must not copy OpenAI's or anyone
   else's pet art (AGENTS.md: Astra's own characters only).
3. **Ask Astra before generating** (one image, billed to her OpenAI account). Then
   `npm run build`, look at `art/roster-sheet.png`, `npm run check`, `npm test`.

## Done when
The pet shows in the Cage and ROSTER.md with nine draft moods, and checks pass.
The art stays a draft until Astra approves it.

## Return
Work on a branch, open a PR, set this card to `status: done`. Set `published: true` only
after `findastra/claude-mini-pet` exists on GitHub with the `pet-app` topic.
