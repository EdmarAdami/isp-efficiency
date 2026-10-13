import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

const tenantId=process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID;
const allowedEmails=(process.env.ISP_ALLOWED_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);

export const { handlers, auth, signIn, signOut }=NextAuth({
  providers:[MicrosoftEntraID({
    clientId:process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    clientSecret:process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    issuer:tenantId?`https://login.microsoftonline.com/${tenantId}/v2.0`:undefined
  })],
  session:{strategy:'jwt'},
  pages:{signIn:'/login'},
  callbacks:{
    async signIn({profile,user}) {
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
