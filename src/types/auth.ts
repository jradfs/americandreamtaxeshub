import { Database } from './database.types'

// Use database types for user role
export type UserRole = Database['public']['Enums']['user_role']

// Use database types for user
export type User = {
  id: string
  email: string
  role: UserRole
  full_name?: string | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

// Strongly type the session
export type Session = {
  user: User
  expires_at: number
  access_token?: string
  refresh_token?: string
}

// Auth state with proper error typing
export type AuthState = {
  session: Session | null
  loading: boolean
  error: AuthError | null
}

// Form data with validation
export type SignInFormData = {
  email: string
  password: string
}

export type SignUpFormData = {
  email: string
  password: string
  full_name: string
  role: UserRole
}

// Type guard for checking if user is authenticated
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && 
         typeof session.user === 'object' && 
         typeof session.user.id === 'string' &&
         typeof session.user.email === 'string' &&
         typeof session.expires_at === 'number' &&
         session.expires_at > Date.now() / 1000
}

// Type guard for checking user role
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role
}

// Error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Session has expired')
    this.name = 'SessionExpiredError'
  }
}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('Unauthorized access')
    this.name = 'UnauthorizedError'
  }
}

// Auth guard type
export type AuthGuard = {
  requireAuth: boolean
  allowedRoles?: UserRole[]
} 