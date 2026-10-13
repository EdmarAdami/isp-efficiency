import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TenantGuard, type AuthenticatedRequest } from '../security/tenant.guard';
@Controller('v1/audits')
@UseGuards(TenantGuard)
export class AuditController {
  constructor(private readonly service: AuditService) {}
  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.service.list(request.tenantContext!.tenantId);
  }
}
