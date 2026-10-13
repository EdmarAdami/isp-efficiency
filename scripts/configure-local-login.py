"""Create/rotate one local administrator without logging its password."""
from pathlib import Path
import argparse
import getpass
import hashlib
import os
import secrets
import re

parser = argparse.ArgumentParser()
parser.add_argument('--generate', action='store_true')
parser.add_argument('--user', default='admin')
parser.add_argument('--credentials-file', default='.local-login')
args = parser.parse_args()
if not re.fullmatch(r'[A-Za-z0-9_.@-]{1,128}', args.user):
    raise SystemExit('Usuário inválido.')
env = Path('.env.docker')
if not env.exists():
    raise SystemExit('Crie .env.docker antes de configurar o login.')
if args.generate:
    password = secrets.token_urlsafe(24)
else:
    password = getpass.getpass('Nova senha (mínimo 16 caracteres): ')
    if password != getpass.getpass('Confirme a senha: '):
        raise SystemExit('Senhas não coincidem.')
if not 16 <= len(password) <= 256:
    raise SystemExit('Use de 16 a 256 caracteres.')
salt = secrets.token_bytes(16)
digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 600000).hex()
encoded = 'pbkdf2-sha256:600000:' + salt.hex() + ':' + digest
lines = [s for s in env.read_text().splitlines() if not s.startswith(('LOCAL_AUTH_USER=', 'LOCAL_AUTH_PASSWORD_HASH='))]
lines += ['LOCAL_AUTH_USER=' + args.user, 'LOCAL_AUTH_PASSWORD_HASH=' + encoded]
if args.generate:
    # Exclusive creation prevents accidentally replacing an existing credential note.
    fd = os.open(args.credentials_file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as f:
        f.write('Usuário: ' + args.user + '\nSenha: ' + password + '\n')
env.chmod(0o600)
env.write_text('\n'.join(lines) + '\n')
print('Login local configurado. Recrie o serviço web para aplicar.')
