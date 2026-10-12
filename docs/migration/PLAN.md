# ASTRA_PET_OS migration plan

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-11. Astra asked for it to be pushed on 2026-10-11; the **open
decisions below still need her answers** before any step that depends on them. Nothing below
is built yet. Architecture: [docs/architecture/ASTRA_PET_OS.md](../architecture/ASTRA_PET_OS.md).
Evidence: [AUDIT.md](AUDIT.md), [GAP-ANALYSIS.md](GAP-ANALYSIS.md).

## Ground rules for every step

- Small slices, each with its own tests and a demonstration. Mock screens never count as done.
- Ask Astra first for: new GitHub repos, publishing anything, accounts or paid services
  (including a private-network service such as Tailscale), installing software, transferring
  repos, deleting or force-pushing, and paid art generation.
- `astras-pet-apps` stays the development repo. It is not renamed or replaced until Astra
  decides how to split it.
- Existing pet code, names and art are kept. Nothing is deleted because a list was incomplete.
- Status shown anywhere must be true: unknown and stale are shown as unknown and stale.

## Decisions Astra needs to make

1. **Approve this plan**, or say what to change.
2. **Visibility:** `data-dealer`, `voicemeeter-bug` and `rift-rabbit` are public on GitHub but
   were meant to be private (AUDIT.md). Make them private, or record them as public?
3. **Chip and CHIP:** is Chip still the Data Dealer pet, or is CHIP a separate confidential
   project that no pet represents?
4. **Raspberry Pie:** one name for `raspberry-berry` ("Raspberry Pie", "Raspberry Pi" or
   "Raspberry Berry")?
5. **Private access for phones and tablets:** Tailscale (free personal plan, needs an account
   and the app on each device) or another VPN you already use?
6. **Where the Farm runs first:** your Windows PC (simplest; off when the PC is off) or a home
   server / Raspberry Pi you already have?
7. **The unmerged 2026-10-09 branch** (`pets-roam-life-20261009`, never pushed): drop it, or
   keep only its request-log idea as input to the Farm inbox (recommended)?
