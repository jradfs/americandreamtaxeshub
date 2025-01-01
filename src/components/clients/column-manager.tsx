'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Settings } from 'lucide-react'

interface ColumnManagerProps {
  allColumns: string[]
  visibleColumns: string[]
  onColumnToggle: (column: string) => void
}

export function ColumnManager({
  allColumns,
  visibleColumns,
  onColumnToggle
}: ColumnManagerProps) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8">
            <Settings className="mr-2 h-4 w-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {allColumns.map((column) => (
            <DropdownMenuItem
              key={column}
              onSelect={(e) => {
                e.preventDefault()
                onColumnToggle(column)
              }}
            >
              <Checkbox
                checked={visibleColumns.includes(column)}
                className="mr-2"
              />
              {column}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
