import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from 'src/types/database.types'

export const supabase = createClientComponentClient<Database>()
