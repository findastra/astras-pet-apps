# Architecture groups and access boundaries

The System Map's shells show topology, not CPU protection rings, Unix file permissions or effective authority.
This replaces the ring-wide RWX interpretation on 2026-10-14 (OpenAI Codex, GPT-6).
See [SECURITY.md](SECURITY.md) and [identity and access implementation](docs/security-boundaries-20261014.md).

## Owner authority

The owner approves, grants, revokes and recovers. Showing the owner with RWX turned off was misleading.
Ownership does not mean every AI inherits administrator rights. A claimed owner request is untrusted until
independently authenticated; even valid credentials need authorization for the exact action.

## Topology

| Group | Purpose | Access determined by |
|---|---|---|
| Core | Registry, Program Manager, policy and contracts | Protected policy, owner-reviewed changes |
| Friendly Farmer | Coordination | Its own limited grants, like every pet |
| Pets | Independent applications | Subject, action, resource and conditions |
| Pet programs | Owned code, data and settings | Separate grants for operations |
| Harness | Intended mediation point | Actual broker and OS isolation, not a glass drawing |
| Models | Inference services | Scoped model invocation; not shell execution |
| Third-party programs | External apps/services | Reading data, changing settings and operating tools are distinct |
| Devices | Hardware/hosts | Separate diagnostic, operation and update grants |
| Advisers | Ideas | Advice carries no approval authority |
| Owner | Human governance | Protected authentication and exact-action approval |

An animal is a registry classification, not a permission grant. New animals still need owner approval.
Catalog seeds are visible without installation or authorization. Tools use the intersection of explicit
delegation and executor policy; they do not inherit blanket RWX from their pet.

## Access vocabulary

Use subject → action → resource → conditions. Reading source is not reading credentials; operating a device
is not permission to flash firmware. The reference verifier supports status.read, source.propose, source.merge,
policy.change and agent.resume only. Unknown actions fail closed. See the implementation document for
expiry, replay protection, approvals and reviewer independence.

## Enforcement evidence

| Control | Status and limits |
|---|---|
| Registry animal guard | Built in participating scripts; unrestricted shell can bypass it |
| Lexical path check | Built; does not resolve links, prevent races or provide OS isolation |
| Public-data and known-secret checks | Built/tested; pattern scanning cannot prove absence of secrets |
| Core branch plus owner review | Procedural until separate identities and branch protection are verified |
| Signed scoped authorization and four-review quorum | Tested reference verifier, not connected to production side effects |
| Protected owner credentials and agent account separation | Planned deployment work |
| Durable replay ledger, protected broker, off-host audit, OS/network isolation | Planned deployment work |
| Device's effective permissions | Unverified by this static map |

## Failure domains are conditional

When agents/apps share an owner account, a compromised process may reach other pets, credentials and monitors.
Markdown rules, a branch, a signature and a model reviewer do not stop that. Isolation depends on enforced accounts,
ACLs, sandboxes, network policy and protected mediation. A compromised upstream may distribute malicious updates
although farms have no direct connection. Review success is not proof of safety. Recovery needs verified code,
backups, credentials and data; neither local Git nor an installed mascot proves these are protected.

Treat human/agent impersonation, credential theft, malicious enrollment, approval replay, shared reviewer control,
supply-chain compromise and compromised monitoring as explicit threats.
