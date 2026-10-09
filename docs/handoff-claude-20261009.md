# Handoff from Claude, 2026-10-09

Prepared by **Claude Opus 5.5** (`claude-opus-5-5`) for Astra and for whichever assistant picks this up next. Read alongside [publications-20261008.md](publications-20261008.md). This file was added without touching any uncommitted work already in this folder.

## Naming: Astra's Pet Apps, `astras-pet-apps`

Astra confirmed the program is **Astra's Pet Apps** and the slug is **`astras-pet-apps`**, matching the GitHub repo. `findastra-pet-apps` is retired everywhere.

Fixed outside this folder:

- **github-goldfish**: `HUB` was still `'findastra-pet-apps'`, so the published Goldfish looked for the hub under the old name and skipped its registry checks. Now `'astras-pet-apps'`, and the three messages that hardcoded the old name derive from `HUB`, so they cannot drift again. README, AGENTS.md, the sprite source note and the tests updated; the two browser entries still share one engine; 28/28 tests pass. Not committed or pushed.
- **Goldfish naming rule**: saved privately at `%USERPROFILE%\.goldfish\naming-rules-20261008.json` (outside every repo), scoped to `astras-pet-apps`, `github-goldfish`, `findastra` and `file-master`. Tested: "Findastra Pet Apps" is flagged, "Astra's Pet Apps" is clear. By design these rules match names in prose, not URLs or slugs.
- **findastra** (profile README, branch `update-projects`): both links now point at `astras-pet-apps`. Not pushed.
- **file-master**: fast-forwarded to GitHub (it was 3 commits behind); its agent now checks GitHub for the latest handoff first, requires folder names to match repo names, and refuses to move a folder that is in use. Reinstalled to `%USERPROFILE%\.claude\agents\`.

**Still carrying the old name, inside this folder's uncommitted work** (left for its author):

| File | What | Note |
|---|---|---|
| `apps/github-goldfish-20261008.html` | bundled copy of the Goldfish, `HUB = 'findastra-pet-apps'` | resolved 2026-10-09: `HUB` is `'astras-pet-apps'` and the hub-name messages derive from it, ported from github-goldfish. Not a straight copy: the bundle keeps its hub wording and `hub` pet.json key, which github-goldfish still calls by its retired enclosure name |
| `scripts/desktop-pets-20261008.cs` (renamed 2026-10-09) | state file under `%LOCALAPPDATA%\findastra-pet-apps` | resolved 2026-10-09: the free-roaming desktop pets write status under `%LOCALAPPDATA%\astras-pet-apps`; the old folder held no state to migrate |
| `docs/desktop-pets-20261008.md` (renamed 2026-10-09) | documents that path | resolved 2026-10-09 with the code |

**The folder itself** is `Projects\findastra-pet-apps`. A rename to `Projects\astras-pet-apps` is planned in File Master (`reports/2026-10-09_project-names/plan.csv`), **unapproved on purpose**: `desktop-pets-20261008.exe` is running from `bin\` and 26 files here are uncommitted. Close the exe and commit or hand off first; then Astra approves the row and File Master dry-runs it before applying.

## Decisions that changed, for the record

- The **Friendly Farmer**: in Claude's session Astra asked for a Japanese farmer with a conical straw hat. The later publication record says she then had him edited to have blond hair and produce in his hands. The publication is newer, so it stands. The Japanese version was never generated (the API account ran out of credits).
- **Repository visibility**: `astras-pet-apps` is private, so the public profile's link to it shows a 404 to anyone signed out, and the public Goldfish cannot read its `pets.json` without a token. Whether Astra's Pet Apps should be public is Astra's call.

## Open in Claude's session

When OpenAI credits are back: regenerate the `curious` faces with `node scripts/generate-pets.mjs <ids> --match` (keeps each approved body). The pets measured as weak were Finance Finch and VSCode Angel (lopsided), with Python Panther and Paper Girl changing eye style. Chip is not on the list: he now uses the original Data Dealer drawing code, not a generated sheet.
