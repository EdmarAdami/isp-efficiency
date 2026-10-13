from pathlib import Path
import secrets
import uuid
import os
p = Path('.env.docker')
fd = os.open(p, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, 'w') as f:
    f.write('POSTGRES_PASSWORD=' + secrets.token_hex(32) + '\nAPI_SERVICE_TOKEN=' + secrets.token_hex(32) + '\nAUTH_SECRET=' + secrets.token_hex(32) + '\nAPI_TENANT_ID=' + str(uuid.uuid4()) + '\nWEB_PORT=3000\nAUTH_MICROSOFT_ENTRA_ID_ID=\nAUTH_MICROSOFT_ENTRA_ID_SECRET=\nAUTH_MICROSOFT_ENTRA_ID_TENANT_ID=\nISP_ALLOWED_EMAILS=\n')
print('Arquivo .env.docker criado com permissões restritas; login bloqueado até configurar Entra.')
