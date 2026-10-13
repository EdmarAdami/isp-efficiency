# Estado de desenvolvimento

## Implementado em código
- Landing page e telas de dashboard (dados demonstrativos)
- API NestJS com token de serviço de desenvolvimento e tenant configurado no servidor
- Consulta de findings persistidos por tenant
- Planejamento e ingestão básica de eventos no PostgreSQL
- Deduplicação por `tenantId + externalId` no banco
- Motor SUP-001, SUP-002 e SUP-003 (auditoria em memória)
- Testes unitários e GitHub Actions

## Limitações importantes
- A ingestão persiste atendimentos, mas **ainda não persiste findings**: o resultado da auditoria é somente prévia do lote.
- A auditoria em lote não considera eventos históricos persistidos de outros lotes.
- A deduplicação consulta antes de inserir; sob concorrência simultânea, o índice único impede duplicação mas a requisição pode falhar por conflito. Adicionar tratamento de conflitos/retry.
- Falta validação profunda de payload, rate limiting, OIDC, RBAC, auditoria de acesso e isolamento testado com banco real.
- **Não usar com dados reais nem expor a API publicamente.**

## Próximas prioridades
1. Validar CI e corrigir falhas.
2. Validar migrações e testes de integração com PostgreSQL.
3. Implementar processamento assíncrono idempotente de findings com deduplicação.
4. Autenticação de usuários e segurança de produção.
5. Dashboard autenticado conectado à API.
