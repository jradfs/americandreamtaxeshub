'use client'

import { useAuth } from '@/providers/unified-auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: string
  fallbackPath?: string
}

export function RoleGuard({
  children,
  requiredRole,
  fallbackPath = '/dashboard',
}: RoleGuardProps) {
  const { hasRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !hasRole(requiredRole)) {
      router.push(fallbackPath)
    }
  }, [loading, hasRole, requiredRole, fallbackPath, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasRole(requiredRole)) {
    return null
  }

  return <>{children}</>
} 