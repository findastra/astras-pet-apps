# Pet Program Framework

The standard every pet program follows: what its page shows, how its tools, data, versions, backlog and agents
work, and how security patches reach every farm. Written from Astra's instructions of 2026-10-13 by Claude Opus 5.5.
**Every new pet program is built to this, and every existing one is brought up to it.**

> 🐾 Everything inside the harness is an animal. Agents can only control animals. L4 approves everything that matters.

## 1. Words (developer language, no marketing)

| Word | Meaning |
|---|---|
| **L1** Program | The pet program works on its own: code, page, data. |
| **L2** Runtime | It runs by itself: schedule, checks, inbox, memory. |
| **L3** Agentic harness | An AI agent sits in the pet program's seat and does its tasks with its tools. |
| **L4** Verified human | The verified human who owns the entire secure ecosystem (on Astra's farm: Astra). Every security change, every permission and every exception to a default is approved by L4. On another user's farm, that user is L4. |
| Pet program icon | The character (Friendly Farmer). |
| Pet program | The one main program a pet stands for (The Farm). |
| Tool | Any other program, page or section a pet program owns. Same ring and permissions as its pet program, never more. |
| Tool box | How a tool appears on a page: a bordered box with its versioned label on the top border and everything about the tool inside. |
| Connection box | How a link to another pet appears: a box with a border of its own colour (never the tool box colour), titled with just the other pet's **pet program icon** name, as if the two are talking. Inside: what flows each way. |
| Third-party | Programs, libraries and services made by others. |
| Maker agent / checker agent | The agent that proposes and applies a change, and a separate read-only agent that verifies it (the maker-checker rule). |
| Backlog | The never-lost list of notes, screenshots and change requests for a pet program. |

## 2. Names and versions: everywhere

Versions start with `v`, like git tags. A name keeps its number; a version never hides inside it.

| Thing | Pattern | Example |
|---|---|---|
| Pet program (no name yet) | `pet-program-<#>-v<version>` | `pet-program-3-v1.0` |
| Pet program (named) | `<pet-program>-v<version>` | `the-farm-v1.0` |
| Icon (mood 1 to 9) | `<pet-program>-v<version>-icon-<mood>-v<icon version>` | `pet-program-3-v1.0-icon-2-v1.0.png` |
| Tool box label | `<pet-program>-v<version>-<tool>-v<tool version>` | `pet-program-3-v1.0-notes-tool-v1.0`, `the-farm-v1.0-astras-pet-os-system-map-v1.0`, `pet-program-5-v1.0-harness-strapper-v1.0` |
| Backlog (the store) | `<pet-program>-backlog` | `the-farm-backlog` |
| Backlog entry | `<pet-program>-v<version>-backlog-<YYYYMMDD>-<NNN>` | `the-farm-v1.0-backlog-20261013-001` |
| Weekly backlog run | `<pet-program>-v<version>-backlog-run-<YYYYMMDD>` | `the-farm-v1.0-backlog-run-20261019` |

The backlog store is the one name without a version, on purpose: it belongs to the pet program across every version,
so it is never lost. Every entry and every run inside it carries the version it was written against.
Mood numbers: 1 calm, 2 blink, 3 happy, 4 curious, 5 worried, 6 sad, 7 sick, 8 shocked, 9 asleep.

## 3. The page, top to bottom

Every pet program page is made of tool boxes. Each has a border, its versioned label on the top border, and
everything about that tool inside it.

1. **Icon tool box** (top left): the current mood icon, labelled with its full icon name
   (`pet-program-3-v1.0-icon-2-v1.0`).
2. **Status line** (always visible):
   - **Data:** whose data is showing (the user's handle, never a legal name).
   - **Last entry:** date of the user's last entry.
   - **Updated:** date of this pet program's last update to itself, with its version.
   - **Seat:** whether an AI is in the harness now, which one (Claude Code, Codex, ChatGPT, a local model) and its
     task: a tool of this pet program, or a chat, Codex task or project name. It reuses the presence structure of
     `anthropic-discord-presence` and `openai-discord-presence` (app, model, project, task, since). "Seat: empty"
     when no agent is working.
   - **On the map:** a link to the System Map focused on this pet program's own node
     (`…/system-map-20261012.html#node=<node-id>`), where it shows connected to the Friendly Farmer.
3. **Notes tool box** (`<pet-program>-v<version>-notes-tool-v<version>`), near the top: a text box, screenshot upload
   and a **Submit** button. Every submission is saved to the backlog straight away, before anything else happens.
4. **Chat tool box:** a chat bot drawn as the pet program icon. On first visit it asks whether it may use the user's
   own AI subscriptions (Claude, ChatGPT, local models, whatever they have) and remembers the answer on that device;
   the user can change it any time. It signs in through the user's own accounts; no API key is stored in the page.
5. **The pet program's own tool boxes**, one per tool. Every tool box has:
   - an **ON/OFF** switch (a kill switch): OFF stops the tool at once, for a suspected security breach;
   - a **sick** checkbox: "this tool is broken from my point of view" (it goes to the Farmer's
     `broken-tools-on-the-farm` and to the backlog), with **Take it to the vet-clinic** to ask the community
     (section 10);
   - its version, what it does in one plain line, its links, and how it is used. A Unity Unicorn tool such as
     `harness-strapper` links its download on the title and lists which avatars it is rigged on.
6. **Connection boxes**, one for every other pet this pet program talks to. They use a different border colour from
   tool boxes, and the title on the border is only the other pet's icon name (for example **Log Lynx**). Inside:
   - **Sends:** what this pet program sends to it, and why (for example "status: my health, daily");
   - **Receives:** what it gets back, and why;
   - the other pet program's name and version, small (`pet-program-48-v1.0`), and the scope L4 granted;
   - the last exchange (date and time) and whether it worked;
   - an **ON/OFF** switch for the connection, so a suspected breach can be cut off between two pets without turning
     either one off. The same rules apply as for tools (section 4).
   The flows come from the same relations the System Map draws, so the page and the map always agree.
7. **Links tool box**, grouped by kind (section 5).
8. **Backlog health tool box:** healthy / needs attention / unhealthy, with the L3 agent's diagnosis of what is
   unhealthy, the date of the next weekly run, and the schedule.
9. **Footer:** the coding languages used, from the repo; credit "by Astra" and the license; signature status.

## 4. Tools: ON/OFF and sick, enforced, not just shown

- The ON/OFF state lives in the core (the Farm), not in the tool's own storage, so a compromised tool cannot turn
  itself back on. The runtime checks it before the tool runs; the checkbox on the page only asks the core.
- Anyone on the farm may turn a tool **OFF**. Turning it back **ON** after a security OFF needs L4 approval and is logged.
- **The Farmer's `broken-tools-on-the-farm`** tool box lists every tool marked sick, turned off, or failing its
  health check, across every pet, with which pets use it.

## 5. Link kinds

Every link sits in one group and carries three badges, so nobody has to guess what it is.

| Group | What goes there |
|---|---|
| **Home** | Its node on the System Map; The Farm |
| **Source** | Repo, releases (versions), changelog |
| **Tools it hosts: public** | Hosted tool pages anyone can open |
| **Tools it hosts: private** | Tools that open only on this PC (local only) |
| **Third-party it uses (external)** | Programs, libraries, services and AI models made by others |
| **Data it reads or writes** | Local folders and APIs, each with the scope L4 granted |
| **Pets it works with** | Shown as connection boxes (section 3, item 6), not as plain links |
| **Docs** | README, PROTECTION-RINGS.md, this framework (with the version it follows) |

Badges: **who made it** (Astra / third-party) · **where it runs** (this PC / local network / hosted) ·
**who can see it** (public / private).

## 6. Data: never lost, always transferable

- Data lives outside the code, per user and per pet program, not per version:
  `%LOCALAPPDATA%\astras-pet-os\<pet-program>\` on the PC (pages that run in a browser keep it in browser storage
  and export to the same folder).
- Every data file records its `schema` version. Every new pet program version ships a **migration**. An update
  installs the new code, copies the old data to a dated backup, then migrates. Nothing is deleted.
- Updates carry the user's data to the new version on their own farm automatically (on Astra's farm: her local
  session). **Export** and **import** (JSON plus images) move data to a new device or version by hand.
- The backlog is medium sized: up to 2,000 entries or 200 MB. Past that, finished entries move to
  `<pet-program>-backlog-archive`, which is kept too.

## 7. The backlog and the weekly run

- Each entry: `id`, `created`, `author` (handle), `kind` (note, screenshot, bug, change request), `tool` (which tool
  box it is about), `text`, `attachments`, `status` (new, queued, in run, done, declined), `run`.
- **Weekly by default.** The L3 agent's scheduled run bundles every new entry, with its screenshots, into the next
  task prompt (`<pet-program>-v<version>-backlog-run-<date>`). Running more often costs more tokens, so it needs L4
  approval.
- After each run the L3 agent updates **backlog health** and says what is unhealthy (stale entries, duplicates,
  entries with no tool, screenshots with no description) and how it will improve as the backlog grows.

## 8. When something breaks: detect, fix, check, approve, roll out

Example: a pet program's link to the System Map is broken.

1. **Detect.** Log Lynx's health checks find the broken link. The Farmer watches Log Lynx's own heartbeat, so a
   silent Log Lynx is noticed too.
2. **Known fix?** If a runbook (an existing protocol) covers it, run it. No AI is needed.
3. **New issue: maker agent.** The L3 agent opens an incident and drafts a fix on a branch, using only allowed pets
   (Platform Platypus, Wifi Butterfly, Log Lynx, …) and only for each tool's declared intended use. Those
   declarations live in the core, where the maker cannot edit them.
4. **Checker agent.** A separate agent with read-only access reviews the proposed change: is it within the
   declared use, within permissions, and does the diff do only what it says? Ideally a different model or
   provider, in its own context, seeing the diff and the rules but not the untrusted input that caused the
   incident. It cannot edit.
5. **L4 approves.** Every security-related change notifies L4, who sees the request and authorizes it or not.
6. **Roll out in stages.** L4's own farm first; other farms pull the signed release; automatic rollback if health
   checks fail.
7. **Record.** Log Lynx writes the incident and the approval to an append-only log. It records approvals; it can
   never create one. L4's approval is the proof, signed with L4's security key once signing is in place.

Two agents that disagree escalate to L4 after two rounds.

## 9. Security patches for every farm

- The framework is versioned (this file's version is in each pet program's `pet.json` as `framework`).
- Patches ship as **signed releases**. Each farm's Friendly Farmer checks for them, verifies the signature,
  quarantines the update, and installs it when that farm's L4 approves. That farm's L4 may opt in to installing
  signed security patches automatically.
- Nobody pushes into another person's farm. Farms pull; GitHub is the only shared place.

## 10. Is your pet sick? The vet-clinic (community help)

Astra's PetOS is meant for anyone to adopt: an open-source personal AI platform that its community keeps healthy,
the way Linux distributions take bug reports and fixes from their users. The **vet-clinic** is where that happens.

- **What it is:** a public issue tracker on GitHub (the only shared place; farms still never connect to each other).
  A farmer whose pet is sick opens a **ticket**; other farmers diagnose it and may offer a **cure** (a code fix,
  as a pull request or patch).
- **Names:** ticket `vet-clinic-ticket-<NNNN>`, titled `<pet-program>-v<version>: <what is wrong>`; a cure is
  `vet-clinic-ticket-<NNNN>-cure-<N>`.
- **Before a ticket is posted** (on the farmer's own PC): only the sick tool's code and the error are attached, never
  private data. name-eraser and the secret scan run first, and the farmer's L4 approves the exact text that goes out.
  Private pets (health, finance, memes, privacy tools) post a description and the error only, never their code.
- **Trust tiers**, highest first. Every answer shows its tier:
  1. **Official:** signed releases from the project's maintainers.
  2. **Kennel-verified:** pets and fixes reviewed and adopted through the Kennel.
  3. **vet-clinic community:** answers and cures from other farmers. **Every one carries a warning:** unverified
     code from someone you do not know. It never runs automatically.
- **Using a cure:** treated like a pet from another farm (the sick cow rule). It goes into quarantine, a checker agent
  reviews it against the ticket, and the farm's L4 approves it before it runs.
- **Everything is logged.** Every ticket, answer and cure stays on GitHub, and Log Lynx keeps the farm's own copy.
  Cures that work for many farms are reviewed by the maintainers and become official patches, so community fixes
  improve the whole platform.
- **Who runs it:** until a professional security engineer joins (when teams begin), the project's maintainer (Astra)
  is the moderator, with a triage pet that labels tickets, checks for leaked secrets, and runs offered cures in an
  isolated test (CI). The triage pet never merges anything.

## 11. Checklist for a new or updated pet program

- [ ] Names and versions follow section 2 everywhere: repo, files, icons, tool box labels, backlog.
- [ ] `pet.json` lists `framework`, every tool (name, version, intended use, public or private) and its links by kind.
- [ ] Page has every block in section 3, in that order. Every tool box has ON/OFF and sick; every connection box
      has its own border colour, the other pet's icon name as its title, sends and receives, and ON/OFF.
- [ ] Data is outside the code, with a schema version, a migration, export and import (section 6).
- [ ] Backlog and the weekly run work, and backlog health shows (section 7).
- [ ] The map link focuses its own node. Languages show in the footer.
- [ ] Plain developer language throughout; no marketing.
- [ ] Follows [PROTECTION-RINGS.md](PROTECTION-RINGS.md): it is an animal only once L4 lets it in.
