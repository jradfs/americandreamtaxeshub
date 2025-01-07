import { z } from 'zod'
import type { Database } from './database.types'

type DbEnums = Database['public']['Enums']

// Contact Info Schema
export const contactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
})

// Client Schema
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  contact_info: contactInfoSchema,
  status: z.enum(['active', 'inactive', 'pending', 'archived'] as const satisfies readonly DbEnums['client_status'][]),
  type: z.enum(['business', 'individual'] as const satisfies readonly DbEnums['client_type'][]).optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Project Schema
export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  client_id: z.string().uuid(),
  status: z.enum([
    'not_started',
    'on_hold',
    'cancelled',
    'todo',
    'in_progress',
    'review',
    'blocked',
    'completed',
    'archived'
  ] as const satisfies readonly DbEnums['project_status'][]),
  service_type: z.enum([
    'tax_return',
    'bookkeeping',
    'payroll',
    'advisory'
  ] as const satisfies readonly DbEnums['service_type'][]).optional(),
  start_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Task Schema
export const taskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum([
    'todo',
    'in_progress',
    'review',
    'completed'
  ] as const satisfies readonly DbEnums['task_status'][]),
  priority: z.enum([
    'low',
    'medium',
    'high',
    'urgent'
  ] as const satisfies readonly DbEnums['task_priority'][]),
  project_id: z.string().uuid().optional(),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Task Status Transitions
export const taskStatusTransitions = {
  todo: ['in_progress', 'review'],
  in_progress: ['todo', 'review', 'completed'],
  review: ['in_progress', 'completed'],
  completed: ['review']
} as const

// Utility type for valid status transitions
export type ValidStatusTransition<T extends DbEnums['task_status']> = typeof taskStatusTransitions[T][number]

// Form Data Schemas
export const clientFormSchema = clientSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const projectFormSchema = projectSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const taskFormSchema = taskSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

// Type Inference
export type ClientFormData = z.infer<typeof clientFormSchema>
export type ProjectFormData = z.infer<typeof projectFormSchema>
export type TaskFormData = z.infer<typeof taskFormSchema>

// Validation Functions
export const validateClient = (data: unknown) => clientSchema.parse(data)
export const validateProject = (data: unknown) => projectSchema.parse(data)
export const validateTask = (data: unknown) => taskSchema.parse(data)

// Safe Status Transition Validator
export const validateTaskStatusTransition = (
  currentStatus: DbEnums['task_status'],
  newStatus: DbEnums['task_status']
): boolean => {
  const allowedTransitions = taskStatusTransitions[currentStatus]
  return allowedTransitions.includes(newStatus as any)
} 