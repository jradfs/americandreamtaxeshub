import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { ProjectWithRelations } from '@/types/projects'

export async function PUT(request: Request) {
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

    const { projectIds, updates }: { 
      projectIds: string[], 
      updates: Partial<Pick<ProjectWithRelations, 
        'status' | 'priority' | 'due_date' | 'description' | 'service_info'
      >> 
    } = await request.json()

    // Validate updates structure
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return NextResponse.json<{ error: string }>(
        { error: 'Invalid updates format' },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (updates.status && ![
      'not_started',
      'on_hold',
      'cancelled',
      'todo',
      'in_progress',
      'review',
      'blocked',
      'completed',
      'archived'
    ].includes(updates.status)) {
      return NextResponse.json(
        { error: 'Invalid project status' },
        { status: 400 }
      )
    }

    if (!projectIds?.length || !Array.isArray(projectIds)) {
      return NextResponse.json<{ error: string }>(
        { error: 'No project IDs provided or invalid format' },
        { status: 400 }
      )
    }

    // Validate project IDs are UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (projectIds.some(id => !uuidRegex.test(id))) {
      return NextResponse.json<{ error: string }>(
        { error: 'Invalid project ID format' },
        { status: 400 }
      )
    }

    // Start transaction (if needed)
    // await supabase.rpc('your_valid_rpc_function')

    try {
      // Update projects
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('id', projectIds)

      if (projectError) {
        throw projectError
      }

      // If updating status to archived, also archive related tasks
      if (updates.status === 'archived') {
        const { error: tasksError } = await supabase
          .from('tasks')
          .update({
            status: 'archived',
            updated_at: new Date().toISOString()
          })
          .in('project_id', projectIds)

        if (tasksError) {
          throw tasksError
        }
      }

      // Commit transaction if the function exists
      try {
        await supabase.rpc('commit_transaction')
      } catch (error) {
        console.warn('commit_transaction RPC not available, continuing without transaction')
      }

      // Fetch updated projects with proper typing
      const { data: updatedProjects, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            full_name,
            company_name,
            contact_email,
            contact_info,
            business_tax_id,
            individual_tax_id,
            status,
            type,
            tax_info
          ),
          tasks:tasks (*)
        `)
        .in('id', projectIds)

      if (fetchError) {
        throw fetchError
      }

      if (!updatedProjects) {
        return NextResponse.json<{ error: string }>(
          { error: 'Failed to fetch updated projects' },
          { status: 500 }
        )
      }

      return NextResponse.json<{
        data: ProjectWithRelations[],
        message: string
      }>({
        data: updatedProjects,
        message: `Successfully updated ${projectIds.length} projects`
      })
    } catch (error: unknown) {
      // Attempt rollback if available
      try {
        await supabase.rpc('rollback_transaction')
      } catch (rollbackError) {
        console.warn('rollback_transaction RPC not available')
      }
      
      if (error instanceof Error) {
        console.error('Error in bulk update:', error)
        throw error
      }
      throw new Error('Unknown error occurred during bulk update')
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in bulk update:', error)
      const errorMessage = error.message
      console.error('Bulk update error:', errorMessage)
      
      return NextResponse.json<{ 
        error: string,
        details?: string 
      }>(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      )
    }
    return NextResponse.json<{ error: string }>(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}
}

export const dynamic = 'force-dynamic'
