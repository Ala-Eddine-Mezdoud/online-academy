'use client';

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export default function Input({ label, error, register, className = '', ...props }: InputProps) {
  const inputId = props.id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm text-[#9AA2AA] mb-2"
      >
        {label}
      </label>
      <input
        id={inputId}
        {...register}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={`
          w-full px-4 py-3 rounded-lg border
          ${error 
            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]' 
            : 'border-[rgba(16,24,40,0.06)] focus:border-[#19B7FF] focus:ring-2 focus:ring-[#19B7FF]/20'
          }
          bg-white text-[#30363A] text-base
          placeholder:text-[#9AA2AA]
          transition-all duration-200
          focus:outline-none
          ${className}
        `}
      />
      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-[#EF4444]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

