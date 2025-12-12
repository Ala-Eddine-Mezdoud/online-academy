'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '@/components/authentication/Input';
import Button from '@/components/authentication/Button';
import { ForgotPasswordFormData } from '@/components/authentication/shared/auth-schemas';

interface ForgotPasswordFormProps {
  register: UseFormRegister<ForgotPasswordFormData>;
  errors: FieldErrors<ForgotPasswordFormData>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function ForgotPasswordForm({ 
  register, 
  errors, 
  isLoading, 
  onSubmit 
}: ForgotPasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        register={register('email')}
      />

      <Button type="submit" isLoading={isLoading}>
        Send Reset Link
      </Button>
    </form>
  );
}


