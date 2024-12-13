import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { SidebarProvider } from "@/components/providers/sidebar-provider"
import SupabaseProvider from "@/lib/supabase/supabase-provider"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SupabaseProvider>
              <SidebarProvider>
                <div className="relative flex min-h-screen">
                  <Navbar />
                  <main className="flex-1 transition-all duration-300 ease-in-out">
                    {children}
                  </main>
                  <Toaster />
                </div>
              </SidebarProvider>
            </SupabaseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
