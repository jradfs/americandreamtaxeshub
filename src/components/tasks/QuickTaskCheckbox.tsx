'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { updateTask } from "@/lib/supabase/tasks"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

type QuickTaskCheckboxProps = {
  taskId: string
  isCompleted: boolean
  onStatusChange?: (completed: boolean) => void
}

export function QuickTaskCheckbox({ 
  taskId, 
  isCompleted: initialIsCompleted, 
  onStatusChange 
}: QuickTaskCheckboxProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)

  const handleCheckboxChange = async (checked: boolean) => {
    try {
      // Update the task status
      await updateTask(taskId, { 
        status: checked ? 'completed' : 'todo',
        completed_at: checked ? new Date().toISOString() : null
      })

      // Update local state
      setIsCompleted(checked)

      // Optional callback for parent component
      onStatusChange?.(checked)

      // Show success toast
      toast({
        title: checked ? "Task Completed" : "Task Marked Incomplete",
        description: `Task has been ${checked ? 'completed' : 'marked as todo'}`,
        variant: "default"
      })
    } catch (error) {
      // Handle error
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      })
      console.error(error)
    }
  }

  return (
    <Checkbox
      checked={isCompleted}
      onCheckedChange={handleCheckboxChange}
      className="mr-2"
    />
  )
}
