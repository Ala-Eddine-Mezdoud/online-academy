"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  loginSchema,
  LoginFormData,
} from "@/components/authentication/shared/auth-schemas";
import MobileTitleAndSketch from "@/components/authentication/shared/MobileTitleAndSketch";
import AuthHeroSection from "@/components/authentication/shared/AuthHeroSection";
import AuthFormCard from "@/components/authentication/shared/AuthFormCard";
import AuthFormHeader from "@/components/authentication/shared/AuthFormHeader";
import AuthFormFooter from "@/components/authentication/shared/AuthFormFooter";
import AuthMessages from "@/components/authentication/shared/AuthMessages";
import LoginForm from "@/components/authentication/forms/LoginForm";
import RoleTabs from "@/components/authentication/RoleTabs";
import { createBrowserSupabase } from "@/app/lib/supabase/supabase";

type Role = "Student" | "Teacher" | "Admin";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createBrowserSupabase();

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

    try {
      const { data: signInResponse, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        throw authError;
      }

      if (!signInResponse.user) {
        throw new Error("Unable to sign in. Please try again.");
      }

      // Verify the user's role matches the selected role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", signInResponse.user.id)
        .single();

      if (profileError || !profile) {
        console.log("Profile error:", profileError);
        throw new Error("Unable to verify your account. Please try again.");
      }

      const userRole = profile.role.toLowerCase();
      const expectedRole = selectedRole.toLowerCase();

      if (userRole !== expectedRole) {
        // Sign out since role doesn't match
        await supabase.auth.signOut();
        throw new Error(
          `This account is registered as a ${profile.role}. Please select the correct role.`
        );
      }

      setIsSuccess(true);
      console.log("success");
      // setTimeout(() => router.push("/dashboard"), 1500);
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
    <div className="h-screen bg-[#F7F9FB] flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="w-full max-w-7xl h-full flex flex-col lg:flex-row items-center justify-center">
        <MobileTitleAndSketch
          sketchImage="/login-sketch.png"
          sketchAlt="Login illustration"
        />
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0 lg:gap-0 items-center w-full h-full">
          <AuthFormCard order="left">
            <RoleTabs
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

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
        </div>
      </div>
    </div>
  );
}
