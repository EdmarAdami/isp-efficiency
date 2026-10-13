import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { verifyTenantToken } from './tenant-context';
const token='a'.repeat(48);
test('valid token derives tenant from server configuration',()=>assert.deepEqual(verifyTenantToken('Bearer '+token,token,'tenant-1'),{tenantId:'tenant-1',role:'admin'}));
test('rejects invalid token',()=>assert.throws(()=>verifyTenantToken('Bearer wrong',token,'tenant-1')));
test('rejects unconfigured server',()=>assert.throws(()=>verifyTenantToken('Bearer '+token,undefined,'tenant-1')));
test('rejects short token configuration',()=>assert.throws(()=>verifyTenantToken('Bearer short','short','tenant-1')));
