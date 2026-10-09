status: open
for: parrot (any assistant working on findastra/project-parrot)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09, from Astra's ChatGPT naming session export
needs: findastra/project-parrot AGENTS.md, handoffs/004-farmer-new-pet-lineup.md
---
## Task
Project Parrot keeps Astra's project ideas and reminds her to start them. Give it the twelve
approved pet apps from card 004 so it can remind her: Mail Snail, Stock Fox, Mine Mole,
Deck Duck, Gif Giraffe, Meme Fiend, Rift Rabbit ("Follow the white rabbit!"), Backup Beaver,
Patch Cat, Wifi Butterfly, Mesh Moth and Raspberry Pie, plus the unnamed video editor that
sets up OBS.

Parrot's ideas live in each browser's local storage and it has no import yet. Either add a
JSON import to `project-parrot-20261008.html` (validate every field, render with
textContent) and ship the twelve as a starter file, or ask Astra to enter them. Do not commit
her exported records.

## Done when
The twelve ideas show in Parrot's list on Astra's PC, each linked to its card-004 row.

## Return
Work on a branch in findastra/project-parrot, open a PR, set this card to `status: done`.
