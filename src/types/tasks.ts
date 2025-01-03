import { Database } from './database.types'
import type { Json } from './database.types'
import { User } from './hooks'
import { ProjectStatus, Priority, ServiceCategory, TaxReturnType } from './projects'

// Base types from database
export type Task = Database['public']['Tables']['tasks']['Row'] & {
  status: Database['public']['Enums']['task_status']
  priority?: Database['public']['Enums']['task_priority']
  assignee?: User
  project?: {
    id: string
    title: string
    service_type: ServiceCategory
    client_id: string
    status: ProjectStatus
    priority: Priority
  }
  category?: Database['public']['Enums']['service_type'] | null
  due_date?: string | null
}
export type NewTask = Database['public']['Tables']['tasks']['Insert']
export type UpdateTask = Database['public']['Tables']['tasks']['Update']

// Enum types
export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type TaskCategory = 
  | 'general'
  | 'tax_preparation'
  | 'bookkeeping'
  | 'payroll'
  | 'compliance'
  | 'review'
  | 'client_communication'
  | 'documentation'
  | 'research'
  | 'other'

// Task metadata interface
export interface TaskMetadata {
  readonly id: string
  readonly created_at: string
  readonly updated_at: string
  version: number
  archived: boolean
}

// Base task interface
export interface TaskBase extends TaskMetadata {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project_id: string
  assignee_id?: string
  due_date?: string
  start_date?: string
  estimated_minutes?: number
  actual_minutes?: number
  dependencies?: string[]
  category?: TaskCategory
  tags?: string[]
  metadata?: Json
}

// Task with all relations
export interface TaskWithRelations extends TaskBase {
  assignee?: User
  project?: {
    id: string
    title: string
    service_type: ServiceCategory
    client_id: string
    status: ProjectStatus
    priority: Priority
  }
  dependencies?: TaskWithRelations[]
  dependents?: TaskWithRelations[]
  time_entries?: Array<{
    id: string
    duration: number
    billable: boolean
    description?: string
    user_id: string
    created_at: string
    updated_at: string
  }>
  checklist?: Array<{
    id: string
    title: string
    completed: boolean
    created_at: string
    updated_at: string
  }>
  attachments?: Array<{
    id: string
    name: string
    type: string
    url: string
    uploaded_by: string
    upload_date: string
    metadata?: Json
  }>
}

// Task status options with proper type inference
export const taskStatusOptions = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'In Review', value: 'review' },
  { label: 'Completed', value: 'completed' },
  { label: 'Blocked', value: 'blocked' },
] as const

// Task priority options with proper type inference
export const taskPriorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const

// Utility functions with proper typing
export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    'todo': 'bg-slate-500',
    'in_progress': 'bg-blue-500',
    'review': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'blocked': 'bg-red-500',
  }
  
  if (!status || !(status in colors)) {
    console.warn('Invalid task status:', status);
    return 'bg-gray-500'; // Default color
  }
  
  return colors[status]
}

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    'low': 'bg-slate-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500',
  }
  return colors[priority]
}

// Form data interface with enhanced type safety
export interface TaskFormData extends Omit<TaskBase, 'id' | 'created_at' | 'updated_at' | 'version' | 'archived'> {
  id?: string
  checklist?: Array<{
    title: string
    completed: boolean
  }>
  tax_form_type?: TaxReturnType
  tax_year?: number
  review_required?: boolean
  reviewer_id?: string
}

// Task grouping interface
export interface TaskSection {
  todo: TaskWithRelations[]
  in_progress: TaskWithRelations[]
  review: TaskWithRelations[]
  completed: TaskWithRelations[]
  blocked: TaskWithRelations[]
  metadata: {
    completionRate: number
    totalEstimatedTime: number
    totalActualTime: number
    assignees: Array<{
      id: string
      name: string
      taskCount: number
      estimatedHours: number
      actualHours: number
    }>
    categories: Array<{
      name: TaskCategory
      taskCount: number
      completionRate: number
    }>
    tags: Array<{
      name: string
      taskCount: number
    }>
  }
}

// Component props interfaces
export interface TaskBoardProps {
  tasks: TaskWithRelations[]
  onUpdateTask: (taskId: string, updates: UpdateTask) => Promise<void>
  onEditTask: (task: TaskWithRelations) => void
  onDeleteTask?: (taskId: string) => Promise<void>
  onAssignTask?: (taskId: string, userId: string) => Promise<void>
  onAddTimeEntry?: (taskId: string, duration: number, billable: boolean) => Promise<void>
  onUpdateChecklist?: (taskId: string, checklist: TaskFormData['checklist']) => Promise<void>
  filters?: {
    assignee?: string
    category?: TaskCategory
    priority?: TaskPriority
    tags?: string[]
    showArchived?: boolean
  }
  sorting?: {
    field: keyof TaskBase
    direction: 'asc' | 'desc'
  }
}

export interface CalendarViewProps {
  tasks: TaskWithRelations[]
  onSelectTask: (task: TaskWithRelations) => void
  onCreateTask: (taskData: NewTask) => Promise<void>
  onUpdateTask: (taskId: string, updates: UpdateTask) => Promise<void>
  onDeleteTask?: (taskId: string) => Promise<void>
  filters?: {
    assignee?: string
    category?: TaskCategory
    priority?: TaskPriority
    tags?: string[]
    dateRange?: {
      start: Date
      end: Date
    }
    showArchived?: boolean
  }
  view?: 'month' | 'week' | 'day'
  defaultDate?: Date
}
