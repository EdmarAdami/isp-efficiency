# Autenticação Microsoft Entra ID — primeira implementação

O frontend usa Auth.js/NextAuth com Microsoft Entra ID, sessão JWT e middleware protegendo `/dashboard/*`.

## Configuração
Registre um aplicativo web no Microsoft Entra ID (single tenant), com redirect URI `http://localhost:3000/api/auth/callback/microsoft-entra-id` para desenvolvimento.

Configure exclusivamente no servidor:
- `AUTH_SECRET` (segredo aleatório forte)
- `AUTH_URL=http://localhost:3000`
- `AUTH_MICROSOFT_ENTRA_ID_ID` (client ID)
- `AUTH_MICROSOFT_ENTRA_ID_SECRET` (client secret)
- `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` (tenant GUID)
- `ISP_ALLOWED_EMAILS` (emails explicitamente autorizados, separados por vírgula)

## Limites de segurança
- Login é fail-closed: sem tenant, credenciais ou allowlist, não permite acesso.
- O frontend não expõe o token da API no navegador.
- A API ainda usa token de serviço de desenvolvimento e um tenant fixo. **Login Microsoft não implementa RBAC nem multi-tenancy completo.**
- É obrigatório implementar membership tenant↔usuário no banco, roles e autorização em todas as rotas e APIs antes de produção.
- Proteja segredos em um cofre, habilite MFA/Conditional Access e evite dados pessoais reais nesta fase.
