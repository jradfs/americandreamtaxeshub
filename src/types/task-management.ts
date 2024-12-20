export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in_progress' | 'done';
export type Section = 'strategy' | 'design' | 'implementation';
export type ViewType = 'list' | 'kanban' | 'calendar';
export type GroupingType = 'Stage' | 'Status' | 'Task' | 'Priority';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  assigned_user_id?: string;
  due_date?: string;
  client?: string;
  progress?: number;
  time_estimate?: number;
  time_spent?: number;
  [key: string]: any;
}

export interface TaskSection {
  todo: Task[];
  in_progress: Task[];
  done: Task[];
  metadata: {
    totalDuration: number;
    completionRate: number;
    assignees: string[];
  };
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
  tasks: Task[];
  client_id?: string;
  settings: {
    default_view: ViewType;
    default_grouping: GroupingType;
  };
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: string[]; // Task IDs
  status: Status;
  priority: Priority;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface UnifiedViewConfig {
  grouping: {
    type: GroupingType;
    sections: {
      strategy: TaskSection;
      design: TaskSection;
      implementation: TaskSection;
    };
    filters: {
      showScheduledOnly: boolean;
      showCompleted: boolean;
      priority: Priority[];
      assignees: string[];
    };
  };
  workspaces: Workspace[];
}
