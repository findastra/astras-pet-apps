status: open
for: codex
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-17
needs: findastra/api-fairy src/DesktopSignal.cs and README.md; scripts/desktop-pets-20261011.cs; docs/tray-star-handoff-20261011.md
---
## What I did

Astra decided (2026-10-17): **one API Fairy on the desktop, Startup Star's.** The API Fairy Windows app had its own
desktop fairy (an old 32x24 LCD drawing from 2026-10-07, before her approved art). That is gone.

- **findastra/api-fairy `main`, commit `6b1d430`:** removed the app's own desktop fairy (`FairyWindow.cs`,
  `Sprite.cs`). The window and icons now use the nine approved mood frames (`art/*-20261008.png`, built into the exe).
  When a key is added, changed or removed, the app writes
  `%LOCALAPPDATA%\astras-pet-os\api-fairy-ring\desktop-signal.json` and shows a Windows notification.
- Verified on Astra's PC 2026-10-17: the build runs (Malwarebytes now allows `api-fairy\bin`), the window opens with
  the approved fairy, 83/83 tests pass, and the signal file is written (`mood`, `badge`, `schema: 1`).
- Nothing in this repo's desktop code was changed (desktop host files are Codex's, per docs/migration/PLAN.md).

## Task

Have Startup Star's API Fairy desktop pet read that file:

```json
{ "schema": 1, "pet": "api-fairy", "program": "API Fairy Ring", "updated": "<ISO time>",
  "mood": "happy|curious|alarmed|sleep", "badge": 0, "bubble": "New key! OPENAI_API_KEY (OpenAI) in your Windows settings. Tap me to add a note.",
  "bubble_id": "<changes for every new bubble>", "sticky": true, "open": "\"<path>\\API Fairy.exe\" --open" }
```

1. Rest her in `mood` (the shared mood words) and show `badge` when it is above 0.
2. When `bubble_id` changes, show `bubble` as her bubble. Sticky bubbles stay until clicked; others fade.
3. Clicking her (or the bubble) runs `open`. Only run it if the path ends in `\bin\API Fairy.exe` inside the
   api-fairy folder; never run anything else from this file.
4. Treat the file as data: bubbles hold key names and places only, never key values. Ignore a missing or bad file.

## Done when

Adding a test variable in Windows' Environment Variables window makes Startup Star's API Fairy say so, and clicking her
opens the API Fairy window. Test with a made-up value only.

## Return

Update `## What I did`, set `status: done`, commit on a `codex/` branch.
