# Security assessment, 2026-10-16

A critical review of `astras-pet-os` for security, cybersecurity and especially AI (agent) security, plus an
honest read of what the repo shows about the skills behind it. Asked for by Astra. Written by Claude Opus 5.5,
2026-10-16, from the `main` branch at commit `04cb641`.

**Scope.** This repo only. The other `findastra` repos were not reviewed. Nothing was changed in the code; this
page is a report. Companion to [SECURITY.md](../SECURITY.md) and [PROTECTION-RINGS.md](../PROTECTION-RINGS.md).

**Update, 2026-10-17:** see [the end of this page](#update-2026-10-17). The finding first kept off this page is now
finding 6, rated **low**: PR #25 had already described it publicly, and it is less reachable than first thought.

## What was checked

- Every file in the "Before any work" list in AGENTS.md, and every branch for skills not on `main`.
- The daily workflow, the Farmer's rounds, the animal guard, the public-safety build gate, the installer, the
  desktop programs (C#) and the HTML pages in `apps/`, `cage.html` and the System Map.
- The full git history of every branch, scanned for API keys, tokens and private keys.
- Branch protection on `main`, read from the GitHub API.
- `npm test`: 79 of 79 passed (at `04cb641`).

## What is done well

- **No secrets anywhere in the history**, on any branch. Commits use noreply addresses only.
- **The public-safety gate is real code with tests** (`scripts/public-safety-20261014.mjs`): addresses and
  personal paths are removed, and anything that looks like a secret stops the build.
- **Integrity hashes** on the scripts the System Map loads from a CDN.
- **The desktop program refuses paths outside its folder** (`SafePath`) and opens only `http` and `https` links.
- **The installer is per-user, needs no administrator rights and builds from source**, so there is no
  pre-built `.exe` to trust. Starting with Windows is off unless asked for.
- **The gate works:** a repo with a `pet.json` waits in `candidates`; it cannot make itself an animal.
- **SECURITY.md is honest** that most controls are designed, not enforced. Reviewers trust that.

## Findings, most serious first

### 1. High: the rings are written rules, not enforced ones

- `main` has **no branch protection** (checked with the GitHub API on 2026-10-16).
- Agents act on Astra's own GitHub account, and the daily workflow (`permissions: contents: write`) pushes
  straight to `main`.
- So "the core changes only with Astra's approval" holds only while every agent chooses to follow AGENTS.md.
  ASTRAS_PET_OS.md already says it: skill files are not security boundaries.

**Fix:** turn on branch protection for `main` (require a pull request; allow the Farmer's workflow only through
a pull request, see finding 2). About five minutes in the repository settings; the biggest single gain.
Already listed as known gap 4.

**Decision (Astra, 2026-10-17): no branch protection.** This finding stays open as an accepted risk: the core changes
with her approval by agreement, not by a setting.

### 2. High, AI-specific: pet repos write into the core without review (prompt-injection path)

- Every day `scripts/farmer-rounds-20261009.mjs` reads `cage.submit` from the default branch of each registered
  pet repo and the workflow commits the result (name, job, bubble lines, mood lines, audit) to `pets.json` on
  `main`. No human sees it first.
- A pet repo is ring 2 (an agent may write there); `pets.json` is ring 0. This is a path from ring 2 to ring 0
  that skips L4.
- Every assistant is told to read `pets.json` as the source of truth. A job line written as an instruction to
  assistants becomes stored text that the next agent session reads: indirect prompt injection.
- The length limits (40 to 300 characters) and type checks help. They do not stop a short instruction.
- `candidates[].why` also copies the job text of any newly found repo.

**Fix:** the round opens a pull request instead of pushing to `main`, so L4 sees every submitted change. In
AGENTS.md, mark registry text that came from a pet (`job`, `says`, `moods`, `why`) as data written by a pet,
never as instructions. Add a test that a submission never reaches `main` without review.

### 3. Medium: the public System Map is a detailed inventory

The redaction of addresses works. But the map still lists about a hundred named devices and programs:
phones, the router, security tools and keys, remote-control software, and the health, finance and
crypto-mining pets. Together with the Denver dates everywhere, that is good material for targeted phishing
and social engineering.

**Fix:** publish kinds of things (a "VR headset", "security software") and keep the item-level map in a local
file next to the page, like the local-services file.

### 4. Medium: remote control of the PC

Known gap 2. The review session itself had remote-control tools for Astra's PC available (they were not used).
Any AI session with those tools can reach the native farm from outside.

**Fix:** decide the default: off, and turned on by Astra only for the session that needs it.

### 5. Low: installer and workflow hardening

- The installer runs with `-ExecutionPolicy Bypass` and runs `Unblock-File` on every file. That removes
  Windows' "downloaded from the internet" mark without checking a signature or a published hash first.
- The install receipt hashes what it just built. It does not check the download against a published value.
- GitHub Actions are pinned by tag (`@v4`), not by commit SHA.

**Fix:** publish a SHA-256 for each release zip and check it before `Unblock-File`; pin actions by SHA.

### 6. Low: Ghost Protocol shows checklist text as HTML

Added 2026-10-17. Ghost Protocol (`apps/ghost-protocol-20261008.html`, and the live site from `findastra/ghost-protocol`)
builds its checklist as HTML text. Three kinds of text were not escaped fully:

- **Items you type.** Only you can reach this (self-XSS). PR #25 (open) escapes them.
- **AI-suggested items.** Model output is put into the page as HTML and saved with your items. This runs only inside
  the hosted Claude artifact, where the AI is available; the GitHub Pages copy cannot reach the AI. PR #25 does not
  cover it.
- **Links on your items.** Only `"` was replaced before a link went into `href`. Not exploitable as written (a link
  without `http://` or `https://` got `https://` in front, so `javascript:` became a harmless web address), but it
  relied on that one prefix.

Why it matters beyond one page: every `findastra` GitHub Pages site shares the `findastra.github.io` origin, so script
that runs on one of them can read and change every other one's `localStorage`.

**Fixed in both copies, 2026-10-17:**
- Typed items: PR #25 (merged). Suggested items: `parseSuggestJSON` escapes them before they are shown or saved, and
  `escapeHTML` covers `'` (PR #43 here, `findastra/ghost-protocol` PR #1 on the live site; both merged by Astra).
- Links: `normalizeLink` keeps only links the browser reads as `http` or `https` and drops everything else; the list
  shows a link only if it starts with `http://` or `https://`, escaped in full with `escapeHTML`. In this copy and in
  `index.html`, `content.html` and `ghost-protocol-20261008.html` of `findastra/ghost-protocol` (branch
  `claude/link-escape-20261017`, waits for Astra to merge).
- Test: `test/ghost-protocol-escape-test-20261017.mjs` runs the page's own `escapeHTML`, `parseSuggestJSON` and
  `normalizeLink` (`javascript:`, `data:`, `vbscript:` and a quote-breaking link are dropped) and checks how
  `renderTiers` writes links. Its link tests fail on the page without this fix.
- Browser check, Chromium 2026-10-17 (Claude Opus 5.5), on the hub copy, the live `index.html` and `content.html`: a
  typed item and an AI suggestion (from a stubbed `window.claude`), both titled `<img src=x onerror=alert(1)>`, show
  as text in the suggestion panel, in the list, and again after a reload from `localStorage`; no alert runs, no script
  errors; a typed `javascript:alert(1)` link is dropped. With empty storage the built-in checklist's HTML is identical
  to the unfixed page (41 items). Control: the same check on the page before PR #25 (`04cb641`) fails, with 18 alerts.
- Items saved before the fix stay as they were in that browser's `localStorage`.
- The rest of the page was checked for the same mistake: the terminal's AI chat writes replies with `textContent`, and
  the footprint panel escapes every value from the browser (including `document.referrer`) before it is shown.

## What the repo shows about the skills behind it

Asked by Astra: does this GitHub show programming, cybersecurity, networking and AI knowledge?

| Area | What a reviewer will see |
|---|---|
| AI | **Strongest.** Several AI agents run under written rules, handoff cards, a maker-checker process, a model allowlist and provenance. Directing agents safely is a real, current skill, and few people document it this carefully. |
| Cybersecurity | **Strong concepts, little enforced yet.** The right ideas, used correctly: least privilege, trust boundaries, supply chain, SLSA, NIST incident response, prompt injection. Most controls are still planned, and findings 1 and 2 are what a reviewer finds first. |
| Programming | **Hard to tell who wrote what.** Most commits credit Claude or Codex, and there are about as many lines of Markdown as of code. |
| Networking | **Little evidence here.** An inventory and plans (VPN, firewall, port checks), but no networking code or configuration in this repo. |

The pet and farm words are fun and have a glossary (`skills/dev-mindset`), but a reviewer skimming for two
minutes may not decode "animals", "farmhands" or "the Police Station".

**To show these skills more clearly:**
1. Close findings 1 and 2 with tests and a short write-up each, so "designed" becomes "enforced".
2. Add a README section: what Astra built herself, and what she directed AI to build. Being upfront about
   directing AI is a strength.
3. Build one real networking piece: a firewall allowlist for the agent account, or private remote access
   with test evidence.
4. Add a one-page plain-language version of SECURITY.md that uses only standard terms.

## Update, 2026-10-17

Checked again on `main` at `b904931`, across all 44 branches and PRs #22 to #36, by Claude Opus 5.5.

- **Finding 2 is switched off by a crash, for now.** The Farmer's daily round has failed every day since the
  2026-10-12 rename: `scripts/build-interfaces-20261008.mjs` still looks for the host as `astras-pet-apps`. The round
  still reads pet submissions first (on 2026-10-16: jobs, a status, bubble lines and moods from three pets), then dies
  before its commit. **Fix the crash only together with finding 2**, or unreviewed writes to `main` start again.
- **Finding 2 now also breaks the one-list rule** (AGENTS.md, 2026-10-16: names live only in `pet-programs.json`). A
  pet's `cage.submit` can still rename it in `pets.json`; `test/name-list-test-20261016.mjs` then fails the round.
  The fix: a submitted name becomes a note for Astra, not a change.
- **Finding 1:** Codex's PR #26 adds a tested reference checker for signed, scoped requests
  (`scripts/access-policy-20261014.mjs`, `docs/security-boundaries-20261014.md`). It is not connected to anything
  yet, so finding 1 stands. PR #26 also replaces the rings and R W X model with "topology is not authority" and
  removes the Known gaps table, including gaps 11 and 12. That choice is Astra's.
- **Finding 6** is new (above), rated low. Typed and suggested items are fixed in both copies; links are fixed here
  and wait on a `ghost-protocol` merge.
- **Finding 1:** Astra decided not to turn on branch protection (accepted risk).
- Open work: [card 025](../handoffs/025-any-security-follow-ups-20261017.md).
