# Round 19: Voicemeeter Bug — Audio Rescue

[All rounds](README.md) · Stage: **registered** · Repo: [findastra/voicemeeter-bug](https://github.com/findastra/voicemeeter-bug) (public) · audited `master` at `2012457`

<img src="../../art/icons/voicemeeter-bug-20261012.png" width="88" alt="Voicemeeter Bug icon">

| Sleepy | Awake | Idle | Curious | Happy | Worried | Alarmed | Sick | Sad |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| <img src="../../art/frames/voicemeeter-bug/sleep-20261008.png" width="64" alt="sleep"> | <img src="../../art/frames/voicemeeter-bug/blink-20261008.png" width="64" alt="blink"> | <img src="../../art/frames/voicemeeter-bug/idle-20261008.png" width="64" alt="idle"> | <img src="../../art/frames/voicemeeter-bug/curious-20261008.png" width="64" alt="curious"> | <img src="../../art/frames/voicemeeter-bug/happy-20261008.png" width="64" alt="happy"> | <img src="../../art/frames/voicemeeter-bug/worried-20261008.png" width="64" alt="worried"> | <img src="../../art/frames/voicemeeter-bug/alarmed-20261008.png" width="64" alt="alarmed"> | <img src="../../art/frames/voicemeeter-bug/sick-20261008.png" width="64" alt="sick"> | <img src="../../art/frames/voicemeeter-bug/sad-20261008.png" width="64" alt="sad"> |

**Fix PR waiting for you:** [voicemeeter-bug#1](https://github.com/findastra/voicemeeter-bug/pull/1)

### Exceptions

1. **A54 Third-party programs** — Missing. INTELLIGENCE-LEVELS lists programs made by others (Voicemeeter Potato. He watches its outputs A1 (CA-2890PRO speaker bar), A2 (Steam Streaming Speakers) and A3 (Razer Krak) but the page has no Third Party Programs row.  
   *Next:* The Intelligence Levels table lists programs made by others that the page does not show (or the other way round): match them.
2. **A16 pet.json** — Missing. Metadata: framework declaration  
   *Next:* Framework metadata comes with the shared page framework (Codex's branch); not added by hand tonight.
3. **A16 pet.json** — Incorrect. pet.json job differs from the registry. pet.json: "Requests a supported Voicemeeter audio-engine restart on a manual click or an observed reconnect of a selected hardware output."  
   *Next:* The pet submitted a different job to the Farmer: see Decisions.
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

- **A57 Current names only** — Retired names (Astra's Pet Apps, astras-pet-apps, findastra-pet-apps, Documents\Projects) in `AGENTS.md`, `CLAUDE.md`, `README.md`, `desktop-pet-20261011.json`.
- **A31 Links** — 2 links point at the old hub name or a missing file: <https://github.com/findastra/astras-pet-apps>, <https://github.com/findastra/astras-pet-apps/blob/main/PET-FILES.md>.

<details><summary>What the fix PR changes, exactly</summary>

- Retired names: 9 replacement(s) in AGENTS.md, CLAUDE.md, README.md, desktop-pet-20261011.json (astras-pet-apps / findastra-pet-apps -> astras-pet-os, Astra's Pet Apps -> Astra's PetOS, Documents\Projects -> Documents\Astra's PetOS). History lines kept as written.
- Not changed: pet.json job differs from the registry, and the pet submitted a job to the Farmer on 2026-10-11. That submission needs the Farmer and Astra.

</details>

### Decisions

1. **Job:** Voicemeeter Bug submitted its own job to the Farmer (2026-10-11), and the registry says something else. Which one is right?
  - Pet's own: "Requests a supported Voicemeeter audio-engine restart on a manual click or an observed reconnect of a selected hardware output."
  - Registry: "A small Windows desktop pet for restarting Voicemeeter's audio engine when audio needs repair. Its browser page explains how to open the installed app."
2. **Merge the fix PR** [voicemeeter-bug#1](https://github.com/findastra/voicemeeter-bug/pull/1)? It only holds fixes that need no decision (listed above).

**Tools:** none declared in pet.json yet (A18).  
**Tutorial tools:** Play with, Care for — Not verified overnight.

<sub>Idle Flash Audit, 2026-10-17, Claude Opus 5.5. Read-only checks through the GitHub API; nothing was clicked, launched or signed in to.</sub>
