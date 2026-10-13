# Arquitetura inicial

## Monorepo
- `apps/web`: landing page e futuro dashboard Next.js
- `apps/api` (planejado): NestJS com APIs multi-tenant
- `packages/db` (planejado): Prisma/PostgreSQL
- Workers (planejado): BullMQ/Redis para ingestão e auditorias

## Entidades previstas
Tenant, User, Customer, Interaction, Journey, AuditRule, AuditRun, Finding, Evidence, CostModel, ActionPlan.

## Regras iniciais
- Recontato mesmo motivo em 7 dias
- Transferências excessivas por jornada
- Duplicidade de protocolos
- Visita potencialmente evitável (sempre requer validação)

## Segurança
Isolamento por tenant, RBAC, trilha de auditoria, minimização de dados pessoais, segredos fora do Git, LGPD.

## Próxima entrega
API, schema Prisma, seeds fictícios e testes automatizados das regras.
