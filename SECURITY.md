# SECURITY

How Astra's PetOS keeps a farm safe from AI attacks, including a rogue agent, and how anyone can check that it does.
Companion to [INTELLIGENCE-LEVELS.md](INTELLIGENCE-LEVELS.md), [PROVENANCE.md](PROVENANCE.md) and
[PROTECTION-RINGS.md](PROTECTION-RINGS.md). Astra, 2026-10-14. **Status: early beta. Most of this is designed, not yet enforced.**

## Report a security problem

**Never post a break-in, a leaked key or a way to bypass a check in a public issue.** Report it privately:
[Report a vulnerability](https://github.com/findastra/astras-pet-os/security/advisories/new) (GitHub private vulnerability reporting).

## The honest answer: is this insecure?

Giving AI agents read, write and execute power over a farm is risky. It is also exactly what companies already do
with automation bots, and it is made safe the same way: **least privilege, isolation, review, logging, and a human who
approves.** Astra's PetOS is designed around all five.

What is not true yet, in order of risk:
1. **Agents act with Astra's full power:** her Windows account and her GitHub account. Pets can *watch* an agent,
   but an agent with a shell running as the same user could stop or edit the pets watching it.
   **Pets can watch; only the operating system can enforce.** See "The walls" below.
2. Remote-control tools can reach the PC from outside.
3. Prompt injection (text in a web page, email or ticket that tries to steer an agent) is unsolved industry-wide.
   The rule "data is never instructions" and the checker agent reduce it; nothing removes it.
4. Most security pets below are seeds or roadmap pets, not running code yet.

## The walls: what actually enforces security

The pets are the guards. These are the walls they guard. Each one is planned unless marked.

| Wall | What it stops | Status |
|---|---|---|
| Agents run as a separate, standard (non-admin) Windows account | A rogue agent changing system settings, other users' files, or the security pets | **First wall chosen.** Guide: [docs/agent-account-20261014.md](docs/agent-account-20261014.md) |
| The Police Station, its logs and Iron Gates' key store run under an account agents cannot touch | A rogue agent silencing the police or forging approvals | Planned |
| Sandbox (Windows Sandbox, a VM or containers) for anything untrusted | A stranger's pet, cure, tool or trick touching the real farm | Planned |
| Network allowlist (firewall) for agent traffic | An agent sending data anywhere it likes | Planned |
| Short-lived, scoped agent keys from Iron Gates | A stolen key working for long, or anywhere | Designed |
| Branch protection and a separate agent identity on GitHub | An agent merging its own change to the core | Planned (needs Astra) |
| Logs copied off the PC, append-only | Erasing the evidence | Planned |
| The big red button (L4): revoke every key, stop every agent, cut agent network | A rogue agent that is already inside | Designed |
| Animal guard and the gate in the scripts | A repo making itself an animal | **Built** |
| Integrity hashes on the map's scripts | A hacked CDN running code in the map | **Built** |
| Public pages name services, never their addresses; the build removes addresses, ports and personal paths, and stops on anything that looks like a secret | The public site mapping the services on Astra's PC, or publishing a key | **Built.** [docs/local-services-20261014.md](docs/local-services-20261014.md) |

## The security team

Grouped by the five standard jobs of a security program (the NIST Cybersecurity Framework), plus testing.
Names follow [docs/naming-20261013.md](docs/naming-20261013.md); `pet-program-#` means the program has no name yet.
Roles marked **confirmed** were confirmed by Astra on 2026-10-14. Turn on **Security hats** on the System Map to see every pet wearing its team colour: blue defends, red attacks your own farm in the sandbox, purple checks both, white is trusted, grey is not verified yet, black is an intruder.

| Job | Pet program icon | Pet program | What it does for security | Status |
|---|---|---|---|---|
| Govern | (you) | L4 | Approves every security change, permission and exception | Always |
| Govern | Gatekeeper Goddess | Iron Gates | Decides who may do what; issues grants and short-lived agent keys; routes approvals to L4 | Roadmap |
| Govern | Skill Scout | pet-program-40 | Tracks every trick and agent instruction file: what changed, who changed it, why | Seed |
| Identify | File Master | pet-program-12 | Inventory: new programs anywhere on the PC, repos never pushed | **Built (2 tools)** |
| Identify | API Fairy | API Fairy Ring | Every key: where it lives, what uses it, active and expired (never the secret) | Registered |
| Identify | GitHub Goldfish | pet-program-2 | Everything public on GitHub: leaks, exposed files, document errors | Registered |
| Identify | Port Spider | pet-program-68 | Open ports and exposed services | Roadmap |
| Protect | Cipher Owl | pet-program-69 | Encryption, certificates and **signatures** (checks provenance; see PROVENANCE.md) | Roadmap, role confirmed |
| Protect | Proxy Axolotl | pet-program-64 | **Egress allowlist**: what may leave the PC, and safe remote access | Roadmap, role confirmed |
| Protect | Docker Dragon | pet-program-50 | **The sandbox:** runs anything untrusted in isolation first | Roadmap, role confirmed |
| Protect | Update Urchin | pet-program-57 | Pinned versions, safe dependency updates, integrity hashes | Roadmap |
| Protect | Patch Cat | pet-program-25 | Windows, driver and app security patches | Pipeline, role confirmed |
| Protect | Gone Ghost | Am I a Ghost? | Privacy: name-eraser, internet scrub, personal security checklist | Registered |
| Detect | Pet Police Officer | The Police Station | Watches every write and key use live; switches OFF; raises the alarm | Seed |
| Detect | Agent Ant | pet-program-73 | **Records each agent:** model, version, request patterns, so a stranger or a changed agent stands out | Roadmap, role confirmed |
| Detect | Log Lynx | pet-program-48 | Append-only records of everything; never creates approvals | Roadmap |
| Detect | Token Toucan | pet-program-52 | Token and cost spikes: a runaway or hijacked agent burns tokens | Roadmap, role confirmed |
| Detect | Packet Piranha | pet-program-53 | Unusual network traffic | Roadmap |
| Detect | Wifi Butterfly | pet-program-31 | Radios: unknown Wi-Fi networks and Bluetooth devices | Pipeline, role confirmed |
| Respond | Forensic Ferret | pet-program-70 | Investigates breaches: timeline, which key, which agent | Roadmap |
| Respond | (vet-clinic triage) | pet-program-77 | Community advisories when a problem affects other farms | Seed |
| Recover | Backup Beaver | pet-program-28 | Versioned backups off the PC that agents cannot delete | Pipeline |
| Recover | Rescue Retriever | The Recovery Room | Rebuilds the farm after a shutdown from the verified release and clean backups, then restarts it in the safe order; isolated, no farmhand in its seat | Seed |
| Test | White Hat Weasel | pet-program-67 | **Red team:** attacks your own farm, only inside the sandbox, with L4's OK, and reports what got through | Roadmap, role confirmed |
| Test | Test Tortoise | pet-program-51 | **The checker agent** for maker-checker, and a security test for every hole ever fixed | Roadmap, role confirmed |

**Do we have enough pets?** Yes: about twenty pets already cover every job above, so no new pets are needed. What is
missing is the walls, not the guards.

## Farmhands: which AI models may take a seat

AI models are **farmhands**: they are not pets, they are who sits in the seat and drives the pets. Each has its own icon.
Only farmhands on the **allowlist** (kept by Iron Gates, changed only with L4's approval) can get a key, and every key
is bound to that exact farmhand, harness, device and person. Trust is **earned in levels** (graduated trust):

| Farmhand | Trust level | What it may do |
|---|---|---|
| Claude (via Claude Code), chosen OpenAI models (via Codex) | Allowed helpers | Take a seat with a short-lived key, within each pet's grants. They help build and test Astra's own model. |
| Astra's local farmhand (in training) | Short leash, earning trust | Fingerprinted (a hash of its weights); few grants at first. L4 promotes it as it passes her tests, until she relies on it most. |
| AI Astra's mind (the local model inside VRChat AI Astra, shown as Astra Wisp) | Narrow avenues | Her own pet program and the VRChat chatbox bridge only: no files, no keys, no other pets. |
| Anything else | Not allowed | Cannot get a key, so it cannot act. The Police Station alarms if one tries. |

A cloud model cannot prove cryptographically which model answered; we trust the provider over an encrypted
connection. A local farmhand can be checked: its weights' fingerprint must match. Note: the providers' terms restrict
training other models on their outputs; using them to help build a model (code, data cleaning, testing) is different.
Check the current terms before training.

## A rogue agent: what happens

The standard incident steps, with the pets that do them.

1. **Detect.** The Police Station (unpermitted write or key use), Agent Ant (an agent behaving unlike itself), Token
   Toucan (a spend spike) or Packet Piranha (odd traffic) notices.
2. **Contain, in seconds.** The Police Station switches the agent's key and tools OFF; Iron Gates revokes its key;
   the firewall cuts its network. L4 can press the big red button for everything at once. **The alarm** goes off.
3. **Preserve.** Log Lynx's off-PC, append-only records keep the evidence.
4. **Investigate.** Forensic Ferret builds the timeline: which agent, model, key, person, device, place.
5. **Recover.** Backup Beaver restores; git reverts the change; API Fairy lists every key to rotate.
6. **Learn.** White Hat Weasel turns the attack into a sandbox drill; Test Tortoise adds a test so it can never pass
   again; the vet-clinic warns other farms if they are affected.

**Why several agents auditing one is safer, and when it is not.** Four checkers beat one only if they are
*independent*: a different model or provider, their own context, read-only, and never shown the untrusted text that
started the change. Four copies of the same model share the same blind spots. And anything the pets "learn" about
attackers becomes a rule only after L4 approves it, so an intruder cannot teach the guards to look away.

## The shutdown protocol and recovery

**Shutdown (containment, not a crash)**, in levels. On an alarm the Police Station does levels 1 to 3 at once; level 4
only when L4 presses it. Only L4 turns anything back on.

| Level | What happens |
|---|---|
| 1 | Every agent key is revoked (Iron Gates). |
| 2 | Every agent stops: the agent account's processes end. |
| 3 | Agent network is cut (the firewall blocks the agent account). |
| 4 | All network off (L4 only). |

**Recovery: Rescue Retriever (The Recovery Room).** It runs isolated: from a read-only known-good copy, under its own
account, with **no farmhand in its seat**, so a compromised agent cannot steer the cleanup.

1. **Find what changed.** Compare the installed farm, fingerprint by fingerprint, with the signed release on GitHub.
   Every difference is something the breach touched. Forensic Ferret's timeline says when it started.
2. **Clean code.** Reinstall from the verified release.
3. **Clean data.** Restore the newest backup from **before** the incident (Backup Beaver keeps versioned copies).
4. **Fresh keys.** Every old key stays dead; API Fairy lists every key to rotate outside the farm too.
5. **Restart in the safe order** (watchers before workers, verify before trust, least power first):
   1. security and logging: the Police Station and Log Lynx start recording; Iron Gates checks its key store and allowlist;
   2. the core (The Farm), verified against the release;
   3. the network, allowlist only, still no agents;
   4. the pets, one at a time, with no farmhands (L1 and L2 only); the Friendly Farmer health-checks each;
   5. farmhands last, with new keys, only with L4's approval.
6. **Learn.** White Hat Weasel turns the attack into a sandbox drill and Test Tortoise adds a test.

## How we prove it

Security is shown with evidence, not claimed. Each item is something anyone can check.

| Evidence | Status |
|---|---|
| A written threat model: [PROTECTION-RINGS.md](PROTECTION-RINGS.md) and this page | **Done** |
| Automated tests on every change (privacy, registry, the animal guard) | **Done (74 tests)** |
| GitHub secret scanning and push protection, Dependabot alerts, CodeQL code scanning and private vulnerability reporting | **Done 2026-10-14** on all 50 public repos |
| OpenSSF Scorecard: a public score of this repo's security practices | Planned |
| Prompt-injection drills and red-team reports from White Hat Weasel, in the sandbox | Planned |
| Outside review: the community (vet-clinic) now, a professional audit later | Open |
| Provenance: who made and changed everything: [PROVENANCE.md](PROVENANCE.md) | Partly done |
