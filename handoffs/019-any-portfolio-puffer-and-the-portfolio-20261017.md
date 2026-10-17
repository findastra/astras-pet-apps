status: open (waiting on Astra: read every employer page before it goes live)
for: any (Portfolio Puffer's chat)
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: skills/farm-security/SKILL.md section 5 (the portfolio exception), findastra/findastra.github.io README, findastra/github-goldfish AGENTS.md
---
## What I did
- **Astra's decision (L4, 2026-10-17):** her portfolio, `findastra/findastra.github.io`, is the one exception to
  "never write a legal name": it may name Audra and her employers, and it is the only place that connects Audra and
  Astra. Written into `skills/farm-security/SKILL.md` section 5 on branch `claude/chat-reconcile-20261017` (this repo).
- **Created `findastra/findastra.github.io`** (public, with Astra's OK). `main` holds only a README and `.gitignore`
  (commit `ed6ff07`). The site that had been built on Astra's PC with no git (cyber `index.html`, `parchment.html`,
  `drafts/`, `art/`, data files; 92 files, 3 MB) is on branch `claude/rescue-portfolio-20261017`, commit `44df106`,
  pushed as found. Privacy scan before the push: no surname, email, personal path or key. Astra merged it
  (findastra/findastra.github.io#1) on 2026-10-17.
- The PC folder `%USERPROFILE%\Documents\Astra's Pet Apps\findastra.github.io` is now that git repo, checked out on the
  rescue branch. Its files were last changed about 01:11 on 2026-10-17, so another chat may still be working in it:
  pull before editing.
- `profile-data.js` `positions` (one entry per employer, each with its own page under `work/`) is still empty.

## Task (from the original plan, 2026-10-08)
1. **Portfolio Puffer's loop:** read LinkedIn from Astra's own signed-in browser (no stored password), write a
  git-ignored `profile.local.json`, diff it against `profile-data.js`, and show Astra each change, old to new. Only
  what she approves is written, committed and pushed. When LinkedIn needs her to sign in, Puffer goes `sick`.
2. **Weekly audit:** a scheduled run of that loop plus the GitHub side, report in a git-ignored folder, never pushing
  by itself. Say plainly when LinkedIn was not refreshed that week.
3. **GitHub Goldfish:** its never-say check must stay silent on this one repo for Audra and the employer names, and
  still fire everywhere else. The list itself stays runtime-only (never committed). Tests for both directions.
4. Pictures for the portfolio come from Goldfish's planned `project-image-generator` by grant (decision of
  2026-10-17 on branch `claude/flash-audit-order-20261017`).

## Done when
Every employer page is hers word for word, Puffer's weekly proposal runs, and the
Goldfish exemption is tested.

## Return
Update `## What I did`, set the status, commit on a branch, PR for Astra.
