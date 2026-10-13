import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';
import { AuditController } from './audits/audit.controller';
import { AuditService } from './audits/audit.service';
import { IngestController } from './audits/ingest.controller';
import { IngestService } from './audits/ingest.service';
import { demoAudit } from './rules/audit';
import { detectExcessiveTransfers } from './rules/quality';

@Controller('v1') class ApiController {
  @Get('health') health() { return { status: 'ok', service: 'isp-efficiency-api' }; }
  @Get('demo/audits') audits() {
    const base = demoAudit();
    return { ...base, rules: ['SUP-001', 'SUP-002', 'SUP-003'], qualityFindings: detectExcessiveTransfers([
      {id:'demo-transfer-1',tenantId:'demo',customerId:'ficticio',journeyId:'j-demo',occurredAt:'2026-10-02T10:00:00Z',reason:'connection',channel:'phone',costCents:800,transfers:3}
    ]) };
  }
}
@Module({ controllers: [ApiController, AuditController, IngestController], providers: [AuditService, IngestService] }) class AppModule {}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.WEB_ORIGIN || 'http://localhost:3000' });
  await app.listen(Number(process.env.PORT || 3001));
}
bootstrap();
