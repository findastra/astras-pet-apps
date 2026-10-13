# Desktop pet revisions — 2026-10-11

Prepared by OpenAI Codex (GPT-6) for Astra. This is the current desktop handoff; it supersedes earlier size/art notes. New artwork remains a draft unless Astra has individually approved it.

## Current controls and rendering

- Double-click the desktop star to toggle floor lineup / roaming. Single click shows/hides the desktop pets.
- Click the system-tray star to show/hide the desktop star. Tray and desktop use the identical 24-physical-pixel raster at the owner's current 150% display scale, with a crisp black outline and no sparkles. Windows controls notification-area placement.
- Claude Bot is an orange-screen BSOD twin at a fixed 88.125 logical-pixel height, enlarged to match the small BSOD shown in the owner's reference. Pets do not grow/shrink while roaming.
- Triple-click Fuzzboi to cycle original body styles B → C → A, choosing a fresh valid combination. Double-click still opens the app, after the triple-click window expires. The original Forge decoder exports 858 valid recipes spanning every style and color. Compose original layers at 256px for responsive switching; no generated replacement body.
- Duck's 5-by-3 chest keys and Bee's abdomen cycle RGB every six seconds, refreshed every 50ms. Duck's yellow body/orange feet and Bee's pale wings retain their color.
- Native layered Windows rendering supplies actual alpha: Ghost 38% opacity; fins, fairy wings, butterfly wings, Moth's monochrome static wings and Angel's silver-white hair partly transparent. Angel's blue dress remains visually distinct.
- No sparkle trails or pink transparency flecks. Generated art already contains outlines; do not add another thick border. Color-key sprites use thresholded alpha; transparent pets use layered windows.
- Paper Girl and File Master travel together. File Master initially leads; dragging either changes the leader and its companion catches up. Both pause during interaction and remain neighbors in the floor lineup. See [the partner revision](pet-partners-20261011.md) for validation and implementation details.

## Final art and size inventory

Scales below multiply the standard 58.75 logical-pixel height, subject to the existing width cap except the explicit matching-height overrides. Paper Girl and File Master both measure 42.3 logical pixels tall. Their aspect ratios are preserved.

| Pet | Scale | Latest change |
| --- | ---: | --- |
| meme-fiend | 0.8 | Smaller cute purple fox with mischievous half-lidded eyes and smirk. |
| chat-rat | 0.9 | Smaller light gray rat without accessories. |
| finance-finch | 0.85 | Yellow wings, balanced orange beak in all poses, forward-facing orange soles. |
| mail-snail | 0.8 | Straight antennae without balls or stalk eyes; two face eyes; no mail sign; Bug height. |
| gif-giraffe | 1 | Neon yellow giraffe with smaller head relative to torso and corrected muzzle. |
| claude-bot | 1.5 | Orange-screen BSOD twin, fixed 88.125 logical-pixel height to match the owner's small BSOD. |
| rift-rabbit | 0.9 | Smaller white rabbit with monocle, seated visible soles; no purple or headset. |
| backup-beaver | 0.85 | Smaller beaver holding clear floppy disk. |
| python-panther | 1 | Brighter purple panther. |
| deck-duck | 1 | Yellow duck with forward-facing orange soles and 5-by-3 chest key grid cycling RGB; body colors stay fixed. |
| wifi-butterfly | 0.7 | Smaller monarch with slim dark body and translucent wings. |
| patch-cat | 0.85 | Smaller cat, white X eye bandage and cast. |
| paper-girl | 0.72 | Pink newspaper without lettering or lashes, folded corner and columns; small rectangular highlighted eyes matching File Master. Same 42.3 logical-pixel height. |
| file-master | 0.72 | Commanding manila folder with gold crown and stern eyebrows; small rectangular highlighted eyes. Height remains 42.3 logical pixels. |
| rgbee | 0.7 | Smaller bee; no antenna balls; six-second RGB abdomen cycle; pale translucent wings retain their color. |
| spoonfed-sugarcube | 0.7 | Smaller white sugarcube holding one silver spoon. |
| chip | 1 | Desktop screen is the face; original drawing retained as default. |
| astra-wisp | 1 | Fairy wings with partial alpha. |
| ghost-protocol | 0.8 | Original body, 38% opacity. |
| goldfish | 1 | Fins partly transparent. |
| api-fairy | 1 | Fairy wings partly transparent. |
| health-hummy | 0.7776 | Slightly smaller Health Hummy, 45.684 logical pixels tall. |
| fuzzboi-friend | 0.75 | Original Fuzzbois layers; random Style B at launch. Triple-click cycles B/C/A with a new valid combination; double-click opens app. 858 recipes from shared Forge decoder. |
| mesh-moth | 0.64 | Smaller distinct blue moth with partly transparent black-and-white static wings. |
| project-parrot | 1 | Shorter tidy three-feather blue tail. |
| raspberry-berry | 0.8 | Smaller berry with larger central bead and prominent eyes. |
| voicemeeter-bug | 0.8 | Lime-green and black headphones, original red-and-black ladybug identity. |
| vscode-angel | 1 | Sheer silver-white flowing hair separated from opaque blue dress. |
| portfolio-puffer | 0.8 | Pink belly, seated forward-facing yellow foot soles. |

