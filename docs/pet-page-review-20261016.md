# Pet page review (Astra's layout, 2026-10-16)

*Each pet's page now follows the layout in [PET-PROGRAM-FRAMEWORK.md](../PET-PROGRAM-FRAMEWORK.md), section 3: cyberhome, title with version and date, quick summary, intelligence-level boxes and the chat button. This review lists what each pet would show in its L1 and L2 boxes, using today's records. Claude Opus 5.5 (`claude-opus-5-5`).*

## What every pet still needs

1. **An `intelligence_levels` block in its own `pet.json`.** No pet has one yet, so this review is pieced together from
   INTELLIGENCE-LEVELS.md, the pet.json tool lists and each repo's `skills/` folder.
2. **A version and date** (`V<semver> // <YYYYMMDD>`) for the title.
3. **A home name**: 45 pets still have none (see [naming-audit-20261016.md](naming-audit-20261016.md)). Their title
   shows `pet-program-#` until one is chosen.
4. **A cyberhome.** Chat Rat's is the only one built; the real desktop pet docking into it is still pending.
5. **The paired lights on every item**, which have to actually work (Flash Audit A48), not just be drawn.

Only 34 of 82 pets have anything recorded for L1 at all. Most seeds and roadmap pets start empty, which is
honest: missing programs are not errors.

## Per pet (from today's records)

