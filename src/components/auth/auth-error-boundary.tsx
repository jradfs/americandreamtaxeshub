'use client'

import { Component, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // Log error to monitoring service
    console.error('Auth Error:', error)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An authentication error occurred.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
              <a
                href="/auth/login"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 