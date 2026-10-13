import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';
import { demoAudit } from './rules/audit';
@Controller('v1') class ApiController {
  @Get('health') health() { return { status: 'ok', service: 'isp-efficiency-api' }; }
  @Get('demo/audits') audits() { return demoAudit(); }
}
@Module({ controllers: [ApiController] }) class AppModule {}
async function bootstrap() { const app = await NestFactory.create(AppModule); app.enableCors({origin: process.env.WEB_ORIGIN || 'http://localhost:3000'}); await app.listen(Number(process.env.PORT || 3001)); }
bootstrap();
