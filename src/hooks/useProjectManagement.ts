import { useState, useCallback, useMemo } from 'react';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ProjectWithRelations, ServiceCategory, TaxReturnType } from '@/types/projects';
import { useProjects } from './useProjects';

export type ProjectView = 'service' | 'deadline' | 'status' | 'client' | 'return_type' | 'review_status';

interface ProjectFilters {
  search: string;
  service?: ServiceCategory;
  status?: string;
  priority?: string;
  dueThisWeek?: boolean;
  dueThisMonth?: boolean;
  missingInfo?: boolean;
  needsReview?: boolean;
  readyToFile?: boolean;
  returnType?: TaxReturnType;
  reviewStatus?: string;
}

const defaultFilters: ProjectFilters = {
  search: '',
};

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
};

const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

export function useProjectManagement() {
  const { projects, isLoading: loading, error, refreshProjects: refresh } = useProjects();
  const [view, setView] = useState<ProjectView>('service');
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>, filterKey: string) => {
    setFilters(current => {
      const updatedFilters = { ...current };
      
      // Toggle the filter if it's already active
      if (selectedFilters.includes(filterKey)) {
        Object.keys(newFilters).forEach(key => {
          delete updatedFilters[key as keyof ProjectFilters];
        });
        setSelectedFilters(prev => prev.filter(f => f !== filterKey));
      } else {
        // Add the new filter
        Object.entries(newFilters).forEach(([key, value]) => {
          updatedFilters[key as keyof ProjectFilters] = value;
        });
        setSelectedFilters(prev => [...prev, filterKey]);
      }
      
      return updatedFilters;
    });
  }, [selectedFilters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedFilters([]);
  }, []);

  // Tax-specific deadline calculations
  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = startOfDay(new Date());
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (isAfter(deadlineDate, today)) {
        return deadlineDate;
      }
    }
    
    // If all deadlines have passed, return first deadline of next year
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const filterProjects = useCallback((projects: ProjectWithRelations[]) => {
    return projects.filter(project => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        project.name.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.client?.company_name?.toLowerCase().includes(searchLower) ||
        project.client?.full_name?.toLowerCase().includes(searchLower) ||
        project.tax_info?.return_type?.toLowerCase().includes(searchLower);

      const matchesService = !filters.service || project.category?.service === filters.service;
      const matchesStatus = !filters.status || project.status === filters.status;
      const matchesPriority = !filters.priority || project.priority === filters.priority;
      const matchesReturnType = !filters.returnType || project.tax_info?.return_type === filters.returnType;
      const matchesReviewStatus = !filters.reviewStatus || project.tax_info?.review_status === filters.reviewStatus;

      // Special filters
      const matchesDueThisWeek = !filters.dueThisWeek || (
        project.due_date && 
        isAfter(new Date(project.due_date), startOfDay(new Date())) &&
        isBefore(new Date(project.due_date), addDays(startOfDay(new Date()), 7))
      );

      const matchesDueThisMonth = !filters.dueThisMonth || (
        project.due_date && 
        isAfter(new Date(project.due_date), startOfDay(new Date())) &&
        isBefore(new Date(project.due_date), addDays(startOfDay(new Date()), 30))
      );

      const matchesMissingInfo = !filters.missingInfo || (
        project.tax_info?.missing_documents && 
        project.tax_info.missing_documents.length > 0
      );

      const matchesNeedsReview = !filters.needsReview || (
        project.tax_info?.review_status === 'needs_review'
      );

      const matchesReadyToFile = !filters.readyToFile || (
        project.tax_info?.review_status === 'approved' &&
        (!project.tax_info.missing_documents || project.tax_info.missing_documents.length === 0)
      );

      return (
        matchesSearch &&
        matchesService &&
        matchesStatus &&
        matchesPriority &&
        matchesReturnType &&
        matchesReviewStatus &&
        matchesDueThisWeek &&
        matchesDueThisMonth &&
        matchesMissingInfo &&
        matchesNeedsReview &&
        matchesReadyToFile
      );
    });
  }, [filters]);

  const groupProjectsByService = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const service = project.category?.service || 'uncategorized';
      const serviceFormatted = service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (!groups[serviceFormatted]) {
        groups[serviceFormatted] = [];
      }
      groups[serviceFormatted].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByDeadline = useCallback((projects: ProjectWithRelations[]) => {
    const today = startOfDay(new Date());
    const thisWeek = addDays(today, 7);
    const thisMonth = addDays(today, 30);

    return projects.reduce((groups, project) => {
      if (!project.due_date) {
        if (!groups['No Due Date']) groups['No Due Date'] = [];
        groups['No Due Date'].push(project);
      } else {
        const dueDate = new Date(project.due_date);
        if (isBefore(dueDate, today)) {
          if (!groups['Overdue']) groups['Overdue'] = [];
          groups['Overdue'].push(project);
        } else if (isBefore(dueDate, thisWeek)) {
          if (!groups['Due This Week']) groups['Due This Week'] = [];
          groups['Due This Week'].push(project);
        } else if (isBefore(dueDate, thisMonth)) {
          if (!groups['Due This Month']) groups['Due This Month'] = [];
          groups['Due This Month'].push(project);
        } else {
          if (!groups['Future']) groups['Future'] = [];
          groups['Future'].push(project);
        }
      }
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByStatus = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const status = project.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByClient = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const clientName = project.client?.company_name || project.client?.full_name || 'No Client';
      if (!groups[clientName]) {
        groups[clientName] = [];
      }
      groups[clientName].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByReturnType = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const returnType = project.tax_info?.return_type || 'Not Tax Return';
      if (!groups[returnType]) {
        groups[returnType] = [];
      }
      groups[returnType].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByReviewStatus = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const reviewStatus = project.tax_info?.review_status || 'Not In Review';
      if (!groups[reviewStatus]) {
        groups[reviewStatus] = [];
      }
      groups[reviewStatus].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  // Helper function to get project deadline
  const getProjectDeadline = (project: ProjectWithRelations): Date | null => {
    if (project.due_date) {
      return new Date(project.due_date);
    }
    if (project.tax_info?.filing_deadline) {
      return new Date(project.tax_info.filing_deadline);
    }
    if (project.payroll_info?.next_payroll_date) {
      return new Date(project.payroll_info.next_payroll_date);
    }
    if (project.business_services_info?.due_date) {
      return new Date(project.business_services_info.due_date);
    }
    if (project.irs_notice_info?.response_deadline) {
      return new Date(project.irs_notice_info.response_deadline);
    }
    return null;
  };

  // Helper function to check if date is within next N days
  const isWithinNextDays = (date: Date, days: number): boolean => {
    const today = startOfDay(new Date());
    const futureDate = addDays(today, days);
    return isAfter(date, today) && isBefore(date, futureDate);
  };

  return {
    view,
    setView,
    filters,
    updateFilters,
    clearFilters,
    selectedFilters,
    groupProjectsByService,
    groupProjectsByDeadline,
    groupProjectsByStatus,
    groupProjectsByClient,
    groupProjectsByReturnType,
    groupProjectsByReviewStatus,
    filterProjects,
    getDeadline,
    getNextEstimatedTaxDeadline,
    projects,
    loading,
    error,
    refresh
  };
}
