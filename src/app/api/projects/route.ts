import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from 'types/database'

interface CreateProjectRequest {
  template_id: string
  title: string
  description?: string
  settings: Record<string, unknown>
  tasks: Array<{
    title: string
    description?: string
    priority: string
    dependencies?: string[]
  }>
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

  const body: CreateProjectRequest = await request.json()

  try {
    // Create the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: body.title,
        description: body.description,
        settings: body.settings,
        template_id: body.template_id
      })
      .select()
      .single()

    if (projectError) {
      throw projectError
    }

    // Create tasks from template
    if (body.tasks && body.tasks.length > 0) {
      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(body.tasks.map(task => ({
          project_id: project.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dependencies: task.dependencies || []
        })))

      if (tasksError) {
        throw tasksError
      }
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create project'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
