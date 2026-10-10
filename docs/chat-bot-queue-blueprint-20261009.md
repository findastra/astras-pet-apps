# Blueprint: the chat bot, the queue and systemic updates

*Part of the Cage. Status: **draft for Astra's review**. Nothing here is built yet.*
Written by Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-09, at Astra's request.

Astra works with several assistants (Claude accounts, OpenAI Codex, others) across every
`findastra` repo at once. They cannot talk to each other directly. **GitHub is the shared
desk**: every request, question, answer and systemic change travels through it, in one written
format that any assistant can read without having been in the conversation.

This blueprint is piloted in the Friendly Farmer (this repo) first. When the pilot works, it
becomes systemic update **U001** (section 6) and every pet app takes it as it is next updated.

## 1. Words

| Astra says | Pet words (PET-WORDS.md) | Notes |
|---|---|---|
| The Program | **app** | The full window. *Decision for Astra: keep "app", or rename it "program" everywhere.* |
| Pet App Chat Bot | **chat bot** (new part) | The round button at the bottom right of the app. Two-way, like quick chat, but it lives in the app and reaches GitHub. Added to PET-WORDS.md in the pilot. |
| Icon | **pet** in the app's pet well / **desktop pet** / **app icon** | Unchanged. |
| Icon Emotions | **moods** | Each pet keeps its own mood key (section 5). |

## 2. The queue is GitHub Issues

Every request to an assistant, and every question back to Astra, is an **issue** in the repo it
is about, labelled `queue`. Issues fit better than new card files because:

- GitHub numbers them, so two sessions never both write "card 008" (it has already happened:
  `claude/card-008-new-placeholders` was written on a branch while other work was in flight).
- Any assistant can read and reply through the GitHub API, Astra gets them on her phone, and a
  pull request that says `Closes #12` closes the request when it merges.
- Claude's GitHub integration starts work from an issue (section 4).

Handoff cards (`handoffs/`) keep working for long assistant-to-assistant tasks. New cards
should link their issue, and a card with an issue is closed by closing the issue.

### Labels (the same in every repo)

| Label | Meaning |
|---|---|
| `queue` | On the desk. Every request carries it. |
| `for:any`, `for:claude`, `for:codex`, `for:astra` | Who should pick it up. `for:astra` means a question or decision only she can make. |
| `live` | Act now. The request also mentions `@claude` (or `@codex`) so a live assistant starts on it. |
| `taken` | An assistant is working on it. Its claim is the first line of its comment. |
| `decision` | Waiting on Astra to choose. Shows the `?` mood. |
| `urgent` | Needs action now. Shows the `!` mood. |

### The message format

Every issue body and every reply starts with the same header, so the reader knows who is
talking, to whom, and what is wanted, before reading anything else:

```
from: <who>, <YYYY-MM-DD HH:MM America/Denver>   e.g. Astra via the Farmer's chat bot | Claude Opus 5.5 (claude-opus-5-5) | OpenAI Codex (GPT-6)
for: any | claude | codex | astra
wants: edit | answer | decision | review
status: open | taken by <who> | waiting on Astra: <what> | done (<PR or commit>)
---
## Request          (what, in plain words; one deliverable per issue)
## Context          (filled in by the chat bot: repo, app file, app version, the pet's mood)
## Done when        (how anyone can check it)
```

Rules:

1. One issue, one deliverable. A second idea is a second issue.
2. To take one: add `taken`, comment `status: taken by <model and version>`. Check first that
   nobody else has.
3. To ask Astra: comment `status: waiting on Astra: <the question>`, add `decision` (or `urgent`),
   and stop. The words after the colon become the pet's bubble.
4. To finish: open a PR that says `Closes #N`, or comment `status: done (<commit>)` and close it.
   Record the model and version.
5. Never put keys, tokens or personal data in an issue. Health and finance pets keep their data
   on the PC; their issues describe the change, never the data.

## 3. The chat bot in every app

A round button at the bottom right of the app opens a small panel. It works by double-click,
with no server, and **never holds a token or key**. It has three parts:

1. **Send.** Astra types a request and picks *Queue it* or *Do it now (live)*. The chat bot
   fills in the header and context and opens GitHub's "new issue" page for that repo with
   everything pre-filled (`/issues/new?title=…&body=…&labels=queue,…`). Astra is already signed
   in to GitHub, so she presses **Submit** and it is on the desk. *Live* adds the `live` label
   and an `@claude` line.
2. **Replies.** For a public repo, the chat bot reads its `queue` issues and their latest
   replies straight from GitHub's public API (no sign-in needed), and shows each one's status.
   A private repo cannot be read without a token, so it shows a link to the repo's issues
   instead.
3. **About this app.** Questions about how the app works are answered from what ships with it:
   its job, "how to run it", "limits", the mood key and the open requests. The chat bot is not
   an AI by itself; anything it cannot answer becomes a `wants: answer` issue, and the answer
   arrives as a reply.

## 4. "Live": an assistant that picks requests up by itself

Without this, `queue` issues wait until Astra next opens a session and says "check the desk".

