import { z } from 'zod'
import type { Database } from './database.types'

// Re-export database enums
export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']

// Base task type from database
export type DbTask = Database['public']['Tables']['tasks']['Row']
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert']
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update']

// Task with relationships
export interface TaskWithRelations extends DbTask {
  project: {
    id: string
    name: string
  } | null
  assignee: {
    id: string
    email: string
    full_name: string
    role: Database['public']['Enums']['user_role']
  } | null
  parent_task: {
    id: string
    title: string
  } | null
  checklist_items: Array<{
    id: string
    title: string
    completed: boolean
    description: string | null
    task_id: string
  }> | null
  activity_log_entries: Array<{
    id: string
    action: string
    details: string | null
    performed_by: string
    created_at: string | null
  }> | null
}

// Task form schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).nullable(),
  project_id: z.string().uuid().nullable(),
  assignee_id: z.string().uuid().nullable(),
  due_date: z.string().datetime().nullable(),
  start_date: z.string().datetime().nullable(),
  tax_form_type: z.string().nullable(),
  category: z.string().nullable(),
  checklist: z.object({
    items: z.array(z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean(),
      description: z.string().nullable(),
      task_id: z.string()
    })).nullable(),
    completed_count: z.number(),
    total_count: z.number()
  }).nullable(),
  activity_log: z.array(z.object({
    action: z.string(),
    timestamp: z.string(),
    user_id: z.string(),
    details: z.string()
  })).nullable(),
  recurring_config: z.record(z.unknown()).nullable()
})

// Form data type
export type TaskFormData = z.infer<typeof taskSchema>

// Constants
export const taskStatusOptions = ['todo', 'in_progress', 'review', 'completed'] as const
export const taskPriorityOptions = ['low', 'medium', 'high', 'urgent'] as const

// Type guards
export function hasProject(task: TaskWithRelations): task is TaskWithRelations & { project: NonNullable<TaskWithRelations['project']> } {
  return task.project !== null
}

export function hasAssignee(task: TaskWithRelations): task is TaskWithRelations & { assignee: NonNullable<TaskWithRelations['assignee']> } {
  return task.assignee !== null
}

// Helper function to convert database task to form data
export function toTaskFormData(task: TaskWithRelations): TaskFormData {
  return {
    title: task.title,
    description: task.description || '',
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority | null,
    project_id: task.project_id,
    assignee_id: task.assignee_id,
    due_date: task.due_date,
    start_date: task.start_date,
    tax_form_type: task.tax_form_type,
    category: task.category,
    checklist: task.checklist_items ? {
      items: task.checklist_items,
      completed_count: task.checklist_items.filter(item => item.completed).length,
      total_count: task.checklist_items.length
    } : null,
    activity_log: task.activity_log_entries?.map(entry => ({
      action: entry.action,
      timestamp: entry.created_at || '',
      user_id: entry.performed_by,
      details: entry.details || ''
    })) || null,
    recurring_config: task.recurring_config
  }
}

// Helper function to convert form data to database task
export function toDbTaskInsert(formData: TaskFormData): DbTaskInsert {
  return {
    title: formData.title,
    description: formData.description,
    status: formData.status,
    priority: formData.priority,
    project_id: formData.project_id,
    assignee_id: formData.assignee_id,
    due_date: formData.due_date,
    start_date: formData.start_date,
    tax_form_type: formData.tax_form_type,
    category: formData.category,
    recurring_config: formData.recurring_config
  }
}
