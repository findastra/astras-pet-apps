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

**Chip is an owner-requested exception:** its original Data Dealer `drawPet` pixels are rendered
by `scripts/chip-original-20261008.mjs` at integer scale inside the original yellow pocket shell.
The registry's `art_source` selects this native renderer; image generation skips it. Its exact
LCD palette, geometry and original expression shapes are preserved. The Cage's nine moods use
the original expression and bob/blink states plus shared indicators.

Pets are **generated** pixel art, not hand-coded any more. One image per pet holds the same
character nine times in a 3×3 grid; a script slices it into the nine moods. The character stays
identical across its moods because it was drawn in a single generation — nine separate
generations give nine slightly different creatures, which is why it is done this way.

- **256 by 256 pixels** for finished transparent mood frames. Mommy's Mommies are two characters
  who are never drawn apart, so they share one square sprite.
- A solid **black outline one pixel thick** around the whole silhouette.
- **Neon, deliberately unnatural colours, and no two pets share a palette.** At sprite size the
  palette tells them apart faster than the silhouette does.
- Dot eyes with a single white highlight, small pink blush cheeks.
- The generator is told **never** to draw the mood symbols. See "One set of indicators" below.

### Making or redoing a pet's art

1. Add or edit the pet's line in [`scripts/generate-pets.mjs`](scripts/generate-pets.mjs):
   what the creature is, and its neon colours. The shared `STYLE` string holds everything the
   pets have in common; never fork it per pet.
2. `node scripts/generate-pets.mjs <id>` generates the sheet and converts it. Sheets already on
   disk are skipped, so re-running is cheap and safe; `--force` redoes one.
3. `npm run build` converts the sheets and draws `art/roster.png`. **Look at it** before
   calling anything done.

Each pet costs one image from the image bridge, billed to Astra's OpenAI account, so do not
regenerate the whole set to change one pet.

**Never plainly regenerate a pet whose art Astra has approved.** One generation produces all
nine moods together, so there is no way to redo a single frame: the whole character is re-rolled
and the body comes back different. It has already happened once — asking for spectacles returned
a visibly slimmer penguin. Use `--match` instead:

```
node scripts/generate-pets.mjs <id> --match
```

That keeps a copy of the pet's first approved sheet in `art/sheets/.approved/` and feeds it back
as the reference image, so the model redraws the expressions around the body that exists. Small
additions like glasses should not be generated at all; draw them in
[`scripts/accessories.mjs`](scripts/accessories.mjs), which cannot disturb the body.

A pet can be generated **from another pet's sheet** by giving it `ref`, so the two share a
character design: Astra is one of the Mommy's dancers in a different colourway, generated from
their sheet. The runner always generates a referenced pet first.

### One set of indicators

`?`, `!`, `Z`, the tear, the sweat drop and the bandage are **composited from the shared
sticker set** in [`scripts/art-kit.mjs`](scripts/art-kit.mjs), never drawn by the generator.
They are pixel-identical on every pet, so the mood can be read at a glance without learning
each character. A generated sheet that contains a drawn symbol is wrong and should be redone.

### The old hand-drawn system

[`scripts/pets-art.mjs`](scripts/pets-art.mjs) drew the first 32×32 pets by hand with a small
pixel toolkit. It is kept for the drawing primitives and the sticker set that
`art-kit.mjs` exports, and as the record of the original style:

- 32 by 32, one soft coloured outline, a light edge top-left and a shadow bottom-right,
  dot eyes with a highlight, pink cheeks, symmetric about the centre.
- **Nine moods**, all drawn: `idle`, `blink`, `happy`, `curious`, `worried`, `sad`, `sick`, `alarmed`, `sleep`. Each has a clear change: `sad` adds a tear, `sick` tints green and adds a plaster, `worried` adds a sweat drop, `alarmed` adds a "!", `sleep` adds "z".
- Pets **bounce around the screen**: a small hop as they move, a squash when they hit a wall, a blink every few seconds.

### What each mood means

Every pet uses the same nine meanings, so Astra can read any pet's face without learning it twice. A pet must be able to reach all nine; a mood that is drawn but never shown is a bug.

| Mood | The pet is saying |
|---|---|
| `sleep` | I have not run yet, or I have no data. |
| `idle` | I am resting. Nothing to report. |
| `blink` | (idle only, every few seconds) |
| `curious` | I am working on it. |
| `happy` | I finished and found nothing wrong. |
| `worried` | I finished and found problems. |
| `alarmed` | I finished and found a lot of problems. |
| `sick` | **I am stuck and I need you.** |
| `sad` | I could not finish, and that is my fault. |

`sick` is the only mood that asks Astra for something. Use it whenever the pet cannot go on without her: a site needs her to sign in, a token or key is missing or expired, a permission was refused, a file or folder it was pointed at is not there, an app it manages is not installed. It is **not** for problems the pet found in its subject matter (that is `worried` / `alarmed`) and **not** for the pet's own crash (that is `sad`). When a pet goes `sick` it must say in words what it needs and how to give it.
- Current frame paths are recorded in `art/frames/index.json`. Consumers use that index so they support both existing mood filenames and dated filenames. A pet repo can copy its own frames.

## Adding a pet to the Cage

1. Add the entry to `pets.json` (`repo`, `pet`, `role: "pet"`, `status`, `job`, `art`, `published`, `added`). Set `asset_date` to the owner's America/Denver date, such as `20261008`, for new assets.
2. Add its prompt to `PETS` in `scripts/generate-pets.mjs` and supply the 3×3 mood sheet. With `asset_date: "20261008"`, a ghost's sheet is `art/sheets/ghost-protocol-20261008.png` and its frames are `art/frames/ghost-protocol/idle-20261008.png`, etc. Existing assets are not renamed.
3. `npm run build`, then `npm run check`.
4. Create the pet's repo, add the topic `pet-app`, and set `published` to `true` when it is on GitHub.
5. Run the GitHub Goldfish. It flags any pet missing from the registry or missing its files.
