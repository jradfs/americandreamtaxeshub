'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from 'src/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useToast } from 'src/hooks/use-toast'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const [supabaseClient] = useState(() => createClient())
useEffect(() => {
  const initializeAuth = async () => {
    try {
      // Get initial session
      const { data: { session: initialSession } } = await supabaseClient.auth.getSession()
      
      if (initialSession) {
        setSession(initialSession)
        setUser(initialSession.user)
        if (window.location.pathname === '/login') {
          router.push('/dashboard')
        }
      }

      // Set up auth state listener
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)

          if (event === 'SIGNED_IN') {
            if (window.location.pathname === '/login') {
              router.push('/dashboard')
            }
          } else if (event === 'SIGNED_OUT') {
            router.push('/login')
          }
        }
      )

      setLoading(false)
      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      setLoading(false)
    }
  }

  initializeAuth()
}, [router])

// Prevent flash of unauthenticated content
if (loading) {
  return null
}
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error

      if (data?.session) {
        setSession(data.session)
        setUser(data.session.user)
        await router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
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
      toast({
        title: "Error",
        description: "Failed to sign up. Please try again.",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut()
      if (error) throw error
      
      setSession(null)
      setUser(null)
      await router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
