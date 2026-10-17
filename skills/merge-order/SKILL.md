---
name: merge-order
description: Keep Astra's chats and pull requests in the order she should merge them, most important first. Use whenever a chat opens, updates, merges or closes a pull request that waits on Astra, when she asks what to merge first, and at the start of every chat (check your place in the list).
---

# Merge order (Astra, 2026-10-17)

Astra asked: **the chats on the left should be in the order of which merges she needs to do first, at the top.**

## What is possible, and what is not
- The Claude app sorts its chat list by itself (by recent activity). No chat can move itself up or down.
- So every chat **starts its title with its place in the merge order**: `1 · Merge #46: the Farmer's round`. Astra reads
  the numbers; the one with `1` is next. A chat with nothing for Astra to merge starts with `✓`.
- Cloud chats can rename each other (`set_session_title`) and message each other (`send_message`). Codex chats, ChatGPT
  and chats that run only on Astra's PC cannot be reached from the cloud: their own chat renames itself when it reads
  this skill, or Astra renames it.

## The one list
**Merge order** in [handoffs/README.md](../../handoffs/README.md) is the one ranked list of pull requests waiting on
Astra, across every repo. The chat titles follow it, never the other way round.

Rank, most important first:
1. **Security fixes**, by the severity in the newest assessment (high before low). A fix that turns a protection on
   again comes before one that only documents it.
2. **Something broken that runs every day** (a failing scheduled round, a page that is down).
3. **What other pull requests build on**: the base before the pull requests stacked on it, and of two that touch the
   same lines, the bigger one first, so the smaller one's chat fixes the conflict.
4. **Everything else**, oldest first.
5. **Stale pull requests** (the Cage is retired, superseded, or a month old with no chat): listed last as
   "close?", for Astra to close or keep.

Same pull request in two repos (a hub copy and a live site): they sit next to each other, with the same chat.

## Steps
1. **When your chat opens a pull request for Astra:** add its row to Merge order at its rank (rules above) on your
   branch, in the same pull request, and say the rank in the pull request's text. Renumber the rows below it.
2. **Title your chat** `N · Merge #<pr>: <what, in a few words>`, or `✓ <topic>` when nothing waits on Astra.
3. **Tell the other chats** whose number changed: rename the cloud chats you can reach and send each one a short message
   with its new number. List the chats you could not reach for Astra.
4. **After a merge or close:** remove the row, move everyone below it up by one, and retitle (steps 2 and 3).
5. Astra can reorder the list any time; her order wins over the rules above.
6. Never merge to move up the list: merging is Astra's (AGENTS.md).
