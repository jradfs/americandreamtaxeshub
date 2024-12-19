import { Check, ChevronDown } from "lucide-react"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"

interface FilterOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  label: string
  options?: FilterOption[]
  type?: "select" | "date"
  multiple?: boolean
  value?: string | string[] | Date
  onChange?: (value: string | string[] | Date) => void
  className?: string
}

export function FilterDropdown({
  label,
  options = [],
  type = "select",
  multiple = false,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()

  if (type === "date") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-between min-w-[150px]",
              !selectedDate && "text-muted-foreground",
              className
            )}
          >
            {selectedDate ? format(selectedDate, "PPP") : label}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              onChange?.(date as Date)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between min-w-[150px]", className)}
        >
          {label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value
            }
            onCheckedChange={(checked) => {
              if (multiple && Array.isArray(value)) {
                const newValue = checked
                  ? [...value, option.value]
                  : value.filter((v) => v !== option.value)
                onChange?.(newValue)
              } else {
                onChange?.(checked ? option.value : "")
              }
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}