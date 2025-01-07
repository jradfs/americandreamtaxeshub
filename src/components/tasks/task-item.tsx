'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TaskDialog } from './task-dialog';
import { Task, TaskFormData } from '@/types/tasks';
import { TemplateTask } from '@/lib/validations/project';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task | TaskFormData | TemplateTask;
  onEdit: (task: Task | TaskFormData) => void;
  onDelete: () => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
              <div className="flex gap-2">
                {task.priority && (
                  <Badge variant="outline">{task.priority}</Badge>
                )}
                {'assigned_team' in task && task.assigned_team?.length > 0 && (
                  <Badge variant="outline">
                    {task.assigned_team.length} Assigned
                  </Badge>
                )}
                {'assignee_id' in task && task.assignee_id && (
                  <Badge variant="outline">
                    Assigned
                  </Badge>
                )}
                {'status' in task && task.status && (
                  <Badge variant="outline">{task.status}</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={task}
        onSubmit={onEdit}
      />
    </>
  );
} 