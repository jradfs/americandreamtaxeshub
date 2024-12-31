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
import { MainContentWrapper } from "@/components/layout/main-content-wrapper";

export const metadata: Metadata = {
  title: "American Dream Taxes Hub",
  description: "Tax preparation and filing made easy",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          "font-sans", // Explicitly set sans font family
          "dark:bg-dark-background" // Ensure dark mode background is applied
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SupabaseProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="relative flex min-h-screen">
                  <Sidebar />
                  <MainContentWrapper>
                    {children}
                  </MainContentWrapper>
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
