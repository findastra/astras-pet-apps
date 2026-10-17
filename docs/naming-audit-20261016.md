# Naming audit (Flash Audit A06 + A07), 2026-10-16

*The naming part of the [Flash Audit](https://github.com/findastra/astras-pet-os/blob/codex/world-caretakers-20261016/docs/flash-audit-20261014.md): A06 (pet name) and A07 (program name). Run for Astra by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-16. Owner: GitHub Goldfish (GitHub Aquarium). Recorded on The Farm.*

## Where I looked

| Source | What | Covered |
|---|---|---|
| GitHub | All 93 repos under `findastra`, the `pet.json` in each, and every branch of `astras-pet-os` (41 branches) | ✅ |
| `pet-programs.json` and `pets.json` | `main` and the Codex branches (`world-caretakers`, `yellow-phone`, `findastra-readme-auditor`, `identity-bound-access`) | ✅ |
| Saved AI conversations on Astra's PC | 65 conversations in `Documents\Chats` (Chat Rat's archive): Codex (GPT-5.6, GPT-6, GPT-6.1) and Claude Code (Opus, Sonnet, Haiku), 2026-08-31 to 2026-10-16 17:10, plus `conversation-discord-presence-20261014.txt`. I read every message Astra wrote about pets and every answer she gave to a naming question | ✅ |
| Pet folders on the PC | `Documents\Astra's Pet Apps` (41 folders), `Documents\ChatGPT`, `Documents\Codex` | ✅ |
| **Not covered** | ChatGPT phone and web chats (Intel Owl came from one), claude.ai chats, and Codex sessions after Chat Rat's last save (17:10 on 2026-10-16). Chat Rat cannot save these yet, and access to `.codex` was not granted | ⚠️ Not verified |

## Total

**82 numbered pets**, plus **3 pets with no number yet**: **85 in all**.

