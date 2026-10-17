# Round 33: Mesh Moth — pet-program-33

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/mesh-moth](https://github.com/findastra/mesh-moth) (public) · audited `main` at `6486c41`

<img src="../../art/icons/mesh-moth-20261012.png" width="88" alt="Mesh Moth icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [mesh-moth#2](https://github.com/findastra/mesh-moth/pull/2)

### Exceptions

1. **A07 Program name** — Missing. Program name not chosen (suggested idea: Mesh Lantern).  
   *Next:* Your pick: see Decisions.
2. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (Meshtastic) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
3. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
4. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
5. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
6. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
7. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
8. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
9. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `CLAUDE.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Placeholder for a pet that stands for a Meshtastic node: it will show the node's place in a radio mesh."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — 2 links point at the old hub name or a missing file: <https://github.com/findastra/astras-pet-apps/blob/main/handoffs/008-farmer-register-new-placeholders.md>, <https://github.com/findastra/astras-pet-apps>.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 8 replacement(s) in AGENTS.md, CLAUDE.md, README.md, desktop-pet-20261011.json, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.
- README: the stale "Not in the Cage yet ... card 008" line now says it is a pipeline pet in pets.json (card 008 is an old dropped draft).

</details>

### Decisions

1. **Program name** for Mesh Moth (now `pet-program-33`). Pick one, or write your own:
   - **A. Mesh Lantern** — the catalog idea: a lantern on the radio mesh
   - **B. Moonlight Mesh** — moths fly at night, when the mesh carries messages
   - **C. The Relay Tower** — the node's place and health in the mesh
   - **D. Mesh Porchlight** — a small light other nodes find
2. **Merge the fix PR** [mesh-moth#2](https://github.com/findastra/mesh-moth/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
