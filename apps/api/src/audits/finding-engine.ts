import { createHash } from 'node:crypto';
import type { Interaction } from '../rules/audit';
import { detectRecontacts } from '../rules/audit';
import { detectExcessiveTransfers } from '../rules/quality';
export type PersistableFinding = { tenantId:string; journeyId:string; ruleCode:string; fingerprint:string; estimatedCostCents:number; evidence:Record<string,unknown> };
export function buildFindings(interactions: Interaction[]): PersistableFinding[] {
  const source = [...detectRecontacts(interactions),...detectExcessiveTransfers(interactions)];
  return source.map(f=>{
    const ids=[...new Set(f.interactionIds)].sort();
    const fingerprint=createHash('sha256').update(JSON.stringify([f.tenantId,f.ruleId,f.journeyId,ids])).digest('hex');
    return {tenantId:f.tenantId,journeyId:f.journeyId,ruleCode:f.ruleId,fingerprint,estimatedCostCents:f.estimatedCostCents,
      evidence:{interactionIds:ids,ruleVersion:1,classification:'potential',explanation:f.explanation}};
  });
}
