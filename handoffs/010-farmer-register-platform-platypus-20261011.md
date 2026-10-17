---
status: open (waiting on Astra: which art to register: the existing seed sheet art/seeds/platform-platypus-sheet-20261012.png, or one new paid sheet)
for: farmer
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-11
needs: PET-FILES.md, pets.json, platform-platypus pet.json
---

## What I did

- Made `%USERPROFILE%/Documents/Projects/platform-platypus` (now `%USERPROFILE%/Documents/Astra's PetOS/platform-platypus`; the PC folder is still named `Astra's Pet Apps` until it is renamed): `index.html` (the whole app, one file,
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

2026-10-17, Claude Opus 5.5 (claude-opus-5-5):
- Since 2026-10-11: the repo was created on 2026-10-13 with Astra's OK and `49b12ec` is on its `main`;
  the pet is in `pipeline` in pets.json and is pet program #36, home Mirror Pool, in pet-programs.json; a
  seed sheet was generated on 2026-10-12 (`art/seeds/platform-platypus-sheet-20261012.png`).
- Added the `pet-app` topic to findastra/platform-platypus (Astra's OK, 2026-10-17).
- Fixed the stale README "Limits" lines in platform-platypus on branch `claude/readme-limits-20261017`.
  Its AGENTS.md still points at the Cage; that waits until Codex's branches `codex/yellow-phone-20261015`
  and `codex/l3-activity-20261016` are merged, because they edit the same file.
- Updated this card and its row in handoffs/README.md on branch `claude/platypus-and-folder-rule-20261017`.

## Task

Done: the repo is on GitHub with the `pet-app` topic and is in `pipeline`. To register it: add its prompt to `PETS` in `scripts/generate-pets.mjs` (a platypus;
pick a neon palette no other pet uses), get Astra's OK for the one paid sheet, then generate with
`asset_date: "20261011"`, `npm run build`, `npm run check`, `npm test`. A ground walker; it could
swim with the fish.

## Done when

Platform Platypus is in `pets`, its nine frames are approved, and the Cage build, check and tests pass.
