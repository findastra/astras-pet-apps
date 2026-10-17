# How the pets relate

*Generated from `relations`, `rounds` and `pipeline` in [pets.json](pets.json) by `npm run build`. Edit pets.json, not this file. The rules behind it are in [PET-FILES.md](PET-FILES.md).*

## How a change is saved

Changes start at the bottom and are saved upward. Nothing generated is edited by hand.

| Level | Who | Owns | Saves by |
|---|---|---|---|
| 1 | **Astra** | Approvals: new art (it costs money), a pet's job, anything in a card waiting on her | Answering a card, or telling an assistant |
| 2 | **Friendly Farmer** (`astras-pet-apps`) | `pets.json`: who exists, kinds, art, relations, the mood key | His daily round, and assistants working on the Cage |
| 3 | **Each pet's repo** | Its own app, README, cards, and its own name, job, status, bubble lines, mood lines and audit | Editing its `pet.json`, and submitting identity changes in `cage.submit` |
| 4 | **Generated** | `cage-data.js`, `ROSTER.md`, the README table, the Farmer's desk, `MOOD-KEY.md`, this file, `status/pets-status.json`, the profile's pet list | Never by hand: the build and the rounds rewrite them |

```mermaid
flowchart TD
  A(["Astra"]) -->|asks| S["Any assistant session"]
  S -->|creates or changes| P["Pet repo<br/>pet.json · README · handoffs/"]
  P -->|"cage.submit in pet.json"| F{{"Friendly Farmer<br/>daily round"}}
  F -->|finds new pet repos| PL["pets.json pipeline"]
  PL -->|"register card + Astra OKs the art"| R["pets.json pets"]
  F -->|"self-audit on each pet's day"| ST["status/pets-status.json<br/>mood + bubble"]
  R --> B["npm run build"]
  ST --> B
  B --> C["Cage page · ROSTER.md · Farmer's desk<br/>MOOD-KEY.md · RELATIONS.md"]
  R --> PR{{"Profile round, daily"}}
  PR --> PF["findastra/findastra README"]
  R -->|"registry, pet words"| G{{"GitHub Goldfish"}}
  G -->|"findings as cards"| F
  ST -->|"sick pets: Needs you"| A
```

## Who tells whom

Thick arrows work today. Plain arrows are planned (in a plan or a card). Dotted arrows are ideas nobody has agreed to yet. A name with * is in the pipeline: on GitHub, not registered in the Cage yet.

```mermaid
flowchart LR
  subgraph Keepers["Keepers"]
    astras_pet_os["Friendly Farmer"]
    github_goldfish["GitHub Goldfish"]
    file_master["File Master"]
  end
  subgraph Safety["Safety"]
    api_fairy["API Fairy"]
    ghost_protocol["Gone Ghost"]
    backup_beaver["Backup Beaver *"]
  end
  subgraph Making["Making"]
    project_parrot["Project Parrot"]
    vscode_angel["VSCode Angel"]
    portfolio_puffer["Portfolio Puffer"]
    unity_unicorn["Unity Unicorn"]
    rift_rabbit["Rift Rabbit *"]
    astras_gif_maker["Gif Giraffe *"]
    meme_fiend["Meme Fiend *"]
  end
  subgraph Stage["Stage"]
    mommys_mommies["Mommy's Mommies"]
    drum_dog["Drum Dog"]
    rgbee["RGBee *"]
    deck_duck["Deck Duck *"]
    claude_bot["Claude Bot *"]
    findastra_discord_presence["Discord Damsel"]
  end
  subgraph Private["Private"]
    health_hummy["Health Hummy"]
    finance_finch["Finance Finch"]
  end
  pets["Every pet"]
  astra(["Astra"])
  profile["Profile README"]
  data_dealer["Chip"]
  mail_snail["Mail Snail *"]
  mine_mole["Mine Mole *"]
  mesh_moth["Mesh Moth *"]
  raspberry_berry["Raspberry Pi Berry *"]
  wifi_butterfly["Wifi Butterfly *"]
  pets ==>|registry| astras_pet_os
  astras_pet_os ==>|status| pets
  astras_pet_os ==>|status| astra
  astras_pet_os ==>|shipped| profile
  astras_pet_os ==>|registry| github_goldfish
  github_goldfish ==>|findings| astras_pet_os
  astras_pet_os ==>|registry| file_master
  file_master -->|idea| astras_pet_os
  project_parrot -->|idea| astras_pet_os
  github_goldfish -.->|findings| vscode_angel
  github_goldfish -.->|findings| ghost_protocol
  api_fairy -.->|keys| ghost_protocol
  rgbee -->|keys| api_fairy
  claude_bot -.->|keys| api_fairy
  data_dealer -.->|keys| api_fairy
  github_goldfish -.->|keys| api_fairy
  astras_pet_os -.->|shipped| portfolio_puffer
  claude_bot -.->|status| findastra_discord_presence
  mommys_mommies -.->|cue| rgbee
  mommys_mommies -.->|cue| drum_dog
  drum_dog -.->|cue| rgbee
  deck_duck -.->|cue| rgbee
  deck_duck -.->|cue| claude_bot
  rift_rabbit -.->|findings| unity_unicorn
  astras_gif_maker -.->|art| meme_fiend
  file_master -.->|findings| backup_beaver
  mail_snail -->|findings| finance_finch
  mommys_mommies -->|cue| findastra_discord_presence
  github_goldfish -.->|shipped| portfolio_puffer
  mine_mole -.->|findings| finance_finch
  mesh_moth -.->|status| raspberry_berry
  wifi_butterfly -.->|status| raspberry_berry
```

