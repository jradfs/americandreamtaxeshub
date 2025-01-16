"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

interface TaskErrorBoundaryProps {
  children: ReactNode;
}

export function TaskErrorBoundary({ children }: TaskErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Task Error</h2>
          <p className="text-muted-foreground">
            An error occurred while managing tasks. Please try again or contact
            support if the issue persists.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
