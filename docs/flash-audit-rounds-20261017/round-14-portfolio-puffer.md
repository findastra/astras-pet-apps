# Round 14: Portfolio Puffer — Iced Out Iceberg

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/portfolio-puffer](https://github.com/findastra/portfolio-puffer) (public) · audited `main` at `06eb0f4`

<img src="../../art/icons/portfolio-puffer-20261012.png" width="88" alt="Portfolio Puffer icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/portfolio-puffer/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/portfolio-puffer/blink.png" width="64" alt="blink"> | <img src="../../art/frames/portfolio-puffer/idle.png" width="64" alt="idle"> | <img src="../../art/frames/portfolio-puffer/curious.png" width="64" alt="curious"> | <img src="../../art/frames/portfolio-puffer/happy.png" width="64" alt="happy"> | <img src="../../art/frames/portfolio-puffer/worried.png" width="64" alt="worried"> | <img src="../../art/frames/portfolio-puffer/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/portfolio-puffer/sick.png" width="64" alt="sick"> | <img src="../../art/frames/portfolio-puffer/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [portfolio-puffer#2](https://github.com/findastra/portfolio-puffer/pull/2)

### Exceptions

1. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
2. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
3. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
4. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
5. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
6. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
7. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`, `portfolio-puffer-20261008.html`, `sprite-20261008.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Keeps the portfolio at findastra.github.io current: reads GitHub and LinkedIn, works out what changed, proposes the edits and pushes only wh"
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 6 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, pet.json, portfolio-puffer-20261008.html, sprite-20261008.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.

</details>

### Decisions

1. **Merge the fix PR** [portfolio-puffer#2](https://github.com/findastra/portfolio-puffer/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
