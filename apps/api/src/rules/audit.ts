export type Interaction = { id: string; tenantId: string; customerId: string; journeyId: string; occurredAt: string; reason: string; channel: string; costCents: number; transfers: number };
export type Finding = { ruleId: string; tenantId: string; journeyId: string; interactionIds: string[]; estimatedCostCents: number; status: 'potential'; explanation: string };
/** Demonstration only. Does not treat every recontact as an avoidable expense. */
export function detectRecontacts(items: Interaction[], windowDays = 7): Finding[] {
  const groups = new Map<string, Interaction[]>();
  for (const item of items) {
    if (!Number.isFinite(Date.parse(item.occurredAt)) || !Number.isInteger(item.costCents) || item.costCents < 0) throw new Error('Invalid interaction');
    const key = JSON.stringify([item.tenantId, item.customerId, item.journeyId, item.reason]);
    groups.set(key, [...(groups.get(key) || []), item]);
  }
  const findings: Finding[] = [];
  for (const group of groups.values()) {
    group.sort((a,b)=>Date.parse(a.occurredAt)-Date.parse(b.occurredAt));
    const initial = group[0];
    const duplicates = group.slice(1).filter(x => Date.parse(x.occurredAt)-Date.parse(initial.occurredAt) <= windowDays*86400000);
    if (duplicates.length) findings.push({ruleId:'SUP-001',tenantId:initial.tenantId,journeyId:initial.journeyId,interactionIds:duplicates.map(x=>x.id),estimatedCostCents:duplicates.reduce((s,x)=>s+x.costCents,0),status:'potential',explanation:'Recontatos relacionados à mesma jornada em até '+windowDays+' dias; requer validação de evitabilidade.'});
  }
  return findings;
}
export function demoAudit() {
  const interactions: Interaction[] = [
    {id:'int-1',tenantId:'demo',customerId:'cliente-ficticio-1',journeyId:'j-1',occurredAt:'2026-10-01T10:00:00Z',reason:'sem-conexao',channel:'phone',costCents:840,transfers:0},
    {id:'int-2',tenantId:'demo',customerId:'cliente-ficticio-1',journeyId:'j-1',occurredAt:'2026-10-03T10:00:00Z',reason:'sem-conexao',channel:'whatsapp',costCents:500,transfers:1}
  ];
  return {mode:'demonstration',currency:'BRL',interactions:interactions.length,findings:detectRecontacts(interactions)};
}
