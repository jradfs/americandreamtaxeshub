import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { 
  DbWorkflowTemplate,
  DbWorkflowTemplateInsert,
  WorkflowTemplateWithRelations,
  WorkflowStep,
  WorkflowStatus,
  WORKFLOW_STATUS
} from '@/types/workflows'

interface CreateWorkflowRequest {
  name: string
  description?: string | null
  steps: WorkflowStep[]
}

interface UseWorkflowsOptions {
  initialFilters?: {
    status?: WorkflowStatus
    search?: string
  }
  pageSize?: number
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<WorkflowTemplateWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState(options.initialFilters || {})
  const [page, setPage] = useState(1)
  const [pageSize] = useState(options.pageSize || 10)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchWorkflows()
  }, [filters, page, pageSize])

  async function fetchWorkflows() {
    try {
      let query = supabase
        .from('workflow_templates')
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      // Execute query
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWorkflows(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching workflows:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'))
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }

  async function createWorkflow(workflowData: CreateWorkflowRequest): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: createError } = await supabase
        .from('workflow_templates')
        .insert({
          name: workflowData.name,
          description: workflowData.description,
          steps: workflowData.steps
        } satisfies DbWorkflowTemplateInsert)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (createError) throw createError

      setWorkflows(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create workflow')
      }
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<DbWorkflowTemplate>
  ): Promise<{ data: WorkflowTemplateWithRelations | null, error: Error | null }> {
    try {
      const { data, error: updateError } = await supabase
        .from('workflow_templates')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          workflows:client_onboarding_workflows(*)
        `)
        .single()

      if (updateError) throw updateError

      setWorkflows(prev =>
        prev.map(workflow =>
          workflow.id === id ? data : workflow
        )
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating workflow:', err)
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to update workflow')
      }
    }
  }

  async function deleteWorkflow(id: number): Promise<{ error: Error | null }> {
    try {
      const { error: deleteError } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting workflow:', err)
      return { 
        error: err instanceof Error ? err : new Error('Failed to delete workflow')
      }
    }
  }

  return {
    workflows,
    loading,
    error,
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  }
}
