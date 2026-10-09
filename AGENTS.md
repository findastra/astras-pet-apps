# Rules for assistants working on Astra's Pet Apps (astras-pet-apps)

*A pet app by Astra.* Public credit is always **Astra**, never a legal name. Keep work information (including any employer's name) out of this repo.

Built with Claude Sonnet 5.5 (`claude-sonnet-5-5`), 2026-10-07. Record your model name and version here when you change something substantial.
Ghost Protocol and dated asset support added with OpenAI Codex (GPT-6), 2026-10-08.
Cage movement by kind (zones, flocks, friends, tag and chases from `cage_life` in pets.json) added with Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-09.

## What this is
The hub for Astra's pet apps and itself a pet app: its pet is the **Friendly Farmer**, who hosts the Cage. `pets.json` is the single registry. Everything else (README table, ROSTER.md, `cage-data.js`, the art) is generated from it.

## Rules
- **`pets.json` is the source of truth.** Never hand-edit the README table between the `pets:start` / `pets:end` markers, `ROSTER.md`, `cage-data.js` or `art/`. Run `npm run build`.
- **One style for every pet:** 256×256 finished transparent frames (Mommy's Mommies share one
  square sprite), nine moods, **generated** as a 3×3 sheet and converted by `scripts/sheet-to-sprites.mjs`.
  Prompts live in `scripts/generate-pets.mjs`; the shared `STYLE` string is never forked per pet.
  Black one-pixel outline, neon colours, and **no two pets share a palette**. Full rules in
  [PET-FILES.md](PET-FILES.md).
- **Owner-requested exception: Chip uses the original Data Dealer drawing code.** Preserve its
  32×24 LCD pixels and exact palette in `scripts/chip-original-20261008.mjs`; the build adds the
  original yellow pocket shell. Do not replace Chip with generated art. Its native sleep and
  thinking marks remain part of the original drawing, alongside the Cage's shared mood badges.
- **The mood symbols are composited, never generated.** `?`, `!`, `Z`, tear, sweat and bandage
  come from the one sticker set in `art-kit.mjs` so they are identical on every pet. If a
  generated sheet has a symbol drawn into it, redo the sheet.
- **Generating costs money** (one image per pet, billed to Astra's OpenAI account). Regenerate
  one pet, not the set. Sheets in `art/sheets/` are kept so a re-run is free.
- Do not put another creator's artwork, or a recognisable derivative of it, in this repo. It is private; keep provenance and sharing rights explicit. Astra's own characters only.
- **No dependencies.** Node's built-in modules only. The page `cage.html` must work by double-click (that is why data is in `cage-data.js`, not fetched).
- **Never commit** keys, `.env` files or personal data. Health and finance pets keep user data on the user's PC.
- **Say plainly what is not done.** Every drawing is a draft until Astra approves it; do not call it final. Say when a pet is not on GitHub yet (`published: false`).
- Fetched or user text goes into the DOM with `textContent`, never `innerHTML`.
- The Farmer is the only `role: "host"` and his repo is this repo. There is exactly one host.
- Count claims (how many pets) come from `npm run check` / ROSTER.md, never from memory.

## Conventions
- Repo names: lowercase words joined by hyphens. README title is the same words in Title Case.
- New asset filenames are lowercase and dated immediately before the extension. Set `asset_date`
  on a new registry entry; the sheet and all nine mood files use that suffix. Existing filenames stay unchanged.
- Pet file rules: [PET-FILES.md](PET-FILES.md).
- The GitHub Goldfish (`findastra/github-goldfish`) audits this repo and the whole account.

## Commands
- `npm run build`, `npm run check` (add `-- --online` to ask GitHub), `npm test`
- Node 20+. If `node` is missing from PATH on Astra's PC, the Codex bundled runtime works.
