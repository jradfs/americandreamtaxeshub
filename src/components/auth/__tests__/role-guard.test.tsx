import { render, screen, waitFor } from '@testing-library/react'
import { RoleGuard } from '../role-guard'
import { useAuth } from '@/providers/unified-auth-provider'
import { useRouter } from 'next/navigation'

// Mock the hooks
jest.mock('@/providers/unified-auth-provider')
jest.mock('next/navigation')

describe('RoleGuard', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    mockRouter.push.mockClear()
  })

  it('renders children when user has required role', () => {
    (useAuth as jest.Mock).mockReturnValue({
      hasRole: (role: string) => role === 'admin',
      loading: false,
    })

    render(
      <RoleGuard requiredRole="admin">
        <div>Protected Content</div>
      </RoleGuard>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('shows loading state when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      hasRole: () => false,
      loading: true,
    })

    render(
      <RoleGuard requiredRole="admin">
        <div>Protected Content</div>
      </RoleGuard>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redirects when user does not have required role', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      hasRole: () => false,
      loading: false,
    })

    render(
      <RoleGuard requiredRole="admin" fallbackPath="/dashboard">
        <div>Protected Content</div>
      </RoleGuard>
    )

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('uses default fallback path when not specified', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      hasRole: () => false,
      loading: false,
    })

    render(
      <RoleGuard requiredRole="admin">
        <div>Protected Content</div>
      </RoleGuard>
    )

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })
}) 