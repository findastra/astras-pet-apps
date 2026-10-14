# Intelligence levels of the intelligent app (the pet)

Every intelligent app in Astra's PetOS, also known as the **pet**, is built in four levels.
The pet itself is level 2, the **Pet Program**: the alive, intelligent part. Below it are the
programs it runs; above it are the AI it can call on and the human it answers to.

```
 4  HUMAN                 You: enter information, approve, decide
          ▲  │
          │  ▼
 3  AGENTIC HARNESS       Empty seat for an AI model.  Seated = the Agent
          ▲  │            (called by level 2 or level 4)
 escalate │  ▼ results
 2  PET PROGRAM  ◀── the pet: tools + features, decides when to escalate to level 3
          │  ▲
  manages │  │ data
          ▼  │
 1  ROOT PROGRAM(S)       External programs the pet executes and looks after
```

## The four levels

### Level 1: Root Program(s)
**Execution.** The external programs the pet executes and looks after: desktop apps, websites,
VRChat worlds, devices, cloud services.
- External Program 1
- External Program 2
- External Program N

Several Pet Programs may call on the same Root Program (Unity Unicorn, Pole Puff and Piranesi
Nessi all use Unity). A Root Program can be someone else's software (Voicemeeter, Ableton Live) or
a project Astra made that a pet looks after (Data Dealer, the Ghost Protocol website).

### Level 2: Pet Program (the pet)
**The alive, intelligent part.** It generates tools for the runtimes of its level 1 Root Programs
and manages those runtimes. It also has other features, built on Root Program data and on input
from level 3 (Agentic Harness) and level 4 (Human).
- Tool 1
- Tool 2
- Tool N
- Feature 1
- Feature N

