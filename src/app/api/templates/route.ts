import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { TemplateTask } from '@/types/hooks'

export interface TemplateResponse {
  id: string
  title: string
  description: string | null
  default_priority: Database['public']['Enums']['task_priority']
  project_defaults: Record<string, unknown>
  category: {
    id: string
    name: string
  }
  tasks?: TemplateTask[]
  metadata?: {
    totalEstimatedTime: number
    categories: string[]
    requiredSkills: string[]
  }
}

export interface CreateTemplateRequest {
  title: string
  description?: string | null
  default_priority: Database['public']['Enums']['task_priority']
  project_defaults?: Record<string, unknown>
  category_id: string
  tasks?: Array<{
    title: string
    description?: string | null
    priority?: Database['public']['Enums']['task_priority']
    dependencies?: string[]
    order_index?: number
    estimated_minutes?: number
    category?: string
    tags?: string[]
    checklist?: Array<{
      title: string
      completed: boolean
    }>
  }>
  metadata?: {
    requiredSkills: string[]
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
      .from('project_templates')
      .select(`
        *,
        category:template_category_id (*),
        tasks:template_tasks (*)
      `)

    // Apply filters
    const categoryId = searchParams.get('categoryId')
    if (categoryId) {
      query = query.eq('template_category_id', categoryId)
    }

    const search = searchParams.get('search')
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    const sortBy = searchParams.get('sortBy') || 'title'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data: templates, error } = await query

    if (error) throw error

    // Calculate metadata for each template
    const templatesWithMetadata = templates.map(template => {
      const totalEstimatedTime = template.tasks?.reduce((total, task) => 
        total + (task.estimated_minutes || 0), 0) || 0

      const categories = [...new Set(template.tasks?.map(task => task.category).filter(Boolean) || [])]

      return {
        ...template,
        metadata: {
          totalEstimatedTime,
          categories,
          requiredSkills: template.metadata?.requiredSkills || []
        }
      }
    })

    return NextResponse.json(templatesWithMetadata)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
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
    const body: CreateTemplateRequest = await request.json()

    // Validate required fields
    if (!body.title || !body.category_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Start transaction
    await supabase.rpc('begin_transaction')

    try {
      // Create template
      const { data: template, error: templateError } = await supabase
        .from('project_templates')
        .insert({
          title: body.title.trim(),
          description: body.description?.trim(),
          default_priority: body.default_priority,
          project_defaults: body.project_defaults || {},
          template_category_id: body.category_id,
          metadata: body.metadata || {}
        })
        .select()
        .single()

      if (templateError) throw templateError

      // Create tasks if provided
      if (body.tasks?.length) {
        const { error: tasksError } = await supabase
          .from('template_tasks')
          .insert(
            body.tasks.map((task, index) => ({
              title: task.title.trim(),
              description: task.description?.trim(),
              template_id: template.id,
              priority: task.priority || body.default_priority,
              order_index: task.order_index ?? index,
              estimated_minutes: task.estimated_minutes,
              category: task.category,
              tags: task.tags,
              checklist: task.checklist,
              dependencies: task.dependencies
            }))
          )

        if (tasksError) throw tasksError
      }

      // Commit transaction
      await supabase.rpc('commit_transaction')

      // Fetch complete template with relations
      const { data: fullTemplate, error: fetchError } = await supabase
        .from('project_templates')
        .select(`
          *,
          category:template_category_id (*),
          tasks:template_tasks (*)
        `)
        .eq('id', template.id)
        .single()

      if (fetchError) throw fetchError

      // Calculate metadata
      const totalEstimatedTime = fullTemplate.tasks?.reduce((total, task) => 
        total + (task.estimated_minutes || 0), 0) || 0

      const categories = [...new Set(fullTemplate.tasks?.map(task => task.category).filter(Boolean) || [])]

      return NextResponse.json({
        ...fullTemplate,
        metadata: {
          totalEstimatedTime,
          categories,
          requiredSkills: fullTemplate.metadata?.requiredSkills || []
        }
      })
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction')
      throw error
    }
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
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
    const { id, ...updates }: CreateTemplateRequest & { id: string } = await request.json()

    // Validate required fields
    if (!id || !updates.title || !updates.category_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Start transaction
    await supabase.rpc('begin_transaction')

    try {
      // Update template
      const { data: template, error: templateError } = await supabase
        .from('project_templates')
        .update({
          title: updates.title.trim(),
          description: updates.description?.trim(),
          default_priority: updates.default_priority,
          project_defaults: updates.project_defaults || {},
          template_category_id: updates.category_id,
          metadata: updates.metadata || {}
        })
        .eq('id', id)
        .select()
        .single()

      if (templateError) throw templateError

      // Update tasks if provided
      if (updates.tasks) {
        // Delete existing tasks
        const { error: deleteError } = await supabase
          .from('template_tasks')
          .delete()
          .eq('template_id', id)

        if (deleteError) throw deleteError

        // Insert new tasks
        if (updates.tasks.length) {
          const { error: tasksError } = await supabase
            .from('template_tasks')
            .insert(
              updates.tasks.map((task, index) => ({
                title: task.title.trim(),
                description: task.description?.trim(),
                template_id: id,
                priority: task.priority || updates.default_priority,
                order_index: task.order_index ?? index,
                estimated_minutes: task.estimated_minutes,
                category: task.category,
                tags: task.tags,
                checklist: task.checklist,
                dependencies: task.dependencies
              }))
            )

          if (tasksError) throw tasksError
        }
      }

      // Commit transaction
      await supabase.rpc('commit_transaction')

      // Fetch updated template with relations
      const { data: fullTemplate, error: fetchError } = await supabase
        .from('project_templates')
        .select(`
          *,
          category:template_category_id (*),
          tasks:template_tasks (*)
        `)
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Calculate metadata
      const totalEstimatedTime = fullTemplate.tasks?.reduce((total, task) => 
        total + (task.estimated_minutes || 0), 0) || 0

      const categories = [...new Set(fullTemplate.tasks?.map(task => task.category).filter(Boolean) || [])]

      return NextResponse.json({
        ...fullTemplate,
        metadata: {
          totalEstimatedTime,
          categories,
          requiredSkills: fullTemplate.metadata?.requiredSkills || []
        }
      })
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction')
      throw error
    }
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
