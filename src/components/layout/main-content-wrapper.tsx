"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isCollapsed ? "pl-[4.5rem]" : "pl-[16.5rem]"
      )}
    >
      {children}
    </main>
  );
}
