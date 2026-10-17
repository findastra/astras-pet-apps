# Round 4: API Fairy — API Fairy Ring

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/api-fairy](https://github.com/findastra/api-fairy) (public) · audited `main` at `4e67210`

<img src="../../art/icons/api-fairy-20261012.png" width="88" alt="API Fairy icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/api-fairy/sleep.png" width="64" alt="sleep"> | <img src="../../art/frames/api-fairy/blink.png" width="64" alt="blink"> | <img src="../../art/frames/api-fairy/idle.png" width="64" alt="idle"> | <img src="../../art/frames/api-fairy/curious.png" width="64" alt="curious"> | <img src="../../art/frames/api-fairy/happy.png" width="64" alt="happy"> | <img src="../../art/frames/api-fairy/worried.png" width="64" alt="worried"> | <img src="../../art/frames/api-fairy/alarmed.png" width="64" alt="alarmed"> | <img src="../../art/frames/api-fairy/sick.png" width="64" alt="sick"> | <img src="../../art/frames/api-fairy/sad.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [api-fairy#1](https://github.com/findastra/api-fairy/pull/1)

### Exceptions

1. **A57 Current names only** — Incorrect. Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `README.md`, `api-fairy-20261008.html`, `src/Snapshot.cs`, `tests/Tests.cs`.  
   *Next:* Inside code (a storage key or a name the code looks for), so it was left alone tonight.
2. **A55 Pictures** — Missing. README shows 1 picture(s).  
   *Next:* Needs real pictures of the program working (you take some: card 026).
3. **A18 Tool list** — Missing. No declared tool inventory.  
   *Next:* No tool list yet. It comes with the shared page framework.
4. **A52 L3 activity bubble** — Not verified. Shared L3 activity source exists. Observe a real task, provider/session, timestamps, disconnect, OFF, stale feed and desktop/mobile rendering before passing.  
   *Next:* Open.
5. **A44 Yellow phone** — Not verified. Shared phone source exists; inspect rendered chat and host behavior.  
   *Next:* Open.
6. **A45 Paper and zoom** — Not verified. Paper/zoom source exists; browser viewport acceptance is separate.  
   *Next:* Open.
7. **A41 Clicker Training** — Not verified. Training source exists; desktop click timing and actions need live verification.  
   *Next:* Open.
8. **Checked by hand, not a problem:** the paths in `src/Snapshot.cs` and `tests/Tests.cs` are test fixtures with a made-up user folder (`you`), not personal paths (A26). The auditor now skips made-up folders.

### Fixed tonight (in the fix PR, waiting for your merge)

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `desktop-pet-20261011.json`, `pet.json`, `sprite-20261008.json`.
- **A16 pet.json** — pet.json job differs from the registry. pet.json: "Lives in the corner of the Windows desktop and keeps notes about your API keys, never the keys themselves."
- **A31 Links** — Broken link https://github.com/findastra/astras-pet-apps: repo renamed: astras-pet-apps is now astras-pet-os.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 6 replacement(s) in AGENTS.md, api-fairy-20261008.html, desktop-pet-20261011.json, pet.json, sprite-20261008.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- pet.json: job now matches the registry.

</details>

### Decisions

1. **Merge the fix PR** [api-fairy#1](https://github.com/findastra/api-fairy/pull/1)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
