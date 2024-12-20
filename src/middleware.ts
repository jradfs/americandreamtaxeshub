import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/auth/callback']

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/clients', '/projects', '/tasks', '/templates', '/workspace']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get session - this will refresh the session if needed
  const { data: { session }, error } = await supabase.auth.getSession()

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)
  
  // Check if the route requires authentication
  const requiresAuth = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Handle authentication errors
  if (error) {
    console.error('Auth error:', error)
    if (requiresAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  // If we have a session but we're on a public route (like /login),
  // redirect to dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If we don't have a session and the route requires auth,
  // redirect to login
  if (!session && requiresAuth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Return the response with the session
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
