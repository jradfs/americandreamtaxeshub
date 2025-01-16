import * as React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchForm() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10"
      />
    </div>
  )
}