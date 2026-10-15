status: open
for: any
from: OpenAI Codex (GPT-6), 2026-10-14
needs: AGENTS.md, skills/farm-security/SKILL.md, docs/security-boundaries-20261014.md
---
## What I did

Repo findastra/astras-pet-os, branch codex/identity-bound-access-20261014, based on 04cb641.
Canonical local copy: %USERPROFILE%/Documents/Projects/astras-pet-os. Implementation is the commit containing this card.

- Added scripts/access-policy-20261014.mjs: fail-closed Ed25519 request verification, exact subject/action/resource grants, owner approval plus four reviewer controllers for elevated actions, expiry/revocation checks, nonce-consumption adapter contract. No privileged executor or network listener.
- Added 38 adversarial tests in test/access-policy-test-20261014.mjs. Separate read-only checker found a shared maker/owner key alias flaw; fixed duplicate-key enrollment and valid-signature regressions. Checker independently reran 38/38 and marked READY_FOR_REVIEW.
- Corrected topology/access claims in the map template, PROTECTION-RINGS.md and repo-owned skills. Updated SECURITY.md and INTELLIGENCE-LEVELS.md with implementation limits. Reject malformed repository identifiers in the participating animal guard.
- Read Astra's supplied October 14 phone handoff. Intel Owl is planned seed #81, distinct from Cipher Owl and Skill Scout. No new repos, installs, connections or production permissions.
- Map now reconciles the full numbered catalog; added generated pet-catalog-20261014.html with all programs, existing icons, stages and draft names. 81 programs, 13 assigned names, 68 unassigned program names; #77's mascot remains unnamed. Suggestions: Intel Owl / Threat Observatory; Vet Vole / The Triage Desk. No proposed names auto-assigned.
- Tests: metadata build, full Node test suite (121 passing), check-cage (19 registered frame sets), generated-script syntax checks. The legacy check counts registered art, not all planned programs.

## Not done

- Reference verifier is NOT production enforcement. No protected enrollment, WebAuthn owner UI, broker account, durable replay store, execution adapters, OS/network isolation, off-host audit or GitHub branch protection configured here.
- No merge or public deployment. Core merge requires Astra's approval under skills/farm-security/SKILL.md.
- Browser rejected the local file: preview URL under its protocol policy. No workaround attempted. Visual/phone acceptance outstanding; Astra can open the generated file directly.
- Phone handoff uses ASTRA_PET_OS; repo specifies ASTRAS_PET_OS. Resolve with Astra before renaming.
- Landing page with bottom FAQ from phone handoff remains separate work, not published here. No reminder recreated.

## Task

Review this branch and obtain owner merge approval. Then implement the deployment gates in docs/security-boundaries-20261014.md as separate reviewable slices, starting with protected identities and explicit recovery. Do not expose the reference verifier as a live service. Preserve other agents' work.

## Done when

Owner-reviewed merge and public preview verified; catalog names chosen by Astra; enforcement demonstrated with restart/concurrency/revocation/OS-bypass tests, not just unit tests or documentation. Record exact runtime evidence for each gate.

## Return

Update this card with commits, tests, deployment evidence and remaining limitations; do not mark complete while deployment gates remain open.

## Follow-up: provider rings and interaction stability

2026-10-14, OpenAI Codex (GPT-6): owner requested OpenAI and Anthropic labels, independent optional Codex/Claude Code rings and freeze fixes. Removed the shared seat/donut. Added planned direct and application-assisted routes; neither bypasses authorization. Preserved stable node IDs. Replaced invisible connection tubes with polyline picking, coalesced hover events, clear hidden focus, release navigation on pointer cancellation/blur, bounded render rate/pixel ratio. All 124 tests pass, including 500 hide/show cycles and a 1,000-event hover burst. Generated JavaScript parses. Actual browser freeze was not reproduced; live visual/performance acceptance remains open. Same review branch; no main merge.
