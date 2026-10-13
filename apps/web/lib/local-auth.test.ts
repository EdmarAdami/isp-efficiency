import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import { verifyPassword, createAttemptLimiter, authorizeLocal } from './local-auth';
const password='test-only-long-password';
const salt='0123456789abcdef0123456789abcdef';
const hash='pbkdf2-sha256:600000:'+salt+':'+pbkdf2Sync(password,Buffer.from(salt,'hex'),600000,32,'sha256').toString('hex');
test('password verifier accepts correct password and rejects wrong or malformed values',async()=>{
  assert.equal(await verifyPassword(password,hash),true);
  assert.equal(await verifyPassword('wrong',hash),false);
  assert.equal(await verifyPassword(password,'plaintext-password'),false);
  assert.equal(await verifyPassword(password,hash.replace('600000','1')),false);
});
test('limiter caps attempts and expires after fifteen minutes',()=>{
  let now=0;
  const limiter=createAttemptLimiter(()=>now);
  for(let i=0;i<5;i++) assert.equal(limiter.allow(),true);
  assert.equal(limiter.allow(),false);
  now=15*60*1000;
  assert.equal(limiter.allow(),true);
  limiter.reset();
  assert.equal(limiter.allow(),true);
});
test('local login fails closed when missing configuration and never accepts another username',async()=>{
  const saved={...process.env};
  try {
    delete process.env.LOCAL_AUTH_USER;
    assert.equal(await authorizeLocal({username:'admin',password}),null);
    process.env.LOCAL_AUTH_USER='admin';process.env.LOCAL_AUTH_PASSWORD_HASH=hash;process.env.AUTH_SECRET='test-secret';
    assert.equal(await authorizeLocal({username:'other',password}),null);
    assert.equal(await authorizeLocal({username:'admin',password:'wrong'}),null);
    assert.equal((await authorizeLocal({username:'admin',password}))?.id,'local-admin');
  } finally {
    for(const key of ['LOCAL_AUTH_USER','LOCAL_AUTH_PASSWORD_HASH','AUTH_SECRET']) {
      if(saved[key]===undefined) delete process.env[key];else process.env[key]=saved[key];
    }
  }
});
