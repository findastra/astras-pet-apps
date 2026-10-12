# ASTRA_PET_OS migration: gap analysis

Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-11. Compares the [audit](AUDIT.md) with the
canonical architecture, [docs/architecture/ASTRA_PET_OS.md](../architecture/ASTRA_PET_OS.md).
"Reuse" names what to keep rather than rewrite.

| v5.2 requirement | Today | Gap | Reuse |
|---|---|---|---|
| **The Farm**: responsive website, every pet as a card with an always-visible text box | Farmer's desk page lists apps with links and a follow-up checkbox; local file only | No text box per pet, no backend, not reachable from a phone | Desk layout and generated app list; `pets.json` as the card source |
| Farm works from Android, iPhone, iPad, Windows over authenticated private access | Pages open from disk on one PC | No server, HTTPS, login, device revocation, private network | Nothing yet |
| Durable message receipt → pet inbox → status | Nothing durable; `localStorage` only (the unmerged `requests/` idea was copy-and-paste) | Needs an inbox store, receipts and honest status | Request statuses from the unmerged branch as a starting vocabulary |
| Device-aware Open Program | Plain links; Windows paths in some pages | No web vs Windows-host distinction | `interface_url` / `interface_local_url` / `interface_live_url` fields |
| **Program Manager**: neutral registry of real programs, adapters, capabilities, health | `pets.json` mixes pet identity, app page and art | No program records, adapters, health or project grouping | `repo`, `interface_*`, `source_tag` fields map into program records |
| Project Registry (Data Dealer, CHIP as projects) | Chip is the pet *for* `data-dealer` | Decide Chip vs CHIP; add thin project records | `data-dealer` repo links |
| Farmer is an ordinary pet, managed like the rest | Farmer is `role: "host"` and his repo *is* the hub | Farmer must be registered through Program Manager, restartable, not required by others | His daily rounds already run independently on GitHub Actions |
| **Independent pet runtimes**: scheduler, inbox, state, health, crash recovery | None. The only scheduled work is the Farmer's daily GitHub Action | Every pet needs a runtime | The rounds' self-audit cadence and `status/pets-status.json` shape |
| Agent harness, proactive loop, autonomy levels, budgets, kill switch | None | All new; choose one framework after checking language fit (Node, C#) | Handoff cards are a human-readable precursor of tasks |
| Typed inter-pet messages with the v5.2 envelope | `cage.submit` blocks and `RELATIONS.md` | No messaging, auth or retries | `relations` data for who talks to whom |
| Manifest with SemVer, hosts, capabilities, permissions | No per-pet SemVer; hub uses `0.2.1-20261008` | Versioned manifest contract and tests | `pet.json` per repo; the Kennel starter's `pet.example.json` |
| **GitHub Goldfish** compares releases, both official and community | Compares registry text with repos | Release vs commit, installed vs latest, last-checked timestamps | Goldfish's existing account crawl |
| **astras-farm**, **astras-kennel**, **astra-pet-sdk** repos | None exist | Plans first; creation needs Astra's OK | Kennel registry starter (rename from `astra-pet-registry`) |
| Community submission flow and statuses | None | Issue form, review, catalog | Kennel starter issue form |
| Desktop: tray single/double/triple/right click | Tray single and right click; desktop-star click toggles herd; desktop-star double-click lineup | Move herd toggle to tray double-click, lineup to triple-click | `PetClicks` gesture recogniser already handles timing |
| Desktop: roam across monitors | Per-monitor only | Cross-monitor roaming and a multi-monitor test | `Screen.AllScreens` scatter, DPI handling |
| Hiding visuals never stops work | No workers exist yet | Becomes real once runtimes exist | Launcher/herd separation already done |
| No browser Cage, no browser roaming | `cage.html` with door and `cage_life` movement | Retire; keep reusable parts | See "Retiring the Cage" in the plan |
| Security: secrets store, least privilege, approvals in code, audit | Rules in AGENTS.md; no secrets in repo; approvals are human | Enforcement in code once anything acts | Current rules carry over unchanged |
| 30 approved new pets (12 core + 18 v5.2), plus 6 seeds (Pole Puff, Procreate Panda, Skill Scout, PSC Sealion, Platform Platypus, Piranesi Nessi) | None exist except as names; Platform Platypus has a local draft. Passport Panda is renamed Passport Pelican | Phased; none to be claimed as built | Art pipeline, handoff cards |
| Stock Fox | No repo or entry | Add to pipeline when Astra wants it | Pipeline format |
| Marketing website (pages listed in v5.2) | None | Information architecture and homepage mockup first | Pet words, art |
| Acceptance demos A–R | None demonstrable | Test matrix in the plan | 64 existing tests stay as regression |
