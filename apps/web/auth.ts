import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authorizeLocal } from './lib/local-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

const tenantId=process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID;
const allowedEmails=(process.env.ISP_ALLOWED_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);

export const { handlers, auth, signIn, signOut }=NextAuth({
  providers:[Credentials({
    credentials:{username:{label:'Usuário',type:'text'},password:{label:'Senha',type:'password'}},
    authorize:authorizeLocal
  }), MicrosoftEntraID({
    clientId:process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    clientSecret:process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    issuer:tenantId?`https://login.microsoftonline.com/${tenantId}/v2.0`:undefined
  })],
  session:{strategy:'jwt',maxAge:8*60*60},
  pages:{signIn:'/login'},
  callbacks:{
    jwt({token,account}) {
      if(account) {
        token.authProvider=account.provider;
        if(account.provider==='credentials') token.localAuthVersion=process.env.LOCAL_AUTH_PASSWORD_HASH;
      }
      return token;
    },
    session({session,token}) {
      if(token.authProvider==='credentials' && (!process.env.LOCAL_AUTH_USER || !process.env.LOCAL_AUTH_PASSWORD_HASH || token.localAuthVersion!==process.env.LOCAL_AUTH_PASSWORD_HASH)) {
        return {...session,user:{...session.user,email:null}};
      }
      return session;
    },
    async signIn({profile,user,account}) {
      if(account?.provider==='credentials') return user.id==='local-admin' && Boolean(process.env.LOCAL_AUTH_USER && process.env.LOCAL_AUTH_PASSWORD_HASH && process.env.AUTH_SECRET);
      if(!tenantId || !process.env.AUTH_SECRET || !process.env.AUTH_MICROSOFT_ENTRA_ID_ID || !process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) return false;
      const email=(user.email||'').toLowerCase();
      const claims=profile as Record<string,unknown>|undefined;
      const issuer=claims?.iss;
      const issuerExpected=`https://login.microsoftonline.com/${tenantId}/v2.0`;
      return issuer===issuerExpected && allowedEmails.length>0 && allowedEmails.includes(email);
    },
    authorized({auth,request}) {
      if(request.nextUrl.pathname.startsWith('/dashboard')) return Boolean(auth?.user?.email);
      return true;
    }
  }
});
