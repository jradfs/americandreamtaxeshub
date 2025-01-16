import React from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Shell = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Clients",
      icon: Users,
      path: "/clients",
    },
    {
      name: "Documents",
      icon: FileText,
      path: "/documents",
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">American Dream Taxes</h2>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={router.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 z-40 w-full border-b bg-background lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <h2 className="text-lg font-semibold">American Dream Taxes</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="h-14 border-b px-4">
            <SheetTitle>American Dream Taxes</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={router.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  router.push(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="min-h-screen pt-14 lg:pl-64">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default Shell;
