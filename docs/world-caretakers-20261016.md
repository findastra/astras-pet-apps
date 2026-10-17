# World caretakers

By Astra; implemented with OpenAI Codex (GPT-6), 2026-10-16.

Door Dormouse's assigned program is **The Threshold**, a working browser planning program for **Liminal Doors**. The selected character direction is a sleepy dormouse with a prismatic key. Its native character art and nine moods are still pending. Piranesi Nessi's assigned program name is **Nessi's Ocean**, caring for Piranesi House. Pole Puff cares for Astra's Infinite Pole. These caretakers track worlds and their previews; Unity Unicorn owns reusable Unity tools.

Open `apps/the-threshold-20261016.html` or its System Map/catalog link. It connects to `apps/liminal-doors-20261016.html`, a preview website built from the existing 37-floor register and seven original concept plates. Both pages link to each other and to individual floor records. They also work on a static host; local and hosted browser storage are separate.

## Working behavior

- Preview gallery with search, four Frutiger Aero places, floor details, a random-door demonstration and return to the actual previous destination. This is a concept preview, not a playable VRChat world.
- Floor shortlist and owner-marked build status, persistent notes, bounded backup merge and export, and a manual Unity Unicorn request export. The request includes exact constraints and all selected floors.
- Read-only Unity project metadata selection. Only the display name and editor version are saved; no files are uploaded and no Unity process is controlled.
- Local tool power and maintenance controls. These affect browser actions only and do not represent Farm authorization or enrollment.
- Shared L3 bubble and chat shell. The Threshold explicitly shows disconnected and an empty seat until a real adapter exists.

The floor register preserves the pink booth, random forward travel with exact returns, unique hidden prismatic animals, sunset sandbar, bathtub/sponge, fairy lights, spiral stair, and unfinished reference requirements. The bubble chair must mold around a seated avatar. Its older static picture is not an accepted implementation.

## Build and data

Edit `worlds/` sources, then run `node scripts/build-world-caretaker-20261016.mjs`. The normal metadata build also regenerates both pages after shared page assembly. `pets.json` and `pet-programs.json` remain authoritative for registry and catalog changes; this prototype is a seed, not a newly enrolled animal.

Backlog key: `the-threshold-backlog`, schema 1. Import validates every floor and note before writing, merges notes by ID, retains current tool controls, and rejects payloads over 32 MB. This accommodates the supported 500 notes of up to 8,000 characters each, including JSON escaping. Unreadable saved data receives a separate recovery copy before a replacement can be saved; if that fails, the original remains intact.

The public downloadable conceptbook contains original generated plates only. The earlier reference imagebook containing third-party screenshots is ignored by Git. The hosted site uses the same original-art book; private reference material is not needed to run it.

## L3 activity and Flash Audit

`apps/pet-l3-activity-20261016.js` and its CSS define the mandatory yellow/green shared panel. `embed-l3-activity-20261016.mjs` embeds it without replacing host behavior. The normal stationery build uses the same embedding path. `sync-l3-activity-20261016.mjs --siblings` updates known local Pet Program entry pages explicitly.

The panel accepts bounded same-pet snapshots through `window.astraL3Activity.receive(...)` or the `astra-l3-activity` DOM event. It displays provider, session, timestamps and up to 80 recent events with text-only rendering. Disconnected, OFF, stale, error and review states are distinct. The panel itself makes no network calls and starts no agent. Same-page scripts are trusted host code; this display is not an authorization boundary.

Goldfish's README auditor adapts its real local harness snapshots. Other pages remain honestly disconnected until their own runtime adapter exists. Flash Audit **A52** requires the panel; source presence yields **Not verified**, never a runtime pass. Desktop/mobile appearance, real task updates, disconnect, stale feed and OFF behavior require their own evidence.

## Validation and remaining work

Core tests and Cage checks pass. Targeted runtime tests cover large backup export/import, malformed import preservation, corrupt storage recovery and failed recovery. Browser checks verified floor selection/status after reload, notes, OFF/ON controls, four Aero results, random travel and exact return, chat disconnection, cross-links and desktop rendering. A phone-width page was inspected during development; exact 390px override was unavailable in the final browser tool and is not certified.

Not implemented: native Door Dormouse pet/click gestures, protected enrollment, L3 chat, scheduled workers, live Unity execution, completed world scenes, deforming chair, ASMR inventory, VRChat upload or headset performance. The 37 concepts do not establish that 333 environments fit a practical world.
