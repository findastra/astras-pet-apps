# Structure audit: the System Map against the words we defined (2026-10-13)

Claude Opus 5.5, head chat. Checked the System Map's shape key, names, rings and data against what Astra defined on
2026-10-13: the naming table ([naming-20261013.md](naming-20261013.md)), the protection rings and R W X
([PROTECTION-RINGS.md](../PROTECTION-RINGS.md)), animal code, third-party programs, the seat, and separate farms.

## Fixed in this change

| # | Finding | Fix |
|---|---|---|
| 1 | The shape key had one "Cube" for two different rings. | Split: **pink cube** = pet program (ring 3, inside the harness, R W X); **peach cube** = third-party program (ring 5, outside, R X). |
| 2 | The key said "root programs"; "root" means superuser to developers. | "Third-party programs" everywhere. |
| 3 | "Shell" for the map's spheres (developers hear "command shell"). | "Ring" everywhere in the map. |
| 4 | Nothing showed what an agent may do where. | R W X tags on every ring in 3D, a READ · WRITE · EXECUTE key in the panel, and a ring line in every node's card. |
| 5 | Claude Code and Codex were "development, outside the system", although they are the harness. | The **donut** at the seat on top of the glass; models wait above its hole. ChatGPT is an adviser outside, with no access. |
| 6 | The Farm sat with you and Startup Star with the programs, though both are core code. | Both moved to ring 0, the core. |
| 7 | The Kennel (other people's pets) sat in the core, inside the harness. | Moved outside the harness: it is public and holds code from strangers, like a quarantine pen. |
| 8 | Devices were split between two rings. | All devices on ring 6. |
| 9 | "The Farm (native OS)": Astra's PetOS runs on Windows; it is a platform, not an operating system. | Renamed "The Farm (your native home)". "PetOS" stays as the brand. |
| 10 | Pet program names on the map used unassigned ideas (The Barn, Key Ring, File Kingdom, Unity Stable, Audio Rescue, Fuzz Factory). | They show as `pet-program-1`, `-4`, `-5`, `-12`, `-19`, `-30`, with the idea in their card. |
| 11 | Gone Ghost's program was drawn as Ghost Protocol. | **Am I a Ghost?** (local controls and an exact local copy) added; Ghost Protocol is its public, hosted side. |
| 12 | Gatekeeper Goddess had no program. | **Iron Gates** in the naming table. |
| 13 | The Farmer's daily round made any repo with a `pet.json` or `pet-app` topic an animal by itself. | New repos now wait at the gate (`candidates`) for Astra. Animal guard added and tested. |
| 14 | Only half the sphere was used. | Each ring is spread over the whole sphere by rank, keeping neighbours together. |
| 15 | The key panel could not be widened. | Drag bar on its right edge; keys use more columns when wide. |
| 16 | The Farm and the Farmer's pet program were two separate nodes. | One node: **The Farm**, pet-program-1, the core. Its tools (the System Map, Startup Star) hang off it. |
| 17 | Programs a pet program owns had no kind of their own; the System Map was not on the map. | **Tools**, drawn as hammers on their pet program's ring: the System Map, Startup Star, name-eraser, the internet scrub, the new-programs watch. |
| 18 | Third-party programs were cubes like pet programs, and the libraries and services the map uses were missing. | Everything third-party is a **satellite** on ring 5, including three.js, Google Fonts, the web browser and Node.js. |

## Open: needs Astra's decision

| # | Finding | Why it matters | Recommendation |
|---|---|---|---|
| A | **"Harness" means two things.** ASTRAS_PET_OS and INTELLIGENCE-LEVELS use it for each pet's own AI layer (intelligence level 3, "AI harness (per pet)"). The map now uses it for the seat that Claude Code or Codex fills, with R W X over the animals. | Two different things with one name is the confusion engineers will hit first. | Keep **agent harness** for the seat. Call each pet's own AI layer its **pet agent** (level 3). |
| B | **Two numbering systems.** Line colours use architecture *layers* 0 to 6; spheres use permission *rings* 0 to 8. A pet program is layer 6 but ring 3. | Engineers will expect one number per thing. | Make rings the only numbers; colour lines by what they carry instead of by layer. |
| C | **"Raspberry Pi" is both a pet and a device.** | Search and cards cannot tell them apart. | Give the pet icon its own name. |
| D | **You are drawn as a sphere, like the pets.** | Spheres are animals; you are not one. | A shape of your own (a star). |
| E | **Seeds and roadmap pets sit inside the harness** but are not in the registry, so they are not animals yet. | The picture says "controllable"; the code says "not yet". | Keep them faint, and say "not an animal until registered" on their card. |
| F | **Pyramids mix two roles:** harness programs (Claude Code, Codex) and an adviser (ChatGPT). | Minor. | Fine for now; the card says which. |
| G | **The Friendly Farmer is an "animal"** in code terms, though he is a human character. | Minor: "animal" means code inside the harness, not species. | Keep, and say so once in PET-WORDS.md. |
