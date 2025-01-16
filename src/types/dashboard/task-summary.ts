export interface TaskSummary {
  overdue: TaskSummaryItem[];
  dueToday: TaskSummaryItem[];
  upcoming: TaskSummaryItem[];
  total: number;
}

export interface TaskSummaryItem {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "not_started" | "in_progress" | "completed" | "overdue";
  assignedTo?: string;
  projectId?: string;
  clientId?: string;
}

export interface TaskSummaryFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: TaskSummaryItem["priority"][];
  status?: TaskSummaryItem["status"][];
  assignedTo?: string[];
  projectId?: string[];
  clientId?: string[];
}

export interface TaskSummaryResponse {
  data: TaskSummary;
  filters: TaskSummaryFilters;
  lastUpdated: Date;
}
