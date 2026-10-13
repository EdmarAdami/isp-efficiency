const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
  const id = process.env.API_TENANT_ID;
  if (!id) throw new Error('API_TENANT_ID required');
  await db.tenant.upsert({ where: {id}, create: {id, name: process.env.TENANT_NAME || 'Provedor local'}, update: {} });
})().catch(() => { console.error('Tenant bootstrap failed'); process.exitCode=1; }).finally(() => db.$disconnect());
