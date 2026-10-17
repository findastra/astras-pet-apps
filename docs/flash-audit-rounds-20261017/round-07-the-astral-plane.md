# Round 7: Astra Wisp — The Astral Plane

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/the-astral-plane](https://github.com/findastra/the-astral-plane) (public) · audited `main` at `d51cbe5`

<img src="../../art/icons/vrchat-ai-astra-20261012.png" width="88" alt="Astra Wisp icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/astra-wisp/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/astra-wisp/blink.png" width="64" alt="blink"> | <img src="../../art/frames/astra-wisp/idle.png" width="64" alt="idle"> | <img src="../../art/frames/astra-wisp/curious.png" width="64" alt="curious"> | <img src="../../art/frames/astra-wisp/happy.png" width="64" alt="happy"> | <img src="../../art/frames/astra-wisp/worried.png" width="64" alt="worried"> | <img src="../../art/frames/astra-wisp/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/astra-wisp/sick.png" width="64" alt="sick"> | <img src="../../art/frames/astra-wisp/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [the-astral-plane#3](https://github.com/findastra/the-astral-plane/pull/3)

### Exceptions

1. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (VRChat) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
2. **A13 Repo** — Incorrect. Catalog repo vrchat-ai-astra redirects to the-astral-plane.  
   *Next:* The catalog still names the old repo; GitHub redirects it. The hub catalog fix follows the GitHub name.
3. **A56 Saved in its own folder** — Incorrect. vrchat-embodiment/HANDOFF-CLAUDE.md: 2× a dated chat folder (e.g. "Documents\ChatGPT\"). vrchat-embodiment/docs/meep-inventory.md: 1× a dated chat folder (e.g. "Documents\ChatGPT\"). vrchat-embodiment/docs/poppy-inventory.md: 1× a dated chat folder (e.g. "Documents\ChatGPT\").  
   *Next:* A stray PC path in code or docs; moving files goes through a File Master plan.
4. **A57 Current names only** — Incorrect. Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `vrchat-ai-astra-20261008.html`.  
   *Next:* Inside code (a storage key or a name the code looks for), so it was left alone tonight.
5. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
6. **A16 pet.json** — Incorrect. pet.json job differs from the registry. pet.json: "Watches the health of AI Astra, both while she runs and while she is being worked on offline, so problems show up before a session."  
   *Next:* The pet submitted a different job to the Farmer: see Decisions.
7. **A17 Git branches** — Incorrect. 1 branch(es) with work not on main and no open pull request: claude/the-astral-plane-links-20261017 (+1).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
8. **A55 Pictures** — Missing. README shows 0 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
9. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
10. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
11. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
12. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
13. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.
14. **A31 Links** — Incorrect. Broken link https://github.com/findastra/vrchat-ai-astra/tree/v0.1.0-20261008-pets: repo renamed: vrchat-ai-astra is now the-astral-plane.  
   *Next:* Fix or remove the link.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 6 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, pet.json, vrchat-ai-astra-20261008.html (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- Not changed: pet.json job differs from the registry, and the pet submitted a job to the Farmer on 2026-10-17. That submission needs the Farmer and Astra.
- pet.json: audit block copied from the registry.

</details>

### Decisions

1. **Job:** Astra Wisp submitted its own job to the Farmer (2026-10-17), and the registry says something else. Which one is right?
  - Pet's own: "Watches the health of AI Astra, both while she runs and while she is being worked on offline, so problems show up before a session."
  - Registry: "Watches the health of VRChat AI Astra, both while she runs and while she is being worked on offline, so problems show up before a session."
2. **Branches with work not on main** and no pull request: [`claude/the-astral-plane-links-20261017`](https://github.com/findastra/the-astral-plane/compare/main...claude%2Fthe-astral-plane-links-20261017) (+1). Open a PR, merge, or leave?
3. **Merge the fix PR** [the-astral-plane#3](https://github.com/findastra/the-astral-plane/pull/3)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
