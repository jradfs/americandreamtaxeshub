import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthButtons } from '@/components/auth/auth-buttons'

export default async function Home() {
  const headersList = headers()
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const host = headersList.get('host')
  const baseUrl = `${protocol}://${host}`

  // Use the auth route handler for session checks
  const res = await fetch(`${baseUrl}/api/auth`, {
    cache: 'no-store',
  })

  if (res.ok) {
    const { session } = await res.json()
    if (session) {
      redirect('/dashboard')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to American Dream Taxes</h1>
      <p className="text-xl mb-4">Please sign in to continue</p>
      <AuthButtons />
    </main>
  )
}