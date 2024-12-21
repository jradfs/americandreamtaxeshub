'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
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
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'

type Task = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  progress: number
  estimated_hours: number
  actual_hours: number
  assignee_id: string
  created_at: string
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setTasks(data || [])
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button>Add New Task</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  task.priority === 'high' ? 'destructive' : 
                  task.priority === 'medium' ? 'default' : 
                  'secondary'
                }>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '-'}
              </TableCell>
              <TableCell>
                <div className="w-[100px]">
                  <Progress value={task.progress || 0} />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={
                  task.status === 'completed' ? 'default' : 
                  task.status === 'in_progress' ? 'secondary' : 
                  'outline'
                }>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Est: {task.estimated_hours}h</div>
                  <div>Act: {task.actual_hours}h</div>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}