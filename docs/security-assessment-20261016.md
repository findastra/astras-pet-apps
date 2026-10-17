# Security assessment, 2026-10-16

A critical review of `astras-pet-os` for security, cybersecurity and especially AI (agent) security, plus an
honest read of what the repo shows about the skills behind it. Asked for by Astra. Written by Claude Opus 5.5,
2026-10-16, from the `main` branch at commit `04cb641`.

**Scope.** This repo only. The other `findastra` repos were not reviewed. Nothing was changed in the code; this
page is a report. Companion to [SECURITY.md](../SECURITY.md) and [PROTECTION-RINGS.md](../PROTECTION-RINGS.md).

**One finding is not on this page.** It is a medium-severity, exploitable bug in a public pet program, and
SECURITY.md says a way to break in is never posted publicly. Astra has the details from the review chat. Fix
it in that pet's repo first (the hub only holds a copy), then add it here.

## What was checked

- Every file in the "Before any work" list in AGENTS.md, and every branch for skills not on `main`.
- The daily workflow, the Farmer's rounds, the animal guard, the public-safety build gate, the installer, the
  desktop programs (C#) and the HTML pages in `apps/`, `cage.html` and the System Map.
- The full git history of every branch, scanned for API keys, tokens and private keys.
- Branch protection on `main`, read from the GitHub API.
- `npm test`: 79 of 79 passed.

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
