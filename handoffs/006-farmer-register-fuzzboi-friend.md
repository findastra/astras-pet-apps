status: open (step 3 waits on Astra's OK for the art; the repo waits on Astra creating or OK'ing it)
for: farmer (any assistant working on astras-pet-apps)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: PET-FILES.md "Adding a pet to the Cage", PET-WORDS.md, pets.json, scripts/generate-pets.mjs, findastra/fuzzboi-friend, findastra/fuzzbois
---
## Task
Welcome a new pet to the Cage: **Fuzzboi Friend** (`fuzzboi-friend`). Its app lets a friend type
a six-digit hex code and get that exact Fuzzboi, drawn from Astra's own layers in
`findastra/fuzzbois`. The app is `fuzzboi-friend-20261009.html`, meant to be live at
<https://findastra.github.io/fuzzboi-friend/>. Fuzzbois' own site, the Fuzzboi Forge, is live at
<https://findastra.github.io/fuzzbois/>.

1. Copy `fuzzboi-friend-20261009.html` from `findastra/fuzzboi-friend` to
   `apps/fuzzboi-friend-20261009.html`. (It loads its rules and layers from the Fuzzbois website,
   so it needs the internet, also inside the Cage.)
2. Add the `pets.json` entry: `repo: "fuzzboi-friend"`, `pet: "Fuzzboi Friend"`, `role: "pet"`,
   `art: "fuzzboi-friend"`, `status: "hatching"`, `visibility: "public"`, `added: "2026-10-09"`,
   `asset_date: "20261009"`, `interface_url` and `interface_local_url`:
   `"apps/fuzzboi-friend-20261009.html"`, `interface_live_url`: `"https://findastra.github.io/fuzzboi-friend/"`,
   job: "Makes your own Fuzzboi: type a six-digit hex code and get that exact Fuzzboi, drawn from
   Astra's layers, as a PNG." Set `published: true` only once the repo is on GitHub.
   `kind`: a Fuzzboi is a fuzzy ground creature; pick a ground kind (an unlisted kind just wanders).
   Suggested `says` lines: "what's your code?", "fluffing you up…", "ooh, a rare one!", "save it before you lose it".
   **Also fix the stale entry** near the end of pets.json: Fuzzbois (`fuzzbois`) still says "Local
   art project, not published", but it is a public repo with a live website. Update the `why`.
3. **Art: ask Astra first.** Fuzzbois are her hand-drawn characters, so the options are (a) build
   the nine moods from her layers in `fuzzbois/site/layers/` plus the shared mood stickers, as an
   owner-approved exception like Chip, or (b) one paid generated sheet. Until she picks, the app's
   pet well shows a Fuzzboi made from her layers (code 725001: pink cloud, flower) as a stand-in.
   Whichever she picks, the palette must not match another pet's.
4. `npm run build`, look at the roster sheet, `npm run check`, `npm test`. Then copy the nine
   frames to `findastra/fuzzboi-friend` (`art/`) and list them in its `sprite-20261009.json`.

## Done when
Fuzzboi Friend shows in the Cage and ROSTER.md, the Fuzzbois entry is current, and checks pass.
The art stays a draft until Astra approves it.

## Return
Work on a branch, open a PR, set this card to `status: done`.
