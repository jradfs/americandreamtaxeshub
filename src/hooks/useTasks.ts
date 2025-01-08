'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { TaskWithRelations } from '@/types/tasks'

type DbTask = Database['public']['Tables']['tasks']['Row']
type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']
type DbChecklistItem = Database['public']['Tables']['checklist_items']['Row']
type DbActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Row']

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch tasks
      const taskQuery = supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:users(*),
          parent_task:tasks!parent_task_id(*),
          template:task_templates(*)
        `)
        .order('created_at', { ascending: false })

      if (projectId) {
        taskQuery.eq('project_id', projectId)
      }

      const { data: taskData, error: taskError } = await taskQuery

      if (taskError) throw taskError

      // For each task, fetch related items
      const tasksWithRelations = await Promise.all((taskData || []).map(async (task) => {
        const [checklistItems, activityLogEntries] = await Promise.all([
          // Fetch checklist items
          supabase
            .from('checklist_items')
            .select('*')
            .eq('task_id', task.id)
            .then(({ data }) => data || []),

          // Fetch activity log entries
          supabase
            .from('activity_log_entries')
            .select('*')
            .eq('task_id', task.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => data || [])
        ])

        return {
          ...task,
          checklist_items: checklistItems,
          activity_log_entries: activityLogEntries
        }
      }))

      setTasks(tasksWithRelations)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (taskData: DbTaskInsert) => {
    try {
      setError(null)
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (taskError) throw taskError

      // Add initial activity log entry
      await supabase
        .from('activity_log_entries')
        .insert({
          task_id: task.id,
          action: 'created',
          details: { status: task.status }
        })

      await fetchTasks()
      return task
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create task'))
      throw err
    }
  }

  const updateTask = async (taskId: string, updates: DbTaskUpdate) => {
    try {
      setError(null)
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single()

      if (taskError) throw taskError

      // Add activity log entry
      await supabase
        .from('activity_log_entries')
        .insert({
          task_id: taskId,
          action: 'updated',
          details: { updates }
        })

      await fetchTasks()
      return task
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'))
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      setError(null)
      // Delete related records first
      await Promise.all([
        supabase.from('checklist_items').delete().eq('task_id', taskId),
        supabase.from('activity_log_entries').delete().eq('task_id', taskId)
      ])

      // Then delete the task
      const { error: taskError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (taskError) throw taskError

      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'))
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  return {
    tasks,
    isLoading,
    error,
    mutate: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
