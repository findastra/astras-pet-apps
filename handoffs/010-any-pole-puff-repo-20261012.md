status: open (waiting on Astra: OK to create the pole-puff repo)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-12
needs: AGENTS.md "Before any work" list, docs/architecture/ASTRA_PET_OS.md, docs/migration/PLAN.md (Seeded pets), PET-FILES.md, pets.json `seeds`, drafts/pole-puff/
---
## Why this card exists
Astra asked a Claude chat (2026-10-11) to "generate the pet app Pole Puff" and check the Friendly
Farmer's repo for instructions. That Claude account is being closed (2026-10-12), so everything from
that chat is written here and in `drafts/pole-puff/`. Nothing is left only in the chat.

## What I did
Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-11 to 2026-10-12:
- Read in full: this repo's `AGENTS.md`, `CLAUDE.md`, `skills/handoff/SKILL.md` on `main`, plus the
  differences on every other branch (all older copies; nothing newer than `main`),
  `docs/architecture/ASTRA_PET_OS.md`, `docs/migration/PLAN.md`, `PET-FILES.md`, `handoffs/README.md`,
  cards 001, 002 and 007; and `findastra/deck-duck`'s AGENTS.md, CLAUDE.md, README, pet.json and
  sprite.json (used as the template for a placeholder pet).
- Asked Astra four questions on 2026-10-11. Her answers:
  1. **Home:** its own new public repo, `findastra/pole-puff`.
  2. **Job:** "placeholder, decide later". *Superseded on 2026-10-12:* the plan and the `seeds` entry
     now say Pole Puff **manages Astra's Infinite Pole** and works with Unity Unicorn. The draft uses that.
  3. **Art:** do **not** generate yet (paid). A free hand-drawn stand-in was made instead.
  4. **Kind:** a **puffball sprite that floats** (`kind: "sprite"`, sky zone).
- Wrote the whole pet app and put it in this repo at **`drafts/pole-puff/`**, branch
  `claude/pole-puff-draft-20261012` (not `main`). The files: `pet.json` (with an audit block),
  `sprite.json`, `index.html` (the pet floating, nine mood buttons, bubble lines set with
  `textContent`), `README.md` (how to run it, Limits), `AGENTS.md`, `CLAUDE.md`, `LICENSE` (MIT,
  findastra), `.gitignore`, `scripts/draw-pole-puff-20261011.mjs` (stand-in art, Node built-ins
  only), `art/frames/<mood>-20261011.png` (nine moods, 256×256) and `art/sheets/pole-puff-20261011.png`.
  I looked at the sheet: one periwinkle puff with a coral-and-white striped pole tuft and a lime knob,
  nine readable faces.
- In `pets.json`: added `draft`, `kind` and `kind_note` to Pole Puff's **seed** entry. I did **not**
  add a pipeline entry, because there is no repo yet. Added this card and its row in `handoffs/README.md`,
  and a line to AGENTS.md. Ran `npm run build` and `npm test` (results are in the commit message).
- **Not done:** the `findastra/pole-puff` repo was **not created** (the rules say ask Astra first, and
  this session could not create repos). No art was generated or billed. Nothing on Astra's PC was touched.
- Earlier, a draft of this work (a pipeline entry and a card numbered 009) existed only in the chat
  workspace. Codex has since used 009 for Spoonfed Sugarcube, so this card is 010 and that draft was dropped.
- Other things that chat created or relied on: a one-time scheduled task "Resume Pole Puff build"
  (2026-10-11, already fired; nothing to recreate). No artifacts and no connectors. GitHub access went
  through the session's own GitHub link.

## Open decisions for Astra
1. OK to create `findastra/pole-puff` (public, topic `pet-app`)?
2. OK to generate Pole Puff's art (one image, billed to her OpenAI account)?
3. Is the stand-in look right (periwinkle puff, striped pole tuft, lime knob)?

## Task (in order, after Astra's OK for each step)
1. Create `findastra/pole-puff`, public, topic `pet-app`. Copy `drafts/pole-puff/` in as its first
   commit. Then delete `drafts/pole-puff/` here in the same PR that moves the seed to the pipeline.
2. Move Pole Puff from `seeds` to `pipeline` in `pets.json` (`repo: "pole-puff"`, job from the seed,
   `added`, `audit` from its pet.json). Add the Unity Unicorn link to `relations`, as the seed's
   `works_with` says.
3. With art approved, add to `PETS` in `scripts/generate-pets.mjs` in the same commit as the `pets` entry:
   ```js
   { id: 'pole-puff', what: 'a round fluffy floating puffball creature with a scalloped fluffy edge, two tiny nub arms and no legs, with a short candy-striped pole sticking up from the top of its head like a tuft, topped by a small round knob, no props and no lettering', colours: 'neon periwinkle-blue fluff, hot coral and white candy stripes on the pole tuft, acid-lime knob and nub arms' },
   ```
   Generate, `npm run build`, look at `art/roster-sheet.png`, `npm run check`, `npm test`.
4. Build the real job: what "manages Astra's Infinite Pole" means. Ask Astra (for example, tracking
   world uploads, builds or to-dos), then plan it as a PetOS pet (PLAN.md phases). No new Cage features.

## Done when
`findastra/pole-puff` exists with these files, Pole Puff is in the pipeline, and `drafts/pole-puff/` is gone.

## Return
Work on a branch, open a PR, set this card to `status: done`, and update `## What I did`.
