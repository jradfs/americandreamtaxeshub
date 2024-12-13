"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Users, FolderKanban, Home, Menu, ListTodo, LogOut, Briefcase, Briefcase as BriefcaseIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
    },
    {
      href: '/clients',
      label: 'Clients',
      active: pathname === '/clients',
    },
    {
      href: '/workspace',
      label: 'Workspace',
      active: pathname === '/workspace',
    },
    {
      href: '/settings',
      label: 'Settings',
      active: pathname === '/settings',
    },
  ];

  return (
    <nav className="flex items-center space-x-6 ml-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { 
      name: 'Workspace', 
      href: '/workspace', 
      icon: BriefcaseIcon,
      subItems: [
        { name: 'Tasks', href: '/workspace', icon: ListTodo },
        { name: 'Projects', href: '/workspace/projects', icon: FolderKanban },
      ]
    },
    { name: 'Clients', href: '/clients', icon: Users },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      })
      router.push('/login')
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
      })
    }
  }

  return (
    <header className="fixed inset-y-0 left-0 z-50 flex w-[200px] flex-col border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6" />
          <span className="font-bold">ATH</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navigation.map((item) => {
            const Icon = item.icon
            const isWorkspace = item.name === 'Workspace'
            const isWorkspaceActive = pathname.startsWith('/workspace')
            
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    (isWorkspace ? isWorkspaceActive : isActive(item.href)) ? "text-gray-900 dark:text-gray-50" : ""
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
                
                {/* Render sub-items for Workspace */}
                {isWorkspace && item.subItems && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                            isActive(subItem.href) ? "text-gray-900 dark:text-gray-50 bg-accent" : ""
                          )}
                        >
                          <SubIcon className="h-4 w-4" />
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      <div className="p-4 border-t">
        <ModeToggle />
      </div>
    </header>
  )
}
