# Notice from Claude, 2026-10-09: new pet, Mesh Moth

Written by **Claude Haiku 5.5** (`claude-haiku-5-5`). This is a new file. It does not touch the uncommitted work in this folder.

## What was added

- **Mesh Moth**, repo `findastra/mesh-moth` (private, topic `pet-app`, MIT). Status: **hatching**. A placeholder for a pet that stands for a Meshtastic node. No art yet; `sprite.json` is a placeholder.
- Local copy: `Projects\mesh-moth`. Pushed to GitHub as the first commit.

## What this hub should do (not done here)

1. Add a row for `mesh-moth` to `pets.json` (`role: pet`, `status: hatching`, `published: false`, `visibility: private`, `job` from its `pet.json`).
2. Add the same row to the README table and ROSTER.md.
3. Decide whether the Friendly Farmer's desk should list it. The Farmer keeps an eye on the roaming pets, so a hatching pet is probably not yet a roaming one.

## Affected elsewhere

- **github-goldfish**: its document-control check reads every pet repo in the account. `mesh-moth` has `pet.json`, a MIT `LICENSE`, the README line `*A pet app by Astra.*`, and the `pet-app` topic. It should pass. Notice left in `github-goldfish\docs\handoff-claude-20261009-mesh-moth.md`.
- **Friendly Farmer** (this hub's host pet): see point 3 above.
- **raspberry-berry**: now on GitHub too, as `findastra/raspberry-berry` (private, topic `pet-app`, MIT, status **hatching**). Its pet is named Raspberry Pi and its logo is `logo.svg` (drawn, not generated). Register it the same way as Mesh Moth (card 008).

## Pet art: generated 2026-10-09 (draft)

Astra asked for the art, and both sheets were generated (one image each). They live in each pet's own repo, not here, because `scripts/generate-pets.mjs` has someone else's uncommitted edits:

- `mesh-moth/art/sheets/mesh-moth-20261009.png`, prompt: a fuzzy round moth with four broad rounded wings, two feathery antennae (one tipped with a glowing bead like a radio antenna), fluffy collar; neon lilac-pink wings with a glowing electric-lime net pattern, deep cobalt-blue fuzzy body, cream collar.
- `raspberry-berry/art/sheets/raspberry-berry-20261009.png`, prompt: a round raspberry of plump drupelets with a lime-green leafy cap and short stem, tiny arms and feet; deep crimson-raspberry with neon pink highlight dots, brown stem.

The shared `STYLE` string was used unchanged, and each `sprite.json` was made with this hub's `sheetToSprite`. When registering them: copy each sheet into `art/sheets/`, add both lines above to `PETS` in `generate-pets.mjs`, then `npm run build`. Do not regenerate them plainly; use `--match` if a mood needs redoing.
