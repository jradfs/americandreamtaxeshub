'use client'

import { useAuth } from '@/hooks/use-auth'
import { ReactNode } from 'react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, loading } = useAuth()
  
  // Show nothing while checking authentication
  if (loading) {
    return null
  }
  
  // Show fallback if user is not authenticated
  if (!user) {
    return fallback
  }
  
  // Check if user has required role
  const userRole = user.app_metadata?.role as string
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback
  }
  
  // User has required role, show protected content
  return <>{children}</>
} 