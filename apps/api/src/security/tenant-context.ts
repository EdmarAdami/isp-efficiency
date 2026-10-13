import { createHash, timingSafeEqual } from 'node:crypto';
export type TenantContext = { tenantId: string; role: 'admin' | 'auditor' | 'viewer' };
export function verifyTenantToken(authHeader: string | undefined, configuredToken: string | undefined, configuredTenant: string | undefined): TenantContext {
  if (!configuredToken || !configuredTenant || configuredToken.length < 32) throw new Error('Server authentication not configured');
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Missing bearer token');
  const supplied = authHeader.slice(7);
  const a = createHash('sha256').update(supplied).digest();
  const b = createHash('sha256').update(configuredToken).digest();
  if (!timingSafeEqual(a,b)) throw new Error('Invalid bearer token');
  return {tenantId: configuredTenant, role:'admin'};
}
