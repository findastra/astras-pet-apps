import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, sign, createHash } from 'node:crypto';
import { authorizeOperation, requestDigest } from '../scripts/access-policy-20261014.mjs';

function fixture(action = 'source.merge') {
  const pairs = new Map();
  const keys = ['maker','owner','r1','r2','r3','r4'].map(id => {
    const pair = generateKeyPairSync('ed25519'); pairs.set(id, pair);
    return { id, controller:id, role:id === 'maker' ? 'agent' : id === 'owner' ? 'owner' : 'reviewer', publicKey:pair.publicKey.export({type:'spki',format:'pem'}) };
  });
  const payload = Buffer.from('exact proposed change, base revision and target version');
  const policy = { audience:'farm-test', revision:'v1', keys, grants:[{subject:'maker',action,resource:'repo:core'}] };
  const now = 1000000, seen = new Set();
  const host = { now, revoked:new Set(), consumeOnce:id => seen.has(id) ? false : (seen.add(id), true) };
  const signed = (id, kind, fields) => {
    const body = JSON.stringify({kind,audience:policy.audience,policyRevision:policy.revision,expiresAt:now+60000,...fields});
    return {keyId:id,body,signature:sign(null,Buffer.from(body),pairs.get(id).privateKey).toString('base64')};
  };
  const request = signed('maker','request',{nonce:'request-1',action,resource:'repo:core',payloadDigest:createHash('sha256').update(payload).digest('hex')});
  const fields = { requestDigest:requestDigest(request), decision:'approve' };
  const bundle = { request, approval:signed('owner','approval',fields), reviews:['r1','r2','r3','r4'].map(id => signed(id,'review',fields)) };
  return {bundle,payload,policy,host,signed,fields,pairs,run:() => authorizeOperation(bundle,payload,policy,host)};
}

