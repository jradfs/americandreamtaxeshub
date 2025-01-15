'use client'

import { useTransition } from 'react'
import { signOut, refreshSession } from '@/app/actions/auth'
import { useToast } from '@/components/ui/use-toast'

export function AuthForm() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSignOut = async () => {
    startTransition(async () => {
      try {
        await signOut()
        toast({
          title: 'Signed out successfully',
          description: 'You have been signed out of your account.'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to sign out',
          variant: 'destructive'
        })
      }
    })
  }

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        await refreshSession()
        toast({
          title: 'Session refreshed',
          description: 'Your session has been refreshed successfully.'
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to refresh session',
          variant: 'destructive'
        })
      }
    })
  }

  return (
    <form className="space-y-4">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Loading...' : 'Sign Out'}
      </button>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Loading...' : 'Refresh Session'}
      </button>
    </form>
  )
} 