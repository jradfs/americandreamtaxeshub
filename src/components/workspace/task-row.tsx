'use client';

import { Task, Status } from 'src/types/task-management';
import { Checkbox } from 'src/components/ui/checkbox';
import { Badge } from 'src/components/ui/badge';
import { Progress } from 'src/components/ui/progress';
import { Avatar, AvatarFallback } from 'src/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from 'src/components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { MoreHorizontal, AlertCircle } from 'lucide-react';
import { TableCell, TableRow } from 'src/components/ui/table';
import { cn } from 'src/lib/utils';
import { formatDate, isOverdue, DATE_FORMATS } from 'src/lib/date-utils';

interface TaskRowProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskRow({ task, onUpdateTask, onEditTask, onDeleteTask }: TaskRowProps) {
  const getStatusVariant = (status: Status) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <TableRow key={task.id} className="group">
      <TableCell>
        <Checkbox 
          checked={task.status === 'done'}
          onCheckedChange={(checked) => {
            onUpdateTask(task.id, { status: checked ? 'done' : 'in_progress' })
          }}
        />
      </TableCell>
      <TableCell>{task.client || 'Unassigned'}</TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger>
            <div className="space-y-1">
              <div className="font-medium">{task.title}</div>
              <Badge variant={getStatusVariant(task.status)}>
                {task.status}
              </Badge>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
              <div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  Created {formatDate(task.created_at, DATE_FORMATS.FULL)}
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Progress 
            value={task.progress || 0} 
            className={cn(
              "h-2",
              task.status === 'done' ? "bg-green-100" : "",
              isOverdue(task.due_date) ? "bg-red-100" : ""
            )}
          />
          <div className="text-xs text-muted-foreground">
            {task.progress || 0}% Complete
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className={cn(
            isOverdue(task.due_date) ? 'text-red-500' : '',
            'whitespace-nowrap'
          )}>
            {formatDate(task.due_date, DATE_FORMATS.FULL)}
          </div>
          {isOverdue(task.due_date) && (
            <HoverCard>
              <HoverCardTrigger>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </HoverCardTrigger>
              <HoverCardContent>
                <span className="text-sm text-red-500">
                  This task is overdue
                </span>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </TableCell>
      <TableCell>
        {task.assigned_user_id ? (
          <HoverCard>
            <HoverCardTrigger>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{task.assigned_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
              <div className="flex justify-between space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{task.assigned_user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Assigned User</h4>
                  <p className="text-sm text-muted-foreground">
                    Team Member
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Badge variant="outline">Unassigned</Badge>
        )}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditTask(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Assign</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}