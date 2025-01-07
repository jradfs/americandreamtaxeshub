import { createServerClient } from '@supabase/ssr'
import { type Database } from '@/types/database.types'

export const createClientHelper = (cookieStore?: any) => {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: cookieStore ? {
				get(name: string) {
					return cookieStore.get(name)?.value
				},
				set(name: string, value: string, options: any) {
					cookieStore.set({ name, value, ...options })
				},
				remove(name: string, options: any) {
					cookieStore.set({ name, value: '', ...options })
				},
			} : undefined,
			auth: {
				persistSession: true,
				storageKey: 'american-dream-taxes-auth',
			}
		}
	)
}