# Pet files: the rules for every pet app

*Part of the Cage ([README](README.md)). The GitHub Goldfish checks these rules across the whole account.*

Every pet app is its own repo under `findastra`, named in lowercase words joined by hyphens. Every pet repo has:

| File or setting | Rule |
|---|---|
| **`pet.json`** | See below. Includes an `audit` block. |
| **GitHub topic** | `pet-app`. Added in the repo's About box (the gear). The Cage finds pets by this topic. |
| **`README.md`** | Title is the repo name in Title Case. The first lines include `*A pet app by Astra.*`. Has a "how to run it" section and a "limits" section that says plainly what is not done. |
| **`AGENTS.md` and `CLAUDE.md`** | Rules so any assistant can pick the repo up. |
| **A pet** | Drawn in the shared style (below). What every part of a pet app is called: [PET-WORDS.md](PET-WORDS.md). |
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
  "built_with": "Claude Sonnet 5.5 (claude-sonnet-5-5), 2026-10-07",
  "audit": { "cadence": "weekly", "subject": "the findastra GitHub account", "needs": "a GitHub token that can read the private repos" }
}
```

`status` is **hatching** (idea or first draft), **growing** (works, rough edges) or **grown** (finished and maintained). `sprite` and `entry` must be real files in the repo.

## The pet's art

**Chip is an owner-requested exception:** its original Data Dealer `drawPet` pixels are rendered
by `scripts/chip-original-20261008.mjs` at integer scale inside the original yellow pocket shell.
The registry's `art_source` selects this native renderer; image generation skips it. Its exact
LCD palette, geometry and original expression shapes are preserved. The Cage's nine moods use
the original expression and bob/blink states plus the shared mood stickers.

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
- The generator is told **never** to draw the mood symbols. See "One set of mood stickers" below.

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

### One set of mood stickers

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

## How pets move in the Cage

Every pet's `kind` in `pets.json` picks a row in `cage_life.kinds`, and `cage.html` reads the
rules from there. Nothing about movement is hard-coded per pet.

| Rule | What it does now |
|---|---|
| `zone: "sky"` | Birds, ghosts, the fairy, the sprite (Astra Wisp) and the angel stay in the top third. |
| `zone: "swim"` | The fish stays at mid height. |
| `zone: "ground"` | Everyone else walks the floor. `hops: true` (humans) bounces as they walk. |
| `climbs: true` | The cat runs up a side wall, hangs, and leaps back off. It always climbs when chased. |
| `flock: true` | Birds fly a loose V behind the first bird in the roster. |
| `friends` | API Fairy, Unity Unicorn and Astra Wisp hang out; so do Paper Girl, File Master and Chip. |
| `tag` | Drum Dog and Python Panther chase each other, taking turns being "it". |
| `chases` | Birds chase bugs and the fish; the fish chases bugs. The chased one runs away. |

Names in `friends`, `tag` and `chases` can be an art id or a kind. A new bug only needs
`"kind": "bug"` to be chased by the birds and the fish. A kind that is not listed simply wanders.
Play never changes a pet's mood: moods report the app's state (below), not the game.

## Adding a pet to the Cage

Saving goes upward: the pet's repo first, then the Farmer, then everything generated ([RELATIONS.md](RELATIONS.md) has the picture).

1. **In the new pet's repo:** `pet.json` (with an `audit` block, below), the `pet-app` topic, README, AGENTS.md and CLAUDE.md. AGENTS.md links this repo (`findastra/astras-pet-apps`) and says changes are submitted to the Farmer.
2. **The Farmer's daily round finds it** and adds it to `pipeline` in pets.json, so the Cage, the Farmer's desk and Astra's profile know about it the next morning. To do it straight away, add the `pipeline` entry yourself and leave a card `NNN-farmer-register-<repo>.md`.
3. **Registering it** (moving it from `pipeline` to `pets`) needs its art. Add its prompt to `PETS` in `scripts/generate-pets.mjs`, then ask Astra first: generating costs money. With `asset_date: "20261009"`, its sheet is `art/sheets/<art>-20261009.png` and its frames are `art/frames/<art>/idle-20261009.png`, etc. The entry needs `repo`, `pet`, `role: "pet"`, `kind` (how it moves), `status`, `job`, `art`, `published`, `added` and `audit`.
4. `npm run build`, `npm run check`, `npm test`.
5. The GitHub Goldfish's weekly audit checks the files and the registry from then on.

## Rounds, self-audits and submissions

Every pet checks itself on a schedule and reports in the same nine moods, so Astra can read any pet's face the same way. The Friendly Farmer runs it all from one place: `scripts/farmer-rounds-20261009.mjs`, every morning, from `.github/workflows/farmer-daily-rounds.yml`.

**The daily round:**

1. Finds pet repos on GitHub the Cage does not know (a `pet.json` or the `pet-app` topic) and adds them to `pipeline`.
2. Takes each pet's **submission** (below).
3. Runs the **self-audits** that are due. Each pet runs on its `audit.cadence`: `weekly` pets on their own day of the week (spread across the week, listed in [MOOD-KEY.md](MOOD-KEY.md)); the Farmer every day.
4. Writes `status/pets-status.json`: each pet's mood, a one-line bubble, and what it needs from Astra. The Cage page rests each pet in that mood and shows the bubble when clicked; the Farmer's desk lists everyone who **Needs you**.
5. Rebuilds, and commits as the Friendly Farmer.

**What a self-audit checks:** the pet files above (pet.json, README credit line, "how to run it" and "Limits", AGENTS.md pointing at the Cage, CLAUDE.md, LICENSE and the `pet-app` topic for public repos), plus anything only Astra can answer.

**How the mood is chosen, the same way for every pet:**

| Mood | When | Bubble |
|---|---|---|
| `sleep` | Not checked yet, or the Farmer cannot see the repo | Not checked yet. |
| `curious` | Being checked right now | |
| `happy` | Checked today, nothing to fix | All good. |
| `idle` | Clean, last checked more than a day ago | |
| `worried` | 1 to 5 things to fix | `3 to fix: my README needs "Limits", …` |
| `alarmed` | More than 5, or a broken pet.json | same |
| `sick` | **Only Astra can unblock it:** its job is still a placeholder, or one of its cards says `waiting on Astra: …` or is `for: astra` | `Need: the brand and model of each light` |
| `sad` | The check itself failed | |

So to ask Astra for something, a pet leaves a card with `status: open (waiting on Astra: <what you need>)`. The words after the colon become its bubble.

**What each mood means for each pet** comes from `mood_key` in pets.json, filled in with the pet's `audit.subject` (what it checks) and `audit.needs` (what it asks for when sick). The full key is in [MOOD-KEY.md](MOOD-KEY.md) and on the Farmer's desk.

### The audit block

In pets.json, and copied into the pet's own pet.json:

```json
"audit": { "cadence": "weekly", "subject": "your RGB lights and scenes", "needs": "the brand and model of each light" }
```

`cadence` is `daily`, `weekly` or `monthly`.

### Submitting a change to the Farmer

A pet owns its own name, job, status, bubble lines, mood lines and audit. When it changes any of them, it **submits** the change in its own pet.json, with the date:

```json
"cage": {
  "topic": "pet-app",
  "home": "README.md",
  "submit": {
    "date": "2026-10-10",
    "job": "One sentence on what it does now.",
    "status": "growing",
    "says": ["bzz", "all lights on the same page"],
    "moods": { "happy": "Every light took the scene." },
    "audit": { "cadence": "weekly", "needs": "the brand and model of each light" }
  }
}
```

Include only what changed. The next daily round takes it (once per date), updates pets.json, and the Cage, the desk, MOOD-KEY.md and the profile follow. Art, `kind`, friends and relations belong to the Farmer: ask for those with a card in this repo's `handoffs/`, because new art costs money and needs Astra's OK.

A pet that changes its job in pet.json **without** submitting gets a note in its self-audit, so the two never drift apart unnoticed.

### Who tells whom

`relations` in pets.json lists which pet passes what to which: registry, status, findings, cards, key notes, ideas, what shipped, live cues, art. [RELATIONS.md](RELATIONS.md) draws it. Health Hummy, Finance Finch and Meme Fiend are private: their data never leaves the PC and no other pet reads from them.
