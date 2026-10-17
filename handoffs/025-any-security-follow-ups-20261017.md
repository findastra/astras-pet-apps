status: open (waiting on Astra: branch protection on main; adopt or decline the security model in PR #26)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: docs/security-assessment-20261016.md, SECURITY.md, PROTECTION-RINGS.md, skills/farm-security/SKILL.md, PR #25, PR #26
---
## What I did
Astra asked (2026-10-16, from her phone) for a critical security and AI-security assessment of this repo, and whether
the GitHub shows programming, cybersecurity, networking and AI knowledge.

- **PR #24, merged to `main` with Astra's OK** (merge `8781573`, commit `075499f`): `docs/security-assessment-20261016.md`,
  known gaps 11 and 12 in `PROTECTION-RINGS.md`, a link in `SECURITY.md`, a credit line in `AGENTS.md`.
- **2026-10-17, branch `ccr-483ff706-pukle6`:** an update section in the assessment (below); this card; one table of card
  numbers across every branch in `handoffs/README.md`, guarded by `test/handoff-numbers-test-20261017.mjs`; the test
  count in `SECURITY.md`; the Flash Audit's visual-check range (A44–A52); dated counts in `docs/migration/PLAN.md`;
  the card-010 error in `INTELLIGENCE-LEVELS.md`.
- **Branch `claude/pole-puff-draft-20261012`:** its card `010-any-pole-puff-repo-20261012.md` renamed to
  `018-any-pole-puff-repo-20261012.md` (010 is Platform Platypus on `main`).
- Read only: every branch, PRs #22–#36, the last five runs of the Farmer's daily rounds and the failing job log.
- Nothing on Astra's PC was touched. The session had remote-control tools for it; they were used only to check
  whether the PC was online (it was not, last seen 88 hours earlier).
- **Chat Rat:** Astra asked for this chat to be recorded. It ran in the cloud, so Chat Rat's saver cannot see it. An
  import file in Chat Rat's format (`conversation-import-20261016.md`, source `claude-code-cloud`, id
  `astras-pet-os:session_01TguXHjbrVeHscuKMCGzJCp`) was built with Chat Rat's own parser and sent to Astra in the chat.
  It is not in any repo (Chat Rat's rule).

## What is not done
1. **Branch protection on `main`** (Settings → Branches → require a pull request). Only Astra can change it.
2. **The Farmer's daily round has failed every day since the 2026-10-12 rename.** `scripts/build-interfaces-20261008.mjs`
   still looks for the host as `astras-pet-apps`. Fix the crash **together with** finding 2 (the round opens a pull
   request instead of pushing to `main`, and a pet's `cage.submit` can no longer rename it, per the one-list rule).
   Fixing only the crash turns unreviewed writes to `main` back on.
3. **Ghost Protocol (finding 6, low):** PR #25 (open) escapes typed items. AI-suggested items still go into the page
   unescaped; that path runs only inside the hosted Claude artifact. Finish it on top of #25, here and in
   `findastra/ghost-protocol`.
4. **PR #26 (Codex)** replaces the rings and R W X model with "topology is not authority" and removes the Known gaps
   table, including gaps 11 and 12. Astra decides; then gaps 11 and 12 either stay or move to the new page.
5. When PR #23 or #26 merges, rename its `012-security-enforcement-and-pet-catalog-20261014.md` to `017-…`.
6. Findings 3 (public map inventory), 4 (remote control default) and 5 (installer and Actions hardening) are open.
7. **Chat Rat:** on the PC, put `claude-code-cloud-conversations-20261017.json` (sent in the chat) in
   `%USERPROFILE%\Documents\Chats\inbox` and click **Save missing chats**. Chat Rat's saver is only on its branches
   (`codex/chat-rat-save-20261016`, `claude/missed-search-20261016`), not on its `main`.
8. This branch (`ccr-483ff706-pukle6`) is pushed but not merged into `main`, and has no pull request yet.

## Done when
Every item above is done or answered, and the assessment's update section says so.

## Return
Update `## What I did`, set `status: done`, commit on a branch.
