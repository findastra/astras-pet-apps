# ASTRAS_PET_OS — FINAL MASTER HANDOFF v5.2

> **Amendments by Astra since v5.2** (these override the text below):
> - 2026-10-12: **Astra renamed the development repo to `astras-pet-os`** (it was `astras-pet-apps`; old links redirect). The Cage is retired: it is no longer the Farmer's job.
> - 2026-10-12: **The pets are intelligent apps.** When talking about all of them together, just say **the pets** (never "the herd"). **The Friendly Farmer organizes the pets.** **The Farm is the native OS** of Astra's PetOS, the first-party home where the pets live and run; the Farm website is its face. **The Kennel is the community lab**, where other people's pets are built, tried, reviewed and adopted. Each pet grows through three levels of intelligence: program, runtime, agentic harness ([INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md)). The 3D diagram is **Astra's PetOS System Map**, also called the 3D PFD.
> - 2026-10-12: **The project's title is "Astra's PetOS".** In files, folders, code and identifiers it is written **`ASTRAS_PET_OS`** (ASTRAS with the S, an underscore before PET and before OS), never `ASTRA_PET_OS`, `ASTRA_PETOS` or `PetOS` on its own. This document lives at the top of the repo as `ASTRAS_PET_OS.md` (moved from `docs/architecture/` on 2026-10-12). Where the text below says to display `ASTRAS_PET_OS` as the product name, show "Astra's PetOS" to people instead.
> - 2026-10-12: **Tools are not pets.** A tool does a job but has no face, mood or intelligence levels. **Startup Star** (the tray Star and desktop host) is the Friendly Farmer's tool.
> - 2026-10-12: **Journal Jay is renamed Journal Jellyfish.** Same job and privacy rules. New seeds: **Photo Dodo** (all saved pictures) and **Video Vulture** (all saved videos). Skill Scout watches the agent and skill files and tracks what changed, who changed it and why.
> - 2026-10-11: **Passport Panda is renamed Passport Pelican** (Procreate Panda takes the panda). Same job and privacy rules.
> - 2026-10-11: Seeded pets Pole Puff, Procreate Panda, Skill Scout, OSC Sealion (first recorded as PSC Sealion), Platform Platypus and Piranesi Nessi; see `seeds` in `pets.json` and docs/migration/PLAN.md.

**Product name (approved):** ASTRAS_PET_OS — *Grow your own AI ecosystem.*  
**Official first-party ecosystem and user's installed pets:** `astras-farm`  
**Community discovery, adoption and submissions:** `astras-kennel`  
**Framework:** Astra Pet SDK / reusable independent pet agent harness  
**Existing development repository:** https://github.com/findastra/astras-pet-os  
**Status:** Product architecture including the approved future learning/nomad pet expansion; do not claim components are implemented until repository audit and tests confirm them.

## Instructions to Desktop Claude — read first

1. Read this master handoff and the bundled earlier architecture and registry starter. **This master document supersedes conflicting earlier naming or decisions.**
2. Audit actual local repository, current branches, `CLAUDE.md`, `AGENTS.md`, `.claude/skills`, `.agents/skills`, and existing agents. Never overwrite working code or assume prior drafts match implementation.
3. Draft a migration plan and acceptance test matrix before foundational refactoring. Ask for approval before destructive edits, publishing, account creation, paid services, or repository transfers.
4. Implement independently testable slices and show reproducible results. Preserve user's ownership and control of each pet.
5. Use GitHub only through authenticated, user-authorized access. **No new repository or live web form has yet been created by this handoff.**

## Final decisions — authoritative

### Brand and distribution

- **ASTRAS_PET_OS** is the umbrella consumer product and developer platform; technically it is a local-first, cross-device, distributed multi-agent operating *environment* running on top of Windows/Linux host OSes, not a replacement kernel.
- **`astras-farm`** is the first-party home: official Astra-maintained pets, the user's installed pets, Farmer's management interface, and a simple responsive Farm website. Every pet card has an always-visible fast text box. No browser-based Cage, simulated habitat, or pet roaming in a browser.
- **`astras-kennel`** is the community pet adoption catalog: community-submitted repositories, searchable metadata, adoption/install flow, compatibility and security status, and maintainer attribution. A Kennel pet may later be proposed for migration into the official Farm only through explicit consent, licensing/provenance review, security checks, and a deliberate maintenance transfer; never automatic.
- **Astra Pet SDK** supplies common contracts, manifests, templates, runtime harness, task/inbox infrastructure, tool adapters, permissions, versioning, and testing scaffolds.
- Users pick **only the pets they want**. Shared core security/identity/messaging services remain framework responsibilities, not optional bypassable controls.
- The Farm must be securely accessible from **Android, iPhone, iPad, Windows, and future devices/servers**, using a responsive HTTPS browser UI and authenticated private connectivity. Native apps are optional. Web links open on the client device; Windows-only launch actions must target an authorized Windows host, not pretend to launch on iOS.

### Farmer grows new pets

Friendly Farmer is an independent pet, registered and supervised through the same neutral Program Manager as every other pet. Farmer is **not** the harness or central execution bottleneck. Farmer is responsible for pet health, coordination, and **pet incubation**:

