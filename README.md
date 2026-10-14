# Astra's PetOS

[![Astra's PetOS System Map (3D PFD)](docs/system-map/system-map-20261013.png)](https://findastra.github.io/astras-pet-os/system-map-20261012.html)

**[Open the System Map (3D PFD)](https://findastra.github.io/astras-pet-os/system-map-20261012.html)**: opens in any browser, including iPad and iPhone.

*A pet app by Astra.*

This is the development home of **Astra's PetOS** (`ASTRAS_PET_OS`). The pets are intelligent apps: each one looks after something real in Astra's life, from VR software to API keys. The **Friendly Farmer** organizes the pets. **The Farm** is the native OS where they will live and run, and **the Kennel** is the community lab where other people's pets are built and adopted (both planned).

- **[Astra's PetOS System Map](system-map-20261012.html)** (the 3D PFD): every pet, program, model and device, and what flows between them.
- **[INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md)**: the four intelligence levels of every intelligent app (pet), and what each Pet Program has built of them.
- **[ASTRAS_PET_OS.md](ASTRAS_PET_OS.md)**: the architecture, with Astra's amendments at the top. The migration plan is [docs/migration/PLAN.md](docs/migration/PLAN.md).

![Every character in every mood](art/roster.png)

Every pet has the same nine moods (idle, blink, happy, curious, worried, sad, sick, alarmed, sleep). What each part of a pet app is called is in [PET-WORDS.md](PET-WORDS.md). Drawings are **drafts** unless their roster notes record Astra's approval.

## Intelligence levels and Pet Program numbers

Every intelligent app (also known as the **pet**) has four intelligence levels. Full definitions and every pet's detail: [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md).

| Level | Name | What it is |
|---|---|---|
| 1 | **Root Program(s)** | The external programs the pet executes and looks after. Several pets can share one Root Program. |
| 2 | **Pet Program** | The alive, intelligent part, and the pet itself: generates tools for and manages the runtimes of its Root Programs, has its own features, and decides when to escalate to level 3: calling an AI into its Agentic Harness to solve outside problems, change designs on GitHub and make troubleshooting decisions. |
| 3 | **Agentic Harness** | Called by the Pet Program or the Human. An AI model (Anthropic, OpenAI or other) is seated in it to form the **Agent**: an Agentic Harness before it is seated, an Agent while seated. |
| 4 | **Human** | You: enter information, approve and decide. |

Pet Programs are serialized as they are created: every one has a **Pet Program #**, given in creation order and kept for life (never reused, even when a pet is renamed, retired, or later moves between the Kennel and the Farm). 1 to 36 were numbered from the git history on 2026-10-13; a seed gets the next number when its program is created. ✅ built · 🟡 partly there · — not built.

<!-- pet-programs:start (generated from pets.json pet_programs by scripts/update-readme.mjs; do not edit by hand) -->
| Pet Program # | Pet | Kind | Created | 1 Root Program(s) | 2 Pet Program | 3 Agentic Harness |
|---|---|---|---|---|---|---|
| 1 | **Friendly Farmer** | registered | 2026-10-07 | ✅ | 🟡 | — |
| 2 | **GitHub Goldfish** | registered | 2026-10-07 | ✅ | 🟡 | — |
| 3 | **Chip** | registered | 2026-10-07 | ✅ | 🟡 | 🟡 |
| 4 | **API Fairy** | registered | 2026-10-07 | — | 🟡 | — |
| 5 | **Unity Unicorn** | registered | 2026-10-07 | ✅ | 🟡 | 🟡 |
| 6 | **Python Panther** | registered | 2026-10-07 | ✅ | 🟡 | — |
| 7 | **Astra Wisp** | registered | 2026-10-07 | ✅ | 🟡 | — |
| 8 | **Health Hummy** | registered | 2026-10-07 | — | 🟡 | — |
| 9 | **Finance Finch** | registered | 2026-10-07 | — | 🟡 | — |
| 10 | **Mommy's Mommies** | registered | 2026-10-07 | 🟡 | 🟡 | — |
| 11 | **Patty** | registered | 2026-10-07 | ✅ | — | — |
| 12 | **File Master** | registered | 2026-10-07 | ✅ | 🟡 | 🟡 |
| 13 | **Discord Damsel** | registered | 2026-10-07 | ✅ | ✅ | — |
| 14 | **Portfolio Puffer** | registered | 2026-10-08 | — | 🟡 | — |
| 15 | **Drum Dog** | registered | 2026-10-08 | 🟡 | 🟡 | — |
| 16 | **VSCode Angel** | registered | 2026-10-08 | 🟡 | 🟡 | — |
| 17 | **Gone Ghost** | registered | 2026-10-08 | ✅ | — | — |
| 18 | **Project Parrot** | registered | 2026-10-08 | — | 🟡 | — |
| 19 | **Voicemeeter Bug** | registered | 2026-10-08 | ✅ | ✅ | — |
| 20 | **Claude Bot** | pipeline | 2026-10-09 | — | — | — |
| 21 | **RGBee** | pipeline | 2026-10-09 | 🟡 | 🟡 | — |
| 22 | **Gif Giraffe** | pipeline | 2026-10-09 | ✅ | — | — |
| 23 | **Meme Fiend** | pipeline | 2026-10-09 | 🟡 | 🟡 | — |
| 24 | **Rift Rabbit** | pipeline | 2026-10-09 | ✅ | 🟡 | — |
| 25 | **Deck Duck** | pipeline | 2026-10-09 | — | 🟡 | — |
| 26 | **Mesh Moth** | pipeline | 2026-10-09 | 🟡 | 🟡 | — |
| 27 | **Fuzzboi Friend** | pipeline | 2026-10-09 | ✅ | — | — |
| 28 | **Wifi Butterfly** | pipeline | 2026-10-09 | — | 🟡 | — |
| 29 | **Backup Beaver** | pipeline | 2026-10-09 | — | 🟡 | — |
| 30 | **Patch Cat** | pipeline | 2026-10-09 | — | 🟡 | — |
| 31 | **Mail Snail** | pipeline | 2026-10-09 | — | 🟡 | — |
| 32 | **Raspberry Pi** | pipeline | 2026-10-09 | 🟡 | 🟡 | — |
| 33 | **Mine Mole** | pipeline | 2026-10-09 | 🟡 | 🟡 | — |
| 34 | **Chat Rat** | unregistered | 2026-10-09 | 🟡 | — | — |
| 35 | **Spoonfed Sugarcube** | pipeline | 2026-10-11 | ✅ | — | — |
| 36 | **Platform Platypus** | seed (draft program) | 2026-10-11 | — | 🟡 | — |
<!-- pet-programs:end -->

Seeds (Pole Puff, Procreate Panda, Skill Scout, OSC Sealion, Piranesi Nessi, Photo Dodo, Video Vulture, Closet Cat) and the roadmap pets have no Pet Program yet, so no number.

## Who lives here

<!-- pets:start (generated from pets.json by scripts/update-readme.mjs; do not edit by hand) -->
| # | Pet | Role | Status | What it does | Get it |
|---|---|---|---|---|---|
| 1 | **[Friendly Farmer](https://github.com/findastra/astras-pet-os)** | host | growing | Organizes the pets (intelligent apps). His daily rounds keep every pet’s status and mood, the roster, the System Map and the profile README up to date, and list what needs Astra. The Farmer’s desk opens every app. He will run the Farm, the native OS of Astra’s PetOS. | [Open app](apps/astras-pet-apps-20261008.html) · [Download ZIP](https://github.com/findastra/astras-pet-os/archive/refs/heads/main.zip) |
| 2 | **[GitHub Goldfish](https://github.com/findastra/github-goldfish)** | pet | growing | Swims through every public word on a GitHub account and flags document-control, blatant, organizational and systemic errors. | [Open app](apps/github-goldfish-20261008.html) · [Download ZIP](https://github.com/findastra/github-goldfish/archive/refs/heads/main.zip) |
| 3 | **Chip** | pet | hatching | Reports the health of Data Dealer, Astra’s large and important data project: its site, data, services and open work, so she sees at a glance what needs her. | [Open app](apps/data-dealer-20261008.html) · private repo |
| 4 | **[API Fairy](https://github.com/findastra/api-fairy)** | pet | growing | Keeps notes about your API keys, never the keys themselves: where each lives and what uses it, which keys have gone stale, and which new keys to get. Lives in the corner of the Windows desktop. | [Open app](apps/api-fairy-20261008.html) · [Download ZIP](https://github.com/findastra/api-fairy/archive/refs/heads/main.zip) |
| 5 | **[Unity Unicorn](https://github.com/findastra/unity-unicorn)** | pet | hatching | A local Unity and VRChat desk with avatar plans, 26 dated tools, open-arch audits, concise summaries and evidenced execution history. | [Open app](apps/unity-unicorn-20261008.html) · [Download ZIP](https://github.com/findastra/unity-unicorn/archive/refs/heads/main.zip) |
| 6 | **[Python Panther](https://github.com/findastra/learn-python)** | pet | hatching | A Python practice desk with short output exercises, answer checks and saved progress alongside the original lessons. | [Open app](apps/learn-python-20261008.html) · [Download ZIP](https://github.com/findastra/learn-python/archive/refs/heads/main.zip) |
| 7 | **[Astra Wisp](https://github.com/findastra/vrchat-ai-astra)** | pet | hatching | Watches the health of VRChat AI Astra, both while she runs and while she is being worked on offline, so problems show up before a session. | [Open app](apps/vrchat-ai-astra-20261008.html) · [Download ZIP](https://github.com/findastra/vrchat-ai-astra/archive/refs/heads/main.zip) |
| 8 | **[Health Hummy](https://github.com/findastra/health-hummy)** | pet | hatching | Personal health tracker: weight lifting by body group and sets, cardio, and pole plans. Your data stays on your PC and is never committed. | [Open app](apps/health-hummy-20261008.html) · [Download ZIP](https://github.com/findastra/health-hummy/archive/refs/heads/main.zip) |
| 9 | **[Finance Finch](https://github.com/findastra/finance-finch)** | pet | hatching | Personal finance tracker across your bank, savings and investment accounts. It reads balances and never moves money. A yellow canary. Your data stays on your PC and is never committed. | [Open app](apps/finance-finch-20261008.html) · [Download ZIP](https://github.com/findastra/finance-finch/archive/refs/heads/main.zip) |
| 10 | **[Mommy's Mommies](https://github.com/findastra/mommys)** | pet | hatching | A local planning room for Mommy's classes and events, with session details, readiness and notes. Calendar and Discord connections are planned. | [Open app](apps/mommys-20261008.html) · [Download ZIP](https://github.com/findastra/mommys/archive/refs/heads/main.zip) |
| 11 | **[Patty](https://github.com/findastra/paper-girl)** | pet | growing | Runs Paper Girl, a free science discovery desk: real research, publisher explanations and fresh articles. | [Open app](https://findastra.github.io/paper-girl/) · [Download ZIP](https://github.com/findastra/paper-girl/archive/refs/heads/main.zip) |
| 12 | **[File Master](https://github.com/findastra/file-master)** | pet | growing | Organizes your files and finds systemic errors. Shows every mass change before making it, with undo. Opens or edits programs only after Test Tortoise tests the change and Gatekeeper Goddess and Astra approve it (planned). | [Open app](apps/file-master-20261008.html) · [Download ZIP](https://github.com/findastra/file-master/archive/refs/heads/main.zip) |
| 13 | **[Discord Damsel](https://github.com/findastra/findastra-discord-presence)** | pet | hatching | Opens the installed OpenAI and Anthropic Discord presence controls, with a manual setup checklist. | [Open app](apps/findastra-discord-presence-20261008.html) · [Download ZIP](https://github.com/findastra/findastra-discord-presence/archive/refs/heads/main.zip) |
| 14 | **[Portfolio Puffer](https://github.com/findastra/portfolio-puffer)** | pet | hatching | Drafts and tracks portfolio updates locally. GitHub and LinkedIn connections are planned; publishing is manual. | [Open app](apps/portfolio-puffer-20261008.html) · [Download ZIP](https://github.com/findastra/portfolio-puffer/archive/refs/heads/main.zip) |
| 15 | **[Drum Dog](https://github.com/findastra/drum-dog)** | pet | hatching | Saves and samples music found online for Ableton Live, and plans releases: the first album, DJ mixes and where each one is hosted. Ableton Live connections are planned. | [Open app](apps/drum-dog-20261008.html) · [Download ZIP](https://github.com/findastra/drum-dog/archive/refs/heads/main.zip) |
| 16 | **[VSCode Angel](https://github.com/findastra/vscode-angel)** | pet | hatching | Records code-review findings and next steps, then exports a Markdown worklist. Editor connections are planned. | [Open app](apps/vscode-angel-20261008.html) · [Download ZIP](https://github.com/findastra/vscode-angel/archive/refs/heads/main.zip) |
| 17 | **[Gone Ghost](https://github.com/findastra/ghost-protocol)** | pet | hatching | Watches the public Ghost Protocol website and checks Astra’s own security against its research: a personal cybersecurity checklist and the steps she has completed. | [Open app](https://findastra.github.io/ghost-protocol/) · [Download ZIP](https://github.com/findastra/ghost-protocol/archive/refs/heads/main.zip) |
| 18 | **[Project Parrot](https://github.com/findastra/project-parrot)** | pet | hatching | Planned: periodically reviews OneNote for new project ideas and reminds Astra to start them. | [Open app](apps/project-parrot-20261008.html) · [Download ZIP](https://github.com/findastra/project-parrot/archive/refs/heads/main.zip) |
| 19 | **Voicemeeter Bug** | pet | growing | A small Windows desktop pet for restarting Voicemeeter's audio engine when audio needs repair. Its browser page explains how to open the installed app. | [Open app](apps/voicemeeter-bug-20261008.html) · private repo |
<!-- pets:end -->

The generated count and running list, with every mood of every character, are in [ROSTER.md](ROSTER.md). Gone Ghost's website, [Ghost Protocol](https://findastra.github.io/ghost-protocol/), is already live; Astra approved the ghost artwork on 2026-10-08.

## How the pets connect

**[Astra's PetOS System Map](https://findastra.github.io/astras-pet-os/system-map-20261012.html)** is a 3D map of Astra's PetOS: every pet, seed and roadmap pet, the AI models, the infrastructure, the real programs they manage, and what flows between them. Open it in a browser (it loads three.js from a CDN, so it needs the internet). Search for any node; click a sphere for its job and connections, or click a line for everything that flows both ways between its two ends. Pet-to-pet links come from `relations` in [pets.json](pets.json); everything else comes from [system-map.json](system-map.json). `npm run build` rebuilds the page. The same links as a flat chart are in [RELATIONS.md](RELATIONS.md).

## Run it

**See the pets on your desktop:** the desktop pets and the tray Star run from `bin/` in this repo on Astra's PC; Startup Star (its own project on Astra's PC, not on GitHub yet) makes them open with a click and start at sign-in. Double-click a pet to open its app.

**See everything at once:** open the [System Map](system-map-20261012.html) in a browser (it loads three.js from a CDN, so it needs the internet).

**Get it:** the [astras-pet-os repository](https://github.com/findastra/astras-pet-os) is public. It was called `astras-pet-apps` until 2026-10-12; old links redirect.

```powershell
git clone https://github.com/findastra/astras-pet-os
```

**Source releases:** the [repository release ledger](docs/repository-releases-20261008.json) records exact source tags, commit hashes and verified uploads. A source release is separate from a hosted app.

**Open an app:** double-click a pet or use its **Open app** button. Gone Ghost, Patty and Chip open their existing hosted apps (Ghost Protocol, Paper Girl, Data Dealer). Every registered pet also has a dated web app in `apps/`: the original app where it is portable, and a web stand-in where the original is a Windows app or still planned. Local form data stays in that browser.

**The Cage is retired.** `cage.html`, the old browser page where the pets roamed, still opens but gets no new features. It goes away when the Farm replaces it (Phase 3 of the [migration plan](docs/migration/PLAN.md)).

**For builders** (Node 20 or newer; none of this is needed to just look):

```bash
npm run build    # convert existing sheets, rebuild the frames, ROSTER.md, the table above and the System Map
npm run build -- --metadata-only  # refresh registry and docs using already-built frames
node scripts/build-interfaces-20261008.mjs  # refresh the Farmer's desk; preserve published app copies
npm run check    # validate pets.json, the table, and that every pet has art
npm test         # tests
```

To deliberately rebuild another app, name it with `node scripts/build-interfaces-20261008.mjs --refresh-existing file-master` (replace the repo name as needed). Review the change and publish it under a new immutable source tag before updating the release ledger.

## Add a pet

Read [PET-FILES.md](PET-FILES.md). Add an entry to `pets.json` and a prompt to `scripts/generate-pets.mjs`, supply its 3×3 mood sheet, then run `npm run build`. The count, table, roster and page update together. Set `asset_date` for new pets so the sheet and mood filenames carry the owner's date. Building existing sheets is local and does not generate paid images. The local GitHub Goldfish project is intended to audit whether pet repos have their files and registry entries.

## Limits

What is not done, plainly:

- **The Farm and the Kennel are planned, not built.** So are the shared AI harness and most pets' runtimes: see [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md) for exactly what each pet has.
- **Art approval is recorded per character in the roster.** The ghost is approved; other drawings remain drafts unless noted. Chip uses the actual Data Dealer drawing code and original palette inside the original yellow pocket shell.
- Unity Unicorn, Health Hummy, Finance Finch and the other browser desks support local records and exports. They do not connect to Unity, health services, bank accounts or other external services yet.
- Pets' moods come from the Farmer's daily rounds, not yet from live status in their apps.
- Gone Ghost offers a checklist. He does not scan the PC, monitor threats, or read checklist progress yet.
- Project Parrot stores manually entered ideas and due dates. OneNote scanning and background reminders are not connected.
- BSOD, ChatGPT's own desktop pet, is never copied into this repo.

## Credits

Made by Astra. Astra's PetOS restructuring, the System Map and the intelligence levels with Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-12. Built with Claude Sonnet 5.5 (`claude-sonnet-5-5`) on 2026-10-07. Ghost Protocol and dated asset support added with OpenAI Codex (GPT-6) on 2026-10-08. MIT licensed.
