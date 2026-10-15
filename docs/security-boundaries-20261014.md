# Identity, access and independent review

Status: reference verifier and tests implemented on a review branch, **not deployed host protection**.
Owner requested implementation on 2026-10-14. OpenAI Codex (GPT-6).

## Assume requests may come from an attacker

Human-like language, a name, model label, chat transcript, security hat, Git author or signed commit does not prove the owner requested an action. Authenticate a credential, then authorize its exact action and resource. Credentials can be stolen or used by software through an owner's session. Never infer a human from text or behaviour.

The trusted computing base must be smaller than the AI team: protected broker, enrollment store, policy, authentication verifier, OS isolation and audit/replay storage. Agents cannot edit these while using them. This cannot defend against an attacker who already controls that trusted host's administrator.

## Implemented reference contract

`scripts/access-policy-20261014.mjs` uses Node's Ed25519 signature verification. It takes exact payload bytes, signed request/approval/review envelopes and trusted host policy. It does not generate production keys, enroll identities, run tools, change Windows or open a network listener.

- Default deny: exact enrolled subject, typed action and exact resource grant. No wildcard, ring-derived privilege or auto-enrollment.
- Requests bind audience, policy revision, action, resource, payload hash, nonce and expiry (at most five minutes from verification).
- `status.read` and `source.propose` require explicit grants; neither permits arbitrary shell execution.
- `source.merge`, `policy.change` and `agent.resume` also require a separate owner signature and four enrolled reviewer controllers approving the exact request digest. Missing, stale, invalid or rejecting reviews block. Duplicate identities, controllers and public keys do not count as independent votes.
- Reviewers cannot grant permissions, waive owner approval, promote themselves or authorize unknown actions. Owner-originated elevated requests have no bypass; they still require a separate authorized approval identity. A future owner UI can submit through an enrolled executor.
- A required synchronous, atomic, durable `consumeOnce` adapter consumes a nonce before execution; failure/replay denies. Tests use an in-memory adapter only. Policy revision cannot revive a nonce. Replay records must survive restart and stay until the whole replay window closes through credential/session retirement.
- Success returns a decision, not a reusable capability or execution receipt. A broker must execute only the exact checked bytes through a typed handler, bind the base commit/resource version into those bytes, and recheck preconditions/revocation at execution. Do not accept the plain result from another process as proof of approval.

Controller labels come from protected enrollment, never request text. They do not mathematically prove independence of models or operators. Four model names are not four independent reviewers.

## Deployment gates still open

1. Dedicated standard agent account and GitHub identity; protected broker account, service ACLs and network restrictions. Agent access to the owner's session/key store must be blocked. Review recovery and rollback before changing the account.
2. Maintained WebAuthn/passkey verifier with RP/origin/challenge validation, required user verification and one-time challenge storage. Protected approval UI must show exact targets, action, base revision and diff hash. Never ask for a key touch on an opaque agent operation. WebAuthn proves credential use/user verification, not comprehension. This Ed25519 reference protocol is not a WebAuthn replacement.
3. Protected identity enrollment and short-lived sessions bound to executor/host/harness, revocation and rotation. A model's words or a local weights hash alone do not authenticate the running agent.
4. A broker on every file/process/Git/network side-effect path; typed version-checked handlers, durable replay storage, crash recovery and idempotency. Prevent direct shell bypass with OS controls. Protect the broker's own update path separately.
5. Protected GitHub main, required independent reviews/checks, stale-review dismissal and restricted bypass with separate identities. A branch convention alone does not enforce this.
6. Protected append-only audit and off-host replication; authenticated scoped containment and rate-limited alarms. Untrusted alarms must not grant arbitrary shutdown powers. Recovery covers credentials/data as well as code; a difference from a release is evidence of change, not proof of malice.
7. Live tests for OS bypass, injected text, stolen sessions, replay after restart, concurrent requests, changed resources after approval, revocation, unavailable verifiers, stopped monitors and malicious signed releases. Reference unit tests do not close these gates.

## AI security team

Iron Gates owns policy/approval routing; The Police Station monitors and requests containment; Log Lynx records; Test Tortoise checks correctness; Intel Owl researches threats; Forensic Ferret investigates; Rescue Retriever coordinates recovery. Credentials and enforcement stay outside model contexts.

Four reviews are a high-risk quorum, not a guarantee of faster or infallible detection. They cost time and can share blind spots. Give reviewers exact diffs and minimum relevant evidence in isolated read-only contexts; evidence may itself contain injection. A majority never overrides deterministic denial. Missing/disagreeing reviewers block and escalate. Urgent revocation needs a trusted path that does not wait for four models.

## Phone handoff reconciliation

Intel Owl is selected in the supplied October 14 handoff and added as planned seed #81. No duplicate Intel Ibis/Scout Fox, repo, Tor connection or runtime was created. Cipher Owl handles cryptography; Skill Scout tracks skills/instructions.

The handoff says `ASTRA_PET_OS`; the repository says `ASTRAS_PET_OS`. Keep the repository spelling until Astra resolves it. The handoff's landing page and bottom FAQ remain separate unpublished work; this slice does not publish them or recreate its reminder.

## References

- [NIST Zero Trust Architecture](https://www.nist.gov/publications/zero-trust-architecture)
- [NIST agent identity initiative](https://pages.nist.gov/nccoe-ai-identity/)
- [WebAuthn](https://www.w3.org/TR/webauthn-3/)
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
