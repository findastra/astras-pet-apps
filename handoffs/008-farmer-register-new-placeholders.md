status: open (waits on Astra's OK for the art and the kind)
for: farmer (any assistant working on astras-pet-apps)
from: Claude Haiku 5.5 (claude-haiku-5-5), 2026-10-09
needs: PET-FILES.md "Adding a pet to the Cage", PET-WORDS.md, pets.json, findastra/backup-beaver
---
## Task
Welcome a new placeholder pet to the Cage: **Backup Beaver** (`backup-beaver`). Its repo is
<https://github.com/findastra/backup-beaver>, private, with a placeholder README and `index.html`,
no art yet and no job decided. PR #4 in this repo already adds it to the `candidates` list.

1. Wait for Astra's OK before moving it into `pets`. Ask her which kind it should be.
2. Once approved, add the `pets.json` entry with `repo: "backup-beaver"`, `pet: "Backup Beaver"`,
   `role: "pet"`, `status: "hatching"`, `visibility: "private"`, `published: false`, `added: "2026-10-09"`.
   Leave the app link out until a live page exists.
3. `npm run build`, look at the roster sheet, `npm run check`, `npm test`.

## Affected
- GitHub Goldfish reads the words list in `pets.json`; check it still flags nothing new.
- Friendly Farmer hosts the desk and registers this card.

## Done when
Backup Beaver shows in the Cage and ROSTER.md after Astra approves it, or this card stays open.

## Return
Work on a branch, open a PR, set this card to `status: done`.
