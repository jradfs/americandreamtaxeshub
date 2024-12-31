import { useState, useCallback } from 'react';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ProjectWithRelations, TaxReturnType } from '@/types/projects';

// Constants for tax deadlines
const TAX_DEADLINES = {
  '1040': {
    normal: '04-15',
    extended: '10-15'
  },
  '1120': {
    normal: '03-15',
    extended: '09-15'
  },
  '1065': {
    normal: '03-15',
    extended: '09-15'
  },
  '1120S': {
    normal: '03-15',
    extended: '09-15'
  }
};

const ESTIMATED_TAX_DEADLINES = ['04-15', '06-15', '09-15', '01-15'];

export function useTaxProjectManagement() {
  const [view, setView] = useState<'deadline' | 'return_type' | 'review_status'>('deadline');

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

  const groupProjectsByDeadline = useCallback((projects: ProjectWithRelations[]) => {
    const groups: Record<string, ProjectWithRelations[]> = {
      'Due This Week': [],
      'Due This Month': [],
      'Due Later': [],
      'Past Due': [],
    };

    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    const nextMonth = addDays(today, 30);

    projects.forEach(project => {
      if (!project.tax_info?.filing_deadline) return;

      const deadline = new Date(project.tax_info.filing_deadline);
      
      if (isBefore(deadline, today)) {
        groups['Past Due'].push(project);
      } else if (isBefore(deadline, nextWeek)) {
        groups['Due This Week'].push(project);
      } else if (isBefore(deadline, nextMonth)) {
        groups['Due This Month'].push(project);
      } else {
        groups['Due Later'].push(project);
      }
    });

    return groups;
  }, []);

  const groupProjectsByReturnType = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const returnType = project.tax_info?.return_type || 'Other';
      if (!groups[returnType]) {
        groups[returnType] = [];
      }
      groups[returnType].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  const groupProjectsByReviewStatus = useCallback((projects: ProjectWithRelations[]) => {
    return projects.reduce((groups, project) => {
      const status = project.tax_info?.review_status || 'Not Started';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(project);
      return groups;
    }, {} as Record<string, ProjectWithRelations[]>);
  }, []);

  return {
    view,
    setView,
    getDeadline,
    getNextEstimatedTaxDeadline,
    groupProjectsByDeadline,
    groupProjectsByReturnType,
    groupProjectsByReviewStatus,
  };
}
