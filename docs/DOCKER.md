# Docker — instalação privada por provedor

Este compose publica somente a interface em `127.0.0.1:3000`. API, PostgreSQL e Redis ficam sem portas publicadas, em rede interna. Cada instalação atende um único provedor, definido por `API_TENANT_ID`; o modelo atual não oferece seleção multiempresa nem permissões por função. Redis está disponível para trabalho futuro; não há worker BullMQ implementado.

## Primeira instalação

```sh
python3 scripts/init-docker-env.py
docker compose --env-file .env.docker -f compose.production.yml up --build -d --wait
```

O gerador cria senha do banco, token da API, segredo Auth.js e UUID do provedor, com arquivo de modo 0600. Não sobrescreve arquivo existente. Não publique nem envie `.env.docker`, logs completos ou a saída de `docker compose config`, que pode conter segredos. Use valores hexadecimais na senha PostgreSQL para compatibilidade com a URL.

As imagens são compiladas em múltiplos estágios; os processos web e API executam como usuário sem privilégios. A migração usa `prisma migrate deploy` e precisa terminar antes da API. Volumes preservam o banco e o Redis.

## Habilitar acesso Microsoft

Preencha localmente `.env.docker` com os identificadores e segredo do aplicativo Entra ID e os e-mails permitidos. Registre o callback `http://localhost:3000/api/auth/callback/microsoft-entra-id`. O acesso ao dashboard permanece bloqueado sem essa configuração. Nunca passe segredos pela conversa ou pelo Git.

Recrie o web após editar:

```sh
docker compose --env-file .env.docker -f compose.production.yml up -d --force-recreate web
```

Após as migrações, o inicializador cria o provedor com o UUID configurado, de forma idempotente. Configure `TENANT_NAME` para seu nome. Não há cadastro público. Nenhum dado de demonstração é inserido automaticamente.

## Operação

```sh
docker compose --env-file .env.docker -f compose.production.yml ps
docker compose --env-file .env.docker -f compose.production.yml stop
docker compose --env-file .env.docker -f compose.production.yml up -d --wait
```

Antes de atualizar, faça backup PostgreSQL com `pg_dump`, guarde em local protegido e teste a restauração. Faça backup de `.env.docker` em gerenciador de segredos. Não use `down -v`: isso remove os dados. Uma reversão de imagem não reverte migrações; examine compatibilidade antes de atualizar bancos existentes. A migração inicial destina-se a banco novo; banco preexistente exige baseline revisado.

## Servidor remoto

Para outro host, informe apenas endereço/alias SSH, usuário, porta e caminho de instalação. Configure chave SSH ou acesso pelo gerenciador seguro fora do chat. Use túnel SSH/VPN para acesso privado. Não altere o bind para `0.0.0.0` sem configurar HTTPS, proxy confiável e validar autenticação e isolamento. Login Entra de ponta a ponta requer as credenciais do seu aplicativo configuradas localmente.

## Limitação de segurança

A auditoria de dependências identificou vulnerabilidades que exigem atualizar versões principais ou revisar dependências transitivas. Esta implantação é restrita a localhost; a liberação pública permanece pendente dessa revisão e de validação do login real.

Referências: [Next.js standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [ordem de inicialização do Compose](https://docs.docker.com/compose/how-tos/startup-order/).

## Login local sem Microsoft

Uma conta administrativa por instalação pode entrar com usuário e senha sem Entra. O serviço armazena somente hash PBKDF2-SHA256 com sal aleatório e 600.000 iterações. Para escolher uma senha, execute em terminal privado:

```sh
python3 scripts/configure-local-login.py --user admin
docker compose --env-file .env.docker -f compose.production.yml up --build -d --wait web
```

O prompt oculta a senha. Para gerar uma senha aleatória, adicione `--generate`; ela será salva apenas em `.local-login` (permissões 0600, ignorado no Git). Guarde em gerenciador de senhas e remova esse arquivo após salvar. Não envie senhas no chat.

Abra `/login`, entre e o sistema direcionará ao dashboard. Há limite de cinco tentativas por quinze minutos, compartilhado pelo administrador deste processo. Essa proteção pressupõe uma única instância local; antes de usar réplicas, implemente limitador persistido em Redis. A sessão dura oito horas. Trocar a senha invalida sessões locais após recriar o serviço. Para desativar o login local, remova `LOCAL_AUTH_USER` e `LOCAL_AUTH_PASSWORD_HASH` e recrie o web. Não há cadastro aberto nem recuperação de senha por e-mail. O login Microsoft continua disponível quando configurado.

Referência: [Credentials no Auth.js](https://authjs.dev/getting-started/authentication/credentials).
