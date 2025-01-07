import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import type { ProjectWithRelations } from '@/types/projects';
import type { ProjectStatus, Priority, ServiceCategory } from '@/types/hooks';
import { startOfDay, endOfDay } from 'date-fns';

export interface ProjectFilters {
  search: string;
  status: ProjectStatus[];
  priority: Priority[];
  service_category: ServiceCategory[];
  clientId: string;
  dateRange?: DateRange;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  groupBy: string;
}

export const defaultFilters: ProjectFilters = {
  search: '',
  status: [],
  priority: [],
  service_category: [],
  clientId: 'all',
  dateRange: undefined,
  sortBy: 'due_date',
  sortOrder: 'asc',
  groupBy: 'status'
};

export function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [error, setError] = useState<Error | null>(null);

  const updateFilters = (updates: Partial<ProjectFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const filterProjects = (projects: ProjectWithRelations[]): ProjectWithRelations[] => {
    try {
      return projects.filter(project => {
        // Search filter
        if (filters.search && !matchesSearch(project, filters.search)) {
          return false;
        }

        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(project.status)) {
          return false;
        }

        // Priority filter
        if (filters.priority.length > 0 && project.priority && !filters.priority.includes(project.priority as Priority)) {
          return false;
        }

        // Service category filter
        if (filters.service_category.length > 0 && project.service_type && !filters.service_category.includes(project.service_type as ServiceCategory)) {
          return false;
        }

        // Client filter
        if (filters.clientId !== 'all' && project.client_id !== filters.clientId) {
          return false;
        }

        // Date range filter
        if (filters.dateRange?.from) {
          const startDate = startOfDay(filters.dateRange.from);
          const endDate = filters.dateRange.to ? endOfDay(filters.dateRange.to) : endOfDay(filters.dateRange.from);
          const projectDate = project.due_date ? new Date(project.due_date) : null;

          if (!projectDate || projectDate < startDate || projectDate > endDate) {
            return false;
          }
        }

        return true;
      });
    } catch (err) {
      console.error('Error filtering projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to filter projects'));
      return projects;
    }
  };

  const matchesSearch = (project: ProjectWithRelations, search: string): boolean => {
    const searchLower = search.toLowerCase();
    return (
      (project.name?.toLowerCase().includes(searchLower) || false) ||
      (project.description?.toLowerCase().includes(searchLower) || false) ||
      (project.client?.full_name?.toLowerCase().includes(searchLower) || false) ||
      (project.client?.company_name?.toLowerCase().includes(searchLower) || false)
    );
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    filterProjects,
    error
  };
}
