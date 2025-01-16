export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  status?: "pending" | "confirmed" | "cancelled";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEventCreate {
  title: string;
  description: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
}

export interface CalendarEventUpdate extends Partial<CalendarEventCreate> {
  id: string;
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  byDay?: string[];
  byMonthDay?: number[];
  endDate?: Date;
  occurrences?: number;
  exceptionDates?: Date[];
}

export interface CalendarReminder {
  minutesBefore: number;
  method: "email" | "push" | "both";
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
}

export interface RecurringCalendarEvent extends CalendarEvent {
  recurrence: RecurrencePattern;
  reminders?: CalendarReminder[];
  originalEventId?: string;
}

export interface CalendarEventFilter {
  startDate?: Date;
  endDate?: Date;
  status?: CalendarEvent["status"];
  createdBy?: string;
  search?: string;
}

export interface CalendarEventSort {
  field: "start" | "end" | "createdAt" | "title";
  direction: "asc" | "desc";
}

export interface PaginatedCalendarEvents {
  events: CalendarEvent[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface CalendarEventNotification {
  event: CalendarEvent;
  type: "created" | "updated" | "deleted";
  timestamp: Date;
}
