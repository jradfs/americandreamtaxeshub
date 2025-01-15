import { AuthError } from '@supabase/supabase-js'

export function handleError(error: unknown): Error {
  console.error('Operation failed:', error)

  // Handle Supabase Auth errors
  if (error instanceof AuthError) {
    switch (error.status) {
      case 400:
        return new Error('Invalid request. Please check your input.')
      case 401:
        return new Error('Please sign in to continue.')
      case 403:
        return new Error('You do not have permission to perform this action.')
      case 404:
        return new Error('The requested resource was not found.')
      default:
        return new Error('An authentication error occurred.')
    }
  }

  // Handle standard errors
  if (error instanceof Error) {
    if (error.message.includes('permission denied')) {
      return new Error('You do not have permission to perform this action.')
    }
    if (error.message.includes('not found')) {
      return new Error('The requested resource was not found.')
    }
    if (error.message.includes('duplicate key')) {
      return new Error('This record already exists.')
    }
    if (error.message.includes('foreign key')) {
      return new Error('This operation would violate data integrity.')
    }
    return error
  }

  // Handle unknown errors
  return new Error('An unexpected error occurred.')
} 