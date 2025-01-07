import type { Database } from './database.types'
import type { Json } from './database.types'
import { z } from 'zod'
import { taskSchema } from '@/lib/validations/task'

// Database types
export type DbTask = Database['public']['Tables']['tasks']['Row']
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']

// Enums from database
export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']

// JSON field types with strong typing
export type ChecklistItem = {
  id: string
  text: string
  completed: boolean
  added_by?: string
  added_at?: string
}

export type Checklist = {
  items: ChecklistItem[]
}

export type ActivityLogEntry = {
  id: string
  type: 'status_change' | 'assignment' | 'comment' | 'checklist_update'
  user_id: string
  timestamp: string
  details: Record<string, unknown>
}

export type ActivityLog = {
  entries: ActivityLogEntry[]
}

export type RecurringConfig = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  end_date?: string
  end_occurrences?: number
}

// Form data type that matches our schema
export type TaskFormValues = z.infer<typeof taskSchema>

// Enhanced task type with relationships and strongly typed JSON fields
export type TaskWithRelations = Omit<DbTask, 'checklist' | 'activity_log' | 'recurring_config'> & {
  checklist: Checklist | null
  activity_log: ActivityLog | null
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
    checklist: task.checklist as Checklist | null,
    activity_log: task.activity_log as ActivityLog | null,
    recurring_config: task.recurring_config as RecurringConfig | null,
  }
}
