'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, Settings, Users, FileText, BarChart } from 'lucide-react'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export default function Sidebar({ className }: SidebarNavProps) {
  const pathname = usePathname()

  const items = [
    {
      href: "/dashboard",
      title: "Home",
      icon: <Home className="mr-2 h-4 w-4" />
    },
    {
      href: "/dashboard/clients",
      title: "Clients",
      icon: <Users className="mr-2 h-4 w-4" />
    },
    {
      href: "/dashboard/tax-returns",
      title: "Tax Returns",
      icon: <FileText className="mr-2 h-4 w-4" />
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      icon: <BarChart className="mr-2 h-4 w-4" />
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />
    }
  ]

  return (
    <aside className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            American Dream Taxes
          </h2>
          <Separator className="my-4" />
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1 p-2">
            {items.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
} 