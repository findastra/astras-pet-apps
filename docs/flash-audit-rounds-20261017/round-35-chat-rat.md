# Round 35: Chat Rat — Chat Stack

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/chat-rat](https://github.com/findastra/chat-rat) (public) · audited `main` at `38448ae`

<img src="../../art/icons/chat-rat-20261012.png" width="88" alt="Chat Rat icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [chat-rat#5](https://github.com/findastra/chat-rat/pull/5)

### Exceptions

1. **A09 Program page** — Missing. Entry chat-rat-20261009.html is not in the repo.  
   *Next:* Add the program page and declare it as `entry` in pet.json.
2. **A15 README and credit** — Missing. README has no "how to run it" section.  
   *Next:* Small README fix.
3. **A16 pet.json** — Missing. Metadata: entry target, audit cadence, framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
4. **A17 Git branches** — Incorrect. 1 branch(es) with work not on main and no open pull request: claude/chat-rat-ask-20261017 (+3).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
5. **A55 Pictures** — In progress. README shows 1 picture(s). Pictures are being added on claude/pictures-20261017 by another session tonight.  
   *Next:* The pictures session has a branch for this.
6. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
7. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
8. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
9. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
10. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A15 README and credit** — README has no Limits section.
- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `desktop-pet-20261011.json`, `pet.json`, `sprite-20261009.json`.
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 6 replacement(s) in AGENTS.md, desktop-pet-20261011.json, pet.json, sprite-20261009.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- README: added a Limits section from INTELLIGENCE-LEVELS.md.

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`claude/chat-rat-ask-20261017`](https://github.com/findastra/chat-rat/compare/main...claude%2Fchat-rat-ask-20261017) (+3). Open a PR, merge, or leave?
2. **Merge the fix PR** [chat-rat#5](https://github.com/findastra/chat-rat/pull/5)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
