status: open (step 3 waits on Astra's OK for one paid image)
for: farmer (any assistant working on astras-pet-apps)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: PET-FILES.md "Adding a pet to the Cage", PET-WORDS.md, pets.json, scripts/generate-pets.mjs, findastra/rgbee
---
## Task
Welcome a new pet to the Cage: **RGBee** (`rgbee`), a bee whose stripes are red, green and
blue. Its app plans and previews lighting scenes for Astra's room lights, mouse pad, mouse, PC
and keyboard. Its repo exists with a v0 web app (`rgbee-20261009.html`).

1. Copy `rgbee-20261009.html` from `findastra/rgbee` to `apps/rgbee-20261009.html`.
2. Add the `pets.json` entry: `repo: "rgbee"`, `pet: "RGBee"`, `role: "pet"`, `art: "rgbee"`,
   `kind: "bug"` (the birds and the fish already chase bugs), `status: "hatching"`,
   `published: true`, `visibility: "public"`, `added: "2026-10-09"`, `asset_date: "20261009"`,
   `interface_url` and `interface_local_url`: `"apps/rgbee-20261009.html"`,
   job: "Plans and previews lighting scenes for every RGB light in the room: room lights, mouse
   pad, mouse, PC and keyboard. Sending scenes to the real lights is planned."
   Suggested `says` lines: "bzz", "all lights on the same page", "lights out?", "that colour suits you".
3. Add its prompt to `PETS` in `scripts/generate-pets.mjs`. A suggestion to start from:
   `{ id: 'rgbee', what: 'a small round friendly bumblebee whose fuzzy body stripes glow red, green and blue instead of yellow and black, with two small translucent wings and short antennae tipped with tiny glowing bulbs, no props and no lettering', colours: 'glowing neon red, neon green and electric blue stripes on a dark charcoal body, iridescent cyan-violet wings, white-hot antenna bulbs' }`.
   Check no other pet already uses this palette. **Ask Astra before generating** (one image,
   billed to her OpenAI account).
4. `npm run build`, look at `art/roster-sheet.png`, `npm run check`, `npm test`. Then copy the
   nine frames to `findastra/rgbee` (`art/`) and list them in its `sprite-20261009.json`.

## Done when
RGBee shows in the Cage and ROSTER.md with nine draft moods, and checks pass. The art stays a
draft until Astra approves it.

## Return
Work on a branch, open a PR, set this card to `status: done`.
