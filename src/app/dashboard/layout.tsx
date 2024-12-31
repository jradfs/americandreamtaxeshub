'use client'

import { useAuth } from 'src/components/providers/auth-provider.tsx';
import { redirect } from "next/navigation"
import { Button } from 'src/components/ui/button.tsx';
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user) {
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
