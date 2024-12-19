export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  client_id?: string;
  assignee_id?: string;
  due_date?: string; // ISO date string
  progress: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_recurring: boolean;
  project_id?: string;
  tax_return_id?: string;
  tax_form_type?: string;
}

export type TaskUpdate = Partial<Task>;

export interface TaskFormData extends Omit<Task, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  tax_return_id?: string;
  tax_form_type?: string;
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
  tasks: Task[];
  settings: WorkspaceSettings;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface WorkspaceSettings {
  default_view: 'list' | 'kanban' | 'calendar';
  task_grouping: 'status' | 'project' | 'assignee';
  show_completed: boolean;
}

export interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onCreateTask: (taskData: Task) => Promise<void>;
  onUpdateTask: (taskId: string, updates: TaskUpdate) => Promise<void>;
}

export interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: TaskUpdate) => Promise<void>;
  onEditTask: (task: Task) => void;
}
