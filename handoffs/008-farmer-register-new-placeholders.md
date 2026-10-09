status: open (art waits on Astra's OK)
for: farmer (any assistant working on astras-pet-apps)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: PET-FILES.md "Adding a pet to the Cage" and "How pets move in the Cage", PET-WORDS.md, pets.json, the five repos below
---
## Task
Welcome five new **hatching** placeholder pets to the Cage. Each repo was brought up to the pet
file rules on 2026-10-09: `pet.json` (with the `cage` block), a `sprite.json` stub, `index.html`,
`AGENTS.md`, `CLAUDE.md`, MIT `LICENSE` and the `pet-app` topic. None has art, and none has a job
Astra has signed off.

| Pet | Repo | Visibility | Job (from its `pet.json`) | Suggested `kind` |
|---|---|---|---|---|
| Wifi Butterfly | [wifi-butterfly](https://github.com/findastra/wifi-butterfly) | private | Placeholder. What it does is not decided yet. | `bug` (the birds and the fish chase it) |
| Mesh Moth | [mesh-moth](https://github.com/findastra/mesh-moth) | private | Placeholder for a pet that stands for a Meshtastic node. | `bug` |
| Deck Duck | [deck-duck](https://github.com/findastra/deck-duck) | public | Placeholder: an Elgato Stream Deck inspired pet. | `bird` (joins the flock) |
| Rift Rabbit | [rift-rabbit](https://github.com/findastra/rift-rabbit) | private | A white rabbit that preps and tracks VR software and performance. | unlisted, so it wanders the ground; or add a `rabbit` kind with `hops: true` |
| Patch Cat | [patch-cat](https://github.com/findastra/patch-cat) | private | Placeholder. The job is not decided yet. | `cat` |

Already on the desk, so **not** part of this card:
- **Mail Snail**: card 007.
- **Meme Fiend**: PR #3 (`notice/meme-fiend-20261009`) adds its `pets.json` entry.
- **Backup Beaver**: PR #4 (`add-backup-beaver-candidate`) lists it as a candidate.
- **Fuzzboi Friend**: card 006.
- **Raspberry Berry** is local only (`Projects\raspberry-berry`), with no GitHub repo yet. Leave it out
  until Astra OKs a repo.

1. Ask Astra which of the five she wants in the Cage now. The Patch Cat note in
   `docs/handoff-claude-20261009.md` asks to wait for its mood sheet, so confirm that too.
2. For each approved pet, add the `pets.json` entry: `repo`, `pet`, `role: "pet"`, `kind`,
   `status: "hatching"`, `job`, `art` (the repo name), `visibility`, `published: true`,
   `added: "2026-10-09"`, `asset_date` on the day the art is made. Leave the app link out until
   there is a live page.
3. **Art: ask Astra first.** Generation is billed, one sheet per pet. Palettes must not match any
   other pet's. A butterfly and a moth side by side need clearly different colours.
4. `npm run build`, look at the roster sheet, `npm run check`, `npm test`. Then copy each pet's nine
   frames into its repo's `art/` and list them in its `sprite.json`.

## Done when
Each approved pet shows in the Cage and ROSTER.md, and the checks pass. Any pet Astra holds back is
listed here as waiting. The art stays a draft until Astra approves it.

## Return
Work on a branch, open a PR, set this card to `status: done`.
