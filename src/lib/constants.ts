import { TaskStatus, TaskPriority } from "@/types/tasks";
import { type UserRole } from "@/types/auth";

interface TaskOption {
  value: string;
  label: string;
}

export const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

export const taskPriorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const TASKS_PER_PAGE = 10;

// Authentication constants
export const AUTH_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
} as const;

// Rate limiting constants
export const RATE_LIMITS = {
  AUTH: {
    LOGIN: { limit: 5, interval: 60 * 1000 }, // 5 attempts per minute
    SIGNUP: { limit: 3, interval: 60 * 1000 }, // 3 attempts per minute
    PASSWORD_RESET: { limit: 3, interval: 60 * 1000 }, // 3 attempts per minute
  },
  API: {
    DEFAULT: { limit: 100, interval: 60 * 1000 }, // 100 requests per minute
    PUBLIC: { limit: 20, interval: 60 * 1000 }, // 20 requests per minute
  },
} as const;

// Role-based access constants
export const ROLES: Record<string, UserRole> = {
  ADMIN: "admin",
  TEAM_MEMBER: "team_member",
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ["read", "write", "delete", "manage_users"],
  [ROLES.TEAM_MEMBER]: ["read", "write"],
} as const;

// Session constants
export const SESSION_CONFIG = {
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  REMEMBER_ME_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

// Error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  UNAUTHORIZED: "You are not authorized to access this resource",
  FORBIDDEN: "You do not have permission to perform this action",
  RATE_LIMITED: "Too many attempts. Please try again later.",
  INVALID_TOKEN: "Invalid or expired token",
  WEAK_PASSWORD: "Password does not meet security requirements",
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z\s'-]+$/,
  },
} as const;
