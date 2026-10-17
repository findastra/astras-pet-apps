# Round 29: Rift Rabbit — Wonderland Launchpad

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/rift-rabbit](https://github.com/findastra/rift-rabbit) (public) · audited `main` at `51eded5`

<img src="../../art/icons/rift-rabbit-20261012.png" width="88" alt="Rift Rabbit icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [rift-rabbit#2](https://github.com/findastra/rift-rabbit/pull/2)

### Exceptions

1. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (SteamVR, Meta Horizon Link, Virtual Desktop, the OVR tools, Space Calibrator, BS Manager and the rest of the vr-gaming f) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
2. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
3. **A17 Git branches** — Incorrect. 2 branch(es) with work not on main and no open pull request: codex/l3-activity-20261016 (+2), codex/yellow-phone-20261015 (+1).  
   *Next:* See Decisions: open a pull request, merge, or leave each branch.
4. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
5. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
6. **A52 L3 activity bubble** — On a branch. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/rift-rabbit/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
7. **A44 Yellow phone** — On a branch. Shared phone baseline not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/rift-rabbit/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
8. **A45 Paper and zoom** — On a branch. Shared stationery source not found.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/rift-rabbit/compare/main...codex/l3-activity-20261016)): merging that branch passes this.
9. **A41 Clicker Training** — On a branch. No Clicker Training section found in the inspected entry source.  
   *Next:* It is built on unmerged branch `codex/l3-activity-20261016` ([compare](https://github.com/findastra/rift-rabbit/compare/main...codex/l3-activity-20261016)): merging that branch passes this.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `CLAUDE.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`, `sprite.json`.
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — 2 links point at the old hub name or a missing file: <https://github.com/findastra/astras-pet-apps>, <https://github.com/findastra/astras-pet-apps/blob/main/handoffs/008-farmer-register-new-placeholders.md>.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 11 replacement(s) in AGENTS.md, CLAUDE.md, README.md, desktop-pet-20261011.json, pet.json, sprite.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: audit block copied from the registry.
- README: the stale "Not in the Cage yet ... card 008" line now says it is a pipeline pet in pets.json (card 008 is an old dropped draft).

</details>

### Decisions

1. **Branches with work not on main** and no pull request: [`codex/l3-activity-20261016`](https://github.com/findastra/rift-rabbit/compare/main...codex%2Fl3-activity-20261016) (+2), [`codex/yellow-phone-20261015`](https://github.com/findastra/rift-rabbit/compare/main...codex%2Fyellow-phone-20261015) (+1). Open a PR, merge, or leave?
2. **Merge the fix PR** [rift-rabbit#2](https://github.com/findastra/rift-rabbit/pull/2)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
