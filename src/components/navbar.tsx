'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
]

const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col space-y-2 p-4">
        {mainNavItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </div>
      <div className="mt-auto">
        <div className="flex flex-col space-y-2 p-4">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="lg"
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
