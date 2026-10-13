import type { Interaction } from '../rules/audit';
import { detectRecontacts } from '../rules/audit';
import { detectExcessiveTransfers } from '../rules/quality';

export type IngestEvent = Interaction & { externalId: string };
export type IngestResult = { accepted: number; duplicates: number; findings: ReturnType<typeof detectRecontacts> };
/** Pure ingestion plan: deduplicate events within a batch, then evaluate rules. */
export function planIngestion(events: IngestEvent[]): IngestResult {
  const seen = new Set<string>();
  const unique: IngestEvent[] = [];
  let duplicates = 0;
  for (const event of events) {
    if (!event.tenantId || !event.externalId || !event.customerId || !event.journeyId) throw new Error('Missing required identifiers');
    if (!Number.isFinite(Date.parse(event.occurredAt))) throw new Error('Invalid date');
    if (!Number.isSafeInteger(event.costCents) || event.costCents < 0) throw new Error('Invalid cost');
    if (!Number.isSafeInteger(event.transfers) || event.transfers < 0) throw new Error('Invalid transfers');
    const key = JSON.stringify([event.tenantId, event.externalId]);
    if (seen.has(key)) { duplicates++; continue; }
    seen.add(key);
    unique.push(event);
  }
  return { accepted: unique.length, duplicates, findings: [
    ...detectRecontacts(unique), ...detectExcessiveTransfers(unique)
  ] };
}
