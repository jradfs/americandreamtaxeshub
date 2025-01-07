'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DbTask, TaskFormValues, DbTaskUpdate } from '@/types/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<DbTask[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      return
    }

    setTasks(data)
  }

  const createTask = async (taskData: TaskFormValues) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single()

    if (error) {
      throw error
    }

    setTasks((prev) => [data, ...prev])
    return data
  }

  const updateTask = async (taskId: string, taskData: DbTaskUpdate) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw error
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? data : task))
    )
    return data
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw error
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
