"""Smoke test using a private credential note; never logs its contents."""
import argparse
import http.cookiejar
import json
from pathlib import Path
import urllib.parse
import urllib.request

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://localhost:3080')
parser.add_argument('--credentials-file',default='.local-login')
args=parser.parse_args()
lines=Path(args.credentials_file).read_text().splitlines()
username=next(s.split(': ',1)[1] for s in lines if s.startswith('Usuário: '))
password=next(s.split(': ',1)[1] for s in lines if s.startswith('Senha: '))
jar=http.cookiejar.CookieJar()
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
def get(path):
    return client.open(args.url+path,timeout=15)
def post(path,values):
    csrf=json.load(get('/api/auth/csrf'))['csrfToken']
    values={**values,'csrfToken':csrf,'callbackUrl':args.url+'/dashboard'}
    request=urllib.request.Request(args.url+path,data=urllib.parse.urlencode(values).encode(),headers={'X-Auth-Return-Redirect':'1'})
    return client.open(request,timeout=15)
assert '/login' in get('/dashboard').geturl()
with post('/api/auth/callback/credentials',{'username':username,'password':'invalid-test-password'}) as response:
    assert 'error=' in json.load(response)['url']
assert not (json.load(get('/api/auth/session')) or {}).get('user')
with post('/api/auth/callback/credentials',{'username':username,'password':password}) as response:
    assert 'error=' not in json.load(response)['url']
assert json.load(get('/api/auth/session'))['user']['email']=='local-admin@isp.invalid'
for path in ['/dashboard','/dashboard/auditorias/ao-vivo']:
    response=get(path)
    assert response.status==200 and '/login' not in response.geturl()
post('/api/auth/signout',{}).close()
assert not (json.load(get('/api/auth/session')) or {}).get('user')
assert '/login' in get('/dashboard').geturl()
print('Login local OK: rejeição de senha incorreta, sessão válida, dashboard e auditorias acessíveis, logout bloqueia acesso.')
