'use client'

import { Sidebar } from "./sidebar"

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="container py-4">
          {children}
        </div>
      </main>
    </div>
  )
}