# Tray star update

OpenAI Codex (GPT-6), 2026-10-11, America/Denver.

## What I did
- Fast-forwarded the clean codex/astras-pet-apps checkout to d8239b0 after reading the latest Bug handoff.
- Recovered the desktop source, docking tracker and manifest from pushed branch claude/roam-free-wip-20261009 (a287c08) into dated 20261011 files. The free-roaming source remains unmerged upstream; this change does not merge its browser redesign.
- Added a Windows NotifyIcon drawn with the desktop star's existing drawing function, without sparkles. Windows determines its fixed tray display size. The desktop star keeps its existing dimensions.
- Left click on the tray star toggles the desktop launcher (star and attached Farmer). Roaming pets stay visible and animated. The desktop star still toggles the desktop pets. Tray right click opens the existing menu, plus Show/Hide desktop star.
- Removed ownership of roaming windows by the launcher so hiding the launcher does not hide the desktop pets; shutdown still explicitly closes all roaming windows.
- Tray icon and native icon handle are cleaned up on exit. No startup setting was changed.
- Added tray state to diagnostics and --toggle-star to exercise the click handler. The browser menu falls back to cage.html when pets.html is absent.
- Built with build-desktop-pets-20261011.ps1 -CandidateOnly. Self-tests passed, including launcher hide/show preserving the desktop pets' state.
- Saved the prior installed executable as bin/desktop-pets-before-tray-20261011.exe, quit gracefully, and installed the candidate at the existing bin/desktop-pets-20261008.exe path.
- Live diagnostics confirmed tray_visible true; desktop visibility true -> false -> true; 18 roaming windows visible throughout; animation running; 19 registered pets; Bug present; docking true. The physical tray click and Windows overflow placement still need owner visual confirmation.

## Build and rollback
Use build-desktop-pets-20261011.ps1 -CandidateOnly while the installed app runs. The diagnostic is bin/desktop-pets-check-20261011.exe. All command modes require the absolute repo path first, then --check, --toggle-star or --quit.
To roll back: gracefully quit the installed executable with the repo path and --quit, restore bin/desktop-pets-before-tray-20261011.exe to bin/desktop-pets-20261008.exe, then launch with the repo path.

## Publication
This tray change is local only; no push or release was performed. The imported source files and this note should travel together in any future commit/PR. Executables are ignored by Git.

## Black outlines and star revision (same day)
Owner requested BSOD-like black outlines for every desktop pet, a Mario-style yellow star with tall eyes and no sparkles, and Farmer closer to the star. Added cached alpha masks and one-logical-pixel black outer borders to the desktop renderer; original sprite assets remain unchanged. Both tray and desktop use the revised star drawing. Farmer now starts at logical x=54. Candidate self-tests passed and the rendered 1280x720 desktop pets preview was inspected before installing. Rollback for this revision: bin/desktop-pets-before-black-outline-20261011.exe. Changes remain local and uncommitted.

Owner follow-up: tray and desktop must be exactly the same icon and size, with small BSOD-like eyes. Both now use the same cached bitmap at Windows' small-icon metric for the current DPI. Tray artwork fills the slot; desktop drawing uses that bitmap at the same physical pixel size. Sparkles removed and eyes reduced to small rectangles with white highlights. Farmer x=24 now closes the gap beside the smaller launcher. Self-tests passed again.

## Free Farmer and faster docking
Owner requested independent Farmer roaming and less lag behind BSOD. Farmer now has his own PetWindow and is included in the desktop pets show/hide and shutdown. The launcher is only the 20-logical-pixel star window. Verified BSOD image offsets are translated with native window geometry between accessibility identity rechecks; moving windows skip the expensive recheck until stationary. Worker requests 16 ms waits; synthetic cadence measured 27.1 ms average over 84 samples. Tests passed for native translation after window movement, negative monitor coordinates, cadence, discovery backoff, identity rejection and disposal. Desktop self-tests also passed. Owner also requested more space to BSOD's right: docking gap increased from 6 to 14 logical pixels. Installed locally; prior executable saved as bin/desktop-pets-before-free-farmer-20261011.exe. User drag smoothness remains to be confirmed. Not pushed.

## Paper Girl desktop pet size
Owner requested the little desktop pet at 50% size and explicitly excluded website changes. Applied a Paper Girl-only 0.5 multiplier after the existing layout size clamp in scripts/desktop-pets-20261011.cs. Built and passed desktop self-tests, inspected bin/paper-girl-half-size-preview-20261011.png, then gracefully restarted the installed controller. Live diagnostics report Paper Girl at 29.375 logical pixels high (previously 58.75), 19 roaming pets visible, and animation running. Other pets retain their existing size. Rollback binary: bin/desktop-pets-before-paper-girl-resize-20261011.exe. Local change only; no push or website deployment. OpenAI Codex (GPT-6), 2026-10-11.

### Follow-up: enlarge Paper Girl by 30%

The owner requested 30% larger than the half-size version. Paper Girl now uses a 0.65 display multiplier (0.5 × 1.3). Rebuilt and passed the existing desktop self-test, then gracefully restarted the installed controller. Live diagnostics confirm Paper Girl is 38.1875 high × 27.57986 wide, with all 19 pets visible and animation running. Backup of the half-size executable: `bin/desktop-pets-before-paper-girl-enlarge-20261011.exe`. Applied locally by OpenAI Codex (GPT-6), 2026-10-11.

