import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/database.types'

// Create a new supabase client for use in the browser
export const createClient = () => {
  const client = createClientComponentClient<Database>({
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
