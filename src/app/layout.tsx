"use client";

import Script from "next/script";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Script
          id="remove-ext-attributes"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `document.body.removeAttribute('data-new-gr-c-s-check-loaded'); document.body.removeAttribute('data-gr-ext-installed');`,
          }}
        />
      </body>
    </html>
  );
}
