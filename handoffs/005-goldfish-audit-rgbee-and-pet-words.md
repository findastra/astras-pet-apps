status: open
for: goldfish (any assistant working on github-goldfish)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: PET-WORDS.md, findastra/github-goldfish AGENTS.md
---
## Task
The Goldfish now reads `words` from this repo's pets.json and reports old pet-part names as
notes. Run it over the whole `findastra` account (a token for the account includes the private
repos):

```
node scripts/goldfish-cli.mjs findastra --md > audit-20261009.md
```

1. Check **RGBee** (`findastra/rgbee`): pet files, the `pet-app` topic, registry entry.
2. List the **old pet words** still in use. A local dry run on 2026-10-09 found them in
   vrchat-ai-astra and findastra-discord-presence ("pet interface"), in the eight rail-style
   apps' AGENTS.md and READMEs ("pet frame", from the square pet well fix), and in Data Dealer's
   pet.json ("pixel twin", "pet interface"). The Cage, the Goldfish and the File Master are
   already fixed.

Leave dated publication records (`docs/publications-*.md`) as they are: they record what was
said on that day.

## Done when
Findings are in `handoffs/results/005-goldfish-rgbee-and-pet-words.md`, with the model name and
version at the top, and each repo that still uses old words has its own card (or a PR that
fixes it).

## Return
Commit on a branch and set `status: done`.
