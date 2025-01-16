import { z } from "zod";

// Tax return types
export const taxReturnTypes = [
  "individual",
  "corporate",
  "partnership",
  "non-profit",
] as const;

// Tax return statuses
export const taxReturnStatuses = [
  "pending",
  "in_progress",
  "under_review",
  "approved",
  "filed",
  "completed",
  "rejected",
  "on_hold",
] as const;

// Filing methods
export const filingMethods = ["electronic", "paper"] as const;

// Review statuses
export const reviewStatuses = [
  "pending",
  "in_review",
  "approved",
  "rejected",
] as const;

// Payment statuses
export const paymentStatuses = [
  "pending",
  "partial",
  "paid",
  "overdue",
] as const;

// Complexity levels
export const complexityLevels = ["low", "medium", "high"] as const;

// Priority levels
export const priorityLevels = ["low", "normal", "high", "urgent"] as const;

export const taxReturnSchema = z.object({
  client_id: z.string().uuid(),
  client_name: z.string().min(1),
  type: z.enum(taxReturnTypes),
  tax_year: z
    .number()
    .int()
    .min(new Date().getFullYear() - 7)
    .max(new Date().getFullYear()),
  status: z.enum(taxReturnStatuses),
  due_date: z.string().datetime(),
  project_id: z.string().uuid().nullable(),
  filing_status: z.string(),
  last_updated: z.string().datetime(),
  notes: z.string().optional(),
  documents: z.array(z.string()).default([]),
  assigned_preparer: z.string().uuid().nullable(),
  assigned_reviewer: z.string().uuid().nullable(),
  review_status: z.enum(reviewStatuses),
  filing_method: z.enum(filingMethods),
  payment_status: z.enum(paymentStatuses),
  estimated_completion_date: z.string().datetime().nullable(),
  extension_filed: z.boolean(),
  extension_date: z.string().datetime().nullable(),
  complexity_level: z.enum(complexityLevels),
  priority_level: z.enum(priorityLevels),
  related_returns: z.array(z.string()).default([]),
  audit_trail: z
    .array(
      z.object({
        action: z.string(),
        timestamp: z.string().datetime(),
        user_id: z.string().uuid(),
        details: z.string(),
      }),
    )
    .default([]),
});

export type TaxReturn = z.infer<typeof taxReturnSchema>;

export const createTaxReturnSchema = taxReturnSchema
  .omit({
    last_updated: true,
    audit_trail: true,
  })
  .partial({
    notes: true,
    documents: true,
    assigned_preparer: true,
    assigned_reviewer: true,
    estimated_completion_date: true,
    extension_date: true,
    related_returns: true,
  });

export const updateTaxReturnSchema = taxReturnSchema.partial();

export const validateTaxYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= currentYear - 7 && year <= currentYear;
};

export const validateDueDate = (date: string): boolean => {
  const dueDate = new Date(date);
  const currentDate = new Date();
  return dueDate >= currentDate;
};
