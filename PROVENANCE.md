# PROVENANCE

**Provenance** answers three questions about every piece of Astra's PetOS: *who made it, who changed it, and can you
prove it?* Companion to [SECURITY.md](SECURITY.md) and [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md). Astra, 2026-10-14.

Nothing written in a plain file can be made impossible to remove, so provenance works like a cow's ear tag: a
**cryptographic signature**. Removing or changing it is *detected*, and the farm refuses to run what does not check out.

## The layers

| Layer | What it proves | How | Status |
|---|---|---|---|
| Visible credit | Who made it, for people to read | "by Astra" on every pet and page, and the MIT license | **Done** |
| Commits by Astra | Astra made this change herself | Signed with her hardware security key (needs a physical touch): GitHub shows **Verified** | Ready for Astra ([guide](docs/sign-commits-20261013.md)) |
| Commits by agents | Which agent made this change | A `claude/` or `codex/` branch and a `Co-Authored-By` line naming the model; later, an agent identity of its own | **Done** (identity planned) |
| Agent keys | Which agent, model, person, device and place did anything on the farm | Short-lived keys from Iron Gates, every use logged by The Police Station, shown by API Fairy | Designed |
| Releases | This release is exactly what the maintainers published | Signed tags and releases | Planned |
| Builds | This `.exe` was built from this exact source | Build provenance attestations from GitHub Actions (the SLSA standard); checksums on every release | Planned |
| Ingredients | Every third-party part inside a release | A software bill of materials (SBOM) with each release | Planned |
| Your farm | Exactly which pets and versions you run, and where each came from | `farm.lock`, with a hash for each pet | Designed |
| Tricks | Where every skill an agent learned came from, and every change to it | Skill Scout's records | Designed |
| Community parts | Whether something is official, verified or a stranger's | Trust tiers on the Kennel, the Shed and the vet-clinic | **Done** |
| History | Old commits carry no personal data | Author names and emails rewritten to the private address (2026-10-13) | **Done** |

## Check it yourself

- **A commit:** on GitHub, **Verified** means it was signed. Astra's own commits will be signed with her security key;
  agent commits name their model in `Co-Authored-By`.
- **A release (once releases begin):** compare its checksum, and run `gh attestation verify <file> --repo findastra/astras-pet-os`
  to confirm it was built from this repo's source.
- **The map's scripts:** the System Map loads three.js with integrity hashes; your browser refuses a changed copy.
- **A community pet, tool or trick:** check its trust tier. Anything marked *community* is a stranger's until your
  farm's L4 adopts it.

## Rules for agents

- Never sign as Astra, and never ask her to touch her security key for an agent's commit.
- Always name yourself: branch prefix, `Co-Authored-By`, and the model and version on handoff cards.
- Never remove or rewrite credit, licenses, signatures or history, except to remove personal data with Astra's approval.
