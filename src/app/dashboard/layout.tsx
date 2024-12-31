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
  } catch (error) {
    console.error('Error loading projects:', error);
    return (
      <div className="container px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Error loading projects. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }
  )
}
