export type TimeEntry = {
  id?: string;
  project_id?: string;
  task_id?: string;
  user_id?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  description?: string;
  billable?: boolean;
  hourly_rate?: number;
  tags?: string[];
};
