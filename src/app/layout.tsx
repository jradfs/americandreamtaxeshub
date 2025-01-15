import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ApplicationProvider } from '@/providers/ApplicationProvider'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookies().set({ name, value, ...options })
          } catch (error) {
            // Handle error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookies().set({ name, value: '', ...options })
          } catch (error) {
            // Handle error
          }
        },
      },
    }
  )

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <ApplicationProvider>
              {children}
              <Toaster />
            </ApplicationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
