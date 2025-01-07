import { z } from 'zod'
import { 
  clientSchema,
  projectSchema,
  taskSchema
} from './schema'

// Type inference helpers
export type InferredClient = z.infer<typeof clientSchema>
export type InferredProject = z.infer<typeof projectSchema>
export type InferredTask = z.infer<typeof taskSchema>

// Validation helpers
export const validateClient = (data: unknown) => {
  return clientSchema.parse(data)
}

export const validateProject = (data: unknown) => {
  return projectSchema.parse(data)
}

export const validateTask = (data: unknown) => {
  return taskSchema.parse(data)
}

// Safe parsers that return Result type
export const safeParseClient = (data: unknown) => {
  return clientSchema.safeParse(data)
}

export const safeParseProject = (data: unknown) => {
  return projectSchema.safeParse(data)
}

export const safeParseTask = (data: unknown) => {
  return taskSchema.safeParse(data)
}

// Partial validators for updates
export const validatePartialClient = (data: unknown) => {
  return clientSchema.partial().parse(data)
}

export const validatePartialProject = (data: unknown) => {
  return projectSchema.partial().parse(data)
}

export const validatePartialTask = (data: unknown) => {
  return taskSchema.partial().parse(data)
}

// Type guards
export const isClient = (data: unknown): data is InferredClient => {
  return clientSchema.safeParse(data).success
}

export const isProject = (data: unknown): data is InferredProject => {
  return projectSchema.safeParse(data).success
}

export const isTask = (data: unknown): data is InferredTask => {
  return taskSchema.safeParse(data).success
}

// Error formatting
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }))
}

// Validation with custom error messages
export const validateWithCustomErrors = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  customErrors?: Record<string, string>
) => {
  try {
    return { success: true, data: schema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: customErrors?.[err.path.join('.')] || err.message
      }))
      return { success: false, errors: formattedErrors }
    }
    throw error
  }
} 