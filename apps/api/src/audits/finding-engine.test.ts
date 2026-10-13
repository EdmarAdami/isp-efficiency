import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {buildFindings} from './finding-engine';
import type {Interaction} from '../rules/audit';
const base:Interaction={id:'i1',tenantId:'t1',customerId:'c1',journeyId:'j1',occurredAt:'2026-10-01T10:00:00Z',reason:'connection',channel:'phone',costCents:800,transfers:0};
test('same input generates stable fingerprint',()=>{const data=[base,{...base,id:'i2',occurredAt:'2026-10-02T10:00:00Z'}];assert.equal(buildFindings(data)[0].fingerprint,buildFindings(data)[0].fingerprint)});
test('tenant changes fingerprint',()=>{const data=[base,{...base,id:'i2',occurredAt:'2026-10-02T10:00:00Z'}];const alt=data.map(x=>({...x,tenantId:'t2'}));assert.notEqual(buildFindings(data)[0].fingerprint,buildFindings(alt)[0].fingerprint)});
test('transfer alert has zero assumed savings',()=>{const f=buildFindings([{...base,transfers:4}]);assert.equal(f[0].estimatedCostCents,0)});
