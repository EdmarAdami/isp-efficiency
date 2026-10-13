import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { planIngestion, type IngestEvent } from './ingestion';
const first: IngestEvent={externalId:'ext1',id:'int1',tenantId:'t1',customerId:'c1',journeyId:'j1',occurredAt:'2026-10-01T10:00:00Z',reason:'connection',channel:'phone',costCents:800,transfers:0};
test('deduplicates source events within batch',()=>{const result=planIngestion([first,{...first}]);assert.equal(result.accepted,1);assert.equal(result.duplicates,1)});
test('detects recontact from unique events',()=>{const result=planIngestion([first,{...first,id:'int2',externalId:'ext2',occurredAt:'2026-10-02T10:00:00Z'}]);assert.equal(result.findings.filter(x=>x.ruleId==='SUP-001').length,1)});
test('tenant-specific source IDs do not collide',()=>assert.equal(planIngestion([first,{...first,tenantId:'t2'}]).accepted,2));
test('rejects invalid financial values',()=>assert.throws(()=>planIngestion([{...first,costCents:-1}])));
