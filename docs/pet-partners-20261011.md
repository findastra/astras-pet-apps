# Paper Girl and File Master companions

Prepared for Astra by OpenAI Codex (GPT-6), 2026-10-11. Desktop pet revision; the websites are unchanged. Artwork remains a draft for Astra's preference review.

## Appearance and controls

- Paper Girl retains her pink folded newspaper, gray columns and cheeks. All nine expressions have no NEWS lettering or lashes. Her open eyes match File Master's small black rectangles with white highlights.
- File Master retains his golden folder, white paper and little limbs. A compact angular crown, stern eyebrows and straight idle mouth give him a commanding appearance.
- Both remain 42.3 logical pixels tall, at desktop scale 0.72.
- They begin beside each other and wander together. File Master leads initially. Dragging either pet makes it the leader; it waits while the companion catches up smoothly. Hovering, clicking, dragging or opening either menu pauses both.
- The floor lineup keeps them adjacent, including when it wraps across rows. A dragged pet can reunite with its companion while the rest remain lined up.

## Implementation and restoration

The shared behavior is in `scripts/desktop-pets-20261011.cs`. `PetPair` handles bounds, proximity, obstacle avoidance and eased catch-up. The existing native layered rendering, pet sizes, star and click controls remain intact. Sparkles remain disabled.

Both source sheets and nine derived transparent frames live in `desktop-art/<pet>`. Exact built-in image-generation prompts are saved as `prompt-partner-20261011.md` in each folder. The slicer now finds transparent gutters near each third of a sheet, preventing a slightly uneven generated grid from clipping neighboring sprites. It rejects sheets without safe gutters.

Local originals are backed up under the ignored `bin/paper-girl-before-partner-20261011` and `bin/file-master-before-partner-20261011`. The previous installed executable is `bin/desktop-pets-before-partners-20261011.exe`. Rebuild with `build-desktop-pets-20261011.ps1 -CandidateOnly` before replacing the installed executable after graceful shutdown.

## Verification

- All 64 Node tests pass, including two new gutter-slicing regression tests for uneven layouts and missing gutters. Whitespace checks pass.
- The native build and self-test pass, including 20,000 paired movement steps, 140 drag/drop scenarios, pause behavior, negative-coordinate monitors, collision avoidance, unequal-height scatter and lineup adjacency.
- All 18 generated frames were visually reviewed, including idle and blink in both designs. Each is 256 by 256 with clear alpha margins and no neighboring fragments.
- The installed app was restarted successfully. Fresh live diagnostics show 35 visible pets, animation running, both pets 42.3 logical pixels tall and the pair together. Across two samples three seconds apart, both moved by the same 30 physical pixels while keeping a 9-pixel gap.
- Physical drag feel still depends on Astra's interaction with the desktop. Cross-display catch-up uses the virtual working rectangle; unusually disconnected monitor layouts may briefly hide the follower while it crosses a gap. Ordinary paired roaming stays on one display.

Publication details are recorded in `pet-revisions-20261011.md` after remote verification. Corresponding repositories contain the same artwork and updated desktop metadata; no application or website source was changed there.
