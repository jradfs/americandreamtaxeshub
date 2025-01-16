import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import type { UserRole } from "@/types/auth";

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  isPublicRoute?: boolean;
}

export function useProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
  isPublicRoute = false,
}: UseProtectedRouteOptions = {}) {
  const { session, loading, checkRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Allow public routes
    if (isPublicRoute) return;

    // Redirect to login if not authenticated
    if (!session) {
      const returnUrl = encodeURIComponent(pathname || "");
      router.replace(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.some((role) => checkRole(role));
      if (!hasAllowedRole) {
        router.replace("/unauthorized");
      }
    }
  }, [
    session,
    loading,
    allowedRoles,
    redirectTo,
    isPublicRoute,
    router,
    pathname,
    checkRole,
  ]);

  return {
    isAuthenticated: !!session,
    isAuthorized: !allowedRoles || allowedRoles.some((role) => checkRole(role)),
    isLoading: loading,
    user: session?.user,
  };
}
