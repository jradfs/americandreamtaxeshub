'use client'

import { useState, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ProjectFormValues } from '@/types/projects'
import { TaskFormValues, TaskStatus, TaskPriority } from '@/types/tasks'
import { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type TaskSchema = TaskFormValues & {
  title: string
  dependencies: string[]
  order_index: number
}

interface ValidationError {
  message: string
  type: 'dependency' | 'circular' | 'duplicate' | 'required' | 'date' | 'other'
}

export function useTaskManagement(form: UseFormReturn<ProjectFormValues>) {
  const [taskErrors, setTaskErrors] = useState<Record<string, ValidationError>>({})
  const supabase = createClientComponentClient()

  const validateCircularDependencies = useCallback((
    tasks: TaskSchema[],
    startTask: string,
    visited = new Set<string>(),
    path = new Set<string>()
  ): { isValid: boolean; cycle?: string[] } => {
    if (path.has(startTask)) {
      return {
        isValid: false,
        cycle: Array.from(path).concat(startTask)
      }
    }

    if (visited.has(startTask)) {
      return { isValid: true }
    }

    visited.add(startTask)
    path.add(startTask)
    
    const task = tasks.find(t => t.title === startTask)
    if (!task) return { isValid: true }

    for (const dep of task.dependencies || []) {
      const result = validateCircularDependencies(tasks, dep, visited, path)
      if (!result.isValid) {
        return result
      }
    }

    path.delete(startTask)
    return { isValid: true }
  }, [])

  const validateTaskDependencies = useCallback((tasks: TaskSchema[]): boolean => {
    const taskTitles = new Set(tasks.map(t => t.title))
    const errors: Record<string, ValidationError> = {}
    
    // Check for duplicate titles
    const titleCounts = tasks.reduce((acc, task) => {
      acc[task.title] = (acc[task.title] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    for (const [title, count] of Object.entries(titleCounts)) {
      if (count > 1) {
        errors[title] = {
          message: 'Duplicate task title',
          type: 'duplicate'
        }
      }
    }

    // Validate dependencies
    for (const task of tasks) {
      if (!task.dependencies) continue
      
      for (const dep of task.dependencies) {
        if (!taskTitles.has(dep)) {
          errors[task.title] = {
            message: `Dependency "${dep}" not found`,
            type: 'dependency'
          }
        }
      }

      // Check for circular dependencies
      const circularCheck = validateCircularDependencies(tasks, task.title)
      if (!circularCheck.isValid) {
        errors[task.title] = {
          message: `Circular dependency detected: ${circularCheck.cycle?.join(' → ')}`,
          type: 'circular'
        }
      }
    }

    // Validate required fields and dates
    for (const task of tasks) {
      if (!task.title.trim()) {
        errors[task.title] = {
          message: 'Task title is required',
          type: 'required'
        }
      }

      if (task.start_date && task.due_date) {
        const start = new Date(task.start_date)
        const due = new Date(task.due_date)
        if (start > due) {
          errors[task.title] = {
            message: 'Start date must be before due date',
            type: 'date'
          }
        }
      }
    }

    setTaskErrors(errors)
    return Object.keys(errors).length === 0
  }, [validateCircularDependencies])

  const addTask = useCallback((task: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const newTask: TaskSchema = {
      title: task.title || '',
      description: task.description,
      status: task.status || 'todo' as TaskStatus,
      priority: task.priority || 'medium' as TaskPriority,
      dependencies: task.dependencies || [],
      order_index: task.order_index ?? currentTasks.length,
      project_id: task.project_id || '',
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      start_date: task.start_date,
      estimated_minutes: task.estimated_minutes,
      actual_minutes: task.actual_minutes,
      category: task.category,
      tags: task.tags,
      checklist: task.checklist,
      tax_form_type: task.tax_form_type,
      tax_year: task.tax_year,
      review_required: task.review_required,
      reviewer_id: task.reviewer_id
    }
    
    const updatedTasks = [...currentTasks, newTask]
    
    if (validateTaskDependencies(updatedTasks)) {
      form.setValue('tasks', updatedTasks)
      return true
    }
    
    return false
  }, [form, validateTaskDependencies])

  const removeTask = useCallback((taskTitle: string) => {
    const currentTasks = form.getValues('tasks') || []
    const updatedTasks = currentTasks
      .filter(t => t.title !== taskTitle)
      .map((t, index) => ({
        ...t,
        order_index: index,
        dependencies: t.dependencies?.filter(d => d !== taskTitle) || []
      }))
    
    form.setValue('tasks', updatedTasks)
    validateTaskDependencies(updatedTasks)
  }, [form, validateTaskDependencies])

  const updateTask = useCallback((taskTitle: string, updates: Partial<TaskSchema>) => {
    const currentTasks = form.getValues('tasks') || []
    const taskIndex = currentTasks.findIndex(t => t.title === taskTitle)
    
    if (taskIndex === -1) return false

    const updatedTasks = [...currentTasks]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      ...updates
    }

    if (validateTaskDependencies(updatedTasks)) {
      form.setValue('tasks', updatedTasks)
      return true
    }

    return false
  }, [form, validateTaskDependencies])

  const updateTaskOrder = useCallback((tasks: TaskSchema[]) => {
    const updatedTasks = tasks.map((task, index) => ({
      ...task,
      order_index: index
    }))
    
    form.setValue('tasks', updatedTasks)
    validateTaskDependencies(updatedTasks)
  }, [form, validateTaskDependencies])

  const getTaskMetadata = useCallback(() => {
    const tasks = form.getValues('tasks') || []
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalEstimatedTime = tasks.reduce((sum, t) => sum + (t.estimated_minutes || 0), 0)
    const totalActualTime = tasks.reduce((sum, t) => sum + (t.actual_minutes || 0), 0)
    
    const assigneeCounts = tasks.reduce((acc, task) => {
      if (task.assignee_id) {
        acc[task.assignee_id] = (acc[task.assignee_id] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const categoryCounts = tasks.reduce((acc, task) => {
      if (task.category) {
        acc[task.category] = (acc[task.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      totalEstimatedTime,
      totalActualTime,
      timeVariance: totalActualTime - totalEstimatedTime,
      assigneeCounts,
      categoryCounts,
      hasErrors: Object.keys(taskErrors).length > 0
    }
  }, [form, taskErrors])

  const optimizeTaskSequence = useCallback(async (tasks: Task[]) => {
    try {
      // Basic task optimization without external functions
      const sortedTasks = tasks.sort((a, b) => {
        // Sort tasks by priority and due date
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        
        if (priorityDiff !== 0) return priorityDiff
        
        const aDueDate = a.due_date ? new Date(a.due_date).getTime() : Infinity
        const bDueDate = b.due_date ? new Date(b.due_date).getTime() : Infinity
        
        return aDueDate - bDueDate
      })
      
      return {
        sequence: sortedTasks,
        allocation: null,
        estimatedCompletion: null
      }
    } catch (error) {
      console.error('Error optimizing tasks:', error)
      return {
        sequence: tasks,
        allocation: null,
        estimatedCompletion: null
      }
    }
  }, [])

  return {
    taskErrors,
    addTask,
    removeTask,
    updateTask,
    updateTaskOrder,
    validateTasks: () => validateTaskDependencies(form.getValues('tasks') || []),
    getTaskMetadata,
    optimizeTaskSequence
  }
}
