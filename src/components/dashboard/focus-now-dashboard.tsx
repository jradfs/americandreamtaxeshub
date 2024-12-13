'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, Timer, Tag } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { calculatePriority } from '@/lib/priority-calculator'
import { Task } from '@/types/hooks'

export interface Task {
  id: string
  title: string
  description?: string
  due_date: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'completed'
  project_id?: string
  assigned_to?: string
  estimated_minutes?: number
  category?: string
  tags?: string[]
  dependencies?: string[]
}

export function FocusNowDashboard() {
  const { projects } = useProjects()
  const { tasks } = useTasks()
  const [priorityTasks, setPriorityTasks] = useState<Task[]>([])
  const [alerts, setAlerts] = useState<{ title: string; description: string }[]>([])

  useEffect(() => {
    if (tasks) {
      // Sort tasks based on priority calculation
      const sortedTasks = [...tasks].sort((a, b) => {
        const priorityA = calculatePriority(a, projects)
        const priorityB = calculatePriority(b, projects)
        return priorityB - priorityA
      })

      setPriorityTasks(sortedTasks.slice(0, 5)) // Show top 5 priority tasks

      // Generate alerts for urgent tasks and approaching deadlines
      const newAlerts = []
      const today = new Date()
      
      tasks.forEach(task => {
        if (task.due_date) {
          const dueDate = new Date(task.due_date)
          const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff <= 2 && task.status !== 'completed') {
            newAlerts.push({
              title: 'Urgent Task',
              description: `"${task.title}" is due in ${daysDiff} day${daysDiff === 1 ? '' : 's'}!`
            })
          }
        }

        // Check for blocked tasks (tasks with incomplete dependencies)
        if (task.dependencies && task.dependencies.length > 0) {
          const blockedBy = tasks.filter(t => 
            task.dependencies?.includes(t.id) && t.status !== 'completed'
          )
          if (blockedBy.length > 0) {
            newAlerts.push({
              title: 'Blocked Task',
              description: `"${task.title}" is blocked by ${blockedBy.length} task${blockedBy.length === 1 ? '' : 's'}`
            })
          }
        }
      })
      
      setAlerts(newAlerts)
    }
  }, [tasks, projects])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Now Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Priority Tasks */}
          <div>
            <h3 className="font-semibold mb-2">Priority Tasks</h3>
            <div className="space-y-2">
              {priorityTasks.map(task => (
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
                    {task.category && (
                      <Badge variant="outline" className="ml-2">
                        {task.category}
                      </Badge>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4" />
                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {task.estimated_minutes && (
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{task.estimated_minutes}m</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
