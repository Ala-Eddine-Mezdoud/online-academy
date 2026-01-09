import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export default async function updateSession(request: NextRequest) {
  let response = NextResponse.next();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase project URL and anon key are required to create a Supabase client.\n"
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const userRole = user?.user_metadata?.role as string | undefined;

  // Route definitions
  const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];
  const PROTECTED_ROUTES = ["/dashboard"];
  const ADMIN_ROUTES = ["/dashboard/admin"];
  const TEACHER_ROUTES = ["/dashboard/teacher"];
  const STUDENT_ROUTES = ["/dashboard/student"];
  // Public/visitor-only routes - logged-in users should be redirected to dashboard
  const VISITOR_ONLY_ROUTES = ["/", "/about", "/contact", "/course", "/teacher"];

  const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path));
  const isProtectedRoute = PROTECTED_ROUTES.some((path) => pathname.startsWith(path));
  const isAdminRoute = ADMIN_ROUTES.some((path) => pathname.startsWith(path));
  const isTeacherRoute = TEACHER_ROUTES.some((path) => pathname.startsWith(path));
  const isStudentRoute = STUDENT_ROUTES.some((path) => pathname.startsWith(path));
  const isVisitorOnlyRoute = VISITOR_ONLY_ROUTES.some((path) => 
    pathname === path || (path !== "/" && pathname.startsWith(path))
  );

  // 1. Auth routes: redirect logged-in users to their dashboard
  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getRoleDashboard(userRole);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Visitor-only routes: redirect logged-in users to their dashboard
  if (isVisitorOnlyRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getRoleDashboard(userRole);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Protected routes: require authentication
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Role-based access control for dashboard routes
  if (user && isProtectedRoute) {
    // Handle /dashboard root - redirect to role-specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getRoleDashboard(userRole);
      return NextResponse.redirect(redirectUrl);
    }

    // Admin routes - only admins
    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    // Teacher routes - only teachers
    if (isTeacherRoute && userRole !== "teacher") {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    // Student routes - only students
    if (isStudentRoute && userRole !== "student") {
      return NextResponse.rewrite(new URL("/404", request.url));
    }
  }

  return response;
}

// Helper function to get dashboard path based on role
function getRoleDashboard(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    default:
      return "/dashboard/student"; // Default to student
  }
}
