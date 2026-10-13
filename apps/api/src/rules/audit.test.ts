import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { detectRecontacts, type Interaction } from './audit';
const base: Interaction = {id:'1',tenantId:'a',customerId:'c',journeyId:'j',occurredAt:'2026-10-01T00:00:00Z',reason:'fiber',channel:'phone',costCents:800,transfers:0};
test('flags a recontact and sums only additional cost',()=>{ const result=detectRecontacts([base,{...base,id:'2',occurredAt:'2026-10-03T00:00:00Z',costCents:500}]); assert.equal(result.length,1); assert.equal(result[0].estimatedCostCents,500); });
test('does not mix tenants',()=>{assert.equal(detectRecontacts([base,{...base,id:'2',tenantId:'b'}]).length,0)});
test('ignores recontacts outside window',()=>{assert.equal(detectRecontacts([base,{...base,id:'2',occurredAt:'2026-10-10T00:00:00Z'}]).length,0)});
test('does not mix distinct journeys',()=>{assert.equal(detectRecontacts([base,{...base,id:'2',journeyId:'j2'}]).length,0)});
