import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

type TemplateRow = Database['public']['Tables']['project_templates']['Row']
type TemplateInsert = Database['public']['Tables']['project_templates']['Insert']

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: templates, error } = await supabase
      .from('project_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const template = await request.json() as TemplateInsert

    const { data, error } = await supabase
      .from('project_templates')
      .insert(template)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

