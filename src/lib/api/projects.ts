import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';
import { ProjectFormValues } from '@/types/projects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function createProject(
  projectData: ProjectFormValues
): Promise<Tables<'projects'> | null> {
  const supabase = createClient();
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      status: projectData.status || 'not_started',
      priority: projectData.priority || 'medium'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return project;
}

export async function createProjectFromTemplate(
  projectData: ProjectFormValues,
  templateId: string
): Promise<Tables<'projects'> | null> {
  const supabase = createClientComponentClient();
  
  const { data: project, error } = await supabase
    .rpc('create_project_from_template', {
      project_data: projectData,
      template_id: templateId
    });

  if (error) {
    console.error('Error creating project from template:', error);
    return null;
  }

  // Validate returned project has required fields
  if (!project || typeof project !== 'object' || !('id' in project)) {
    console.error('Invalid project data returned from RPC create_project_from_template');
    return null;
  }

  // Type assertion after validation
  return project as Tables<'projects'>;
}
