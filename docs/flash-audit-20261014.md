# Flash Audit: pet onboarding and review instruction sheet

Working name: **Flash Audit**. Owner: **GitHub Goldfish**, program **GitHub Aquarium**.
Tool label: `github-aquarium-v1.0-flash-audit-v1.0`.
By Astra. Compiled with OpenAI Codex (GPT-6), 2026-10-14.

This is a usable manual audit procedure and a specification for a future tool interface.
It is not an implemented automated auditor, deployed service, or security certification.
Use it for new pets, existing pets, and the restarted rapid-question review of every pet.
Goldfish owns the audit; the Farmer owns registry/admission coordination. No new pet is needed.

## 1. Source rules and precedence

Read the target repository's current AGENTS.md, CLAUDE.md, every applicable SKILL.md,
open handoffs, and pet.json before changing it. Fetch and inspect remote branches for
relevant unpublished work; record the branch and commit actually audited. Do not run
untrusted repository code merely to inspect it.

The sheet combines Astra's approved audit matrix and latest instructions with:

- [Pet files](../PET-FILES.md): required files, metadata, art, audit schedule, submission.
- [Pet Program Framework](../PET-PROGRAM-FRAMEWORK.md): page, tools, chat, backlog, data and links.
- [New pet or tool](../skills/new-pet-or-tool/SKILL.md): ownership and admission decisions.
- [Farm security](../skills/farm-security/SKILL.md) and [protection rings](../PROTECTION-RINGS.md).
- [Canonical architecture](../ASTRAS_PET_OS.md), [pet words](../PET-WORDS.md),
  [intelligence levels](../INTELLIGENCE-LEVELS.md), and [handoff rules](../skills/handoff/SKILL.md).
- [Security implementation limits](security-boundaries-20261014.md): planned enforcement
  must never be reported as deployed protection.

GitHub main source snapshot inspected: `04cb6416015f02478f716c0869f31066ff8133cd`.
The left-side manual checkbox refinement and selected names are on the Codex working
branch, checkpoint `6ecb54b`, not necessarily main. Re-read current sources each run.

Resolve conflicts explicitly: direct owner instructions take precedence; the canonical
architecture governs conflicting legacy product descriptions. The Cage is retired as
a product concept: preserve compatibility files but do not demand new Cage behavior.
Missing optional software that was never installed is asleep / "not on this PC",
not a defect. A selected required connection that needs the owner is a blocked check.
Do not overwrite approved artwork to satisfy older generic palette/accessory rules.
Keep stable IDs and compatibility filenames unless a migration is authorized.
If source rules remain contradictory, report the conflict rather than silently choosing.

## 2. Run procedure

1. Load the canonical numbered catalog and registry; preserve chosen names and stable IDs.
   Include registered, pipeline, seed and roadmap pets, with their stage shown honestly.
2. Select one pet. Record program/icon names, number, owner repo, branches/commits,
   local source, deployed URL/version, and what access is actually available.
3. Show its current icon and nine-emotion sheet. Inspect desktop, page and repo versions.
4. Run the matrix below. Store evidence for every result, including passes. Do not infer
   a working app from HTTP 200, a file's existence, a passing build, or a successful launch request.
5. Tell Astra only **Missing**, **Incorrect**, and **Not verified** findings. Do not list
   successful checks. Artwork and unresolved questions remain visible as review materials.
6. Ask rapid questions only for unresolved decisions: four name suggestions with a short
   explanation each plus free text; implemented vs approved-planned vs proposed tools;
   integrations and an add-your-own option. Keep existing choices unless Astra changes them.
7. Save answers immediately. Apply only authorized fixes; audit permission is not permission
   to connect accounts, send mail, delete data, install software, or grant access.
8. Recheck affected items, publish a branch checkpoint and record what remains. Advance
   through the list without marking unchecked items complete.

### Mandatory checkpoint and preview after every round

After **each round**, and after substantial owner corrections within a round:

