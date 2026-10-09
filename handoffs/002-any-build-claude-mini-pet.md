status: open
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-09
needs: findastra/claude-mini-pet AGENTS.md and docs/plan-20261009.md, docs/farmer-dock-20261008.md (house pattern for a native Windows companion)
---
## Task
Build the first runnable version of Claude Mini Pet in `findastra/claude-mini-pet`, as
`docs/plan-20261009.md` describes: a small always-on-top Windows window with an orange face,
a status bubble, a bell for updates, and a global shortcut that opens a quick-chat box.

Same features as the Codex/ChatGPT "Mini"; **original look**. Do not copy OpenAI's artwork,
icons or layout.

## Done when
Double-clicking the start script on Windows shows the pet. The shortcut opens quick chat,
and the README "Limits" section says plainly what does not work yet.

## Return
Branch plus PR in `claude-mini-pet`, set this card to `status: done`, and update the pet's
status in `astras-pet-apps/pets.json` (hatching to growing) only when it actually works.
