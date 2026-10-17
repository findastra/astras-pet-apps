# Round 25: Patch Cat — The Litter Box

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/patch-cat](https://github.com/findastra/patch-cat) (public) · audited `main` at `ffafcba`

<img src="../../art/icons/patch-cat-20261012.png" width="88" alt="Patch Cat icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [patch-cat#2](https://github.com/findastra/patch-cat/pull/2)

### Exceptions

1. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
2. **A17 Git branches** — Incorrect. 2 branch(es) with work not on main and no open pull request: codex/l3-activity-20261016 (+2), codex/yellow-phone-20261015 (+1).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
3. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
4. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
5. **A52 L3 activity bubble** — On a branch. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/patch-cat/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
6. **A44 Yellow phone** — On a branch. Shared phone baseline not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/patch-cat/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
7. **A45 Paper and zoom** — On a branch. Shared stationery source not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/patch-cat/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
8. **A41 Clicker Training** — On a branch. No Clicker Training section found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/patch-cat/compare/main...codex/l3-activity-20261016)): merging that branch passes this.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `CLAUDE.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — 2 links point at the old hub name or a missing file: <https://github.com/findastra/astras-pet-apps/blob/main/handoffs/008-farmer-register-new-placeholders.md>, <https://github.com/findastra/astras-pet-apps>.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 8 replacement(s) in AGENTS.md, CLAUDE.md, README.md, desktop-pet-20261011.json, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: audit block copied from the registry.
- README: the stale "Not in the Cage yet ... card 008" line now says it is a pipeline pet in pets.json (card 008 is an old dropped draft).

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`codex/l3-activity-20261016`](https://github.com/findastra/patch-cat/compare/main...codex%2Fl3-activity-20261016) (+2), [`codex/yellow-phone-20261015`](https://github.com/findastra/patch-cat/compare/main...codex%2Fyellow-phone-20261015) (+1). Open a PR, merge, or leave?
2. **Merge the fix PR** [patch-cat#2](https://github.com/findastra/patch-cat/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
