import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/database.types'

export const createClient = () => {
  return createClientComponentClient<Database>({
    options: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

export const supabase = createClient()
