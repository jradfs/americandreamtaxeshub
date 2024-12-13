import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of routes that don't require authentication
const publicRoutes = ['/', '/login', '/auth/callback']

// List of protected routes that require authentication
const protectedRoutes = ['/dashboard', '/clients', '/projects', '/tasks', '/templates']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const { data: { session }, error } = await supabase.auth.getSession()

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)
  
  // Check if the route requires authentication
  const requiresAuth = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isPublicRoute) {
    return res
  }

  // If there's no session and the route requires auth, redirect to login
  if (!session && requiresAuth) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
