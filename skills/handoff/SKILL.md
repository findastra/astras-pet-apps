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
   `findastra/astras-pet-apps/pets.json`; the **Friendly Farmer** is the Cage's host, so
   "tell the farmer" means a card in `astras-pet-apps/handoffs/`).
2. Read `handoffs/README.md` in the likely repos and any card that is `open` and `for:` you
   or `any`.
3. Read that repo's `AGENTS.md` and `CLAUDE.md`.
Ask Astra only what the repos do not answer, and say what you already found.

## Card format: `handoffs/NNN-short-name.md`
```
status: open | taken by <who> | done
for: any | claude | codex | farmer | goldfish | <named assistant>
from: <model name and version>, <YYYY-MM-DD>
needs: <files to read>
---
## Task
## Done when
## Return
Write results to <path>, set status: done, commit.
```
Add a row for the card to `handoffs/README.md`. Numbers never repeat.

## Hatching or changing a pet
- A new pet repo needs `pet.json` with an `audit` block, the `pet-app` topic, and an AGENTS.md that links
  `findastra/astras-pet-apps` and its PET-FILES.md. The Farmer's daily round finds it and adds it to the
  pipeline; leave a `farmer-register-<repo>` card in `astras-pet-apps/handoffs/` too.
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
- Follow the repo's own rules: no pushing to `main` and no new GitHub repos without
  Astra's OK; work on a branch otherwise.
