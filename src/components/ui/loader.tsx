"use client";

import { Loader2 as LucideLoader } from "lucide-react";
import { cn } from "@/lib/utils";

export { LucideLoader as Loader2 };

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

export function Loader({ size = 16, className, ...props }: LoaderProps) {
  return (
    <div role="status" {...props}>
      <LucideLoader
        className={cn("animate-spin text-muted-foreground", className)}
        size={size}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
