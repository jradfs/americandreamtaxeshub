import { createClient } from '@/lib/supabase/client'
import { type SignInValues, type SignUpValues } from '@/lib/validations/auth'

export async function signIn({ email, password }: SignInValues) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }
}

export async function signUp({ email, password, full_name }: SignUpValues) {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role: 'team_member', // Default role for new users
      },
    },
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
} 