# Intelligence levels: what each intelligent app has built

Every intelligent app (a pet app) grows through **three levels of intelligence**, as decided for
ASTRAS_PET_OS ([ASTRAS_PET_OS.md](ASTRAS_PET_OS.md), section 2) and drawn in the 3D map:

| Level | Name | What it is | Map layer |
|---|---|---|---|
| 1 | **Program** | The base: real software that does the useful job (a Windows app, editor tools, a website, a web app). | 6 Real programs |
| 2 | **Runtime** | Runs on its own, without you opening it: scheduler, inbox, saved state, health. Keeps working when the Farm, the Farmer or the desktop star is closed. | 4 Pet agents |
| 3 | **Agentic harness** | The AI layer: model adapter (Claude, GPT or local), skills, tools, memory, permissions, task executor. Decides what to do next. | 5 AI harness (per pet) |

**Key:** ✅ built and verified · 🟡 partly there (see note) · — not built · $\color{red}{\textsf{red}}$ an obvious error to fix.
A level counts as built only with evidence (code on GitHub, a scheduled task or service on Astra's PC, a test).
Not built yet is not an error; an error is something broken, missing from GitHub, or out of step.

**Kind:** registered (in the registry with art) · pipeline (on GitHub, no registered art) · seed (approved name, no repo) · unregistered.

Checked 2026-10-12 by Claude Opus 5.5 (head chat), from GitHub (`main` of every repo), the 3D map data,
and Astra's PC (scheduled tasks, startup folder, running processes, project folders). Update a row when you
change a level, with the date and your evidence. Each intelligent app has its own chat; that chat keeps its row true.

| Intelligent app | Kind | Repo | 1 Program | 2 Runtime | 3 Agentic harness | Errors | Chat |
|---|---|---|---|---|---|---|---|
| Friendly Farmer | registered | `astras-pet-apps` | ✅ The Cage page, the Farmer's desk, the desktop pets and tray star, the 3D map | 🟡 **Farmer's daily rounds**: GitHub Actions job, every day 06:17 Denver. Scheduled only: no inbox | — Dev skills only (`skills/handoff`), not a runtime harness | $\color{red}{\textsf{Repo still named astras-pet-apps; PC folder is astras-pet-os}}$ | this head chat |
| API Fairy | registered | `api-fairy` | ✅ **API Fairy** Windows app (C#: key scanner, dashboard) | 🟡 Watches for new keys while open. Not running now; no startup entry | — | | |
| Astra Wisp | registered | `vrchat-ai-astra` | ✅ **AI Astra** desktop app (Python) and the VRChat chatbox bridge | 🟡 Background learning workers while the app is open | 🟡 **Her own AI**: a statistical model with living memory, not an LLM harness | $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | |
| Backup Beaver | pipeline | `backup-beaver` | 🟡 Web app only | — | — | | |
| Chat Rat | unregistered | `chat-rat` (private) | — No program in the repo yet (art only) | — | — | $\color{red}{\textsf{On the desktop but missing from the registry}}$ | |
| Chip | registered | `data-dealer` | ✅ Data Dealer dashboard builder (`dashboard/build.py`) and site | — | 🟡 **Claude Code role agents**: ceo, cfo, counsel, data-steward, engineer, eval-judge, growth, sourcing-agent, plus 3 skills. They run inside Claude Code, not their own harness | $\color{red}{\textsf{Public on GitHub but meant to be private; PC folder not connected}}$ | Data Dealer chats (4) |
| Claude Bot | pipeline | `claude-bot` | — No program in the repo yet | — | — One dev skill (`skills/handoff`) | $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | Claude Bot |
| Deck Duck | pipeline | `deck-duck` | 🟡 Web app only | — | — | | Deck Duck |
| Discord Damsel | registered | `findastra-discord-presence` | ✅ **OpenAI Discord Presence** and **Anthropic Discord Presence** tray apps | ✅ Both start at sign-in and run in the tray. No inbox | — | $\color{red}{\textsf{DM cleanup skill only on a side branch, not on main}}$ | |
| Drum Dog | registered | `drum-dog` | 🟡 Web app only | — | — | | |
| File Master | registered | `file-master` | ✅ **File Master** scanner, plan and undo tools (PowerShell) | 🟡 **FileMaster Weekly Scan** (Sundays 7 pm) | 🟡 **Claude Code agent** `file-master` (`agent/file-master.md`) | $\color{red}{\textsf{Weekly scan is written but not installed on the PC}}$ | |
| Finance Finch | registered | `finance-finch` | 🟡 Web app only | — | — | | |
| Fuzzboi Friend | pipeline | `fuzzboi-friend` | 🟡 Web app only | — | — | | Fuzzbois |
| Ghost Protocol | registered | `ghost-protocol` | ✅ Website `findastra.github.io/ghost-protocol` | — | — | | Ghost Protocol - Website Audit & Updates |
| Gif Giraffe | pipeline | `astras-gif-maker` | ✅ **Astra's GIF Maker** web app | — | — | $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | |
| GitHub Goldfish | registered | `github-goldfish` | 🟡 Web pages only (account audit page) | — Its audits run inside the Farmer's rounds | — | $\color{red}{\textsf{Its audit code lives in the hub, not in its own repo}}$ | |
| Health Hummy | registered | `health-hummy` | 🟡 Web app only | — | — | | Health Hummy - UTI, UC · Health Hummy - Breaking Habits |
| Mail Snail | pipeline | `mail-snail` | 🟡 Web app only | — | — | | |
| Meme Fiend | pipeline | `meme-fiend` (private) | 🟡 Web app only | — | — | | |
| Mesh Moth | pipeline | `mesh-moth` | 🟡 Web app only | — | — | | |
| Mine Mole | pipeline | `mine-mole` | 🟡 Web app only | — | — | $\color{red}{\textsf{No desktop art on GitHub, only draft art}}$ | |
| Mommy's Mommies | registered | `mommys` | 🟡 Web app only (site in `mommys-website`) | — | — | $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | Mommy's - Image Resize & Small PFP |
| OSC Sealion | seed | none | — Will manage OSCGoesBrrr and VRCFT face tracking | — | — | | OSC Sealion |
| Paper Girl | registered | `paper-girl` | ✅ Website `findastra.github.io/paper-girl` | — The GitHub workflow only publishes the site | — | | |
| Patch Cat | pipeline | `patch-cat` (private) | 🟡 Web app only | — | — | | |
| Piranesi Nessi | seed | none | — Will manage Piranesi House (VRChat world) | — | — | | |
| Platform Platypus | seed | none | 🟡 Local draft app: checks a page on iPhone, Android, iPad and desktop | — | — | $\color{red}{\textsf{Only on the PC, not on GitHub (card 010)}}$ | |
| Pole Puff | seed | none | — Will manage Astra's Infinite Pole (VRChat world) | — | — | | Astra's Infinite Pole - Video Player Screen Issues |
| Portfolio Puffer | registered | `portfolio-puffer` | 🟡 Web app only | — | — | | |
| Procreate Panda | seed | none | — Will manage Procreate | — | — | | |
| Project Parrot | registered | `project-parrot` | 🟡 Web app only | — | — | | |
| Python Panther | registered | `learn-python` | 🟡 Web app only | — | — | | |
| Raspberry Pi | pipeline | `raspberry-berry` | 🟡 Web app only | — | — | $\color{red}{\textsf{Three spellings: Raspberry Pi, Raspberry Pie, raspberry-berry}}$ | |
| RGBee | pipeline | `rgbee` | 🟡 Web app only | — | — | $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | |
| Rift Rabbit | pipeline | `rift-rabbit` | 🟡 Web app only | — | — | $\color{red}{\textsf{Public on GitHub but meant to be private}}$ | |
| Skill Scout | seed | none | — Job not decided | — | — | | Skill Scout |
| Spoonfed Sugarcube | pipeline | `spoonfed` | — No program in the repo yet | — | — | $\color{red}{\textsf{Repo named spoonfed, folder spoonfed-sugarcube; PC draft art differs from GitHub}}$ | |
| Startup Star | unregistered | none yet | 🟡 Shortcut and launcher for the desktop pets; the desktop host moves here later | — | — | $\color{red}{\textsf{Only on the PC, not on GitHub}}$ | this head chat |
| Unity Unicorn | registered | `unity-unicorn` | ✅ **Unity Unicorn** tool library app, plus on `main`: neck-blender, marble-carver, masonry-structural-audit, no-windows-audit, run-unity-tool. 🟡 In draft PR #1: sparkle-strapper, fan-fitter, rgb-painter, bending-adder, star-effects-diagnostic, golden-painter, chain-dangle-weights, gunsmith-loadout | — | 🟡 Claude skills on the PC (`face-transfer`, `vrchat-unity-world`) run through Claude Code | $\color{red}{\textsf{8 tools stuck in an unmerged PR; face-transfer only on the PC}}$ | Unity Unicorn - Multiple Tools, Neck Blend |
| Voicemeeter Bug | registered | `voicemeeter-bug` | ✅ **Voicemeeter Bug** Windows app (asks Voicemeeter to restart its audio engine) | ✅ Watches for audio devices reconnecting and restarts on its own; running on the PC now | — | $\color{red}{\textsf{Public on GitHub but meant to be private}}$ | Voicemeeter Bug |
| VSCode Angel | registered | `vscode-angel` | 🟡 Web app only | — | — | | |
| Wifi Butterfly | pipeline | `wifi-butterfly` | 🟡 Web app only | — | — | | |

## Errors that affect every app

- $\color{red}{\textsf{Double-clicking a registered desktop pet opens a copy of its app kept in the hub, not the program in its own repo.}}$
  Two copies of each app can drift apart.
- $\color{red}{\textsf{Double-clicking a pipeline desktop pet only opens its GitHub page; no app is wired up.}}$

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
