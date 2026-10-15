// Reference authorization verifier, NOT an installed OS boundary or an identity enrollment service.
// The host must protect enrollment/policy/replay storage from agents and mediate every operation.
import { createHash, verify, createPublicKey } from 'node:crypto';

export const ACTIONS = Object.freeze(['status.read', 'source.propose', 'source.merge', 'policy.change', 'agent.resume']);
const elevated = new Set(['source.merge', 'policy.change', 'agent.resume']);
const digest = s => createHash('sha256').update(s).digest('hex');
const fail = reason => ({ allowed: false, reason });
const exact = (o, keys) => o && Object.getPrototypeOf(o) === Object.prototype &&
  Object.keys(o).length === keys.length && keys.every(k => Object.hasOwn(o, k));
const text = v => typeof v === 'string' && v.length > 0 && v.length <= 256;
const hex = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);

/** Hash exact signed request bytes and signer ID. Re-serializing means a new review/approval. */
export const requestDigest = envelope => digest(JSON.stringify([envelope.keyId, envelope.body]));

/**
 * Trusted host inputs: policy {audience, revision, keys, grants}, now, revoked, consumeOnce.
 * Keys have {id, role: agent|owner|reviewer, controller, publicKey (Ed25519 PEM)}.
 * Grants have {subject, action, resource}. No wildcards, role inference, or auto-enrollment.
 * consumeOnce must atomically and durably claim a replay ID before returning true.
 * This function consumes authorization, not executes it. The host must execute EXACT payload bytes
 * through a pre-enrolled typed handler, rechecking resource version and revocation at execution.
 */
export function authorizeOperation(bundle, payload, policy, { now, revoked, consumeOnce } = {}) {
  try {
    if (!Number.isSafeInteger(now) || !(revoked instanceof Set) || typeof consumeOnce !== 'function') return fail('trusted-host-context-required');
    if (!text(policy?.audience) || !text(policy?.revision) || !Array.isArray(policy.keys) || !Array.isArray(policy.grants)) return fail('invalid-policy');
    const keys = new Map();
    const enrolledFingerprints = new Set();
    for (const k of policy.keys) {
      if (!text(k.id) || !text(k.controller) || !['agent', 'owner', 'reviewer'].includes(k.role) || keys.has(k.id)) return fail('invalid-enrollment');
      const publicKey = createPublicKey(k.publicKey);
      if (publicKey.asymmetricKeyType !== 'ed25519') return fail('invalid-enrollment');
      const fingerprint = publicKey.export({type:'spki',format:'der'}).toString('hex');
      if (enrolledFingerprints.has(fingerprint)) return fail('duplicate-enrolled-key');
      enrolledFingerprints.add(fingerprint);
      keys.set(k.id, { ...k, publicKey });
    }
    const check = (envelope, kind, fields) => {
      if (!exact(envelope, ['keyId', 'body', 'signature']) || !text(envelope.keyId) || typeof envelope.body !== 'string' || envelope.body.length > 8192 || typeof envelope.signature !== 'string' || !/^[A-Za-z0-9+/]{86}==$/.test(envelope.signature)) return null;
      const key = keys.get(envelope.keyId);
      if (!key || revoked.has(key.id) || !verify(null, Buffer.from(envelope.body), key.publicKey, Buffer.from(envelope.signature, 'base64'))) return null;
      const body = JSON.parse(envelope.body);
      if (!exact(body, ['kind', 'audience', 'policyRevision', 'expiresAt', ...fields]) || body.kind !== kind || body.audience !== policy.audience || body.policyRevision !== policy.revision || !Number.isSafeInteger(body.expiresAt) || body.expiresAt <= now || body.expiresAt > now + 300_000) return null;
      return { key, body };
    };
    if (!exact(bundle, ['request', 'approval', 'reviews']) || !Array.isArray(bundle.reviews) || bundle.reviews.length > 16 || !Buffer.isBuffer(payload)) return fail('invalid-request');
    const req = check(bundle.request, 'request', ['nonce', 'action', 'resource', 'payloadDigest']);
    if (!req || !['agent', 'owner'].includes(req.key.role)) return fail('unauthenticated-request');
    const r = req.body;
    if (!text(r.nonce) || !ACTIONS.includes(r.action) || !text(r.resource) || !hex(r.payloadDigest) || digest(payload) !== r.payloadDigest) return fail('request-content-mismatch');
    if (!policy.grants.some(g => g.subject === req.key.id && g.action === r.action && g.resource === r.resource)) return fail('no-exact-grant');
    const hash = requestDigest(bundle.request);
    if (elevated.has(r.action)) {
      const approval = check(bundle.approval, 'approval', ['requestDigest', 'decision']);
      if (!approval || approval.key.role !== 'owner' || approval.key.controller === req.key.controller || approval.body.requestDigest !== hash || approval.body.decision !== 'approve') return fail('independent-owner-approval-required');
      const controllers = new Set();
      const fingerprints = new Set([req.key.publicKey.export({type:'spki',format:'der'}).toString('hex'), approval.key.publicKey.export({type:'spki',format:'der'}).toString('hex')]);
      for (const signed of bundle.reviews) {
        const review = check(signed, 'review', ['requestDigest', 'decision']);
        if (!review || review.key.role !== 'reviewer' || review.body.requestDigest !== hash || review.body.decision !== 'approve') return fail('review-invalid-or-blocked');
        const fingerprint = review.key.publicKey.export({type:'spki',format:'der'}).toString('hex');
        if (controllers.has(review.key.controller) || fingerprints.has(fingerprint) || [req.key.controller, approval.key.controller].includes(review.key.controller)) return fail('reviewers-not-independent');
        controllers.add(review.key.controller); fingerprints.add(fingerprint);
      }
      if (controllers.size < 4) return fail('four-independent-reviews-required');
    }
    // No await between check and consumption. An asynchronous/failed ledger is a denial.
    // Stable across policy revisions: revising policy must not revive an already consumed nonce.
    const replayId = digest(JSON.stringify([policy.audience, req.key.id, r.nonce]));
    if (consumeOnce(replayId, r.expiresAt) !== true) return fail('replay-or-ledger-unavailable');
    return Object.freeze({ allowed: true, subject: req.key.id, action: r.action, resource: r.resource,
      payloadDigest: r.payloadDigest, requestDigest: hash, policyRevision: policy.revision });
  } catch { return fail('malformed-or-unavailable'); }
}
