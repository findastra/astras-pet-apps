# Desktop Farmer

Double-click `start-farmer-dock-20261008.cmd` on Windows. It builds the small
desktop companion using the .NET Framework compiler already included with
Windows. There are no packages to install and no startup setting is changed.
Right-click the Farmer to close him. Double-click him to open his desk.

The Farmer's fixed visible height is **58.75 logical pixels**, matching the top
of BSOD's computer case to its feet at the mini's smallest setting. The antenna
is excluded from this comparison. BSOD itself remains at its native minimum
80-pixel frame width. Both characters share the same feet baseline. The dated
DPI manifest lets the helper convert the saved logical position to physical
display pixels explicitly.

This is a compatibility companion for Codex 26.1002. It opens the local Codex
settings file and uses only its saved mini geometry and open state to locate
and calibrate the mini. It then reads the live rectangle of the exact **BSOD
pet** accessibility Image, scoped to the uniquely identified packaged Codex
mini window. The Farmer follows that rectangle during a drag, including when
BSOD moves inside a stationary transparent parent window. A background reader
and a 33-millisecond placement timer keep accessibility queries off the
Farmer's drawing thread; actual updates depend on the accessibility provider.

The companion does not write Codex settings, read conversations, send data,
invoke accessibility actions, or control Codex windows. Only its own Farmer
window is positioned. No settings or coordinates are logged. Future Codex
state, window, or accessibility changes may require an update.

The helper hides when Codex desktop closes, the mini is hidden, the saved position
does not match the display, or the state remains unreadable. It also hides when
the exact BSOD Image is missing, ambiguous, off-screen, or its live geometry
expires after 300 milliseconds. Switching to a different native pet therefore
hides this companion. A partial settings write is retried, retaining live
tracking for at most two seconds after the last valid settings read.
The Codex command-line process alone does not count as the desktop application.

Only a single display is supported. It hides on multiple-display layouts rather
than guessing a monitor position. The Farmer stays on BSOD's **right**. Leave
about 60 logical pixels of space there; he can be clipped or fully off-screen
at the right display edge and never silently switches to the other side.

Launching the companion again reuses the existing instance. Close the Farmer
before rebuilding a changed helper. Sprite images are cloned into memory and
their files are immediately released, so rebuilding the artwork does not require
closing the Farmer; restart him afterward to show newly rebuilt art.

The production Farmer is a nonactivating transparent tool window and does not
appear in the taskbar. Some app/window lists omit this kind of window. These
optional commands are available from the project directory:

```bat
start-farmer-dock-20261008.cmd --check
start-farmer-dock-20261008.cmd --self-test
start-farmer-dock-20261008.cmd --tracking-test
start-farmer-dock-20261008.cmd --test
```

`--check` reports only aggregate process/window health, including whether this
helper's window is visible, on-screen, topmost, nonactivating, and receiving live
BSOD geometry. It never
constructs another Farmer window. `--self-test` verifies the sprite's file is
unlocked and the requested height is fixed. `--tracking-test` opens only a
synthetic test window, moves its BSOD-named Image inside a stationary parent,
and verifies right-side following, fixed size, and rejection of duplicate or
hidden Images. It neither moves nor sends input to the actual native mini.
`--test` opens an explicitly labeled
ordinary test window with a sample Farmer; it does not read mini state. Close
that window when finished. No mode changes login startup.

The browser Cage's BSOD visitor is a separate local guest. Its Farmer pairing
does not synchronize with the actual desktop mini.

Implementation reference: Microsoft's
[non-activating Windows Forms window](https://learn.microsoft.com/dotnet/api/system.windows.forms.form.showwithoutactivation).
