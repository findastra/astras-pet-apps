# Flash Audit 2: GitHub Goldfish / GitHub Aquarium

2026-10-14, OpenAI Codex (GPT-6). Round awaiting owner's tool choices.
81 programs total; 79 after Goldfish. Farmer reviewed with unresolved implementation
gaps; reviewed does not mean fixed. Next: Chip / Data Dealer, number 3.

## Inspected evidence

- Goldfish main fetched at c4d07cff62b0dabd46ccdff89266733f7dda4939.
- Local branch codex/pet-preview-20261008 has seven modified tracked files and three
  untracked handoff files. No local edits were discarded, committed or merged here.
- Browser inspected https://findastra.github.io/astras-pet-os/apps/github-goldfish-20261008.html
  showing v0.1.0, public-only controls, no naming-correction panel.
- Local engine tests: 28 passing. Tests do not establish behavior of deployed v0.1.0.
- Nine PNG paths declared by sprite-20261008.json match main blob hashes.
- Viewed hub art/sheets/goldfish.png. This is the available source sheet, not proof
  that a running desktop host uses it. Newer desktop metadata on main needs reconciliation.

## Tools for owner review

No official tools list exists in pet.json. Proposed names for existing features:

- github-auditor: public-account audit; main also contains authenticated private-repo
  support, not verified on deployed page. Includes document, text, organization and
  account-consistency checks.
- naming-corrections: source feature for explicit repo-scoped remembered corrections;
  missing from deployed hub page.
- never-say-checker: source and deployed input for owner-entered prohibited words.
- report-exporter: source and deployed Copy report / Download report.md controls.

Approved manual procedure, automated interface not built: flash-audit.
Required planned tutorials: play-with-github-goldfish, care-for-github-goldfish.
These IDs remain proposed until the owner selects them; do not rename code yet.

## Exceptions and coverage

| Checks | Result | Finding |
|---|---|---|
| A01-A05 | Partial / Not verified | Nine referenced frames match main; source sheet viewed. Active desktop art, dimensions/transparency, transitions and approved visual identity not fully verified. |
| A06-A08 | Incorrect | Deployed heading remains GitHub Goldfish rather than program GitHub Aquarium; local instructions still describe Cage and old 32px rules. |
| A09-A10 | Partial | Page renders; required framework sections absent. Live audit execution not performed. |
| A11-A12 | Not verified / Missing | Native launch not exercised; deployed page lacks program-to-map navigation. |
| A13-A16 | Missing / Not verified | Repo/source/entry and sprite exist; main pet.json lacks audit, framework and official tools. Full topic/license/README audit deferred. |
| A17 | Incorrect | Local work uncommitted; source and hub deployment differ. Main includes private-repo support while deployed page says public only. |
| A18-A19 | Missing / Not verified | Tool IDs/inventory absent; engine tests pass locally, but end-to-end deployed run, exports and private-account behavior not verified. |
| A20-A24 | Missing | No per-tool left-side defect boxes, enforced OFF, L3 pet-icon chat, chat-created tools or checked-version readiness interface. |
| A25-A28 | Not verified | No account connected. Permission enforcement, failure recovery, undo applicability and cross-pet exchange not exercised. |
| A29-A32 | Missing / Not verified | No framework backlog, migration/import, current seat/status or passport UI observed. Trust/signatures not verified. |
| A33 | Pass | Existing registered pet, stable program 2. No new admission. |
| A34 | Partial | 28 local engine tests passed; no full build/runtime/deployment certification. |
| A35 | Pass | Findings and pending choices recorded here; report pushed to hub branch. |
| A36 | Not applicable | First-visit Farm tutorial is owned by Farmer; Goldfish still needs its own play/care tutorials. |
| A37-A40 | Missing | L3 play/care tours, grouping, cross-pet icon navigation and guided focus are absent from inspected page. |

## Next action

Owner chooses tool names/additions. Then save answer, push checkpoint, proceed to Chip.
Do not silently reconcile dirty Goldfish source or deploy an older copy over main.

## Owner approval and repair checkpoint

Astra approved all seven proposed names and requested fixes plus a real Release the
goldfish run. Regular tools: github-auditor, naming-corrections, never-say-checker,
report-exporter, flash-audit. Present play-with-github-goldfish and
care-for-github-goldfish separately under Tutorial tools from now on.

Live Release run ended at anonymous rate limit; old findings stayed visible. Those
counts are not this run's result. Repaired source hides stale reports, updates obsolete
hub/status/home-path rules and distinguishes partial coverage. Added local tool-state
cards and disconnected chat shell. 47 tests passed, independent source review completed.
Goldfish source branch: codex/flash-audit-20261014. Preserved existing changes at
37de7c6 and reconciled main at b0a6a60. The hub copy is updated on its branch only.

Still pending: real L3 connection choice, protected core enforcement, Farmer report
delivery, complete data migration/passport integration, revised UI live verification,
merge/deployment. Do not claim all findings fixed or move on as if round 2 is complete.

Owner clarified seats must be model-independent, not a choice of one hard-wired
provider. Supported adapter implementation is still required. Requested GitHub token
hover help and Clicker Training standard. Two-click action and "no cyberdeck chatbot"
meaning are pending clarification; do not alter native click bindings yet.

Latest click correction supersedes single-click opens-program: single click shows
the most important short emotion-linked message; double-click toggles ON/OFF, with
visibility vs execution awaiting answer. Global nine-emotion priority is not yet
fully specified; Farmer's existing sick/alarmed/worried/happy precedence is documented,
not misrepresented as a complete hierarchy. Flash Audit now includes A43.

Goldfish repair commits pushed: db76d36, whitespace follow-up 529e76e on
codex/flash-audit-20261014. 47 Goldfish and 124 hub tests pass. Neither branch deployed.