`user idea -> check existing pets/templates -> requirements and permissions -> scaffold from SDK -> assign version + repo plan -> implement integration -> Test Tortoise tests -> Gatekeeper Goddess permission review -> user approval -> register/install -> optional release/publish -> GitHub Goldfish tracks versions`

Creating new GitHub repos, installing software, publishing, or accepting risky permissions requires appropriate explicit approval. Farmer may coordinate Claude/Codex/Project Parrot but must not impersonate their authorization.

### Marketing website ownership

**Friendly Farmer = accountable product/website coordinator** for ASTRAS_PET_OS marketing site: content roadmap, positioning, release launch coordination, first-party pet catalog accuracy, Kennel cross-linking, and assigning work.

**Browser Bat = website operations specialist**: browser-based QA, link checking, responsive and accessibility checks, analytics diagnostics, authorized publishing workflow, uptime and broken-page investigation. Browser Bat is not allowed to publish unapproved changes.

**GitHub Goldfish = authoritative release metadata**: latest versions, changelogs, provenance, GitHub release and repo monitoring. **Test Tortoise = release and regression validation. Gatekeeper Goddess = permission/security approval.** A dedicated marketing pet can be created later if content and campaign work justify it.

Proposed marketing pages: Home, How It Works, Meet the Pets, The Farm, The Kennel, Build a Pet / Developer SDK, Pricing, Docs, Trust & Security, Changelog, and Contact/Support. Make claims about capabilities only after verified tests.

### Complete approved pet roster (proposed additions, not necessarily implemented)

Keep all existing established pets, including Friendly Farmer, Deck Duck, Rift Rabbit, RGBee, Patch Cat, Backup Beaver, Mail Snail, WiFi Butterfly, Mesh Moth (Meshtastic/LoRa), Raspberry Pie, Stock Fox, Mine Mole, GIF Giraffe, Meme Fiend, GitHub Goldfish, API Fairy, Unity Unicorn, Python Panther, Astra Wisp, Paper Girl, Ghost Protocol, Project Parrot, and File Master; do not delete or rename established pet code merely because a previous list was incomplete. Existing names/roles should be audited for actual repo truth.

New approved additions and roles:

| Pet | Domain | Boundary / primary function |
|---|---|---|
| Gatekeeper Goddess | Security and approvals | Human-facing approvals, security monitoring; underlying trusted policy engine stays in framework |
| Queue Quokka | Tasks | Monitors retries, stalled jobs and agent handoffs; durable queue infrastructure remains core |
| Log Lynx | Observability | Correlates logs, traces, health and failure diagnostics |
| Server Salamander | Hosts | Home servers, host registration, uptime, service health, remote deployment checks |
| Docker Dragon | Containers | Docker health, container deployment recommendations and authorized management |
| Test Tortoise | Quality | Unit/integration/end-to-end/regression tests and release verification |
| Token Toucan | AI cost | Model tokens, spending budgets, inference usage and efficiency |
| Packet Piranha | Network | Packet loss, DNS, latency, routing, host connectivity; distinct from WiFi Butterfly and Mesh Moth |
| Calendar Crow | Calendar | Scheduling integration, calendar conflicts and reminders |
| Browser Bat | Web and marketing operations | Website QA, authorized browser automation, marketing-site maintenance |
| Data Dragonfly | Data engineering | Data integrity, schemas, ETL/pipelines; can work alongside **CHIP** and Data Dealer without treating either project as a pet |
| Update Urchin | Dependency updates | Packages, dependency compatibility, rollback preparation; distinct from GitHub Goldfish's release monitoring |

**File Master owns file organization, indexing, and appropriate memory hygiene**; do not spawn redundant Memory Moth. Do not rename existing Linux penguin. No new Packet Penguin. Data Dragonfly may interact with confidential CHIP resources only via explicitly granted project-scoped permissions.

### Approved expansion — Linux, self-hosting, ethical security, local AI, and digital nomad pets (v5.2)

**This section is now part of the authoritative ASTRAS_PET_OS plan, not a separate brainstorming appendix.** The user explicitly approved all 18 candidates. They are **approved for the roadmap**, not represented as already implemented or as requirements to install every pet. Prioritize by dependencies and user value. Preserve existing ASTRAS_PET_OS roles and all earlier decisions.

| Pet | Area | Primary function |
|---|---|---|
| Linux Penguin | Linux / OS | Linux administration, SSH, systemd, packages, permissions; inspect existing Linux/penguin code before adding or renaming |
| Shell Squid | Linux / OS | Bash, terminal scripting, command explanation and guarded automation |
| Kernel Koala | Linux / OS | Processes, memory, drivers and operating-system internals |
| Proxy Axolotl | Self-hosting | Reverse proxies, TLS, certificates and secure private remote access |
| Cluster Crab | Self-hosting | Distributed services, orchestration and failure modes |
| Storage Stoat | Self-hosting | NAS, ZFS, storage pools, snapshots and capacity health |
| White Hat Weasel | Cybersecurity | Authorized security assessment, learning labs and remediation |
| Port Spider | Cybersecurity | Authorized port/service discovery and exposure checks |
| Cipher Owl | Cybersecurity | Encryption, key management, certificates and crypto education |
| Forensic Ferret | Cybersecurity | Incident timelines, forensic integrity and log analysis |
| Llama Librarian | Local AI | Local model inventory, downloads, storage, quantization and compatibility |
| Inference Iguana | Local AI | Inference benchmarks, GPU/VRAM use, throughput, latency and efficiency |
| Agent Ant | Local AI | Agent experiments, tool-use evaluation, reliability tests |
| Roaming Raven | Digital nomad | Travel connectivity, VPN/tailnet status and remote-access diagnostics |
| Cache Coyote | Digital nomad | Offline-first documents, local caches, queued actions and reconnect recovery |
| Sync Mink | Digital nomad | Cross-device sync, conflict resolution and replication integrity |
| Passport Pelican | Global mobility | Secure passport/ID metadata, visa/residency research, applications and deadlines |
| Journal Jellyfish | Digital nomad | Private travel diary, itineraries, memories and optional summaries |

