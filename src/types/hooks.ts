import { Database } from './database.types'
import { Json } from './database.types'
import { 
  ProjectStatus, 
  Priority, 
  ServiceCategory, 
  TaxReturnType,
  ReviewStatus
} from './projects'
import { TaskStatus, TaskCategory } from './tasks'

// Base metadata interface
export interface BaseMetadata {
  readonly id: string
  readonly created_at: string
  readonly updated_at: string
  version: number
  archived: boolean
}

// Main table types
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

// Task types moved to tasks.ts
export type { Task, TaskInsert, TaskUpdate } from './tasks'

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type TimeEntry = Database['public']['Tables']['time_entries']['Row']
export type TimeEntryInsert = Database['public']['Tables']['time_entries']['Insert']
export type TimeEntryUpdate = Database['public']['Tables']['time_entries']['Update']

export interface User extends BaseMetadata {
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'staff' | 'client'
  status: 'active' | 'inactive' | 'pending'
  preferences?: {
    theme?: 'light' | 'dark' | 'system'
    notifications?: {
      email?: boolean
      push?: boolean
      desktop?: boolean
    }
    defaultView?: 'list' | 'board' | 'calendar'
    timezone?: string
  }
  metadata?: Json
}

export type UserInsert = Omit<User, keyof BaseMetadata>
export type UserUpdate = Partial<UserInsert>

// Workflow and onboarding types
export interface WorkflowTemplate extends BaseMetadata {
  name: string
  description?: string
  service_type: ServiceCategory
  tasks: TemplateTask[]
  metadata?: {
    totalEstimatedTime: number
    categories: TaskCategory[]
    requiredSkills: string[]
    defaultAssignees?: string[]
    automationRules?: Array<{
      condition: string
      action: string
      parameters?: Record<string, unknown>
    }>
  }
}

export type WorkflowTemplateInsert = Omit<WorkflowTemplate, keyof BaseMetadata>
export type WorkflowTemplateUpdate = Partial<WorkflowTemplateInsert>

export interface ClientOnboardingWorkflow extends BaseMetadata {
  client_id: string
  template_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  due_date?: string
  assigned_to?: string[]
  progress: number
  metadata?: {
    completedSteps: string[]
    nextActions: string[]
    notes?: string
  }
}

export type ClientOnboardingWorkflowInsert = Omit<ClientOnboardingWorkflow, keyof BaseMetadata>
export type ClientOnboardingWorkflowUpdate = Partial<ClientOnboardingWorkflowInsert>

// Settings and notifications
export interface TimeTrackingSettings extends BaseMetadata {
  user_id: string
  default_billable: boolean
  minimum_increment: number
  round_to: 'nearest' | 'up' | 'down'
  work_hours: {
    monday?: [string, string]
    tuesday?: [string, string]
    wednesday?: [string, string]
    thursday?: [string, string]
    friday?: [string, string]
    saturday?: [string, string]
    sunday?: [string, string]
  }
  break_settings?: {
    auto_break?: boolean
    break_duration?: number
    work_duration_before_break?: number
  }
}

export interface Notification extends BaseMetadata {
  user_id: string
  type: 'task' | 'project' | 'message' | 'system'
  title: string
  content: string
  read: boolean
  action_url?: string
  priority: 'low' | 'medium' | 'high'
  metadata?: Json
}

// Document types with enhanced metadata
export interface DocumentMetadata extends BaseMetadata {
  name: string
  type: string
  size: number
  path: string
  uploaded_by: string
  metadata?: {
    contentType: string
    hash: string
    tags?: string[]
    ocr_processed?: boolean
    ocr_content?: string
    classification?: string
    sensitive?: boolean
  }
}

// Template types with enhanced validation
export interface TemplateTask extends BaseMetadata {
  template_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  estimated_minutes?: number
  dependencies?: string[]
  assignee_role?: 'admin' | 'manager' | 'staff'
  required_skills?: string[]
  checklist?: Array<{
    title: string
    required: boolean
    estimated_minutes?: number
  }>
  category?: TaskCategory
  tags?: string[]
  validation_rules?: Array<{
    type: 'required' | 'dependency' | 'custom'
    condition: string
    message: string
  }>
}

// Hook return types with proper generics
export interface UseQueryResult<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

export interface UseMutationResult<T, V = any> {
  data: T | null
  error: Error | null
  loading: boolean
  mutate: (variables: V) => Promise<T>
}

export interface UseInfiniteQueryResult<T> extends UseQueryResult<T[]> {
  hasMore: boolean
  loadMore: () => Promise<void>
  isFetchingMore: boolean
}

// Common hook options with enhanced typing
export interface QueryOptions<T> {
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
  retry?: number | boolean
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  select?: (data: T) => T
  suspense?: boolean
}

export interface MutationOptions<T, E = Error> {
  onSuccess?: (data: T) => void | Promise<void>
  onError?: (error: E) => void
  onSettled?: (data: T | null, error: E | null) => void
  throwOnError?: boolean
}

// Pagination and sorting with proper typing
export interface PaginationState {
  pageIndex: number
  pageSize: number
  total?: number
}

export interface SortingState {
  id: string
  desc: boolean
}

// Enhanced filter types
export interface DateRangeFilter {
  from?: Date
  to?: Date
}

export interface FilterState {
  search?: string
  status?: ProjectStatus[] | TaskStatus[]
  priority?: Priority[]
  assignee?: string[]
  category?: ServiceCategory[] | TaskCategory[]
  tags?: string[]
  dateRange?: DateRangeFilter
  client?: string
  service?: ServiceCategory[]
  reviewStatus?: ReviewStatus[]
  hasAttachments?: boolean
  isArchived?: boolean
}
