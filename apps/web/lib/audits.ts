import 'server-only';

export type AuditFinding = {
  id: string;
  journeyId: string;
  ruleCode: string;
  status: string;
  estimatedCostCents: number;
  createdAt: string;
  evidence: unknown;
};
export type AuditResponse = { mode: 'database'; currency: 'BRL'; count: number; findings: AuditFinding[] };
export type AuditLoadResult = { ok: true; data: AuditResponse } | { ok: false; reason: 'unconfigured' | 'unavailable' };

export async function loadAudits(): Promise<AuditLoadResult> {
  const base = process.env.ISP_API_INTERNAL_URL;
  const token = process.env.ISP_API_SERVICE_TOKEN;
  if (!base || !token) return {ok:false,reason:'unconfigured'};
  try {
    const response = await fetch(new URL('/v1/audits',base), {
      headers: {Authorization: 'Bearer '+token},
      cache:'no-store',
      signal:AbortSignal.timeout(8000)
    });
    if (!response.ok) return {ok:false,reason:'unavailable'};
    const data: unknown = await response.json();
    if (!isAuditResponse(data)) return {ok:false,reason:'unavailable'};
    return {ok:true,data};
  } catch { return {ok:false,reason:'unavailable'}; }
}

function isAuditResponse(value: unknown): value is AuditResponse {
  if (!value || typeof value !== 'object') return false;
  const obj=value as Record<string,unknown>;
  return obj.mode==='database' && obj.currency==='BRL' && typeof obj.count==='number'
    && Array.isArray(obj.findings) && obj.findings.every((f:unknown)=>{
      if(!f || typeof f!=='object') return false;
      const x=f as Record<string,unknown>;
      return typeof x.id==='string' && typeof x.ruleCode==='string' && typeof x.status==='string'
        && typeof x.journeyId==='string' && typeof x.estimatedCostCents==='number' && typeof x.createdAt==='string';
    });
}
