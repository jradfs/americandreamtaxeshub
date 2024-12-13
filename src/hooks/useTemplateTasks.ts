import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { TemplateTask } from '@/types/hooks'

export function useTemplateTasks(templateId: string) {
  const { supabase } = useSupabase()
  const [tasks, setTasks] = useState<TemplateTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('template_tasks')
        .select('*')
        .eq('template_id', templateId)
        .order('order_index', { ascending: true })

      if (error) throw error

      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch template tasks'))
    } finally {
      setLoading(false)
    }
  }, [supabase, templateId])

  const createTask = useCallback(async (task: Omit<TemplateTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .insert(task)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => [...prev, data])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template task')
    }
  }, [supabase])

  const updateTask = useCallback(async (id: string, updates: Partial<TemplateTask>) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template task')
    }
  }, [supabase])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('template_tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template task')
    }
  }, [supabase])

  const reorderTask = useCallback(async (taskId: string, newOrderIndex: number) => {
    try {
      const { data, error } = await supabase
        .from('template_tasks')
        .update({ order_index: newOrderIndex })
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      await fetchTasks() // Refresh the list to get the correct order
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to reorder template task')
    }
  }, [supabase, fetchTasks])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    refreshTasks: fetchTasks,
  }
}
