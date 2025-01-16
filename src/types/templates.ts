import type { Database } from "./database.types";
import { z } from "zod";
import {
  projectTemplateSchema,
  templateTaskSchema,
} from "@/lib/validations/template";

// Database types
export type DbProjectTemplate =
  Database["public"]["Tables"]["project_templates"]["Row"];
export type DbProjectTemplateInsert =
  Database["public"]["Tables"]["project_templates"]["Insert"];
export type DbProjectTemplateUpdate =
  Database["public"]["Tables"]["project_templates"]["Update"];

export type DbTemplateTask =
  Database["public"]["Tables"]["template_tasks"]["Row"];
export type DbTemplateTaskInsert =
  Database["public"]["Tables"]["template_tasks"]["Insert"];
export type DbTemplateTaskUpdate =
  Database["public"]["Tables"]["template_tasks"]["Update"];

// JSON field types from database
export type ProjectDefaults = NonNullable<
  DbProjectTemplate["project_defaults"]
>;
export type SeasonalPriority = NonNullable<
  DbProjectTemplate["seasonal_priority"]
>;

// Form data types
export type ProjectTemplateFormData = z.infer<typeof projectTemplateSchema>;
export type TemplateTaskFormData = z.infer<typeof templateTaskSchema>;

// Types with relationships
export interface ProjectTemplateWithRelations extends DbProjectTemplate {
  tasks?: DbTemplateTask[];
  category?: Database["public"]["Tables"]["template_categories"]["Row"] | null;
}

export interface TemplateTaskWithRelations extends DbTemplateTask {
  template?: DbProjectTemplate | null;
  dependencies?: DbTemplateTask[];
}

// Template category types
export type DbTemplateCategory =
  Database["public"]["Tables"]["template_categories"]["Row"];
export type DbTemplateCategoryInsert =
  Database["public"]["Tables"]["template_categories"]["Insert"];
export type DbTemplateCategoryUpdate =
  Database["public"]["Tables"]["template_categories"]["Update"];

export interface TemplateCategoryWithRelations extends DbTemplateCategory {
  templates?: DbProjectTemplate[];
  parent?: DbTemplateCategory | null;
  children?: DbTemplateCategory[];
}
