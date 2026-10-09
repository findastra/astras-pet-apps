# Handoff: Backup Beaver (Claude, 2026-10-09)

## Done
- Created findastra/backup-beaver (private) with placeholder README and index.html.
- This PR (#4) adds Backup Beaver to the `candidates` list in pets.json.
- Card 008 (`handoffs/008-farmer-register-new-placeholders.md`) asks the Friendly Farmer to move it into `pets` once Astra approves.

## Affected pets
- GitHub Goldfish: reads the words list in pets.json (not changed).
- Friendly Farmer: hosts the Cage desk and owns card 008.

## Open
- Cage render not generated. `npm run build` needs Node 20+; Node.js is not installed on this PC (the winget install needs admin approval and failed in the background).
- Next: install Node LTS, run `npm run build`, commit the regenerated files to a new branch, and open a PR (not pushed to main).
- Backup Beaver's job, kind and art are undecided; Astra needs to approve before registration.
