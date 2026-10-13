import type { Interaction, Finding } from './audit';

export type QualityFinding = Finding & { category: 'duplicate-protocol' | 'excessive-transfer'; evidence: Record<string, unknown> };
/** SUP-002: exact duplicate events from the same source; avoids attributing customer fault. */
export function detectDuplicateProtocols(items: Interaction[]): QualityFinding[] {
  const groups = new Map<string, Interaction[]>();
  for (const item of items) {
    const key = JSON.stringify([item.tenantId, item.customerId, item.journeyId, item.id]);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const findings: QualityFinding[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const first = group[0];
    findings.push({ ruleId: 'SUP-002', tenantId: first.tenantId, journeyId: first.journeyId,
      interactionIds: group.map(x => x.id), estimatedCostCents: 0, status: 'potential',
      explanation: 'Possível duplicidade de ingestão/protocolo; custo zerado até reconciliação.',
      category: 'duplicate-protocol', evidence: { count: group.length } });
  }
  return findings;
}
/** SUP-003: transfer threshold is a configurable operational heuristic, not proof of waste. */
export function detectExcessiveTransfers(items: Interaction[], threshold = 2): QualityFinding[] {
  if (!Number.isInteger(threshold) || threshold < 0) throw new Error('Invalid threshold');
  return items.filter(x => Number.isInteger(x.transfers) && x.transfers > threshold).map(x => ({
    ruleId: 'SUP-003', tenantId: x.tenantId, journeyId: x.journeyId,
    interactionIds: [x.id], estimatedCostCents: 0, status: 'potential' as const,
    explanation: 'Transferências acima do limite configurado; custo requer medição de tempo adicional.',
    category: 'excessive-transfer' as const, evidence: { transfers: x.transfers, threshold }
  }));
}
