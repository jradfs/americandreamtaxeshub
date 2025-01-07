import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { DbProject, ProjectWithRelations, ProjectInsert, ProjectResponse } from '@/types/projects';

export function useProjects(clientId?: string): {
  projects: ProjectWithRelations[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: ProjectInsert) => Promise<ProjectWithRelations>;
  updateProject: (id: string, updates: Partial<DbProject>) => Promise<ProjectWithRelations>;
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
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            full_name,
            company_name,
            contact_info,
            contact_email,
            type,
            status
          ),
          tasks:tasks!tasks_project_id_fkey (
            id,
            title,
            description,
            status,
            priority,
            due_date,
            assignee_id,
            progress,
            category
          ),
          team_members:project_team_members!project_team_members_project_id_fkey (
            user:users (
              id,
              full_name,
              email,
              role
            )
          )
        `)
        .order('due_date', { ascending: true })
        .neq('status', 'archived');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw new Error('Failed to fetch projects');
      }

      const projectsWithRelations = (projectsData as unknown as ProjectResponse[] | null)?.map(project => ({
        ...project,
        client: project.client || null,
        tasks: project.tasks || [],
        team_members: project.team_members?.map(tm => tm.user) || [],
        tax_info: project.tax_info || null,
        accounting_info: project.accounting_info || null,
        payroll_info: project.payroll_info || null,
        service_info: project.service_info || null
      })) || [];

      setProjects(projectsWithRelations);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching projects';
      console.error('Error in fetchProjects:', err);
      setError(errorMessage);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (project: ProjectInsert): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info,
          contact_email,
          type,
          status
        ),
        tasks:tasks!tasks_project_id_fkey (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          progress,
          category
        ),
        team_members:project_team_members!project_team_members_project_id_fkey (
          user:users (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    const newProject = {
      ...data,
      client: (data as unknown as ProjectResponse).client || null,
      tasks: (data as unknown as ProjectResponse).tasks || [],
      team_members: (data as unknown as ProjectResponse).team_members?.map(tm => tm.user) || [],
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      service_info: data.service_info || null
    } as ProjectWithRelations;

    setProjects(current => [...current, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<DbProject>): Promise<ProjectWithRelations> => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients (
          id,
          full_name,
          company_name,
          contact_info,
          contact_email,
          type,
          status
        ),
        tasks:tasks!tasks_project_id_fkey (
          id,
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          progress,
          category
        ),
        team_members:project_team_members!project_team_members_project_id_fkey (
          user:users (
            id,
            full_name,
            email,
            role
          )
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');

    const updatedProject = {
      ...data,
      client: (data as unknown as ProjectResponse).client || null,
      tasks: (data as unknown as ProjectResponse).tasks || [],
      team_members: (data as unknown as ProjectResponse).team_members?.map(tm => tm.user) || [],
      tax_info: data.tax_info || null,
      accounting_info: data.accounting_info || null,
      payroll_info: data.payroll_info || null,
      service_info: data.service_info || null
    } as ProjectWithRelations;

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