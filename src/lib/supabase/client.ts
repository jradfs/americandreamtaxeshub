import { createClient } from '@supabase/ssr'
import { type Database } from '@/types/database.types'

// Create a new supabase client for use in the browser
export const createClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
    options: {
      persistSession: true,
      autoRefreshToken: true,
      global: {
        headers: {
          'X-Client-Info': 'american-dream-taxes-hub'
        }
      },
      auth: {
        persistSession: true,
        storageKey: 'american-dream-taxes-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    },
  })
  return client
}

// Get a client instance when needed
export const getSupabase = () => {
  return createClient()
}
