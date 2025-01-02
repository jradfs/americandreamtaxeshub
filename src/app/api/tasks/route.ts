import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { TaskFormData, TaskWithRelations } from '@/types/tasks'

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const assigneeId = searchParams.get('assigneeId')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:assignee_id (*),
        project:project_id (
          id,
          title,
          client_id
        )
      `)
      .order('due_date', { ascending: true })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (assigneeId) {
      query = query.eq('assignee_id', assigneeId)
    }

    const { data: tasks, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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

    const body: TaskFormData = await request.json()

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (taskError) {
      throw taskError
    }

    // Fetch the complete task with relations
    const { data: fullTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:assignee_id (*),
        project:project_id (
          id,
          title,
          client_id
        )
      `)
      .eq('id', task.id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json(fullTask)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

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

    const { id, ...updates }: TaskFormData & { id: string } = await request.json()

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (taskError) {
      throw taskError
    }

    // Fetch the complete task with relations
    const { data: updatedTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:assignee_id (*),
        project:project_id (
          id,
          title,
          client_id
        )
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
