'use client'

import { Task } from '@/types/workspace'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, AlertCircle, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Task>) => Promise<void>
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onUpdate
}: TaskCardProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  return (
    <Card className="group">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-medium line-clamp-2">
              {task.title}
            </h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
              >
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
        </div>

        {task.client && (
          <div className="text-sm text-muted-foreground mb-2">
            {task.client.company_name || task.client.full_name}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          {task.priority === 'high' && (
            <Badge variant="destructive" className="h-5">High</Badge>
          )}
          {task.due_date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-destructive' : ''}>
                {formatDate(task.due_date)}
              </span>
              {isOverdue && <AlertCircle className="h-4 w-4 text-destructive" />}
            </div>
          )}
        </div>

        {task.progress !== undefined && (
          <Progress value={task.progress} className="h-2 mb-3" />
        )}

        <div className="flex items-center justify-between">
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar_url || ''} />
              <AvatarFallback>
                {task.assignee.full_name?.[0] || task.assignee.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}