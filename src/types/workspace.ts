import { Database } from './supabase'

export type Task = {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  progress?: number
  due_date?: string
  start_date?: string
  estimated_hours?: number
  actual_hours?: number
  template_id?: string
  project_id?: string
  assignee_id?: string
  client_id?: string
  workspace_id: string
  parent_task_id?: string
  stage?: string
  tags?: string[]
  checklist?: ChecklistItem[]
  activity_log?: ActivityLogItem[]
  assignee?: {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
  }
  client?: {
    id: string
    full_name?: string
    company_name?: string
  }
  created_at: string
  updated_at: string
}

export type Status = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'
export type ViewType = 'list' | 'kanban' | 'calendar'
export type GroupingType = 'status' | 'priority' | 'due_date' | 'assignee' | 'none'

export type ChecklistItem = {
  id: string
  title: string
  completed: boolean
  due_date?: string
}

export type ActivityLogItem = {
  timestamp: string
  action: string
  user_id: string
  details: Record<string, any>
}

export type Workspace = {
  id: string
  name: string
  description?: string
  settings: WorkspaceSettings
  created_at: string
  updated_at: string
}

export type WorkspaceSettings = {
  default_view: ViewType
  default_grouping: GroupingType
  task_templates?: Record<string, any>
  custom_fields?: Record<string, any>
}