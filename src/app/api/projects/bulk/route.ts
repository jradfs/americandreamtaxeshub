import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { projectIds, updates } = await request.json() as {
      projectIds: string[]
      updates: Partial<Pick<Database['public']['Tables']['projects']['Row'],
        'status' | 'priority' | 'due_date' | 'description' | 'service_type'
      >>
    }

    if (!projectIds?.length) {
      return NextResponse.json(
        { error: 'No project IDs provided' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .in('id', projectIds)
      .select()

    if (error) {
      console.error('Error updating projects:', error)
      return NextResponse.json(
        { error: 'Failed to update projects' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
