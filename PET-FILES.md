# Pet files: the rules for every pet app

*Part of the Cage ([README](README.md)). The GitHub Goldfish checks these rules across the whole account.*

Every pet app is its own repo under `findastra`, named in lowercase words joined by hyphens. Every pet repo has:

| File or setting | Rule |
|---|---|
| **`pet.json`** | See below. |
| **GitHub topic** | `pet-app`. Added in the repo's About box (the gear). The Cage finds pets by this topic. |
| **`README.md`** | Title is the repo name in Title Case. The first lines include `*A pet app by Astra.*`. Has a "how to run it" section and a "limits" section that says plainly what is not done. |
| **`AGENTS.md` and `CLAUDE.md`** | Rules so any assistant can pick the repo up. |
| **A pixel twin** | Drawn in the shared style (below). |
| **Model and version** | The assistant that built or changed it is recorded (e.g. `Claude Sonnet 5.5 (claude-sonnet-5-5), 2026-10-07`). |
| **A `LICENSE`** | House default: MIT, "Copyright (c) <year> findastra". |

Public credit is always **Astra**. No keys, `.env` files or personal data in a repo, and no work information. Health and finance pets keep their data on the user's PC.

## pet.json

```json
{
  "pet": "GitHub Goldfish",
  "kind": "pet-app",
  "owner": "Astra",
  "sprite": "sprite.json",
  "job": "One sentence on what it does.",
  "runs_on": "Where it runs.",
  "entry": "index.html",
  "status": "hatching",
  "cage": { "topic": "pet-app", "home": "README.md" },
  "built_with": "Claude Sonnet 5.5 (claude-sonnet-5-5), 2026-10-07"
}
```

`status` is **hatching** (idea or first draft), **growing** (works, rough edges) or **grown** (finished and maintained). `sprite` and `entry` must be real files in the repo.

## The pixel twin

- **32 by 32 pixels**, full colour, one soft coloured outline, a light edge top-left and a shadow bottom-right, dot eyes with a highlight, pink cheeks. Everything is symmetric about the centre.
- **Nine moods**, all drawn: `idle`, `blink`, `happy`, `curious`, `worried`, `sad`, `sick`, `alarmed`, `sleep`. Each has a clear change: `sad` adds a tear, `sick` tints green and adds a plaster, `worried` adds a sweat drop, `alarmed` adds a "!", `sleep` adds "z".
- Pets **bounce around the screen**: a small hop as they move, a squash when they hit a wall, a blink every few seconds.
- Drawings live in this repo, in [`scripts/pets-art.mjs`](scripts/pets-art.mjs), so every pet shares one style. The PNGs are in `art/png/<id>/<mood>.png` and the frame data in `art/sprites.json`. A pet repo can copy its own frames.

## Adding a pet to the Cage

1. Add the entry to `pets.json` (`repo`, `pet`, `role: "pet"`, `status`, `job`, `art`, `published`, `added`).
2. Draw it in `scripts/pets-art.mjs` and add it to `PETS`.
3. `npm run build`, then `npm run check`.
4. Create the pet's repo, add the topic `pet-app`, and set `published` to `true` when it is on GitHub.
5. Run the GitHub Goldfish. It flags any pet missing from the registry or missing its files.
