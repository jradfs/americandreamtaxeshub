import { useTasks } from "@/hooks/useTasks"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Clock, User } from "lucide-react"
import { TaskDialog } from "./task-dialog"
import { useState } from "react"
import { Task } from "@/types/hooks"

interface TaskListProps {
  projectId?: number
  userId?: number
}

export function TaskList({ projectId, userId }: TaskListProps) {
  const { tasks, loading, error } = useTasks(projectId, userId)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {task.due_date && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
                {task.assigned_user_id && (
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span>Assigned to: {task.assigned_user_id}</span>
                  </div>
                )}
                {task.priority && (
                  <Badge variant={getPriorityVariant(task.priority)} className="mt-2">
                    {task.priority}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedTask(task)
                  setIsDialogOpen(true)
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        projectId={projectId}
        onClose={() => {
          setSelectedTask(null)
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'pending':
      return 'outline'
    case 'blocked':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getPriorityVariant(priority: string) {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'secondary'
    case 'low':
      return 'outline'
    default:
      return 'secondary'
  }
}
