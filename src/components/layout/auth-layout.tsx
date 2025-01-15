'use client';

import { useContext } from 'react'
import { AuthContext } from '../providers/auth-provider'
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { MainContentWrapper } from './main-content-wrapper';
import { isAuthenticated, hasRole, type UserRole } from '@/types/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  publicRoutes?: string[];
}

export function AuthLayout({ 
  children, 
  requireAuth = true,
  allowedRoles,
  publicRoutes = ['/', '/login', '/auth/callback']
}: AuthLayoutProps) {
  const { session, loading } = useContext(AuthContext)
  const pathname = usePathname();
  const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;

  // Show loading state with spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Allow public routes without authentication
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Check authentication and role requirements for protected routes
  if (requireAuth) {
    if (!isAuthenticated(session)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p>Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.some(role => 
        session.user && hasRole(session.user, role)
      );

      if (!hasAllowedRole) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
              <p>You do not have permission to access this page.</p>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div className="relative flex min-h-screen" suppressHydrationWarning>
      <Sidebar />
      <MainContentWrapper>
        {children}
      </MainContentWrapper>
    </div>
  );
} 