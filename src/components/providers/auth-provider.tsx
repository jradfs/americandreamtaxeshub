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
  const [supabaseClient] = useState(() => createClient())
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabaseClient.auth.getSession()
        
        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          if (window.location.pathname === '/login') {
            await router.replace('/dashboard')
          }
        }

        const { data: { subscription } } = await supabaseClient.auth.onAuthStateChange(
          async (event, currentSession) => {
            setSession(currentSession)
            setUser(currentSession?.user ?? null)

            if (event === 'SIGNED_IN') {
              if (window.location.pathname === '/login') {
                await router.replace('/dashboard')
              }
            } else if (event === 'SIGNED_OUT') {
              await router.replace('/login')
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
  }, [router, supabaseClient])

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error

      if (data?.session) {
        setSession(data.session)
        setUser(data.session.user)
        await router.replace('/dashboard')
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

  const handleSignUp = async (email: string, password: string) => {
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

  const handleSignOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut()
      if (error) throw error
      
      setSession(null)
      setUser(null)
      await router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
      })
      throw error
    }
  }

  // Prevent flash of unauthenticated content
  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading, 
        signIn: handleSignIn, 
        signUp: handleSignUp, 
        signOut: handleSignOut 
      }}
    >
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
