import { ProjectFormValues, ProjectWithRelations } from '@/types/projects';

export function getProjectFormDefaults(project?: ProjectWithRelations): Partial<ProjectFormValues> {
  if (!project) return {};
  
  return {
    creation_type: project.template_id ? 'template' : 'custom',
    template_id: project.template_id,
    name: project.name,
    description: project.description,
    client_id: project.client_id || '',
    status: project.status,
    priority: project.priority,
    service_type: project.service_type || 'tax_return',
    due_date: project.due_date,
    tax_info: project.tax_info,
    accounting_info: project.accounting_info,
    payroll_info: project.payroll_info,
    tasks: project.tasks || [],
    team_members: project.team_members?.map(member => member.user_id) || [],
    tax_return_id: project.tax_return_id,
    tax_return_status: null,
    accounting_period: null,
    start_date: project.start_date,
    end_date: project.end_date,
    parent_project_id: project.parent_project_id,
    primary_manager: project.primary_manager,
    completed_tasks: project.completed_tasks || 0,
    completion_percentage: project.completion_percentage || 0,
    task_count: project.task_count || 0,
    stage: project.stage,
    service_info: project.service_info,
    project_defaults: null
  };
} 