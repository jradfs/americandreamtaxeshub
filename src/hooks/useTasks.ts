import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Task, TaskWithRelations, TaskUpdate, TaskFormData } from '@/types/tasks'
import { Database } from '@/types/database.types'

interface UseTasksOptions {
  projectId?: string
  clientId?: string
  assignedUserId?: string
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [options.projectId, options.clientId, options.assignedUserId])

  async function fetchTasks() {
    try {
      const response = await fetch(
        `/api/tasks?${new URLSearchParams({
          ...(options.projectId && { projectId: options.projectId }),
          ...(options.clientId && { clientId: options.clientId }),
          ...(options.assignedUserId && { assigneeId: options.assignedUserId })
        })}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to fetch tasks')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  async function createTask(taskData: TaskFormData) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const data = await response.json()
      setTasks(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating task:', err)
      return { data: null, error: 'Failed to create task' }
    }
  }

  async function updateTask(taskId: string, updates: TaskUpdate) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: taskId, ...updates })
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const data = await response.json()
      setTasks(prev =>
        prev.map(task => (task.id === taskId ? data : task))
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating task:', err)
      return { data: null, error: 'Failed to update task' }
    }
  }

  async function deleteTask(taskId: string) {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(prev => prev.filter(task => task.id !== taskId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting task:', err)
      return { error: 'Failed to delete task' }
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
