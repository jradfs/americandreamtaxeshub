import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  } catch (error) {
    console.error('Callback error:', error)
    // If there's an error, redirect to login
    return NextResponse.redirect(new URL('/login', new URL(request.url).origin))
  }
}