Farmer remains .9 and independent. Mommy's Mommies retain the approved light-blue/red skating dresses, white/yellow halo and red horns; the separate interaction sheet remains available. Drum Dog remains the approved Shih Tzu with headphones. Damsel retains her headset on top of her head.

Visible feet were reviewed in the full desktop preview. Penguin, Finch and Duck now use the seated, forward-facing sole style requested using Dog/Bunny as references. Existing applicable seated pets retain their foot treatment.

## Files, restoration and verification

Desktop source: scripts/desktop-pets-20261011.cs. Build: build-desktop-pets-20261011.ps1. Local draft preparation: scripts/prepare-desktop-drafts-20261011.mjs. Chip's screen-face option: scripts/build-chip-desktop-20261011.mjs. Its original app drawing remains the default.

Public registered pet overrides live in desktop-art. Other/private pet art is committed only to the corresponding pet repo under desktop-art/<pet>; each has desktop-pet-20261011.json with frame paths, scale and renderer notes. The local-only desktop-drafts-20261011.json points to these assets. Original Fuzzbois layers and shared recipe export remain in findastra/fuzzbois. Do not copy private artwork into this public hub.

Source sheets and all nine derived 256px transparent frames are saved. New files use lowercase dated filenames. Executables remain local ignored build outputs and are reproducible with the committed build script.

Verification completed:
- 62 hub Node tests passed.
- Native self-tests passed: click/drag classification, Fuzzboi triple-click without accidental app opening, switching through all three original body styles, star's solid black raster, matching Paper Girl/File Master heights, monitor bounds and lineup separation, RGB/alpha masks, zero sparkle particles.
- Final full-roster rendered preview inspected; feet, silhouettes, colors and transparency checked.
- Installed candidate by gracefully quitting the old instance and restarting the existing desktop-pets-20261008.exe with this repo. Live diagnostics: 35/35 pet windows visible, animation running, floor lineup active, tray and desktop star visible, both star rasters 24px, sparkle count zero.
- Source/artwork and handoff metadata pushed to the existing default branches below; every resulting remote commit was verified. No forced pushes. Owner review remains appropriate for art preference and physical drag feel.

## Verified corresponding-repo commits

The hub commit containing this document is the hub release record. Each linked commit below is the final corresponding-repo snapshot for this batch.

