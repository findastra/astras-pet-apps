status: open (waiting on Astra: the in-world and desktop pictures listed under Task; merging the 25 picture PRs)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: docs/flash-audit-20261014.md (A55), findastra.github.io `art/projects/project-images-20261017.json`, github-goldfish `scripts/project-image-generator-20261017.mjs`
---
## What I did
Task from another Claude session (2026-10-17): add real pictures to every findastra repo that fails Flash Audit A55, using the
screenshots taken that morning, and list the pictures only Astra can take.

- **25 pull requests, all on branch `claude/pictures-20261017`, none merged.** Each adds `docs/images/<repo>-…-20261017.png`
  (1280×800, taken with project-image-generator) and a short **Pictures** section near the top of `README.md`, with alt text and a
  credit line. README and pictures only; no code changed. All 25 are mergeable, and CI passes where a repo has it.
  - Program page as published by this hub: [file-master#4](https://github.com/findastra/file-master/pull/4),
    [github-goldfish#15](https://github.com/findastra/github-goldfish/pull/15), [vscode-angel#1](https://github.com/findastra/vscode-angel/pull/1),
    [learn-python#2](https://github.com/findastra/learn-python/pull/2), [portfolio-puffer#1](https://github.com/findastra/portfolio-puffer/pull/1),
    [project-parrot#1](https://github.com/findastra/project-parrot/pull/1), [health-hummy#1](https://github.com/findastra/health-hummy/pull/1),
    [finance-finch#1](https://github.com/findastra/finance-finch/pull/1), [drum-dog#1](https://github.com/findastra/drum-dog/pull/1).
  - This hub: [astras-pet-os#45](https://github.com/findastra/astras-pet-os/pull/45) (3D System Map and the Farmer's Desk, before "Who lives here", plus this card).
  - Live sites: [platform-platypus#3](https://github.com/findastra/platform-platypus/pull/3), [ghost-protocol#2](https://github.com/findastra/ghost-protocol/pull/2).
  - Program page from the repo's own `main`: [raspberry-berry#2](https://github.com/findastra/raspberry-berry/pull/2),
    [mine-mole#1](https://github.com/findastra/mine-mole/pull/1), [wifi-butterfly#1](https://github.com/findastra/wifi-butterfly/pull/1),
    [rgbee#1](https://github.com/findastra/rgbee/pull/1), [mommys-mommies#1](https://github.com/findastra/mommys-mommies/pull/1).
  - Placeholder pets, program page from Codex's pushed `codex/l3-activity-20261016` branch (on `main` their page is blank or one line,
    and the caption says the branch is not merged): [mesh-moth#1](https://github.com/findastra/mesh-moth/pull/1),
    [deck-duck#1](https://github.com/findastra/deck-duck/pull/1), [rift-rabbit#1](https://github.com/findastra/rift-rabbit/pull/1),
    [backup-beaver#1](https://github.com/findastra/backup-beaver/pull/1), [meme-fiend#1](https://github.com/findastra/meme-fiend/pull/1),
    [patch-cat#1](https://github.com/findastra/patch-cat/pull/1), [mail-snail#1](https://github.com/findastra/mail-snail/pull/1).
    A strict reading of A55 ("a placeholder is Missing") may still call these Missing until each app is built.
  - [chat-rat#4](https://github.com/findastra/chat-rat/pull/4): the page from [chat-rat#1](https://github.com/findastra/chat-rat/pull/1); merge it after #1.
- **Retaken screenshots.** 11 of the morning's screenshots came from PC working copies: 10 showed Codex's unmerged L3 bubble, and
  Chat Rat's showed uncommitted edits. I retook them with project-image-generator from `origin/main` worktrees, or from the pushed
  branch named in the caption. I added only one picture where a page shot and a site shot were the same image (Platform Platypus
  byte-identical, Ghost Protocol, the hub's site and System Map). Every picture was looked at: no personal data, private chats or other people.
- **A55 on the branches**, scored with project-image-generator's own `pickImages` and `a55` against `claude/pictures-20261017`:
  22 pass and 3 too-few (drum-dog, meme-fiend, mommys-mommies: creative, so A55 asks for three). On `main` all 25 are missing,
  except the hub, which is too-few.
- On Astra's PC: nothing in any project folder changed. Worktrees and clones were in Claude's temp folder.

## Task
Pictures only Astra can take. Best picture first. Each one is committed as `docs/images/<repo>-<what>-<date>.png` with alt
text. VRChat's camera saves PNGs to `Pictures\VRChat`. Hide nameplates, and leave out other players unless they say OK.

| Repo | Now | Pictures needed |
| --- | --- | --- |
| astras-infinite-pole | Passes only because its default branch is `codex/fine-magic`, which has 3 Unity renders. `main` has no pictures, and none are in-world. | At least 3 VRChat in-world shots: from the spawn, looking up the pole into the sky; on a cloud platform over the cloud sea (v0.8.0); the stormscape (v0.9.0); the theatre (v0.10.0); a magic effect or the spellbook in use. |
| piranesi-house | Missing; creative. | At least 3 in-world shots: a domed vestibule with light shafts through the oculus; a drowned hall at high tide (refraction and caustics); the Colossus (Athena) from below, or from her shoulder; the Sea Gate steps into open ocean. Unity Game-view renders from Astra's open Unity also count as 3D views (skill `vrchat-unity-world`). |
| the-astral-plane (was vrchat-ai-astra) | Missing; creative. Its README says her VRChat body has never run against live VRChat. | Now: the desktop app (`ai_astra_desktop.py`) and the brain viewer (`ai_astra_brain_viewer.py`) on Astra's PC, with a test conversation only, no private chats. Later: an in-world shot of a chatbox line from `vrchat-embodiment/`, once it runs in VRChat. |
| detour-into-vr | Missing. | The laptop's OBS vertical three-panel scene (DETOUR, VRChat avatar, IRL) with no stream key in view; a frame of the TikTok LIVE with the promo bar, cropped so other people's faces and usernames are not shown unless they say OK. Optional: the promo bar at its real 1080×96 size, which an agent can render. |
| mommys-website | Missing; creative. Only a brief, no site yet. | When the site exists, an agent can screenshot it. Until then: in-world shots of Mommy's club in VRChat (stage, dance floor), with members' OK. |
| mommys-mommies | Too-few after PR #1; creative. | 2 in-world shots of a Mommy's class or event, with members' OK. |
| role-fairy | Missing. | The role picker in Mommy's Discord with the menu open, with member names and avatars hidden. |
| startup-star | Missing. | The desktop pets out on Astra's desktop and the tray star's menu. BSOD and Claude Bot are other creators' artwork: blur or crop them (card 011, decision 1). |

Pictures an agent can add later (no Astra needed):
- **drum-dog** (too-few): 2 more shots of the desk with a made-up track idea, and of the Markdown export.
- **meme-fiend** (too-few), **astras-gif-maker**, **claude-bot**, **spoonfed** (art drafts only): nothing built to picture yet.
  Pet art does not count.
- **the-kennel, the-shed, vet-clinic, ai-doghouse:** forms and documents only. A System Map view of each node would count
  ("Program PFDs … appear as pictures too"), once the map can open on one node. Or Astra decides A55 does not apply to them.
- **findastra** (profile repo): the profile page is on github.com, which project-image-generator does not open. Astra decides
  whether a profile screenshot is wanted, or whether A55 does not apply.
- **Skipped as nothing built:** the roadmap and seed pet programs (`pet-program-37` to `-77`, iron-gates, the-cats-closet,
  the-police-station, the-recovery-room), 4 files each.

## Done when
Each repo in the table has the pictures it needs on `main`, and a run of project-image-generator shows it as pass. Creative
projects need three pictures.

## Return
Commit the pictures in each repo on a branch with a PR. Update this card's What I did, set status: done, commit.
