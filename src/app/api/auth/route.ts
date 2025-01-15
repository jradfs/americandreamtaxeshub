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

  // Get or create user profile data
  let profile
  try {
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()

    if (profileError?.code === 'PGRST116') {
      // Profile doesn't exist, create default profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.email?.split('@')[0] || 'User',
          role: 'team_member'
        })
        .select('role, full_name')
        .single()

      if (createError) throw createError
      profile = newProfile
    } else if (profileError) {
      throw profileError
    } else {
      profile = existingProfile
    }
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { error: 'Failed to get/create profile' },
      { status: 500 }
    )
  }

  return NextResponse.json({ user, profile })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { action, ...data } = await request.json()

  try {
    switch (action) {
      case 'login':
        const { email, password } = data
        const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (loginError) throw loginError

        // Get user profile data
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        let profile
        try {
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single()

          if (profileError?.code === 'PGRST116') {
            // Profile doesn't exist, create default profile
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                full_name: user.email?.split('@')[0] || 'User',
                role: 'team_member'
              })
              .select('role, full_name')
              .single()

            if (createError) throw createError
            profile = newProfile
          } else if (profileError) {
            throw profileError
          } else {
            profile = existingProfile
          }
        } catch (error) {
          console.error('Profile error:', error)
          return NextResponse.json(
            { error: 'Failed to get/create profile' },
            { status: 500 }
          )
        }

        return NextResponse.json({ session, user, profile })

      case 'signOut':
        await supabase.auth.signOut()
        return NextResponse.json({ success: true })

      case 'refreshSession':
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw refreshError
        
        const { data: { user: refreshedUser }, error: refreshedUserError } = await supabase.auth.getUser()
        if (refreshedUserError) throw refreshedUserError

        if (!refreshedUser) {
          return NextResponse.json({ error: 'Session invalid' }, { status: 401 })
        }

        // Get updated profile data
        let refreshedProfile
        try {
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', refreshedUser.id)
            .single()

          if (profileError?.code === 'PGRST116') {
            // Profile doesn't exist, create default profile
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: refreshedUser.id,
                email: refreshedUser.email,
                full_name: refreshedUser.email?.split('@')[0] || 'User',
                role: 'team_member'
              })
              .select('role, full_name')
              .single()

            if (createError) throw createError
            refreshedProfile = newProfile
          } else if (profileError) {
            throw profileError
          } else {
            refreshedProfile = existingProfile
          }
        } catch (error) {
          console.error('Profile error:', error)
          return NextResponse.json(
            { error: 'Failed to get/create profile' },
            { status: 500 }
          )
        }

        return NextResponse.json({ session: refreshedSession, user: refreshedUser, profile: refreshedProfile })

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