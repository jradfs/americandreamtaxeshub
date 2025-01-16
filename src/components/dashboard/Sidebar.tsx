"use client";

import React from "react";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    FileText,
    BarChart,
    Settings,
} from "lucide-react";

import { NavMain } from "@/components/NavMain";
import { NavProjects } from "@/components/NavProjects";
import { NavUser } from "@/components/NavUser";
import { TeamSwitcher } from "@/components/TeamSwitcher";
import {
    Sidebar as SidebarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "John Doe",
        email: "john@americandreamtaxes.com",
        avatar: "/avatars/john-doe.jpg",
    },
    teams: [
        {
            name: "American Dream Taxes",
            logo: LayoutDashboard,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                },
            ],
        },
        {
            title: "Management",
            url: "/dashboard/management",
            icon: Users,
            items: [
                {
                    title: "Clients",
                    url: "/dashboard/clients",
                },
                {
                    title: "Projects",
                    url: "/dashboard/projects",
                },
                {
                    title: "Tax Returns",
                    url: "/dashboard/tax-returns",
                },
            ],
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: BarChart,
            items: [
                {
                    title: "Reports",
                    url: "/dashboard/analytics/reports",
                },
            ],
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
            items: [
                {
                    title: "General",
                    url: "/dashboard/settings/general",
                },
                {
                    title: "Team",
                    url: "/dashboard/settings/team",
                },
                {
                    title: "Billing",
                    url: "/dashboard/settings/billing",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Tax Returns 2024",
            url: "/dashboard/projects/tax-returns-2024",
            icon: FileText,
        },
        {
            name: "Client Onboarding",
            url: "/dashboard/projects/client-onboarding",
            icon: Users,
        },
        {
            name: "Financial Reports",
            url: "/dashboard/projects/financial-reports",
            icon: BarChart,
        },
    ],
}

export default function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
    return (
        <SidebarComponent collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </SidebarComponent>
    )
}
