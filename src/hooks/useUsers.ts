import { useState, useCallback } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { DbUser, DbUserInsert, DbUserUpdate, UserWithRelations } from '@/types/users'

export function useUsers() {
  const supabase = useSupabase()
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const createUser = useCallback(async (userData: DbUserInsert) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      if (data) setUsers(prev => [...prev, data[0]])
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create user'))
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateUser = useCallback(async (userId: string, updates: DbUserUpdate) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select(`
          *,
          profile:profiles(*),
          managed_projects:projects(*),
          assigned_tasks:tasks(*),
          team_memberships:project_team_members(*)
        `)

      if (error) throw error
      if (data) {
        setUsers(prev => 
          prev.map(user => user.id === userId ? { ...user, ...data[0] } : user)
        )
      }
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user'))
      return null
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete user'))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
