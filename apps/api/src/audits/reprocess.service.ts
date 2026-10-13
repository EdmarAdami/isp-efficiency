import {Injectable,OnModuleDestroy} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';
import {buildFindings} from './finding-engine';
@Injectable()
export class ReprocessService implements OnModuleDestroy {
  private readonly db=new PrismaClient();
  async reprocess(tenantId:string,journeyId:string) {
    if (!journeyId || journeyId.length>128) throw new Error('Invalid journey');
    const events=await this.db.interaction.findMany({where:{tenantId,journeyId},orderBy:{occurredAt:'asc'},take:500});
    if(events.length===500) throw new Error('Journey limit reached; implement pagination before processing');
    const customers=await this.db.customer.findMany({where:{tenantId,id:{in:[...new Set(events.map(e=>e.customerId))]}},select:{id:true,externalRef:true}});
    const externalRefs=new Map(customers.map(c=>[c.id,c.externalRef]));
    const normalized=events.map(e=>({id:e.id,tenantId:e.tenantId,customerId:externalRefs.get(e.customerId)??e.customerId,journeyId:e.journeyId,occurredAt:e.occurredAt.toISOString(),reason:e.reason,channel:e.channel,costCents:e.costCents,transfers:e.transfers}));
    const findings=buildFindings(normalized);
    await this.db.$transaction(async tx=>{
      for(const f of findings) await tx.finding.upsert({
        where:{fingerprint:f.fingerprint},
        create:{...f,status:'potential'},
        update:{estimatedCostCents:f.estimatedCostCents,evidence:f.evidence}
      });
    });
    return {mode:'persisted',journeyId,interactions:events.length,findings:findings.length,classification:'potential'};
  }
  async onModuleDestroy(){await this.db.$disconnect()}
}