1. Save decisions, evidence, unresolved questions, next pet number and remaining count
   to a dated repository audit record before relying on chat history. Preserve answers
   across context/token limits. Distinguish reviewed rounds from repaired applications.
2. Run checks appropriate to the changes, commit the round's authorized files and push
   to GitHub. Verify push success and record the branch/commit. If nothing changed,
   verify synchronization without making an empty commit. Do not reset other work.
3. Refresh the existing right-side preview after changing its displayed content, so
   Astra can inspect the result. Preserve entered data; do not reload a dirty form
   without addressing unsaved work. Keep the relevant preview visible for the round.
4. A public GitHub Pages view only changes after deployment. A branch push does not
   deploy or authorize merging. Refresh/check after confirmed deployment and say plainly
   when the public page remains old. For documentation-only changes, show the updated
   instruction/audit file; do not suggest the unchanged app has been updated.
5. Hand off the next round with exact progress and open decisions. Never count a
   Not verified check as passed merely to finish a round.

| A44 | Coin identity and geometry | Current exact pet artwork on both faces; gold side depth 5% of diameter. Verify side profile, front/back orientation, consistent program/map identity and no added sparkles. |
| A45 | Coin launcher and chat | Spinning bottom-right coin opens that pet's Cyber Deck chat; usable fixed hit area even edge-on, keyboard support, focus restoration, mobile safe-area and no obstruction of tools. Chip uses his original face artwork and standard Cyber Deck panel. |
| A46 | Coin hosting and provenance | Verify deployed dated asset URLs, canonical pet/asset mapping, approved source master and individual-repo copy/version. Animation is shared code, not a separate per-pet video. Public assets contain no private chat data. |
| A47 | Deep zoom and image quality | Inspect selected coin close-up; test source resolution, no forced 128px downsample, suitable filtering for pixel art, camera near-plane/minimum distance and no clipping or reversed faces. A larger bitmap alone does not add detail. |
| A48 | Motion and performance | Gold edge is shiny without sparkle particles; verify visible spin, reduced-motion static fallback, pause control, hidden-tab/offscreen suspension and hide/unhide cleanup without extra animation loops. |
| A49 | Coin consistency and runtime truth | Compare page/map assets and proportions; test real navigation and connected/disconnected chat honestly. Coin appearance does not establish an L3 backend or permissions. |

| A50 | Expandable tool bubbles | All new-program tools use compact rounded cards; only exact approved IDs remain visible collapsed; left ON/Sick controls appear inside the expansion. Verify keyboard expansion, independent toggles, persisted state, parent/child gates, visible status/version/actions when expanded, and settings revealed by Open tool. Keep child checks under approved parents and tutorials separate. Collapse must not cancel or run work. |

## 3. Complete audit matrix

