import { useState, useCallback, useMemo, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format, startOfWeek, endOfWeek, addMonths } from 'date-fns';
import type { 
  ProjectWithRelations, 
  ServiceCategory, 
  TaxReturnType, 
  ProjectStatus, 
  Priority 
} from '@/types/projects';
import type { ReviewStatus } from '@/types/tasks';
import { useToast } from '@/components/ui/use-toast';
import { useProjectFilters } from './useProjectFilters';
import type { ProjectFilters } from './useProjectFilters';

export function useProjectManagement(): {
  projects: ProjectWithRelations[];
  loading: boolean;
  error: Error | null;
  filters: ProjectFilters;
  updateFilters: (updates: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
  filterProjects: (projects: ProjectWithRelations[]) => ProjectWithRelations[];
  groupProjects: (projects: ProjectWithRelations[], groupBy: string) => { [key: string]: ProjectWithRelations[] };
  refresh: () => Promise<void>;
  bulkUpdateProjects: (projectIds: string[], updates: Partial<ProjectWithRelations>) => Promise<boolean>;
  archiveProjects: (projectIds: string[]) => Promise<boolean>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { filters, updateFilters, resetFilters, filterProjects: applyFilters } = useProjectFilters();

  const groupKeyMap = {
    status: (project: ProjectWithRelations) => project.status || 'No Status',
    service: (project: ProjectWithRelations) => project.service_category || 'Uncategorized',
    deadline: (project: ProjectWithRelations) => {
      if (!project.due_date) return 'No Due Date';
      const dueDate = new Date(project.due_date);
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);

      if (dueDate < today) return 'Overdue';
      if (dueDate <= weekEnd) return 'This Week';
      if (dueDate <= addMonths(today, 1)) return 'Next Month';
      return 'Later';
    },
    client: (project: ProjectWithRelations) => project.client?.name || 'No Client'
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*),
          tasks:project_tasks(
            *,
            checklist_items(*),
            activity_log_entries(*)
          ),
          tax_return:tax_returns(*)
        `);

      if (fetchError) throw fetchError;

      const processedProjects = data.map(project => ({
        ...project,
        completion_percentage: calculateCompletionPercentage(project)
      }));

      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    fetchProjects();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        fetchProjects
      )
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
    };
  }, [fetchProjects, supabase]);

  const calculateCompletionPercentage = (project: ProjectWithRelations): number => {
    if (!project.tasks?.length) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const groupProjects = useCallback((projects: ProjectWithRelations[], groupBy: string) => {
    const groupedProjects: { [key: string]: ProjectWithRelations[] } = {};
    const getGroupKey = groupKeyMap[groupBy as keyof typeof groupKeyMap] || groupKeyMap.status;

    projects.forEach(project => {
      const key = getGroupKey(project);
      if (!groupedProjects[key]) {
        groupedProjects[key] = [];
      }
      groupedProjects[key].push(project);
    });

    return groupedProjects;
  }, []);

  const bulkUpdateProjects = async (projectIds: string[], updates: Partial<ProjectWithRelations>) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .in('id', projectIds);

      if (updateError) throw updateError;

      await fetchProjects();
      return true;
    } catch (err) {
      console.error('Error updating projects:', err);
      throw new Error('Failed to update projects');
    }
  };

  const archiveProjects = async (projectIds: string[]) => {
    return bulkUpdateProjects(projectIds, { 
      status: 'archived',
      updated_at: new Date().toISOString()
    });
  };

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

  const getDeadline = useCallback((returnType: TaxReturnType, isExtended: boolean = false): Date => {
    const currentYear = new Date().getFullYear();
    const deadlineType = isExtended ? 'extended' : 'normal';
    const monthDay = TAX_DEADLINES[returnType]?.[deadlineType] || '04-15';
    return new Date(`${currentYear}-${monthDay}`);
  }, []);

  const getNextEstimatedTaxDeadline = useCallback(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    for (const deadline of ESTIMATED_TAX_DEADLINES) {
      const deadlineDate = new Date(`${currentYear}-${deadline}`);
      if (new Date(deadlineDate) > today) {
        return deadlineDate;
      }
    }
    
    return new Date(`${currentYear + 1}-${ESTIMATED_TAX_DEADLINES[0]}`);
  }, []);

  const getProjectDeadline = useCallback((project: ProjectWithRelations): Date | null => {
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
    if (project.tax_info?.return_type) {
      const isExtended = project.tax_info.is_extended || false;
      return getDeadline(project.tax_info.return_type, isExtended);
    }
    return null;
  }, [getDeadline]);

  const filterProjects = useCallback((projects: ProjectWithRelations[]) => {
    if (!projects) return [];
    
    return projects.filter(project => {
      const searchLower = (filters.search || '').toLowerCase();
      
      // Safely access potentially undefined properties
      const projectTitle = project?.title || '';
      const projectDesc = project?.description || '';
      const clientCompany = project?.client?.company_name || '';
      const clientName = project?.client?.full_name || '';
      const returnType = project?.tax_info?.return_type || '';
      
      const matchesSearch = !searchLower || (
        projectTitle.toLowerCase().includes(searchLower) ||
        projectDesc.toLowerCase().includes(searchLower) ||
        clientCompany.toLowerCase().includes(searchLower) ||
        clientName.toLowerCase().includes(searchLower) ||
        returnType.toLowerCase().includes(searchLower)
      );

      const matchesService = !filters.service?.length || 
        (project?.service_category && filters.service.includes(project.service_category));
      
      const matchesStatus = !filters.status?.length || 
        (project?.status && filters.status.includes(project.status));
      
      const matchesPriority = !filters.priority?.length || 
        (project?.priority && filters.priority.includes(project.priority));
      
      const matchesReturnType = !filters.returnType?.length || 
        (project?.tax_info?.return_type && filters.returnType.includes(project.tax_info.return_type));
      
      const matchesReviewStatus = !filters.reviewStatus?.length || 
        (project?.tax_info?.review_status && filters.reviewStatus.includes(project.tax_info.review_status));

      const deadline = getProjectDeadline(project);
      const matchesDueThisWeek = !filters.dueThisWeek || 
        (deadline && new Date(deadline) <= new Date(endOfWeek(new Date())));

      const matchesDueThisMonth = !filters.dueThisMonth || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 1)));

      const matchesDueThisQuarter = !filters.dueThisQuarter || 
        (deadline && new Date(deadline) <= new Date(addMonths(new Date(), 3)));

      const matchesDateRange = !filters.dateRange || !deadline || 
        (deadline >= new Date(filters.dateRange.from) && deadline <= new Date(filters.dateRange.to));

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
        matchesDateRange
      );
    });
  }, [filters, getProjectDeadline]);

  return {
    projects,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    groupProjects,
    refresh: fetchProjects,
    bulkUpdateProjects,
    archiveProjects
  };
}
