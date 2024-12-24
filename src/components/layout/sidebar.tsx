"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "src/lib/utils";
import { Button } from "src/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  Settings,
  FolderKanban,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold">American Dream Taxes Hub</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 py-2">
            {sidebarNavItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="mb-1"
                >
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      pathname === item.href && "bg-muted"
                    )}
                  >
                    <Icon size={20} />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}