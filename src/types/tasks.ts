import type { Database } from './database.types'
import { z } from 'zod'
import { taskSchema } from '@/lib/validations/task'

// Database types
export type DbTask = Database['public']['Tables']['tasks']['Row']
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']

// Enums from database
export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']

// Relational table types
export type DbChecklistItem = Database['public']['Tables']['checklist_items']['Row']
export type DbActivityLogEntry = Database['public']['Tables']['activity_log_entries']['Row']

export type RecurringConfig = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  end_date?: string
  end_occurrences?: number
}

// Form data type that matches our schema
export type TaskFormValues = z.infer<typeof taskSchema>
export type TaskFormData = TaskFormValues
export type TaskUpdate = Partial<TaskFormValues> & { id: string }

// Task type for general use
export type Task = TaskWithRelations

// Enhanced task type with relationships using relational tables
export type TaskWithRelations = DbTask & {
  checklist_items?: DbChecklistItem[]
  activity_log_entries?: DbActivityLogEntry[]
  recurring_config: RecurringConfig | null
  project?: Database['public']['Tables']['projects']['Row'] | null
  assignee?: Database['public']['Tables']['users']['Row'] | null
  parent_task?: DbTask | null
  subtasks?: DbTask[]
  dependencies?: DbTask[]
  template?: Database['public']['Tables']['task_templates']['Row'] | null
}

// Constants
export const taskStatusOptions: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed']
export const taskPriorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

// Type guards
export function isDbTask(task: unknown): task is DbTask {
  return task !== null &&
    typeof task === 'object' &&
    'id' in task &&
    'title' in task &&
    'status' in task
}

// Conversion utilities
export function toTaskFormValues(task: DbTask): TaskFormValues {
  const {
    id,
    created_at,
    updated_at,
    ...formData
  } = task
  
  return {
    ...formData,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority | undefined,
    recurring_config: task.recurring_config as RecurringConfig | null,
  }
}
