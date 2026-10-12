# AGENTS.md: Pole Puff

A pet app by Astra. Status: hatching (draft, repo not created yet). Pole Puff is the pet of `findastra/astras-infinite-pole`.

Rules: see [PET-FILES.md](https://github.com/findastra/astras-pet-apps/blob/main/PET-FILES.md) in
[Astra's Pet Apps](https://github.com/findastra/astras-pet-apps) (`findastra/astras-pet-apps`).
Changes to the pet's name, job, status, bubble lines, mood lines or audit are **submitted to the
Friendly Farmer** through `cage.submit` in `pet.json` (PET-FILES.md, "Submitting a change to the Farmer").
Art, `kind` and friends belong to the Farmer: ask with a card in `astras-pet-apps/handoffs/`.

- Keep `pet.json` pointing at real files (`sprite.json`, `index.html`).
- New asset filenames are lowercase and dated before the extension.
- Fetched or user text goes into the DOM with `textContent`, never `innerHTML`.
- No keys, `.env` files or personal or work data in this repo. Public credit is always Astra.
- No dependencies: Node's built-in modules only.

Built with Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-11.
