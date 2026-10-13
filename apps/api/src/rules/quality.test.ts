import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { detectDuplicateProtocols, detectExcessiveTransfers } from './quality';
import type { Interaction } from './audit';
const item: Interaction = { id:'protocol-1',tenantId:'tenant-a',customerId:'customer-1',journeyId:'journey-1',occurredAt:'2026-10-01T10:00:00Z',reason:'connection',channel:'phone',costCents:900,transfers:3 };
test('transfer alert is potential and has no invented monetary savings',()=>{const result=detectExcessiveTransfers([item]);assert.equal(result.length,1);assert.equal(result[0].estimatedCostCents,0);assert.equal(result[0].status,'potential')});
test('threshold is configurable',()=>assert.equal(detectExcessiveTransfers([item],3).length,0));
test('duplicate protocol is flagged without double counting',()=>{const result=detectDuplicateProtocols([item,{...item}]);assert.equal(result.length,1);assert.equal(result[0].estimatedCostCents,0)});
test('identical protocol IDs across tenants are not duplicates',()=>assert.equal(detectDuplicateProtocols([item,{...item,tenantId:'tenant-b'}]).length,0));