| ID | Check | Evidence required / exception to report |
|---|---|---|
| A01 | Current icon | Show the actual image; identify desktop and page sources. Report absent, stale or inconsistent art. |
| A02 | Nine emotions | Show calm, blink, happy, curious, worried, sad, sick, shocked, asleep; inspect all frames for missing, duplicate, mislabeled or inconsistent expressions. |
| A03 | Emotion behavior | Verify each state is reachable and means the correct runtime condition, not just that its PNG exists. File names idle/alarmed/sleep map to calm/shocked/asleep. |
| A04 | Art publication | Compare local active assets with individual-repo blobs, including sheet, frames and sprite metadata. Report unpushed or stale art and invalid paths. |
| A05 | Art format and provenance | Check transparent 256px source frames, approved style/body/size, black outline, no unwanted sparkles, source/license, and owner exceptions. Separate source resolution from desktop display size. |
| A06 | Pet name | Compare mascot name across page, registry, map and metadata. Report conflicts, typos and placeholders. |
| A07 | Program name/version | Preserve chosen names; check versioned labels and stable numbers. Ask four suggestions plus custom only where undecided. |
| A08 | Purpose and scope | Compare intended job with actual behavior; distinguish program, runtime and harness. Flag overlaps and planned features claimed as built. |
| A09 | Program interface | Inspect a real interface and required framework sections. Flag missing page, placeholder, dead controls or incomplete blocks. |
| A10 | Website route | Open configured program URL, follow redirects and inspect destination. Flag repo links posing as applications, wrong apps, errors and unexplained auth gates. |
| A11 | Desktop launch | Exercise the actual pet's double-click and verify the intended interface appears. If unavailable, mark Not verified. |
| A12 | Map/catalog navigation | Check icon/program links, program-to-map node link, stable identity and correct relationships in both directions. |
| A13 | Individual repo | Verify repo association, source, entry point, metadata and artwork. Look at relevant branches before saying work is absent. |
| A14 | Required repo files | Check pet.json, sprite target, entry target, README, AGENTS.md, CLAUDE.md, LICENSE and applicable pet-app topic. |
| A15 | README and credit | Check how-to-run and Limits, public credit "A pet app by Astra", model/version/date, license, truthful status and naming exceptions. |
| A16 | Metadata and self-audit | Validate pet.json including job, runs_on, entry, sprite, status, framework, tools, links and audit cadence/subject/needs. Hatching/growing/grown must reflect evidence. |
| A17 | Git and deployment | Record dirty files, ahead/behind commits, pushed branch, merged state and deployed version separately. Do not reset/stash/discard another agent's work. |
| A18 | Official tool inventory | Separate implemented, owner-approved planned, and proposed tools. Record purpose, version, owner, permissions, dependencies and add-your-own decisions. |
| A19 | Tool behavior | Verify inputs, outputs, errors and intended actions for each tool. Use safe fixtures for changing actions; live checks require authorized scope. |
| A20 | Manual defect checkbox | Every tool has a left-side "Not working" checkbox, distinct from ON/OFF and automatic health. Report persists to backlog/Farmer; tests cannot silently clear it. |
| A21 | Tool OFF enforcement | Verify execution actually stops/prevents new work, state is controlled outside the tool, and security OFF cannot be self-reenabled. Report unsupported enforcement as a gap. |
| A22 | Chatbot and seat status | Click the exact pet-icon launcher; verify the shared chat panel, header Astra's Cyber Deck — [Pet name] Chat, actual L3 connection/model/task, consent, replies, close/reopen and honest disconnected state. A rendered panel alone is not a functioning chatbot. |
| A23 | Chat-created tools | Verify request capture, authorized agent dispatch, build progress, independent review, tests, version registration and list entry. No self-granted access. |
| A24 | Ready indicator | Green plus text refers to a checked version; connection and authorization are separate. Failures or unreviewed code cannot appear ready. |
| A25 | Integrations/accounts | Check supported services, feature detection, account selection, connection denial, expiry, disconnect and provider-specific limits. No connection from domain guessing alone. |
| A26 | Privacy and permissions | Check exact allowed data/actions, owner approvals, secret storage and untrusted inputs. No private data or credentials in public repos/reports. |
| A27 | Preview and recovery | For changes, verify appropriate preview/approval, undo or recovery, partial failures, retry safety and audit records. |
| A28 | Pet connections | Verify sender/receiver, purpose, granted scope, actual data flow, last exchange and independent connection OFF. Match registry relations and map. |
| A29 | Notes/backlog | Verify notes, screenshots, requests and defect reports persist, retain tool/version association, and reach the actual destination. |
| A30 | Data continuity | Verify export/import, schema version, backup/migration on update and persistence across versions. Private test data stays private. |
| A31 | Status and link labels | Check data owner, last entry, update/version, seat, map node, and links grouped by kind with origin/location/visibility labels. |
| A32 | Passport and release trust | Check provenance, signature claims, install/update history and recovery evidence. Planned signing is not verified signing. |
| A33 | Registration/admission | Check candidate/pipeline/registered stage, owner admission, pet-app discovery, registration handoff and dated submission. No automatic trust from discovery. |
| A34 | Generated artifacts/tests | Use canonical sources/builders; check generated registry/docs/art, documented build/check/tests, visual inspection and relevant runtime acceptance. |
| A35 | Handoff and unresolved work | Record exact evidence, commits, touched files, remaining issues, owners and next steps. Say explicitly what is only on a branch. |
| A36 | First-visit tutorial | The Farm has tutorial-tools and a reopenable first-time-here-tutorial. Its page tool box launches the L3 chatbot into that tutorial and retains a left-side Not working checkbox and separate ON/OFF switch. Verify OFF prevents launch/stops the active tour. |
| A37 | Play and care SOPs | Every pet has Play with and Care for numbered SOPs delivered in L3 chat. Click each page-listed tutorial tool; verify correct chat context, real steps, prerequisites, expected results, version and stop/help path. No standalone tutorial page or fictional steps for planned features. |
| A38 | Tool organization | Verify browsing by pet, subject category and nested groups, search and multi-category tags, while one canonical tool retains its identity/owner. Distinguish health category from software-health status. |
| A39 | Pet-icon navigation | Every cross-pet program hyperlink is the current pet icon, with accessible name, tooltip, keyboard focus and usable hit area. Check real destination, hosted/local assets and offline behavior where applicable. Missing program route shows unavailable, not a repo substituted as the program. |
| A40 | Guided focus and functioning tour | Exercise Next/Back/Pause/Resume/Exit. Only a step number and soft border/background glow appear at the real target; explanations remain in chat. Verify scroll/resize alignment, missing-target handling, keyboard access, reduced motion, and cleanup on completion/OFF. Verify actual user-visible results, not just source/tests. |
| A41 | Clicker Training | Every program has a bordered list of real desktop click bindings. One click shows the most important emotion-linked message; two clicks show/hide the Pet Program window (background work is controlled separately); three clicks runs an explicitly assigned quick tool. Verify sequence disambiguation, drag suppression, OFF/permissions and honest unavailable states before claiming native support. |
| A42 | Credential help | Adjacent (?) What is this hover/focus memo explains optionality, purpose, scope, storage and destination without exposing secrets. |
| A43 | Emotion/message hierarchy | Verify simultaneous conditions select one highest-priority unresolved message and matching emotion using explicit policy, not frame order. Test stale success, failure, owner-needed state, dismissal and cosmetic blink. Missing global hierarchy is Not verified, not an invented priority order. |

