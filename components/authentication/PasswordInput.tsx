'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
  showStrengthMeter?: boolean;
  strength?: 'weak' | 'fair' | 'strong';
}

export default function PasswordInput({
  label,
  error,
  register,
  showStrengthMeter = false,
  strength,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = props.id || `password-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm text-[#9AA2AA] mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          {...register}
          {...props}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          className={`
            w-full px-4 py-3 pr-12 rounded-lg border
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
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA2AA] hover:text-[#30363A] transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePassword();
            }
          }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      {showStrengthMeter && strength && (
        <div className="mt-2 flex gap-1">
          <div
            className={`h-1 flex-1 rounded ${
              strength === 'weak' ? 'bg-[#EF4444]' :
              strength === 'fair' ? 'bg-[#F59E0B]' :
              'bg-[#10B981]'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded ${
              strength === 'weak' ? 'bg-[#F2F3F5]' :
              strength === 'fair' ? 'bg-[#F59E0B]' :
              'bg-[#10B981]'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded ${
              strength === 'weak' ? 'bg-[#F2F3F5]' :
              strength === 'fair' ? 'bg-[#F2F3F5]' :
              'bg-[#10B981]'
            }`}
          />
        </div>
      )}
      
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

