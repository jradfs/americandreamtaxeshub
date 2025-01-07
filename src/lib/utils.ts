import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Task } from '@/types/tasks'
import { type ProjectWithRelations } from '@/types/projects'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterTasks(tasks: Task[], filters: { dueDate?: Date }) {
  if (!filters.dueDate) return tasks
  
  return tasks.filter(task => {
    if (!task.due_date) return false
    const taskDueDate = new Date(task.due_date)
    return taskDueDate <= filters.dueDate
  })
}

export function groupTasks(tasks: Task[], groupBy: string) {
  if (!tasks?.length) return {}
  
  return tasks.reduce((groups, task) => {
    const key = task[groupBy as keyof Task] as string
    if (!key) return groups
    
    return {
      ...groups,
      [key]: [...(groups[key] || []), task]
    }
  }, {} as { [key: string]: Task[] })
}

export function calculateCompletionRate(project: ProjectWithRelations): number {
  if (!project.tasks?.length) return 0
  const completedTasks = project.tasks.filter(task => task.status === 'completed')
  return (completedTasks.length / project.tasks.length) * 100
}

export function assessProjectRisk(project: ProjectWithRelations): string {
  const completionRate = calculateCompletionRate(project)
  const dueDate = project.due_date ? new Date(project.due_date) : null
  const today = new Date()

  if (!dueDate) return 'unknown'
  if (dueDate < today && completionRate < 100) return 'high'
  if (completionRate < 50 && dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) return 'high'
  if (completionRate < 75) return 'medium'
  return 'low'
}

export function predictDelay(project: ProjectWithRelations): number {
  const completionRate = calculateCompletionRate(project)
  if (completionRate === 100) return 0

  const dueDate = project.due_date ? new Date(project.due_date) : null
  if (!dueDate) return 0

  const today = new Date()
  const remainingWork = 100 - completionRate
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  
  if (daysUntilDue <= 0) return Math.ceil(remainingWork / 10)
  return Math.max(0, Math.ceil(remainingWork / 10) - daysUntilDue)
}

export function analyzeResourceUtilization(project: ProjectWithRelations): number {
  if (!project.team_members?.length || !project.tasks?.length) return 0

  const assignedTasks = project.tasks.filter(task => task.assignee_id)
  return (assignedTasks.length / project.tasks.length) * 100
}

export function generateRecommendations(project: ProjectWithRelations): string[] {
  const recommendations: string[] = []
  const completionRate = calculateCompletionRate(project)
  const riskLevel = assessProjectRisk(project)
  const resourceUtilization = analyzeResourceUtilization(project)

  if (completionRate < 50) {
    recommendations.push('Project progress is behind schedule. Consider allocating more resources.')
  }

  if (riskLevel === 'high') {
    recommendations.push('High risk detected. Immediate attention required.')
  }

  if (resourceUtilization < 70) {
    recommendations.push('Resource utilization is low. Consider optimizing task assignments.')
  }

  if (!project.tasks?.some(task => task.priority === 'high')) {
    recommendations.push('No high-priority tasks identified. Review task prioritization.')
  }

  return recommendations
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
