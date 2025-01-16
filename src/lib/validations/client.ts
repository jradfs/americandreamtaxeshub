import { z } from "zod";
import type { Database } from "@/types/database.types";

type DbEnums = Database["public"]["Enums"];
// Main client form schema
export const clientFormSchema = z.object({
  // Required fields
  full_name: z.string().min(1, "Full name is required"),
  contact_email: z.string().email("invalid email format"),

  // Optional fields
  company_name: z.string().optional(),
  onboarding_notes: z.string().optional(),

  // Default fields
  status: z
    .enum([
      "active",
      "inactive",
      "pending",
      "archived",
    ] as const satisfies readonly DbEnums["client_status"])
    .default("pending"),
  type: z
    .enum([
      "business",
      "individual",
    ] as const satisfies readonly DbEnums["client_type"])
    .default("individual"),

  // Optional JSON fields
  contact_details: z
    .object({
      phone: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),

  tax_info: z
    .object({
      filing_status: z.string().optional(),
      tax_id: z.string().optional(),
      tax_year: z.number().optional(),
      filing_type: z.string().optional(),
      tax_id_type: z.string().optional(),
      dependents: z.array(z.any()).optional(),
      previous_returns: z.array(z.any()).optional(),
    })
    .optional(),

  // Service configuration
  service_config: z
    .object({
      tax_preparation: z.any().nullable(),
      bookkeeping: z.any().nullable(),
      payroll: z.any().nullable(),
      advisory: z.any().nullable(),
    })
    .optional(),

  // Document requirements
  document_requirements: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        status: z.string().optional(),
        required: z.boolean().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),

  // Onboarding progress tracking
  onboarding_progress: z
    .object({
      status: z
        .enum(["pending", "in_progress", "completed", "blocked"])
        .default("pending"),
      completed_steps: z.array(z.string()).default([]),
      next_steps: z.array(z.string()).default([]),
      documents_received: z.array(z.string()).default([]),
    })
    .optional(),
});

// Export types
export type ClientFormSchema = z.infer<typeof clientFormSchema>;

// Validation helpers
export function validateClientForm(
  data: unknown,
):
  | { success: true; data: ClientFormSchema }
  | { success: false; error: z.ZodError } {
  const result = clientFormSchema.safeParse(data);
  return result;
}
