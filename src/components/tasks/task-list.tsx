'use client'

import { useState, useEffect, useCallback } from 'react'
import { ConfirmationDialog } from 'src/components/ui/confirmation-dialog'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Plus, Search } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { TaskWithRelations, taskStatusOptions, taskPriorityOptions } from '@/types/tasks'
import { useToast } from '@/components/ui/use-toast'
import { TaskSidePanel } from './task-side-panel'
import { updateTask } from '@/lib/supabase/tasks'

interface TaskListProps {
  projectId?: string
  clientId?: string
}

export function TaskList({ projectId, clientId }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<TaskWithRelations | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      // Only filter by project if projectId is provided
      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error
      
      // Update tasks state with fetched data
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
      // Clear tasks on error
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [projectId, supabase, toast])

  useEffect(() => {
    fetchTasks()

    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Change received!', payload)
          fetchTasks()
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to changes!')
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [projectId, supabase, toast, fetchTasks])

  const handleOpenSidePanel = (task?: TaskWithRelations) => {
    setSelectedTask(task || null)
    setIsSidePanelOpen(true)
  }

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false)
    setSelectedTask(null)
  }

  const handleTaskUpdate = useCallback((updatedTask: TaskWithRelations) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
      
      if (!prevTasks.some(task => task.id === updatedTask.id)) {
        updatedTasks.unshift(updatedTask)
      }

      return updatedTasks
    })
  }, [])

  const handleDeleteTask = async (task: TaskWithRelations) => {
    setTaskToDelete(task)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete.id)

      if (error) throw error

      // Remove task from local state
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskToDelete.id))

      toast({
        title: "Task Deleted",
        description: "The task was successfully deleted.",
        duration: 2000
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Could not delete task. Please try again.",
        variant: "destructive"
      })
    } finally {
      setTaskToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleQuickTaskComplete = async (task: TaskWithRelations) => {
    try {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed'
      const updatedTask = await updateTask(task.id, { 
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : 0
      })

      // Optimistically update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id 
            ? { ...t, status: newStatus, progress: newStatus === 'completed' ? 100 : 0 }
            : t
        )
      )

      toast({
        title: "Task Updated",
        description: `Task marked as ${newStatus}`,
        duration: 2000
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Could not update task status",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading tasks...</div>
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-4" data-testid="tasks-section">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[150px]" data-testid="filter-complete">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {taskStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

            <Select
              value={priorityFilter || "all"}
              onValueChange={(value) => setPriorityFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[150px]" data-testid="sort-priority-asc">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {taskPriorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

            <Select
              value={""}
              onValueChange={(value) => {
                // Handle due date sorting
                const sortedTasks = [...tasks].sort((a, b) => {
                  const dateA = a.due_date ? new Date(a.due_date) : null;
                  const dateB = b.due_date ? new Date(b.due_date) : null;
                  if (value === "asc") {
                    return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
                  } else {
                    return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
                  }
                });
                setTasks(sortedTasks);
              }}
            >
              <SelectTrigger className="w-[150px]" data-testid="sort-due-date-desc">
                <SelectValue placeholder="Sort by Due Date" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Due Date (Ascending)</SelectItem>
              <SelectItem value="desc">Due Date (Descending)</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => handleOpenSidePanel()} data-testid="create-task-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Complete</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id} data-testid="task-item">
                  <TableCell>
                    <Checkbox 
                      data-testid="complete-task-button"
                      checked={task.status === 'completed'}
                      onCheckedChange={() => handleQuickTaskComplete(task)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge data-testid="task-status" variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'in-progress' ? 'secondary' :
                      task.status === 'blocked' ? 'destructive' :
                      'outline'
                    }>
                      {taskStatusOptions.find(s => s.value === task.status)?.label || task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge data-testid="task-priority" variant={
                      task.priority === 'urgent' ? 'destructive' :
                      task.priority === 'high' ? 'default' :
                      task.priority === 'medium' ? 'secondary' :
                      'outline'
                    }>
                      {taskPriorityOptions.find(p => p.value === task.priority)?.label || task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span data-testid="task-due-date">
                      {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm w-12">{task.progress || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenSidePanel(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task)}
                        data-testid="delete-task-button"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaskSidePanel
        isOpen={isSidePanelOpen}
        onClose={handleCloseSidePanel}
        task={selectedTask}
        projectId={projectId}
        clientId={clientId}
        onTaskUpdate={handleTaskUpdate}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDeleteTask}
      />
    </div>
  )
}
