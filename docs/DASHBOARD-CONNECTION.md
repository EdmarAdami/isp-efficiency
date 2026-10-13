# Dashboard conectado à API — desenvolvimento

## Página
`/dashboard/auditorias/ao-vivo` consulta `GET /v1/audits` no servidor Next.js, sem expor o token ao navegador.

## Variáveis exclusivas do servidor web
- `ISP_API_INTERNAL_URL=http://localhost:3001`
- `ISP_API_SERVICE_TOKEN=<mesmo valor de API_SERVICE_TOKEN da API>`

Não usar prefixo `NEXT_PUBLIC_` para segredos. A API utiliza `API_TENANT_ID` configurado no servidor para delimitar os dados retornados.

## Segurança e limitações
- **Somente desenvolvimento local em rede confiável.** A página ainda não autentica usuários finais e não pode ser exposta publicamente.
- A resposta da API é filtrada por tenant, mas o token de serviço não substitui OIDC e RBAC.
- Não existe paginação na UI; a API limita a 50 registros por consulta.
- A página demonstra dados persistidos; a tela principal continua com indicadores fictícios explicitamente identificados.
- Falhas de conexão são mostradas como indisponibilidade, sem misturar com dados fictícios.

## Próximo passo
Implementar OIDC, RBAC, memberships por tenant e proxy server-side autorizado por usuário antes de produção.
