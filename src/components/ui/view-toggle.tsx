import { LayoutList, Calendar } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "list" | "calendar"
  onChange: (view: "list" | "calendar") => void
  className?: string
}

export function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("inline-flex items-center rounded-md border bg-muted p-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-2.5",
          view === "list" && "bg-background shadow-sm"
        )}
        onClick={() => onChange("list")}
      >
        <LayoutList className="h-4 w-4 mr-2" />
        List
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-2.5",
          view === "calendar" && "bg-background shadow-sm"
        )}
        onClick={() => onChange("calendar")}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Calendar
      </Button>
    </div>
  )
}