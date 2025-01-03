'use client'

import { useState, useCallback, useMemo } from 'react'
import { addDays, isAfter, isBefore, startOfDay, addMonths, isWithinInterval } from 'date-fns'
import { 
  ProjectWithRelations, 
  ServiceCategory, 
  TaxReturnType, 
  ProjectStatus,
  Priority,
  ReviewStatus
} from '@/types/projects'
import { useProjects } from './useProjects'

export type ProjectView = 'service' | 'deadline' | 'status' | 'client' | 'return_type' | 'review_status' | 'priority'

interface ProjectFilters {
  search: string
  service?: ServiceCategory[]
  status?: ProjectStatus[]
  priority?: Priority[]
  dueThisWeek?: boolean
  dueThisMonth?: boolean
  dueThisQuarter?: boolean
  missingInfo?: boolean
  needsReview?: boolean
  readyToFile?: boolean
  returnType?: TaxReturnType[]
  reviewStatus?: ReviewStatus[]
  clientId?: string
  teamMemberId?: string
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  hasDocuments?: boolean
  hasNotes?: boolean
  hasTimeEntries?: boolean
}

const defaultFilters: ProjectFilters = {
  search: ''
}

// Tax-specific constants
const TAX_DEADLINES: Record<TaxReturnType, { normal: string; extended: string }> = {
  '1040': { normal: '04-15', extended: '10-15' },
  '1120': { normal: '04-15', extended: '10-15' },
  '1065': { normal: '03-15', extended: '09-15' },
  '1120S': { normal: '03-15', extended: '09-15' },
  '990': { normal: '05-15', extended: '11-15' },
  '941': { normal: 'quarterly', extended: 'N/A' },
  '940': { normal: '01-31', extended: 'N/A' },
  'other': { normal: '04-15', extended: '10-15' }
}

const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15']

interface ProjectMetrics {
  totalProjects: number
  completedProjects: number
  completionRate: number
  averageTimeToComplete: number
  projectsByService: Record<ServiceCategory, number>
  projectsByStatus: Record<ProjectStatus, number>
  projectsByPriority: Record<Priority, number>
  upcomingDeadlines: Array<{
    date: Date
    count: number
    projects: ProjectWithRelations[]
  }>
  clientDistribution: Array<{
    clientId: string
    clientName: string
    projectCount: number
  }>
  teamWorkload: Array<{
    userId: string
    userName: string
    projectCount: number
    totalEstimatedHours: number
  }>
}

// Helper functions
const isWithinNextDays = (date: Date, days: number): boolean => {
  const today = startOfDay(new Date())
  const future = addDays(today, days)
  return isWithinInterval(date, { start: today, end: future })
}

