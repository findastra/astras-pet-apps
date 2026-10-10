# Mood key

*What each mood means, for every pet. Generated from `mood_key` and each pet's `audit` in [pets.json](pets.json) by `npm run build`. The Farmer's desk shows the same key with each pet's current mood and bubble.*

Every pet uses the same meanings, so a face reads the same everywhere. `{subject}` is what the pet checks; `{needs}` is what it asks Astra for when it is sick.

| Mood | Means |
|---|---|
| `sleep` | I haven't checked {subject} yet. |
| `idle` | {Subject} was fine at my last check. |
| `blink` | Just blinking. |
| `curious` | Checking {subject} now. |
| `happy` | Checked {subject}: nothing wrong. |
| `worried` | Found a few problems in {subject}. |
| `alarmed` | Found a lot of problems in {subject}. |
| `sick` | I need you: {needs}. |
| `sad` | I couldn't finish checking {subject}. My fault; I'll try again. |

## Each pet

A pet changes its own lines by submitting `moods` (and `audit`) in `cage.submit` in its pet.json. See [PET-FILES.md](PET-FILES.md).

| Pet | Checks | How often | When it is sick it needs |
|---|---|---|---|
| **Friendly Farmer** | the Cage and the pet registry | daily | a FARMER_TOKEN secret so I can see the private pet repos |
| **GitHub Goldfish** | the findastra GitHub account | weekly, Monday | a GitHub token that can read the private repos |
| **Chip** | Data Dealer's repo | weekly, Tuesday | your answer to a decision on the ops dashboard |
| **API Fairy** | the notes about your API keys | weekly, Wednesday | a key renewed or a note confirmed |
| **Unity Unicorn** | your Unity and VRChat project notes | weekly, Thursday | a project opened in Unity so I can check it |
| **Python Panther** | your Python lessons | weekly, Friday | you to do the next lesson |
| **Astra Wisp** | the AI Astra backend and bridge | weekly, Saturday | the AI Astra app started on your PC |
| **Health Hummy** | my own files (never your check-ins) | weekly, Sunday | a check-in only you can make |
| **Finance Finch** | my own files (never your entries) | weekly, Monday | an entry only you can add |
| **Mommy's Mommies** | Mommy's classes and events | weekly, Tuesday | a date or teacher confirmed for a session |
| **Paper Girl** | the science desk and its live site | weekly, Wednesday | a look at the live site |
| **File Master** | your PC's folders and projects | weekly, Thursday | the scanner run on your PC |
| **Discord Damsel** | the OpenAI and Anthropic presence apps | weekly, Friday | Discord open with activity sharing on |
| **Portfolio Puffer** | your updates worth sharing | weekly, Saturday | a drafted update approved or posted |
| **Drum Dog** | your track ideas and samples | weekly, Sunday | a sample permission confirmed |
| **VSCode Angel** | your code cleanup worklist | weekly, Monday | a finding reviewed |
| **Ghost Protocol** | your security checklist | weekly, Tuesday | a security step only you can do |
| **Project Parrot** | your project ideas | weekly, Wednesday | a yes or no on an idea that is due |
| **Claude Bot** * | the Claude Bot plan and build | weekly, Thursday | a decision on the plan |
| **RGBee** * | your RGB lights and scenes | weekly, Friday | the brand and model of each light |
| **Mine Mole** * | the crypto mining research | weekly, Saturday | your power price and graphics card model |
| **Mail Snail** * | my plan | weekly, Sunday | a job: what should Mail Snail do |
| **Patch Cat** * | my plan | weekly, Monday | a job: what should Patch Cat do |
| **Meme Fiend** * | your saved memes (on your PC only) | weekly, Tuesday | a meme folder chosen |
| **Gif Giraffe** * | my plan | weekly, Wednesday | a job: what kind of GIFs should I make |
| **Backup Beaver** * | my plan | weekly, Thursday | a job: what should Backup Beaver back up |
| **Rift Rabbit** * | your VR software and performance notes | weekly, Friday | your headset and PC details |
| **Fuzzboi Friend** * | the Fuzzboi maker and its live site | weekly, Saturday | your OK to register me in the Cage |
| **Wifi Butterfly** * | my plan | weekly, Sunday | a job: what should Wifi Butterfly do |
| **Deck Duck** * | my plan | weekly, Monday | a job: what should Deck Duck do |
| **Mesh Moth** * | the Meshtastic node plan | weekly, Tuesday | a job: what should Mesh Moth watch |
| **Raspberry Pi** * | my plan | weekly, Wednesday | a job: what should the Raspberry Pi pet do |

\* in the pipeline: on GitHub, not registered in the Cage yet.
