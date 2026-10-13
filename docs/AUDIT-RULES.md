# Catálogo de regras de auditoria — MVP

| Código | Regra | Resultado | Custo |
| --- | --- | --- | --- |
| SUP-001 | Recontato na mesma jornada, motivo e cliente, em até 7 dias | Oportunidade potencial | Soma dos contatos adicionais (não é economia confirmada) |
| SUP-002 | Protocolo duplicado na ingestão | Suspeita de duplicidade | Zero até reconciliação |
| SUP-003 | Transferências acima do limite | Oportunidade potencial | Zero até apuração de tempo incremental |

## Controles obrigatórios
- O identificador de tenant deve vir de autenticação confiável, jamais de um parâmetro livre do cliente.
- Todas as consultas devem aplicar isolamento de tenant.
- Uma mesma despesa não pode ser atribuída duas vezes a regras diferentes.
- Oportunidades potenciais não podem ser somadas à economia realizada.
- Cada finding deve registrar regra, versão, dados de origem, timestamps, evidências e decisão do auditor.
- Não coletar transcrições ou dados pessoais reais antes de implementar autorização, retenção e controles LGPD.

## Critérios de aceite
1. Recontatos de provedores diferentes não se correlacionam.
2. Recontatos fora da janela configurada não geram findings.
3. Duplicatas de ingestão não produzem economia fictícia.
4. Alertas de transferência não presumem economia sem tempo e custo medidos.
5. Testes automatizados devem executar no CI.
