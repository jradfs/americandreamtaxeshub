import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  items: string[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <div key={item} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
          <span className={cn(
            "text-sm font-medium",
            index === items.length - 1 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}>
            {item}
          </span>
        </div>
      ))}
    </nav>
  )
}
