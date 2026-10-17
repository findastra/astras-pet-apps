# Round 17: Gone Ghost — Am I a Ghost?

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/ghost-protocol](https://github.com/findastra/ghost-protocol) (public) · audited `main` at `3174e3a`

<img src="../../art/icons/ghost-protocol-20261012.png" width="88" alt="Gone Ghost icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/ghost-protocol/sleep-20261008.png" width="64" alt="sleep"> | <img src="../../art/frames/ghost-protocol/blink-20261008.png" width="64" alt="blink"> | <img src="../../art/frames/ghost-protocol/idle-20261008.png" width="64" alt="idle"> | <img src="../../art/frames/ghost-protocol/curious-20261008.png" width="64" alt="curious"> | <img src="../../art/frames/ghost-protocol/happy-20261008.png" width="64" alt="happy"> | <img src="../../art/frames/ghost-protocol/worried-20261008.png" width="64" alt="worried"> | <img src="../../art/frames/ghost-protocol/alarmed-20261008.png" width="64" alt="alarmed"> | <img src="../../art/frames/ghost-protocol/sick-20261008.png" width="64" alt="sick"> | <img src="../../art/frames/ghost-protocol/sad-20261008.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [ghost-protocol#4](https://github.com/findastra/ghost-protocol/pull/4)

### Exceptions

1. **A07 Program name** — Incorrect. Page title "Ghost Protocol" names neither the pet nor the program "Am I a Ghost?".  
   *Next:* Your pick: see Decisions.
2. **A15 README and credit** — Incorrect. README title "Ghost Protocol — Personal Cybersecurity Checklist" is neither the repo name in Title Case ("Ghost Protocol") nor the pet name.  
   *Next:* The title is a naming choice, so it was left alone. Rename the heading?
3. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
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

- **A06 Pet name** — Pet name differs from the catalog ("Gone Ghost"): pet.json says "Ghost Protocol".
- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "A personal cybersecurity checklist for reviewing your own security habits and tracking the steps you complete."
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 5 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: pet "Ghost Protocol" -> "Gone Ghost" (pet-programs.json); job now matches the registry; audit block copied from the registry.

</details>

### Decisions

1. **Merge the fix PR** [ghost-protocol#4](https://github.com/findastra/ghost-protocol/pull/4)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
