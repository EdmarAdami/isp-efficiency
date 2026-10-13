import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import './dashboard.css';
export default async function DashboardLayout({children}:{children:ReactNode}) {
  const session=await auth();
  if(!session?.user?.email) redirect('/login');
  return children;
}
