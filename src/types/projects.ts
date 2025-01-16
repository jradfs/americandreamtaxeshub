import { Database } from "./database.types";
import type { Json } from "./database.types";
import { z } from "zod";
import { projectSchema } from "@/lib/validations/project";
import { TaskWithRelations } from "./tasks";

// Database types with explicit nullability
export type DbProject = Database["public"]["Tables"]["projects"]["Row"];
export type DbProjectInsert =
  Database["public"]["Tables"]["projects"]["Insert"];
export type DbProjectUpdate =
  Database["public"]["Tables"]["projects"]["Update"];

// Enums from database with explicit values
export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type ServiceType = Database["public"]["Enums"]["service_type"];
export type TaskPriority = Database["public"]["Enums"]["task_priority"];

// Strongly typed JSON fields with explicit optional fields
export interface TaxInfo {
  return_type?: Database["public"]["Enums"]["filing_type"];
  filing_status?: string;
  tax_year?: number;
  due_date?: string;
  extension_date?: string;
  estimated_refund?: number;
  estimated_liability?: number;
  notes?: string;
}

export interface AccountingInfo {
  period_start?: string;
  period_end?: string;
  accounting_method?: "cash" | "accrual";
  fiscal_year_end?: string;
  last_reconciliation_date?: string;
  chart_of_accounts_setup?: boolean;
  software_used?: string;
  frequency?: "weekly" | "monthly" | "quarterly" | "annually";
  notes?: string;
}

export interface PayrollInfo {
  payroll_schedule?: "weekly" | "bi-weekly" | "semi-monthly" | "monthly";
  employee_count?: number;
  last_payroll_date?: string;
  next_payroll_date?: string;
  payroll_provider?: string;
  notes?: string;
}

export interface ServiceInfo {
  service_category?: string;
  frequency?: "one-time" | "weekly" | "monthly" | "quarterly" | "annually";
  last_service_date?: string;
  next_service_date?: string;
  special_instructions?: string;
  notes?: string;
}

// Form data type that matches our schema
export type ProjectFormData = z.infer<typeof projectSchema>;

// Enhanced project type with relationships and strongly typed JSON fields
export interface ProjectWithRelations
  extends Omit<
    DbProject,
    "tax_info" | "accounting_info" | "payroll_info" | "service_info"
  > {
  tax_info: TaxInfo | null;
  accounting_info: AccountingInfo | null;
  payroll_info: PayrollInfo | null;
  service_info: ServiceInfo | null;
  client: Database["public"]["Tables"]["clients"]["Row"] | null;
  template: Database["public"]["Tables"]["project_templates"]["Row"] | null;
  tasks: TaskWithRelations[];
  team_members: Database["public"]["Tables"]["project_team_members"]["Row"][];
  primary_manager_details: Database["public"]["Tables"]["users"]["Row"] | null;
}

// Constants with explicit typing
export const PROJECT_STATUS = {
  NOT_STARTED: "not_started",
  ON_HOLD: "on_hold",
  CANCELLED: "cancelled",
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  BLOCKED: "blocked",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const satisfies Record<string, ProjectStatus>;

export const SERVICE_TYPE = {
  TAX_RETURN: "tax_return",
  BOOKKEEPING: "bookkeeping",
  PAYROLL: "payroll",
  ADVISORY: "advisory",
} as const satisfies Record<string, ServiceType>;

// Type guards with proper type narrowing
export function isDbProject(project: unknown): project is DbProject {
  return (
    project !== null &&
    typeof project === "object" &&
    "id" in project &&
    "name" in project &&
    "status" in project
  );
}

export function hasClient(
  project: ProjectWithRelations,
): project is ProjectWithRelations & {
  client: NonNullable<ProjectWithRelations["client"]>;
} {
  return project.client !== null;
}

export function hasTemplate(
  project: ProjectWithRelations,
): project is ProjectWithRelations & {
  template: NonNullable<ProjectWithRelations["template"]>;
} {
  return project.template !== null;
}

// Conversion utilities with strict type checking
export function toProjectFormData(project: DbProject): Omit<
  ProjectFormData,
  "service_type" | "priority"
> & {
  service_type?: ServiceType | null;
  priority?: TaskPriority | null;
} {
  const { id, created_at, updated_at, priority, service_type, ...formData } =
    project;

  return {
    ...formData,
    priority: priority as TaskPriority,
    service_type: service_type as ServiceType,
    tax_info: project.tax_info as TaxInfo | null,
    accounting_info: project.accounting_info as AccountingInfo | null,
    payroll_info: project.payroll_info as PayrollInfo | null,
    service_info: project.service_info as ServiceInfo | null,
  };
}

export function toDbProject(formData: ProjectFormData): DbProjectInsert {
  const { tax_info, accounting_info, payroll_info, service_info, ...rest } =
    formData;

  return {
    ...rest,
    name: rest.name || "",
    status: rest.status || "not_started",
    tax_info: tax_info as Json,
    accounting_info: accounting_info as Json,
    payroll_info: payroll_info as Json,
    service_info: service_info as Json,
  };
}
