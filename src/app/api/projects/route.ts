import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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

interface CreateProjectRequest {
  template_id?: string
  name: string
  description?: string
  client_id?: string
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
  if (!data.name?.trim()) {
    throw new APIError('Project name is required', 400, 'INVALID_NAME')
  }
  if (!data.service_type) {
    throw new APIError('Service type is required', 400, 'INVALID_SERVICE_TYPE')
  }
  if (data.tasks?.some(task => !task.title?.trim())) {
    throw new APIError('All tasks must have a title', 400, 'INVALID_TASK_TITLE')
  }
}

export async function POST(request: Request) {
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body: CreateProjectRequest = await request.json()
    const { 
      name,
      description,
      client_id,
      service_type,
      priority,
      due_date,
      status,
      tasks,
      tax_return_id,
      tax_info,
      accounting_info,
      payroll_info
    } = body;

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description?.trim(),
        client_id,
        service_type,
        priority,
        due_date,
        status,
        tax_return_id,
        tax_info,
        accounting_info,
        payroll_info,
        created_by: user.id // Add creator information
      })
      .select()
      .single();

    if (projectError) throw projectError;

    if (tasks && tasks.length > 0) {
      const projectTasks = tasks.map((task: any) => ({
        ...task,
        project_id: project.id,
        status: 'not_started',
        assignee_id: task.assignee_id || user.id // Use specified assignee or default to creator
      }));

      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(projectTasks);

      if (tasksError) throw tasksError;
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof APIError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
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
