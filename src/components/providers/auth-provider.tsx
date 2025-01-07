"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { 
  AuthState, 
  Session, 
  SignUpFormData, 
  SignInFormData, 
  AuthError, 
  InvalidCredentialsError,
  SessionExpiredError,
  UnauthorizedError,
  isAuthenticated,
  hasRole,
  type UserRole
} from '@/types/auth'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

type AuthContextType = {
  session: Session | null
  loading: boolean
  error: AuthError | null
  signIn: (data: SignInFormData) => Promise<void>
  signUp: (data: SignUpFormData) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  checkRole: (role: UserRole) => boolean
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
  checkRole: () => false,
  clearError: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    loading: true,
    error: null
  })

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  )
  const router = useRouter()
  const { toast } = useToast()

  const handleSessionUpdate = (session: Session | null) => {
    if (session && isAuthenticated(session)) {
      setAuthState({
        session,
        loading: false,
        error: null
      })
    } else {
      setAuthState({
        session: null,
        loading: false,
        error: session ? new SessionExpiredError() : null
      })
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
          handleSessionUpdate({
            user: {
              id: session.user.id,
              email: session.user.email!,
              role: session.user.user_metadata.role || 'team_member',
              full_name: session.user.user_metadata.full_name,
              avatar_url: session.user.user_metadata.avatar_url,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at
            },
            expires_at: session.expires_at!,
            access_token: session.access_token,
            refresh_token: session.refresh_token
          })
        } else {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof AuthError ? error : new AuthError('Failed to initialize auth')
        }))
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        handleSessionUpdate({
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: session.user.user_metadata.role || 'team_member',
            full_name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at
          },
          expires_at: session.expires_at!,
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })
      } else {
        setAuthState({
          session: null,
          loading: false,
          error: null
        })
      }
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleSignIn = async ({ email, password }: SignInFormData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw new InvalidCredentialsError()

      if (data?.session) {
        await router.replace('/dashboard')
      }
    } catch (error) {
      console.error('Error signing in:', error)
      const authError = error instanceof AuthError ? error : new AuthError('Failed to sign in')
      setAuthState(prev => ({ ...prev, error: authError }))
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const handleSignUp = async ({ email, password, full_name, role }: SignUpFormData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      console.error('Error signing up:', error)
      const authError = error instanceof AuthError ? error : new AuthError('Failed to sign up')
      setAuthState(prev => ({ ...prev, error: authError }))
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      await router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      const authError = error instanceof AuthError ? error : new AuthError('Failed to sign out')
      setAuthState(prev => ({ ...prev, error: authError }))
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const handleRefreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      if (session) {
        handleSessionUpdate({
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: session.user.user_metadata.role || 'team_member',
            full_name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at
          },
          expires_at: session.expires_at!,
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      const authError = error instanceof AuthError ? error : new AuthError('Failed to refresh session')
      setAuthState(prev => ({ ...prev, error: authError }))
      throw authError
    }
  }

  const checkRole = (role: UserRole): boolean => {
    if (!authState.session?.user) return false
    return hasRole(authState.session.user, role)
  }

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  return (
    <AuthContext.Provider 
      value={{ 
        session: authState.session,
        loading: authState.loading,
        error: authState.error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshSession: handleRefreshSession,
        checkRole,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
