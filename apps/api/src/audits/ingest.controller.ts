import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TenantGuard, type AuthenticatedRequest } from '../security/tenant.guard';
import { IngestService } from './ingest.service';
import type { IngestEvent } from './ingestion';

@Controller('v1/ingestion')
@UseGuards(TenantGuard)
export class IngestController {
  constructor(private readonly service: IngestService) {}
  @Post('interactions')
  async ingest(@Req() request: AuthenticatedRequest, @Body() body: {events?: IngestEvent[]}) {
    if (!body || !Array.isArray(body.events) || body.events.length < 1 || body.events.length > 100) throw new BadRequestException('Expected 1-100 events');
    try { return await this.service.ingest(request.tenantContext!.tenantId,body.events); }
    catch(e) { if(e instanceof Error && /Batch|Tenant mismatch|Invalid|Missing/.test(e.message)) throw new BadRequestException(e.message); throw e; }
  }
}
