# Round 16: VSCode Angel — Halo List

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/vscode-angel](https://github.com/findastra/vscode-angel) (public) · audited `main` at `f626a09`

<img src="../../art/icons/vscode-angel-20261012.png" width="88" alt="VSCode Angel icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/vscode-angel/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/vscode-angel/blink.png" width="64" alt="blink"> | <img src="../../art/frames/vscode-angel/idle.png" width="64" alt="idle"> | <img src="../../art/frames/vscode-angel/curious.png" width="64" alt="curious"> | <img src="../../art/frames/vscode-angel/happy.png" width="64" alt="happy"> | <img src="../../art/frames/vscode-angel/worried.png" width="64" alt="worried"> | <img src="../../art/frames/vscode-angel/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/vscode-angel/sick.png" width="64" alt="sick"> | <img src="../../art/frames/vscode-angel/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [vscode-angel#2](https://github.com/findastra/vscode-angel/pull/2)

### Exceptions

1. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (VS Code, Visual Studio) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
2. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
3. **A17 Git branches** — Incorrect. 1 branch(es) with work not on main and no open pull request: claude/halo-list-pet-json-20261017 (+1).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
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

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`, `sprite-20261008.json`, `vscode-angel-20261008.html`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Un-vibe-codes a project and keeps everything written down in Markdown."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 6 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, pet.json, sprite-20261008.json, vscode-angel-20261008.html (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`claude/halo-list-pet-json-20261017`](https://github.com/findastra/vscode-angel/compare/main...claude%2Fhalo-list-pet-json-20261017) (+1). Open a PR, merge, or leave?
2. **Merge the fix PR** [vscode-angel#2](https://github.com/findastra/vscode-angel/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
