import {test} from 'node:test';
import assert from 'node:assert/strict';
import {syncProfile} from '../scripts/farmer-profile-20261009.mjs';
test('daily profile rounds preserve an explicitly managed Goldfish draft verbatim',()=>{
  const text='Header\n<!-- findastra-readme-auditor: managed -->\n### PetOS\nReviewed content\n';
  assert.deepEqual(syncProfile(text,{pets:[]},[{name:'a-new-repo',description:'New'}]),{text,changes:[]});
});
test('unmanaged profiles retain the existing automatic update behavior',()=>{
  const text='Header\n### PetOS\n\n### Web & More\n';
  const result=syncProfile(text,{pets:[]},[{name:'a-new-repo',description:'New'}]);
  assert.match(result.text,/a-new-repo/);assert.ok(result.changes.length);
});
