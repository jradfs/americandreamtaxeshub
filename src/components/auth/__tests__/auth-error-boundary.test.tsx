import { render, screen, fireEvent } from '@testing-library/react'
import { AuthErrorBoundary } from '../auth-error-boundary'

const ErrorComponent = () => {
  throw new Error('Test error')
}

describe('AuthErrorBoundary', () => {
  beforeEach(() => {
    // Prevent console.error from cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <AuthErrorBoundary>
        <div>Test Content</div>
      </AuthErrorBoundary>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    render(
      <AuthErrorBoundary>
        <ErrorComponent />
      </AuthErrorBoundary>
    )

    expect(screen.getByText('Authentication Error')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const fallback = <div>Custom Error UI</div>

    render(
      <AuthErrorBoundary fallback={fallback}>
        <ErrorComponent />
      </AuthErrorBoundary>
    )

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
  })

  it('has retry button that resets error boundary', () => {
    const { rerender } = render(
      <AuthErrorBoundary>
        <ErrorComponent />
      </AuthErrorBoundary>
    )

    const retryButton = screen.getByText('Retry')
    fireEvent.click(retryButton)

    // After clicking retry, the error boundary should reset
    rerender(
      <AuthErrorBoundary>
        <div>Recovered Content</div>
      </AuthErrorBoundary>
    )

    expect(screen.getByText('Recovered Content')).toBeInTheDocument()
  })

  it('has working login link', () => {
    render(
      <AuthErrorBoundary>
        <ErrorComponent />
      </AuthErrorBoundary>
    )

    const loginLink = screen.getByText('Back to Login')
    expect(loginLink).toHaveAttribute('href', '/auth/login')
  })
}) 