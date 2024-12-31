import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch projects with related data
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info
        ),
        tasks (
          id,
          title,
          description,
          status,
          priority,
          due_date
        )
      `)
      .order('created_at', { ascending: false })
      .eq('user_id', session.user.id)

    if (projectsError) throw projectsError

    return NextResponse.json(projects || [])
  } catch (error) {
    console.error('Error in GET /api/projects:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()

    // Get the user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Add user_id to the project data
    const projectData = {
      ...json,
      user_id: session.user.id
    }

    // Insert the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (projectError) throw projectError

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error in POST /api/projects:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