test('exact scoped change with owner approval and four independent signatures passes once', () => {
  const f=fixture(); assert.equal(f.run().allowed,true); assert.equal(f.run().allowed,false);
});
test('low risk read requires its own exact grant and authenticated request, no review quorum', () => {
  const f=fixture('status.read'); f.bundle.approval=null; f.bundle.reviews=[]; assert.equal(f.run().allowed,true);
});
for (const [name, attack] of [
  ['claimed human role', f => { const r=JSON.parse(f.bundle.request.body); r.role='owner'; f.bundle.request=f.signed('maker','request',r); }],
  ['swapped signer identity', f => { f.bundle.request.keyId='owner'; }],
  ['AI signs owner approval', f => { f.bundle.approval=f.signed('maker','approval',f.fields); }],
  ['four reviews without owner', f => { f.bundle.approval=null; }],
  ['repeated reviewer', f => { f.bundle.reviews=Array(4).fill(f.bundle.reviews[0]); }],
  ['same controller with different keys', f => { f.policy.keys[3].controller='r1'; }],
  ['same key with different names', f => { f.policy.keys[3].publicKey=f.policy.keys[2].publicKey; }],
  ['maker controls reviewer', f => { f.policy.keys[2].controller='maker'; }],
  ['owner controls maker', f => { f.policy.keys[1].controller='maker'; }],
  ['missing reviewer', f => { f.bundle.reviews.pop(); }],
  ['reviewer rejects', f => { f.bundle.reviews[0]=f.signed('r1','review',{...f.fields,decision:'deny'}); }],
  ['changed payload after approval', f => { f.payload[0]=0; }],
  ['changed target after review', f => { f.bundle.request=f.signed('maker','request',{...JSON.parse(f.bundle.request.body),resource:'repo:other'}); }],
  ['foreign farm', f => { f.policy.audience='other'; }],
  ['stale policy', f => { f.policy.revision='v2'; }],
  ['expired request', f => { f.host.now+=60000; }],
  ['revoked maker', f => { f.host.revoked.add('maker'); }],
  ['revoked reviewer', f => { f.host.revoked.add('r4'); }],
  ['ungranted action', f => { f.policy.grants=[]; }],
  ['unknown shell action', f => { f.bundle.request=f.signed('maker','request',{...JSON.parse(f.bundle.request.body),action:'shell.execute'}); }],
  ['ledger failure', f => { f.host.consumeOnce=()=>{throw Error('offline');}; }],
  ['asynchronous ledger', f => { f.host.consumeOnce=async()=>true; }],
  ['untrusted extra bundle claims', f => { f.bundle.humanApproved=true; }],
  ['duplicate enrolled identity', f => { f.policy.keys.push(f.policy.keys[0]); }],
]) test(`deny ${name}`, () => { const f=fixture(); attack(f); assert.equal(f.run().allowed,false); });
test('missing authenticated host context denies', () => {
  const f=fixture(); assert.equal(authorizeOperation(f.bundle,f.payload,f.policy).allowed,false);
});
for (const alias of ['owner','r2']) test(`valid signatures with shared ${alias} key are rejected as invalid enrollment`, () => {
  const f=fixture(), original=alias==='owner'?'maker':'r1';
  f.policy.keys.find(k=>k.id===alias).publicKey=f.policy.keys.find(k=>k.id===original).publicKey;
  f.pairs.set(alias,f.pairs.get(original));
  if(alias==='owner') f.bundle.approval=f.signed(alias,'approval',f.fields);
  else f.bundle.reviews[1]=f.signed(alias,'review',f.fields);
  assert.equal(f.run().reason,'duplicate-enrolled-key');
});
test('old approval cannot authorize another otherwise granted target', () => {
  const f=fixture(); f.policy.grants.push({subject:'maker',action:'source.merge',resource:'repo:other'});
  f.bundle.request=f.signed('maker','request',{...JSON.parse(f.bundle.request.body),resource:'repo:other'});
  assert.equal(f.run().reason,'independent-owner-approval-required');
});
test('even a valid re-signed whitespace change requires new approval', () => {
  const f=fixture(); f.bundle.request.body+=' ';
  f.bundle.request.signature=sign(null,Buffer.from(f.bundle.request.body),f.pairs.get('maker').privateKey).toString('base64');
  assert.equal(f.run().reason,'independent-owner-approval-required');
});
test('new policy and signatures do not revive a consumed nonce', () => {
  const f=fixture(); assert.equal(f.run().allowed,true); f.policy.revision='v2';
  f.bundle.request=f.signed('maker','request',{...JSON.parse(f.bundle.request.body),policyRevision:'v2'});
  const fields={...f.fields,requestDigest:requestDigest(f.bundle.request)};
  f.bundle.approval=f.signed('owner','approval',fields);
  f.bundle.reviews=['r1','r2','r3','r4'].map(id=>f.signed(id,'review',fields));
  assert.equal(f.run().reason,'replay-or-ledger-unavailable');
});
for(const action of ['policy.change','agent.resume']) test(`${action} requires owner and quorum`,()=>{
  const f=fixture(action); f.bundle.approval=null; assert.equal(f.run().allowed,false);
});
test('denials do not consume authorization',()=>{
  const f=fixture(); let called=false; f.host.consumeOnce=()=>{called=true;return true;};
  f.host.revoked.add('owner'); assert.equal(f.run().allowed,false); assert.equal(called,false);
});
for(const [id,kind,index] of [['owner','approval',null],['r1','review',0]]) test(`expired ${kind} denies even with a fresh request`,()=>{
  const f=fixture(); const e=f.signed(id,kind,{...f.fields,expiresAt:f.host.now});
  if(index===null) f.bundle.approval=e; else f.bundle.reviews[index]=e;
  assert.equal(f.run().allowed,false);
});
test('request expiry may be at most five minutes away',()=>{
  const f=fixture('status.read'); f.bundle.request=f.signed('maker','request',{...JSON.parse(f.bundle.request.body),expiresAt:f.host.now+300001});
  assert.equal(f.run().allowed,false);
});
