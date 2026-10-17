# Round 23: Mine Mole — Crypto Burrow

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/mine-mole](https://github.com/findastra/mine-mole) (public) · audited `main` at `bfc04f4`

<img src="../../art/icons/mine-mole-20261012.png" width="88" alt="Mine Mole icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [mine-mole#2](https://github.com/findastra/mine-mole/pull/2)

### Exceptions

1. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (the crypto-mining program) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
2. **A15 README and credit** — Missing. README has no "how to run it" section.  
   *Next:* Small README fix.
3. **A16 pet.json** — Missing. Metadata: owner, runs_on, sprite target, framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
4. **A17 Git branches** — Incorrect. 2 branch(es) with work not on main and no open pull request: codex/l3-activity-20261016 (+2), codex/yellow-phone-20261015 (+1).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
5. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
6. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
7. **A52 L3 activity bubble** — On a branch. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/mine-mole/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
8. **A44 Yellow phone** — On a branch. Shared phone baseline not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/mine-mole/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
9. **A45 Paper and zoom** — On a branch. Shared stationery source not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/mine-mole/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
10. **A41 Clicker Training** — On a branch. No Clicker Training section found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/mine-mole/compare/main...codex/l3-activity-20261016)): merging that branch passes this.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A14 Required files** — Required files: CLAUDE.md, LICENSE
- **A15 README and credit** — README has no Limits section.
- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `pet.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Researching: whether mining crypto on Astra's own PC is worth the power, and, if it is, watching the miner's hashrate, heat and earnings."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 5 replacement(s) in AGENTS.md, README.md, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.
- Added CLAUDE.md (pointer to AGENTS.md and the hub rules).
- Added LICENSE (MIT, the house default for public pet repos).
- README: added a Limits section from INTELLIGENCE-LEVELS.md.

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`codex/l3-activity-20261016`](https://github.com/findastra/mine-mole/compare/main...codex%2Fl3-activity-20261016) (+2), [`codex/yellow-phone-20261015`](https://github.com/findastra/mine-mole/compare/main...codex%2Fyellow-phone-20261015) (+1). Open a PR, merge, or leave?
2. **Merge the fix PR** [mine-mole#2](https://github.com/findastra/mine-mole/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
