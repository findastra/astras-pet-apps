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
