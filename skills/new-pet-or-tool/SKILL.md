---
name: new-pet-or-tool
description: Decide whether a tool Astra (or any Farm user) asks for becomes a tool of an existing pet or a new pet, and record it. Use whenever someone names a tool, job or program they need ("I need a tool that...", "which pet should do...", "do we need a new pet?").
---

# New pet or tool? (Astra, 2026-10-13)

Astra will name tools she needs often. Other users will too: they say what they need, and
**the Friendly Farmer** decides which pets (dependencies) their farm needs and how to use them,
like a package manager. Every farm can end up with different pets and versions; each farm's
`farm.lock` records exactly what it runs.

## Priorities, in order
1. **Security**: the tool can only touch what its pet is allowed to touch (see `skills/farm-security`).
2. **Simplicity**: fewer pets. Reuse before adding.
3. **User friendliness**: the pet a user would guess first is the right owner.

## The rule
A **new pet** only when the job needs its own program, its own data and its own schedule that no
existing pet already owns. Otherwise it is a **tool of the pet whose job it fits.**

Each pet has exactly **one pet program**. Every other program that pet program makes or owns is a **tool** of it
(Astra, 2026-10-13): it sits on the same ring with the same permissions, never more, and the pet program's page
links it. Example: Friendly Farmer (pet program icon) → The Farm (pet program) → Astra's PetOS System Map and
Startup Star (tools of The Farm). Anything made by someone else that a tool uses (three.js, Google Fonts) is a
third-party dependency, not a tool.

## Steps
1. Restate the need in one line and name the standard software term for it (`skills/dev-mindset`).
2. List the 1 to 3 pets whose jobs come closest (`pets.json`, `docs/naming-*.md`, the System Map).
3. Check the three tests: own program? own data? own schedule? Any "no" → it is a tool.
4. Check permissions: which rings and folders does the tool read, write or execute? If it needs
   anything outside its pet's grant, Gatekeeper Goddess (Iron Gates) must grant that scope and Astra approves.
   A pet never approves its own permissions.
5. Check privacy: does it handle personal data? Then its data stays on the PC, never in a repo.
6. Recommend one owner, with one sentence of why, and offer one alternative. Ask Astra.
7. Record the decision: the pet's repo (README and `pet.json` tools list), `pets.json` job text,
   the naming table, and a handoff card for the pet's chat.
8. Build it to [PET-PROGRAM-FRAMEWORK.md](../../PET-PROGRAM-FRAMEWORK.md): a new tool gets its own tool box with a
   versioned label (`<pet-program>-v<version>-<tool>-v<tool version>`), ON/OFF, sick, its links and how it is used.
   A new pet program gets every block of the framework page and passes its checklist.

## Decisions so far
| Tool | Owner | Why | Date |
|---|---|---|---|
| Internet scrub (remove a person's details from sites and data brokers) | Gone Ghost | Privacy is his job; going ghost is his name. Target list stays on the PC. | 2026-10-13 |
| name-eraser (replace a name, default `USER`, in files) | Gone Ghost (pending Astra's final OK on scope) | Same privacy job; runs as a dry run, then an approved plan with undo. | 2026-10-13 |
| New-programs watch (every newly installed program, anywhere on the PC) | File Master | He already scans the whole PC; uses Everything (voidtools) when installed. | 2026-10-13 |
| Picking and installing pets for a user (package manager) | Friendly Farmer | He already hatches pets; no distributor pet needed. | 2026-10-13 |
| repo-catcher (old or stale repos on the PC that were never pushed: location, created date, newest first, click to open) | File Master | He already scans the whole PC for files and projects. | 2026-10-13 |
| broken-tools-on-the-farm (every tool marked sick, turned off or failing, and which pets use it) | Friendly Farmer (The Farm) | He has to know when the tools his pets use are broken. | 2026-10-13 |
| harness-strapper (example Unity tool: download on its title, which avatars it is rigged on, a sick box) | Unity Unicorn | Unity tools are hers; every tool box shows how it is used in the projects. | 2026-10-13 |
| vet-clinic triage (label tickets, check for leaked secrets, test offered cures in isolation) | New pet, pet-program-77 (names not assigned yet), approved by Astra | Passes all three tests: its own program, its own data (tickets) and its own schedule (daily triage). | 2026-10-14 |
| Live security monitoring: every W and every key use, alarms, switching OFF | New pet: **Pet Police Officer** (icon), **The Police Station** (pet program) | Its own program, data (the watch log) and schedule (always on). Works with Gatekeeper Goddess, who authorizes. | 2026-10-14 |
| Showing every agent key, active and expired | API Fairy, tool `api-fairy-mushroom-circle` on the API Fairy Ring | Keys are her job; she shows them, Iron Gates issues them. | 2026-10-14 |
| Searching files for several pets | One shared tool, File Master's `everything-search`; other pets get grants | Never copy a tool per pet: give grants (folders, R W X, limits). | 2026-10-14 |
| Third-party tools and tricks | The Shed (public, like the Kennel) | Strangers' code and text go through quarantine, a checker and L4. | 2026-10-14 |
| footprint-meter (estimated energy and carbon from tokens, against clean-energy donations; never moves money) | Token Toucan | Tokens and cost are already its job. Named "footprint", not "ethicality": the numbers are estimates, not a moral score. | 2026-10-14 |
| asset-ledger (every asset's source, license, credits; nothing ships uncleared) | Unity Unicorn | The model pet for asset provenance, with Astra's two worlds as examples. | 2026-10-14 |
| pet-finder (pets missing from the pet list or listed wrong, across pet-programs.json, pets.json, GitHub and the PC) and the pet-organizer trick | Friendly Farmer (The Farm) | Keeping the pets and the profile list in order is already his job. Read-only: it reports, Astra decides. | 2026-10-16 |
