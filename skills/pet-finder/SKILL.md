---
name: pet-finder
description: The Friendly Farmer's trick for finding pets that are missing from the pet list or listed wrong, across pet-programs.json, pets.json, every findastra repo on GitHub and the pet folders on Astra's PC. Use when Astra asks whether any pets are missing, to check the other repos for pets, or before tidying the pet list.
---

# Pet finder (Astra, 2026-10-16)

A pet can live in four places. The pet-finder tool (`scripts/pet-finder-20261016.mjs`, a tool of The Farm) compares
them and reports what does not line up. It is **read-only**: it never adds a pet anywhere, because nobody becomes an
animal by saying so (`skills/farm-security`). Astra decides every addition.

| Place | What it holds |
|---|---|
| `pet-programs.json` | Every pet program, numbered for good. The profile's pet list is written from it. |
| `pets.json` | The registry: registered pets and the pipeline (the animals). |
| GitHub (`findastra/*`) | Each pet's repo and its `pet.json`. |
| Astra's PC | `%USERPROFILE%\Documents\Astra's PetOS\<repo>`: pets that may not be pushed yet. |

## Run it
```
node scripts/pet-finder-20261016.mjs                     # asks GitHub; GITHUB_TOKEN optional
node scripts/pet-finder-20261016.mjs --repos repos.json  # offline: [{ name, private, description, petJson }]
node scripts/pet-finder-20261016.mjs --local "%USERPROFILE%\Documents\Astra's PetOS"   # on the PC
```

## What it reports
| Kind | Means | Fix |
|---|---|---|
| `wrong-repo` | A repo's `pet.json` says it is pet program #N, but pet-programs.json points #N at another repo | Change that entry's `repo` (then the pet joins the numbered list) |
| `not-listed` | A pet repo with no pet program number | Ask Astra: does it join? Which number? |
| `no-repo` | A listed pet whose repo is not on GitHub, so the profile leaves it out | Fine for seeds; otherwise find or push the repo |
| `name-mismatch` | pet-programs.json and the repo's `pet.json` name the pet differently | The pet's chat updates its repo, or Astra picks one name |
| `not-in-registry` | A registered or pipeline pet program missing from pets.json | Registering it moves it through the gate: Astra decides |
| `placeholder-name` | `pet-program-77-icon-77` and the like | Astra names it |
| `no-home` | Listed pets with no home yet, with the suggested `idea` for each | Astra approves homes |
| `pc-only` | Pet metadata (`pet.json`, `*-candidate-YYYYMMDD.json`) in a PC folder with no GitHub repo | Push it with Astra's OK (AGENTS.md: never leave a program only on the PC) |

Repos without `pet.json` (places such as the Kennel, the Shed and the vet-clinic; tools such as Startup Star; worlds;
Discord bots) are not pets and are not reported.

## Steps
1. Run it (online, and with `--local` when you can reach the PC). If you cannot ask GitHub, build `repos.json` from a
   shallow clone of each repo (`git show HEAD:pet.json`).
2. Fix only what the data already proves (a wrong repo, a job a pet's own `pet.json` states). Everything else goes to
   Astra as one short list, with the suggested fix.
3. Then run the **pet-organizer** trick so the profile shows the result.
4. Record what you did in a handoff card (`skills/handoff`), with `## What I did`.
