import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabaseServerClient'
import { SignUpForm } from '@/components/auth/signup-form'

export default async function SignUpPage() {
  const supabase = getSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return <SignUpForm />
}
