"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface SidebarContextValue {
    isCollapsed: boolean
    setIsCollapsed: (isCollapsed: boolean) => void
    isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}

export const Sidebar = React.forwardRef<HTMLDivElement, { collapsible?: "icon" }>(
    ({ className, collapsible = "icon", children, ...props }, ref) => {
        const [isCollapsed, setIsCollapsed] = React.useState(false)
        const [isMobile, setIsMobile] = React.useState(false)

        React.useEffect(() => {
            const checkMobile = () => {
                setIsMobile(window.innerWidth < 768)
            }
            checkMobile()
            window.addEventListener('resize', checkMobile)
            return () => window.removeEventListener('resize', checkMobile)
        }, [])

        return (
            <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobile }}>
                <div
                    className={cn(
                        "group relative flex h-screen min-h-screen flex-col border-r bg-secondary data-[state=open]:shadow-md md:sticky md:top-0",
                        isCollapsed && "w-16",
                        !isCollapsed && "w-60",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                    {collapsible === "icon" ? (
                        <div className="absolute bottom-0 flex w-full items-center border-t">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full rounded-none"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <span className="sr-only">Toggle sidebar</span>
                                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </SidebarContext.Provider>
        )
    }
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn("flex h-[60px] items-center px-6", className)} ref={ref} {...props} />
    )
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn("mt-auto border-t p-6", className)} ref={ref} {...props} />
    )
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn("flex-1 overflow-y-auto p-6", className)} ref={ref} {...props} />
    )
)
SidebarContent.displayName = "SidebarContent"

export const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => {
        const { isCollapsed } = React.useContext(SidebarContext) as NonNullable<
            ReturnType<typeof React.useContext<typeof SidebarContext>>
        >

        return isCollapsed ? (
            <div className={cn("absolute inset-y-0 right-0 w-px bg-border", className)} ref={ref} {...props} />
        ) : null
    }
)
SidebarRail.displayName = "SidebarRail"

interface SidebarNavComponent extends React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLDivElement>> {
    Link: typeof SidebarNavLink
}

const SidebarNavBase = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className="mt-2 space-y-1" ref={ref} {...props} />
    )
)
SidebarNavBase.displayName = "SidebarNav"

export const SidebarNavLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
    const pathname = usePathname()
    const active = pathname === props.href

    return (
        <a
            className={cn(
                "group flex w-full items-center space-x-2 rounded-md p-2 font-medium hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
SidebarNavLink.displayName = "SidebarNavLink"

export const SidebarNav = Object.assign(SidebarNavBase, { Link: SidebarNavLink }) as SidebarNavComponent

export const SidebarNavGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className="mt-4 pt-4 first:mt-0 first:pt-0" ref={ref} {...props} />
    )
)
SidebarNavGroup.displayName = "SidebarNavGroup"

export const SidebarNavTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p className={cn("px-3 text-sm font-medium", className)} ref={ref} {...props} />
    )
)
SidebarNavTitle.displayName = "SidebarNavTitle"

export const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => <div className={cn("space-y-1", className)} ref={ref} {...props} />
)
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => <div className={cn("h-auto w-full", className)} ref={ref} {...props} />
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => (
        <Button ref={ref} variant="ghost" className={cn("w-full justify-start", className)} {...props} />
    )
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => <div className={cn("mt-2 space-y-1 pl-4", className)} ref={ref} {...props} />
)
SidebarMenuSub.displayName = "SidebarMenuSub"

export const SidebarMenuSubItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />
)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

export const SidebarMenuSubButton = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ className, ...props }, ref) => (
        <Button ref={ref} variant="ghost" size="sm" className={cn("w-full justify-start", className)} {...props} />
    )
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn("space-y-4", className)} ref={ref} {...props} />
    )
)
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn("px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)} ref={ref} {...props} />
    )
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarMenuAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => (
        <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", className)}
            {...props}
        />
    )
)
SidebarMenuAction.displayName = "SidebarMenuAction"
