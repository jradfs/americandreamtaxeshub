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

type Task = {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'completed'
  due_date: Date | null
  priority?: 'low' | 'medium' | 'high'
  description?: string
}

const STATUS_COLORS = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800"
}

export function TaskItem({ task }: { task: Task }) {
  const [localTask, setLocalTask] = useState(task)

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await updateTask(task.id, { status: newStatus })
      setLocalTask(prev => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error('Failed to update task status', error)
    }
  }

  const handleCompleteToggle = async () => {
    const newStatus = localTask.status === 'completed' ? 'todo' : 'completed'
    await handleStatusChange(newStatus)
  }

  const handleDueDateChange = async (newDate: Date) => {
    try {
      await updateTask(task.id, { due_date: newDate })
      setLocalTask(prev => ({ ...prev, due_date: newDate }))
    } catch (error) {
      console.error('Failed to update due date', error)
    }
  }

  return (
    <div className="flex items-center space-x-4 p-2 hover:bg-accent/50 rounded-md transition-colors">
      <Checkbox 
        checked={localTask.status === 'completed'}
        onCheckedChange={handleCompleteToggle}
        className="border-muted-foreground"
      />
      
      <div className="flex-grow">
        <div className="font-medium">{task.title}</div>
        {task.description && (
          <div className="text-muted-foreground text-sm">{task.description}</div>
        )}
      </div>

      <Select 
        value={localTask.status} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Badge 
        variant="outline"
        className={cn(
          "px-2 py-1 text-xs",
          STATUS_COLORS[localTask.status]
        )}
      >
        {localTask.status}
      </Badge>

      <input 
        type="date"
        value={localTask.due_date ? format(localTask.due_date, 'yyyy-MM-dd') : ''}
        onChange={(e) => handleDueDateChange(new Date(e.target.value))}
        className="border rounded px-2 py-1 text-sm text-muted-foreground"
      />
    </div>
  )
}
