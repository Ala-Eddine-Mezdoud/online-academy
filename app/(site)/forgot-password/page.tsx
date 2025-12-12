'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/components/authentication/shared/auth-schemas';
import MobileTitleAndSketch from '@/components/authentication/shared/MobileTitleAndSketch';
import AuthHeroSection from '@/components/authentication/shared/AuthHeroSection';
import AuthFormCard from '@/components/authentication/shared/AuthFormCard';
import AuthFormHeader from '@/components/authentication/shared/AuthFormHeader';
import AuthFormFooter from '@/components/authentication/shared/AuthFormFooter';
import AuthMessages from '@/components/authentication/shared/AuthMessages';
import ForgotPasswordForm from '@/components/authentication/forms/ForgotPasswordForm';
import Button from '@/components/authentication/Button';
import AuthPageLayout from '@/components/authentication/shared/AuthPageLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {

      setIsSuccess(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout 
      formOrder="right"
      mobileTitle={
        <MobileTitleAndSketch 
          sketchImage="/login-sketch1.png"
          sketchAlt="Login illustration"
        />
      }
    >
      <AuthHeroSection
        title="Reset Your Password"
        description="Enter your email address and we'll send you a link to reset your password."
        illustrationSrc="/login-sketch1.png"
        illustrationAlt="Password reset illustration"
        order="left"
      />

      <AuthFormCard order="right">
        <AuthFormHeader
          title="Forgot Password?"
          description="Don't worry! Enter your email address and we'll send you instructions to reset your password."
        />

        <AuthMessages
          error={serverError}
          success={isSuccess}
          successMessage="Password reset instructions have been sent to your email address. Please check your inbox."
        />

        {isSuccess ? (
          <div className="mb-4">
            <Button type="button" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
          </div>
        ) : (
          <ForgotPasswordForm
            register={register}
            errors={errors}
            isLoading={isLoading}
            onSubmit={handleSubmit(onSubmit)}
          />
        )}

        <AuthFormFooter
          prompt="Remember your password?"
          linkText="Log In"
          linkHref="/login"
        />
      </AuthFormCard>
    </AuthPageLayout>
  );
}
