status: open
for: farmer (any assistant working on astras-pet-apps)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09, from Astra's ChatGPT naming session export
needs: PET-FILES.md "Adding a pet to Astra's Pet Apps" and "How pets move on the page", pets.json, scripts/generate-pets.mjs, handoffs/005-parrot-new-pet-lineup.md
---
## Task
Astra approved twelve new pet apps. Start them as planned pets, one card or branch at a time.
Names and mascots are fixed; do not rename them.

| Pet | Mascot | Job | Suggested `kind` |
|---|---|---|---|
| Mail Snail | snail | Audits her email. | snail (new, ground, slow) |
| Stock Fox | fox | Stock trading. | fox (new, ground) |
| Mine Mole | mole | Crypto mining. | mole (new, ground) |
| Deck Duck | duck | Controls her Elgato Stream Deck. | bird (flies with the flock) |
| Gif Giraffe | giraffe | Makes GIFs. | giraffe (new, ground) |
| Meme Fiend | **purple** fox | Makes memes. | fox |
| Rift Rabbit | white rabbit | Starts her VR programs together and checks their settings. Tagline: "Follow the white rabbit!" | rabbit (new, ground, hops) |
| Backup Beaver | beaver | Whole-PC backups: finds backup locations and dates, says when a new one is due, runs one weekly. | beaver (new, ground) |
| Patch Cat | cat | Updates and patching. Scope still to be defined with Astra. | cat (climbs) |
| Wifi Butterfly | butterfly | Wi-Fi and network diagnostics. | butterfly (new, sky) |
| Mesh Moth | moth | Her Meshtastic node. | moth (new, sky) |
| Raspberry Pie | not chosen yet | Manages all her Raspberry Pi projects. | ask Astra |

Not in the lineup yet: a video editor that also sets up OBS (no name chosen). Render Raven,
Sleep Sheep, Beetle Bot and a "VR familiar" were mentioned, but the messages that described
them were not in the export.

1. For each pet: a `pets.json` entry with `status: "hatching"`, `published: false`,
   `added: "2026-10-09"`, `asset_date` set, its `kind`, and a one-sentence job. Add any new
   kind to `pet_life.kinds`. Decide with Astra whether the flying bugs (Wifi Butterfly,
   Mesh Moth) are chased by the birds like Voicemeeter Bug.
2. Add each prompt to `PETS` in `scripts/generate-pets.mjs`. No two pets share a palette:
   Meme Fiend is purple, so Stock Fox needs a clearly different fox.
3. **Ask Astra before generating** (one image per pet, billed to her OpenAI account).
4. `npm run build`, look at `art/roster.png`, `npm run check`, `npm test`.

## Done when
Every approved pet is in pets.json and ROSTER.md as a hatching draft, checks pass, and
each still-open question above is either answered by Astra or listed in a new card.

## Return
Work on a branch, open a PR, set this card to `status: done`.

## Note on Unity Unicorn
Astra asked where the name "Unity Unicorn" came from. The ChatGPT list in the export
suggested **Unity Bunny**, not Unity Unicorn. Unity Unicorn is Astra's own pet, in this
repo's pets.json since 2026-10-07. Nothing in the export shows it leaking.
