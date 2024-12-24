'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Plus, Search } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from 'date-fns'
import { TaskDialog } from './task-dialog'
import { TaskWithRelations, taskStatusOptions, taskPriorityOptions } from '@/types/tasks'
import { useToast } from '@/components/ui/use-toast'

interface TaskListProps {
  projectId?: string
}

export default function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  async function fetchTasks() {
    if (!projectId) return
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()

    // Set up real-time subscription
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

    // Cleanup subscription
    return () => {
      channel.unsubscribe()
    }
  }, [projectId, supabase, toast])

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
    <div className="space-y-4">
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
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
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

          <Button onClick={() => {
            setSelectedTask(null)
            setIsDialogOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
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
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'in-progress' ? 'secondary' :
                      task.status === 'blocked' ? 'destructive' :
                      'outline'
                    }>
                      {taskStatusOptions.find(s => s.value === task.status)?.label || task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      task.priority === 'urgent' ? 'destructive' :
                      task.priority === 'high' ? 'default' :
                      task.priority === 'medium' ? 'secondary' :
                      'outline'
                    }>
                      {taskPriorityOptions.find(p => p.value === task.priority)?.label || task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '-'}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task)
                        setIsDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        projectId={projectId}
      />
    </div>
  )
}