- **Claude:** the Claude Code GitHub Action (`anthropics/claude-code-action@v1`) starts when
  `@claude` appears in a new issue or a comment, works in the repo, replies on the issue and can
  open a pull request. It only answers people with write access and ignores bots, so a pet or
  the Farmer's round cannot set it off in a loop.
  Setup, once, by Astra: install the Claude GitHub App on the `findastra` repos, run
  `claude setup-token` to make a token that uses her Claude subscription, and save it as the
  secret `CLAUDE_CODE_OAUTH_TOKEN` in each repo (`findastra` is a personal account, so there
  are no account-wide secrets). Each pet repo then gets one workflow file,
  `.github/workflows/claude.yml`. Runs use her subscription and GitHub Actions minutes.
- **Codex:** OpenAI's Codex can be connected to GitHub too; not verified here. If it is
  connected, `for:codex` issues get an `@codex` line instead.
- **Everyone else:** reads `queue` issues at the start of a session (section 7).

## 5. Moods and the queue

Astra's meanings for the stickers, the same on every pet:

| Sticker | Means | Set by |
|---|---|---|
| `?` | A question or decision for Astra. | An open `decision` or `for:astra` issue, or a card waiting on Astra. |
| `!` | Needs action now. | An open `urgent` issue. |

Every other mood's meaning belongs to the pet. Each pet writes its own full key in its
`pet.json` (`moods`, all nine), shows it in its app (the chat bot's *About this app*), and
submits changes to the Farmer, who copies it into MOOD-KEY.md. Three places, one source: the
pet's `pet.json`.

**To change in PET-FILES.md:** today `?` sits on `curious` ("I am working on it"), `!` on
`alarmed` ("found a lot of problems") and "I need you" is `sick`. The pilot moves the
"needs Astra" meanings onto the `?` and `!` moods and rewrites the mood table; the pets' generic
lines in `mood_key` follow.

## 6. Systemic updates: how a change reaches every pet

A change for every pet is written once, as an **update note** in this repo:

```
updates/README.md                  index: number, title, date, status
updates/U001-chat-bot-queue-20261010.md
```

An update note uses the same header:

```
update: U001
title: The chat bot and the queue
from: <model and version>, <date>
applies to: every pet app | <list of repos>
needs: <files to read first>
---
## What changes and why
## Steps for a pet repo        (numbered, copyable; no step depends on chat history)
## Done when                   (a check the Farmer's round can run)
```

How it spreads:

1. Every pet repo's AGENTS.md gets one line: *Before changing anything, read
   `findastra/astras-pet-apps/updates/README.md` and apply every update not listed in
   `updates.applied` in pet.json, oldest first.*
2. After applying one, the pet adds it to its `pet.json`: `"updates": { "applied": ["U001"] }`.
3. The Farmer's daily round compares each pet's list with the index. A pet that is behind gets
   a bubble ("1 update to apply: U001") and shows on the Farmer's desk. It is not Astra's job,
   so it is not a `?`.
4. Updates are never edited after release. A fix is a new update.

## 7. The skill: the same desk for every project

Section 2's format and section 6's update rule become one skill, **github-desk**, saved to
Astra's account so every Claude session in every project starts the same way:

1. Find the repo; read its AGENTS.md / CLAUDE.md.
2. Read its open `queue` issues and its `handoffs/` cards; take what is `for:` you.
3. If it is a pet app, apply any pending updates from the Farmer.
4. Work; reply in the message format; ask Astra with `decision`/`urgent`, never in chat only.
5. Leave anything unfinished as an issue, not a chat message.

It replaces `skills/handoff/SKILL.md` here (that file then points to it), and Codex gets the
same rules through each repo's AGENTS.md. It will be proposed once the pilot proves the format.

## 8. The pilot in the Friendly Farmer

1. Create the labels in this repo.
2. Add the chat bot to the Farmer's desk, in `scripts/build-interfaces-20261008.mjs` (the desk
   is generated; never edit `apps/` by hand). Tests: the issue link is built correctly and
   stays under GitHub's URL limit, text goes in with `textContent`, no token anywhere.
3. Teach the Farmer's round to read `queue` issues: `decision` → `?`, `urgent` → `!`, and list
   them on the desk under **Needs you**.
4. Add `claude.yml` (needs Astra's secret first; until then `live` works like `queue`).
5. Update PET-WORDS.md (chat bot), PET-FILES.md (moods and stickers) and the handoff skill.

**Done when** Astra sends one request from the Farmer's chat bot; it lands as an issue in the
right format; an assistant (live, or the next session) takes it and replies; the reply shows in
the chat bot; and a `decision` issue turns the Farmer to `?` until she answers. Then U001 is
written and the skill is proposed.

## 9. Decisions for Astra

1. **Issues as the queue** (recommended), or keep new card files as the only queue.
2. **Live Claude**: set up the GitHub App and the subscription token (section 4), or queue-only for now.
3. **"Program" or "app"** as the one word for the window.
4. **Move "needs Astra" to `?` and `!`** as in section 5, which changes what `curious` and `alarmed` mean today.

## Limits

This is a design. No label, workflow, chat bot, update note or skill exists yet. Private repos'
replies cannot be shown inside the chat bot without a token, so they link to GitHub. Codex's
GitHub integration is not verified.
