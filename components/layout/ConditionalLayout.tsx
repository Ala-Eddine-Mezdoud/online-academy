'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' ;
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage || isAuthPage) {
    return <>{children}</>;
  } 

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>

       <Footer />
    </>
  );
}

