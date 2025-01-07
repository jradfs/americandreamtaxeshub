import { Project, ProjectTemplate, ProjectFormValues } from './projects'
import { Task, TaskStatus, ReviewStatus } from './tasks'
import { Client } from './clients'
import { Database } from './database.types'

// Re-export database enums
export type ProjectStatus = Database['public']['Enums']['project_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type ClientStatus = Database['public']['Enums']['client_status']
export type ClientType = Database['public']['Enums']['client_type']
export type ServiceType = Database['public']['Enums']['service_type']

// Re-export all types to ensure they are available
export type {
  Project,
  ProjectTemplate,
  ProjectFormValues,
  Task,
  TaskStatus,
  ReviewStatus,
  Client,
  Database
}

export type WorkflowTemplate = {
  id: number
  name: string
  description?: string | null
  steps: Array<{
    title: string
    description?: string
    status?: 'pending' | 'in_progress' | 'completed'
  }>
  created_at?: string | null
}

export type TemplateTask = {
  id: string
  title: string
  description: string
  order_index: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  template_id: string
  dependencies: string[]
  created_at: string
  updated_at: string
}

export type TaxReturn = {
  id?: string
  project_id?: string
  tax_year: number
  filing_type?: string
  status?: string
  filing_deadline?: string
  extension_filed?: boolean
  created_at?: string
  updated_at?: string
}

export type WorkflowStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type WorkflowTask = Task & { workflow_id?: string }

export type ClientOnboardingWorkflow = Database['public']['Tables']['client_onboarding_workflows']['Row'] & {
  steps?: Array<{
    title: string
    description?: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
}

export type Document = Database['public']['Tables']['client_documents']['Row'] & {
  project?: Database['public']['Tables']['projects']['Row'] | null
  client?: Database['public']['Tables']['clients']['Row'] | null
}

export type DocumentFormData = Omit<Document, 'id' | 'uploaded_at'>

export type Note = Database['public']['Tables']['notes']['Row']

export type PayrollService = Database['public']['Tables']['payroll_services']['Row']

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ServiceCategory = 'tax_returns' | 'payroll' | 'accounting' | 'tax_planning' | 'compliance' | 'uncategorized'

export type ProjectFilters = {
  search?: string
  service?: string[]
  serviceType?: string[]
  service_category?: string[]
  status?: string[]
  priority?: string[]
  dateRange?: { start: string; end: string }
  dueDateRange?: { from: Date; to: Date }
  clientId?: string
  teamMemberId?: string
  tags?: string[]
  hasDocuments?: boolean
  hasNotes?: boolean
  hasTimeEntries?: boolean
  returnType?: string[]
  reviewStatus?: string[]
  dueThisWeek?: boolean
  dueThisMonth?: boolean
  dueThisQuarter?: boolean
}

export type ProjectAnalytics = {
  completionRate: number
  riskLevel: string
  predictedDelay: number
  resourceUtilization: number
  recommendations: string[]
}
