# Handoff: Gif Giraffe joins the pets, 2026-10-09

## New pet: Gif Giraffe (2026-10-09)

Astra asked for a new pet app, **Gif Giraffe**, repo `findastra/astras-gif-maker` (private, topic `pet-app`, status `hatching`). It is a placeholder: a README, `pet.json`, a stub `sprite.json` and a placeholder `index.html`. It does not make GIFs yet and has no pixel twin.

Written by Claude Haiku 5.5 (claude-haiku-5-5), 2026-10-09. Added as a new dated file; nothing else in this folder was changed.

## What the hub needs to do (not done here)

- **pets.json**: add a Gif Giraffe entry (`repo`: `astras-gif-maker`, `role`: `pet`, `status`: `hatching`, `published`: false). The hub's `check-pets` script will then see the repo.
- **ROSTER.md**: list it as pet 20 (hatching, no art yet). It has no drawing, so leave its art cell empty.
- **Friendly Farmer**: the Farmer's desk opens each pet app and keeps the roster. It should list Gif Giraffe as a hatching pet with no interface yet, and not try to open a page for it.

Affected: Friendly Farmer (`astras-pet-apps`), GitHub Goldfish (it checks every `pet-app` repo's `pet.json`). The folder has uncommitted work, so these edits belong to whoever is working here.

## Art added (2026-10-09, later)

Gif Giraffe now has a pixel twin: `sprite.json`, nine mood frames in `art/frames/gif-giraffe/` and `icon.png` (the idle frame), all in `astras-gif-maker` at commit `a494a98`. The hub should register it with `art` set to `gif-giraffe` once the mood frames are copied into the hub, and its status is `growing` in `pet.json`, not `hatching`. Goldfish can now check for a real `sprite.json` and a real `icon.png`.

