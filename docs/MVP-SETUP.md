# Desenvolvimento local

1. Instale Node.js 22+ e Docker.
2. Execute `npm install` na raiz.
3. Execute `docker compose up -d`.
4. Copie `.env.example` para `.env` e configure `DATABASE_URL` no ambiente.
5. Execute `npm run db:generate -w @isp/db` e `npm run db:migrate -w @isp/db`.
6. Execute `npm run dev -w @isp/api` e `npm run dev -w @isp/web` em terminais separados.
7. Abra `http://localhost:3000`; teste `http://localhost:3001/v1/health` e `/v1/demo/audits`.
8. Execute `npm run test -w @isp/api`.

**Estado:** landing page e API demonstrativa. Não há autenticação, persistência na API, integração real ou ambiente de produção. Não exponha a API publicamente antes de implementar autenticação, autorização por tenant e validação de dados.
