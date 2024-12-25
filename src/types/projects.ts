import { Database } from "./database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type NewProject = Database["public"]["Tables"]["projects"]["Insert"];

export type ProjectWithRelations = Project & {
  client: {
    id: string;
    full_name: string;
    company_name: string | null;
    contact_info: {
      email?: string;
      phone?: string;
      address?: string;
    };
  } | null;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    due_date: string | null;
    assignee_id: string | null;
  }>;
};

export interface ProjectFormValues {
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  client_id: string | null;
  template_id: string | null;
  due_date: string | null;
  start_date: string | null;
  stage: string | null;
}