---
name: handoff
description: Check for, pick up, or write handoff cards so work moves between Astra's assistants (Claude accounts, OpenAI Codex/ChatGPT, others). Use whenever Astra's request is unclear, names an assignment, or mentions a pet or person you do not recognise ("the farmer", "the goldfish"), and whenever you stop with work left for someone else.
---

# Handoffs

Astra works with many assistants at once. GitHub is the shared desk: anything one assistant
leaves for another is a card in a repo's `handoffs/` folder, not a chat message.
Same card format as `findastra/data-dealer` (`skills/handoff/SKILL.md` there).

## When Astra's request is unclear or sounds like an assignment
Check GitHub **before** asking her:
1. List `findastra` repos. Look for the name, pet or person she used (pet names are in
   `findastra/astras-pet-os/pets.json`; the **Friendly Farmer** is the Cage's host, so
   "tell the farmer" means a card in `astras-pet-os/handoffs/`).
2. Read `handoffs/README.md` in the likely repos and any card that is `open` and `for:` you
   or `any`.
3. Read, in full, that repo's `AGENTS.md`, `CLAUDE.md` and every `SKILL.md` (on every branch),
   plus everything in the "Before any work" list in `astras-pet-os/AGENTS.md`. Never skim.
Ask Astra only what the repos do not answer, and say what you already found.

## Card format: `handoffs/NNN-short-name.md`
```
status: open | taken by <who> | done
for: any | claude | codex | farmer | goldfish | <named assistant>
from: <model name and version>, <YYYY-MM-DD>
needs: <files to read>
---
## What I did
## Task
## Done when
## Return
Write results to <path>, set status: done, commit.
```
**`## What I did` is required on every card you write, and you update it when you finish
someone else's card.** List it explicitly, so the next assistant does not have to dig through
chat or git history:
- every repo, branch and commit hash you changed or pushed (say whether it is on `main`);
- every file you added or changed, and every file on Astra's PC you touched (full path);
- commands you ran that changed anything (build, restart, pull, push), and what you tested;
- where things live now (repo, branch, local folder, log path) and anything still running;
- what is **not** done, and what is waiting on Astra.
Name yourself (model and version) and the date. "Fixed the Bug" is not enough; "added a
heartbeat log to `watcher.cs`, commit `abc1234` on branch `x`, not pushed" is.
Add a row for the card to `handoffs/README.md`. Numbers never repeat.

## Hatching or changing a pet
- **Build every pet program to [PET-PROGRAM-FRAMEWORK.md](../../PET-PROGRAM-FRAMEWORK.md)** and run its checklist
  (section 10) before you push: versioned names everywhere, tool boxes with ON/OFF and sick, the notes tool and
  backlog, the chat bot, links by kind, the status line, its System Map node, and data that survives updates.
  Also follow `skills/farm-security` and `skills/new-pet-or-tool`. A new pet waits at the gate until L4 lets it in.
- A new pet repo needs `pet.json` with an `audit` block, the `pet-app` topic, and an AGENTS.md that links
  `findastra/astras-pet-os` and its PET-FILES.md. The Farmer's daily round finds it and adds it to the
  pipeline; leave a `farmer-register-<repo>` card in `astras-pet-os/handoffs/` too.
- Changing a pet's name, job, status, bubble lines (`says`), mood lines (`moods`) or audit: also put the change in
  `cage.submit` in its pet.json with today's date, so the Farmer picks it up. See PET-FILES.md, "Submitting a
  change to the Farmer".
- To ask Astra for something, leave a card with `status: open (waiting on Astra: <what you need>)`. The pet
  turns sick and that text becomes its bubble on the Cage and the Farmer's desk.

## Rules
- One card, one deliverable. Name the files to read. Never paste keys or personal data.
- Before starting a card, set `status: taken by <who>` and commit, so two assistants do not
  do it twice.
- Write your own card whenever you stop with something left: another assistant's job, a
  step that needs Astra, or work you could not finish. Say plainly what is not done.
- Results live in the repo, not in chat. Record your model name and version on the card.
- Every card says explicitly what was done (`## What I did`, above), not only what is left.
- Work that only exists on Astra's PC or on an unmerged branch is easy to lose: say where it
  is on the card. Search every branch (`git ls-remote --heads`, `git log --all`) before saying
  a pet does not exist.
- Follow the repo's own rules: no pushing to `main` and no new GitHub repos without
  Astra's OK; work on a branch otherwise.
