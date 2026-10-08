# Findastra Pet Apps

*A pet app by Astra.*

This is **the Cage**, where Astra keeps her pet apps, and it is a pet app itself: the **Friendly Farmer** is its host. He stands outside the Cage and opens or closes the door when you click him. He is the manager and auditor of everyone inside. **Nullbot** stands on the roof and keeps watch.

![Every character in every mood](art/roster-sheet.png)

The pets bounce around inside the Cage. Open the door and they bounce around the whole screen. Click one to cheer it up. Each has the same set of moods (idle, blink, happy, curious, worried, sad, sick, alarmed, sleep), drawn in one shared pixel style. All drawings are **drafts** for Astra to approve.

## Who lives here

<!-- pets:start (generated from pets.json by scripts/update-readme.mjs; do not edit by hand) -->
| Pet | Role | Status | What it does | Get it |
|---|---|---|---|---|
| **Friendly Farmer** | host | hatching | Hosts the Cage and represents this app. Stands outside it and opens or closes the door when you click him. Manager and auditor of the other pets. | not on GitHub yet |
| **GitHub Goldfish** | pet | hatching | Swims through every public word on a GitHub account and flags document-control, blatant, organizational and systemic errors. | not on GitHub yet |
| **Chip** | pet | hatching | Data Dealer's pixel twin. | not on GitHub yet |
| **API Fairy** | pet | growing | Lives in the corner of the Windows desktop and keeps notes about your API keys, never the keys themselves. | not on GitHub yet |
| **Unity Unicorn** | pet | hatching | To be decided with Astra (Unity and VRChat world projects). | not on GitHub yet |
| **[Python Panther](https://github.com/findastra/learn-python)** | pet | hatching | The pet attached to Learn Python. Job to be decided with Astra. The repo exists; it still needs pet.json and the pet-app topic. | [Download ZIP](https://github.com/findastra/learn-python/archive/refs/heads/main.zip) |
| **[Astra Wisp](https://github.com/findastra/vrchat-ai-astra)** | pet | hatching | The pet for VRChat AI Astra: the companion and her bridge into VRChat. The repo exists; it still needs pet.json and the pet-app topic. | [Download ZIP](https://github.com/findastra/vrchat-ai-astra/archive/refs/heads/main.zip) |
| **Healthy Hummy** | pet | hatching | Personal health tracker. Your data stays on your PC and is never committed. | not on GitHub yet |
| **Finance Finch** | pet | hatching | Personal finance tracker. A yellow canary. Your data stays on your PC and is never committed. | not on GitHub yet |
| **Mommy's** | pet | hatching | Manages Mommy's, the VRChat dance academy and entertainers club, for the Mommies. The pets are the twins from the Mommy's website, Astra and Devilish. | not on GitHub yet |
| **[Paper Girl](https://github.com/findastra/paper-girl)** | pet | growing | A free science discovery desk: real research, publisher explanations, fresh articles. The repo exists; it still needs pet.json and the pet-app topic. | [Download ZIP](https://github.com/findastra/paper-girl/archive/refs/heads/main.zip) |
| **[File Master](https://github.com/findastra/file-master)** | pet | growing | Keeps a Windows PC organized: read-only audits and approval-based cleanup plans with undo. Never deletes. The repo exists; it still needs pet.json and the pet-app topic. | [Download ZIP](https://github.com/findastra/file-master/archive/refs/heads/main.zip) |
| **[Role Fairy](https://github.com/findastra/role-fairy)** | pet | growing | Mommy's Role Fairy: a single-choice Discord role picker. The repo exists; it still needs pet.json and the pet-app topic. | [Download ZIP](https://github.com/findastra/role-fairy/archive/refs/heads/main.zip) |
| **[Discord Damsel](https://github.com/findastra/findastra-discord-presence)** | pet | hatching | Manages the Discord presence apps (OpenAI and Anthropic) and other Discord apps. The repo exists; it still needs pet.json and the pet-app topic. | [Download ZIP](https://github.com/findastra/findastra-discord-presence/archive/refs/heads/main.zip) |
<!-- pets:end -->

The running list, with every mood of every character, is in [ROSTER.md](ROSTER.md). Mascot: **Nullbot** (stands on the Cage; not an app of its own).

## Run it

**See the Cage:** open [cage.html](cage.html) in any browser. No install, no network, no build step. It also works when you double-click it.

**Get it:**

1. On the repo page press **Code, Download ZIP**, unzip it, double-click `cage.html`. *(Works once this repo is public. It is not on GitHub yet.)*
2. Or from PowerShell:

   ```powershell
   Invoke-WebRequest https://github.com/findastra/findastra-pet-apps/archive/refs/heads/main.zip -OutFile findastra-pet-apps.zip
   Expand-Archive findastra-pet-apps.zip -DestinationPath .
   ```

3. Or with git: `git clone https://github.com/findastra/findastra-pet-apps`

**Get a pet:** each pet is its own repo. The table above links to each one that is on GitHub and says "not on GitHub yet" for the rest. Download a pet's ZIP the same way as the Cage.

**Hide or show everyone:** the egg in the bottom-left corner of the page hides every pet, the Cage, the Farmer and Nullbot, and brings them back. Keyboard: `Alt`+`P`. The choice is remembered in that browser.

**For builders** (Node 20 or newer; none of this is needed to just look):

```bash
npm run build    # redraw all art, rebuild cage-data.js, ROSTER.md and the table above
npm run check    # validate pets.json, the table, and that every pet has art
npm test         # tests
```

## Ideas for the hide/show button

The egg is the first version. Other ideas, if it should become a real desktop overlay later:

- **The egg** (built): cracked open with a face when pets are out, whole and sleeping when hidden. Fits hatching, growing, grown.
- **The brass key**: turn it to lock everyone away, turn it back to let them out.
- **The Farmer's hat**: tip it to send everyone to bed; tip it again to bring them back.
- **A moon**: bedtime, where every pet falls asleep first and then fades.
- **A system-tray icon plus a hotkey** (boss key): the quietest, and the only one that works over other programs. Needs a small Windows host app, which does not exist yet.

## Add a pet

Read [PET-FILES.md](PET-FILES.md). In short: add an entry to `pets.json`, draw it in `scripts/pets-art.mjs`, run `npm run build`, and the count, table, roster and page all update together. The [GitHub Goldfish](https://github.com/findastra/github-goldfish) audits the whole account, including whether every pet has its files and is listed here.

## Limits

What is not done, plainly:

- **No pet is a finished pet app on GitHub yet.** Six of the 14 pet apps already have a repo (Python Panther in `learn-python`, Astra Wisp in `vrchat-ai-astra`, Paper Girl, File Master, Role Fairy, Discord Damsel in `findastra-discord-presence`), and each still needs a `pet.json` and the `pet-app` topic. The other eight, including this one, are local only.
- **It is a web page, not a desktop overlay.** The pets roam the browser window, not your whole screen. A real overlay needs a Windows host app.
- **Every drawing is a draft from names, descriptions or websites, not from original character art.** The Mommy's twins follow the mascots on the Mommy's website. Chip's original is not on this PC, so Chip is a guess. Astra decides what is right.
- Jobs for Unity Unicorn and Python Panther are not decided. Healthy Hummy and Finance Finch are tracker ideas with no code yet; their data will stay on your PC and never be committed.
- The pets do not talk to their apps yet. The page is the Cage and the art, not the apps.
- With *reduced motion* turned on in your system, the pets stay put.

## Credits

Made by Astra. Built with Claude Sonnet 5.5 (`claude-sonnet-5-5`) on 2026-10-07. Nullbot is drawn fresh in the style of the Codex companion pets and is not OpenAI's artwork. MIT licensed.
