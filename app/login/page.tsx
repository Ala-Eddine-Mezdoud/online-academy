'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginFormData } from '@/components/authentication/shared/auth-schemas';
import MobileTitleAndSketch from '@/components/authentication/shared/MobileTitleAndSketch';
import AuthHeroSection from '@/components/authentication/shared/AuthHeroSection';
import AuthFormCard from '@/components/authentication/shared/AuthFormCard';
import AuthFormHeader from '@/components/authentication/shared/AuthFormHeader';
import AuthFormFooter from '@/components/authentication/shared/AuthFormFooter';
import AuthMessages from '@/components/authentication/shared/AuthMessages';
import LoginForm from '@/components/authentication/forms/LoginForm';
import RoleTabs from '@/components/authentication/RoleTabs';
import AuthPageLayout from '@/components/authentication/shared/AuthPageLayout';

type Role = 'Student' | 'Teacher' | 'Admin';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('Student');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);
    setIsSuccess(false);

  };

  return (
    <AuthPageLayout 
      formOrder="left"
      mobileTitle={
        <MobileTitleAndSketch 
          sketchImage="/login-sketch.png"
          sketchAlt="Login illustration"
        />
      }
    >
      <AuthFormCard order="left">
        <RoleTabs selectedRole={selectedRole} onRoleChange={setSelectedRole} />

        <AuthFormHeader
          title="Welcome Back!"
          description={`Log in to access your personalized learning journey as a ${selectedRole}.`}
        />

        <AuthMessages
          error={serverError}
          success={isSuccess}
          successMessage="Login successful! Redirecting..."
        />

        {!isSuccess && (
          <LoginForm
            register={register}
            errors={errors}
            isLoading={isLoading}
            onSubmit={handleSubmit(onSubmit)}
          />
        )}

        <AuthFormFooter
          prompt="Don't have an account?"
          linkText="Sign Up"
          linkHref="/signup"
        />
      </AuthFormCard>

      <AuthHeroSection
        title="Welcome back to EduConnect"
        description="Log in to stay on track."
        illustrationSrc="/login-sketch.png"
        illustrationAlt="Students learning illustration"
        order="right"
      />
    </AuthPageLayout>
  );
}
