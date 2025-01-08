'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type DbTask = Database['public']['Tables']['tasks']['Row']

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<DbTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectId) {
        query.eq('project_id', projectId)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw supabaseError
      }

      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  return {
    tasks,
    isLoading,
    error,
    mutate: fetchTasks
  }
}
