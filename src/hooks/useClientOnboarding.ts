import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ClientOnboardingWorkflow, WorkflowTemplate } from '@/types/hooks'

export function useClientOnboarding(clientId?: string) {
  const [workflow, setWorkflow] = useState<ClientOnboardingWorkflow | null>(null)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clientId) {
      fetchWorkflow()
    }
    fetchTemplates()
  }, [clientId])

  async function fetchWorkflow() {
    if (!clientId) return

    try {
      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .select('*')
        .eq('client_id', clientId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      
      // Transform the data to include steps if progress exists
      if (data) {
        const progressData = data.progress ? JSON.parse(data.progress) : null
        const workflowData: ClientOnboardingWorkflow = {
          ...data,
          steps: progressData?.steps || []
        }
        setWorkflow(workflowData)
      } else {
        setWorkflow(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .order('name')

      if (error) throw error
      
      // Transform the templates data to parse steps JSON
      const transformedTemplates = (data || []).map(template => ({
        ...template,
        steps: Array.isArray(template.steps) 
          ? template.steps 
          : typeof template.steps === 'string'
            ? JSON.parse(template.steps)
            : []
      })) as WorkflowTemplate[]
      
      setTemplates(transformedTemplates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  async function startWorkflow(clientId: string, templateId: number) {
    try {
      if (!clientId || !templateId) {
        throw new Error('Client ID and template ID are required')
      }

      const template = templates.find(t => t.id === templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const workflowData = {
        client_id: clientId,
        template_id: templateId,
        status: 'in_progress',
        progress: JSON.stringify({
          currentStep: 0,
          totalSteps: template.steps.length,
          completedSteps: [],
          steps: template.steps.map(step => ({
            ...step,
            status: 'pending'
          }))
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .insert([workflowData])
        .select()

      if (error) throw error
      if (data && data[0]) {
        const progressData = JSON.parse(data[0].progress || '{}')
        const workflowWithSteps: ClientOnboardingWorkflow = {
          ...data[0],
          steps: progressData.steps || []
        }
        setWorkflow(workflowWithSteps)
        return workflowWithSteps
      }
      throw new Error('Failed to start workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function updateWorkflow(
    id: number,
    updates: Partial<Omit<ClientOnboardingWorkflow, 'id' | 'created_at' | 'client_id'>>
  ) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('client_onboarding_workflows')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      if (data && data[0]) {
        setWorkflow(data[0])
        return data[0]
      }
      throw new Error('Failed to update workflow')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  async function deleteWorkflow(id: number) {
    try {
      if (!id) {
        throw new Error('Workflow ID is required')
      }

      const { error } = await supabase
        .from('client_onboarding_workflows')
        .delete()
        .eq('id', id)

      if (error) throw error
      setWorkflow(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  return {
    workflow,
    templates,
    loading,
    error,
    startWorkflow,
    updateWorkflow,
    deleteWorkflow,
    refresh: fetchWorkflow
  }
}
