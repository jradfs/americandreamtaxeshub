import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import './globals.css'
import { ThemeProvider } from "src/components/theme-provider"
import { AuthProvider } from "src/components/providers/auth-provider"
import { SidebarProvider } from "src/components/providers/sidebar-provider"
import SupabaseProvider from "src/lib/supabase/supabase-provider"
import { Navbar } from "src/components/navbar"
import { cn } from "src/lib/utils"
import { Toaster } from "src/components/ui/toaster"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "American Dream Taxes Hub",
  description: "Tax preparation and filing made easy",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SupabaseProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="relative flex min-h-screen">
                  <main className="flex-1 transition-all duration-300 ease-in-out">
                    {children}
                  </main>
                  <Toaster />
                </div>
              </SidebarProvider>
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
