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
  title: string
  description?: string
  client_id?: string
  status: ProjectStatus
  priority: Priority
  due_date?: string
  service_type: ServiceCategory
  settings?: ProjectMetadata
  tasks?: TaskFormData[]
  team_members?: string[]
  service_info?: ServiceInfo
  metadata?: {
    estimated_hours?: number
    actual_hours?: number
    billable?: boolean
    tags?: string[]
    custom_fields?: Record<string, unknown>
  }
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
  if (!data.title?.trim()) {
    throw new APIError('Project title is required', 400, 'INVALID_TITLE')
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
    const body: CreateProjectRequest = await request.json()
    validateProjectData(body)

    // Start transaction
    await supabase.rpc('begin_transaction')

    try {
      // Create project with improved type safety
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: body.title.trim(),
          description: body.description?.trim(),
          client_id: body.client_id,
          status: body.status,
          priority: body.priority,
          due_date: body.due_date,
          service_type: body.service_type,
          settings: body.settings,
          template_id: body.template_id,
          service_info: body.service_info,
          metadata: {
            ...body.metadata,
            created_at: new Date().toISOString(),
            version: 1,
          },
        } satisfies NewProject)
        .select()
        .single()

      if (projectError) throw new APIError('Failed to create project', 500, 'DB_ERROR')

      // Create tasks with improved validation
      if (body.tasks?.length) {
        const { error: tasksError } = await supabase.from('tasks').insert(
          body.tasks.map((task, index) => ({
            title: task.title.trim(),
            description: task.description?.trim(),
            project_id: project.id,
            status: task.status || TaskStatus.TODO,
            priority: task.priority,
            due_date: task.due_date,
            assignee_id: task.assignee_id,
            dependencies: task.dependencies,
            order_index: index,
            estimated_minutes: task.estimated_minutes,
            category: task.category,
            tags: task.tags,
            checklist: task.checklist,
            metadata: {
              created_at: new Date().toISOString(),
              version: 1,
            },
          }))
        )

        if (tasksError) throw new APIError('Failed to create tasks', 500, 'TASK_ERROR')
      }

      // Add team members with improved error handling
      if (body.team_members?.length) {
        const { error: teamError } = await supabase.from('project_team_members').insert(
          body.team_members.map(userId => ({
            project_id: project.id,
            user_id: userId,
            added_at: new Date().toISOString(),
          }))
        )

        if (teamError) throw new APIError('Failed to add team members', 500, 'TEAM_ERROR')
      }

      // Commit transaction
      await supabase.rpc('commit_transaction')

      // Fetch complete project with relations
      const { data: fullProject, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          client:client_id (*),
          tax_return:tax_return_id (*),
          tasks (
            *,
            assignee:assignee_id (*)
          ),
          team_members:project_team_members (
            *,
            user:users (*)
          ),
          documents (
            *,
            uploaded_by:uploaded_by_id (*)
          )
        `)
        .eq('id', project.id)
        .single()

      if (fetchError) throw new APIError('Failed to fetch project details', 500, 'FETCH_ERROR')

      return NextResponse.json(fullProject as ProjectWithRelations)
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction')
      throw error
    }
  } catch (error) {
    console.error('Error in project creation:', error)
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
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
    const { searchParams } = new URL(request.url)
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:client_id (*),
        tax_return:tax_return_id (*),
        tasks (
          *,
          assignee:assignee_id (*)
        ),
        team_members:project_team_members (
          *,
          user:users (*)
        ),
        documents (
          *,
          uploaded_by:uploaded_by_id (*)
        )
      `)

    // Apply filters with type safety
    const filters: Partial<FilterState> = {
      status: searchParams.get('status') as ProjectStatus,
      priority: searchParams.get('priority') as Priority,
      client: searchParams.get('clientId') || undefined,
      search: searchParams.get('search') || undefined,
      service: searchParams.getAll('service_type') as ServiceCategory[],
      dateRange: {
        from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
        to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
      },
      isArchived: searchParams.get('archived') === 'true',
    }

    // Apply filters with proper type checking
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }

    if (filters.client) {
      query = query.eq('client_id', filters.client)
    }

    if (filters.service?.length) {
      query = query.in('service_type', filters.service)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.dateRange?.from) {
      query = query.gte('created_at', filters.dateRange.from.toISOString())
    }

    if (filters.dateRange?.to) {
      query = query.lte('created_at', filters.dateRange.to.toISOString())
    }

    // Handle archived projects
    query = query.eq('archived', filters.isArchived || false)

    // Execute query with proper error handling
    const { data: projects, error } = await query.order('created_at', { ascending: false })

    if (error) throw new APIError('Failed to fetch projects', 500, 'FETCH_ERROR')

    return NextResponse.json(projects as ProjectWithRelations[])
  } catch (error) {
    console.error('Error fetching projects:', error)
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
