import { Database } from './database.types'

export type Task = Database['public']['Tables']['tasks']['Row']
export type NewTask = Database['public']['Tables']['tasks']['Insert']
export type UpdateTask = Database['public']['Tables']['tasks']['Update']

export type TaskWithRelations = Task & {
  assignee?: {
    id: string
    name?: string
    avatar_url?: string
  }
  project?: {
    id: string
    title: string
  }
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export const taskStatusOptions = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'In Review', value: 'review' },
  { label: 'Completed', value: 'completed' },
  { label: 'Blocked', value: 'blocked' },
]

export const taskPriorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

export const getStatusColor = (status: TaskStatus) => {
  const colors: Record<TaskStatus, string> = {
    'todo': 'bg-slate-500',
    'in-progress': 'bg-blue-500',
    'review': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'blocked': 'bg-red-500',
  }
  return colors[status]
}

export const getPriorityColor = (priority: TaskPriority) => {
  const colors: Record<TaskPriority, string> = {
    'low': 'bg-slate-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-red-500',
    'urgent': 'bg-red-700',
  }
  return colors[priority]
}