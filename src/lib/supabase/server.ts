import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient(useServiceRole = false) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('sb-access-token')?.value;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore.get(name))?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            await cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle error
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            await cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle error
          }
        },
      },
      global: {
        headers: {
          Authorization: `Bearer ${useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY! : authToken}`,
        },
      },
    }
  );
}
