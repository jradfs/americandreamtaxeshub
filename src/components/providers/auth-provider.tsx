'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  session: Session | null
  user: User | null
  signOut: () => Promise<void>
  enableMFA: () => Promise<{
    id: string
    type: 'totp'
    totp: {
      qr_code: string
      secret: string
      uri: string
    }
    friendly_name?: string
  }>
  verifyMFA: (code: string) => Promise<boolean>
  isMFAEnabled: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: async () => {},
  enableMFA: async () => ({
    id: '',
    type: 'totp',
    totp: {
      qr_code: '',
      secret: '',
      uri: ''
    }
  }),
  verifyMFA: async () => false,
  isMFAEnabled: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isMFAEnabled, setIsMFAEnabled] = useState(false)
  const router = useRouter()

  const enableMFA = async () => {
    const { data, error } = await supabaseBrowserClient.auth.mfa.enroll({
      factorType: 'totp'
    })
    
    if (error) throw error
    return data
  }

  const verifyMFA = async (code: string) => {
    const { data, error } = await supabaseBrowserClient.auth.mfa.verify({
      factorId: 'totp',
      code,
      challengeId: session?.user?.factors?.[0]?.id || ''
    })
    
    if (error) throw error
    setIsMFAEnabled(true)
    return !!data
  }

  useEffect(() => {
    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabaseBrowserClient.auth.signOut()
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ session, user, signOut, enableMFA, verifyMFA, isMFAEnabled }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
