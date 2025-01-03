'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FocusNowDashboard } from '@/components/dashboard/focus-now-dashboard'
import { SmartQueue } from '@/components/dashboard/smart-queue'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          window.location.href = '/login'
          return
        }
        setLoading(false)
      } catch (error) {
        console.error('Error checking session:', error)
        setLoading(false)
      }
    }

    checkSession()
  }, [supabase.auth])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg border bg-card">
            <div className="text-sm font-medium text-muted-foreground">Active Tasks</div>
            <div className="mt-2 text-2xl font-semibold">12</div>
          </div>
        </div>
        
        <FocusNowDashboard />
        <SmartQueue />
      </div>
    </div>
  )
}
