'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' ;
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  } 

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="min-h-screen">{children}</main>

      {!isAuthPage && <Footer />}
    </>
  );
}

