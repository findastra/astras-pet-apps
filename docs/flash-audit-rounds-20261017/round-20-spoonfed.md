# Round 20: Sugarcube — Spoonfed

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/spoonfed](https://github.com/findastra/spoonfed) (public) · audited `main` at `9b060d9`

<img src="../../art/icons/spoonfed-20261012.png" width="88" alt="Sugarcube icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [spoonfed#1](https://github.com/findastra/spoonfed/pull/1)

### Exceptions

1. **A09 Program page** — Missing. pet.json declares no entry (the program page).  
   *Next:* Add the program page and declare it as `entry` in pet.json.
2. **A14 Required files** — Missing. Required files: pet.json, README.md, LICENSE Public pet repo without the pet-app topic.  
   *Next:* Open.
3. **A15 README and credit** — Missing. No README.md.  
   *Next:* Small README fix.
4. **A16 pet.json** — Incorrect. pet.json is not a JSON object.  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
5. **A17 Git branches** — Incorrect. 1 branch(es) with work not on main and no open pull request: claude/rescue-spoonfed-app-20261012 (+1).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
6. **A55 Pictures** — Missing. README shows 0 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).

### Fixed tonight (in the fix PR, waiting for your merge)

- **A14 Required files** — Required files: pet.json, README.md, AGENTS.md, CLAUDE.md, LICENSE
- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `desktop-pet-20261011.json`.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 1 replacement(s) in desktop-pet-20261011.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- Added CLAUDE.md (pointer to AGENTS.md and the hub rules).
- Added AGENTS.md (house rules pointer).

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`claude/rescue-spoonfed-app-20261012`](https://github.com/findastra/spoonfed/compare/main...claude%2Frescue-spoonfed-app-20261012) (+1). Open a PR, merge, or leave?
2. **Spoonfed is public on GitHub**, but the registry and its own provenance file say it is a private, artwork-only repo. Make it private again, or keep it public and update the registry?
3. **Merge the fix PR** [spoonfed#1](https://github.com/findastra/spoonfed/pull/1)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
