/**
 * Simple error reporting utility
 */

export type ErrorDetails = {
  message: string
  stack?: string
  context?: Record<string, unknown>
}

export const captureError = (error: Error | unknown, context?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', error)
    if (context) {
      console.error('Error context:', context)
    }
  }

  // In production, you could add error logging to your backend
  // or use a simple analytics service
  
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      context
    }
  }

  return {
    message: 'An unknown error occurred',
    context
  }
}

export const formatErrorMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
} 