### What travels

| Kind | Means |
|---|---|
| `registry` | who exists, and each pet's name, job, status, moods and lines |
| `status` | a pet's mood and its one-line bubble |
| `findings` | problems found by an audit |
| `card` | a task left in a handoffs/ folder |
| `keys` | which API keys a pet uses (never the key itself) |
| `idea` | a project idea |
| `shipped` | what changed: new repos, new pets, status changes |
| `cue` | a live trigger: a scene, a beat, a button |
| `art` | drawings and mood frames |

### Every link

| From | To | Carries | State | Why |
|---|---|---|---|---|
| Every pet | Friendly Farmer | `registry` | now | Every pet submits changes to its name, job, status, moods and lines through its own pet.json; the Farmer's daily round takes them. |
| Friendly Farmer | Every pet | `status` | now | The daily round runs each pet's self-audit on its day and writes its mood and bubble. |
| Friendly Farmer | Astra | `status` | now | Every sick pet's need is listed on the Farmer's desk under Needs you. |
| Friendly Farmer | Profile README | `shipped` | now | The profile round keeps findastra/findastra matched to the repos on GitHub. |
| Friendly Farmer | GitHub Goldfish | `registry` | now | The Goldfish reads pets.json, the pet words and the profile style. |
| GitHub Goldfish | Friendly Farmer | `findings` | now | Account-wide problems go to the Farmer as cards. |
| Friendly Farmer | File Master | `registry` | now | File Master uses the pet words and file names. |
| File Master | Friendly Farmer | `idea` | planned | New project folders on the PC become candidates. |
| Project Parrot | Friendly Farmer | `idea` | planned | An idea Astra says yes to becomes a new pet repo. |
| GitHub Goldfish | VSCode Angel | `findings` | idea | Code findings become worklist items. |
| GitHub Goldfish | Gone Ghost | `findings` | idea | A secret found in a repo becomes a checklist step. |
| API Fairy | Gone Ghost | `keys` | idea | An old or exposed key becomes a checklist step. |
| RGBee * | API Fairy | `keys` | planned | Cloud light APIs (Govee and others) need keys; API Fairy keeps the notes. |
| Claude Bot * | API Fairy | `keys` | idea | Quick chat uses an Anthropic key. |
| Chip | API Fairy | `keys` | idea | Data Dealer uses several service keys. |
| GitHub Goldfish | API Fairy | `keys` | idea | The Goldfish uses a GitHub token. |
| Friendly Farmer | Portfolio Puffer | `shipped` | idea | What the daily round saw change becomes draft portfolio updates. |
| Claude Bot * | Discord Damsel | `status` | idea | Claude Bot's status feeds the Anthropic presence card. |
| Mommy's Mommies | RGBee * | `cue` | idea | A class or show starts its lighting scene. |
| Mommy's Mommies | Drum Dog | `cue` | idea | A session pulls its track list. |
| Drum Dog | RGBee * | `cue` | idea | Lights follow the track's beat (RGBee v3). |
| Deck Duck * | RGBee * | `cue` | idea | Stream Deck buttons switch scenes. |
| Deck Duck * | Claude Bot * | `cue` | idea | A Stream Deck button opens quick chat. |
| Rift Rabbit * | Unity Unicorn | `findings` | idea | VR performance notes feed world build tasks. |
| Gif Giraffe * | Meme Fiend * | `art` | idea | GIFs Gif Giraffe makes go to the meme collection. |
| File Master | Backup Beaver * | `findings` | idea | What File Master finds unprotected is what Backup Beaver should copy. |
| Mail Snail * | Finance Finch | `findings` | planned | Bills Astra has not paid yet, found in her mail, go to Finance Finch. Astra, 2026-10-12. Finance data stays on her PC. |
| Mommy's Mommies | Discord Damsel | `cue` | planned | Mommy's Mommies lists a Discord connection as planned; Discord Damsel manages Astra's Discord apps. |
| GitHub Goldfish | Portfolio Puffer | `shipped` | idea | Portfolio Puffer plans a GitHub connection; the Goldfish already reads the whole account. |
| Mine Mole * | Finance Finch | `findings` | idea | Whether mining is worth the power is a money question for Finance Finch. Finance data stays on the PC. |
| Mesh Moth * | Raspberry Pi Berry * | `status` | idea | The cyberdeck plan puts a LoRa HAT on the Pi: the Meshtastic node runs on the Raspberry Pi. |
| Wifi Butterfly * | Raspberry Pi Berry * | `status` | idea | The cyberdeck plan puts a Wi-Fi HAT on the Pi. |

### Private pets

Health Hummy, Finance Finch, Meme Fiend *. These pets' data never leaves the PC. Other pets do not read from them, and the self-audit checks only their repo files.

### On their own so far

Python Panther, Astra Wisp, Patty, Voicemeeter Bug, Sugarcube *, Patch Cat *, Fuzzboi Friend *, Platform Platypus *. Every pet still submits to the Farmer and audits itself; these have no links to other pets yet.
