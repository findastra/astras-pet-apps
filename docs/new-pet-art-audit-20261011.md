# New pet art audit — 2026-10-11

Read-only inventory by OpenAI Codex (GPT-6). Checked live GitHub owner repositories, the main tree and branch list of every pipeline app, the local Projects folder, both archived pet/interface repository folders, and existing handoffs. No art was generated, no app repository was modified, and nothing was pushed by this audit.

## Scope and result

At the initial audit snapshot, the local hub registry had 19 registered pets and 14 pipeline apps. **Chat Rat is an additional established pet app missing from both lists.** Every pipeline app and Chat Rat already has a GitHub repository. All app repositories inspected have only main. The separate branch audit found no extra new-pet art in any of the hub's nine non-main branches.

Seven pipeline apps have no image art: Claude Bot, RGBee, Mine Mole, Mail Snail, Patch Cat, Backup Beaver, and Rift Rabbit. Existing work should be reused for the other seven pipeline apps and Chat Rat. Deck Duck's art explicitly identifies itself as a hand-drawn stand-in. Meme Fiend has one icon, not nine moods.

Local root abbreviation below: `%USERPROFILE%/Documents/Projects/`.

| Pet / repository | Live visibility | Existing art and location | Remaining art work |
| --- | --- | --- | --- |
| Claude Bot / claude-bot | public | No sheet, frames, or app icon on GitHub; no local checkout in the inspected roots. | New draft. Original orange-faced floating control; preserve an original design rather than another product's mascot. |
| RGBee / rgbee | public | No image art. GitHub `sprite-20261009.json` explicitly says waiting for art. No local checkout in the inspected roots. | New draft. Fuzzy bee with red, green, and blue stripes, dark charcoal body, cyan-violet wings, and white antenna bulbs. |
| Mine Mole / mine-mole | public | Local and GitHub `handoffs/001-cage-registration-20261009.patch` includes a prompt and registry edits, but no image. | New draft from the saved prompt. Plum-purple fur, hot pink star nose and spade paws, electric teal miner hat with white headlamp, tiny silver pickaxe; no coins. |
| Mail Snail / mail-snail | public | Local and GitHub `sprite.json` has empty frames. | New snail draft. No existing palette or detailed character design found; mail job remains undecided. |
| Patch Cat / patch-cat | private | Local and GitHub `sprite.json` has empty frames. | New cat draft. No existing palette or detailed design found; app job remains undecided. Keep its art in the private repository. |
| Meme Fiend / meme-fiend | private | Local and GitHub `art/meme-fiend-20261009.png`: one square green imp head with pink horns, black/white eyes, yellow teeth, and a dark opaque background. `sprite.json` still claims no art. | Reuse this identity as the reference if making nine moods; do not overwrite the original. Keep private. |
| Gif Giraffe / astras-gif-maker | private | GitHub `art/sheets/gif-giraffe.png`, nine `art/frames/gif-giraffe/{mood}.png`, `icon.png`, and encoded nine-mood `sprite.json`. Local Projects/astras-gif-maker is an empty nongit folder. | Retrieve and inspect the existing sheet/frames; do not regenerate. GitHub commit a494a98e5e4426534ac4f2a138877223cd3c49c6. |
| Backup Beaver / backup-beaver | private | Local and GitHub empty `sprite.json`. Local checkout clean but one commit behind remote. | New beaver draft; no existing palette/design found. Keep private. |
| Rift Rabbit / rift-rabbit | private | Local and GitHub empty `sprite.json`. `docs/handoff-claude-20261009.md` says art was never generated. | New white rabbit draft for VR. Handoff suggests ice white with electric violet/teal accents. Keep private. |
| Fuzzboi Friend / fuzzboi-friend | public | GitHub nine `art/{mood}-20261009.png`, `art/fuzzboi-friend-ref-20261009.png`, and `sprite-20261009.json`. The paid 3×3 sheet is embedded in `cage/cage-registration-20261009.patch` at intended hub path `art/sheets/fuzzboi-friend-20261009.png`. No local checkout in inspected roots. | **Do not regenerate.** Preserve owner-drawn identity and paid sheet; the patch also includes frames, source prompt/reference, and registration edits. Registration was previously held by owner, so art retrieval alone does not mean applying the entire patch. |
| Wifi Butterfly / wifi-butterfly | private | Local and GitHub `art/mood-sheet-20261009.png`, nine `art/{mood}-20261009.png`, `icon-20261009.png`, `sprite-20261009.json`. | Reuse existing generated monarch design: neon flame-orange, black wifi-arc veins, white-dotted border. No regeneration needed. |
| Deck Duck / deck-duck | public | Local and GitHub `art/sheets/deck-duck.png` and nine `art/frames/{mood}.png`. Magenta duck with lime beak/feet and cyan six-button chest. | Existing design is explicitly a scripted stand-in in `sprite.json`; retain as reference if upgrading to a generated draft. Mood names map neutral→idle, unwell→sick, shocked→alarmed, sleeping→sleep. |
| Mesh Moth / mesh-moth | private | Local and GitHub `art/sheets/mesh-moth-20261009.png`; `sprite.json` contains all nine moods as encoded 64×64 pixels, rather than paths. | Existing generated blue furry moth, cream chest, pink wings with lime mesh lines; slice/reuse sheet if PNG frames are needed. Do not regenerate. |
| Raspberry Pi / raspberry-berry | private | Local and GitHub `art/sheets/raspberry-berry-20261009.png`, nine `art/frames/{mood}-20261010.png`, `art/roster-20261010.png`, encoded nine-mood `sprite.json`. | Reuse existing raspberry design. Frames already include mood stickers. No regeneration needed. |
| Chat Rat / chat-rat | private | Local and GitHub `art/mood-sheet-20261009.png`, nine `art/{mood}-20261009.png`, `icon-20261009.png`, `sprite-20261009.json`. | Reuse generated electric-aqua rat with coral ears/paws/tail and cream paper scroll. Hub registration missing; art already complete. |

