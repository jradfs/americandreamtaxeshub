import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { Database } from '@/types/database.types'
import { 
  NewProject, 
  ProjectWithRelations, 
  ProjectStatus, 
  Priority,
  ServiceCategory,
  ProjectMetadata,
  ServiceInfo 
} from '@/types/projects'
import { TaskFormData, TaskStatus } from '@/types/tasks'
import { FilterState } from '@/types/hooks'
import { projectSchema } from '@/lib/validations/project'

// Example placeholder if you haven't defined it elsewhere
const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  client_id: z.string(),
  status: z.string(),
  priority: z.string(),
  due_date: z.string().optional(),
  service_type: z.string(),
  // ...any other fields you need...
});

interface CreateProjectRequest {
  template_id?: string
  name: string
  description?: string
  client_id: string
  status: ProjectStatus
  priority: Priority
  due_date?: string
  service_type: ServiceCategory
  tax_info?: Record<string, unknown>
  accounting_info?: Record<string, unknown>
  payroll_info?: Record<string, unknown>
  tasks?: TaskFormData[]
  team_members?: string[]
  tax_return_id?: number
  project_defaults?: Record<string, unknown>
}

// Error handling utility
class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Validation utilities
const validateProjectData = (data: CreateProjectRequest) => {
  try {
    projectSchema.parse(data)
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new APIError(err.errors.map(e => e.message).join(', '), 400, 'VALIDATION_ERROR')
    }
    throw new APIError('Unknown validation error', 400, 'UNKNOWN_VALIDATION_ERROR')
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: cookies(request) }
    )

    const data: CreateProjectRequest = await request.json()

    // Validate incoming data
    validateProjectData(data)

    let projectData: NewProject = {
      name: data.name,
      description: data.description,
      client_id: data.client_id,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      service_type: data.service_type,
      tax_info: data.tax_info || {},
      accounting_info: data.accounting_info || {},
      payroll_info: data.payroll_info || {},
      tax_return_id: data.tax_return_id || null,
      project_defaults: data.project_defaults || {}
    }

    // Insert project
    const { data: insertedProject, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (error || !insertedProject) {
      throw new APIError(error?.message || 'Failed to create project', error?.status || 500, error?.code)
    }

    // Handle tasks if any
    if (data.tasks && data.tasks.length > 0) {
      const tasksToInsert = data.tasks.map(task => ({
        project_id: insertedProject.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dependencies: task.dependencies,
        order_index: task.order_index || 0,
        assignee_id: task.assignee_id || null
      }))

      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksToInsert)

      if (tasksError) {
        throw new APIError(tasksError.message, tasksError.status || 500, tasksError.code)
      }
    }

    // Assign team members if any
    if (data.team_members && data.team_members.length > 0) {
      const teamAssignments = data.team_members.map(member_id => ({
        project_id: insertedProject.id,
        user_id: member_id
      }))

      const { error: teamError } = await supabase
        .from('project_team_members')
        .insert(teamAssignments)

      if (teamError) {
        throw new APIError(teamError.message, teamError.status || 500, teamError.code)
      }
    }

    return NextResponse.json(insertedProject, { status: 201 })
  } catch (err) {
    if (err instanceof APIError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
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

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:clients (
          id,
          company_name,
          full_name,
          contact_email,
          status,
          type
        ),
        tax_return:tax_returns (
          id,
          tax_year,
          filing_type,
          status,
          due_date
        ),
        tasks (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee:users (
            id,
            email,
            full_name
          )
        ),
        team_members:project_team_members (
          id,
          user:users (
            id,
            email,
            full_name
          )
        ),
        documents (
          id,
          file_name,
          file_type,
          uploaded_at,
          uploaded_by:users (
            id,
            email,
            full_name
          )
        )
      `)

    // Apply filters with type safety
    const filters: Partial<FilterState> = {
      status: searchParams.get('status') as ProjectStatus || undefined,
      priority: searchParams.get('priority') as Priority || undefined,
      client: searchParams.get('clientId') || undefined,
      search: searchParams.get('search') || undefined,
      service: searchParams.getAll('service_type').filter(Boolean) as ServiceCategory[],
      dateRange: {
        from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
      },
      isArchived: searchParams.get('archived') === 'true',
    }

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }
    if (filters.client) {
      query = query.eq('client_id', filters.client)
    }
    if (filters.service && filters.service.length > 0) {
      query = query.in('service_type', filters.service)
    }
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    if (filters.dateRange.from) {
      query = query.gte('due_date', filters.dateRange.from.toISOString())
    }
    if (filters.dateRange.to) {
      query = query.lte('due_date', filters.dateRange.to.toISOString())
    }
    if (filters.isArchived !== undefined) {
      query = query.eq('is_archived', filters.isArchived)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      throw new APIError(error.message, error.code === '42501' ? 403 : 500)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/projects:', error)
    if (error instanceof APIError) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: error.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
export const dynamic = 'force-dynamic'

