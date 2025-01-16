import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser();

  const publicPaths = [
    "/login",
    "/api/auth",
    "/auth/callback",
    "/"
  ];
  
  const isPublicRoute = publicPaths.some(path =>
    req.nextUrl.pathname.startsWith(path));
  // Handle unauthenticated users
  if (!user && !isPublicRoute) {
    // Prevent redirect loops on login page
    if (req.nextUrl.pathname === "/login") {
      return res;
    }
    
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle authenticated users
  if (user) {
    // Get session to check expiration
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Refresh session if about to expire
      const expiresAt = new Date(session.expires_at * 1000);
      const timeUntilExpiry = expiresAt.getTime() - Date.now();
      
      if (timeUntilExpiry < 5 * 60 * 1000) { // 5 minutes
        const { data: { session: refreshedSession }, error: refreshError } =
          await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Session refresh failed:", refreshError);
          return NextResponse.redirect(new URL("/login", req.url));
        }
      }
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      profile?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/manager") &&
      !["admin", "manager"].includes(profile?.role || "")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
