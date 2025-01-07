import { z } from 'zod';
import { Database } from '@/types/database.types';

type TemplateCategoryRow = Database['public']['Tables']['template_categories']['Row']

// Helper type for dates
const dateSchema = z.union([
  z.string(),
  z.date(),
  z.null()
]).transform(val => {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  return val;
});

// Template category schema
export const templateCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
  parent_id: z.string().optional().nullable(),
  position: z.number().optional().nullable(),
  created_at: dateSchema,
  updated_at: dateSchema,
}) satisfies z.ZodType<TemplateCategoryRow>;

// Export types
export type TemplateCategoryFormValues = z.infer<typeof templateCategorySchema>; 