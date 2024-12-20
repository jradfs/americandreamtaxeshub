'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Timer, ArrowUpDown, Trash2, Plus } from 'lucide-react'
import { useTemplateTasks } from 'src/hooks/useTemplateTasks';
import { ProjectTemplate } from 'src/types/hooks';
import { CreateTemplateTaskDialog } from './create-template-task-dialog';

interface TemplateTasksProps {
  template: ProjectTemplate
}

export function TemplateTasks({ template }: TemplateTasksProps) {
  const { tasks, reorderTask, deleteTask } = useTemplateTasks(template.id)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const moveTask = async (taskId: string, direction: 'up' | 'down') => {
    const currentIndex = tasks.findIndex(t => t.id === taskId)
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < tasks.length - 1)
    ) {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      await reorderTask(taskId, tasks[newIndex].order_index)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Template Tasks</CardTitle>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    task.priority === 'high'
                      ? 'destructive'
                      : task.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {task.priority}
                </Badge>
                <span>{task.title}</span>
                {task.estimated_minutes && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Timer className="mr-1 h-4 w-4" />
                    {task.estimated_minutes}m
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveTask(task.id, 'up')}
                  disabled={tasks.indexOf(task) === 0}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CreateTemplateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        templateId={template.id}
        existingTasks={tasks}
      />
    </Card>
  )
}