Harness seats are model-independent through supported authorized adapters. Do not
force a single provider choice or claim every model already connects automatically.

## 4. New-pet onboarding gate

Before creating anything, decide whether the work belongs to an existing pet. A new pet
needs a distinct program, data and schedule that no current owner covers. A tool belongs
to its parent program and gets no additional permissions merely by existing.

For an approved new pet:

1. Obtain required owner approval for a new repository/admission, paid art and connections.
   Reuse the canonical local checkout; work on an assistant branch.
2. Create required repo files and metadata, including a real entry and sprite file, audit
   block, framework/tool declarations and the pet-app topic. Rules link back to this hub.
3. Use lowercase dated names for new ordinary files. Required names such as pet.json,
   AGENTS.md, README.md and LICENSE conflict with the generic naming rule: surface that
   exception before creating them. Do not rename existing required files.
4. Keep art a draft until approved. Preserve approved reference sheets; never reroll the
   whole herd for one change. Follow the current art pipeline and Chip's native-art exception.
   Preserve Mommy's Mommies as one shared sprite. Use approved mood overlays where applicable.
5. Submit metadata changes through dated cage.submit for the existing compatibility path;
   leave a Farmer registration card. Discovery/pipeline presence does not grant access.
6. Have the Farmer coordinate registry/art/relations; owner approval precedes admission.
   Build generated outputs from canonical sources rather than editing generated files.
