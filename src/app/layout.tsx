import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import SupabaseProvider from "@/lib/supabase/supabase-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainContent } from "@/components/layout/main-content";
import { useSidebar } from "@/components/providers/sidebar-provider";


export const metadata: Metadata = {
  title: "American Dream Taxes Hub",
  description: "Tax preparation and filing made easy",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { isCollapsed } = useSidebar();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SupabaseProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="relative flex min-h-screen">
                  <Sidebar />
                  <MainContent className={cn(
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-[4.5rem]" : "pl-[16.5rem]"
                  )}>
                    {children}
                  </MainContent>
                  <Toaster />
                </div>
              </SidebarProvider>
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
