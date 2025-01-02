import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { WorkflowTemplate, WorkflowStage, WorkflowTask } from '@/types/hooks'

interface CreateWorkflowRequest {
  title: string
  description?: string
  stages: Array<{
    title: string
    description?: string
    order_index: number
    tasks: Array<{
      title: string
      description?: string
      priority: Database['public']['Enums']['task_priority']
      dependencies?: string[]
    }>
  }>
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchWorkflows()
  }, [])

  async function fetchWorkflows() {
    try {
      const { data, error: fetchError } = await supabase
        .from('workflow_templates')
        .select(`
          *,
          stages:workflow_stages (
            *,
            tasks:workflow_tasks (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWorkflows(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching workflows:', err)
      setError('Failed to fetch workflows')
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }

  async function createWorkflow(workflowData: CreateWorkflowRequest) {
    try {
      // Create workflow template
      const { data: workflow, error: workflowError } = await supabase
        .from('workflow_templates')
        .insert({
          title: workflowData.title,
          description: workflowData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (workflowError) throw workflowError

      // Create stages
      for (const stage of workflowData.stages) {
        const { data: stageData, error: stageError } = await supabase
          .from('workflow_stages')
          .insert({
            workflow_id: workflow.id,
            title: stage.title,
            description: stage.description,
            order_index: stage.order_index
          })
          .select()
          .single()

        if (stageError) {
          // If stage creation fails, delete the workflow to maintain consistency
          await supabase.from('workflow_templates').delete().eq('id', workflow.id)
          throw stageError
        }

        // Create tasks for this stage
        if (stage.tasks && stage.tasks.length > 0) {
          const { error: tasksError } = await supabase
            .from('workflow_tasks')
            .insert(
              stage.tasks.map((task, index) => ({
                ...task,
                stage_id: stageData.id,
                order_index: index
              }))
            )

          if (tasksError) {
            // If task creation fails, delete the workflow to maintain consistency
            await supabase.from('workflow_templates').delete().eq('id', workflow.id)
            throw tasksError
          }
        }
      }

      // Fetch the complete workflow with relations
      const { data: fullWorkflow, error: fetchError } = await supabase
        .from('workflow_templates')
        .select(`
          *,
          stages:workflow_stages (
            *,
            tasks:workflow_tasks (*)
          )
        `)
        .eq('id', workflow.id)
        .single()

      if (fetchError) throw fetchError

      setWorkflows(prev => [fullWorkflow, ...prev])
      return { data: fullWorkflow, error: null }
    } catch (err) {
      console.error('Error creating workflow:', err)
      return { data: null, error: 'Failed to create workflow' }
    }
  }

  async function updateWorkflow(
    workflowId: string,
    updates: Partial<WorkflowTemplate>
  ) {
    try {
      const { data, error: updateError } = await supabase
        .from('workflow_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', workflowId)
        .select(`
          *,
          stages:workflow_stages (
            *,
            tasks:workflow_tasks (*)
          )
        `)
        .single()

      if (updateError) throw updateError

      setWorkflows(prev =>
        prev.map(workflow =>
          workflow.id === workflowId ? data : workflow
        )
      )
      return { data, error: null }
    } catch (err) {
      console.error('Error updating workflow:', err)
      return { data: null, error: 'Failed to update workflow' }
    }
  }

  async function deleteWorkflow(workflowId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('workflow_templates')
        .delete()
        .eq('id', workflowId)

      if (deleteError) throw deleteError

      setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting workflow:', err)
      return { error: 'Failed to delete workflow' }
    }
  }

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  }
}
