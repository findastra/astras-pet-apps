# Round 3: Chip — Data Dealer

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/data-dealer](https://github.com/findastra/data-dealer) (public) · audited `main` at `70d68bb`

<img src="../../art/icons/data-dealer-20261012.png" width="88" alt="Chip icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/chip/sleep-20261008.png" width="64" alt="sleep"> | <img src="../../art/frames/chip/blink-20261008.png" width="64" alt="blink"> | <img src="../../art/frames/chip/idle-20261008.png" width="64" alt="idle"> | <img src="../../art/frames/chip/curious-20261008.png" width="64" alt="curious"> | <img src="../../art/frames/chip/happy-20261008.png" width="64" alt="happy"> | <img src="../../art/frames/chip/worried-20261008.png" width="64" alt="worried"> | <img src="../../art/frames/chip/alarmed-20261008.png" width="64" alt="alarmed"> | <img src="../../art/frames/chip/sick-20261008.png" width="64" alt="sick"> | <img src="../../art/frames/chip/sad-20261008.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [data-dealer#2](https://github.com/findastra/data-dealer/pull/2)

### Exceptions

1. **A10 Website route** — Not verified. Program route https://claude.ai/artifact/CzBXnEWyRjq5Tui7o3oRS8 lands behind a sign-in (claude.ai).  
   *Next:* Not verified: the route needs a sign-in, so nobody else can open it. Decide where this program should live publicly.
2. **A15 README and credit** — Missing. README has no Limits section.  
   *Next:* This README is the product's own, so tonight only names and links changed in it. Add a Limits section there?
3. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
4. **A17 Git branches** — Incorrect. 4 branch(es) with work not on main and no open pull request: claude/dashboard-fixes-20261017 (+1), codex/chip-coin-20261014 (+2), codex/l3-activity-20261016 (+4), codex/yellow-phone-20261015 (+3).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
5. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
6. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
7. **A52 L3 activity bubble** — On a branch. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/data-dealer/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
8. **A44 Yellow phone** — On a branch. Shared phone baseline not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/data-dealer/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
9. **A45 Paper and zoom** — On a branch. Shared stationery source not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/data-dealer/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
10. **A41 Clicker Training** — On a branch. No Clicker Training section found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/data-dealer/compare/main...codex/l3-activity-20261016)): merging that branch passes this.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Data Dealer's pixel twin."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 4 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`claude/dashboard-fixes-20261017`](https://github.com/findastra/data-dealer/compare/main...claude%2Fdashboard-fixes-20261017) (+1), [`codex/chip-coin-20261014`](https://github.com/findastra/data-dealer/compare/main...codex%2Fchip-coin-20261014) (+2), [`codex/l3-activity-20261016`](https://github.com/findastra/data-dealer/compare/main...codex%2Fl3-activity-20261016) (+4), [`codex/yellow-phone-20261015`](https://github.com/findastra/data-dealer/compare/main...codex%2Fyellow-phone-20261015) (+3). Open a PR, merge, or leave?
2. **Data Dealer's program route** is a claude.ai artifact behind a sign-in. Should the route point somewhere public (a GitHub Pages page), or stay private?
3. **Merge the fix PR** [data-dealer#2](https://github.com/findastra/data-dealer/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
