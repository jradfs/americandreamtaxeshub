import { Database } from './database.types'

// Main table types
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Tables['clients']['Insert']
export type ClientUpdate = Tables['clients']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Tables['projects']['Insert']
export type ProjectUpdate = Tables['projects']['Update']

export type Task = Database['public']['Tables']['tasks']['Row'] & {
  estimated_minutes?: number | null
  actual_minutes?: number | null
  dependencies?: string[] | null
  template_id?: string | null
  category?: string | null
  tags?: string[] | null
}
export type TaskInsert = Tables['tasks']['Insert']
export type TaskUpdate = Tables['tasks']['Update']

export type Document = Tables['documents']['Row']
export type DocumentInsert = Tables['documents']['Insert']
export type DocumentUpdate = Tables['documents']['Update']

export type TimeEntry = Tables['time_entries']['Row']
export type TimeEntryInsert = Tables['time_entries']['Insert']
export type TimeEntryUpdate = Tables['time_entries']['Update']

export type User = Tables['users']['Row']
export type UserInsert = Tables['users']['Insert']
export type UserUpdate = Tables['users']['Update']

// Workflow and onboarding types
export type WorkflowTemplate = Tables['workflow_templates']['Row']
export type ClientOnboardingWorkflow = Tables['client_onboarding_workflows']['Row']

// Settings and notifications
export type TimeTrackingSettings = Tables['time_tracking_settings']['Row']
export type Notification = Tables['notifications']['Row']

// Document types
export type ClientDocument = Tables['client_documents']['Row']

// Individual and owner types
export type Individual = Tables['individuals']['Row']
export type Owner = Tables['owners']['Row']

// Note type
export type Note = Tables['notes']['Row']

// Payroll service type
export type PayrollService = Tables['payroll_services']['Row']

// Tax return type
export type TaxReturn = Tables['tax_returns']['Row']

export type TemplateTask = Database['public']['Tables']['template_tasks']['Row'] & {
  dependencies?: string[]
}

export type ProjectTemplate = Database['public']['Tables']['project_templates']['Row'] & {
  tasks?: TemplateTask[]
}

export type Tables = Database['public']['Tables']
