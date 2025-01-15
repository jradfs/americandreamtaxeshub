import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  try {
    const { data, error } = await supabase
      .from('tax_returns')
      .select(`
        *,
        client:client_id (*)
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
  const cookieStore = cookies()
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  try {
    const updates = await request.json()

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

      // Fetch updated tax return
      const { data: taxReturn, error: fetchError } = await supabase
        .from('tax_returns')
        .select(`
          *,
          client:client_id (*)
        `)
        .eq('id', params.id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      return NextResponse.json(taxReturn)
    } catch (error) {
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
