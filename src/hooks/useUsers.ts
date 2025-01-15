'use client'

import { useState } from 'react'
import { supabaseBrowserClient } from '@/lib/supabaseBrowserClient'
import type { Database } from '@/types/database.types'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']

export function useUsers() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function getCurrentUser() {
    setLoading(true)
    try {
      const { data: { user }, error } = await supabaseBrowserClient.auth.getUser()
      if (error) throw error
      if (!user) throw new Error('No user found')
      return user
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function getUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowserClient
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function createUser(user: UserInsert) {
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowserClient
        .from('users')
        .insert(user)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateUser(id: string, updates: Partial<User>) {
    setLoading(true)
    try {
      const { data, error } = await supabaseBrowserClient
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id: string) {
    setLoading(true)
    try {
      const { error } = await supabaseBrowserClient
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getCurrentUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
