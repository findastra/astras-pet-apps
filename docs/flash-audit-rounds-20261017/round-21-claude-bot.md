# Round 21: Claude Bot — Claude Dock

[All rounds](README.md) · Stage: **pipeline** · Repo: [findastra/claude-bot](https://github.com/findastra/claude-bot) (public) · audited `main` at `36e2a95`

<img src="../../art/icons/claude-bot-20261012.png" width="88" alt="Claude Bot icon">

*Nine-emotion sheet: Missing (no art yet; generating it costs money, so it waits for your OK).*

**Fix PR waiting for you:** [claude-bot#1](https://github.com/findastra/claude-bot/pull/1)

### Exceptions

1. **A16 pet.json** — Missing. Metadata: sprite target, framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
2. **A55 Pictures** — Missing. README shows 0 picture(s).  
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

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `CLAUDE.md`, `README.md`, `desktop-pet-20261011.json`, `docs/plan-20261009.md`, `skills/handoff/SKILL.md`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "A small floating Claude control on the Windows desktop: an orange face, a status bubble and a quick-chat box."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 11 replacement(s) in AGENTS.md, CLAUDE.md, README.md, desktop-pet-20261011.json, docs/plan-20261009.md, skills/handoff/SKILL.md (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry; audit block copied from the registry.

</details>

### Decisions

1. **Merge the fix PR** [claude-bot#1](https://github.com/findastra/claude-bot/pull/1)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
