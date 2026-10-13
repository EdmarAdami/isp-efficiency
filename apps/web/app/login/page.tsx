import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { signIn } from '../../auth';
export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const params = await searchParams;
  const localEnabled = Boolean(process.env.LOCAL_AUTH_USER && process.env.LOCAL_AUTH_PASSWORD_HASH);
  const microsoftEnabled = Boolean(process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET && process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID);
  return <main className="wrap" style={{maxWidth:540,paddingTop:80}}>
    <a className="brand" href="/">ISP<span>Efficiency</span></a>
    <h1 style={{fontSize:42}}>Acesso administrativo</h1>
    <p>Entre para acessar o painel do seu provedor.</p>
    {params.error && <p role="alert">Não foi possível entrar. Confira usuário e senha. Após várias tentativas, aguarde 15 minutos.</p>}
    {localEnabled && <form action={async (formData:FormData)=>{
      'use server';
      try { await signIn('credentials',{username:formData.get('username'),password:formData.get('password'),redirectTo:'/dashboard'}); }
      catch(error) { if(error instanceof AuthError) redirect('/login?error=credentials'); throw error; }
    }} style={{display:'grid',gap:14}}>
      <label>Usuário<input name="username" autoComplete="username" required maxLength={128} style={{display:'block',width:'100%',padding:12,marginTop:6}} /></label>
      <label>Senha<input name="password" type="password" autoComplete="current-password" required maxLength={256} style={{display:'block',width:'100%',padding:12,marginTop:6}} /></label>
      <button className="button" type="submit">Entrar no painel</button>
    </form>}
    {microsoftEnabled && <form style={{marginTop:24}} action={async()=>{'use server';await signIn('microsoft-entra-id',{redirectTo:'/dashboard'});}}><button className="button" type="submit">Entrar com Microsoft</button></form>}
    {!localEnabled && !microsoftEnabled && <p>O acesso ainda não foi configurado pelo administrador.</p>}
    <p className="muted">Acesso restrito a usuários autorizados.</p>
  </main>;
}
