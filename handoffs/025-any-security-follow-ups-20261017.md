status: open (findings 3 to 5 left; waiting on Astra: merging the Farmer's round fix, and the security model in PR #26)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: docs/security-assessment-20261016.md, SECURITY.md, PROTECTION-RINGS.md, skills/farm-security/SKILL.md, PR #26
---
## What I did
Astra asked (2026-10-16, from her phone) for a critical security and AI-security assessment of this repo, and whether
the GitHub shows programming, cybersecurity, networking and AI knowledge. This card was first numbered 019; another
chat took 019 at the same time, so it is 025 (handoffs/README.md, "Card numbers on every branch").

- **PR #24, merged to `main` with Astra's OK** (merge `8781573`, commit `075499f`): `docs/security-assessment-20261016.md`,
  known gaps 11 and 12 in `PROTECTION-RINGS.md`, a link in `SECURITY.md`, a credit line in `AGENTS.md`.
- **PR #25 merged with Astra's OK, 2026-10-17** (merge `4c35829`): the CodeQL fixes from another Claude chat, including
  escaped typed items in Ghost Protocol.
- **2026-10-17, branch `ccr-483ff706-pukle6`:**
  - the assessment's update section and finding 6 (rated low);
  - one table of card numbers across every branch in `handoffs/README.md`, guarded by
    `test/handoff-numbers-test-20261017.mjs`. `main`'s second card 020 renamed to 021 (its two references updated);
  - **finding 6 fixed in the hub copy:** `apps/ghost-protocol-20261008.html` escapes AI-suggested items in
    `parseSuggestJSON`, and `escapeHTML` covers `'`. Guarded by `test/ghost-protocol-escape-test-20261017.mjs`, which
    fails without the fix;
  - counts with dates in `SECURITY.md` and `docs/migration/PLAN.md`; the Flash Audit's visual-check range (A44–A52);
    the card-010 error in `INTELLIGENCE-LEVELS.md`.
- **`findastra/ghost-protocol`, branch `claude/custom-item-escape-20261017`, PR #1:** commit `2fc196c` adds the same
  AI-suggestion fix to `index.html`, `content.html` and `ghost-protocol-20261008.html`, on top of the typed-item fix
  (`17939b4`, another chat). Checked in Chromium: before the fix a suggested `<img onerror>` ran in the panel and in the
  saved list; after it, it is text. Each page loads without errors and shows 41 items, like `main`. **Not merged:** this
  session's safety check stopped me merging my own change to the live site without review. Astra merges it.
- **Branch `claude/pole-puff-draft-20261012` (PR #8):** its card renamed from 010 to 018 (commit `23a27a6`); 018 is now
  also used by PR #37, so the table gives Pole Puff **024**. Rename it to 024 when PR #8 merges.
- Read only: every branch and PR, the Farmer's daily-round runs and the failing job log.
- Astra's PC was not touched. Remote-control tools were used only to see that the PC was offline (last seen 88 hours
  earlier).
- **Chat Rat:** the chat ran in the cloud, so Chat Rat's saver cannot see it. An import file in Chat Rat's format
  (`conversation-import-20261016.md`, source `claude-code-cloud`, id `astras-pet-os:session_01TguXHjbrVeHscuKMCGzJCp`)
  was built with Chat Rat's own parser and sent to Astra in the chat. It is not in any repo (Chat Rat's rule).

- **2026-10-17, later, branch `claude/tender-gauss-m2nbhp` (Claude Opus 5.5): item 1 below, the Farmer's round and
  finding 2 (known gap 11).** Pull request #46; not on `main` until Astra merges it. Test runs 8 and 9 (workflow_dispatch): run 9 pushed `farmer/rounds-20261017` and GitHub refused to open its pull request until Astra allows Actions to create pull requests (Settings > Actions > General).
  - `scripts/build-interfaces-20261008.mjs`: the Farmer's desk finds the host by role (`petFor`), not by the old repo
    name; the desk file name and its browser-storage key keep `astras-pet-apps` so saved notes survive. This was the
    crash behind every failed run since the rename (runs 3 to 7).
  - `scripts/farmer-rounds-20261009.mjs`: `adoptSubmission` no longer takes `pet` (a name); it becomes a note in the
    round's report and pull request.
  - `.github/workflows/farmer-daily-rounds.yml`: pushes to `farmer/rounds-YYYYMMDD` and opens a pull request into the
    branch it ran on (`main` on the schedule), closing an older open round as replaced; never pushes to `main`;
    `permissions: contents: write, pull-requests: write`; checkout and setup-node pinned by commit SHA.
  - `test/farmer-rounds-pr-test-20261017.mjs` (6 tests, which fail on the old code): no push to main, minimal
    permissions and SHA pins, a submission cannot rename a pet (and the one-list test still passes), a whole round
    with renaming submissions, a visibility change is reported, the desk builder finds the host.
  - The first test run of the repaired round (run 8) found `data-dealer` and `voicemeeter-bug` **public on GitHub**
    though pets.json says private (PLAN.md decision 2). The round writes what GitHub says, and three old tests that used
    Chip as the private example failed. Those tests now set up their own private pet, and the round names every
    visibility change in its pull request. **Waiting on Astra:** should those two repos be private again?
  - Docs: the pet-written-data line and the rounds line in `AGENTS.md`; `PET-FILES.md` (rounds step 5, submissions);
    `skills/handoff/SKILL.md` (names change only in pet-programs.json); gap 11's status in `PROTECTION-RINGS.md` (only
    that cell: PR #26 removes the whole table, so whichever merges second resolves it); finding 2 and its update in the
    assessment; the Farmer's row in `INTELLIGENCE-LEVELS.md`.

## Decisions
- **Branch protection on `main`: no** (Astra, 2026-10-17). Finding 1 stays open as an accepted risk: core changes merge
  with her approval by agreement, not by a GitHub setting.

## What is not done
1. ~~The Farmer's daily round has failed every day since the 2026-10-12 rename.~~ Fixed together with finding 2 on
   `claude/tender-gauss-m2nbhp` (above). **Waiting on Astra:** merge it. If GitHub refuses to let the round open its
   pull request, tick Settings > Actions > General > "Allow GitHub Actions to create and approve pull requests".
2. **Merge `findastra/ghost-protocol` PR #1** (Astra), so the live site has finding 6's fix.
3. **PR #26 (Codex)** replaces the rings and R W X model with "topology is not authority" and removes the Known gaps
   table, including gaps 11 and 12. Astra decides; then gaps 11 and 12 either stay or move to the new page.
4. Renames when branches merge: Codex's `012-security-enforcement-…` → 022 (PRs #23, #26); Halo List's `013-…` → 023;
   Pole Puff's `018-…` → 024 (PR #8).
5. Findings 3 (public map inventory), 4 (remote control default) and 5 (installer and Actions hardening) are open.
6. **Chat Rat:** on the PC, put `claude-code-cloud-conversations-20261017.json` (sent in the chat) in
   `%USERPROFILE%\Documents\Chats\inbox` and click **Save missing chats**. Chat Rat's saver is only on its branches
   (`codex/chat-rat-save-20261016`, `claude/missed-search-20261016`), not on its `main`.

## Done when
Every item above is done or answered, and the assessment's update section says so.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