**Key boundaries and overlap resolution:** Linux Penguin is explicitly wanted, but the repo may already contain a penguin/Linux concept; audit and reconcile rather than spawn a duplicate. Cache Coyote **replaces Offline Otter**, and Sync Mink **replaces Sync Swallow** in all future planning. Packet Piranha remains the network diagnostics pet (do not create Packet Penguin). File Master continues file/memory organization. Existing Raspberry Pie, Mesh Moth, WiFi Butterfly, Server Salamander, Docker Dragon, Backup Beaver, Gatekeeper Goddess, Queue Quokka, Log Lynx, Token Toucan, Test Tortoise, Browser Bat and Data Dragonfly retain their distinct responsibilities. Data Dragonfly may support CHIP and Data Dealer with project-scoped permissions.

**Cyberdeck target hardware:** Rugged Pelican-case build with Raspberry Pi, Flipper Zero, LoRa HAT, Wi-Fi HAT, physical hardware security key, and expansion for other modules. Preserve offline utility and independent operation when the network, cloud or home PC is unavailable. Security key is for hardware-backed authentication, not a substitute for encrypted storage, backups, and recovery options. Wireless/security tools are for owned or explicitly authorized systems only.

**Global mobility security:** Passport Pelican must encrypt sensitive document data, minimize exposure to agents, require human approval for submissions or account actions, and distinguish verified official immigration requirements from tentative AI research. Avoid storing passport scans in broad shared agent memory. Journal Jellyfish remains separately permissioned and does not automatically share the full diary with Passport Pelican.

**Suggested phased build, not all-at-once:** Linux Penguin + Shell Squid -> Server Salamander/Docker Dragon + Proxy Axolotl -> authorized security lab -> Llama Librarian/Inference Iguana/Agent Ant -> distributed execution -> Cache Coyote/Sync Mink/Roaming Raven -> Passport Pelican/Journal Jellyfish. Add remaining specialist pets as workflows justify them. User choice and modular installation remain mandatory.

**Additional acceptance demonstrations M–R:**

- **M. Linux administration:** Linux Penguin safely inspects a Linux host, explains requested commands, and respects approval and host access boundaries.
- **N. Self-hosting and remote access:** Deploy a test service with documented TLS/private access, health checks, and recoverability; do not expose admin services publicly by default.
- **O. Security lab:** White Hat Weasel and Port Spider refuse out-of-scope targets and produce useful authorized findings with evidence and remediation.
- **P. Local inference:** Llama Librarian + Inference Iguana report true model/VRAM/latency metrics and Agent Ant runs repeatable tool-use evaluations.
- **Q. Cyberdeck offline recovery:** Cache Coyote queues work offline on the Pi, and Sync Mink reconciles it safely after reconnection, with documented conflict behavior.
- **R. Mobility privacy:** Passport Pelican alerts on synthetic visa/passport deadlines without leaking sensitive records; Journal Jellyfish diary remains private; no immigration application is sent without approval.

### Official vs community repositories and versioning

Recommended GitHub organization layout (names proposed; check availability and existing structure):

- `findastra/astras-farm` — first-party Farm app/site, official catalog, official pet distribution references.
- `findastra/astras-kennel` — community catalog, submission workflow, review automation and registry records.
- Existing `findastra/astras-pet-os` — preserve as current development repo until audit decides if/how to split; **do not silently rename or replace**.
- `findastra/astra-pet-sdk` — optional separate SDK repository once shared contracts stabilize.
- **One independently versioned repository per independently released pet**, when practical; avoid mass repo creation before audit.

A Kennel submission is a **link to a developer-owned GitHub repository**, not forced copying of the developer's code. Maintain original owner, license, source, release provenance, compatibility and optional official-fork status. A community pet may remain in the Kennel indefinitely.

Each pet must have a single authoritative machine-readable version (SemVer `MAJOR.MINOR.PATCH`) in its manifest, mirrored consistently into release tags and UI. **Large, obvious versions** on each GitHub README, release page, Farm pet card, Kennel listing and Pet Console: installed version, latest verified release, compatibility, update status, last checked timestamp, changelog link.

