# Protection Rings

How Astra's PetOS keeps the farm safe: who may read, write and run what, which parts are connected, and what
stops a mistake or an attack. Companion to [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md). Short rule list for
agents: [skills/farm-security](skills/farm-security/SKILL.md). Started by Claude Opus 5.5, 2026-10-13.

> **🐾 Everything inside the harness is an animal. Agents can only control animals.
> Nobody becomes an animal by saying so: only Astra lets a new animal in.**

## What engineers call this

| Astra's PetOS | Standard name | One line |
|---|---|---|
| Rings around the pets | **Protection rings** | Nested permission levels; ring 0 is the most protected (Multics, x86 CPUs). |
| R W X tags | **rwx permissions** | Read, write, execute, as on every Unix file. |
| The glass harness | **Trust boundary** | The line where what an agent may do changes. |
| "Agents only get what their ring allows" | **Least privilege** | Nobody gets more access than the job needs. |
| The checks below, one behind another | **Defense in depth** | When one layer fails, the next one still holds. |
| "What could go wrong, and who could do it" | **Threat model** | The list in [Known gaps](#known-gaps). |
| The sick cow from another farm | **Supply-chain risk** | Never run code you cannot trace to someone you trust. |
| One farm per person, never connected | **Tenant isolation** | Each user's data and pets are walled off from every other user's. |

## The rings: what the agent in the seat may do

`R` read · `W` write · `X` execute · `🔒W` only through a pull request Astra merges · `–` no

| Ring | What lives there | R | W | X | Animal? |
|---|---|---|---|---|---|
| 0 Core | Pet Directory (`pets.json`), Program Manager, rules and skills, tests, this page, the Farm, Startup Star | R | 🔒W | X | 🐾 yes |
| 1 Friendly Farmer | the orchestrator and package manager | R | 🔒W | X | 🐾 yes |
| 2 Pets | every intelligent app | R | W | X | 🐾 yes |
| 3 Pet programs | the programs, sites and worlds Astra made | R | W | X | 🐾 yes |
| **Harness** | **the glass: the R W X line.** Claude Code or Codex is the seat; a model sits in it | | | | |
| 4 AI models | Claude, OpenAI, local models | – | – | X | no |
| 5 Third-party programs | apps, drivers, virtual audio and cloud services made by others | R | – | X | no |
| 6 Devices | PCs, phones, iPad, headsets, trackers, peripherals | R | – | X | no |
| 7 Advisers | ChatGPT | – | – | – | no: ideas reach the Farm only through Astra |
| 8 You | Astra | | | | grants every permission |

Ring 3 sits inside the glass because Astra made those programs: an agent may change their code. Ring 5 sits
outside because other people made those programs: an agent may run them and read what they show, never rewrite them.

## The boundaries: what is connected to what

Everything is disconnected until it reaches **your native farm**. Solid arrows are allowed; the crossed line never exists.

```mermaid
flowchart LR
  subgraph PC["Astra's PC: the native farm"]
    subgraph H["Agent harness: the R W X line (animals inside)"]
      CORE["Ring 0 core: registry, rules, Farm, Startup Star"]
      FARMER["Ring 1 Friendly Farmer"]
      PETS["Ring 2 pets"]
      PP["Ring 3 pet programs"]
    end
    SEAT(("Seat: Claude Code or Codex"))
    TP["Ring 5 third-party programs"]
    DEV["Ring 6 devices"]
  end
  subgraph LAN["Astra's local network"]
    LM["Local models (self-hosted)"]
  end
  subgraph CLOUD["Model providers"]
    CM["Claude, OpenAI"]
  end
  subgraph GH["GitHub: the only shared place"]
    REPOS["Astra's repos and Pages"]
    KEN["The Kennel: other people's pets, waiting"]
  end
  OTHER["Another user's farm"]
  ASTRA(["Astra"])

  SEAT -->|"R W X, core writes only by pull request"| H
  SEAT -->|"R X"| TP
  SEAT -->|"R X"| DEV
  SEAT <-->|"X: prompts and answers"| CM
  ASTRA -->|"only Astra changes them"| LM
  LM <-->|"works alongside, through Astra"| ASTRA
  PC -->|"push branches, publish"| REPOS
  REPOS -->|"pull after review"| PC
  KEN -.->|"only signed, checked, adopted"| PC
  OTHER -->|"pull public code only"| REPOS
  OTHER x--x|"never connected"| PC
  ASTRA -->|"approves"| SEAT
```

## The failure layers: what stops a bad change

A mistake or an attack has to get through every layer in order. Each one is independent, so one failing does not open the farm.

```mermaid
flowchart TB
  A["A change is attempted: by an agent, a script, a pet or a hijacked prompt"] --> L1
  L1["1 Rules and skills: AGENTS.md and skills/ say what is allowed"] --> L2
  L2["2 Harness permissions: the seat asks before commands and files outside its folder"] --> L3
  L3["3 Animal guard: scripts refuse anything that is not an animal, or a path outside its folder"] --> L4
  L4["4 The gate: a new repo waits in candidates; it cannot make itself an animal"] --> L5
  L5["5 Branch and pull request: work lands on a branch, never straight on main"] --> L6
  L6["6 Tests: npm test must pass (privacy, registry, map)"] --> L7
  L7["7 Astra's review: the core merges only with her approval"] --> L8
  L8["8 Signatures (planned): the farm refuses pets whose signature does not check out"] --> L8b
  L8b["8b The Police Station (planned): watches every write and key use, switches OFF, raises the alarm"] --> L9
  L9["9 Backups and undo: Backup Beaver and File Master's undo logs"] --> OK["The change is live"]
```

What happens when one part fails (**failure domains**):

| If this fails | What still works | What it can reach |
|---|---|---|
| One pet breaks | Every other pet; the Farmer marks it sick | Its own folder only |
| The seat (an agent) misbehaves | Main stays safe: its work is on a branch, the core needs Astra | Animals on its branch |
| A third-party program is compromised | Pets cannot be rewritten by it; it has no seat | What that program already reaches on the PC |
| GitHub is down or compromised | The native farm keeps running from its local copy | Nothing new is pulled until it is checked |
| Another user's farm is compromised | Nothing: farms are never connected | Their own farm only |
| The PC is lost | Code is on GitHub; data is in backups (Backup Beaver) | Anything not backed up |

## Known gaps

What is not true yet, in order of risk. Tracked in [docs/structure-audit-20261013.md](docs/structure-audit-20261013.md).

| # | Gap | Status |
|---|---|---|
| 1 | Agents act on Astra's own GitHub account, so GitHub cannot tell her from an agent, and "core needs Astra" is a written rule, not an enforced one. | First step chosen: Astra signs her own commits with her security key. Designed: a short-lived key per agent session from Iron Gates, watched by The Police Station (PET-PROGRAM-FRAMEWORK.md, section 12) |
| 2 | Remote Control and Desktop Commander let a phone control this PC: a path into the native farm from outside. | Astra deciding (on only when she turns it on?) |
| 3 | The Farmer's daily round used to make any repo with `pet.json` an animal automatically. | **Fixed 2026-10-13:** it now waits at the gate |
| 4 | Main has no branch protection, so nothing technical stops a push to main. | Needs Astra (a repository setting) |
| 5 | `bin/` holds built `.exe` files nobody can review. | Planned: build on the PC, publish checksums |
| 6 | Pages load three.js from a CDN without an integrity hash. | Planned |
| 7 | Old commits carried a legal name and email. | **Fixed 2026-10-13:** history rewritten; ask GitHub Support to purge cached views |
| 8 | Pets read web pages, issues and email: text there can try to give an agent orders (prompt injection). | Rule: data is never instructions |
| 9 | Local models on the network may answer anyone on it. | Planned: bind to this PC or LAN, require a key, no port forwarding |
| 10 | Signatures are not checked yet. | Planned |
