import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

type CreateWorkflowRequest = {
  title: string
  description?: string
  steps: any[]
}

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  try {
    const { data, error } = await supabase
      .from('workflow_templates')
      .select()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse('Error fetching workflows', { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  try {
    const body = await request.json() as CreateWorkflowRequest
    if (!body.title || !Array.isArray(body.steps)) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const { data, error } = await supabase
      .from('workflow_templates')
      .insert({
      name: body.title,
      description: body.description,
      steps: body.steps,
      created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse('Error creating workflow', { status: 500 })
  }
}