**GitHub Goldfish checks both sides:** (a) Astra's official and catalog metadata vs source repositories and published releases; (b) each community developer's upstream latest stable release vs installed version and compatibility requirements on the user's host. Compare signed/trusted release metadata, tags, manifest versions, hashes, host compatibility and dependency constraints; don't assume newest commit is a release. Provide update notifications and review; no silent execution of arbitrary community code.

### Community submission flow

Public **Submit Your Pet** page should collect pet name, maintainer GitHub handle, repo URL, purpose, type, supported OS/hosts, permissions, current SemVer, framework compatibility, license, release URL, support link, and optional avatar. Validate repository ownership/control when appropriate, reachable manifest, schema, release/tag, dependency and permission declarations, and moderation/security checks. On successful submission, open a reviewable registry pull request or issue with structured data and traceable review; **do not list as verified before approval**. Handle updates to existing submissions and delisting/deprecation.

Kennel statuses: submitted -> validating -> needs changes -> in review -> approved/listed -> update available -> deprecated/removed. A pet's presence in the Kennel is not a security guarantee. Clearly distinguish official, community, verified metadata, reviewed release and unreviewed updates.

### Product marketing and monetization — hypotheses, not forecasts

Proposed homepage positioning: **“Your digital life deserves a little help.”** Tagline: **“Grow your Farm. Adopt from the Kennel. Let your pets get to work.”** Core promise: **“Grow your own AI ecosystem.”** Position as a modular personal AI agent platform with optional embodied desktop companions. Avoid implying that it replaces Windows or that every agent action is autonomous/approved by default.

Initial target audience: creators, VR/streaming users, developers, homelab enthusiasts, advanced PC users. Demonstrate concrete useful outcomes (broken Stream Deck plugin diagnosed; backup coverage gap found; Docker container health checked) rather than a vague promise of universal automation.

Possible tiers for **testing**: free local/community/BYOK, Farm Pro around $12/month for managed services, Creator around $29/month for publishing and developer tooling, Teams later. Pricing is illustrative only. Do not build paid billing without validation, consent and cost analysis. AI inference/hosting expenses must be separately budgeted or BYOK. The Kennel may support paid services/creator revenue later, but start with free submissions and open adoption.

Validation milestones: real end-to-end demo; 10–20 external users who install and repeatedly use chosen pets; measured activation, retention, tasks completed, support load, API/hosting costs, and willingness to pay. Profitability is unproven.

### Acceptance criteria — add to earlier six scenarios

**G. Pet creation:** Farmer scaffolds a new pet from a template, generates valid manifest and version, integrates a real resource, passes tests, requests approval, registers it and optionally proposes a release; no unapproved repo creation or publication.

**H. Official/community separation:** Farm and Kennel remain distinct; community owner retains repo control; adoption works with chosen pets only; reviewed migration to official requires consent and provenance checks.

**I. Version sync:** GitHub Goldfish detects official and community upstream changes, distinguishes release vs commit, flags outdated installations, validates compatibility and provides truthful last-checked timestamps; no automatic untrusted code execution.

**J. Marketing website:** Farmer coordinates an approved marketing change; Browser Bat validates links/mobile layout; Test Tortoise runs checks; GitHub Goldfish supplies accurate versions; publication requires authorization and leaves an audit trail.

**K. CHIP adjacency:** Data Dragonfly can operate on authorized CHIP-related data interfaces while CHIP remains a separate project; least privilege and confidential information boundaries tested.

**L. Modular installation:** User installs only a selected pet subset, without needing all optional mascots; common core security and messaging remain enforced.

### Immediate repository work requests

- Inspect current `astras-pet-os` repo and the bundled registry starter.
- Produce a mapping of **actual** vs **proposed** repositories and web pages.
- Draft initial `astras-farm` and `astras-kennel` repository creation plans, ownership and workflows; do not publish until user approves.
- Build an initial marketing website information architecture, plus responsive homepage mockup, with Farmer coordinating Browser Bat.
- Create a versioned pet manifest contract and one working Goldfish release comparison test.
- Produce a complete test matrix for original acceptance scenarios A–F plus new G–L and expansion scenarios M–R.
- Preserve the final previous architecture sections below unless superseded by this addendum.

---

## Baseline technical architecture (retained)

# ASTRA'S PET APPS — FINAL CLAUDE HANDOFF
## Friendly Farmer, The Farm, Program Manager, and Distributed Pet Agents
**Version:** 5.0 FINAL | **Date:** October 11, 2026
**Repository:** https://github.com/findastra/astras-pet-os
**Audience:** Desktop Claude Code, OpenAI Codex, Project Parrot, and authorized contributors
**Status:** Target architecture; audit actual repository before modifying it.

> Claude: Read this complete specification first. Audit the repository and existing instructions before editing. This describes the desired end state, NOT features verified as currently implemented.

**Branding requirement:** Always display the umbrella product name exactly as `ASTRAS_PET_OS` (including underscores). Do not abbreviate it as PetOS. Keep the distinct names `astras-farm` and `astras-kennel` for the official and community experiences.

## 1. Non-negotiable vision

Astra's Pet Apps is a local-first, multi-device ecosystem of independent utility applications with optional proactive AI agents, each represented by a pet.

