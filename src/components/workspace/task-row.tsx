'use client'

import { Task } from '@/types/workspace'
import { TableCell, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, AlertCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { formatDate } from '@/lib/utils'

interface TaskRowProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Task>) => Promise<void>
}

export function TaskRow({
  task,
  onEdit,
  onDelete,
  onUpdate
}: TaskRowProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  const handleStatusChange = async (checked: boolean) => {
    await onUpdate({
      status: checked ? 'done' : 'todo'
    })
  }

  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={task.status === 'done'}
          onCheckedChange={handleStatusChange}
        />
      </TableCell>
      
      <TableCell>
        <div className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>
          {task.title}
        </div>
      </TableCell>

      <TableCell>
        {task.client && (
          <span className="text-sm text-muted-foreground">
            {task.client.company_name || task.client.full_name}
          </span>
        )}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Progress value={task.progress || 0} className="w-[180px]" />
          <span className="text-sm text-muted-foreground">
            {task.progress || 0}%
          </span>
        </div>
      </TableCell>

      <TableCell>
        {task.due_date && (
          <div className="flex items-center gap-2">
            <span className={isOverdue ? 'text-destructive' : ''}>
              {formatDate(task.due_date)}
            </span>
            {isOverdue && (
              <HoverCard>
                <HoverCardTrigger>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </HoverCardTrigger>
                <HoverCardContent>
                  This task is overdue
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        )}
      </TableCell>

      <TableCell>
        {task.assignee && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar_url || ''} />
              <AvatarFallback>
                {task.assignee.full_name?.[0] || task.assignee.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {task.assignee.full_name || task.assignee.email}
            </span>
          </div>
        )}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={onDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}