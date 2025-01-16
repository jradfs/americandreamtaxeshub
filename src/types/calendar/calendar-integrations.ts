import { CalendarEvent, CalendarEventNotification } from "./calendar-event";

export interface CalendarWebhook {
  id: string;
  url: string;
  eventTypes: CalendarEventNotification["type"][];
  secret?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookPayload {
  event: CalendarEvent;
  type: CalendarEventNotification["type"];
  timestamp: Date;
  webhookId: string;
  signature?: string;
}

export interface CalendarSubscription {
  id: string;
  calendarId: string;
  externalCalendarId: string;
  service: "google" | "outlook" | "apple";
  syncDirection: "in" | "out" | "both";
  syncInterval: number;
  lastSyncAt?: Date;
  syncStatus: "pending" | "success" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarIntegration {
  id: string;
  userId: string;
  service: "google" | "outlook" | "apple";
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarSyncStatus {
  subscriptionId: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  syncedEvents: number;
  totalEvents: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}
