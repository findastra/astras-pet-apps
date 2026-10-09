status: open (step 2 waits on Astra's OK for the art)
for: farmer (any assistant working on astras-pet-apps)
from: Claude Haiku 5.5 (claude-haiku-5-5), 2026-10-09
needs: PET-FILES.md "Adding a pet to the Cage", PET-WORDS.md, pets.json, findastra/mail-snail
---
## Task
Welcome a new pet to the Cage: **Mail Snail** (`mail-snail`). It is a placeholder repo only,
<https://github.com/findastra/mail-snail>, public, with a one-page `index.html` and no art yet.
Astra has not approved the concept or the art.

1. Wait for Astra's OK before adding it. Ask her which kind it should be (a ground kind fits a snail).
2. Once approved, add the `pets.json` entry with `repo: "mail-snail"`, `pet: "Mail Snail"`,
   `role: "pet"`, `status: "hatching"`, `visibility: "public"`, `published: true`, `added: "2026-10-09"`.
   Use `interface_live_url` only when a live page exists; until then, leave the app link out.
3. `npm run build`, look at the roster sheet, `npm run check`, `npm test`.

## Done when
Mail Snail shows in the Cage and ROSTER.md after Astra approves it, or this card stays open.

## Return
Work on a branch, open a PR, set this card to `status: done`.
