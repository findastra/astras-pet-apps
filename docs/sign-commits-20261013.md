# Sign your own commits with your security key (Astra, 2026-10-13)

**Why:** agents (Claude, Codex) work on your GitHub account, so GitHub cannot tell your commits from theirs. A
commit signed with your hardware security key needs a **physical touch**, which no agent can do. After this:

- **Verified, signed with your key** → you made it.
- **No signature, with a `Co-Authored-By` line and a `claude/` or `codex/` branch** → an agent made it.

This is the first step toward agent identity (see [PROTECTION-RINGS.md](../PROTECTION-RINGS.md), gap 1). It changes
your own security setup, so you run these steps; no agent runs them for you.

You need: your FIDO2 security key, Windows' built-in OpenSSH (already installed: 9.5), Git (2.55) and the `gh` CLI.

## 1. Make a signing key that lives on your security key
Plug the key in. In PowerShell:

```powershell
C:\Windows\System32\OpenSSH\ssh-keygen.exe -t ed25519-sk -C "Astra signing key" -f "$env:USERPROFILE\.ssh\astra_signing_sk"
```

Touch the key when it blinks. Windows may ask for the key's PIN. Leave the passphrase empty, or set one. The private
half never leaves the security key; the file only points to it. If your key says it does not support `ed25519-sk`,
run the same line with `-t ecdsa-sk`.

## 2. Tell GitHub it is a signing key

```powershell
gh auth refresh -h github.com -s admin:ssh_signing_key
gh ssh-key add "$env:USERPROFILE\.ssh\astra_signing_sk.pub" --type signing --title "Astra security key (signing)"
```

Or by hand: GitHub → Settings → SSH and GPG keys → New SSH key → Key type **Signing Key** → paste the `.pub` file.

## 3. Tell Git to use it, but only when you ask

```powershell
git config --global gpg.format ssh
git config --global user.signingkey "$env:USERPROFILE\.ssh\astra_signing_sk.pub"
git config --global gpg.ssh.program "C:/Windows/System32/OpenSSH/ssh-keygen.exe"
git config --global alias.signed "commit -S"
```

Do **not** turn on `commit.gpgsign`. If you did, every agent commit would ask for your touch, and touching it would
sign the agent's work as yours, which is the opposite of the point.

## 4. Sign a commit

```powershell
git signed -m "What I changed"
```

The key blinks; touch it. On GitHub the commit shows **Verified**.

## 5. Optional: flag everything unsigned
GitHub → Settings → SSH and GPG keys → **Flag unsigned commits as unverified** (vigilant mode). Agent commits then
show "Unverified", so the difference is visible at a glance. Commits you make on github.com are signed by GitHub
and still show Verified.

## If something goes wrong
- **"Unverified" on your own signed commit:** the commit email must be one of your GitHub emails. Yours is the
  private noreply address, which counts.
- **Lost key:** delete the signing key on GitHub (old commits stay as they were) and make a new one with a spare key.
