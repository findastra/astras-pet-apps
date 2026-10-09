# Astra's Pet Apps publication record

Release date: **2026-10-08, America/Denver**. Prepared for Astra by **OpenAI Codex (GPT-6)**.

## Source and deployment

| Field | Recorded state |
|---|---|
| Official name | Astra's Pet Apps |
| Version | `0.2.0-20261008` |
| Exact source tag | `v0.2.0-20261008` — tag creation pending |
| Source commit | Pending; record the committed source hash after commit |
| GitHub destination | [findastra/astras-pet-apps](https://github.com/findastra/astras-pet-apps) — private repository created and verified |
| Version source link | [v0.2.0-20261008](https://github.com/findastra/astras-pet-apps/tree/v0.2.0-20261008) — available to collaborators after the tag is pushed |
| Source upload | Pending |
| Platform | Static browser app, entry `cage.html` |
| Hosted deployment | Local browser preview verified; no new hosted app deployment |
| Local verification | Registry check passed; 36 automated tests passed, including original Chip pixel checks and all 18 interface paths; rendered roster visually inspected |

The seven generated companion interfaces also passed a Node DOM harness executing their actual inline scripts: key-reference add/edit/reload/remove, Python answer checks and saved progress, all 18 manager cards and filtering, checklist/notes persistence, the original Paper Girl route, and File Master CSV import, approval normalization, explicit unapproval, export and invalid-import reset. The eight new project desks passed their separate actual-script interaction harness. Browser verification confirmed group movement when dragging the star, Farmer, robot head and Cage; the door and visibility remained unchanged during dragging. Browser verification additionally confirmed that a double-click on the Farmer opens his desk, manager search filters 18 cards to the requested app, API Fairy saves and removes a synthetic reference, Python exercises show feedback, and File Master renders its import/review controls. Paper Girl and Ghost Protocol rendered their original hosted interfaces. The bundled original Data Dealer dashboard rendered; its Claude-hosted copy requires sign-in. No external account integration was activated.

## Per-app source releases

The [machine-readable release ledger](repository-releases-20261008.json) records all 18 entries, their source tags and exact commits, later documentation commits where applicable, and GitHub Release verification. At this pre-commit audit, 17 companion app source uploads and GitHub Releases are verified. The Cage destination is created and its bundled release is pending. Project Parrot is now published after GitHub’s temporary creation limit cleared. Private source URLs require a signed-in collaborator. No newly hosted standalone interface is claimed by a source upload.

Discord Presence and File Master use `v0.1.1-20261008-pets`; their earlier tags remain immutable. The other existing-app releases use `v0.1.0-20261008-pets`. The ten newly created private companion app repositories use `v0.1.0-20261008`.

The publication-candidate audit found all 18 local interfaces, decoded 87 embedded images, and found no credential-pattern matches, absolute owner paths, runtime binaries or BSOD/import artwork in files eligible for Git. Existing Claude filenames are preserved; newly authored descriptive files follow the dated naming rule. This audit does not replace browser visual verification or establish an external service connection.

## Included scope

- **18 registered pets**, each with nine transparent 256×256 mood frames. The generated [roster](../ROSTER.md) lists every app and its repository status.
- The Cage group can be dragged by its enclosure, Farmer, optional BSOD visitor, or star. A movement threshold separates dragging from clicks and double-clicks. The star is 30 pixels across, with tiny red, green and blue orbiting stars. Ghost Protocol has a fixed visible height of 44.0625 pixels; the other creatures remain 58.75 pixels.
- The optional Windows Farmer follows the actual BSOD mini continuously from its right side, using scoped live accessibility geometry. Its fixed height matches the computer case-to-feet height at the smallest mini setting. Synthetic movement checks and an independent source review passed; live geometry reception was verified. Native Farmer is a follower; the shared drag handles belong to the browser Cage.
- The Farmer opens and closes the Cage; pets roam, respond to clicks, and can be hidden or shown. Double-clicking each registered pet opens its application interface. The Farmer’s desk lists the apps and saves personal follow-up flags.
- Every pet has a dated HTML interface packaged in `apps/`. Ghost Protocol and Paper Girl default to their original live Pages apps; Data Dealer opens its bundled original dashboard; its hosted Claude artifact currently requires sign-in and is retained as a reference. The package retains original portable apps for Ghost Protocol, Data Dealer and GitHub Goldfish. Native or planned apps have useful browser companions with clearly described limits.
- Ghost Protocol's artwork was approved by Astra on 2026-10-08. The Farmer's mood sheet was repaired, then edited at Astra’s request to add visible blond hair and assorted fruit and vegetables in his hands. Chip uses the actual Data Dealer `drawPet` artwork function, preserving its original 32×24 LCD pixels at integer scale inside the original yellow launcher shell.
- Project Parrot is the official name replacing Project Pal. Its planned purpose is to review OneNote periodically for new project ideas and remind Astra to start them.
- BSOD is an optional **local guest**, separate from the 18 registered apps. The owner can supply a sprite sheet in the browser. Built-in desktop-pet artwork is excluded from the repository and deployment, and the guest does not synchronize desktop-pet state.

## Asset provenance

The following source sheets were created or repaired through the built-in image generation tool. These are descriptive prompt summaries, not verbatim generation transcripts. The shared production style and per-pet generation descriptions are recorded in [generate-pets.mjs](../scripts/generate-pets.mjs).

| Source sheet | Intent and reference |
|---|---|
| `art/sheets/ghost-protocol-20261008.png` | Friendly pale mint and seafoam ghost, bright teal inner folds, rounded head, tiny arms and scalloped floating hem. One consistent character in a 3×3 grid of nine facial moods. Approved by Astra. |
| `art/sheets/farmer-20261008.png` | Repair the Friendly Farmer’s faces; final edit adds blond hair and a different fruit or vegetable in each mood, preserving lime overalls, coral shirt and straw hat. The clipboard is removed. |
| `art/sheets/project-parrot-20261008.png` | Compact friendly parrot with scarlet body, electric ultramarine wings and tail, and gold beak. One consistent character across nine distinct moods. |

The local build converts these sheets into dated frame filenames, composes the shared mood indicators, and generates the roster. It does not invoke paid image generation. Existing sheets and filenames for the other pets are retained.

**Chip's active source is native artwork code:** [chip-original-20261008.mjs](../scripts/chip-original-20261008.mjs) contains only the tiny drawing function and launcher appearance Astra explicitly requested. The original source reference is Data Dealer commit `0be8aab`. The LCD colours remain `#c3d39b`, `#1f2b0e`, and `#7d8f55`; the shell uses its original `#d9e25a` and `#0a0b05`. Nine Cage moods map to original expression, blink and bob states, with the shared Cage indicators added around the shell. The earlier generated `chip-20261008.png` is superseded and is not used by the build. Following Astra’s later request that every pet open its app, the original Data Dealer dashboard is also included as `apps/data-dealer-20261008.html` in this private repository. No other private Data Dealer documents are included.

## Functional limits

- The Cage and its herd run in a browser. An optional Windows Farmer companion is included separately; see [its instructions](farmer-dock-20261008.md) for current behavior and verification.
- All 18 entries have an interface, but not every intended external integration is implemented. Status and repository visibility are recorded per pet. Source upload to the corresponding repositories is verified separately.
- Project Parrot supports manually entered ideas, due dates and reminders while its page is open. OneNote access, scanning and background reminder automation are not connected or tested here. No scheduled automation was created as part of this release.
- Ghost Protocol is a personal cybersecurity checklist. Its pet does not scan the PC, monitor threats, or receive checklist progress.
- BSOD's optional local visit is not a live bridge to the ChatGPT pet.
- Passing local checks does not confirm source upload, tag publication, or a hosted deployment. Update the source and deployment table only after those actions are verified.
