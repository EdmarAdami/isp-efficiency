import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { planIngestion, type IngestEvent } from './ingestion';

@Injectable()
export class IngestService implements OnModuleDestroy {
  private readonly db = new PrismaClient();
  async ingest(tenantId: string, events: IngestEvent[]) {
    if (!Array.isArray(events) || events.length > 100 || events.length === 0) throw new Error('Batch must contain 1-100 events');
    if (events.some(e=>e.tenantId!==tenantId)) throw new Error('Tenant mismatch');
    const plan = planIngestion(events);
    const seen = new Set<string>();
    let persisted = 0;
    await this.db.$transaction(async tx => {
      for (const event of events) {
        if (seen.has(event.externalId)) continue;
        seen.add(event.externalId);
        const existing = await tx.interaction.findUnique({where:{tenantId_externalId:{tenantId,externalId:event.externalId}},select:{id:true}});
        if (existing) continue;
        const customer = await tx.customer.upsert({
          where:{tenantId_externalRef:{tenantId,externalRef:event.customerId}},
          create:{tenantId,externalRef:event.customerId},
          update:{}
        });
        await tx.interaction.create({data:{
          tenantId,externalId:event.externalId,customerId:customer.id,journeyId:event.journeyId,
          occurredAt:new Date(event.occurredAt),reason:event.reason,channel:event.channel,
          costCents:event.costCents,transfers:event.transfers
        }});
        persisted++;
      }
    });
    return {accepted:plan.accepted,persisted,duplicatesInBatch:plan.duplicates,alreadyStored:plan.accepted-persisted,
      auditPreview:plan.findings,mode:'audit-preview-not-persisted'};
  }
  async onModuleDestroy() { await this.db.$disconnect(); }
}
