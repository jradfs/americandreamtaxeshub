'use client'

import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient'
import { type SignInValues, type SignUpValues } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { AuthError } from '@supabase/supabase-js'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabaseBrowserClient.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabaseBrowserClient.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session }, error } = await supabaseBrowserClient.auth.getSession()
  if (error) throw error
  return session
}

export async function requireAuth() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return session
}

export async function requireRole(role: string) {
  const session = await requireAuth()
  
  if (session.user.app_metadata?.role !== role) {
    redirect('/unauthorized')
  }

  return session
}

export async function getCurrentUser() {
  const session = await requireAuth()
  return session.user
} 