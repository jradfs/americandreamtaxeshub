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

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface TaskTimeLog {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export interface TaskFilter {
  status?: ('todo' | 'in_progress' | 'completed' | 'blocked')[];
  priority?: ('low' | 'medium' | 'high')[];
  assignee?: string[];
  project?: string[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TaskView {
  id: string;
  name: string;
  type: 'list' | 'board' | 'calendar';
  filters: TaskFilter;
  sortBy?: {
    field: keyof Task;
    direction: 'asc' | 'desc';
  };
}
