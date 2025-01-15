'use client'

interface AuthLoadingProps {
  message?: string
}

export function AuthLoading({ message = 'Loading...' }: AuthLoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}

export function AuthLoadingInline({ message = 'Loading...' }: AuthLoadingProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-3"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
} 