7. Run this audit, documented checks and relevant live acceptance. Unbuilt seed functionality
   is recorded as Missing (planned), not a fabricated runtime failure.
8. Commit/push the approved scope, record branch/commit and handoff, and distinguish merge
   and deployment. Do not mark grown merely because the files pass a static check.

## 5. Results and rapid-question format

Keep a private evidence ledger per run: run ID/date, pet/program number, check ID,
status (Pass / Missing / Incorrect / Not verified / Not applicable), evidence location,
source commit/deployed version, impact, proposed fix, owner decision and retest result.
Not applicable needs a reason. Missing access is Not verified, never Pass.
Do not publish personal paths, addresses, mailbox contents or credentials with evidence.

Owner-facing round:

Use a strict **Tools:** list with one exact tool name per line and its status.
List **Tutorial tools:** separately, currently Play with and Care for, rather than
mixing them into the regular tool inventory.
Where source has only a feature/button and no official tool ID, label the suggested
ID **proposed name for existing feature**. Keep implemented source, live deployment,
approved plans and new proposals distinct. Follow with exceptions keyed to tool name
or Program-wide, then a short keep/add/remove/rename question. Never substitute a
vague grouped description for the individual tool list.

> **Round N: icon name — program name**
>
> Current icon and labeled nine-emotion sheet (or Missing).
>
> **Exceptions:** check ID, Missing/Incorrect/Not verified, one plain sentence and next action.
>
> **Decisions:** only unresolved names, tools, integrations, artwork choices or scope.
> Give four explained name options and free text; allow adding tools in plain language.

If no exceptions remain, use one line: "No exceptions found in the checks completed."
Do not claim an unaudited pet, live interaction, security boundary or deployment passed.

## 6. Goldfish tool contract and remaining implementation

The manual procedure can be used now. Its future tool box must have the versioned label,
left-side Not working checkbox, enforced ON/OFF, scope selector, run/progress/cancel,
exception matrix, evidence links, review questions and exportable report. Account access
must be declared; read-only inspection is the default. Repair is a separate authorized action.

Record a planned tool entry in Goldfish's own pet.json and README when its repository
rules are read and integration work is performed. This sheet alone does not install that
tool, add an MCP endpoint, create a schedule, or modify Goldfish's individual repository.

## 7. Name suggestions (unselected alternatives)

Owner refinement, 2026-10-14: tutorial-tools belongs to The Farm; each pet owns its
Play with / Care for numbered SOPs, indexed by The Farm. Cross-pet navigation uses
icon hyperlinks throughout the programs. The shared framework defines these standards;
checks A36-A40 enforce them. Tutorials run in L3 chat, launched from page tool boxes
that retain manual health reporting and ON/OFF. This supersedes the earlier standalone,
agent-optional tutorial wording. These are requirements, not implemented UI claims.

- **Flash Audit**: the owner's working name; quick rounds backed by thorough checks.
- **Fin Check**: short and specific to GitHub Goldfish. Recommended pet-themed option.
- **School Inspection**: a school of fish reviewing the whole pet collection.
- **Pet Passport Check**: emphasizes identity, provenance and readiness, though the audit
  also covers behavior and tools beyond the passport.

Keep Flash Audit until Astra chooses otherwise; no renaming based on suggestions alone.

## Shared footer check A51 — 2026-10-14

Verify footer-template: one rounded bordered line, Made by Astra and valid YYYY-MM-DD date; icon-only GitHub, Pole TikTok (@astra_on_fire), VR TikTok (@findastra), and spinning Farmer coin linking The Farm. Check accessible names, focus, reduced motion, coin fit, narrow-screen scrolling, editor save/reset/export, and no executable link schemes. Record deployment evidence separately for the hub and each individual repo. Latest tool-card correction: collapsed bubbles show the tool name only; all ON/OFF, Sick, description and actions are inside the rounded expansion.