**The Farm is a lightweight, responsive website**, not a visual Cage, game, or simulated pet habitat. It displays all pets as cards. **Under every pet is an always-visible, fast text box** for the user to submit recommendations, questions, tasks, and standing-goal suggestions. The Farm must work from **Android, iPad, iPhone, Windows, and future authorized devices and servers**. Responsive browser access is mandatory; native mobile apps are optional later.

**Friendly Farmer is a pet like every other pet.** He has his own application, runtime, harness, memory, schedules, standing goals, permissions, and Program Manager registration. His domain is coordinating, maintaining, and improving the pets. He operates the Farm website. He is not the entire framework, not the sole AI brain, and not required for other pets to execute their work.

**Program Manager is neutral shared infrastructure**, registering, connecting, and managing real programs/resources for every pet—including Farmer himself. It must not depend on Farmer's AI agent.

**Every pet has an independent execution lifecycle.** A pet can run its scheduled work, discover new tasks, store state, use permitted tools, and collaborate with other pets even when the Farm, desktop Star, or Farmer's agent is closed.

**Pets roam on the actual Windows desktop, across monitors**, not within the Farm website. The Star tray controls desktop visuals independently of the background workers.

**Retire the Cage as a product concept.** Audit its code and reuse useful components, but do not continue building a browser enclosure or animated virtual habitat.

## 2. Exact conceptual distinctions

| Concept | Responsibility |
|---|---|
| Project | Logical initiative/product, such as Data Dealer or CHIP, composed of resources |
| Program/resource | Real website, executable, API, device, repository, database, local service, or workspace |
| Project Registry | Thin grouping layer associating related resources; not a separate AI supervisor |
| Program Manager | Neutral registry, verified links/launchers, integration adapters, capabilities, status, and metadata |
| Pet application | Domain-specific utility associated with zero, one, or many real resources |
| Pet runtime | Independently executed worker, scheduler, inbox, state store, and task processor |
| Pet agent | Goal-directed decision-maker that observes, discovers work, plans, uses tools, and delegates |
| Agent harness | Reusable tools, model adapters, skill loader, memory, task execution, permission checks, and tracing |
| Friendly Farmer | Pet that organizes the other pets; managed through Program Manager like all other pets |
| The Farm | Farmer's simple web directory and quick-input interface |
| Desktop host + Star | Windows tray and roaming mascot visuals; never the pet execution engine |

Relationships must be many-to-many: one project can contain many programs; one pet can manage many programs; many pets can access one program through separately authorized capabilities.

A model is not an agent; a scripted automation is not necessarily an agent; an application can be useful without any LLM. Use AI on demand rather than keeping all models continuously active.

## 3. Architecture and fault boundaries

```text
 USER DEVICES: Android / iPad / iPhone / Windows / future clients
                             |
                THE FARM — responsive web UI
             pet cards / live links / quick text
                             |
                  Authenticated Farm API
                             |
       +---------------------+---------------------+
       |                     |                     |
  PET REGISTRY         PROGRAM MANAGER       DURABLE INBOXES
  identities/status    projects/resources    messages/tasks
       |               adapters/capabilities       |
       +---------------------+---------------------+
                             |
                  SHARED CONTRACTS / SDK
          identity / permissions / events / audit
                             |
           INDEPENDENT PET RUNTIMES AND AGENTS
       Friendly Farmer | Deck Duck | Patch Cat | ...
                             |
            REAL SITES / APPS / DEVICES / REPOS

 SEPARATE WINDOWS DESKTOP HOST:
 Star system tray + actual-desktop roaming pet avatars
```

This is a logical architecture, not a mandate for a single process or machine. Deploy components as appropriate. Shared coordination must not create a single point of failure for already-queued local work. If a machine is powered off, its local worker cannot run; support optional placement on an always-on home server or other authorized host.

### 3.1 Farmer's independence
- Program Manager registers Farmer's app and the Farm website as normal resources.
- Farmer can be started/restarted by an independent service supervisor.
- Farmer's AI agent may be stopped without stopping Program Manager or the other pet runtimes.
- Farmer can inspect authorized pet status and propose/delegate maintenance, but has no magical blanket admin rights.

## 4. The Farm: required product experience

**No Cage, no browser roaming, no farm simulation.** Prioritize usability and speed.

### 4.1 Main screen
- Header: The Farm, search/filter, pet health summary, access to Farmer.
- Responsive grid/list of every registered pet including Friendly Farmer.
- Each pet card has:
  1. Mascot icon/image, name, concise purpose.
  2. Runtime state: running, idle, busy, degraded, offline, unknown; last verified timestamp.
  3. Current/last task, pending approvals if applicable.
  4. **Open Program**: a verified live link/launcher to the *real* managed program; dropdown for multiple resources.
  5. **Open Pet Console**.
  6. **An always-visible small text box directly below that pet**.
  7. Submit button or Enter shortcut and honest delivery/processing receipt.
- No fabricated status; clearly label stale health and unavailable connections.
- No program linked? Show "No linked program" and still allow the pet console and text box.

### 4.2 One text box, several intents
User can type:
- "Consider a better Beat Saber Stream Deck profile." (suggestion)
- "Why are Spotify keys broken?" (question)
- "Run a read-only diagnostic." (task)
- "Check every Sunday and propose new macros." (standing-goal proposal)