| # | Pet | Home | L1 3rd party programs | L1 native programs | L1 tools | L2 tricks |
|---|---|---|---|---|---|---|
| 1 | Friendly Farmer | The Farm | — | — | System Map, Startup Star, daily rounds, profile round, pet-finder, broken-tools-on-the-farm | pet-organizer, pet-finder, dev-mindset, farm-security, new-pet-or-tool, handoff |
| 2 | GitHub Goldfish | GitHub Aquarium | GitHub | — | github-auditor, naming-corrections, never-say-checker, report-exporter (Codex branch) | flash-audit (Codex branch) |
| 3 | Chip | Data Dealer | — | Data Dealer dashboard and site | — | provenance-manifest, weekly-brief, handoff |
| 4 | API Fairy | API Fairy Ring | — | — | api-fairy-mushroom-circle | — |
| 5 | Unity Unicorn | Unity Stable | Unity, VRChat Creator Companion, Blender | Unity Unicorn Icon (sketch), Piranesi House | neck-blender, marble-carver, masonry-structural-audit, no-windows-audit, run-unity-tool (+8 in draft PR #1); sketch: copyright-collector, copyright-auditor | sketch: weekly-update-from-friendly-farmer, weekly-copyright-auditor |
| 6 | Python Panther | Python Jungle | — | — | — | — |
| 7 | Astra Wisp | AI Astra | VRChat | AI Astra desktop app | — | — |
| 8 | Health Hummy | The Nectar Nest | — | — | — | — |
| 9 | Finance Finch | Nest Egg | — | — | — | — |
| 10 | Mommy's Mommies | Mommy’s Green Room | — | Mommy's website | — | — |
| 11 | Patty | Paper Girl | — | Paper Girl site | — | — |
| 12 | File Master | File Kingdom | Everything, SpaceSniffer | — | repo-catcher, new-programs-watch, everything-search, mass-delete | — |
| 13 | Discord Damsel | Discord Tower | Discord | OpenAI and Anthropic Discord Presence | — | — |
| 14 | Portfolio Puffer | Iced Out Iceberg | — | — | — | — |
| 15 | Drum Dog | Bass & Biscuits | Ableton Live, Spotify | — | — | — |
| 16 | VSCode Angel | Halo List | VS Code, Visual Studio | — | — | — |
| 17 | Gone Ghost | Am I a Ghost? | — | Ghost Protocol site | — | — |
| 18 | Project Parrot | Idea Perch | OneNote | — | — | — |
| 19 | Voicemeeter Bug | Audio Rescue | Voicemeeter Potato | Voicemeeter Bug app | — | — |
| 20 | Sugarcube | Spoonfed | — | Spoonfed app | — | — |
| 21 | Claude Bot | Claude Dock | — | — | — | handoff |
| 22 | RGBee | Light Hive | MSI Center, Corsair iCUE, Razer Synapse, Logitech G HUB | — | — | — |
| 23 | Mine Mole | Crypto Burrow | the crypto-mining program | — | — | — |
| 24 | Mail Snail | Mail Shell | — | — | — | — |
| 25 | Patch Cat | The Litter Box | — | — | — | — |
| 26 | Meme Fiend | Cursed Archive | Discord | — | — | — |
| 27 | Gif Giraffe | Astra's GIF Maker | — | Astra's GIF Maker | — | — |
| 28 | Backup Beaver | Backup Dam | — | — | — | — |
| 29 | Rift Rabbit | Wonderland Launchpad | SteamVR, Meta Horizon Link, Virtual Desktop, the OVR tools, Space Calibrator, BS Manager and the rest of the v | — | — | — |
| 30 | Fuzzboi Friend | — | — | Fuzzbois site | — | — |
| 31 | Wifi Butterfly | — | — | — | — | — |
| 32 | Deck Duck | — | Elgato Stream Deck | — | — | — |
| 33 | Mesh Moth | — | Meshtastic | — | — | — |
| 34 | Raspberry Pi Berry | Raspberry Pi Maker | the Raspberry Pi itself | — | — | — |
| 35 | Chat Rat | — | — | chat library and dashboard | save-missing-chats, missed-* searches | save-chats, missed-search |
| 36 | Platform Platypus | — | — | page checker site | — | — |
| 37 | Dubstep Gunsmith | Dubstep Armory | — | Dubstep Armory catalog site | — | — |
| 38 | Pole Puff | — | VRChat, Unity, VR Pole Overlay | Astra's Infinite Pole | — | — |
| 39 | Procreate Panda | — | Procreate | — | — | — |
| 40 | Skill Scout | — | — | — | — | — |
| 41 | OSC Sealion | — | OSCGoesBrrr, VRCFaceTracking, VRChat | — | — | — |
| 42 | Piranesi Nessi | Nessi's Ocean | VRChat, Unity | Piranesi House | — | — |
| 43 | Photo Dodo | — | — | — | — | — |
| 44 | Video Vulture | — | — | — | — | — |
| 45 | Closet Cat | — | — | — | — | — |
| 46 | Gatekeeper Goddess | Iron Gates | — | — | — | — |
| 47 | Queue Quokka | — | — | — | — | — |
| 48 | Log Lynx | — | — | — | — | — |
| 49 | Server Salamander | — | — | — | — | — |
| 50 | Docker Dragon | — | — | — | — | — |
| 51 | Test Tortoise | — | — | — | — | — |
| 52 | Token Toucan | — | — | — | — | — |
| 53 | Packet Piranha | — | — | — | — | — |
| 54 | Calendar Crow | — | — | — | — | — |
| 55 | Browser Bat | — | — | — | — | — |
| 56 | Data Dragonfly | — | — | — | — | — |
| 57 | Update Urchin | — | — | — | — | — |
| 58 | Linux Penguin | — | — | — | — | — |
| 59 | Stock Fox | — | — | — | — | — |
| 60 | Passport Pelican | — | — | — | — | — |
| 61 | Journal Jellyfish | — | — | — | — | — |
| 62 | Shell Squid | — | — | — | — | — |
| 63 | Kernel Koala | — | — | — | — | — |
| 64 | Proxy Axolotl | — | — | — | — | — |
| 65 | Cluster Crab | — | — | — | — | — |
| 66 | Storage Stoat | — | — | — | — | — |
| 67 | White Hat Weasel | — | — | — | — | — |
| 68 | Port Spider | — | — | — | — | — |
| 69 | Cipher Owl | — | — | — | — | — |
| 70 | Forensic Ferret | — | — | — | — | — |
| 71 | Llama Librarian | — | — | — | — | — |
| 72 | Inference Iguana | — | — | — | — | — |
| 73 | Agent Ant | — | — | — | — | — |
| 74 | Roaming Raven | — | — | — | — | — |
| 75 | Cache Coyote | — | — | — | — | — |
| 76 | Sync Mink | — | — | — | — | — |
| 77 | pet-program-77-icon-77 | — | — | — | — | — |
| 78 | Pet Police Officer | The Police Station | — | — | — | — |
| 79 | AI Dashund | AI Doghouse | — | — | research-library, research-paper | — |
| 80 | Rescue Retriever | The Recovery Room | — | — | — | — |
| 81 | Intel Owl | — | — | — | — | — |
| 82 | Door Dormouse | The Threshold | — | Liminal Doors | — | — |

## Questions for Astra

- ~~The Unity Den or Unity Stable?~~ Astra kept **Unity Stable** (2026-10-16).
- The sketch lists "Unity Unicorn Icon" as a native program. Is the icon a program, or should it be a tool?
