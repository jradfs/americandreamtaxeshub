import { Card } from '@/components/ui/card'

interface DashboardMetricsProps {
  metrics: {
    totalActiveClients: number
    pendingTaxReturns: number
    activeProjects: number
    upcomingDeadlines: number
  }
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const metricsData = [
    {
      title: 'Active Clients',
      value: metrics.totalActiveClients,
      description: 'Total number of active clients',
    },
    {
      title: 'Pending Returns',
      value: metrics.pendingTaxReturns,
      description: 'Tax returns awaiting completion',
    },
    {
      title: 'Active Projects',
      value: metrics.activeProjects,
      description: 'Projects in progress or review',
    },
    {
      title: 'Upcoming Deadlines',
      value: metrics.upcomingDeadlines,
      description: 'Tasks due in the next 7 days',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{metric.title}</h3>
            <p className="text-3xl font-bold">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
} 