Flow: `client -> authenticated Farm API -> durable message receipt -> target pet inbox -> classification -> task/answer/goal proposal -> permission checks -> execution or approval -> status/result`.

Do not equate "submitted" with "executed." Offline pet messages are durably queued, with truthful delivery status. A suggestion is not blanket authorization for significant changes. If backend storage is unavailable, show an error rather than claiming success.

### 4.3 Standard Pet Console
Tabs/sections: Overview; Programs and verified destinations; Agent and standing goals; Tasks and approvals; Inbox; Memory; Activity/audit; Settings (model, permissions, schedule, budgets, avatar). Domain-specific panels may extend but not replace the standard shell.

## 5. Multi-device and future-server access — mandatory

The Farm must be **device-agnostic**, not a PC-only localhost dashboard.

### 5.1 Client support
- Modern Android browsers, iPhone Safari, iPad Safari, Windows desktop browsers; keyboard, mouse, and touch.
- Responsive layouts for small phones through large tablets/desktop.
- Accessible controls and legible status; fast input under each card.
- Prefer standards-based HTTPS web application; optionally add installable PWA support for home-screen shortcut, not a required native app.
- Future clients and servers integrate via a documented, versioned API rather than a second bespoke frontend.
- WebSocket or server-sent events for live status where available; fall back to polling. Never require a persistent socket to submit tasks.

### 5.2 Secure remote connectivity
- Start with **local network** and **authenticated private remote access** (e.g., Tailscale/WireGuard or equivalent VPN/zero-trust access).
- HTTPS/TLS for remote access; authenticated sessions, CSRF protection where relevant, secure cookies, session expiry, rate limits, request size limits.
- Do not expose agent-control APIs directly to the public internet, forward unprotected ports, or use unauthenticated tunnel endpoints.
- A mobile device is a **client**, not an assumption that Windows executables can run on iOS/Android.
- The **Open Program** action is device-aware: website links open on mobile; Windows-only programs display "Available on Windows host" and can offer an explicitly authorized remote action (e.g., launch on selected PC) rather than a broken mobile link.
- Distinguish "open locally on this device" vs "launch on a remote managed host" and require authorization for remote launch.
- Future servers can register as execution hosts with authenticated identity, heartbeats, capabilities, resource scopes, and placement metadata.
- No arbitrary internet-facing remote shell. Server/host actions must use typed allowlisted operations.
- Offline mobile UI may cache non-sensitive read-only state, but never claim a message was delivered until a durable backend receipt exists.
- Plan multi-device session handling, notification preferences, and device revocation. Optional push notifications can come later.
- Prefer a private domain/hostname that remains stable as the backend moves to a home server, but do not hardcode one now.

### 5.3 Host placement and routing
Each pet manifest must declare where it can run (Windows, Linux/server, Raspberry Pi, etc.) and where it is actually running. A central directory may route requests to the correct authorized host. Host failure should show stale/offline state, preserve queued work, and recover safely. Avoid duplicating tasks on reconnection; use idempotency keys and leases.

### 5.4 Acceptance across devices
From an authenticated Android phone, iPhone, and iPad (or suitable device/browser test coverage with real-device validation):
1. Open Farm over a private, secure connection.
2. See same pet directory and accurate status.
3. Submit a suggestion under Deck Duck and receive a durable receipt.
4. See queued/offline vs delivered vs completed accurately.
5. Open a real website target in that device's browser.
6. See a clear device-aware option for Windows-only programs, without broken local launch attempts.
7. Review a task and approve/deny an action with appropriate authentication.
8. Confirm unauthorized clients cannot read tasks or issue commands.

## 6. Program Manager: program vs pet vs project

Implement a neutral shared Program Manager, not an AI manager superior to Farmer.

### 6.1 Program/resource record
- Stable `program_id`, type, name, purpose, owner, environment, host.
- Canonical URL/executable/URI and additional verified destinations.
- Project IDs and pet IDs (many-to-many).
- Adapter ID/version, declared capabilities, permissions.
- Credential *reference*, never a secret value in manifest.
- Connection dimensions: registered, installed/reachable, authenticated, observable, controllable, healthy; timestamps, evidence and errors.
- Deployment context (dev/test/prod), last health verification.
- Device-aware open behavior (web, local native, remote authorized launch, unsupported).

### 6.2 Adapter contract
`open`, `listDestinations`, `getStatus`, `listCapabilities`, `invokeCapability`, `getHealth`, and optional `diagnose`/`getLogs`. Use typed structured results and explicit unsupported states. Link opening alone is not proof of observability/control.

Adapters: web deep-link, native Windows launcher, HTTP API, Git/repository, device SDK, local service/process, workspace/folder. Prefer official APIs. Validate all executable paths and commands outside the model.

### 6.3 Project Registry
Data Dealer or CHIP should be modeled as composite **projects** with sites, repos, services, APIs, databases, simulations, docs, etc. A pet may manage one or more of those resources; do not assume the pet is the product itself. Keep the Project Registry thin; avoid inventing a heavyweight second management system.

## 7. Independent pet runtime and manifest

