# Desktop pets

The desktop group appears in this order: the real Codex GPTbot, the puffy sparkling star
and the Friendly Farmer. The companion never draws a copy of GPTbot or moves Codex.

**The star shows every pet at once.** Click it and all the pets come out together, spread
over the whole screen: the working area is divided into a shuffled grid with one pet per
cell, so nobody starts on top of anyone else. Each pet then roams free in its own compact
transparent window, wandering in any direction, resting now and then, and turning back at
the screen edges. Click the star again to hide every pet and the Farmer; only the 52-pixel
star remains and movement stops. The choice is remembered for the next start.

- Double-click the Farmer to open his desk.
- Double-click any pet to open its app. Bug opens his actual status dialog.
- A single click on Bug requests an audio repair, only after the double-click window
  expires, so a double-click never repairs.
- Right-click the star or Farmer for Hide or Show the pets, the Farmer's desk, the browser
  page, sign-in startup, and Quit. Right-click any pet for an explicit Open command.
- Drag a pet to carry it somewhere else; it carries on roaming from there.

Clicks use Windows' configured double-click time and distance. Switching to another pet
cancels a pending gesture, and so do dragging or losing mouse capture. Pets pause while
hovered, clicked or dragged. One 200 ms timer drives all movement; every pet moves at most
two pixels across and one down per step, scaled for the display. There is no full-screen
input surface or global mouse hook: transparent pixels pass clicks through. Normal pets,
including Bug, have a visible height of 58.75 logical pixels; wide art is fitted without
distortion, at most 96 logical pixels across. Desktop pets show their idle and blink
frames. Loaded sprite files are immediately released.

The docking tracker reads the uniquely identified real BSOD pet image on one background
worker, at most five times per second. Discovery runs at most once every two seconds. It
never reads Codex settings or conversations. UI updates are coalesced into one pending
callback. The star stays just to GPTbot's right, and character feet align using the known
artwork margins. Without a matching GPTbot, the star and Farmer use their own saved
position and can be dragged. Dragging never moves Codex. The status report includes the
available and required width for information.

Build with `build-desktop-pets-20261008.ps1`. `-CandidateOnly` builds a separate dated
candidate while the installed executable keeps running. Start the built executable with
this repository's absolute path as its first argument. `--install-startup` enables Windows
login startup; `--remove-startup` removes only its matching entry. Neither builds nor tests
enable startup. The Run entry is named `findastra-desktop-pets` and points at
`bin/desktop-pets-20261008.exe`; reopening reuses the existing instance and shows the pets.
The app starts Bug with `--hosted`: his audio watcher keeps running while the duplicate
standalone Bug and star are hidden. Quitting the desktop pets leaves audio recovery running.
The older Farmer-only companion is not started by this app.

Use `bin/desktop-pets-check-20261008.exe` with the repository path, followed by:

- `--self-test`: asset and layout checks; synthetic single, double, held, cross-target,
  spatial and cancelled clicks; whole-screen scatter on two monitor shapes; 20,000 steps of
  bounded roaming; star hide and show. No app actions, docking, or visible pet windows.
- `--preview [png-path]`: draw a 1280×720 desktop in miniature with every pet out at once,
  without opening production UI. The default output is `desktop-pets-preview-20261008.png`.
- `--test-ui`: isolated visible test group; app and repair actions are recorded instead of
  run. Docking and audio-helper startup are disabled.
- `--check-test`: test status including action history, pending gestures and visible pet
  counts.
- `--quit-test`: close only the test group.
- `--check`: request current production status and docking space requirements.
- `--quit`: close only the production group cleanly.

Status files are dated JSON under `%LOCALAPPDATA%\astras-pet-apps`. The saved position
and the pets' shown or hidden state are stored under `HKCU\Software\Findastra\DesktopPets`.
Windows login behavior must be checked after the next actual sign-in.

Build the docking tests with the .NET Framework compiler from
`test/pet-dock-tracker-tests-20261008.cs` and `scripts/pet-dock-tracker-20261008.cs`
(references: System.Drawing, System.Windows.Forms, UIAutomationClient, UIAutomationTypes,
WindowsBase). They query only their own synthetic window, never Codex.
