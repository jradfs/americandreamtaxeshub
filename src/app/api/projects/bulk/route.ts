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

    // Start transaction
    await supabase.rpc('begin_transaction')

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

      // Commit transaction
      await supabase.rpc('commit_transaction')

      // Fetch updated projects
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
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction')
      throw error
    }
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json(
      { error: 'Failed to update projects' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
