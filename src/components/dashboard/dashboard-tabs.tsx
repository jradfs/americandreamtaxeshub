'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Overview } from '@/components/dashboard/overview'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { TaskQueue } from '@/components/dashboard/task-queue'

interface DashboardTabsProps {
  totalActiveClients: number
  pendingTaxReturns: number
  activeProjects: number
  upcomingDeadlines: number
}

export function DashboardTabs({
  totalActiveClients,
  pendingTaxReturns,
  activeProjects,
  upcomingDeadlines,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        <TabsTrigger value="queue">Task Queue</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Overview
          totalActiveClients={totalActiveClients}
          pendingTaxReturns={pendingTaxReturns}
          activeProjects={activeProjects}
          upcomingDeadlines={upcomingDeadlines}
        />
      </TabsContent>
      <TabsContent value="activity">
        <RecentActivity />
      </TabsContent>
      <TabsContent value="queue">
        <TaskQueue />
      </TabsContent>
    </Tabs>
  )
} 