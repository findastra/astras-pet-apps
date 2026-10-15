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
