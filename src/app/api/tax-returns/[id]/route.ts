import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabase
      .from('tax_returns')
      .select(`
        *,
        client:client_id (*),
        project:project_id (*),
        documents:documents (*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tax return:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tax return' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updates = await request.json()

    // Start transaction
    await supabase.rpc('begin_transaction')

    try {
      // Update tax return
      const { error: updateError } = await supabase
        .from('tax_returns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (updateError) {
        throw updateError
      }

      // If status is changed to 'completed', update related project
      if (updates.status === 'completed') {
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('tax_return_id', params.id)

        if (projectError) {
          throw projectError
        }
      }

      // Commit transaction
      await supabase.rpc('commit_transaction')

      // Fetch updated tax return
      const { data: taxReturn, error: fetchError } = await supabase
        .from('tax_returns')
        .select(`
          *,
          client:client_id (*),
          project:project_id (*),
          documents:documents (*)
        `)
        .eq('id', params.id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return NextResponse.json(taxReturn)
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction')
      throw error
    }
  } catch (error) {
    console.error('Error updating tax return:', error)
    return NextResponse.json(
      { error: 'Failed to update tax return' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
