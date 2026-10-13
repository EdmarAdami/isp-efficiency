import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class AuditService implements OnModuleDestroy {
  private readonly db = new PrismaClient();
  async list(tenantId: string, take = 50) {
    const findings = await this.db.finding.findMany({
      where: { tenantId }, orderBy: { createdAt: 'desc' }, take: Math.min(Math.max(take,1),100),
      select: { id:true, journeyId:true, ruleCode:true, status:true, estimatedCostCents:true, evidence:true, createdAt:true }
    });
    return { mode:'database', currency:'BRL', findings, count:findings.length };
  }
  async onModuleDestroy() { await this.db.$disconnect(); }
}
