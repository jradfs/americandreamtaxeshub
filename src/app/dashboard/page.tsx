import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shell'
import { DashboardHeader } from '@/components/header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { getDashboardMetrics } from '@/lib/supabase/dashboardQueries'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  try {
    const metrics = await getDashboardMetrics();
    return <DashboardTabs {...metrics} />;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Return a fallback UI with zero values
    return (
      <DashboardTabs 
        totalActiveClients={0}
        pendingTaxReturns={0}
        activeProjects={0}
        upcomingDeadlines={0}
      />
    );
  }
}
