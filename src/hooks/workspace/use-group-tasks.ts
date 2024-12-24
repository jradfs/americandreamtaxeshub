import { useMemo } from 'react'
import { Task, GroupingType } from '@/types/workspace'
import { formatDate } from '@/lib/utils'

export function useGroupTasks(tasks: Task[], grouping: GroupingType) {
  return useMemo(() => {
    switch (grouping) {
      case 'status':
        return groupByStatus(tasks)
      case 'priority':
        return groupByPriority(tasks)
      case 'due_date':
        return groupByDueDate(tasks)
      case 'assignee':
        return groupByAssignee(tasks)
      default:
        return { 'All Tasks': tasks }
    }
  }, [tasks, grouping])
}

function groupByStatus(tasks: Task[]) {
  const groups: Record<string, Task[]> = {
    'To Do': [],
    'In Progress': [],
    'Done': [],
  }

  tasks.forEach(task => {
    switch (task.status) {
      case 'todo':
        groups['To Do'].push(task)
        break
      case 'in_progress':
        groups['In Progress'].push(task)
        break
      case 'done':
        groups['Done'].push(task)
        break
      default:
        groups['To Do'].push(task)
    }
  })

  return groups
}

function groupByPriority(tasks: Task[]) {
  const groups: Record<string, Task[]> = {
    'High': [],
    'Medium': [],
    'Low': [],
  }

  tasks.forEach(task => {
    switch (task.priority) {
      case 'high':
        groups['High'].push(task)
        break
      case 'medium':
        groups['Medium'].push(task)
        break
      case 'low':
        groups['Low'].push(task)
        break
      default:
        groups['Medium'].push(task)
    }
  })

  return groups
}

function groupByDueDate(tasks: Task[]) {
  const groups: Record<string, Task[]> = {
    'Overdue': [],
    'Today': [],
    'This Week': [],
    'Later': [],
    'No Due Date': [],
  }

  const today = new Date()
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + 7)

  tasks.forEach(task => {
    if (!task.due_date) {
      groups['No Due Date'].push(task)
      return
    }

    const dueDate = new Date(task.due_date)
    
    if (dueDate < today && formatDate(dueDate) !== formatDate(today)) {
      groups['Overdue'].push(task)
    } else if (formatDate(dueDate) === formatDate(today)) {
      groups['Today'].push(task)
    } else if (dueDate <= endOfWeek) {
      groups['This Week'].push(task)
    } else {
      groups['Later'].push(task)
    }
  })

  return groups
}

function groupByAssignee(tasks: Task[]) {
  const groups: Record<string, Task[]> = {
    'Unassigned': []
  }

  tasks.forEach(task => {
    if (!task.assignee) {
      groups['Unassigned'].push(task)
      return
    }

    const assigneeName = task.assignee.full_name || task.assignee.email || 'Unknown'
    if (!groups[assigneeName]) {
      groups[assigneeName] = []
    }
    groups[assigneeName].push(task)
  })

  return groups
}