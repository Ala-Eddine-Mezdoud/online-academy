"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  signUpSchema,
  SignUpFormData,
} from "@/components/authentication/shared/auth-schemas";
import { getPasswordStrength } from "@/components/authentication/shared/auth-utils";
import MobileTitleAndSketch from "@/components/authentication/shared/MobileTitleAndSketch";
import AuthHeroSection from "@/components/authentication/shared/AuthHeroSection";
import AuthFormCard from "@/components/authentication/shared/AuthFormCard";
import AuthFormHeader from "@/components/authentication/shared/AuthFormHeader";
import AuthFormFooter from "@/components/authentication/shared/AuthFormFooter";
import AuthMessages from "@/components/authentication/shared/AuthMessages";
import SignupForm from "@/components/authentication/forms/SignupForm";
import AuthPageLayout from "@/components/authentication/shared/AuthPageLayout";
import { createBrowserSupabase } from "@/app/lib/supabase/supabase";

type Role = "Student" | "Teacher" | "Admin";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "fair" | "strong"
  >("weak");
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = useMemo(() => createBrowserSupabase(), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch("password");

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength("weak");
    }
  }, [password]);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setServerError(null);
    setIsSuccess(false);
    const roleForDb: "student" | "teacher" | "admin" = "student";

    try {
      const { data: signUpResponse, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.fullName,
              role: roleForDb,
              phone: data.phone?.length ? data.phone : null,
              wilaya: data.wilaya,
            },
          },
        });

      if (authError) {
        throw authError;
      }

      const userId = signUpResponse.user?.id;
      if (!userId) {
        throw new Error("Unable to complete sign up. Please try again.");
      }

      // Profile is created automatically via database trigger using the metadata above
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout
      formOrder="right"
      mobileTitle={
        <MobileTitleAndSketch
          sketchImage="/signup-sketch.png"
          sketchAlt="Signup illustration"
        />
      }
    >
      <AuthHeroSection
        title="Welcome to EduConnect"
        description="Sign up to discover more."
        illustrationSrc="/signup-sketch1.png"
        illustrationAlt="Teacher and student illustration"
        order="left"
      />

      <AuthFormCard order="right">
        {/* Role selection removed — new signups default to student */}

        <AuthFormHeader
          title="Create Your EduConnect Account"
          description="Start your learning journey today."
        />

        <AuthMessages
          error={serverError}
          success={isSuccess}
          successMessage="Account created successfully! Redirecting..."
        />

        {!isSuccess && (
          <SignupForm
            register={register}
            errors={errors}
            isLoading={isLoading}
            passwordStrength={passwordStrength}
            onSubmit={handleSubmit(onSubmit)}
          />
        )}

        <AuthFormFooter
          prompt="Already have an account?"
          linkText="Log In"
          linkHref="/login"
        />
      </AuthFormCard>
    </AuthPageLayout>
  );
}
