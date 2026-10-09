# Pet words: one name for each part of a pet app

*Part of the Cage ([README](README.md)). The Friendly Farmer keeps this list. The GitHub Goldfish flags the old names across the account, and the File Master uses the file names at the bottom when it organizes pet projects.*

Every pet app is a set of parts. Each part has **one** name, used everywhere: READMEs, `pet.json`, card titles, code comments, and when talking to Astra. The machine-readable copy is `words` in [pets.json](pets.json); a test keeps the two in step.

## The parts you see

| Part | Call it | Not | What it is |
|---|---|---|---|
| The whole set | **pet app** | | One repo, one pet, and its app. "RGBee is a pet app." |
| The character | **pet** | pixel twin | The creature itself, by name: "the Goldfish", "Chip". It lives in the Cage and in its app's pet well. |
| The full window | **app** | pet app's app, application interface, pet interface, local interface, browser companion | What opens when you double-click the pet. Either a **web app** (an HTML page) or a **Windows app** (a program). The Farmer's app is called his **desk**. |
| The pet on your desktop | **desktop pet** | pet app icon, desktop companion | The small pet that sits on the Windows desktop above other windows. Optional: the Farmer and Claude Bot have one. |
| The pet talking | **bubble** | speech bubble, chat bubble | A short line that pops up over the pet for a few seconds. One way: the pet talks to you. The lines live in `says` in pets.json. |
| You talking to the pet | **quick chat** | pet app icon chat | A small box that opens from the desktop pet so you can type to it. Two way. |
| The program's picture | **app icon** | | The small still picture on the taskbar, a shortcut or a browser tab. It is drawn from the pet but it is not the pet, and it does not move. |
| The pet's square in its app | **pet well** | pet frame | Where the pet sits inside its app. |

So: the pet floating on the desktop is the **desktop pet** (an *icon* is the still taskbar picture), its pop-up lines are **bubbles**, the box you type into is **quick chat**, and the window it opens is just its **app**.

## The pet's art

| Part | Call it | What it is |
|---|---|---|
| The faces | **moods** | Nine: `idle`, `blink`, `happy`, `curious`, `worried`, `sad`, `sick`, `alarmed`, `sleep`. Meanings are in [PET-FILES.md](PET-FILES.md). |
| One picture | **mood frame** | One 256×256 transparent image of the pet in one mood. |
| The generated image | **mood sheet** | One 3×3 image holding all nine moods, sliced into mood frames. |
| The marks | **mood stickers** | `?`, `!`, `Z`, the tear, the sweat drop and the bandage, composited from one set. |
| Frames plus their list | **sprite** | The pet's nine mood frames and the JSON file that lists them. |

## Who lives in the Cage

| Call it | Meaning |
|---|---|
| **host** | The Friendly Farmer. Exactly one. |
| **companion** | A second character drawn with a pet app (registry `companions`). Only this meaning: what used to be called a desktop companion is a desktop pet, and a browser companion is a web app. |
| **mascot** | A character with no app of its own (registry `mascots`). |
| **guest** | A visitor from outside the Cage, such as BSOD. |

## The Cage

| Call it | Meaning |
|---|---|
| **the Cage** | `cage.html`, the page where the pets live, and this repo. |
| **the Farmer's desk** | The Farmer's app: every app plus a follow-up list. |
| **registry** | `pets.json`. |
| **roster** | `ROSTER.md`. |
| **job** | The one sentence that says what a pet app does. |
| **status** | `hatching`, `growing` or `grown`. |
| **card** | A task in a `handoffs/` folder, for whichever assistant picks it up. |

## File names (for the File Master)

New files use these names. `<date>` is Astra's America/Denver date as `YYYYMMDD`. **Existing files keep their names**: links, scripts and tags depend on them, so never rename a tracked file only to match this list.

| Part | File |
|---|---|
| pet metadata | `pet.json` |
| web app | `<repo>-<date>.html` (in the Cage: `apps/<repo>-<date>.html`) |
| sprite | `sprite-<date>.json`, art in `art/`. Repos where the pet joined an older project may use `pet-sprite-<date>.json` and `pet-art/`. Keep one pattern per repo. |
| desktop pet | `desktop-pet-<date>.<ext>`, started by `start-desktop-pet-<date>.cmd` |
| app icon | `icon-<date>.png`, plus `icon-<date>.ico` for Windows |
| mood sheet (Cage) | `art/sheets/<art>-<date>.png` |
| mood frame (Cage) | `art/frames/<art>/<mood>-<date>.png` |
| card | `handoffs/NNN-<for>-<short-name>.md` |

## Keys that keep their old names

Some keys are older than these words and stay as they are, because code reads them: `interface_url`, `interface_local_url` and `interface_live_url` in pets.json (the app's addresses), and `entry` and `sprite` in pet.json. Use the words above in prose and leave the keys alone.

Set on 2026-10-09 at Astra's request, with Claude Opus 5.5 (`claude-opus-5-5`).
