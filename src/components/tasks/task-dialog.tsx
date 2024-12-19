import { useTasks } from 'src/hooks/useTasks'
import { Task, TaskFormData } from 'src/types/task'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select'
import { Textarea } from 'src/components/ui/textarea'
import { useToast } from 'src/hooks/use-toast'
import { useState } from "react"

interface TaskDialogProps {
  task?: Task | null
  projectId?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function TaskDialog({
  task,
  projectId,
  open,
  onOpenChange,
  onClose,
}: TaskDialogProps) {
  const { addTask, updateTask } = useTasks()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo" as "todo" | "in_progress" | "completed" | "blocked",
    priority: task?.priority || "medium",
    project_id: projectId ? String(projectId) : task?.project_id || undefined,
    due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
    assignee_id: task?.assignee_id || null,
    is_recurring: task?.is_recurring || false,
    progress: task?.progress || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      }

      if (task) {
        await updateTask(task.id, data)
        toast({
          title: "Task updated",
          description: "Task has been updated successfully.",
        })
      } else {
        await addTask(data)
        toast({
          title: "Task created",
          description: "New task has been created successfully.",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogDescription>
              {task
                ? "Make changes to the task here."
                : "Create a new task with the form below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as "todo" | "in_progress" | "completed" | "blocked" }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value as "low" | "medium" | "high" }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="due_date" className="text-right">
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, due_date: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : task ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
