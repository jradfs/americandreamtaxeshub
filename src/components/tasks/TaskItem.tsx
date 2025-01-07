'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateTask } from '@/lib/supabase/tasks'
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { TaskStatus, TaskPriority, taskStatusOptions, taskPriorityOptions } from '@/types/tasks'
import { useToast } from "@/components/ui/use-toast"
import type { DbTask } from '@/types/tasks'

interface TaskItemProps {
  task: DbTask
  onUpdate?: (task: DbTask) => void
  onDelete?: (taskId: string) => void
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800"
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      setIsUpdating(true)
      const updatedTask = await updateTask(task.id, { status })
      onUpdate?.(updatedTask)
      toast({
        title: "Task updated",
        description: "Task status has been updated successfully."
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePriorityChange = async (priority: TaskPriority) => {
    try {
      setIsUpdating(true)
      const updatedTask = await updateTask(task.id, { priority })
      onUpdate?.(updatedTask)
      toast({
        title: "Task updated",
        description: "Task priority has been updated successfully."
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task priority.",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <Checkbox 
          checked={task.status === 'completed'}
          onCheckedChange={(checked) => {
            handleStatusChange(checked ? 'completed' : 'todo')
          }}
          disabled={isUpdating}
        />
        <div>
          <h3 className={cn(
            "font-medium",
            task.status === 'completed' && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline" className={STATUS_COLORS[task.status]}>
              {task.status}
            </Badge>
            {task.priority && (
              <Badge variant="outline" className={PRIORITY_COLORS[task.priority]}>
                {task.priority}
              </Badge>
            )}
            {task.due_date && (
              <span className="text-sm text-gray-500">
                Due {format(new Date(task.due_date), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={task.status}
          onValueChange={(value) => handleStatusChange(value as TaskStatus)}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {taskStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={task.priority || undefined}
          onValueChange={(value) => handlePriorityChange(value as TaskPriority)}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {taskPriorityOptions.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(task.id)}
            disabled={isUpdating}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
