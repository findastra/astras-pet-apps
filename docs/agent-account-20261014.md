# The first wall: a Windows account for agents (Astra, 2026-10-14)

**Why:** today Claude Code and Codex run as Astra, so an agent can do anything she can, including stopping the pets
that watch it. Pets can watch; only the operating system can enforce ([SECURITY.md](../SECURITY.md)). Running agents
in their own **standard (non-admin) Windows account** means Windows itself stops an agent from changing system
settings, reading Astra's private folders, or touching the security pets.

**Astra runs these steps herself**: creating accounts and changing permissions are hers to do. Run PowerShell as
administrator for steps 1 to 3. Nothing here deletes anything; step 7 undoes it all.

## 1. Create the agent account (standard user)

```powershell
$pw = Read-Host -AsSecureString "Password for petos-agent"
New-LocalUser -Name "petos-agent" -Password $pw -FullName "PetOS Agent" -Description "Runs AI agents. Standard user, never an administrator."
Add-LocalGroupMember -Group "Users" -Member "petos-agent"
```

Never add it to Administrators, and never type an administrator password for it. Windows keeps other users out of
your own profile folder by default, so it cannot read your Documents unless you grant a folder.

## 2. The farm folder the agents may write

```powershell
New-Item -ItemType Directory -Force "C:\PetOS\farm" | Out-Null
icacls "C:\PetOS\farm" /grant "petos-agent:(OI)(CI)M"
```

Grant it the repos it works on and nothing else. For example, to let agents work in your pet folder:

```powershell
icacls "$env:USERPROFILE\Documents\Astra's PetOS" /grant "petos-agent:(OI)(CI)M"
```

## 3. The security folder the agents may only read

The Police Station's logs, Iron Gates' key records and the alarm settings live here. Agents can read them, never change them.

```powershell
New-Item -ItemType Directory -Force "C:\PetOS\security" | Out-Null
icacls "C:\PetOS\security" /inheritance:r /grant:r "Administrators:(OI)(CI)F" "SYSTEM:(OI)(CI)F" "${env:USERNAME}:(OI)(CI)F" "petos-agent:(OI)(CI)RX"
```

## 4. Run agents as petos-agent

- **Simplest:** Start → your picture → **Switch user** → petos-agent. Install and sign in to Claude Code and Codex
  there, and do agent work in that session.
- **Or one window:** `runas /user:petos-agent wt.exe` opens Windows Terminal as petos-agent.

## 5. GitHub for the agent account

Do not sign the agent account in as you. Until agents have their own GitHub identity (see PROVENANCE.md), create a
**fine-grained token** on GitHub (Settings → Developer settings → Fine-grained tokens): only the repos agents work on,
**Contents** and **Pull requests** read and write, nothing else, expiring in 30 days. Sign `gh` in with it inside the
agent session. Turn on branch protection for `main` so an agent can open pull requests but never merge the core.
Your security key stays with your own account.

## 6. Check it works

In the agent session:

```powershell
whoami                                              # shows ...\petos-agent
New-Item "C:\PetOS\security\test.txt"               # must fail: Access is denied
Get-ChildItem "$env:SystemDrive\Users\<your Windows user name>\Desktop"   # must fail: Access is denied
```

## 7. Undo

```powershell
Remove-LocalUser -Name "petos-agent"
```

The folders stay; remove the grant with `icacls "<folder>" /remove "petos-agent"`.

## What this does not do yet

It does not watch anything (that is the Police Station), sandbox strangers' code (Docker Dragon's sandbox), or limit
the network (Proxy Axolotl's allowlist). It is the floor those stand on.
