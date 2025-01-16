"use client"

import React from "react"
import {
    LayoutDashboard,
    Users,
    FileText,
    BarChart,
    Settings,
} from "lucide-react"

import { NavMain } from "@/components/NavMain"
import { NavUser } from "@/components/NavUser"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Clients",
            url: "/dashboard/clients",
            icon: Users,
        },
        {
            title: "Tax Returns",
            url: "/dashboard/tax-returns",
            icon: FileText,
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: BarChart,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b">
                <div className="flex h-[60px] items-center justify-between gap-2 px-6">
                    <span className="font-semibold">American Dream Taxes</span>
                    <ThemeToggle />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser 
                    user={{
                        name: "John Doe",
                        email: "john@example.com",
                        avatar: ""
                    }} 
                />
            </SidebarFooter>
        </Sidebar>
    )
}