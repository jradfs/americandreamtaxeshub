'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from '@/components/dashboard/overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { TaskQueue } from '@/components/dashboard/task-queue'

export function DashboardTabs() {
  const mockActivities = [
    {
      id: '1',
      type: 'task_update',
      title: 'Task Updated',
      description: 'Updated task status to "In Progress"',
      timestamp: new Date().toISOString(),
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        image: null
      }
    },
    {
      id: '2',
      type: 'client_update',
      title: 'Client Added',
      description: 'Added new client "ABC Corp"',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: null
      }
    }
  ]

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        <TabsTrigger value="queue">Task Queue</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Overview />
      </TabsContent>
      <TabsContent value="activity" className="space-y-4">
        <RecentActivity activities={mockActivities} />
      </TabsContent>
      <TabsContent value="queue" className="space-y-4">
        <TaskQueue />
      </TabsContent>
    </Tabs>
  )
} 