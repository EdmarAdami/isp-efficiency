import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '../../auth';
import './dashboard.css';
export default async function DashboardLayout({children}:{children:ReactNode}) {
  const session=await auth();
  if(!session?.user?.email) redirect('/login');
  return <><header style={{background:'#091e34',color:'white',padding:'12px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span>Conectado como {session.user.name || session.user.email}</span>
    <form action={async()=>{'use server';await signOut({redirectTo:'/login'});}}><button type="submit" className="button">Sair</button></form>
  </header>{children}</>;
}
