import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { WorkflowTemplate } from '@/types/hooks'

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

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: workflows, error } = await supabase
      .from('workflow_templates')
      .select(`
        *,
        stages:workflow_stages (
          *,
          tasks:workflow_tasks (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const body: CreateWorkflowRequest = await request.json()

    // Create workflow template
    const { data: workflow, error: workflowError } = await supabase
      .from('workflow_templates')
      .insert({
        title: body.title,
        description: body.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (workflowError) {
      throw workflowError
    }

    // Create stages
    for (const stage of body.stages) {
      const { error: stageError } = await supabase
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
              stage_id: stage.id,
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

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json(fullWorkflow)
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'