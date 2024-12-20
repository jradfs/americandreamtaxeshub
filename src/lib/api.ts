import { getSupabase } from 'src/lib/supabase/client.ts';

const supabase = getSupabase();

export async function fetchProjectsWithTasks() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, name, status, completed_tasks, tasks (id, title, status, progress)
    `);
  if (error) throw new Error(error.message);
  return data;
}

export async function createProject(projectData: any) {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchTasksByProject(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId);
  if (error) throw new Error(error.message);
  return data;
}

export async function createTasks(tasks: any[]) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(tasks)
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function applyTemplate(templateId: string, projectData: any) {
  const { data: templateTasks, error: templateError } = await supabase
    .from('template_tasks')
    .select('*')
    .eq('template_id', templateId);

  if (templateError) throw new Error(templateError.message);

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();

  if (projectError) throw new Error(projectError.message);

  const tasks = templateTasks.map((task: any) => ({
    ...task,
    project_id: project.id,
    template_id: null, // Remove template linkage
  }));

  return await createTasks(tasks);
}
