# Ingestão de atendimentos — contrato proposto

## Entrada normalizada
Cada evento deve conter `tenantId` (derivado da identidade autenticada), `externalId`, `customerId`, `journeyId`, `occurredAt` (ISO 8601), `reason`, `channel`, `costCents` e `transfers`.

## Semântica
- Deduplicar por `(tenantId, externalId)` de forma persistente, além da verificação no lote.
- Correlacionar jornadas somente dentro do mesmo tenant.
- Executar auditoria após persistência transacional, com processamento idempotente e reprocessamento seguro.
- Recontatos e transferências são oportunidades potenciais, não economias realizadas.
- Salvar origem, versão da regra, evidências, timestamps e histórico de decisão.
- Usar identificadores pseudonimizados e políticas de retenção.

## Estado atual
`planIngestion` implementa validação, deduplicação em memória e avaliação de regras em lote, com testes. **Ainda não grava eventos no PostgreSQL nem recebe dados por endpoint de produção.**

## Próxima implementação
1. Adicionar `externalId` com índice único composto ao schema e migração.
2. Criar ingestão autenticada com DTO validado e limites de lote.
3. Persistir eventos de forma idempotente.
4. Processar regras em worker assíncrono.
5. Expor estatísticas de ingestão e erros para observabilidade.