8. **Seeded pets:** jobs for Procreate Panda, Skill Scout and PSC Sealion (and what PSC
   stands for). Decided 2026-10-12: Pole Puff manages Astra's Infinite Pole and Piranesi Nessi
   manages Piranesi House.
   (Passport Panda's new name is decided: **Passport Pelican**.)

## Repositories: actual and proposed

| Repo | Today | Proposed |
|---|---|---|
| `findastra/astras-pet-apps` | Development hub, public | Stays the development repo during migration |
| `findastra/astras-farm` | Does not exist | First-party Farm app/site and official catalog. Create after the first slice works, with Astra's OK |
| `findastra/astras-kennel` | Does not exist | Community catalog from the registry starter (renamed from `astra-pet-registry`). Create when there is a submission flow to test |
| `findastra/astra-pet-sdk` | Does not exist | Split out once contracts stop changing; until then `contracts/` and `sdk/` live in the hub |
| One repo per pet | 34 pet repos exist | Keep; add a SemVer manifest to each over time, not all at once |

## Retiring the Cage

| Part | Fate |
|---|---|
| `cage.html` (enclosure, door, page roaming) | Frozen now: no new features. Removed in Phase 3 once the Farm shows every pet. Kept in Git history |
| `cage_life` movement rules in `pets.json` | Move to the desktop host (Phase 7), where pets really roam |
| `cage-data.js`, `npm run build` | Become the Farm's generated pet data in Phase 3 |
| Mood buttons, bubble lines, `MOOD-KEY.md`, `PET-WORDS.md` | Keep; they serve the Farm cards and the desktop |
| BSOD guest | Desktop only (already docked there) |
| `cage.submit` in each pet's `pet.json`, `check-cage.mjs`, the word "Cage" in rules | Renamed in Phase 1 with a compatibility period, so pets that still say `cage.submit` keep working |
| App pages in `apps/` | Stay as each pet's local program; the Farm links to them as programs |

## Phases

| Phase | Outcome | Proves |
|---|---|---|
| 0 Audit | This plan, the audit and the gap analysis | (done when Astra approves) |
| 1 Contracts | JSON schemas for pet manifest (SemVer), program, project, task, message envelope, health; contract tests; one working Goldfish release comparison | G (part), I (part) |
| 2 Program Manager | Program records for the Farmer, the Farm and Deck Duck; web and Windows adapters (`open`, `getStatus`, `getHealth`) | C (part) |
| 3 The Farm, first slice | See below | A, D (part) |
| 4 Workers | A worker for Deck Duck and one for the Farmer, each with its own inbox, schedule and health; keep running while the Farm and Farmer are closed | B (part), C |
| 5 Harness | One agent framework chosen after a short comparison against Node and C#; observe → verify loop for Deck Duck | B, F |
| 6 Pet-to-pet | Deck Duck asks Patch Cat for diagnostics with the typed envelope | B |
| 7 Desktop | Tray double-click = herd, triple-click = lineup; cross-monitor roaming; desktop moods from real status | E |
| 8 More hosts and pets | Home server or Pi host; the v5.2 pets in the order v5.2 gives | M–R |

Kennel, marketing site and Farmer's pet incubation (G, H, J, L) start after Phase 3 proves the
Farm, because they all list or create Farm cards.

## First vertical slice (Phases 1–3)

**Goal:** the Farm shows the Friendly Farmer and Deck Duck as cards with real links and an
always-visible text box; a message typed under Deck Duck gets a durable receipt; it works from
a phone over private access.

- **Server:** Node with built-in modules only (`node:http`, `node:sqlite`, both in the Node 24
  already on Astra's PC), keeping the repo's no-dependency rule. Runs on the host Astra picks
  (decision 6).
- **Storage:** one SQLite file outside the repo: programs, messages, receipts, sessions.
- **Access:** listens only on the private network (decision 5) over HTTPS; each device signs in
  once and can be revoked. No public port.
- **Cards:** generated from `pets.json` plus Program Manager records: picture, name, purpose,
  status (unknown until a worker reports), Open Program (web link, or "Available on Windows
  host"), Open Pet Console, text box, honest receipt ("queued for Deck Duck", never "done").
- **Tests:** contract tests for every schema; server tests for receipts, auth refusal, size and
  rate limits; a browser test at phone, tablet and desktop widths; then real-device checks on
  Astra's phone and iPad.

## Who edits what (Claude and Codex in parallel)

| Area | Owner | Notes |
|---|---|---|
| `contracts/`, `core/`, `apps/farm-web/`, `docs/migration/`, tests for those | Claude | |
| `scripts/desktop-pets-*.cs`, `desktop-art/`, `build-desktop-pets-*.ps1` (future `apps/desktop-host/`) | Codex | Codex has been doing the desktop work |
| `pets.json`, `AGENTS.md`, `CLAUDE.md`, `handoffs/` | Shared | One change per commit, pull first, never rewrite another assistant's lines |
| Each pet's own repo | Whoever holds that pet's open handoff card | |

## Seeded pets (Astra, 2026-10-11)

Approved names with nothing built, recorded under `seeds` in `pets.json`. A seed is not a pet app
and is not counted. It moves to the pipeline when it gets a repo, then to the Farm like any pet.

| Seed | What is known | Next step |
|---|---|---|
| Pole Puff | Manages Astra's Infinite Pole (`astras-infinite-pole`); confirmed by Astra 2026-10-12 | Repo plan with Astra's OK |
| Procreate Panda | Named after Procreate | Job |
| Skill Scout | Name only | Job |
| PSC Sealion | Name only | What PSC means; job |
| Platform Platypus | Local draft app on Astra's PC with `pet.json`: checks a page on iPhone, Android, iPad and desktop | Repo with Astra's OK |
| Piranesi Nessi | Manages Piranesi House (`piranesi-house`); confirmed by Astra 2026-10-12 | Repo plan with Astra's OK |
| Claude Bot | Already in the pipeline (`claude-bot`, cards 001–003) | Cards 001–003 |
| Spoonfed Sugarcube | Already in the pipeline (`spoonfed`, card 009) | Card 009 |

**Rename (decided by Astra, 2026-10-11):** Passport Panda is now **Passport Pelican**, because
Procreate Panda takes the panda. Its v5.2 job and privacy rules are unchanged.

## Acceptance test matrix

Status today: **not started** for every row.

| ID | Demonstration | Evidence that counts | Phase |
|---|---|---|---|
| A | Farm shows Farmer, Deck Duck, Patch Cat with text boxes and real links; message under Deck Duck gets a durable receipt; offline pet stays queued | Server test + browser test + recorded run | 3–4 |
| B | With Farm and Farmer closed, Deck Duck finds a real issue on schedule, asks Patch Cat, verifies, saves a report | Worker logs, stored report, Farm shows it after reopening | 4–6 |
| C | Program Manager lists Farmer and the Farm; Farmer restarts without stopping others or duplicating tasks | Supervisor test with idempotency keys | 2–4 |
| D | Android, iPhone, iPad sign in over private access, submit, approve, open web targets, see Windows-only apps handled honestly; unauthenticated clients refused | Real-device checklist + auth tests | 3 |
| E | Tray single/double/triple/right click; cross-monitor roaming; hiding visuals keeps work running | Desktop self-test + owner check on a multi-monitor PC | 7 |
| F | Unapproved destructive action blocked and audited; low-risk diagnostic allowed; prompt injection does not bypass permissions; budgets enforced | Policy unit tests + injection fixtures | 5 |
| G | Farmer scaffolds a pet with a valid manifest and version, tests pass, asks approval, registers it; no repo created without OK | Scaffold test in a temp folder | 5+ |
| H | Farm and Kennel stay separate; community owner keeps control; consent needed to move a pet to official | Catalog tests | after 3 |
| I | Goldfish tells a release from a commit, flags outdated installs, shows true last-checked times, never runs untrusted code | Fixture repos with tags and commits | 1, then 5 |
| J | Approved marketing change: Farmer coordinates, Browser Bat checks links and mobile layout, Test Tortoise runs checks, Goldfish supplies versions; audit trail | Website CI run | after 3 |
| K | Data Dragonfly reaches only authorised CHIP/Data Dealer data | Permission tests (needs decision 3) | 8 |
| L | Install a chosen subset of pets; core security still enforced | Install test with two pets | after 4 |
| M | Linux Penguin inspects a Linux host, explains commands, respects approvals | Test on a Linux VM or Pi | 8 |
| N | Test service deployed with TLS/private access, health checks, recovery; no public admin | Deployment test | 8 |
| O | White Hat Weasel and Port Spider refuse out-of-scope targets; useful findings in scope | Scope tests on owned lab hosts only | 8 |
| P | Llama Librarian and Inference Iguana report real model, VRAM and latency; Agent Ant repeatable evals | Benchmarks on Astra's GPU | 8 |
| Q | Cache Coyote queues work offline on the Pi; Sync Mink reconciles after reconnect | Offline/online test with conflicts | 8 |
| R | Passport Pelican alerts on synthetic deadlines without leaking; Journal Jay stays private; nothing submitted without approval | Synthetic data only | 8 |

The 64 existing tests keep running as regression throughout.
