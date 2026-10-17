status: open (waiting on Astra: say yes to the folder rename plan row, and answer Role Fairy and Nullbot below)
for: any
from: Claude Sonnet 5.5 (`claude-sonnet-5-5`), 2026-10-17
needs: AGENTS.md ("One copy of each repo"), skills/pet-finder/SKILL.md, docs/naming-audit-20261016.md
---
## What I did

Astra asked me to bring what an older Claude chat (2026-10-07 to 2026-10-08, "the Cage chat") decided into this repo, and to take the best approach. I read the repo's rule files, compared them with `origin/main`, and found that almost everything from that chat is already here or was replaced by newer decisions.

- Branch `claude/chat-sync-20261017`, from `origin/main` at `beed649`, made in a separate worktree so the Codex checkout on `codex/world-caretakers-20261016` was not touched. Not merged.
- Changed `docs/agent-account-20261014.md`: the `icacls` grant pointed at `Documents\Projects`, a folder that no longer exists; it now points at `Documents\Astra's PetOS`, the folder name Astra chose on 2026-10-17 (commit `beed649`).
- Added this card and its row in `handoffs/README.md`.
- Ran `npm test` in the worktree (result recorded below).
- Updated my own memory notes outside the repo. Nothing else on Astra's PC was changed. `git fetch` only in every other repo.

**Already on main, nothing to do:** the registry and nine moods; Goldfish, Chip, API Fairy, Unity Unicorn, Python Panther, Astra Wisp, Health Hummy, Finance Finch, Mommy's Mommies (the twins share one sprite), Patty, File Master, Discord Damsel; the employer-name rule; the one-working-copy rule with the new folder name.

**Superseded, deliberately not carried over:** the Cage features asked for in the old chat (the Farmer opening the cage door, Nullbot standing on the cage, browser roaming), because the Cage is retired (Astra, 2026-10-12 and 2026-10-14); the old 32×32 hand-drawn art (replaced by generated 256×256 sprites); the old chat's spellings "Healthy Hummy" and "Paper Girl" (the list says Health Hummy and Patty); the old profile README draft on local branch `update-projects` in the `findastra` folder (the Farmer's profile round writes the profile now).

## Task

1. **PC folder rename (needs Astra's yes).** AGENTS.md says the working copies live in `Documents\Astra's PetOS`, but on the PC the folder is still `Documents\Astra's Pet Apps`. Per Astra's rule, a folder rename goes through File Master as an **unapproved plan row with the blocker written down**. Proposed row: rename `Documents\Astra's Pet Apps` to `Documents\Astra's PetOS`. Blockers to check first (`Get-CimInstance Win32_Process`, look for the folder in each command line): any running desktop pet or tray Star started from `astras-pet-os\bin`, `startup-star`, and the shortcut-icon scripts, plus any assistant session whose working folder is inside it. Not done: nothing was renamed.
2. **Role Fairy.** On 2026-10-07 Astra asked for Role Fairy as a pet; on 2026-10-16 she took it off the profile (`profile.hidden`), and `docs/naming-audit-20261016.md` still asks "pet, or Discord bot only?". I did not add it anywhere. Astra: say which.
3. **Nullbot.** Drawn in the old chat as a mascot that stands on the Cage; `mascots` in `pets.json` is empty and the art code in `scripts/pets-art.mjs` is still there. Not added. Astra: drop it, or keep it as a seed.
4. **Eleven PC folders have no git repo** (`vrchat-ai-astra`, `mommys`, `rgbee`, `piranesi-house`, `spoonfed-sugarcube`, `fuzzbois`, `image-bridge`, `astras-gif-maker`, `claude-bot`, `discord-damsel`, `findastra.github.io`) and `workflow-whirlpool` has none remote. Per "never leave a program only on the PC", each needs connecting or pushing with Astra's OK; the pet-finder tool's `--local` run lists them.
5. **Local `findastra` folder** is on `update-projects` with one unpushed commit (an old profile draft). Safe to delete once Astra agrees; nothing on GitHub depends on it.
6. **Hide/show button idea list** (kept here so it is not lost): the tray Star already does the tray icon plus gestures. Other ideas from the old chat: a brass key (turn to lock everyone away), the Farmer's hat (tip to send everyone to bed), a moon (bedtime: fall asleep, then fade).

## Done when

Astra has answered items 1 to 3, File Master has the rename row (approved or declined), and items 4 and 5 are either connected or consciously left.

## Return

Record the answers and any rename result in the next dated card; set this one to `done`.
