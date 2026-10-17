# Handoffs

Task cards for whichever assistant picks them up. Format and rules:
[skills/handoff/SKILL.md](../skills/handoff/SKILL.md). Every card has a `## What I did` section
that lists explicitly what was changed, where, and what is not done.

To start: "Take the next open card for <you | any> in findastra/astras-pet-os."

| Card | For | Status |
| --- | --- | --- |
| [025: Security follow-ups from the 2026-10-16 assessment](025-any-security-follow-ups-20261017.md) | any | open: the Farmer's round fix waits on Astra's merge; findings 3 to 5; PR #26's security model |
| [021: Startup Star shows API Fairy's bubbles](021-codex-startup-star-api-fairy-bubbles-20261017.md) | Codex | open |
| [020: Chat sync, folder rename plan row, Role Fairy (Fairy Ring #83), Nullbot dropped](020-any-chat-sync-and-folder-rename-20261017.md) | any | open, waits on Astra: File Master rename row |
| [017: API Fairy's desktop app has never run; verify it](017-any-api-fairy-desktop-verify-20261017.md) | any | done 2026-10-17 |
| [012: Pet-first profile list and missing pets](012-farmer-pet-first-list-and-missing-pets-20261016.md) | Farmer | open, waits on Astra: #77's name, homes, Chat Rat, Workflow Whale |
| [010: Register Platform Platypus](010-farmer-register-platform-platypus-20261011.md) | Farmer | done 2026-10-17: registered with the existing seed sheet |
| [009: Register Spoonfed Sugarcube](009-farmer-register-spoonfed-sugarcube-20261011.md) | Farmer | open, art waits on Astra's OK; local only |
| [001: Register Claude Bot in the Cage](001-farmer-register-claude-bot.md) | Farmer | open |
| [002: Build Claude Bot v0](002-any-build-claude-bot.md) | any | open |
| [003: Goldfish audit of Claude Bot](003-goldfish-audit-claude-bot.md) | Goldfish | open |
| [004: Register RGBee in the Cage](004-farmer-register-rgbee.md) | Farmer | open, art waits on Astra's OK |
| [005: Goldfish audit of RGBee and old pet words](005-goldfish-audit-rgbee-and-pet-words.md) | Goldfish | open |
| [006: Register Fuzzboi Friend in the Cage](006-farmer-register-fuzzboi-friend.md) | Farmer | open, ready: apply the patch in fuzzboi-friend/cage/ |
| [007: Register Mail Snail in the Cage](007-farmer-register-mail-snail.md) | Farmer | open, waits on Astra's OK for the art |
| [008: Voicemeeter Bug to GitHub, then scrambled-audio detection](008-any-voicemeeter-bug-github-and-detection.md) | any | open: repo done; detection waits on the next failure |
| [011: Wrap-up of Claude session 012RaHVD (movement merge WIP, README screenshots)](011-any-claude-session-012RaHVD-wrapup-20261012.md) | any | open, waits on Astra |

## Card numbers on every branch

A card number is used once, across `main` and every branch. **Before you write a card, take the next free number
below and add its row here in the same commit**, so two chats working at once never pick the same one. Cards written
on a branch keep the number below when they reach `main`. `test/handoff-numbers-test-20261017.mjs` fails when two
cards share a number, or when a card uses a number this table gives to another card.

**Next free number: 026.** Checked on 2026-10-17 across every branch by Claude Opus 5.5. When numbers clashed, the
card that reached `main` first kept its number, then the oldest card on a branch.

| No. | Card | Where it is now |
| --- | --- | --- |
| 001–012 | The cards in the table above | `main` |
| 013 | `013-goldfish-flash-audit-20261014.md` | Codex branches (PRs #23, #26) |
| 014 | `014-any-rebuild-desktop-for-discord-damsel-20261014.md` | `claude/damsel-starts-presence-20261014` |
| 015 | `015-flash-audit-checkpoint-20261015.md` | Codex branches (PRs #23, #26) |
| 016 | `016-world-caretakers-and-l3-activity-20261016.md` | `codex/world-caretakers-20261016` (PR #26) |
| 017 | `017-any-api-fairy-desktop-verify-20261017.md` | `main` |
| 018 | `018-any-curious-faces-and-hummy-beak-20261017.md` | `claude/chat-reconcile-20261017` (PR #37) |
| 019 | `019-any-portfolio-puffer-and-the-portfolio-20261017.md` | `claude/chat-reconcile-20261017` (PR #37) |
| 020 | `020-any-chat-sync-and-folder-rename-20261017.md` | `main` |
| 021 | `021-codex-startup-star-api-fairy-bubbles-20261017.md` | `main` (was a second 020) |
| 022 | `022-security-enforcement-and-pet-catalog-20261014.md` | Codex branches (PRs #23, #26), still named `012-…`: rename it to 022 when it is merged |
| 023 | `023-halo-list-vscode-angel-program-20261017.md` | `claude/halo-list-program-20261017`, still named `013-…`: rename it to 023 when it is merged |
| 024 | `024-any-pole-puff-repo-20261012.md` | `claude/pole-puff-draft-20261012` (PR #8; was 010) |
| 025 | `025-any-security-follow-ups-20261017.md` | `main` |

Old drafts on dropped branches have no number: `001`–`005` on `pets-roam-life-20261009` (the "claude mini pet"
before it was named Claude Bot, and a new-pet lineup) and `008-farmer-register-new-placeholders.md` on
`claude/card-008-new-placeholders` and `add-backup-beaver-candidate`. If one is ever brought to `main`, it takes the
next free number.
