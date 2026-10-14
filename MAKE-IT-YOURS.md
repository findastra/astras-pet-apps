# MAKE IT YOURS

Astra's PetOS comes with **Astra's farm as an example**: her pets, her worlds and her pet programs, each wearing an
**EXAMPLE** tag on the System Map. This page shows how to turn it into **your own farm**: your own copy, your own
name, your own pets, and how to delete examples and get them back. Astra, 2026-10-14.

## The idea in one minute

- You make your own copy of Astra's PetOS on GitHub. Developers call it a **fork**: it is yours, and it stays linked to
  Astra's original (the **upstream**), so updates and security patches can reach you **when you choose**.
- Delete anything you do not want. **Nothing is ever lost:** every example stays online in Astra's repos, and your own
  copy remembers every change you make.
- Your data never goes into your copy. Your pets keep your data on your PC.

## 1. Make your own copy (once)

1. Make a free account at [github.com](https://github.com). A handle is enough; you do not need your real name.
2. Open [github.com/findastra/astras-pet-os](https://github.com/findastra/astras-pet-os) and press **Fork**, then
   **Create fork**. You now have `github.com/<you>/astras-pet-os`.
3. Give it your system's name: your fork → **Settings** → **Repository name**, for example `jordans-pet-os`
   (lowercase words joined by hyphens).
4. Install from **your** copy: your fork → **Code** → **Download ZIP**, unzip it, and run the installer
   (see the [README](README.md#beta-testers-and-their-ai-start-here)).

Or ask your AI: *"Help me fork findastra/astras-pet-os, rename it to `<name>`, and install it from my fork with its
installer. Show me each step before you do it."*

## 2. Delete examples

| Where | How | Undo |
|---|---|---|
| **On the System Map** | Click it → **Remove from my map** | **Show removed** brings everything back. This only changes the map in your browser. |
| **From your farm** | In your fork, open `pets.json`, delete that pet's entry (the block with its name), and commit. Then download your fork again and rerun the installer. | Step 3 below |

Or ask your AI: *"Remove the example pet `<name>` from my farm's pets.json. Show me the change first, then commit it to my fork."*

Astra's worlds (Astra's Infinite Pole, Piranesi House) live in their own repos. They are never downloaded with your
farm; on your map they are examples only.

## 3. Get something back

- **From Astra's repo:** every example is always online. Pets: `github.com/findastra/<pet's repo>`. Worlds:
  [astras-infinite-pole](https://github.com/findastra/astras-infinite-pole) and
  [piranesi-house](https://github.com/findastra/piranesi-house). Copy the pet's entry from
  [Astra's pets.json](https://github.com/findastra/astras-pet-os/blob/main/pets.json) back into yours.
- **From your own history:** your fork remembers every change. Your fork → **Commits** → open the change that removed
  it → **Revert**. Or ask your AI to revert that commit.

## 4. Get updates and security patches

Your fork → **Sync fork** → **Update branch**, when you want them (look at **Compare** first to see what changes).
Things you deleted stay deleted; new examples Astra adds may appear, and you can delete those too. If GitHub reports a
conflict, ask your AI for help or open a ticket at the [vet-clinic](https://github.com/findastra/vet-clinic).

## 5. Your own pets

- Ask your AI to make a pet for whatever you use: it follows the
  [Pet Program Framework](PET-PROGRAM-FRAMEWORK.md), gives the pet program its own repo (`<you>/<pet-program>`), and
  adds it to your `pets.json`. The Friendly Farmer will do this for you once his spawning tool is built.
- Proud of it? Bring it to [the Kennel](https://github.com/findastra/the-kennel) so other farmers can adopt it.

## 6. Keep it safe

- **A fork of a public repo is public.** Never put keys, passwords or personal information in it. Your pets keep your
  data on your PC, and GitHub's push protection stops most leaked keys.
- Pets with private data (health, money, private notes) belong in **private** repos of their own, not in your public fork.
- Install only with the installer, and only from your own fork or Astra's releases. See [SECURITY.md](SECURITY.md).

**Words you will see:** *fork* (your own linked copy), *upstream* (Astra's original), *commit* (one saved change),
*revert* (undo a commit), *sync fork* (bring in updates).
