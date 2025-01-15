'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/providers/unified-auth-provider'
import type { Database } from '@/types/database.types'

type TemplateTask = Database['public']['Tables']['template_tasks']['Row']

export function useTemplateTasks(templateId: string) {
  const { supabase } = useAuth()
  const [tasks, setTasks] = useState<TemplateTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('template_tasks')
        .select('*')
        .eq('template_id', templateId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch template tasks'))
    } finally {
      setIsLoading(false)
    }
  }, [supabase, templateId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = useCallback(async (taskData: Partial<TemplateTask>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .insert([{ ...taskData, template_id: templateId }])
        .select()
        .single()

      if (error) throw error
      setTasks(prev => [data, ...prev])
      return data
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to create template task')
    }
  }, [supabase, templateId])

  const updateTask = useCallback(async (id: string, taskData: Partial<TemplateTask>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTasks(prev => prev.map(task => task.id === id ? data : task))
      return data
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to update template task')
    }
  }, [supabase])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('template_tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (e) {
      throw e instanceof Error ? e : new Error('Failed to delete template task')
    }
  }, [supabase])

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  }
}
