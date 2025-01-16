import { Card } from "./card";
import { cn } from "@/lib/utils";

interface DueCounterProps {
  label: string;
  count: number;
  variant?: "default" | "destructive";
}

export function DueCounter({
  label,
  count,
  variant = "default",
}: DueCounterProps) {
  return (
    <Card
      className={cn(
        "inline-flex items-center gap-2 p-2",
        variant === "destructive" &&
          "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
      )}
    >
      <span
        className={cn(
          "text-2xl font-bold",
          variant === "destructive"
            ? "text-red-600 dark:text-red-400"
            : "text-foreground",
        )}
      >
        {count}
      </span>
      <span
        className={cn(
          "text-sm",
          variant === "destructive"
            ? "text-red-600 dark:text-red-400"
            : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </Card>
  );
}
