"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/providers/sidebar-provider"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main className={cn(
      "flex-1 p-8 transition-all duration-300 ease-in-out",
      isCollapsed ? "ml-16" : "ml-64"
    )}>
      {children}
    </main>
  )
}
