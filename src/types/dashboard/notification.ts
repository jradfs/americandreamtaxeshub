export interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  relatedEntity?: {
    type: "task" | "client" | "project" | "document";
    id: string;
  };
}

export interface NotificationFilters {
  types?: Notification["type"][];
  readStatus?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  relatedEntityType?: Notification["relatedEntity"]["type"];
}

export interface NotificationSummary {
  unreadCount: number;
  recent: Notification[];
  important: Notification[];
}

export interface NotificationResponse {
  data: Notification[];
  summary: NotificationSummary;
  filters: NotificationFilters;
  lastUpdated: Date;
}