export function useProjectManagement(initialFilters?: ProjectFilters) {
  const { 
    projects, 
    loading, 
    error, 
    refresh,
    filters: baseFilters,
    setFilters: setBaseFilters,
    pagination,
    setPagination,
    sorting,
    setSorting
  } = useProjects(initialFilters)

  const [view, setView] = useState<ProjectView>('service')
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || defaultFilters)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Tax-specific deadline calculations - Moved before getProjectDeadline
  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear()
    const deadlineType = isExtended ? 'extended' : 'normal'
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15'
    return new Date(`${currentYear}-${monthDay}`)
  }, [])

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = startOfDay(new Date())
    const currentYear = today.getFullYear()
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`)
      if (isAfter(deadlineDate, today)) {
        return deadlineDate
      }
    }
    
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`)
  }, [])

  // Helper function to get project deadline - Now getDeadline is defined before this
  const getProjectDeadline = useCallback((project: ProjectWithRelations): Date | null => {
    if (project.due_date) {
      return new Date(project.due_date)
    }
    if (project.tax_info?.filing_deadline) {
      return new Date(project.tax_info.filing_deadline)
    }
    if (project.payroll_info?.next_payroll_date) {
      return new Date(project.payroll_info.next_payroll_date)
    }
    if (project.business_services_info?.due_date) {
      return new Date(project.business_services_info.due_date)
    }
    if (project.tax_info?.return_type) {
      const isExtended = project.tax_info.is_extended || false
      return getDeadline(project.tax_info.return_type, isExtended)
    }
    return null
  }, [getDeadline])

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>, filterKey: string) => {
    setFilters(current => {
      const updatedFilters = { ...current }
      
      if (selectedFilters.includes(filterKey)) {
        Object.keys(newFilters).forEach(key => {
          delete updatedFilters[key as keyof ProjectFilters]
        })
        setSelectedFilters(prev => prev.filter(f => f !== filterKey))
      } else {
        Object.entries(newFilters).forEach(([key, value]) => {
          updatedFilters[key as keyof ProjectFilters] = value
        })
        setSelectedFilters(prev => [...prev, filterKey])
      }
      
      // Update base filters for pagination
      setBaseFilters({
        ...baseFilters,
        ...updatedFilters
      })
      
      return updatedFilters
    })
  }, [selectedFilters, baseFilters, setBaseFilters])

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
    setSelectedFilters([])
    setBaseFilters({})
  }, [setBaseFilters])

  const filterProjects = useCallback((projects: ProjectWithRelations[]) => {
    if (!projects) return [];
    
    return projects.filter(project => {
      const searchLower = (filters.search || '').toLowerCase()
      
      // Safely access potentially undefined properties
      const projectTitle = project?.title || ''
      const projectDesc = project?.description || ''
      const clientCompany = project?.client?.company_name || ''
      const clientName = project?.client?.full_name || ''
      const returnType = project?.tax_info?.return_type || ''
      
      const matchesSearch = !searchLower || (
        projectTitle.toLowerCase().includes(searchLower) ||
        projectDesc.toLowerCase().includes(searchLower) ||
        clientCompany.toLowerCase().includes(searchLower) ||
        clientName.toLowerCase().includes(searchLower) ||
        returnType.toLowerCase().includes(searchLower)
      )

      const matchesService = !filters.service?.length || 
        (project?.service_type && filters.service.includes(project.service_type))
      
      const matchesStatus = !filters.status?.length || 
        (project?.status && filters.status.includes(project.status))
      
      const matchesPriority = !filters.priority?.length || 
        (project?.priority && filters.priority.includes(project.priority))
      
      const matchesReturnType = !filters.returnType?.length || 
        (project?.tax_info?.return_type && filters.returnType.includes(project.tax_info.return_type))
      
      const matchesReviewStatus = !filters.reviewStatus?.length || 
        (project?.tax_info?.review_status && filters.reviewStatus.includes(project.tax_info.review_status))

      const deadline = getProjectDeadline(project)
      const matchesDueThisWeek = !filters.dueThisWeek || 
        (deadline && isWithinNextDays(deadline, 7))

      const matchesDueThisMonth = !filters.dueThisMonth || 
        (deadline && isWithinNextDays(deadline, 30))

      const matchesDueThisQuarter = !filters.dueThisQuarter || 
        (deadline && isWithinNextDays(deadline, 90))

      const matchesDateRange = !filters.dateRange || !deadline || 
        isWithinInterval(deadline, {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        })

      const matchesClient = !filters.clientId || 
        project.client_id === filters.clientId

      const matchesTeamMember = !filters.teamMemberId || 
        project.team_members?.some(member => member.user_id === filters.teamMemberId)

      const matchesTags = !filters.tags?.length ||
        filters.tags.every(tag => project.tags?.includes(tag))

      const matchesDocuments = !filters.hasDocuments ||
        (project.documents && project.documents.length > 0)

      const matchesNotes = !filters.hasNotes ||
        (project.notes && project.notes.length > 0)

      const matchesTimeEntries = !filters.hasTimeEntries ||
        (project.time_entries && project.time_entries.length > 0)

      return (
        matchesSearch &&
        matchesService &&
        matchesStatus &&
        matchesPriority &&
        matchesReturnType &&
        matchesReviewStatus &&
        matchesDueThisWeek &&
        matchesDueThisMonth &&
        matchesDueThisQuarter &&
        matchesDateRange &&
        matchesClient &&
        matchesTeamMember &&
        matchesTags &&
        matchesDocuments &&
        matchesNotes &&
        matchesTimeEntries
      )
    })
  }, [filters, getProjectDeadline])

  const groupKeyMap: Record<ProjectView, (project: ProjectWithRelations) => string> = {
    service: (p) => p.service_type || 'uncategorized',
    status: (p) => p.status,
    priority: (p) => p.priority,
    client: (p) => p.client?.company_name || p.client?.full_name || 'No Client',
    return_type: (p) => p.tax_info?.return_type || 'Not Tax Return',
    review_status: (p) => p.tax_info?.review_status || 'Not In Review',
    deadline: (p) => {
      const deadline = getProjectDeadline(p);
      if (!deadline) return 'No Due Date';
      const today = startOfDay(new Date());
      if (isBefore(deadline, today)) return 'Overdue';
      if (isWithinNextDays(deadline, 7)) return 'Due This Week';
      if (isWithinNextDays(deadline, 30)) return 'Due This Month';
      return 'Future';
    }
  };

  const groupProjects = useCallback((
    projects: ProjectWithRelations[],
    groupBy: ProjectView
  ): Record<string, ProjectWithRelations[]> => {
    return projects.reduce((groups, project) => {
      const key = groupKeyMap[groupBy](project);
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      groups[formattedKey] = groups[formattedKey] || [];
      groups[formattedKey].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, [getProjectDeadline])

  const getProjectMetrics = useCallback((projects: ProjectWithRelations[]): ProjectMetrics => {
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    
    const projectsByService = projects.reduce((acc, project) => {
      if (project.service_type) {
        acc[project.service_type] = (acc[project.service_type] || 0) + 1
      }
      return acc
    }, {} as Record<ServiceCategory, number>)

    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {} as Record<ProjectStatus, number>)

    const projectsByPriority = projects.reduce((acc, project) => {
      acc[project.priority] = (acc[project.priority] || 0) + 1
      return acc
    }, {} as Record<Priority, number>)

    const deadlineGroups = new Map<string, ProjectWithRelations[]>()
    projects.forEach(project => {
      const deadline = getProjectDeadline(project)
      if (deadline) {
        const key = deadline.toISOString().split('T')[0]
        if (!deadlineGroups.has(key)) {
          deadlineGroups.set(key, [])
        }
        deadlineGroups.get(key)?.push(project)
      }
    })

    const upcomingDeadlines = Array.from(deadlineGroups.entries())
      .map(([date, projects]) => ({
        date: new Date(date),
        count: projects.length,
        projects
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    const clientGroups = new Map<string, { name: string; count: number }>()
    projects.forEach(project => {
      if (project.client_id) {
        const name = project.client?.company_name || project.client?.full_name || 'Unknown'
        if (!clientGroups.has(project.client_id)) {
          clientGroups.set(project.client_id, { name, count: 0 })
        }
        clientGroups.get(project.client_id)!.count++
      }
    })

    const clientDistribution = Array.from(clientGroups.entries())
      .map(([id, { name, count }]) => ({
        clientId: id,
        clientName: name,
        projectCount: count
      }))
      .sort((a, b) => b.projectCount - a.projectCount)

    const teamGroups = new Map<string, { 
      name: string
      projectCount: number
      estimatedHours: number 
    }>()
    
    projects.forEach(project => {
      project.team_members?.forEach(member => {
        if (!teamGroups.has(member.user_id)) {
          teamGroups.set(member.user_id, {
            name: member.user?.full_name || 'Unknown',
            projectCount: 0,
            estimatedHours: 0
          })
        }
        const group = teamGroups.get(member.user_id)!
        group.projectCount++
        
        // Sum estimated hours from tasks
        const estimatedMinutes = project.tasks
          ?.filter(task => task.assignee_id === member.user_id)
          .reduce((sum, task) => sum + (task.estimated_minutes || 0), 0) || 0
        
        group.estimatedHours += estimatedMinutes / 60
      })
    })

    const teamWorkload = Array.from(teamGroups.entries())
      .map(([id, { name, projectCount, estimatedHours }]) => ({
        userId: id,
        userName: name,
        projectCount,
        totalEstimatedHours: Math.round(estimatedHours * 10) / 10
      }))
      .sort((a, b) => b.projectCount - a.projectCount)

    // Calculate average time to complete
    const completedWithDuration = projects.filter(p => 
      p.status === 'completed' && p.completed_at && p.created_at
    )
    
    const totalDuration = completedWithDuration.reduce((sum, p) => {
      const duration = new Date(p.completed_at!).getTime() - new Date(p.created_at).getTime()
      return sum + duration
    }, 0)

    const averageTimeToComplete = completedWithDuration.length > 0
      ? totalDuration / completedWithDuration.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

    return {
      totalProjects,
      completedProjects,
      completionRate: totalProjects ? (completedProjects / totalProjects) * 100 : 0,
      averageTimeToComplete,
      projectsByService,
      projectsByStatus,
      projectsByPriority,
      upcomingDeadlines,
      clientDistribution,
      teamWorkload
    }
  }, [getProjectDeadline])

  const filteredProjects = useMemo(() => filterProjects(projects || []), [filterProjects, projects])
  const groupedProjects = useMemo(() => groupProjects(filteredProjects, view), [filteredProjects, groupProjects, view])
  const metrics = useMemo(() => getProjectMetrics(filteredProjects), [filteredProjects, getProjectMetrics])

  return {
    projects: filteredProjects,
    groupedProjects,
    metrics,
    loading,
    error,
    view,
    setView,
    filters,
    updateFilters,
    clearFilters,
    selectedFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
    refresh,
    getProjectDeadline,
    filterProjects,
    groupProjects,
    groupProjectsByService: (projects: ProjectWithRelations[]) => groupProjects(projects, 'service'),
    groupProjectsByStatus: (projects: ProjectWithRelations[]) => groupProjects(projects, 'status'),
    groupProjectsByDeadline: (projects: ProjectWithRelations[]) => groupProjects(projects, 'deadline'),
    groupProjectsByClient: (projects: ProjectWithRelations[]) => groupProjects(projects, 'client'),
    getNextEstimatedTaxDeadline
  }
}
