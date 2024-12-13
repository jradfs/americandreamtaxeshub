'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { calculatePriority } from '@/lib/priority-calculator'
import { Task } from '@/types/hooks'

interface SmartQueueItem extends Task {
  priorityScore: number
  project?: {
    name: string
    client_id: number
  }
}

export function SmartQueue() {
  const { projects } = useProjects()
  const { tasks, updateTask } = useTasks()
  const [queuedTasks, setQueuedTasks] = useState<SmartQueueItem[]>([])

  useEffect(() => {
    if (tasks && projects) {
      // Calculate priority scores and enrich tasks with project data
      const enrichedTasks = tasks
        .filter(task => task.status !== 'completed')
        .map(task => ({
          ...task,
          priorityScore: calculatePriority(task, projects),
          project: projects.find(p => p.id === task.project_id),
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore)

      setQueuedTasks(enrichedTasks)
    }
  }, [tasks, projects])

  const handleStatusUpdate = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'completed') => {
    try {
      await updateTask(taskId, { status: newStatus })
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queuedTasks.map(task => (
            <div
              key={task.id}
              className="border rounded-lg p-4 space-y-2 hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}
                  />
                  <h3 className="font-medium">{task.title}</h3>
                  <Badge variant="outline">{task.project?.name}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Progress value={task.priorityScore * 100} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  Priority Score: {Math.round(task.priorityScore * 100)}
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                {task.status !== 'completed' && (
                  <>
                    {task.status === 'todo' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                      >
                        Start Task
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(task.id, 'completed')}
                      >
                        Complete Task
                      </Button>
                    )}
                  </>
                )}
                {task.status === 'completed' && (
                  <Badge variant="secondary">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
