import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/database.types'

// Create a new supabase client for use in the browser
export const createClient = () => {
  return createClientComponentClient<Database>()
}

// Get a client instance when needed
export const getSupabase = () => {
  return createClient()
}
