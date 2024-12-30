import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Project, ProjectWithRelations, ProjectInsert } from '@/types/projects';

export function useProjects(clientId?: string): {
  projects: ProjectWithRelations[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: ProjectInsert) => Promise<ProjectWithRelations>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<ProjectWithRelations>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
} {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // First fetch projects with client info
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            full_name,
            company_name,
            contact_info
          )
        `)
        .order('due_date', { ascending: true })
        .neq('status', 'archived');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) throw projectsError;

      // Then fetch tasks for each project
      const projectIds = projectsData?.map(p => p.id) || [];
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectIds);

      if (tasksError) throw tasksError;

      // Combine the data
      const projectsWithRelations = projectsData?.map(project => ({
        ...project,
        tasks: tasksData?.filter(task => task.project_id === project.id) || [],
        category: project.category || { service: 'uncategorized' },
        tax_info: project.tax_info || null,
        accounting_info: project.accounting_info || null,
        payroll_info: project.payroll_info || null,
        business_services_info: project.business_services_info || null,
        irs_notice_info: project.irs_notice_info || null,
      })) || [];

      setProjects(projectsWithRelations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (project: ProjectInsert): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    const newProject: ProjectWithRelations = {
      ...data,
      client: null,
      tasks: [],
      category: data.category || { service: 'uncategorized' },
      tax_info: null,
      accounting_info: null,
      payroll_info: null,
      business_services_info: null,
      irs_notice_info: null,
    };

    setProjects(current => [...current, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');

    const updatedProject = {
      ...data,
      client: projects.find(p => p.id === id)?.client || null,
      tasks: projects.find(p => p.id === id)?.tasks || [],
      category: data.category || { service: 'uncategorized' },
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      business_services_info: data.business_services_info || null,
      irs_notice_info: data.irs_notice_info || null,
    };

    setProjects(current =>
      current.map(p => (p.id === id ? updatedProject : p))
    );

    return updatedProject;
  };

  const deleteProject = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setProjects(current => current.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, [clientId]);

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}