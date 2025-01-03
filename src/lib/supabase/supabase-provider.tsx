'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from 'src/types/database.types'
import { useState, createContext, useContext, useEffect } from 'react'

type SupabaseContextType = {
  supabase: ReturnType<typeof createClientComponentClient<Database>>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient<Database>())

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
