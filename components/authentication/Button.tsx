'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        w-full py-3 px-4 rounded-lg
        bg-[#0C86D8] text-white font-medium text-base
        transition-all duration-200
        hover:bg-[#0A6FB8] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-[#0C86D8]/50 focus:ring-offset-2
        ${className}
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

