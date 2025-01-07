import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shell'
import { DashboardHeader } from '@/components/header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your tax practice management dashboard."
      />
      <div className="grid gap-10">
        <DashboardTabs />
      </div>
    </DashboardShell>
  )
}
