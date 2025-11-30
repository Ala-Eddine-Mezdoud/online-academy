'use client';

import { ReactNode } from 'react';

interface AuthPageLayoutProps {
  mobileTitle?: ReactNode;
  children: ReactNode;
  formOrder?: 'left' | 'right';
}

export default function AuthPageLayout({ 
  mobileTitle,
  children, 
  formOrder = 'left',
}: AuthPageLayoutProps) {
  const gridCols = formOrder === 'left' 
    ? 'lg:grid-cols-[40%_60%]'
    : 'lg:grid-cols-[60%_40%]';

  return (
    <div className="h-screen bg-[#F7F9FB] flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="w-full max-w-7xl h-full flex flex-col lg:flex-row items-center justify-center">
        {mobileTitle}
        <div className={`grid grid-cols-1 ${gridCols} gap-0 lg:gap-0 items-center w-full h-full`}>
          {children}
        </div>
      </div>
    </div>
  );
}
