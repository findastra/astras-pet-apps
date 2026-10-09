# Astra's Pet Apps

*A pet app by Astra.*

This is **the Cage**, where Astra keeps her pet apps, and it is a pet app itself: the **Friendly Farmer** is its host. He stands outside the Cage and opens or closes the door when you click him. Double-click him to open the Farmer’s desk, browse all 18 apps and save a personal follow-up list.

![Every character in every mood](art/roster.png)

The pets move by their kind. The birds (Health Hummy, Finance Finch and Project Parrot), API Fairy, Astra Wisp, VSCode Angel and Ghost Protocol keep to the sky, the GitHub Goldfish swims at mid height, and everyone else walks the floor: the human pets hop as they go, and Python Panther runs up the walls and leaps off. The birds fly in a loose V and chase the goldfish; API Fairy, Unity Unicorn and Astra Wisp hang out together, as do Paper Girl, File Master and Chip; Drum Dog and Python Panther play tag. They move slowly inside the Cage and freely once the door is open and they have the browser window. The rules live in `cage_life` in `pets.json`, so a new pet joins in through its `kind` ([how pets move](PET-FILES.md#how-pets-move-in-the-cage)).

Click a pet to cheer it up; double-click a pet to open its application interface. Each has the same set of moods (idle, blink, happy, curious, worried, sad, sick, alarmed, sleep); play never changes a pet's mood. Drawings are **drafts** unless their roster notes record Astra's approval.

## Who lives here

<!-- pets:start (generated from pets.json by scripts/update-readme.mjs; do not edit by hand) -->
| Pet | Role | Status | What it does | Get it |
|---|---|---|---|---|
| **Friendly Farmer** | host | growing | Hosts the Cage and opens or closes its door. The Farmer’s desk opens all apps and keeps a personal follow-up list. | [Open app](apps/astras-pet-apps-20261008.html) · private repo |
| **GitHub Goldfish** | pet | growing | Swims through every public word on a GitHub account and flags document-control, blatant, organizational and systemic errors. | [Open app](apps/github-goldfish-20261008.html) · private repo |
| **Chip** | pet | hatching | Data Dealer's pixel twin. | [Open app](apps/data-dealer-20261008.html) · private repo |
| **API Fairy** | pet | growing | Lives in the corner of the Windows desktop and keeps notes about your API keys, never the keys themselves. | [Open app](apps/api-fairy-20261008.html) · private repo |
| **Unity Unicorn** | pet | hatching | A local planning desk for Unity and VRChat projects: tasks, scene notes and manual status tracking. | [Open app](apps/unity-unicorn-20261008.html) · private repo |
| **[Python Panther](https://github.com/findastra/learn-python)** | pet | hatching | A Python practice desk with short output exercises, answer checks and saved progress alongside the original lessons. | [Open app](apps/learn-python-20261008.html) · [Download ZIP](https://github.com/findastra/learn-python/archive/refs/heads/main.zip) |
| **[Astra Wisp](https://github.com/findastra/vrchat-ai-astra)** | pet | hatching | Represents VRChat AI Astra, the planned bridge that brings Astra into VRChat. Its pet-app integration remains unfinished. | [Open app](apps/vrchat-ai-astra-20261008.html) · [Download ZIP](https://github.com/findastra/vrchat-ai-astra/archive/refs/heads/main.zip) |
| **Health Hummy** | pet | hatching | Personal health tracker. Your data stays on your PC and is never committed. | [Open app](apps/health-hummy-20261008.html) · private repo |
| **Finance Finch** | pet | hatching | Personal finance tracker. A yellow canary. Your data stays on your PC and is never committed. | [Open app](apps/finance-finch-20261008.html) · private repo |
| **Mommy's Mommies** | pet | hatching | A local planning room for Mommy's classes and events, with session details, readiness and notes. Calendar and Discord connections are planned. | [Open app](apps/mommys-20261008.html) · private repo |
| **[Paper Girl](https://github.com/findastra/paper-girl)** | pet | growing | A free science discovery desk: real research, publisher explanations and fresh articles. | [Open app](https://findastra.github.io/paper-girl/) · [Download ZIP](https://github.com/findastra/paper-girl/archive/refs/heads/main.zip) |
| **[File Master](https://github.com/findastra/file-master)** | pet | growing | Reviews a Windows PC and prepares cleanup plans with undo. Its browser companion imports a plan for review; original scripts run changes separately. | [Open app](apps/file-master-20261008.html) · [Download ZIP](https://github.com/findastra/file-master/archive/refs/heads/main.zip) |
| **[Discord Damsel](https://github.com/findastra/findastra-discord-presence)** | pet | hatching | Opens the installed OpenAI and Anthropic Discord presence controls, with a manual setup checklist. | [Open app](apps/findastra-discord-presence-20261008.html) · [Download ZIP](https://github.com/findastra/findastra-discord-presence/archive/refs/heads/main.zip) |
| **Portfolio Puffer** | pet | hatching | Drafts and tracks portfolio updates locally. GitHub and LinkedIn connections are planned; publishing is manual. | [Open app](apps/portfolio-puffer-20261008.html) · private repo |
| **Drum Dog** | pet | hatching | Keeps track ideas, sample references, permissions and session notes locally. Ableton Live connections are planned. | [Open app](apps/drum-dog-20261008.html) · private repo |
| **VSCode Angel** | pet | hatching | Records code-review findings and next steps, then exports a Markdown worklist. Editor connections are planned. | [Open app](apps/vscode-angel-20261008.html) · private repo |
| **[Ghost Protocol](https://github.com/findastra/ghost-protocol)** | pet | hatching | A personal cybersecurity checklist for reviewing your own security habits and tracking the steps you complete. | [Open app](https://findastra.github.io/ghost-protocol/) · [Download ZIP](https://github.com/findastra/ghost-protocol/archive/refs/heads/main.zip) |
| **Project Parrot** | pet | hatching | Planned: periodically reviews OneNote for new project ideas and reminds Astra to start them. | [Open app](apps/project-parrot-20261008.html) · private repo |
<!-- pets:end -->

The generated count and running list, with every mood of every character, are in [ROSTER.md](ROSTER.md). Ghost Protocol's [personal cybersecurity checklist](https://findastra.github.io/ghost-protocol/) is already live; Astra approved its ghost artwork on 2026-10-08.

## Run it

**See the Cage:** open [cage.html](cage.html) in any browser. No install, no network, no build step. It also works when you double-click it.

**Get it:** the [Astra's Pet Apps repository](https://github.com/findastra/astras-pet-apps) is private. Sign in with a collaborator account. Source upload, the version tag and hosted deployment are tracked in the [publication record](docs/publications-20261008.md).

Once source has been pushed, collaborators can use **Code, Download ZIP**, save it as `astras-pet-apps-20261008.zip`, unzip it and double-click `cage.html`. Authenticated Git also works:

```powershell
git clone https://github.com/findastra/astras-pet-apps
```

**Source releases:** the [repository release ledger](docs/repository-releases-20261008.json) records exact source tags, commit hashes, private access and verified uploads for all 18 entries. A source release is separate from a hosted app.

**Get a pet:** each pet's registry entry identifies its intended app repository. The table links public repos, labels private repos, and says "not on GitHub yet" for projects without a confirmed repo. Several apps and their integrations remain planned.

**Open an interface:** double-click a pet or use its **Open app** button. Ghost Protocol, Paper Girl and Data Dealer open their existing hosted interfaces. Every pet also has a dated local interface in `apps/`: original applications where portable, and useful browser companions where the original app is native or still planned. Local form data stays in that browser. A browser companion does not start native programs or establish an integration by itself.

**Optional Windows Farmer:** after extracting the download, run [start-farmer-dock-20261008.cmd](start-farmer-dock-20261008.cmd) for the separate desktop companion. See [desktop Farmer instructions](docs/farmer-dock-20261008.md) for positioning and controls.

**Hide or show everyone:** the egg in the bottom-left corner of the page hides every pet, the Cage and the Farmer, and brings them back. Keyboard: `Alt`+`P`. The choice is remembered in that browser.

**For builders** (Node 20 or newer; none of this is needed to just look):

```bash
npm run build    # convert existing sheets, rebuild cage-data.js, ROSTER.md and the table above
npm run build -- --metadata-only  # refresh registry and docs using already-built frames
node scripts/build-interfaces-20261008.mjs  # refresh the Farmer desk; preserve published app copies
npm run check    # validate pets.json, the table, and that every pet has art
npm test         # tests
```

To deliberately rebuild another companion, name it with `node scripts/build-interfaces-20261008.mjs --refresh-existing file-master` (replace the repo name as needed). Review the change and publish it under a new immutable source tag before updating the release ledger. Default generation preserves published interfaces and their source links.

## Ideas for the hide/show button

The egg is the first version. Other ideas, if it should become a real desktop overlay later:

- **The egg** (built): cracked open with a face when pets are out, whole and sleeping when hidden. Fits hatching, growing, grown.
- **The brass key**: turn it to lock everyone away, turn it back to let them out.
- **The Farmer's hat**: tip it to send everyone to bed; tip it again to bring them back.
- **A moon**: bedtime, where every pet falls asleep first and then fades.
- **A system-tray icon plus a hotkey** (boss key): the quietest, and the only one that works over other programs. Needs a small Windows host app, which does not exist yet.

## Add a pet

Read [PET-FILES.md](PET-FILES.md). Add an entry to `pets.json`, including the `kind` that decides how it moves, and a prompt to `scripts/generate-pets.mjs`, supply its 3×3 mood sheet, then run `npm run build`. The count, table, roster and page update together. Set `asset_date` for new pets so the sheet and mood filenames carry the owner's date. Building existing sheets is local and does not generate paid images. The local GitHub Goldfish project is intended to audit whether pet repos have their files and registry entries.

## Limits

What is not done, plainly:

- **The source destination is a private GitHub repository; hosted deployment is pending.** The Cage works locally. Source upload and the release tag are tracked separately in the publication record. Some underlying apps already have public repositories; a repo does not mean its pet integration is complete.
- **The Cage pets roam the browser window.** The optional Windows Farmer is a separate desktop companion; it does not put the whole herd over other programs.
- **Art approval is recorded per character in the roster.** Ghost Protocol is approved; other drawings remain drafts unless noted. The Farmer has visible blond hair and assorted fruit and vegetables across his moods, as requested. Chip uses the actual Data Dealer drawing code and original palette inside the original yellow pocket shell.
- Unity Unicorn, Health Hummy, Finance Finch and the other new browser desks support local records and exports. They do not connect to Unity, health services, bank accounts or other external services.
- Every pet opens an application interface, but Cage moods do not yet receive live status from the apps. Local browser companions distinguish manual records from connected services.
- Ghost Protocol offers a checklist. Its ghost does not scan the PC, monitor threats, or read checklist progress.
- Project Parrot (formerly Project Pal) stores manually entered ideas and due dates, with reminders while its page is open. OneNote scanning and background reminders are not connected.
- BSOD can visit as an optional local guest using a sprite sheet supplied by the owner. The guest does not sync with the ChatGPT desktop pet, and built-in pet artwork is excluded from the repository and deployment.
- With *reduced motion* turned on in your system, the pets stay put.

## Credits

Made by Astra. Built with Claude Sonnet 5.5 (`claude-sonnet-5-5`) on 2026-10-07. Ghost Protocol and dated asset support added with OpenAI Codex (GPT-6) on 2026-10-08. Cage movement by kind added with Claude Opus 5.5 (`claude-opus-5-5`) on 2026-10-09. MIT licensed.
