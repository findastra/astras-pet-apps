# Rules for assistants working on the Cage (findastra-pet-apps)

*A pet app by Astra.* Public credit is always **Astra**, never a legal name. Keep work information (including any employer's name) out of this repo.

Built with Claude Sonnet 5.5 (`claude-sonnet-5-5`), 2026-10-07. Record your model name and version here when you change something substantial.

## What this is
The hub for Astra's pet apps and itself a pet app: its pet is the **Friendly Farmer**, who hosts the Cage. `pets.json` is the single registry. Everything else (README table, ROSTER.md, `cage-data.js`, the art) is generated from it.

## Rules
- **`pets.json` is the source of truth.** Never hand-edit the README table between the `pets:start` / `pets:end` markers, `ROSTER.md`, `cage-data.js` or `art/`. Run `npm run build`.
- **One style for every pet:** 32×32, nine moods, drawn in `scripts/pets-art.mjs`. Do not paste in art from elsewhere. Nullbot is an original drawing, not OpenAI's Null Signal.
- **No dependencies.** Node's built-in modules only. The page `cage.html` must work by double-click (that is why data is in `cage-data.js`, not fetched).
- **Never commit** keys, `.env` files or personal data. Health and finance pets keep user data on the user's PC.
- **Say plainly what is not done.** Every drawing is a draft until Astra approves it; do not call it final. Say when a pet is not on GitHub yet (`published: false`).
- Fetched or user text goes into the DOM with `textContent`, never `innerHTML`.
- The Farmer is the only `role: "host"` and his repo is this repo. There is exactly one host.
- Count claims (how many pets) come from `npm run check` / ROSTER.md, never from memory.

## Conventions
- Repo names: lowercase words joined by hyphens. README title is the same words in Title Case.
- Pet file rules: [PET-FILES.md](PET-FILES.md).
- The GitHub Goldfish (`findastra/github-goldfish`) audits this repo and the whole account.

## Commands
- `npm run build`, `npm run check` (add `-- --online` to ask GitHub), `npm test`
- Node 20+. If `node` is missing from PATH on Astra's PC, the Codex bundled runtime works.
