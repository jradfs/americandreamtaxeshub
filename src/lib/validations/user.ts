import { z } from "zod";
import type { Database } from "@/types/database.types";

type DbEnums = Database["public"]["Enums"];

// Helper schemas
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
  .nullable();

const emailSchema = z.string().email("Invalid email address").nullable();

const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
  .nullable();

// Define JSON field schemas
const profileSchema = z
  .object({
    bio: z.string().nullable(),
    avatar_url: z.string().url("Invalid avatar URL").nullable(),
    timezone: z.string().nullable(),
    language: z.string().nullable(),
    theme: z.enum(["light", "dark", "system"]).nullable(),
    notification_preferences: z
      .object({
        email: z.boolean().nullable(),
        push: z.boolean().nullable(),
        sms: z.boolean().nullable(),
      })
      .nullable(),
    social_links: z
      .object({
        linkedin: z.string().url("Invalid LinkedIn URL").nullable(),
        twitter: z.string().url("Invalid Twitter URL").nullable(),
        github: z.string().url("Invalid GitHub URL").nullable(),
      })
      .nullable(),
  })
  .nullable();

const settingsSchema = z
  .object({
    email_notifications: z.boolean().nullable(),
    push_notifications: z.boolean().nullable(),
    sms_notifications: z.boolean().nullable(),
    two_factor_enabled: z.boolean().nullable(),
    default_view: z.enum(["list", "board", "calendar", "timeline"]).nullable(),
    default_project_view: z
      .enum(["list", "board", "calendar", "timeline"])
      .nullable(),
    default_task_view: z
      .enum(["list", "board", "calendar", "timeline"])
      .nullable(),
    default_client_view: z
      .enum(["list", "board", "calendar", "timeline"])
      .nullable(),
    theme: z.enum(["light", "dark", "system"]).nullable(),
    timezone: z.string().nullable(),
    language: z.string().nullable(),
    date_format: z.string().nullable(),
    time_format: z.string().nullable(),
    currency: z
      .string()
      .length(3, "Currency code must be 3 letters")
      .nullable(),
  })
  .nullable();

const customFieldsSchema = z.record(z.string(), z.unknown()).nullable();

// Main user form schema
export const userFormSchema = z.object({
  // Required fields
  email: z.string().email("Invalid email address"),
  role: z.enum([
    "admin",
    "manager",
    "preparer",
    "reviewer",
    "client",
  ] as const satisfies readonly DbEnums["user_role"]),
  status: z.enum([
    "active",
    "inactive",
    "pending",
    "archived",
  ] as const satisfies readonly DbEnums["user_status"]),

  // Optional fields with validation
  id: z.string().uuid("Invalid UUID format").optional(),
  full_name: z.string().min(1, "Full name is required").nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  phone: phoneSchema,
  alternate_email: emailSchema,
  alternate_phone: phoneSchema,
  title: z.string().nullable(),
  department: z.string().nullable(),
  manager_id: z.string().uuid("Invalid manager ID").nullable(),
  team_id: z.string().uuid("Invalid team ID").nullable(),
  permissions: z.array(z.string()).nullable(),
  last_login: dateSchema,
  last_active: dateSchema,
  created_at: dateSchema,
  updated_at: dateSchema,

  // JSON fields
  profile: profileSchema,
  settings: settingsSchema,
  custom_fields: customFieldsSchema,
});

// Export types
export type UserFormSchema = z.infer<typeof userFormSchema>;

// Validation helpers
export function validateUserForm(
  data: unknown,
):
  | { success: true; data: UserFormSchema }
  | { success: false; error: z.ZodError } {
  const result = userFormSchema.safeParse(data);
  return result;
}

export function validateProfile(data: unknown) {
  return profileSchema.safeParse(data);
}

export function validateSettings(data: unknown) {
  return settingsSchema.safeParse(data);
}

export function validateCustomFields(data: unknown) {
  return customFieldsSchema.safeParse(data);
}

// Helper function to ensure all required fields are present
export function ensureRequiredFields(
  data: Partial<UserFormSchema>,
):
  | { success: true; data: UserFormSchema }
  | { success: false; error: string[] } {
  const requiredFields = ["email", "role", "status"] as const;
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return {
      success: false,
      error: missingFields.map((field) => `Missing required field: ${field}`),
    };
  }

  return {
    success: true,
    data: data as UserFormSchema,
  };
}
