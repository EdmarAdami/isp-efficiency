# Pipeline de auditoria persistida — primeira versão

1. POST /v1/ingestion/interactions grava atendimentos normalizados.
2. POST /v1/audits/reprocess com `{"journeyId":"..."}` lê todos os eventos persistidos dessa jornada, limitados a 499.
3. O motor calcula SUP-001 e SUP-003 e gera fingerprints determinísticos.
4. O Prisma executa upsert dos findings; GET /v1/audits lista os resultados por tenant.

## Limitações
- O reprocessamento é acionado manualmente por endpoint, não por fila assíncrona.
- O token de serviço é somente para desenvolvimento e não há autenticação de usuário final.
- Não existe migração versionada aplicada a um banco real.
- Findings que deixam de corresponder a uma regra após atualização de eventos não são removidos automaticamente.
- A implementação não calcula economia realizada e não oferece validação humana.
- O endpoint de demonstração permanece separado dos dados persistidos.
- O processamento limita jornadas a 499 eventos para evitar resultados incompletos.

## Critérios para produção
OIDC, RBAC, autorização por tenant, validação forte de payload, ingestão idempotente sob concorrência, fila de workers, versionamento de regras, revisão humana, retenção LGPD e testes de integração.
