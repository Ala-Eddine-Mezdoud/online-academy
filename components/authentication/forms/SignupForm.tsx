'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '@/components/authentication/Input';
import PasswordInput from '@/components/authentication/PasswordInput';
import Button from '@/components/authentication/Button';
import { SignUpFormData } from '@/components/authentication/shared/auth-schemas';
import { WILAYAS } from '@/components/authentication/shared/auth-utils';

interface SignupFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  isLoading: boolean;
  passwordStrength: 'weak' | 'fair' | 'strong';
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function SignupForm({ 
  register, 
  errors, 
  isLoading, 
  passwordStrength,
  onSubmit 
}: SignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 lg:space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        error={errors.fullName?.message}
        register={register('fullName')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        register={register('email')}
      />

      <Input
        label="Phone number"
        type="tel"
        placeholder="Enter your phone number"
        error={errors.phone?.message}
        register={register('phone')}
      />

      <div className="w-full">
        <label
          htmlFor="wilaya"
          className="block text-sm font-inter text-[#9AA2AA] mb-2"
        >
          Wilaya
        </label>
        <select
          id="wilaya"
          {...register('wilaya')}
          aria-invalid={errors.wilaya ? 'true' : 'false'}
          className={`
            w-full px-4 py-3 rounded-lg border
            ${errors.wilaya 
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]' 
              : 'border-[rgba(16,24,40,0.06)] focus:border-[#19B7FF] focus:ring-2 focus:ring-[#19B7FF]/20'
            }
            bg-white text-[#30363A] text-base
            transition-all duration-200
            focus:outline-none
          `}
        >
          <option value="">Select a wilaya</option>
          {WILAYAS.map((wilaya) => (
            <option key={wilaya} value={wilaya}>
              {wilaya}
            </option>
          ))}
        </select>
        {errors.wilaya && (
          <p className="mt-1 text-sm text-[#EF4444]" role="alert">
            {errors.wilaya.message}
          </p>
        )}
      </div>

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        register={register('password')}
        showStrengthMeter={true}
        strength={passwordStrength}
      />

      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        register={register('confirmPassword')}
      />

      <Button type="submit" isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
}

