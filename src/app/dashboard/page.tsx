'use client'

import { FocusNowDashboard } from '@/components/dashboard/focus-now-dashboard'
import { SmartQueue } from '@/components/dashboard/smart-queue'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground">Here's what's happening today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg border bg-card">
            <div className="text-sm font-medium text-muted-foreground">Active Tasks</div>
            <div className="mt-2 text-2xl font-semibold">12</div>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <div className="text-sm font-medium text-muted-foreground">Due Today</div>
            <div className="mt-2 text-2xl font-semibold">4</div>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="mt-2 text-2xl font-semibold">8</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">Task completed: Tax Return Review</div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Upcoming Deadlines</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">Client Tax Return</div>
                  <div className="text-sm text-muted-foreground">Due in 3 days</div>
                </div>
                <div className="text-sm text-muted-foreground">Dec 15</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
