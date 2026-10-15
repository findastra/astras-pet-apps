# Tools and tricks

What a pet **has** and what a pet **knows**. Companion to [PET-PROGRAM-FRAMEWORK.md](PET-PROGRAM-FRAMEWORK.md) and
[PROTECTION-RINGS.md](PROTECTION-RINGS.md). Astra, 2026-10-14.

| | Tool | Trick |
|---|---|---|
| What it is | Code a pet program owns: a script, page, program or section. The pet's hands. | Know-how the pet's L3 agent has learned: written steps for doing a job with tools. The pet's training. |
| Developer word | Program, module, utility | **Skill** (a `SKILL.md` file), prompt, workflow |
| Who can use it | The pet program, and other pets with a grant (see "Shared tools") | Only a pet with an agent (L3). A pet without an agent has tools but no tricks. |
| Permissions | Its own ring and grants, never more | **None of its own.** A trick can only use tools the pet already has. It never brings new code or permissions. |
| On the page | A tool box: `<pet-program>-v<version>-<tool>-v<tool version>` | A trick box: `<pet-program>-v<version>-<trick>-trick-v<trick version>`, with where it came from and which tools it uses |
| ON/OFF | Yes | Yes |
| Who keeps track | Its pet program | **Skill Scout** tracks every trick: what changed, who changed it and why |

## Four real examples

| Pet | Tool (what it has) | Trick (what it knows) |
|---|---|---|
| File Master | `repo-catcher`: a PowerShell script that lists repos on the PC that were never pushed | **Weekly stale-repo sweep:** run repo-catcher, read its report, pick the repos that matter, and write a handoff card asking Astra which to push or archive |
| Friendly Farmer (The Farm) | `astras-pet-os-system-map`: the 3D map page; planned `first-time-here-tutorial` in `tutorial-tools`, readable without an agent | Optional guided walkthrough of **How to Take Care of Your Farm!**, using the tutorial tool; the user-facing SOP itself does not require an agent |
| Gone Ghost (Am I a Ghost?) | `name-eraser`: replaces a name with `USER` in files | **Scrub before posting:** before a vet-clinic ticket goes out, run name-eraser as a dry run, run the secret scan, show L4 the exact text, then post |
| Unity Unicorn | `harness-strapper`: a Unity editor tool that rigs avatars | **Rig a new avatar:** import it, run harness-strapper, check the bones, then record which avatar it is rigged on in the tool box |

A trick that already exists today: `skills/handoff` in this repo teaches every agent how to write a handoff card. It
is a trick, not a tool: it is instructions, and it only uses tools the agents already have (git, files).

## Shared tools and grants

One tool can be used by several pets. There is only **one copy**, owned by one pet program; other pets get a **grant**.

- A grant says exactly which **folders**, which of **R W X**, and what **limits** (how many results, how often).
- Gatekeeper Goddess (Iron Gates) issues grants; L4 approves them. Both pets show the grant in their connection box.
- Example: `pet-program-12-v1.0-everything-search-v1.0` is File Master's connector to Everything (a third-party
  search program). File Master's grant: the whole PC, read only. Wifi Butterfly's grant: its own folder only,
  read only, 50 results per search.

Never make a separate copy for each pet (`friendly-farmer-everything-search`, `wifi-butterfly-everything-search`):
copies drift apart, and a security patch has to be applied to every copy.

## Third-party tools and tricks: the Shed

Other creators make tools and tricks too. They are welcome, and they are treated like a pet from another farm.

- **The Shed** is the public place for third-party tools and tricks, as the Kennel is for pets
  ([findastra/the-shed](https://github.com/findastra/the-shed)). Creators submit them; the community and the
  maintainers review them.
- A **third-party trick** is only text, but text can steer an agent (prompt injection). A **third-party tool** is code
  from a stranger. Both go into quarantine, a checker agent reviews them, and the farm's L4 approves before they run.
- Trust tiers, highest first: **official** (signed by the maintainers), **Shed-verified** (reviewed and adopted
  through the Shed), **community** (anything else, always shown with a warning).
- Developer words: third-party tricks are **skills** or **prompts**; third-party tools that connect an agent to a
  program are **plugins** or **MCP servers**.
