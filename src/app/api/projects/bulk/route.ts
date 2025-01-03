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
      updates: Partial<ProjectWithRelations> 
    } = await request.json()

    if (!projectIds?.length) {
      return NextResponse.json(
        { error: 'No project IDs provided' },
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
      if (updates.status === 'archived' as const) {
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
            contact_info
          ),
          tasks:tasks (*)
        `)
        .in('id', projectIds)

      if (fetchError) {
        throw fetchError
      }

      return NextResponse.json(updatedProjects)
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
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update projects' 
      },
      { status: 500 }
    )
  }
} // Add this brace
}

export const dynamic = 'force-dynamic'