## Important existing evidence

- Hub card `handoffs/006-farmer-register-fuzzboi-friend.md` and remote `fuzzboi-friend/cage/README.md` both say the paid sheet is ready; the patch's file list was verified live and contains the sheet, nine frames, and reference.
- Mine Mole's generation failed for lack of credits on 2026-10-09; its handoff explicitly says nothing was billed and no art exists.
- `%USERPROFILE%/Documents/ChatGPT/Findastra Pet Apps/pet-system-audit-20261011.json` independently records the existing GIF Giraffe art and stale new-pet handoffs. Its older total of 18 registered pets predates the now-registered Voicemeeter Bug.
- The archived `pet-repositories-20261008` and `interface-repositories-20261008` folders contain the already registered pet apps, not additional missing pipeline art.
- Role Fairy exists publicly at `findastra/role-fairy`, but its README describes a Discord role picker. It has no pet.json, sprite assets, pet-app topic, or registry entry. It is not counted as an established new pet.
- Other nonpet app repositories, existing characters, and candidate world projects are not new pet-art gaps.

## Handling notes

All inspected local pipeline repositories with Git metadata were clean. Backup Beaver's remote is ahead by one commit. Gif Giraffe's local directory is not a checkout. Claude Bot, RGBee, and Fuzzboi Friend need a checkout or controlled retrieval before edits.

Draft creation/push can use existing repositories without changing their visibility. Private app artwork should remain in its private repository; do not copy private drafts into the public hub merely to build a preview. Existing artwork remains draft unless the owner has approved it. No paid image API is needed to use the built-in image generator.

Authentication and GitHub reads succeeded using the intended credential from Git Credential Manager, held only in memory. No credential was printed or saved. See the parent agent's separate push-path verification before publishing changes.


## Publication follow-up

The seven missing sets above are now drafted and pushed. Sugarcube (Spoonfed) was added during the audit, then drafted from its saved sherbet-pink cube/chartreuse spoon recipe and pushed art-only to a new private findastra/spoonfed repository. Eight new sets total; existing designs above were preserved. Verified commits and paths are in pet-draft-publication-20261011.md.