The Pet Program decides when to **escalate to level 3**: call an AI to sit in its Agentic Harness
to solve outside problems, change designs on GitHub and make troubleshooting decisions.
Pet Programs are **serialized as they are created** (Pet Program #, below).

### Level 3: Agentic Harness
**An empty seat for an AI.** When level 2 (Pet Program) or level 4 (Human) calls on it, an
available AI model is seated in the Pet Program's Agentic Harness to form the **Agent**.
It is an *Agentic Harness* before it is seated, and an *Agent* while seated.
- Anthropic AI Model 1 … N
- OpenAI Model 1 … N
- Other AI Model 1 … N

### Level 4: Human
**You.** Enter information, answer what a pet asks, and approve anything that matters.

## Pet Program numbers

Every Pet Program gets a **Pet Program #** in the order it was created, and keeps it for life.
- Numbers are never reused or reordered, even when a pet is renamed or retired.
- Community pets (the Kennel) get their number when they move to the native OS (the Farm).
- A seed has no number until its Pet Program exists; it then takes the next number.
- **1 to 36 were numbered retroactively on 2026-10-13** from the git history: the first hub
  commit (2026-10-07), each repo's first commit, and the hub's registration commits. Pets that
  arrived at the same moment keep their registry order. Each number's evidence is in
  `pet_programs` in [pets.json](pets.json), the source of truth.

## Grouped by level: what needs work

✅ built and working · 🟡 partly there · — not built. Generated from `pet_programs` in pets.json
by `npm run build`; level 4 (Human) is the same for every pet, so it is not listed.

<!-- level-groups:start (generated from pets.json pet_programs by scripts/update-readme.mjs; do not edit by hand) -->
| Level | ✅ Built | 🟡 Partly there (needs work) | — Not built (needs work) |
|---|---|---|---|
| **1 Root Program(s)** | #1 Friendly Farmer, #2 GitHub Goldfish, #3 Chip, #5 Unity Unicorn, #6 Python Panther, #7 Astra Wisp, #11 Patty, #12 File Master, #13 Discord Damsel, #17 Gone Ghost, #19 Voicemeeter Bug, #22 Gif Giraffe, #24 Rift Rabbit, #27 Fuzzboi Friend, #35 Spoonfed Sugarcube | #10 Mommy's Mommies, #15 Drum Dog, #16 VSCode Angel, #21 RGBee, #23 Meme Fiend, #26 Mesh Moth, #32 Raspberry Pi, #33 Mine Mole, #34 Chat Rat | #4 API Fairy, #8 Health Hummy, #9 Finance Finch, #14 Portfolio Puffer, #18 Project Parrot, #20 Claude Bot, #25 Deck Duck, #28 Wifi Butterfly, #29 Backup Beaver, #30 Patch Cat, #31 Mail Snail, #36 Platform Platypus |
| **2 Pet Program** | #13 Discord Damsel, #19 Voicemeeter Bug | #1 Friendly Farmer, #2 GitHub Goldfish, #3 Chip, #4 API Fairy, #5 Unity Unicorn, #6 Python Panther, #7 Astra Wisp, #8 Health Hummy, #9 Finance Finch, #10 Mommy's Mommies, #12 File Master, #14 Portfolio Puffer, #15 Drum Dog, #16 VSCode Angel, #18 Project Parrot, #21 RGBee, #23 Meme Fiend, #24 Rift Rabbit, #25 Deck Duck, #26 Mesh Moth, #28 Wifi Butterfly, #29 Backup Beaver, #30 Patch Cat, #31 Mail Snail, #32 Raspberry Pi, #33 Mine Mole, #36 Platform Platypus | #11 Patty, #17 Gone Ghost, #20 Claude Bot, #22 Gif Giraffe, #27 Fuzzboi Friend, #34 Chat Rat, #35 Spoonfed Sugarcube |
| **3 Agentic Harness** | none | #3 Chip, #5 Unity Unicorn, #12 File Master | #1 Friendly Farmer, #2 GitHub Goldfish, #4 API Fairy, #6 Python Panther, #7 Astra Wisp, #8 Health Hummy, #9 Finance Finch, #10 Mommy's Mommies, #11 Patty, #13 Discord Damsel, #14 Portfolio Puffer, #15 Drum Dog, #16 VSCode Angel, #17 Gone Ghost, #18 Project Parrot, #19 Voicemeeter Bug, #20 Claude Bot, #21 RGBee, #22 Gif Giraffe, #23 Meme Fiend, #24 Rift Rabbit, #25 Deck Duck, #26 Mesh Moth, #27 Fuzzboi Friend, #28 Wifi Butterfly, #29 Backup Beaver, #30 Patch Cat, #31 Mail Snail, #32 Raspberry Pi, #33 Mine Mole, #34 Chat Rat, #35 Spoonfed Sugarcube, #36 Platform Platypus |

| Error | Pet Programs |
|---|---|
| name mismatch | #32 Raspberry Pi, #35 Spoonfed Sugarcube |
| PC folder not connected to its GitHub repo | #3 Chip, #7 Astra Wisp, #10 Mommy's Mommies, #20 Claude Bot, #21 RGBee, #22 Gif Giraffe |
| only on the PC, not on GitHub | #5 Unity Unicorn, #36 Platform Platypus |
| stuck in an unmerged pull request or on a branch | #5 Unity Unicorn, #13 Discord Damsel, #35 Spoonfed Sugarcube |
| scheduled task not installed | #12 File Master |
| missing from the registry | #34 Chat Rat |
| art missing or different | #33 Mine Mole, #35 Spoonfed Sugarcube |
| code in the wrong repo | #2 GitHub Goldfish |
| a Root Program it looks after is not installed | #15 Drum Dog, #25 Deck Duck |
<!-- level-groups:end -->

## Every Pet Program

Checked 2026-10-12 and renumbered 2026-10-13 by Claude Opus 5.5, from GitHub (`main` of every
repo), the System Map data and Astra's PC. Update a row when you change a level, with the date and
your evidence, and keep the marks in step with `pet_programs` in pets.json (a test checks them).
Each intelligent app has its own chat; that chat keeps its row true.

**Kind:** registered (in the registry with art) · pipeline (on GitHub, no registered art) ·
seed (approved name, draft program only) · unregistered.

| # | Icon | Pet | Kind | Repo | 1 Root Program(s) | 2 Pet Program: tools, features, runs on its own | 3 Agentic Harness | Errors | Chat |
|---|---|---|---|---|---|---|---|---|---|
| 1 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/astras-pet-os-20261012.png" width="40" alt=""> | **Friendly Farmer** | registered | [astras-pet-os](https://github.com/findastra/astras-pet-os) | ✅ GitHub (his rounds run on GitHub Actions). He looks after the other pets, not outside programs | 🟡 **Tools:** [the Farmer's desk](apps/astras-pet-apps-20261008.html), [daily rounds](scripts/farmer-rounds-20261009.mjs), the [System Map](system-map-20261012.html); Startup Star, his tool (tray Star, desktop host, desktop pets; on the PC only). **Runs on its own:** every day at 06:17 Denver (status, moods, roster, profile README). No inbox yet | — Dev skills only ([skills/handoff](skills/handoff/SKILL.md)) | | this head chat |
| 2 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/github-goldfish-20261012.png" width="40" alt=""> | **GitHub Goldfish** | registered | [github-goldfish](https://github.com/findastra/github-goldfish) | ✅ GitHub | 🟡 **Tools:** [account audit page](https://github.com/findastra/github-goldfish/blob/main/index.html). **Runs on its own:** inside the Farmer's daily rounds. **Should:** find blatant, systemic, organizational and document-control errors in everything public | — | 📦 $\color{red}{\textsf{Its audit code lives in the hub, not in its own repo}}$ | |
| 3 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/data-dealer-20261012.png" width="40" alt=""> | **Chip** | registered | [data-dealer](https://github.com/findastra/data-dealer) | ✅ Data Dealer (Astra's): [dashboard](https://github.com/findastra/data-dealer/tree/main/dashboard) and [site](https://github.com/findastra/data-dealer/tree/main/site) | 🟡 **Tools:** web app page only. **Should:** one daily health report on Data Dealer (site, data, services, open work); a priority | 🟡 [Claude Code role agents](https://github.com/findastra/data-dealer/tree/main/.claude/agents) and 3 skills, run inside Claude Code, not a harness of his own | 🔌 $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | Data Dealer chats (4) |
| 4 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/api-fairy-20261012.png" width="40" alt=""> | **API Fairy** | registered | [api-fairy](https://github.com/findastra/api-fairy) | — None connected (the services whose keys she tracks) | 🟡 **Tools:** [Windows app](https://github.com/findastra/api-fairy/tree/main/src): key scanner, dashboard. **Runs on its own:** only while the app is open. **Should:** a weekly stale-key check and suggestions | — | | |
| 5 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/unity-unicorn-20261012.png" width="40" alt=""> | **Unity Unicorn** | registered | [unity-unicorn](https://github.com/findastra/unity-unicorn) | ✅ Unity, VRChat Creator Companion, Blender | 🟡 **Tools:** [tool library app](https://github.com/findastra/unity-unicorn/blob/main/unity-unicorn-20261008.html); on main: neck-blender, marble-carver, masonry-structural-audit, no-windows-audit, run-unity-tool; in [draft PR #1](https://github.com/findastra/unity-unicorn/pull/1): sparkle-strapper, fan-fitter, rgb-painter, bending-adder, star-effects-diagnostic, golden-painter, chain-dangle-weights, gunsmith-loadout; [face-transfer](https://github.com/findastra/unity-unicorn/tree/claude/face-transfer-20261011) on a branch. **Features:** Dubstep Gunsmith (catalog of avatar gun effects). **Runs on its own:** logs every tool run | 🟡 Claude skills on the PC (face-transfer, vrchat-unity-world), run through Claude Code | 🚧 $\color{red}{\textsf{8 tools in an unmerged PR; face-transfer on a branch}}$ 💻 $\color{red}{\textsf{Dubstep Gunsmith only on the PC}}$ | Unity Unicorn - Multiple Tools, Neck Blend |
| 6 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/learn-python-20261012.png" width="40" alt=""> | **Python Panther** | registered | [learn-python](https://github.com/findastra/learn-python) | ✅ Python and the original lessons in learn-python | 🟡 **Tools:** [Python practice desk](https://github.com/findastra/learn-python/blob/main/learn-python-20261008.html). **Runs on its own:** nothing needs to; progress is saved when you practise | — | | |
| 7 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/vrchat-ai-astra-20261012.png" width="40" alt=""> | **Astra Wisp** | registered | [vrchat-ai-astra](https://github.com/findastra/vrchat-ai-astra) | ✅ AI Astra (Astra's): [desktop app](https://github.com/findastra/vrchat-ai-astra/blob/main/ai_astra_phoenix_desktop.py) and [VRChat chatbox bridge](https://github.com/findastra/vrchat-ai-astra/tree/main/vrchat-bridge); VRChat | 🟡 **Tools:** web app page only. **Should:** watch AI Astra's health while she runs and while she is worked on offline | — (AI Astra's own non-LLM model is part of the Root Program, not Wisp's harness) | 🔌 $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | |
| 8 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/health-hummy-20261012.png" width="40" alt=""> | **Health Hummy** | registered | [health-hummy](https://github.com/findastra/health-hummy) | — None | 🟡 **Tools:** [web app](https://github.com/findastra/health-hummy/blob/main/health-hummy-20261008.html). **Should:** track lifting by body group and sets, cardio and pole plans; data stays on the PC | — | | Health Hummy - UTI, UC · Health Hummy - Breaking Habits |
| 9 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/finance-finch-20261012.png" width="40" alt=""> | **Finance Finch** | registered | [finance-finch](https://github.com/findastra/finance-finch) | — Bank, savings and investment accounts (not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/finance-finch/blob/main/finance-finch-20261008.html). **Should:** a daily read-only sync; never moves money; data stays on the PC | — | | |
| 10 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/mommys-20261012.png" width="40" alt=""> | **Mommy's Mommies** | registered | [mommys](https://github.com/findastra/mommys) | 🟡 [mommys-website](https://github.com/findastra/mommys-website); calendar and Discord planned | 🟡 **Tools:** [web app](https://github.com/findastra/mommys/blob/main/mommys-20261008.html). **Should:** get each class and event ready before it starts | — | 🔌 $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | Mommy's - Image Resize & Small PFP |
| 11 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/paper-girl-20261012.png" width="40" alt=""> | **Patty** | registered | [paper-girl](https://github.com/findastra/paper-girl) | ✅ Paper Girl (Astra's): [findastra.github.io/paper-girl](https://findastra.github.io/paper-girl/), the free science discovery website | — Nothing of her own yet. **Should:** bring fresh research and articles to the site daily (suggested) | — | | |
| 12 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/file-master-20261012.png" width="40" alt=""> | **File Master** | registered | [file-master](https://github.com/findastra/file-master) | ✅ Everything, SpaceSniffer, the Windows file system | 🟡 **Tools:** [scanner, plan and undo](https://github.com/findastra/file-master/tree/main/scripts). **Runs on its own:** weekly scan, Sundays 7 pm, [written](https://github.com/findastra/file-master/blob/main/scripts/Install-FileMaster.ps1) but not installed. **Should:** show every mass change before making it, with undo | 🟡 [Claude Code agent file-master](https://github.com/findastra/file-master/blob/main/agent/file-master.md) | ⏰ $\color{red}{\textsf{Weekly scan is written but not installed on the PC}}$ | |
| 13 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/findastra-discord-presence-20261012.png" width="40" alt=""> | **Discord Damsel** | registered | [findastra-discord-presence](https://github.com/findastra/findastra-discord-presence) | ✅ Discord | ✅ **Tools:** [OpenAI Discord Presence](https://github.com/findastra/findastra-discord-presence/tree/main/openai-discord-presence) and [Anthropic Discord Presence](https://github.com/findastra/findastra-discord-presence/tree/main/anthropic-discord-presence) tray apps. **Runs on its own:** start at sign-in, live while Codex or Claude Code runs. No inbox | — | 🚧 $\color{red}{\textsf{DM cleanup skill only on a side branch}}$ | |
| 14 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/portfolio-puffer-20261012.png" width="40" alt=""> | **Portfolio Puffer** | registered | [portfolio-puffer](https://github.com/findastra/portfolio-puffer) | — GitHub and LinkedIn (planned) | 🟡 **Tools:** [web app](https://github.com/findastra/portfolio-puffer/blob/main/portfolio-puffer-20261008.html). **Should:** draft weekly portfolio updates from what changed; publishing stays manual | — | | |
| 15 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/drum-dog-20261012.png" width="40" alt=""> | **Drum Dog** | registered | [drum-dog](https://github.com/findastra/drum-dog) | 🟡 Ableton Live (not found on the PC), Spotify | 🟡 **Tools:** [web app](https://github.com/findastra/drum-dog/blob/main/drum-dog-20261008.html). **Should:** save and sample music for Ableton Live; keep the release plan (album, DJ mixes, hosting) | — | 🧩 $\color{red}{\textsf{Ableton Live is not found on the Desktop PC}}$ | |
| 16 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/vscode-angel-20261012.png" width="40" alt=""> | **VSCode Angel** | registered | [vscode-angel](https://github.com/findastra/vscode-angel) | 🟡 VS Code, Visual Studio (not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/vscode-angel/blob/main/vscode-angel-20261008.html): records review findings, exports a worklist | — | | |
| 17 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/ghost-protocol-20261012.png" width="40" alt=""> | **Gone Ghost** | registered | [ghost-protocol](https://github.com/findastra/ghost-protocol) | ✅ Ghost Protocol (Astra's): [findastra.github.io/ghost-protocol](https://findastra.github.io/ghost-protocol/), the public security website | — Nothing of his own yet. **Should:** a daily website check and a monthly check of Astra's own security against its research | — | | Ghost Protocol - Website Audit & Updates |
| 18 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/project-parrot-20261012.png" width="40" alt=""> | **Project Parrot** | registered | [project-parrot](https://github.com/findastra/project-parrot) | — OneNote (not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/project-parrot/blob/main/project-parrot-20261008.html). **Should:** review OneNote weekly for project ideas and remind Astra to start them | — | | |
| 19 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/voicemeeter-bug-20261012.png" width="40" alt=""> | **Voicemeeter Bug** | registered | [voicemeeter-bug](https://github.com/findastra/voicemeeter-bug) | ✅ Voicemeeter Potato and its outputs A1 (CA-2890PRO speaker bar), A2 (Steam Streaming Speakers), A3 (Razer Kraken Ultimate) | ✅ **Tools:** [Windows app](https://github.com/findastra/voicemeeter-bug/blob/main/audio-recovery-20261008.cs). **Runs on its own:** watches for audio devices reconnecting and restarts Voicemeeter's audio engine; running on the PC now | — | | Voicemeeter Bug |
| 20 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/claude-bot-20261012.png" width="40" alt=""> | **Claude Bot** | pipeline | [claude-bot](https://github.com/findastra/claude-bot) | — Claude (not wired) | — Not built. **Should:** Claude's twin of ChatGPT's BSOD desktop pet: live Claude status in a bubble, and quick chat | — One dev skill ([skills/handoff](https://github.com/findastra/claude-bot/blob/main/skills/handoff/SKILL.md)) | 🔌 $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | Claude Bot |
| 21 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/rgbee-20261012.png" width="40" alt=""> | **RGBee** | pipeline | [rgbee](https://github.com/findastra/rgbee) | 🟡 MSI Center, Corsair iCUE, Razer Synapse, Logitech G HUB (installed, not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/rgbee/blob/main/rgbee-20261009.html). **Should:** plan and run lighting scenes on every RGB light | — | 🔌 $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | |
| 22 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/astras-gif-maker-20261012.png" width="40" alt=""> | **Gif Giraffe** | pipeline | [astras-gif-maker](https://github.com/findastra/astras-gif-maker) | ✅ Astra's GIF Maker ([web app](https://github.com/findastra/astras-gif-maker/blob/main/index.html)) | — Job still a placeholder | — | 🔌 $\color{red}{\textsf{PC folder is not connected to its GitHub repo}}$ | |
| 23 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/meme-fiend-20261012.png" width="40" alt=""> | **Meme Fiend** | pipeline | [meme-fiend](https://github.com/findastra/meme-fiend) | 🟡 Discord (not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/meme-fiend/blob/main/index.html); meme maker planned. **Should:** archive favourite memes, mostly from Discord; memes stay on the PC | — | | |
| 24 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/rift-rabbit-20261012.png" width="40" alt=""> | **Rift Rabbit** | pipeline | [rift-rabbit](https://github.com/findastra/rift-rabbit) | ✅ SteamVR, Meta Horizon Link, Virtual Desktop, the OVR tools, Space Calibrator, BS Manager and the rest of the vr-gaming folder | 🟡 **Tools:** [web app](https://github.com/findastra/rift-rabbit/blob/main/index.html). **Should:** prep and track VR software and performance before each session | — | | |
| 25 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/deck-duck-20261012.png" width="40" alt=""> | **Deck Duck** | pipeline | [deck-duck](https://github.com/findastra/deck-duck) | — Elgato Stream Deck (not installed) | 🟡 **Tools:** [web app](https://github.com/findastra/deck-duck/blob/main/index.html). **Should:** know what every Stream Deck button does on every profile | — | 🧩 $\color{red}{\textsf{Stream Deck software is not installed on the Desktop PC}}$ | Deck Duck |
| 26 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/mesh-moth-20261012.png" width="40" alt=""> | **Mesh Moth** | pipeline | [mesh-moth](https://github.com/findastra/mesh-moth) | 🟡 The Meshtastic node | 🟡 **Tools:** [web app](https://github.com/findastra/mesh-moth/blob/main/index.html). **Should:** manage the node's place in the mesh, health and messages | — | | |
| 27 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/fuzzboi-friend-20261012.png" width="40" alt=""> | **Fuzzboi Friend** | pipeline | [fuzzboi-friend](https://github.com/findastra/fuzzboi-friend) | ✅ Astra's Fuzzbois website ([findastra.github.io/fuzzbois](https://findastra.github.io/fuzzbois/)) and make-your-own-Fuzzboi site ([findastra.github.io/fuzzboi-friend](https://findastra.github.io/fuzzboi-friend/)) | — Nothing of his own yet. **Should:** an hourly check of the Fuzzbois website, shown in his mood | — | | Fuzzbois |
| 28 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/wifi-butterfly-20261012.png" width="40" alt=""> | **Wifi Butterfly** | pipeline | [wifi-butterfly](https://github.com/findastra/wifi-butterfly) | — Wi-Fi (not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/wifi-butterfly/blob/main/wifi-butterfly-20261009.html). Job not decided (kept separate from Mesh Moth and Packet Piranha) | — | | |
| 29 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/backup-beaver-20261012.png" width="40" alt=""> | **Backup Beaver** | pipeline | [backup-beaver](https://github.com/findastra/backup-beaver) | — The backup software (not named yet) | 🟡 **Tools:** [web app](https://github.com/findastra/backup-beaver/blob/main/index.html). **Should:** know when the last backup ran, where it is, and how to get to it | — | | |
| 30 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/patch-cat-20261012.png" width="40" alt=""> | **Patch Cat** | pipeline | [patch-cat](https://github.com/findastra/patch-cat) | — Whatever another pet asks about | 🟡 **Tools:** [web app](https://github.com/findastra/patch-cat/blob/main/index.html). Job not decided; in the architecture she diagnoses problems other pets ask about | — | | |
| 31 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/mail-snail-20261012.png" width="40" alt=""> | **Mail Snail** | pipeline | [mail-snail](https://github.com/findastra/mail-snail) | — Mail (not connected) | 🟡 **Tools:** [web app](https://github.com/findastra/mail-snail/blob/main/index.html). **Should:** a daily sweep that sorts and cleans up mail, always with Astra's OK first | — | | |
| 32 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/raspberry-berry-20261012.png" width="40" alt=""> | **Raspberry Pi** | pipeline | [raspberry-berry](https://github.com/findastra/raspberry-berry) | 🟡 The Raspberry Pi | 🟡 **Tools:** [web app](https://github.com/findastra/raspberry-berry/blob/main/index.html). Job not decided | — | 🏷️ $\color{red}{\textsf{Three spellings: Raspberry Pi, Raspberry Pie, raspberry-berry}}$ | |
| 33 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/mine-mole-20261012.png" width="40" alt=""> | **Mine Mole** | pipeline | [mine-mole](https://github.com/findastra/mine-mole) | 🟡 The crypto-mining program | 🟡 **Tools:** [web app](https://github.com/findastra/mine-mole/blob/main/mine-mole-20261009.html). **Should:** check daily whether mining is worth the power | — | 🖼️ $\color{red}{\textsf{No desktop art on GitHub, only draft art}}$ | |
| 34 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/chat-rat-20261012.png" width="40" alt=""> | **Chat Rat** | unregistered | [chat-rat](https://github.com/findastra/chat-rat) | 🟡 Claude, Codex, ChatGPT (their conversations) | — Not built (the repo has art only). **Should:** log every conversation Astra has with any agent on the PC | — | ❓ $\color{red}{\textsf{On the desktop but missing from the registry}}$ | |
| 35 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/spoonfed-20261012.png" width="40" alt=""> | **Spoonfed Sugarcube** | pipeline | [spoonfed](https://github.com/findastra/spoonfed) | ✅ Spoonfed (Astra's): the [restaurant-discovery app](https://github.com/findastra/spoonfed/tree/claude/rescue-spoonfed-app-20261012) for iOS, Android and web | — Nothing of its own yet | — | 🚧 $\color{red}{\textsf{App only on a rescue branch}}$ 🏷️ $\color{red}{\textsf{Repo spoonfed, folder spoonfed-sugarcube}}$ 🖼️ $\color{red}{\textsf{PC draft art differs from GitHub}}$ | |
| 36 | <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/platform-platypus-20261012.png" width="40" alt=""> | **Platform Platypus** | seed | none | — iPhone, Android, iPad and desktop browsers | 🟡 **Tools:** a local draft app on the PC. **Should:** check how a page looks and works on every device | — | 💻 $\color{red}{\textsf{Only on the PC, not on GitHub (card 010)}}$ | |

### Seeds: no Pet Program yet, so no number

| Icon | Pet | 1 Root Program(s) it will look after | What its Pet Program should do | Chat |
|---|---|---|---|---|
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/pole-puff-20261012.png" width="40" alt=""> | **Pole Puff** | [Astra's Infinite Pole](https://github.com/findastra/astras-infinite-pole) (VRChat world), VRChat, Unity, VR Pole Overlay | Look after the world; what it needs becomes Unity Unicorn build work. 🚧 $\color{red}{\textsf{Approved draft waits on a branch; repo not created}}$ | Astra's Infinite Pole - Video Player Screen Issues |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/piranesi-nessi-20261012.png" width="40" alt=""> | **Piranesi Nessi** | [Piranesi House](https://github.com/findastra/piranesi-house) (VRChat world), VRChat, Unity | Look after the world; what it needs becomes Unity Unicorn build work | |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/osc-sealion-20261012.png" width="40" alt=""> | **OSC Sealion** | OSCGoesBrrr, VRCFaceTracking, VRChat | Watch OSC packets live and find clashes when several apps share channels | OSC Sealion |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/procreate-panda-20261012.png" width="40" alt=""> | **Procreate Panda** | Procreate | Job not decided | |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/skill-scout-20261012.png" width="40" alt=""> | **Skill Scout** | Every assistant's AGENTS.md, CLAUDE.md and SKILL.md files | Track what changed, who changed it and why; daily summary | Skill Scout |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/photo-dodo-20261012.png" width="40" alt=""> | **Photo Dodo** | Saved pictures (with File Master and Backup Beaver) | Know where each picture is, what it shows and whether it is backed up | |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/video-vulture-20261012.png" width="40" alt=""> | **Video Vulture** | Saved videos (with File Master and Backup Beaver) | The same for videos | |
| <img src="https://raw.githubusercontent.com/findastra/astras-pet-os/main/art/icons/closet-cat-20261012.png" width="40" alt=""> | **Closet Cat** | The closet and favourite shops | What Astra owns and what goes together | |

## Errors

Not built yet is not an error. An error ($\color{red}{\textsf{red}}$) is something broken, missing
from GitHub, or out of step:
🏷️ name mismatch · 🔌 PC folder not connected to its GitHub repo · 💻 only on the PC, not on GitHub ·
🚧 stuck in an unmerged pull request or on a branch · ⏰ scheduled task not installed ·
❓ missing from the registry · 🖼️ art missing or different · 📦 code in the wrong repo ·
🧩 a Root Program it looks after is not installed

**Errors that affect every pet:**
- 📦 $\color{red}{\textsf{Double-clicking a registered desktop pet opens a copy of its app kept in the hub, not the Pet Program in its own repo.}}$ Two copies can drift apart.
- 🔌 $\color{red}{\textsf{Double-clicking a pipeline desktop pet only opens its GitHub page; no app is wired up.}}$
- 🏷️ $\color{red}{\textsf{New names and jobs from 2026-10-12 are in the registry, but each pet's own repo still has the old text.}}$ Each pet's chat updates its repo's `pet.json`.
- 🏷️ $\color{red}{\textsf{Two different handoff cards are numbered 010 (Platform Platypus on main, Pole Puff on its branch).}}$

## What this shows

- **Level 1 (Root Programs):** most pets know what they look after, but few are connected to it yet.
- **Level 2 (Pet Program):** 2 work fully and run on their own (#13 Discord Damsel, #19 Voicemeeter
  Bug). Most are a web app only. None has the inbox and saved state the architecture asks for.
- **Level 3 (Agentic Harness):** no pet has its own harness yet. Three borrow Claude Code (#3 Chip,
  #5 Unity Unicorn, #12 File Master). The shared harness (Astra Pet SDK) is Phase 5 of
  [docs/migration/PLAN.md](docs/migration/PLAN.md).
- "Web app only" means one HTML page in the pet's repo. Each needs a check of whether it does real
  work or only describes the pet; until then it stays 🟡.
- Program names invented on 2026-10-12 (Key Ring, Audio Rescue, The Barn and the rest) are retired:
  everything is named after its pet (Astra, 2026-10-13).