| | Count |
|---|---|
| Numbered pets (`pet-programs.json`, #1 to #82) | 82: 19 registered, 17 pipeline, 15 seed, 31 roadmap |
| Have their own repo on GitHub | 80 (#81 Intel Owl and #82 Door Dormouse have none) |
| Pet program (home) decided | **36** |
| Pet program not decided yet | **46** (the next rapid round starts at **#30 Fuzzboi Friend**) |
| Pet name not decided | 1 (#77, `pet-program-77-icon-77`) |
| Not numbered yet | 3: **Workflow Whale** (Workflow Whirlpool, only on the PC), **Index Mole** (named by Astra on 2026-10-12, never recorded), **Role Fairy** (pet #13 on the 2026-10-07 roster, now only a Discord repo) |

## Exceptions (Flash Audit format: only Missing, Incorrect and Not verified)

| Check | Pet | Status | Finding | Fix |
|---|---|---|---|---|
| A07 | 19 pets (#2, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 21, 22, 23, 24, 42, 82) | **Fixed** | Astra named these on 2026-10-15 and 2026-10-16 in Codex. The names were only on unmerged Codex branches, so `main`, the profile and the System Map still said `pet-program-#` | Brought over to `main` in this change |
| A07 | #9 Finance Finch | Pass, but worth knowing | She picked *The Counting House*, then changed it to **Nest Egg** ("no wait i wanyed nest egg") | Nest Egg kept |
| A06 | #77 | Missing | `pet-program-77-icon-77` is a placeholder. Codex suggested **Vet Vole**, with the program **The Triage Desk** | Astra picks |
| A06/A07 | #37 Dubstep Gunsmith | Incorrect | A home sits in the pet slot. On 2026-10-12 Astra said "the Dubstep Gunsmith **Guy** (icon) represents the Dubstep Gunsmith (program)". On 2026-10-14 she asked for "Dubstep Gunsmith Shop, or something more clever" | Astra confirms which |
| A06 | #11 Patty, #17 Gone Ghost | Incorrect | The pet's own `pet.json` still says Paper Girl and Ghost Protocol (the 2026-10-12 renames) | Each pet's chat updates its repo |
| A07 | 25 repos | Missing | The pet's own `pet.json` has no `program`. #12 and #42 still say `pet-program-#`. Codex's `yellow-phone` branches may fix some of them; they are not merged | Next Flash Audit round on each repo |
| A06 | #35 Chat Rat | Missing | Not in the `pets.json` registry. Registering a pet moves it through the gate | Astra decides |
| A06 | Workflow Whale | Missing | `workflow-whirlpool` is only on the PC: no repo and no number | Push with Astra's OK, then give it #83 |
| A06 | Index Mole | Missing | Astra described it on 2026-10-12 ("Rift Rabbit … calling the Index Mole to investigate … Wi-Fi congestion"). It never reached a list | Astra: seed or tool? |
| A06 | Role Fairy | Not verified | On the 2026-10-07 roster as pet #13 (`role-fairy`, growing). It later dropped out, and the repo has no `pet.json` | Astra: pet, or Discord bot only? |
| A06 | Intel Owl #81 | Not verified | Comes from a ChatGPT phone chat I can't see ("replaces Scout Fox / Intel Ibis") | Fine as a seed; the source chat is not archived |

## Decided pet programs (32)

| # | Pet | Pet program |
|---|---|---|
| 1 | Friendly Farmer | The Farm |
| 2 | GitHub Goldfish | GitHub Aquarium |
| 3 | Chip | Data Dealer |
| 4 | API Fairy | API Fairy Ring |
| 5 | Unity Unicorn | Unity Stable |
| 6 | Python Panther | Python Jungle |
| 7 | Astra Wisp | AI Astra |
| 8 | Health Hummy | The Nectar Nest |
| 9 | Finance Finch | Nest Egg |
| 10 | Mommy's Mommies | Mommy’s Green Room |
| 11 | Patty | Paper Girl |
| 12 | File Master | File Kingdom |
| 13 | Discord Damsel | Discord Tower |
| 14 | Portfolio Puffer | Iced Out Iceberg |
| 15 | Drum Dog | Bass & Biscuits |
| 16 | VSCode Angel | Halo List |
| 17 | Gone Ghost | Am I a Ghost? |
| 18 | Project Parrot | Idea Perch |
| 19 | Voicemeeter Bug | Audio Rescue |
| 20 | Sugarcube | Spoonfed |
| 21 | Claude Bot | Claude Dock |
| 22 | RGBee | Light Hive |
| 23 | Mine Mole | Crypto Burrow |
| 24 | Mail Snail | Mail Shell |
| 27 | Gif Giraffe | Astra's GIF Maker |
| 34 | Raspberry Pi Berry | Raspberry Pi Maker |
| 42 | Piranesi Nessi | Nessi's Ocean |
| 46 | Gatekeeper Goddess | Iron Gates |
| 78 | Pet Police Officer | The Police Station |
| 79 | AI Dashund | AI Doghouse |
| 80 | Rescue Retriever | The Recovery Room |
| 82 | Door Dormouse | The Threshold |
## Round 18, 2026-10-16 (Astra's answers)

| # | Pet | Pet program |
|---|---|---|
| 25 | Patch Cat | The Litter Box |
| 26 | Meme Fiend | Cursed Archive |
| 28 | Backup Beaver | Backup Dam |
| 29 | Rift Rabbit | Wonderland Launchpad |

## Rapid-question queue (46 undecided)

Ask in order, with four explained suggestions plus free text, and save each answer to `pet-programs.json` straight away. **Idea** is the suggestion already on file.

| # | Pet | Stage | Idea on file |
|---|---|---|---|
| 30 | Fuzzboi Friend | pipeline | Fuzz Factory (or Fuzzbois, the site he watches) |
| 31 | Wifi Butterfly | pipeline | Signal Garden |
| 32 | Deck Duck | pipeline | Deck Pond |
| 33 | Mesh Moth | pipeline | Mesh Lantern |
| 35 | Chat Rat | pipeline | Chat Nest |
| 36 | Platform Platypus | pipeline | Mirror Pool |
| 37 | Dubstep Gunsmith | seed | Dubstep Gunsmith Shop, or something more clever (Astra, 2026-10-14) |
| 38 | Pole Puff | seed | Astra's Infinite Pole (the world she looks after), or Pole Lookout |
| 39 | Procreate Panda | seed | Bamboo Studio |
| 40 | Skill Scout | seed | Skill Logbook |
| 41 | OSC Sealion | seed | OSC Sonar |
| 43 | Photo Dodo | seed | Photo Roost |
| 44 | Video Vulture | seed | Video Vault |
| 45 | Closet Cat | seed | Catwalk |
| 47 | Queue Quokka | roadmap | Task Island |
| 48 | Log Lynx | roadmap | Log Den |
| 49 | Server Salamander | roadmap | Server Hearth |
| 50 | Docker Dragon | roadmap | Container Hoard |
| 51 | Test Tortoise | roadmap | Test Track |
| 52 | Token Toucan | roadmap | Token Canopy |
| 53 | Packet Piranha | roadmap | Packet River |
| 54 | Calendar Crow | roadmap | Crow's Nest |
| 55 | Browser Bat | roadmap | Browser Belfry |
| 56 | Data Dragonfly | roadmap | Data Marsh |
| 57 | Update Urchin | roadmap | Update Tidepool |
| 58 | Linux Penguin | roadmap | Linux Iceberg |
| 59 | Stock Fox | roadmap | Market Meadow |
| 60 | Passport Pelican | roadmap | Passport Harbor |
| 61 | Journal Jellyfish | roadmap | Journal Lagoon |
| 62 | Shell Squid | roadmap | Shell Trench |
| 63 | Kernel Koala | roadmap | Kernel Grove |
| 64 | Proxy Axolotl | roadmap | Proxy Lake |
| 65 | Cluster Crab | roadmap | Cluster Shore |
| 66 | Storage Stoat | roadmap | Storage Warren |
| 67 | White Hat Weasel | roadmap | White Hat Lab |
| 68 | Port Spider | roadmap | Port Web |
| 69 | Cipher Owl | roadmap | Cipher Hollow |
| 70 | Forensic Ferret | roadmap | Evidence Locker |
| 71 | Llama Librarian | roadmap | Model Library |
| 72 | Inference Iguana | roadmap | Benchmark Rock |
| 73 | Agent Ant | roadmap | Agent Colony |
| 74 | Roaming Raven | roadmap | Roam Map |
| 75 | Cache Coyote | roadmap | Cache Canyon |
| 76 | Sync Mink | roadmap | Sync Stream |
| 77 | pet-program-77-icon-77 | seed | Vet Clinic / Vetted Vet: triage for the community vet-clinic (labels tickets, checks for leaked secrets, tests offered cures in isolation; never merges) |
| 81 | Intel Owl | seed | Threat Observatory |
## Why things keep getting missed

There isn't one missing step. There are four gaps, and every one comes down to decisions being made in chats that don't write them to The Farm:

1. **Decisions stay on branches.** Astra named 19 homes on 2026-10-15/16, but Codex saved them on review branches (`codex/world-caretakers-20261016` and three others). Those branches also hold 100+ other files, so nobody merged them, and the names never reached `main`. The Flash Audit sheet and cards 013 and 015 are stuck the same way.
2. **Chats are not an inbox.** A pet named in a conversation (Index Mole, Role Fairy, the phone pets) only exists if that chat writes it down. Chat Rat saves the conversations, but nothing reads them.
3. **There are several lists.** `pets.json`, its `seeds`, `pet-programs.json`, `INTELLIGENCE-LEVELS.md`, `docs/naming-20261013.md`, each repo's `pet.json` and local `*-candidate-*.json` files all hold names. Each assistant updates the one it knows about.
4. **Rounds stop when the chat stops.** The naming round stopped at 17 of 68 when the conversation turned to tools. Nothing recorded where it stopped.

**The fix (intake step):** every chat that names, renames or creates a pet writes one line to `pet-programs.json`, and **only** that file, in its own tiny commit merged that day. Everything else is built from it. Then the Friendly Farmer's daily round runs pet-finder over GitHub and the Chat Rat archive, and lists any name that isn't recorded.

## Done in this change

- `pet-programs.json`:
  - The 19 home names from Codex's branch.
  - #81 Intel Owl (seed) and #82 Door Dormouse / The Threshold (seed).
  - Nessi's Ocean's descriptor.
  - Newer `idea` suggestions.
- `pets.json` seeds: Intel Owl and Door Dormouse added; Piranesi Nessi's program set to Nessi's Ocean.
- This record.

Nothing on Astra's PC was changed. No repo was created or renamed.
