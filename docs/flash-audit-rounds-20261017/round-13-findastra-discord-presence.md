# Round 13: Discord Damsel — Discord Tower

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/findastra-discord-presence](https://github.com/findastra/findastra-discord-presence) (public) · audited `main` at `21f0fec`

<img src="../../art/icons/findastra-discord-presence-20261012.png" width="88" alt="Discord Damsel icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/discord-damsel/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/discord-damsel/blink.png" width="64" alt="blink"> | <img src="../../art/frames/discord-damsel/idle.png" width="64" alt="idle"> | <img src="../../art/frames/discord-damsel/curious.png" width="64" alt="curious"> | <img src="../../art/frames/discord-damsel/happy.png" width="64" alt="happy"> | <img src="../../art/frames/discord-damsel/worried.png" width="64" alt="worried"> | <img src="../../art/frames/discord-damsel/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/discord-damsel/sick.png" width="64" alt="sick"> | <img src="../../art/frames/discord-damsel/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [findastra-discord-presence#3](https://github.com/findastra/findastra-discord-presence/pull/3)

### Exceptions

1. **A10 Website route** — Incorrect. Program route https://github.com/findastra/findastra-discord-presence#start-it-about-2-minutes is a repo page posing as the program.  
   *Next:* Give it a real program page, or point the route at one.
2. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (Discord) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
3. **A56 Saved in its own folder** — Incorrect. openai-discord-presence/src/detector.js: 1× a dated chat folder (e.g. "Documents\Codex\").  
   *Next:* A stray PC path in code or docs; moving files goes through a File Master plan.
4. **A57 Current names only** — Incorrect. Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `findastra-discord-presence-20261008.html`, `openai-discord-presence/DEVELOPMENT.md`, `openai-discord-presence/src/presence.js`, `openai-discord-presence/test/project-name-test-20261011.js`.  
   *Next:* Inside code (a storage key or a name the code looks for), so it was left alone tonight.
5. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
6. **A17 Git branches** — Incorrect. 5 branch(es) with work not on main and no open pull request: claude/galaxy-art-and-handoff-20261017 (+4), claude/presence-names-shuffle-20261014 (+6), claude/rescue-damsel-unsaved-20261017 (+7), codex/discord-tower-interface-20261015 (+3), codex/l3-activity-20261016 (+4).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
7. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
8. **A52 L3 activity bubble** — On a branch. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
9. **A44 Yellow phone** — On a branch. Shared phone baseline not found.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
10. **A45 Paper and zoom** — On a branch. Shared stationery source not found.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.
11. **A41 Clicker Training** — On a branch. No Clicker Training section found in the inspected entry source.  
   *Next:* It is built on unmerged branch `claude/rescue-damsel-unsaved-20261017` ([compare](https://github.com/findastra/findastra-discord-presence/compare/main...claude/rescue-damsel-unsaved-20261017)): merging that branch passes this.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A15 README and credit** — README has no Limits section.
- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Manages the Discord presence apps (OpenAI and Anthropic) and other Discord apps."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 9 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, findastra-discord-presence-20261008.html, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.
- README: added a Limits section from INTELLIGENCE-LEVELS.md.

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`claude/galaxy-art-and-handoff-20261017`](https://github.com/findastra/findastra-discord-presence/compare/main...claude%2Fgalaxy-art-and-handoff-20261017) (+4), [`claude/presence-names-shuffle-20261014`](https://github.com/findastra/findastra-discord-presence/compare/main...claude%2Fpresence-names-shuffle-20261014) (+6), [`claude/rescue-damsel-unsaved-20261017`](https://github.com/findastra/findastra-discord-presence/compare/main...claude%2Frescue-damsel-unsaved-20261017) (+7), [`codex/discord-tower-interface-20261015`](https://github.com/findastra/findastra-discord-presence/compare/main...codex%2Fdiscord-tower-interface-20261015) (+3), [`codex/l3-activity-20261016`](https://github.com/findastra/findastra-discord-presence/compare/main...codex%2Fl3-activity-20261016) (+4). Open a PR, merge, or leave?
2. **Merge the fix PR** [findastra-discord-presence#3](https://github.com/findastra/findastra-discord-presence/pull/3)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
