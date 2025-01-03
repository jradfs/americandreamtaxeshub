import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  )
}