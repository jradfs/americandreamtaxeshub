'use client'

import { ViewType, GroupingType } from '@/types/workspace'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutGrid, List, Calendar, GroupIcon } from 'lucide-react'

interface ViewSelectorProps {
  currentView: ViewType
  currentGrouping: GroupingType
  onViewChange: (view: ViewType) => void
  onGroupingChange: (grouping: GroupingType) => void
}

export function ViewSelector({
  currentView,
  currentGrouping,
  onViewChange,
  onGroupingChange
}: ViewSelectorProps) {
  const views: { value: ViewType; label: string; icon: typeof List }[] = [
    { value: 'list', label: 'List View', icon: List },
    { value: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
    { value: 'calendar', label: 'Calendar', icon: Calendar },
  ]

  const groupingOptions: { value: GroupingType; label: string }[] = [
    { value: 'status', label: 'By Status' },
    { value: 'priority', label: 'By Priority' },
    { value: 'due_date', label: 'By Due Date' },
    { value: 'assignee', label: 'By Assignee' },
    { value: 'none', label: 'No Grouping' },
  ]

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border bg-card">
        {views.map(({ value, label, icon: Icon }) => {
          const isActive = currentView === value
          return (
            <Button
              key={value}
              variant={isActive ? "secondary" : "ghost"}
              className="px-3"
              onClick={() => onViewChange(value)}
            >
              <Icon className="h-4 w-4" />
              <span className="ml-2 hidden md:inline">{label}</span>
            </Button>
          )
        })}
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <GroupIcon className="mr-2 h-4 w-4" />
            Group
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Group Tasks</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={currentGrouping} 
            onValueChange={(value) => onGroupingChange(value as GroupingType)}
          >
            {groupingOptions.map(({ value, label }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}