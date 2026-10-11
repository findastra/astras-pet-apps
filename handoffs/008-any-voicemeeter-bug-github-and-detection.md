status: open (steps 1-2 done; step 3 waits on the next scrambled-audio event)
for: any (claude, codex)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-11, working with OpenAI Codex (GPT-6) on Astra's PC
needs: pets.json (voicemeeter-bug entry), PET-FILES.md, skills/handoff/SKILL.md, the Bug's local repo on Astra's PC
---
## What I did

All on 2026-10-11, America/Denver time.

**Finding him.** Voicemeeter Bug was made by OpenAI Codex (GPT-6) on 2026-10-08. His registry
entry and art only existed on the unmerged branch `claude/roam-free-wip-20261009` (commit
`a287c08`), so main and the Cage did not list him. His Windows app has never been on GitHub. It
lives on Astra's PC at `%USERPROFILE%\Documents\ChatGPT\Voicemeeter Bug\`.

**Hub (this repo), on `main`:**
- Commit `973798f` "Bring Voicemeeter Bug home to the Cage", pushed to `main` with Astra's OK
  (fast-forward from `44cf7e5`). Branch `voicemeeter-bug-home` points at the same commit.
  - `pets.json`: added `voicemeeter-bug` after Project Parrot (pet #19), `kind: "bug"`,
    `status: "growing"`, `published: false`, weekly `audit` block.
  - Copied unchanged from `a287c08`: `apps/voicemeeter-bug-20261008.html`,
    `art/frames/voicemeeter-bug/*-20261008.png` (9 moods), `art/sheets/voicemeeter-bug-20261008.png`.
  - `scripts/generate-pets.mjs`: restored his art prompt from that branch.
  - `test/cage-controls-test-20261008.mjs`: the bug is caged during the two zone/flock tests.
    The fish and birds chase bugs by design (`cage_life.chases`), which pulled them out of the
    zones those tests measure. The real Cage still lets them chase him.
  - Rebuilt with `npm run build`. `npm test` passed 62/62, five runs in a row. `npm run check` reported 19 pet apps.
- This commit: this card, its README row (plus the missing row for card 007), and the
  `## What I did` rule in `skills/handoff/SKILL.md`.

**On Astra's PC (Codex did these with full access, at my request):**
- Launched `voicemeeter-bug-20261008.exe` standalone at about 00:52. The desktop pets took it over in
  hosted mode when they restarted.
- In `%USERPROFILE%\Documents\Projects\findastra-pet-apps` (branch `codex/astras-pet-apps`,
  tracks `origin/main`, was clean): ran `git pull --ff-only` to `973798f`, reopened
  `cage.html`, and restarted `bin\desktop-pets-20261008.exe`.

**The missed failure (about 02:19).** Astra's headphones went scrambled or low-quality and the Bug did
not react. Cause: the Bug only watches selected Windows output devices for removal and reconnection
(snapshot every 5 s). It never inspects the audio itself, so scrambled sound with no device
event has no trigger. A manual repair was clicked at 02:20:20; Voicemeeter accepted the restart
command (result 0), but nothing confirms the sound came back clean. Cooldown was not the cause.

**Bug diagnostics (Codex, OpenAI Codex GPT-6), local only:**
- Local git repo in `%USERPROFILE%\Documents\ChatGPT\Voicemeeter Bug\`, commit
  `a9dcb50f2eafec2de054f6afb4cddcaa6138f3da` (verify the hash with `git log -1` there). **No
  remote, not pushed.**
- Added `telemetry-log-20261011.cs` and `telemetry-log-tests-20261011.cs`. A heartbeat is written about every 5 s
  (watcher alive, selected device and state, sample rate, last device event, cooldown or
  suppression reason). Each manual repair writes a snapshot before and after. Status text now
  reads "Watching device reconnects". Repair triggers, cooldowns and the restart command are unchanged.
- Log: `%LOCALAPPDATA%\findastra\voicemeeter-bug\watcher-YYYYMMDD.jsonl`, 2 MiB per file,
  four files max (8 MiB).
- Also added README.md ("*A pet app by Astra.*"), pet.json with an audit block, AGENTS.md,
  CLAUDE.md, LICENSE and .gitignore (bin, logs and exes excluded). 25 files in all.
- Tested: 123 self-test assertions passed (71 recovery, 52 logging, fake audio APIs). 26 live
  heartbeats were confirmed by 02:41:38 with no write errors. Hosted mode is running with one watcher
  (PID 8408 at the time). No audio restart was triggered while installing it. A privacy scan of the
  25 files found no keys, personal paths or usernames.

**Repo (02:44-02:49, Astra approved):**
- Codex created `findastra/voicemeeter-bug`: **private**, topic `pet-app`, branch `master`,
  pushed commit `a9dcb50f2eafec2de054f6afb4cddcaa6138f3da` (25 files). Astra authorized the GitHub
  CLI's extra Workflow permission when it asked for it. The repo already existed as an empty public repo, and Codex made it private
  before pushing. The privacy scan passed across the history and all 25 files.
- Hub: `pets.json` now has `published: true` and `visibility: "private"` for the Bug. Rebuilt and tested (this commit).
- 02:56: Codex reviewed, committed and pushed the five newer local files (`README.md`,
  `audio-recovery-20261008.cs`, `audio-recovery-tests-20261008.cs`, `pet.json`,
  `voicemeeter-bug-20261008.cs`) to `master` as `0dd67cd` "Fix recovery policy resets and hosted
  alias (OpenAI Codex GPT-6)". Build, 138 self-test assertions and privacy scan passed. Nothing
  is left uncommitted in the Bug's folder.

**Not done:**
- No automatic detection of scrambled audio. That needs evidence from the next failure.
- No live listening test of a repair.

## Task
1. ~~Done 2026-10-11.~~ With Astra's OK, create **private** `findastra/voicemeeter-bug`, add the `pet-app` topic, and push
   the local repo above from Astra's PC. Codex there can run `gh repo create`. Re-run the privacy
   scan before pushing.
2. ~~Done 2026-10-11.~~ In this hub, set the `voicemeeter-bug` entry to `published: true`, `visibility: "private"`,
   and update its note. Then run `npm run build`, `npm test` and `npm run check`. Leave a `farmer-register` card only if the
   Farmer's round needs one.
3. The next time the audio scrambles, Astra clicks the Bug. Read the before/after snapshot and
   the heartbeats around it in the log. Find a signal that changes when the audio is scrambled and the device
   stays connected, and only then design automatic detection. Do not shorten cooldowns or change
   process ownership; that does not fix the gap.

## Done when
The Bug's source is in `findastra/voicemeeter-bug` (private), the hub entry says so, and either
automatic detection is built from a captured failure or this card names the signal still missing.

## Return
Update `## What I did` with your own explicit list (repo, commits, files, paths, tests, what is
not done), set the status, commit on a branch and open a PR. Push to `main` only with Astra's OK.
