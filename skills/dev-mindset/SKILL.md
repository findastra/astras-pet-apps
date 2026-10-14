---
name: dev-mindset
description: Keep Astra's PetOS in a software-engineering mindset. Warn Astra plainly when a term or structure she uses is a blatant programming nomenclature or structure error, give the standard term, and keep the glossary below in sync. Use in every conversation about Astra's PetOS design, naming, docs or code.
---

# Dev mindset (Astra, 2026-10-13)

Astra wants other software developers to read her build without frustration. She asked:
**warn me when I make a blatant programming nomenclature or structure error.**

## How to warn
- One short line per error, at the moment it happens: `⚠️ Naming: <her word> means <x> to developers; the standard term is <y>.`
- Blatant only: words that mean something else (or the opposite) to developers. Not style nitpicks.
- Recommend one fix, then carry on with her decision. When she decides, add it to the glossary below.
- If a standard practice exists for what she is designing, name it, so she can look it up
  (for example: "this is a package manager", "this is a trust boundary").

## Glossary: Astra's PetOS words and the standard terms
| Astra's PetOS | Standard software term | Notes |
|---|---|---|
| L1, L2, L3, L4 | Intelligence levels: programs (third-party and tools), pet program (dashboard and runtime), agentic harness, verified human | L4 is the verified human who owns the entire secure ecosystem and approves everything that matters. Decided 2026-10-13, L1 and L2 redrawn 2026-10-14. |
| Maker agent / checker agent | Maker-checker rule (four-eyes, two-person rule) | Was "offensive / defensive agent"; in security "offensive" means attacking. Decided 2026-10-13. |
| Versions with `v` | Version tags (`v1.0`) | `pet-program-3-v1.0-icon-2-v1.0`: a name keeps its number, a version never hides inside it. Decided 2026-10-13. |
| Tool box | Card or panel with a title (HTML `fieldset` with a `legend`) | Border with the versioned label on top, everything about the tool inside. |
| Connection box | Integration panel (what flows between two services) | Its own border colour; titled with the other pet's icon name. |
| Trick | Skill (`SKILL.md`), prompt, workflow | What a pet's agent knows; uses only the tools the pet has. Kept by Skill Scout. See TOOLS-AND-TRICKS.md. Decided 2026-10-14. |
| Grant | Scope / permission grant (least privilege, capability-based access) | Folders + R W X + limits for one pet on a shared tool. Not a copy of the tool. Decided 2026-10-14. |
| The Shed | Plugin / extension registry | Third-party tools and tricks, like the Kennel for pets. |
| Agent key | Short-lived session token with an audit trail | Issued per agent session by Iron Gates; records agent, model, person, device, place. |
| The Police Station | Security monitoring (a SOC with intrusion detection) | Detects and contains (switches OFF); never authorizes. |
| The alarm | Security incident alert | Everywhere at once; past breaches marked "found, not active". |
| Pet Passport | Provenance record (signatures, lineage, release history, patches, incidents); measured with SLSA levels | Microchip = signature, pedigree = lineage, stamps = installs and updates, vaccinations = patches, vet records = tickets. Decided 2026-10-14. |
| Security hats | Ethics (white, grey, black hat) plus teams (red, blue, purple) | Avoid "Red Hat" alone: it is also a Linux company. Decided 2026-10-14. |
| ON/OFF on a tool or connection | Kill switch / feature flag | Enforced by the core, not just shown on the page. |
| Sick checkbox | User-reported defect | Feeds the Farmer's `broken-tools-on-the-farm`. |
| Backlog (`<pet-program>-backlog`) | Backlog | Entries and weekly runs carry versions; the store itself never does, so it is never lost. |
| Weekly backlog run | Scheduled job | Weekly by default; more often needs L4. |
| Data survives updates | Schema version, migration, export and import | |
| Ring (the 3D map's spheres) | Protection ring | Was "shell"; developers hear "command shell". Decided 2026-10-13. |
| R W X tags | rwx permissions (read, write, execute) | Not "RWE". Decided 2026-10-13. |
| Pet program | Program (an app, site, world, service or script) Astra made | Umbrella term; see "app vs program". |
| Pet program icon | Mascot / character | The image files are icons; the character name is the mascot. |
| Tool | A program, page, script or utility that belongs to a pet program | Same ring and permissions as its pet program, never more. In AI, "tool" also means a function an agent can call; keep them the same thing: a pet's tools are what its connector offers. Drawn as a hammer. Decided 2026-10-13. |
| Third-party dependency | Library, font or service your code uses (three.js, Google Fonts, GitHub Pages) | Third-party, ring 5, drawn as a satellite like third-party programs. |
| Build output | A generated file (`system-map-20261012.html`) | Made by `npm run build`; never edited by hand. |
| Third-party program | Third-party software | Was "root program"; "root" means superuser to developers. Decided 2026-10-13. |
| Animal / animal code | Code inside the trust boundary the seated agent may change | Everything inside the harness is an animal. See `skills/farm-security`. |
| Agentic harness / the seat | Agent harness (Claude Code, Codex) | The model is the agent that sits in the seat. |
| Friendly Farmer | Orchestrator and package manager | He hatches pets (installs dependencies) and keeps `farm.lock`. |
| Program Manager / registry (`pets.json`) | Package registry | Part of the protected core. |
| Seed / pipeline / registered | Planned / in development / released | |
| `farm.lock` | Lockfile | Exactly which pets and versions a farm runs, and where each came from. |
| Startup Star (desktop host) | Launcher / process supervisor | A tool, not a pet: no face. |
| Astra's PetOS | Platform (runs on Windows) | It is not an operating system. "PetOS" is a brand name; docs say "platform". |
| A farm | One user's install of Astra's PetOS (a tenant) | Farms never connect to each other. |
| Local session vs public site (Am I a Ghost? vs Ghost Protocol) | Local / staging environment vs production | Same code, two environments. |
| Ear tag | Signature (signed commits and releases) | Removing it is detected; it cannot be prevented. |
| Sick cow from another farm | Untrusted dependency (supply-chain risk) | Never installed without a trusted signature and Astra's approval. |
| Gatekeeper Goddess (Iron Gates) | Policy engine / permission broker | Grants scopes; never approves her own. |
| Pet connector / plugin | MCP server (Model Context Protocol) | How a pet program exposes tools to a harness, with declared permissions. |

## App vs program
- A **program** is any code a computer runs: apps, services, drivers, scripts, libraries.
- An **app** (application) is a program made for a person to use, with a screen or controls.
- Every app is a program; not every program is an app (Voicemeeter's audio driver is a program, not an app).
  So the map says "program", and "app" only for things with a user interface.
