'use client'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { TaskSchema } from '@/types/tasks'

export function useTaskManagement() {
  const form = useForm<{ tasks: TaskSchema[] }>()

  const validateTaskDependencies = useCallback((tasks: TaskSchema[]) => {
    const errors: Record<string, { message: string; type: string }> = {}
    
    tasks.forEach(task => {
      // Validate dates
      if (task.start_date && isNaN(new Date(task.start_date).getTime())) {
        errors[task.id] = {
          message: 'Invalid start date format',
          type: 'date'
        }
      }
      
      if (task.due_date && isNaN(new Date(task.due_date).getTime())) {
        errors[task.id] = {
          message: 'Invalid due date format',
          type: 'date'
        }
      }

      // Validate date order
      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date)
        const due = new Date(task.due_date)
        if (start > due) {
          errors[task.id] = {
            message: 'Start date must be before due date',
            type: 'date'
          }
        }
      }
    })

    return errors
  }, [])

  const addTask = useCallback((task: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const newId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
    
    const newTask: TaskSchema = {
      id: task.id || newId,
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dependencies: task.dependencies || [],
      start_date: task.start_date,
      due_date: task.due_date
    }

    const errors = validateTaskDependencies([...currentTasks, newTask])
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    form.setValue('tasks', [...currentTasks, newTask])
    return { success: true }
  }, [form, validateTaskDependencies])

  const removeTask = useCallback((taskId: string) => {
    const currentTasks = form.getValues('tasks') || []
    form.setValue('tasks', currentTasks.filter(t => t.id !== taskId))
  }, [form])

  const updateTask = useCallback((taskId: string, updates: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const taskIndex = currentTasks.findIndex(t => t.id === taskId)
    
    if (taskIndex === -1) return { success: false, error: 'Task not found' }

    const updatedTask = { ...currentTasks[taskIndex], ...updates }
    const updatedTasks = [...currentTasks]
    updatedTasks[taskIndex] = updatedTask

    const errors = validateTaskDependencies(updatedTasks)
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    form.setValue('tasks', updatedTasks)
    return { success: true }
  }, [form, validateTaskDependencies])

  return {
    form,
    addTask,
    removeTask,
    updateTask
  }
}
