"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Users, FolderKanban, Home, Menu, ListTodo, LogOut, Briefcase, Briefcase as BriefcaseIcon, ChevronLeft } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { useSidebar } from "./providers/sidebar-provider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { isCollapsed, toggleCollapse } = useSidebar()

  const isActive = (path: string) => {
    if (path === '/workspace' && pathname?.startsWith('/workspace')) {
      return true;
    }
    return pathname === path
  }

  const navigation = [
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

  const NavLink = ({ item, isSubItem = false }: { item: any; isSubItem?: boolean }) => {
    const Icon = item.icon
    const isWorkspace = item.name === 'Workspace'
    const isWorkspaceActive = pathname.startsWith('/workspace')
    const active = isWorkspace ? isWorkspaceActive : isActive(item.href)

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
          active ? "text-gray-900 dark:text-gray-50" : "",
          isSubItem ? "ml-4" : "",
          isCollapsed ? "justify-center" : ""
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    )

    return isCollapsed ? (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : linkContent
  }

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Briefcase className="h-7 w-7" />
          {!isCollapsed && <span className="font-bold">ATH</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="h-8 w-8"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navigation.map((item) => (
            <div key={item.href}>
              <NavLink item={item} />
              {!isCollapsed && item.subItems && (
                <div className="mt-1">
                  {item.subItems.map((subItem: any) => (
                    <NavLink key={subItem.href} item={subItem} isSubItem />
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className={cn("mt-auto border-t", isCollapsed ? "p-2" : "p-4")}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Sign Out
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ModeToggle />
          </div>
        ) : (
          <>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
            <div className="mt-4">
              <ModeToggle />
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <header 
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden flex-col border-r bg-background transition-all duration-300 ease-in-out md:block",
          isCollapsed ? "w-[60px] collapsed" : "w-[200px]"
        )}
      >
        <NavContent />
      </header>

      {/* Mobile Navigation */}
      <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[200px] p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          <span className="font-bold">ATH</span>
        </div>
      </header>

      {/* Spacer for desktop layout */}
      <div 
        className={cn(
          "hidden md:block transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[200px]"
        )} 
      />
    </>
  )
}
