import { render } from '@testing-library/react'
import { UnifiedAuthProvider } from '@/providers/unified-auth-provider'

export function renderWithProviders(ui: React.ReactNode) {
  return render(
    <UnifiedAuthProvider>
      {ui}
    </UnifiedAuthProvider>
  )
}
