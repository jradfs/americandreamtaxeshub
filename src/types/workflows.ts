import { Database } from './database.types'

// Base types from database
export type DbWorkflowTemplate = Database['public']['Tables']['workflow_templates']['Row']
export type DbWorkflowTemplateInsert = Database['public']['Tables']['workflow_templates']['Insert']
export type DbWorkflowTemplateUpdate = Database['public']['Tables']['workflow_templates']['Update']

// Workflow status enum
export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
} as const

export type WorkflowStatus = typeof WORKFLOW_STATUS[keyof typeof WORKFLOW_STATUS]

// Step type for workflow templates
export interface WorkflowStep {
  id: string
  title: string
  description?: string | null
  order: number
  required: boolean
  dependencies?: string[] | null
  metadata?: Record<string, unknown> | null
}

// Extended type with relationships
export interface WorkflowTemplateWithRelations extends DbWorkflowTemplate {
  workflows?: Database['public']['Tables']['client_onboarding_workflows']['Row'][] | null
}

// Form data types
export type WorkflowFormData = Omit<DbWorkflowTemplateInsert, 'id' | 'created_at' | 'updated_at'> 