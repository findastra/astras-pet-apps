---
status: open (waiting on Astra: create findastra/platform-platypus on GitHub and OK the push; OK one paid art sheet)
for: farmer
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-11
needs: PET-FILES.md, pets.json, platform-platypus pet.json
---

## What I did

- Made `C:/Users/audra/Documents/Projects/platform-platypus`: `index.html` (the whole app, one file,
  no dependencies), `pet.json` (with an `audit` block), `sprite.json`, `README.md` (credit line,
  "How to run it", "Limits"), `AGENTS.md`, `CLAUDE.md`, `LICENSE` (MIT, findastra), `.gitignore`.
- Platform Platypus shows a page on iPhone SE, iPhone 16 Pro, Pixel 9, Galaxy S24, iPad mini and
  desktop at once, measures each screen (sideways scrolling, tap targets, tiny text, iPhone input
  zoom, content under the notch or home bar), reads the code for cross-platform mistakes, and
  compares two screenshots pixel by pixel. Its LCD pixel twin (32×24, Chip's palette) is drawn in
  code and reaches all nine moods.
- Local git repo, branch `claude/first-version`, commit `49b12ec`. Not pushed: the GitHub repo
  does not exist yet. No topic set, no paid image calls, nothing changed in `pets.json`.
- Tested in the built-in browser: the sample page, home-screen mode, the "show" button, screenshot
  compare and a 375px phone width. No console errors. Secret and personal-data scan clean.
- Project Parrot keeps its backlog in browser storage, so no row was added there.

## Task

Once the repo is on GitHub with the `pet-app` topic, add it to `pipeline` (the daily round will
also find it). To register it: add its prompt to `PETS` in `scripts/generate-pets.mjs` (a platypus;
pick a neon palette no other pet uses), get Astra's OK for the one paid sheet, then generate with
`asset_date: "20261011"`, `npm run build`, `npm run check`, `npm test`. A ground walker; it could
swim with the fish.

## Done when

Platform Platypus is in `pets`, its nine frames are approved, and the Cage build, check and tests pass.
