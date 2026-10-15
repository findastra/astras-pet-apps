status: open (waiting on Astra: rebuild the desktop pets once)
for: any
from: Claude Opus 5.5 (claude-opus-5-5), 2026-10-14
needs: scripts/desktop-pets-20261011.cs, build-desktop-pets-20261011.ps1, findastra/findastra-discord-presence start-discord-damsel-20261014.cmd
---
## What I did
- Astra asked that double-clicking Discord Damsel starts both presence apps in Automatic.
- `findastra/findastra-discord-presence`, branch `claude/presence-names-shuffle-20261014` (not on main, not pushed from the
  cloud session; bundle in `%USERPROFILE%\Documents\Projects`): added `start-discord-damsel-20261014.cmd`, which runs
  each app's `src/launch.js --background --automatic` (new flag: switches the running app to Automatic through its own
  local control API) and then opens Damsel's page. Tests: 76 pass.
- This repo, branch `claude/damsel-starts-presence-20261014`: `scripts/desktop-pets-20261011.cs` double-click on
  `discord-damsel` runs `start-discord-damsel-20261014.cmd` from `%USERPROFILE%\Documents\Pet Programs\findastra-discord-presence` (or `Documents\Projects` before the rename)
  (minimized) when it exists, otherwise opens her page as before. Not compiled: the cloud session has no C# compiler.
  `npm test` passes (79).
- Not changed: `pets.json`. Its validator only allows http(s) or dated HTML interfaces, which is right; the launch goes
  through the desktop host instead.

## Task
Merge the branch, quit the desktop pets, run `build-desktop-pets-20261011.ps1`, start them again, double-click Discord
Damsel: both control panels report Automatic (`http://127.0.0.1:38761/api/status`, `:38762`).

## Done when
Double-clicking Discord Damsel starts both presence apps in Automatic and opens her page.

## Return
Set status: done here and add what was built and tested under What I did.
