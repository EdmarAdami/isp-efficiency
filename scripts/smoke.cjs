const assert = require('node:assert/strict');
(async () => {
  const web='http://127.0.0.1:3000';
  assert.equal((await fetch(web+'/login')).status,200);
  for (const path of ['/dashboard','/dashboard/auditorias/ao-vivo']) {
    const r=await fetch(web+path,{redirect:'manual'});
    assert.ok([302,303,307,308].includes(r.status));
    assert.ok(new URL(r.headers.get('location'),web).pathname.startsWith('/login'));
  }
  const api=process.env.ISP_API_INTERNAL_URL;
  assert.equal((await fetch(api+'/v1/audits')).status,401);
  const response=await fetch(api+'/v1/audits',{headers:{Authorization:'Bearer '+process.env.ISP_API_SERVICE_TOKEN}});
  assert.equal(response.status,200);
  assert.equal((await response.json()).mode,'database');
  console.log('Smoke OK: login, dashboard protegido, API rejeita acesso anônimo e consulta PostgreSQL.');
})().catch(e=>{console.error(e.message);process.exit(1)});
