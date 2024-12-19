import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of routes that don't require authentication
const publicRoutes = ['/', '/login', '/auth/callback']

// List of protected routes that require authentication
const protectedRoutes = ['/dashboard', '/clients', '/projects', '/tasks', '/templates']

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Get the session - this will set the required cookies
    const { data: { session }, error } = await supabase.auth.getSession()

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route)
    
    // Check if the route requires authentication
    const requiresAuth = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // Handle authentication errors
    if (error) {
      console.error('Auth error:', error)
      if (requiresAuth) {
        const redirectUrl = new URL('/login', req.url)
        return NextResponse.redirect(redirectUrl)
      }
      return res
    }

    // Allow access to public routes
    if (isPublicRoute) {
      return res
    }

    // Redirect to login if accessing protected route without session
    if (!session && requiresAuth) {
      const redirectUrl = new URL('/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Allow access to protected routes with valid session
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // If there's an error, redirect to login
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
