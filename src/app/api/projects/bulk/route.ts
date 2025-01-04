import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { ProjectWithRelations } from '@/types/projects'
import type { Json } from '@/types/database.types'

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

    const body = await request.json();
    
    // Validate request body structure
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

    const { projectIds, updates } = body as {
      projectIds: string[],
      updates: Partial<Pick<Database['public']['Tables']['projects']['Update'],
        'status' | 'priority' | 'due_date' | 'description' | 'service_info' | 'accounting_info' | 'payroll_info' | 'tax_info'
      >>
    };

    // Validate required fields
    if (!projectIds || !updates || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: {
            required: ['projectIds (array)', 'updates (object)'],
            received: {
              projectIds: projectIds ? 'array' : 'missing',
              updates: updates ? 'object' : 'missing'
            }
          }
        },
        { status: 400 }
      );
    }

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
      // Validate updates object
      const validUpdates: Partial<Database['public']['Tables']['projects']['Update']> = {
        ...(updates.status && { status: updates.status }),
        ...(updates.priority && { priority: updates.priority }),
        ...(updates.due_date && { due_date: updates.due_date }),
        ...(updates.description && { description: updates.description }),
        ...(updates.service_info && { service_info: JSON.stringify(updates.service_info) }),
        ...(updates.accounting_info && { accounting_info: JSON.stringify(updates.accounting_info) }),
        ...(updates.payroll_info && { payroll_info: JSON.stringify(updates.payroll_info) }),
        ...(updates.tax_info && { tax_info: JSON.stringify(updates.tax_info) }),
        updated_at: new Date().toISOString()
      };

      if (Object.keys(validUpdates).length === 0) {
        return NextResponse.json(
          { error: 'No valid updates provided' },
          { status: 400 }
        );
      }

      // Update projects with validated updates
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          ...validUpdates,
          updated_at: new Date().toISOString()
        })
        .in('id', projectIds);

      if (projectError) {
        console.error('Project update error:', projectError);
        throw new Error(`Failed to update projects: ${projectError.message}`);
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
            tax_info,
            created_at,
            updated_at,
            user_id
          ),
          tasks:tasks!tasks_project_id_fkey (*)
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

      // Map the response to match ProjectWithRelations type
      const mappedProjects = updatedProjects.map(project => {
        const tasks = project.tasks?.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || null,
          status: task.status as Database['public']['Enums']['task_status'],
          priority: task.priority as Database['public']['Enums']['task_priority'] || null,
          project_id: task.project_id || null,
          assignee_id: task.assignee_id || null,
          category: task.category as Database['public']['Enums']['service_type'] || null,
          due_date: task.due_date || null,
          start_date: task.start_date || null,
          created_at: task.created_at || null,
          updated_at: task.updated_at || null,
          assignee: task.assignee ? {
            id: task.assignee.id,
            email: task.assignee.email,
            full_name: task.assignee.full_name,
            role: task.assignee.role as Database['public']['Enums']['user_role'],
            created_at: task.assignee.created_at || null,
            updated_at: task.assignee.updated_at || null,
            projects_managed: task.assignee.projects_managed || null
          } : null,
          assigned_team: task.assigned_team ? task.assigned_team.map(user => ({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role as Database['public']['Enums']['user_role'],
            created_at: user.created_at || null,
            updated_at: user.updated_at || null,
            projects_managed: user.projects_managed || null
          })) : null
        }))
        
        return {
          ...project,
          client: project.client ? {
            id: project.client.id,
            contact_email: project.client.contact_email,
            full_name: project.client.full_name,
            company_name: project.client.company_name,
            business_tax_id: project.client.business_tax_id,
            individual_tax_id: project.client.individual_tax_id,
            contact_info: project.client.contact_info,
            created_at: project.client.created_at || null,
            updated_at: project.client.updated_at || null,
            user_id: project.client.user_id || null,
            status: project.client.status as Database['public']['Enums']['client_status'],
            type: project.client.type as Database['public']['Enums']['client_type'] | null,
            tax_info: project.client.tax_info
          } : null,
          tasks: tasks as (Database['public']['Tables']['tasks']['Row'] & {
            assignee?: Database['public']['Tables']['users']['Row'] | null
            assigned_team?: Database['public']['Tables']['users']['Row'][]
          })[],
          primary_manager: project.primary_manager ? {
            id: project.primary_manager.id,
            email: project.primary_manager.email,
            full_name: project.primary_manager.full_name,
            role: project.primary_manager.role as Database['public']['Enums']['user_role'],
            created_at: project.primary_manager.created_at || null,
            updated_at: project.primary_manager.updated_at || null,
            projects_managed: project.primary_manager.projects_managed || null
          } : null
        }
      }) as unknown as ProjectWithRelations[]

      return NextResponse.json<{
        data: ProjectWithRelations[],
        message: string
      }>({
        data: mappedProjects,
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

export const dynamic = 'force-dynamic'
