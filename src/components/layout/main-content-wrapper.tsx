"use client"

import { cn } from "src/lib/utils"

interface MainContentWrapperProps {
  children: React.ReactNode
  className?: string
}

export function MainContentWrapper({ 
  children, 
  className 
}: MainContentWrapperProps) {
  return (
    <div className={cn(
      "flex-1 overflow-auto p-4",
      "ml-16", // Account for sidebar width
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {children}
    </div>
  )
}
