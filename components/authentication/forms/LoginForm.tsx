'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '@/components/authentication/Input';
import PasswordInput from '@/components/authentication/PasswordInput';
import Button from '@/components/authentication/Button';
import { LoginFormData } from '@/components/authentication/shared/auth-schemas';

interface LoginFormProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function LoginForm({ register, errors, isLoading, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        register={register('email')}
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        register={register('password')}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 text-[#0C86D8] border-[rgba(16,24,40,0.06)] rounded focus:ring-[#19B7FF] focus:ring-2"
          />
          <span className="ml-2 text-sm text-[#30363A]">
            Remember me
          </span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm text-[#19B7FF] hover:text-[#0C86D8] transition-colors"
        >
          Forgot Password?
        </a>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Log In
      </Button>
    </form>
  );
}


