"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectGroupProps {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ProjectGroup({
  title,
  count,
  children,
  defaultExpanded = true,
}: ProjectGroupProps) {
  // Initialize state with defaultExpanded prop
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6 hover:bg-secondary/80"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isExpanded ? "Collapse" : "Expand"} {title}
          </span>
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">({count})</span>
        </div>
      </div>
      <div
        className={cn(
          "grid transition-all duration-200",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div
          className={cn(
            "overflow-hidden",
            isExpanded ? "visible" : "invisible",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
