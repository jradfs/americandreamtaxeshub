import * as Sentry from '@sentry/nextjs'

interface ErrorInfo {
  componentStack?: string
  digest?: string
  message?: string
}

export function initErrorReporting() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    })
  }
}

export function captureError(error: Error, errorInfo?: ErrorInfo) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error)
    if (errorInfo) {
      console.error('Error Info:', errorInfo)
    }
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (errorInfo) {
        scope.setExtras(errorInfo)
      }
      Sentry.captureException(error)
    })
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level}] ${message}`)
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level)
  }
}

export function setUserContext(user: { id: string; email?: string }) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    })
  }
} 