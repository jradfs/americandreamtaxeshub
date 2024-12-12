import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task, TaskInsert, TaskUpdate } from '@/types/hooks'

export function useTasks(projectId?: number, assignedUserId?: number) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [projectId, assignedUserId])

  async function fetchTasks() {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      if (assignedUserId) {
        query = query.eq('assigned_user_id', assignedUserId)
      }

      const { data, error } = await query

      if (error) throw error
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(task: TaskInsert) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()

      if (error) throw error
      setTasks(prev => [...prev, data[0]])
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateTask(id: number, updates: TaskUpdate) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      setTasks(prev => prev.map(task => task.id === id ? data[0] : task))
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteTask(id: number) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  }
}