## Five pet size adjustments
Owner requested Portfolio Puffer (penguin), Health Hummy and Ghost Protocol at 80% of their previous desktop dimensions, Finance Finch at 85%, and File Master at 50%. Applied fixed multipliers after the existing size clamp. Penguin cyan belly is remapped to light pink in both desktop idle/blink frames at load time; source art and website are unchanged. Inspected bin/pet-size-preview-20261011.png; existing eyes remain legible. Desktop self-test passed. Installed locally after graceful quit; backup bin/desktop-pets-before-five-resizes-20261011.exe. OpenAI Codex (GPT-6), 2026-10-11. Not pushed.

## Exact 20% enlargement for Paper Girl and File Master
Owner clarified in Astra's Pet Apps chat: both 20% larger than the last installed sizes. Paper Girl multiplier 0.65 to 0.78, File Master 0.5 to 0.6 (the parallel Paper Girl chat already set File Master to 0.6). Do not compound that File Master increase again. Preserved concurrent art/sparkle work. Desktop self-test passed. OpenAI Codex (GPT-6), 2026-10-11.

## Owner removed all sparkles
Latest instruction in Astra's Pet Apps chat: get rid of all sparkles. Disabled trail selection for every pet and updated runtime diagnostics/self-check to require zero sparkle pets. Preserve this override during concurrent Paper Girl work. OpenAI Codex (GPT-6), 2026-10-11.

## Restore ghost body and enlarge Hummy
Latest owner request: restore Ghost Protocol's previous body shape and enlarge Health Hummy 20%. Ghost now loads original registry frames again, preserving its 0.8 size. Hummy retains revised colors and uses 0.96 size (0.8 x 1.2). All sparkle trails remain disabled. Desktop self-test passed. OpenAI Codex (GPT-6), 2026-10-11.

Owner still saw sparkles: removed PetSparkles and SparkleWindow implementation entirely, including window creation, advancement, rendering and cleanup references. Rebuilt, self-tested, and restarted with ghost original art and Hummy 0.96 multiplier. Keep all sparkle code removed.

## Pink transparency flecks on new art
Owner still saw pink sparkle-like pixels on Damsel, Hummy and Farmer after all trails were removed. Their generated desktop idle frames contained 27267, 21757 and 29157 partially transparent pixels respectively. WinForms magenta color-key rendering blends partial alpha into visible pink. Added CrispTransparency to desktop-art frames before outline masks/cropping: alpha below 128 becomes transparent, remaining pixels fully opaque. Preserves original saved PNGs and character colors. Preview inspected; self-test passed; restarted installed controller. OpenAI Codex (GPT-6), 2026-10-11.

## Draft roster and approved redesigns
Added optional local-only draft manifest loader and scripts/prepare-desktop-drafts-20261011.mjs. LocalAppData/astras-pet-apps/desktop-drafts-20261011.json references 15 draft pets in their original repositories/private local cache; no private artwork copied into public hub. 19 registered plus 15 drafts = 34 desktop pets. Sugarcube lacks artwork and is not displayed; Meme Fiend uses its existing single square icon. User approved new Shih Tzu Drum Dog (headphones only), Farmer proportions with green shirt/blue jeans, and skating dresses for Mommies. Latest Mommies color correction: Astra ash blonde, halo, light blue dress; Devilish brunette, red horns/red dress. Discord Damsel VR headset resting on head is a draft. New sheets generated with built-in image tool, stored under desktop-art with source sheets and nine derived frames. Earlier Farmer/Mommies/Damsel sheets backed up with dated names. Bug uses 0.8 display multiplier. CrispTransparency and no-sparkle implementation preserved. Desktop self-test passed and 34-pet preview inspected. Installed locally, no push performed. OpenAI Codex (GPT-6), 2026-10-11.

## Mommies interaction alternate draft
Saved desktop-art/mommys-mommies-interactions/sheet-20261011.png and nine derived frames. Approved blue/red outfits remain base: Astra has light ash blonde hair, white/pale-yellow halo, sky blue skating dress; Devilish dark hair, red horns/dress. Alternate interactions: idle/blink standing holding hands, happy hug, curious head tilts holding hands, worried reassuring hand clasp, sad arm behind back, sick leaning on shoulder, alarmed holding hands, sleep seated cuddle. Generated with built-in image tool and visually inspected. Separate draft only, current desktop art not replaced. OpenAI Codex (GPT-6), 2026-10-11.

## Publication and floor lineup
Owner approved pushing all pet work and syncing corresponding repos. Double-click desktop star now shows pets and lines up ground pets on the working-area floor, flying pets above; no resizing. Crowded rows wrap upward. Single click retains show/hide. Right-click Let the pets roam resumes motion; blinking continues while lined up. Tested no overlaps, negative-monitor bounds and flyer separation, and double-click action. Sugarcube art now exists; local drafts manifest has 16 drafts, for 35 total pets. All character and renderer updates are included in this publication.

## Latest desktop revision
See docs/pet-revisions-20261011.md for the final star toggle, sizes, native transparency, RGBee bands and original jagged Fuzzboi randomization. OpenAI Codex (GPT-6), 2026-10-11.
