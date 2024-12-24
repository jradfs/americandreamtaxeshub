'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Users,
  LayoutGrid,
  Calendar,
  Settings,
  Layers,
  FolderKanban,
} from 'lucide-react'

const items = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Workspace',
    href: '/workspace',
    icon: FolderKanban,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Tasks',
    href: '/tasks',
    icon: Layers,
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors',
              pathname === item.href ? 'bg-accent' : 'transparent'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}