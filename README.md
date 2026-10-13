# ISP Efficiency

Plataforma SaaS de auditoria inteligente de suporte e atendimento para provedores de internet.

## Objetivo
Detectar desperdícios operacionais, correlacionar jornadas de atendimento e eventos de rede, estimar custos evitáveis e acompanhar economias comprovadas.

## MVP
- Landing page e dashboard executivo
- Ingestão de atendimentos com dados demonstrativos
- Auditoria de recontatos, transferências e visitas evitáveis
- Catálogo versionado de regras e evidências
- Planos de ação e métricas financeiras
- Adaptadores futuros para Lia, ERP/IXC e Zabbix

## Arquitetura proposta
Monorepo TypeScript: Next.js (web), NestJS (API), PostgreSQL/Prisma, Redis/BullMQ. Multi-tenant desde a modelagem inicial, RBAC e trilhas de auditoria.

## Princípios
Dados demonstrativos devem ser claramente identificados. Separar perda confirmada, suspeita e economia potencial; evitar dupla contagem. Aplicar minimização de dados, controle de acesso e retenção conforme LGPD.

## Desenvolvimento
A implementação será organizada em entregas incrementais com testes e revisão antes do merge na branch principal.