Each pet has stable `pet_id`, version, mascot reference, purpose, runtime entry point, host/deployment mode, health check, program/project links, capabilities, permissions, event subscriptions/publications, schedules, agent settings, skills, standing goals, storage namespace, budgets, and console route.

Must support independent start/stop/restart/update, local persistent inbox/task queue, missed-run policy, durable scheduling, cancellation, retries/backoff, concurrency limits, health and last-seen, crash recovery, and idempotency. Workers continue when Farm UI, Star, desktop renderer or Farmer agent stops.

Don't require one heavyweight model process per pet; use model calls only when needed.

## 8. Agent harness and proactive autonomy

### 8.1 Agent harness
Reusable provider-neutral framework offering model adapters (Claude/OpenAI/local as configured), tool registry, runtime skills, memory scopes, task executor, structured validation, messaging client, permission enforcement, cost/time limits and audit tracing. Keep separate harness instances/identities per pet.

Evaluate **one primary agent framework** against repo needs (e.g., Letta, Microsoft Agent Framework, LangGraph, or existing implementation). Don't combine multiple orchestration frameworks without a proven need. Audit actual language/runtime compatibility first.

### 8.2 Proactive loop
`observe -> evidence -> discover opportunity -> deduplicate -> score -> plan -> authorize -> execute/delegate -> verify -> remember`

Pets must discover work not hardcoded into workflows. Example: Deck Duck notices recurring manual profile changes; Patch Cat identifies a novel repeated failure; Farmer spots a stuck task or missing health check. Keep observations separate from hypotheses; enforce cooldowns and deduplication.

### 8.3 Autonomy levels
1. Observe: detect and recommend.
2. **Supervised (default):** diagnostics and explicitly allowed low-risk reversible actions; request approval for consequential changes.
3. Delegated: preapproved scoped operations within budgets; significant sensitive actions still require approval.

Approval must be enforced by trusted code, not merely by prompt. Budgets include time, model tokens/cost, tool calls, retries, concurrency and delegation depth. Add kill switch and inspectable audit.

### 8.4 Task state
`discovered`, `evaluating`, `awaiting_approval`, `queued`, `running`, `verifying`, `completed`, `failed`, `blocked`, `paused`, `cancelled`. Store origin, evidence, targets, risk, permissions, cost estimate, verification criteria, trace and results.

### 8.5 Memory
Private per-pet memory; permissioned project-scoped shared memory; framework contracts/configuration. Track provenance, timestamp, retention and deletion. No blanket shared access to credentials or private user data.

### 8.6 Skills
Distinguish development SKILL.md used by Claude/Codex from runtime SKILL.md used by pets. Skill instructions are **not security boundaries**.

## 9. Communication and collaboration

- Pub/sub events, e.g. `vr.session.started`.
- Typed agent-to-agent requests/replies, e.g. Deck Duck asks Patch Cat for dependency diagnostics.
- Bounded collaborative sessions, e.g. Rift Rabbit + WiFi Butterfly investigate VR latency.

Message envelope: `message_id`, `correlation_id`, `sender`, `recipient`, `schema_version`, `type`, `capability`, `payload`, `authorization_context`, `deadline`, `reply_to`, `trace_id`, `idempotency_key`.

Authenticate, validate schemas, enforce least privilege on receiving side, use durable retries/dead-letter queues, and bound delegation depth. Farmer may monitor but is not a mandatory middleman.

## 10. Farmer's specialized standing goals

Farmer should proactively:
- Verify pet and program registration/health.
- Detect offline or degraded workers and broken integrations.
- Track overdue tasks, undelivered suggestions and pending approvals.
- Identify framework incompatibilities and redundant work.
- Recommend maintenance, repairs, and new cross-pet collaboration.
- Coordinate authorized diagnostics and concise reporting across all the pets.
- Maintain Farm website availability and report its health.

Farmer must not silently gain administrator rights or become a central AI dependency. Program Manager and service supervisor must be able to manage Farmer's own app.

## 11. Windows desktop visuals: separate from Farm

Pets roam on the **actual Windows desktop**, across monitors. Windows system tray Star:
- Single-click: toggle desktop Star visibility.
- Double-click: toggle all roaming pet visibility.
- Triple-click: organized formation vs free roam.
- Right-click: management menu.

Use mutually exclusive click recognition with appropriate timing. Multi-monitor/DPI-aware, draggable transparent mascots, optional per-pet visibility, verified live mood/status, open real program and console. Hiding or closing desktop visuals must not stop workers. Do not revive Cage.

## 12. Security and operational correctness

- Authenticated private access; HTTPS remotely; avoid anonymous public control endpoints.
- OS credential store/secrets manager; never place raw secrets in code, prompts, SKILL.md, logs or repo.
- Least-privilege typed capabilities and trusted policy checks.
- Prompt-injection defenses for web content, repositories and inter-agent messages.
- Explicit approval for destructive changes, installations, credential modifications, financial actions and unauthorized external communications.
- Separate dev/test/prod environments.
- Structured logs, task audit, costs, last-verified status, backup/restore and rollback.
- Never execute model-generated arbitrary shell text without structured validation.
- Device revocation and host identity; don't assume any browser client is trusted.

## 13. Suggested repo organization — adjust after audit

