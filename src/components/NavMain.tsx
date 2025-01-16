"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavMainProps {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
    }[];
}

export function NavMain({ items }: NavMainProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            className={item.isActive ? "bg-accent text-accent-foreground" : ""}
                        >
                            <a href={item.url}>
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}