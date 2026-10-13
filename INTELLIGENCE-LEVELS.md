# Intelligence levels: what each intelligent app has built

Every intelligent app (a pet app) grows through **three levels of intelligence**, as decided for
ASTRAS_PET_OS ([ASTRAS_PET_OS.md](ASTRAS_PET_OS.md), section 2) and drawn in the 3D map:

| Level | Name | What it is | Map layer |
|---|---|---|---|
| 1 | **Program** | The base: real software that does the useful job (a Windows app, editor tools, a website, a web app). | 6 Real programs |
| 2 | **Runtime** | Runs on its own, without you opening it: scheduler, inbox, saved state, health. Keeps working when the Farm, the Farmer or the desktop star is closed. | 4 Pet agents |
| 3 | **Agentic harness** | The AI layer: model adapter (Claude, GPT or local), skills, tools, memory, permissions, task executor. Decides what to do next. | 5 AI harness (per pet) |

**Key:** ✅ built and verified · 🟡 partly there (see note) · — not built.
A level counts as built only with evidence (code on GitHub, a scheduled task or service on Astra's PC, a test).
A plan, an idea or a page that only describes the pet is not a level.

Checked 2026-10-12 by Claude Opus 5.5 (head chat), from GitHub (`main` of every repo), the 3D map data,
and Astra's PC (scheduled tasks, startup folder, running processes). Update a row when you change a level,
with the date and your evidence. Each intelligent app has its own chat; that chat keeps its row true.

## Registered pets (19)

| Intelligent app | Repo | 1 Program | 2 Runtime | 3 Agentic harness | Chat |
|---|---|---|---|---|---|
| Friendly Farmer | `astras-pet-apps` (folder `astras-pet-os`) | ✅ The Cage page, the Farmer's desk, the desktop pets and tray star (Startup Star), the 3D map | 🟡 **Farmer's daily rounds**: GitHub Actions job, every day 06:17 Denver. Scheduled only: no inbox | — Dev skills only (`skills/handoff`), which are not a runtime harness | this head chat |
| GitHub Goldfish | `github-goldfish` | 🟡 Web pages only (account audit page); no audit code in its repo | — Its audits run inside the Farmer's rounds, not on their own | — | |
| Chip | `data-dealer` | ✅ Data Dealer dashboard builder (`dashboard/build.py`) and site | — | 🟡 **Claude Code role agents**: ceo, cfo, counsel, data-steward, engineer, eval-judge, growth, sourcing-agent, plus 3 skills. They run inside Claude Code, not their own harness | Data Dealer chats (4) |
| API Fairy | `api-fairy` | ✅ **API Fairy** Windows app (C#: key scanner, dashboard) | 🟡 Desktop app that watches for new keys while open. Not running now; no startup entry | — | |
| Unity Unicorn | `unity-unicorn` | ✅ **Unity Unicorn** tool library app plus editor tools on `main`: neck-blender, marble-carver, masonry-structural-audit, no-windows-audit, run-unity-tool. 🟡 In draft PR #1, not merged: sparkle-strapper, fan-fitter, rgb-painter, bending-adder, star-effects-diagnostic, golden-painter, chain-dangle-weights, gunsmith-loadout. 🟡 Only on Astra's PC: face-transfer, Poppy's installed copies | — | 🟡 Claude skills on Astra's PC (`face-transfer`, `vrchat-unity-world`) run through Claude Code | Unity Unicorn - Multiple Tools, Neck Blend |
| Python Panther | `learn-python` | 🟡 Web app only | — | — | |
| Astra Wisp | `vrchat-ai-astra` | ✅ **AI Astra** desktop app (Python) and the VRChat chatbox bridge | 🟡 Background learning workers while the app is open | 🟡 **Her own AI**: a statistical model with living memory, not an LLM harness | |
| Health Hummy | `health-hummy` | 🟡 Web app only | — | — | Health Hummy - UTI, UC · Health Hummy - Breaking Habits |
| Finance Finch | `finance-finch` | 🟡 Web app only | — | — | |
| Mommy's Mommies | `mommys` | 🟡 Web app only (site in `mommys-website`) | — | — | Mommy's - Image Resize & Small PFP |
| Paper Girl | `paper-girl` | ✅ Website `findastra.github.io/paper-girl` | — The GitHub workflow only publishes the site | — | |
| File Master | `file-master` | ✅ **File Master** scanner, plan and undo tools (PowerShell) | 🟡 **FileMaster Weekly Scan** (Sundays 7 pm) is written but **not installed** on Astra's PC | 🟡 **Claude Code agent** `file-master` (`agent/file-master.md`) | |
| Discord Damsel | `findastra-discord-presence` | ✅ **OpenAI Discord Presence** and **Anthropic Discord Presence** tray apps | ✅ Both start at sign-in (Startup folder) and run in the tray. No inbox | — DM cleanup skill is only on branch `claude/dm-cleanup-skill-20261010` | |
| Portfolio Puffer | `portfolio-puffer` | 🟡 Web app only | — | — | |
| Drum Dog | `drum-dog` | 🟡 Web app only | — | — | |
| VSCode Angel | `vscode-angel` | 🟡 Web app only | — | — | |
| Ghost Protocol | `ghost-protocol` | ✅ Website `findastra.github.io/ghost-protocol` | — | — | Ghost Protocol - Website Audit & Updates |
| Project Parrot | `project-parrot` | 🟡 Web app only | — | — | |
| Voicemeeter Bug | `voicemeeter-bug` | ✅ **Voicemeeter Bug** Windows app (asks Voicemeeter to restart its audio engine) | ✅ Watches for audio devices reconnecting and restarts on its own; running on Astra's PC now | — | Voicemeeter Bug |

## Pipeline pets (on GitHub, no registered art yet) (15)

| Intelligent app | Repo | 1 Program | 2 Runtime | 3 Agentic harness | Chat |
|---|---|---|---|---|---|
| Spoonfed Sugarcube | `spoonfed` (folder `spoonfed-sugarcube`) | — No program in the repo yet | — | — | |
| Claude Bot | `claude-bot` | — No program in the repo yet | — | — One dev skill (`skills/handoff`) | Claude Bot |
| RGBee | `rgbee` | 🟡 Web app only | — | — | |
| Mine Mole | `mine-mole` | 🟡 Web app only | — | — | |
| Mail Snail | `mail-snail` | 🟡 Web app only | — | — | |
| Patch Cat | `patch-cat` | 🟡 Web app only | — | — | |
| Meme Fiend | `meme-fiend` | 🟡 Web app only | — | — | |
| Gif Giraffe | `astras-gif-maker` | ✅ **Astra's GIF Maker** web app | — | — | |
| Backup Beaver | `backup-beaver` | 🟡 Web app only | — | — | |
| Rift Rabbit | `rift-rabbit` | 🟡 Web app only | — | — | |
| Fuzzboi Friend | `fuzzboi-friend` | 🟡 Web app only | — | — | Fuzzbois |
| Wifi Butterfly | `wifi-butterfly` | 🟡 Web app only | — | — | |
| Deck Duck | `deck-duck` | 🟡 Web app only | — | — | Deck Duck |
| Mesh Moth | `mesh-moth` | 🟡 Web app only | — | — | |
| Raspberry Pi | `raspberry-berry` | 🟡 Web app only | — | — | |

## Not yet in the registry

| Intelligent app | Repo | 1 Program | 2 Runtime | 3 Agentic harness | Chat |
|---|---|---|---|---|---|
| Chat Rat | `chat-rat` (private) | — No program in the repo yet (art only) | — | — | |
| Startup Star | none yet (folder `startup-star`) | 🟡 Shortcut and launcher for the desktop pets; the desktop host moves here later | — | — | this head chat |

## Seeds (approved names, no repo) (6)

| Intelligent app | Will manage (its programs) | 1 Program | 2 Runtime | 3 Agentic harness | Chat |
|---|---|---|---|---|---|
| Pole Puff | Astra's Infinite Pole (VRChat world) | — The world exists, the pet does not | — | — | Astra's Infinite Pole - Video Player Screen Issues |
| Piranesi Nessi | Piranesi House (VRChat world) | — | — | — | |
| OSC Sealion | OSCGoesBrrr, VRCFT face tracking | — | — | — | OSC Sealion |
| Platform Platypus | Checks pages on iPhone, Android, iPad and desktop | 🟡 Local draft app on Astra's PC, not on GitHub (card 010) | — | — | |
| Procreate Panda | Procreate | — | — | — | |
| Skill Scout | (job not decided) | — | — | — | Skill Scout |

## What this shows

- **Level 1:** 11 of 42 apps have a real program; 31 have a web page, a local draft or nothing yet.
- **Level 2:** 2 runtimes are fully working (Discord Damsel, Voicemeeter Bug) and 4 are partial
  (the Farmer's scheduled rounds, API Fairy, Astra Wisp, and File Master's scan, which is not installed).
  None has the inbox and saved state that the architecture asks for.
- **Level 3:** no app has its own agentic harness yet. Three borrow Claude Code (Chip, File Master,
  Unity Unicorn), and Astra Wisp has her own non-LLM AI.
- **The shared harness (Astra Pet SDK) is not built.** It is Phase 5 of
  [docs/migration/PLAN.md](docs/migration/PLAN.md), after Contracts, Program Manager, the Farm and Workers.
- "Web app only" means one HTML page in the pet's repo. Each needs a check of whether it does
  real work or only describes the pet; until then it stays 🟡.
