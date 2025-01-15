"use client"

import React from "react"
import { UnifiedAuthProvider } from "@/providers/unified-auth-provider"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UnifiedAuthProvider>
        {children}
      </UnifiedAuthProvider>
    </QueryClientProvider>
  )
} 