| Repository | Branch | Verified commit |
| --- | --- | --- |
| meme-fiend | main | [c14b565](https://github.com/findastra/meme-fiend/commit/c14b56587b1ce5cb5896fc035dc841da4aefbceb) |
| chat-rat | main | [38448ae](https://github.com/findastra/chat-rat/commit/38448aed6dc448fd2b85bfdab78779b3774368ab) |
| finance-finch | main | [b970682](https://github.com/findastra/finance-finch/commit/b970682e02d9f737c665faed1fb89a3b4564427f) |
| mail-snail | main | [1cbee7d](https://github.com/findastra/mail-snail/commit/1cbee7dc780a48d2d22c8c633e7012bb69313b4d) |
| astras-gif-maker | main | [0ee0909](https://github.com/findastra/astras-gif-maker/commit/0ee090911c78ae914aafb3c0ca7a17ee1239e31b) |
| claude-bot | main | [36e2a95](https://github.com/findastra/claude-bot/commit/36e2a95416692606e03b798582282adadb8b3223) |
| rift-rabbit | main | [3cf5c1c](https://github.com/findastra/rift-rabbit/commit/3cf5c1c3c6bf109aea4d1d101010a9d13f6d20b5) |
| backup-beaver | main | [9703590](https://github.com/findastra/backup-beaver/commit/97035902a024c5199ca5df13ec21b33ae34c44ba) |
| learn-python | main | [e9d20ee](https://github.com/findastra/learn-python/commit/e9d20ee8e4f29d8325da0ef8c8e659e743fb7064) |
| deck-duck | main | [0265064](https://github.com/findastra/deck-duck/commit/026506488a349372c93360eae161207b8e203c2d) |
| wifi-butterfly | main | [f1258fb](https://github.com/findastra/wifi-butterfly/commit/f1258fb74d3ef0bd57d1775e39c71813e040d919) |
| patch-cat | main | [c9ae49c](https://github.com/findastra/patch-cat/commit/c9ae49c20269855e3e8d7012de6e399e910ffe11) |
| paper-girl | main | [ad01a52](https://github.com/findastra/paper-girl/commit/ad01a5224b5f611c44b4fb31f72fca011fd00fbf) |
| file-master | main | [a82b0d2](https://github.com/findastra/file-master/commit/a82b0d2972a52bdc6270c842408bc2594ef94755) |
| rgbee | main | [f20a4ed](https://github.com/findastra/rgbee/commit/f20a4edd53c4e960345afc0e3377d2dd0b868906) |
| spoonfed | main | [9b060d9](https://github.com/findastra/spoonfed/commit/9b060d930a89e88ed965b4f609295d8efbbec75a) |
| data-dealer | main | [6b7d7c9](https://github.com/findastra/data-dealer/commit/6b7d7c9cb51c7e49d89c2d639d9f4d31b23beec2) |
| vrchat-ai-astra | main | [34f98f4](https://github.com/findastra/vrchat-ai-astra/commit/34f98f4aa107847d130c2c0df44528302964cc74) |
| ghost-protocol | main | [b278230](https://github.com/findastra/ghost-protocol/commit/b2782303cec22cdc9ead1c82a1faca73d6ff556d) |
| github-goldfish | main | [c4d07cf](https://github.com/findastra/github-goldfish/commit/c4d07cff62b0dabd46ccdff89266733f7dda4939) |
| api-fairy | main | [fd5adca](https://github.com/findastra/api-fairy/commit/fd5adcaef1557642da236be93ef54ee564d369fc) |
| health-hummy | main | [d453f80](https://github.com/findastra/health-hummy/commit/d453f804f65ec687b49b365488be9bcf54bc2096) |
| fuzzboi-friend | main | [2b0d536](https://github.com/findastra/fuzzboi-friend/commit/2b0d536ddf936ca4cd82e7f0e82e9376131dd267) |
| mesh-moth | main | [bba55b8](https://github.com/findastra/mesh-moth/commit/bba55b868382af5cf9fbc82276ff1860843b2cca) |
| project-parrot | main | [90394ce](https://github.com/findastra/project-parrot/commit/90394cee10acd176b31fdafb4759725f5924d87a) |
| raspberry-berry | main | [619928d](https://github.com/findastra/raspberry-berry/commit/619928d5ba8f1ed3ba336921e4a2ca7e7da313fc) |
| voicemeeter-bug | master | [2012457](https://github.com/findastra/voicemeeter-bug/commit/2012457a09fb9d5cc893a9a00ae6308031526158) |
| vscode-angel | main | [979e08a](https://github.com/findastra/vscode-angel/commit/979e08ab78c7f0552d238297392d059bf9bf14cb) |
| portfolio-puffer | main | [634a5c3](https://github.com/findastra/portfolio-puffer/commit/634a5c3136d98e138934eedc1a1be44c4c5e8970) |
| fuzzbois | main | [9cf9a95](https://github.com/findastra/fuzzbois/commit/9cf9a95e9ad1a9f7e2456067d7f17066ce70192a) |
