# Round 11: Patty — Paper Girl

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/paper-girl](https://github.com/findastra/paper-girl) (public) · audited `main` at `ad01a52`

<img src="../../art/icons/paper-girl-20261012.png" width="88" alt="Patty icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/paper-girl/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/paper-girl/blink.png" width="64" alt="blink"> | <img src="../../art/frames/paper-girl/idle.png" width="64" alt="idle"> | <img src="../../art/frames/paper-girl/curious.png" width="64" alt="curious"> | <img src="../../art/frames/paper-girl/happy.png" width="64" alt="happy"> | <img src="../../art/frames/paper-girl/worried.png" width="64" alt="worried"> | <img src="../../art/frames/paper-girl/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/paper-girl/sick.png" width="64" alt="sick"> | <img src="../../art/frames/paper-girl/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [paper-girl#1](https://github.com/findastra/paper-girl/pull/1)

### Exceptions

1. **A57 Current names only** — Incorrect. Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `paper-girl-20261008.html`.  
   *Next:* Inside code (a storage key or a name the code looks for), so it was left alone tonight.
2. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
3. **A55 Pictures** — Missing. README shows 0 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
4. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
5. **A52 L3 activity bubble** — Missing. Required shared L3 activity bubble/config/script/style not found in the inspected entry source.  
   *Next:* Open.
6. **A44 Yellow phone** — Missing. Shared phone baseline not found.  
   *Next:* Open.
7. **A45 Paper and zoom** — Missing. Shared stationery source not found.  
   *Next:* Open.
8. **A41 Clicker Training** — Missing. No Clicker Training section found in the inspected entry source.  
   *Next:* Open.
9. **A31 Links** — Incorrect. Broken link http://terminal.local:4173/: TypeError.  
   *Next:* Fix or remove the link.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A06 Pet name** — Pet name differs from the catalog ("Patty"): pet.json says "Paper Girl".
- **A15 README and credit** — README has no Limits section.
- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `README.md`, `desktop-pet-20261011.json`, `pet.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "A free science discovery desk: real research, publisher explanations, fresh articles. The repo exists; it still needs pet.json and the pet-a"
- **A16 pet.json** — pet.json has no audit block (the registry has one).
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 7 replacement(s) in AGENTS.md, README.md, desktop-pet-20261011.json, paper-girl-20261008.html, pet.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: pet "Paper Girl" -> "Patty" (pet-programs.json); job now matches the registry; audit block copied from the registry.
- README: added a Limits section from INTELLIGENCE-LEVELS.md.

</details>

### Decisions

1. **Merge the fix PR** [paper-girl#1](https://github.com/findastra/paper-girl/pull/1)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
