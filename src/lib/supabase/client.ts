import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserSupabaseClient<Database>()
}


