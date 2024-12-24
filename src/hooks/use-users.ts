'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type User = {
  id: string
  name?: string
  avatar_url?: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUsers() {
      try {
        // First get the current user's data
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          throw new Error('No authenticated user')
        }

        // Then fetch all profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .order('name')

        if (error) throw error

        // Process the profiles
        const processedUsers = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown User',
          avatar_url: profile.avatar_url
        }));

        setUsers(processedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        // On error, at least show the current user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUsers([{
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User',
            avatar_url: user.user_metadata?.avatar_url
          }])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  return { users, loading }
}