```text
docs/architecture/FARMER-FRAMEWORK.md
docs/architecture/ADR/
docs/migration/AUDIT.md
docs/migration/GAP-ANALYSIS.md
docs/migration/PLAN.md
contracts/              # pet, program, project, task, message, health schemas
core/                   # identity, permissions, registry, program manager, messaging
sdk/                    # pet runtime, program adapters, agent harness
pets/friendly-farmer/
pets/deck-duck/
pets/patch-cat/
apps/farm-web/          # responsive multi-device website
apps/desktop-host/      # Windows Star + actual desktop roaming
tests/contracts/
tests/integration/
tests/e2e/
.claude/skills/farmer-framework/SKILL.md
.claude/skills/pet-agent-runtime/SKILL.md
.claude/skills/pet-desktop-host/SKILL.md
.agents/skills/farmer-framework/SKILL.md
.agents/skills/pet-agent-runtime/SKILL.md
.agents/skills/pet-desktop-host/SKILL.md
CLAUDE.md
AGENTS.md
```

This is a proposed layout, not a command to move everything. Keep one canonical architecture doc and have skills reference it.

## 14. Migration phases

**Phase 0 — Audit:** inspect repo, instructions, current Cage/Farm, Farmer, Star, pet registry, independent workers, agents, APIs, tests, dependencies. Inventory working features, gaps and migration risks. Present plan before foundational rewrite.

**Phase 1 — Contracts:** stable pet/program/project identities, versioned schemas, health, permissions, task/message formats, contract tests.

**Phase 2 — Program Manager:** real URLs/native launchers, adapters, capabilities, project grouping, Farmer's own registration.

**Phase 3 — Farm web UI:** replace Cage product concept with responsive directory and always-visible per-pet input. Durable submission, device-aware Open Program, real status. Test on mobile/tablet.

**Phase 4 — Independent workers:** durable scheduler, inbox, task store, health, crash recovery; prove worker continues while Farm and Farmer are closed.

**Phase 5 — Harness + discovery:** model adapters, tools, skills, memory, autonomy, evidence-based new task discovery and verification.

**Phase 6 — Inter-agent:** Deck Duck ↔ Patch Cat structured requests and bounded collaboration; Farmer observes without acting as mandatory proxy.

**Phase 7 — Windows embodiment:** tray Star gestures, real desktop roaming, verified moods; no browser Cage.

**Phase 8 — Additional hosts and pets:** authenticated home server/Pi deployment, remote routing, Android/iOS/iPad usability, incremental migration, rollback.

## 15. Mandatory acceptance demonstrations

**A. Farm submission:** Farm shows Farmer, Deck Duck, Patch Cat. Each has visible input and real program link. User submits under Deck Duck; durable receipt returned; inbox receives it; status transitions honestly. Offline pet remains queued.

**B. Proactive independent agent:** Close Farm UI and Farmer agent. Deck Duck runs scheduled inspection, discovers a non-hardcoded evidence-backed issue, asks Patch Cat for authorized help, verifies result, persists report. Reopen Farm and see actual state.

**C. Farmer managed as ordinary pet:** Program Manager lists Farmer and Farm website; Farmer can be restarted by service manager; other pets keep working; Farmer recovers without duplicating tasks.

**D. Mobile and tablet:** Authenticated Android, iPhone and iPad can open Farm securely, submit suggestions, view tasks/approvals, open web targets, and see honest handling of Windows-only apps. No public unauthenticated control API.

**E. Windows desktop:** Star single/double/triple click behavior, multi-monitor roaming, hide/close visuals without stopping work. No browser Cage.

**F. Safety:** Unapproved destructive operation blocked and audited; permitted low-risk diagnostic succeeds; prompt injection does not bypass trusted permissions; task budgets and delegation depth enforced.

Mock screens alone do not satisfy acceptance. Provide reproducible test evidence on supported hosts/devices.

## 16. Immediate instruction to Desktop Claude

1. Read this entire document and inspect the real `findastra/astras-pet-os` checkout.
2. Read `CLAUDE.md`, `AGENTS.md`, all existing skills and architecture docs.
3. Audit Cage, Farmer, Project Parrot, desktop Star, Farm UI, pet runtimes, program links and agents. Do not assume prior claims reflect the code.
4. Produce `AUDIT.md`, `GAP-ANALYSIS.md`, and `PLAN.md` (use repository-consistent paths).
5. Explicitly map how to retire Cage without losing reusable code.
6. Plan the **first vertical slice**: Program Manager registers Farmer and Deck Duck; responsive Farm shows both with real links and durable quick-input submissions; works on phone/tablet through authenticated private access.
7. Define contracts and divide file ownership between Claude and Codex before parallel edits.
8. Update `CLAUDE.md`, `AGENTS.md` and relevant skills consistently with one canonical architecture document.
9. Ask for review before destructive restructuring, forced pushes, or major foundational merges.
10. Implement in small testable increments; demonstrate real behavior and truthful status.

**NORTH STAR:** The Farm is a simple multi-device website. Friendly Farmer is an independently operating pet that organizes the pets. The neutral Program Manager manages Farmer too. Every pet connects to real programs, can receive fast suggestions, and can proactively discover and delegate authorized work. The mascots roam on Windows, never inside a Cage.
