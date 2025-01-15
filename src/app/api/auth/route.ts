import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

export async function GET() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get user profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ user, profile })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { action, ...data } = await request.json()

  try {
    switch (action) {
      case 'signOut':
        await supabase.auth.signOut()
        return NextResponse.json({ success: true })

      case 'refreshSession':
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw refreshError
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        if (!user) {
          return NextResponse.json({ error: 'Session invalid' }, { status: 401 })
        }

        // Get updated profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        return NextResponse.json({ session, user, profile })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 