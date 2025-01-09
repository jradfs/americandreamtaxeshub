'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { TaskWithRelations } from '@/types/tasks';
import { TaskDialog } from './task-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Circle, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskItemProps {
  task: TaskWithRelations;
  onUpdate: (task: Partial<TaskWithRelations>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  showDetails?: boolean;
}

export function TaskItem({ task, onUpdate, onDelete, showDetails = false }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  const handleStatusToggle = async () => {
    await onUpdate({
      id: task.id,
      status: task.status === 'completed' ? 'in_progress' : 'completed',
      completed_at: task.status === 'completed' ? null : new Date().toISOString()
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleStatusToggle();
        break;
      case 'e':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setIsEditDialogOpen(true);
        }
        break;
      case 'Delete':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleDelete();
        }
        break;
    }
  };

  return (
    <>
      <Card
        className="p-4 hover:shadow-md transition-shadow"
        role="listitem"
        aria-label={`Task: ${task.title}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5"
            onClick={handleStatusToggle}
            aria-label={`Mark task as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 
                  className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}
                  aria-label={task.status === 'completed' ? 'Completed task' : 'Active task'}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={isDeleting}
                    ref={dropdownTriggerRef}
                    aria-label="Task actions"
                  >
                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setIsEditDialogOpen(true)}
                    onSelect={() => dropdownTriggerRef.current?.focus()}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    onSelect={() => dropdownTriggerRef.current?.focus()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {showDetails && (
              <div className="mt-4 space-y-2" role="region" aria-label="Task details">
                <div className="flex flex-wrap gap-2">
                  {task.priority && (
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                      aria-label={`Priority: ${task.priority}`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </Badge>
                  )}
                  {task.status && (
                    <Badge 
                      variant="outline"
                      aria-label={`Status: ${task.status}`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  {task.project && (
                    <p aria-label={`Project: ${task.project.name}`}>
                      Project: {task.project.name}
                    </p>
                  )}
                  {task.assignee && (
                    <p aria-label={`Assigned to: ${task.assignee.full_name || task.assignee.email}`}>
                      Assigned to: {task.assignee.full_name || task.assignee.email}
                    </p>
                  )}
                  {task.parent_task && (
                    <p aria-label={`Parent task: ${task.parent_task.title}`}>
                      Parent task: {task.parent_task.title}
                    </p>
                  )}
                  {task.created_at && (
                    <p aria-label={`Created ${formatDistanceToNow(new Date(task.created_at))} ago`}>
                      Created {formatDistanceToNow(new Date(task.created_at))} ago
                    </p>
                  )}
                  {task.checklist_items && task.checklist_items.length > 0 && (
                    <p aria-label={`Checklist: ${task.checklist_items.filter(item => item.completed).length} of ${task.checklist_items.length} items completed`}>
                      Checklist: {task.checklist_items.filter(item => item.completed).length}/{task.checklist_items.length} completed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <TaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={async (data) => {
          await onUpdate({ id: task.id, ...data });
          setIsEditDialogOpen(false);
        }}
        taskData={task}
      />
    </>
  );
}

export function TaskItemSkeleton() {
  return (
    <Card className="p-4" role="listitem" aria-label="Loading task item">
      <div className="flex items-start gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  );
} 