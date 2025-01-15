'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient'
import { getAuthenticatedUser, validateUserSession, getUserRole, refreshUserSession } from '@/lib/supabase/auth'
import type { Database } from '@/types/database.types'

interface AuthContextProps {
  user: User | null
  session: Session | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  hasRole: (role: string) => boolean
  validateSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabaseBrowserClient.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      const { error } = await supabaseBrowserClient.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const refreshSession = async () => {
    try {
      const session = await refreshUserSession()
      setSession(session)
      if (session?.user) {
        setUser(session.user)
        const role = await getUserRole(session.user)
        setUserRole(role)
      }
    } catch (error) {
      setError(error as Error)
      throw error
    }
  }

  const hasRole = (role: string): boolean => {
    if (!userRole) return false
    if (role === 'admin') return userRole === 'admin'
    if (role === 'manager') return ['admin', 'manager'].includes(userRole)
    return true
  }

  const validateSession = async (): Promise<boolean> => {
    try {
      const isValid = await validateUserSession()
      if (!isValid) {
        setUser(null)
        setSession(null)
        setUserRole(null)
      }
      return isValid
    } catch (error) {
      setError(error as Error)
      return false
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession,
    hasRole,
    validateSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 