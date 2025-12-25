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

  // we create a separate server client here to handle the cookies sent in the request header
  // if you use the server component the cookies won't be the same thus you w
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
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
  const PROTECTED_ROUTES = ["/dashboard"];
  const ADMIN_ROUTES = ["/dashboard/admin", "/admin"];
  const AUTH_ROUTES = ["/login"];
  
  // login the user to check for errors in JWT validation
  // as of now everything is working fine

  const isProtected = PROTECTED_ROUTES.some((path) => pathname.startsWith(path));
  const isAuth = AUTH_ROUTES.some((path) => pathname.startsWith(path));
  const isAdmin = ADMIN_ROUTES.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  // if (isAuth && user) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }

  if (isAdmin && user?.user_metadata.role != "admin") {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return response;
}
