import { TaskSummary, TaskSummaryFilters } from './task-summary';
import { NotificationSummary, NotificationFilters } from './notification';
import { CalendarEvent } from '../calendar/calendar-event';

export interface DashboardSummary {
  tasks: TaskSummary;
  notifications: NotificationSummary;
  upcomingEvents: CalendarEvent[];
  metrics: {
    activeProjects: number;
    overdueTasks: number;
    clientsWithUpcomingDeadlines: number;
    documentsAwaitingReview: number;
  };
  lastUpdated: Date;
}

export interface DashboardFilters {
  taskFilters?: TaskSummaryFilters;
  notificationFilters?: NotificationFilters;
  calendarFilters?: {
    dateRange?: {
      start: Date;
      end: Date;
    };
    eventTypes?: string[];
  };
}

export interface DashboardResponse {
  data: DashboardSummary;
  filters: DashboardFilters;
  lastUpdated: Date;
}
