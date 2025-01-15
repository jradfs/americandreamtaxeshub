import { z } from 'zod'
import { ValidationError } from './error-handler'

export async function validateRequest<T>(
  req: Request,
  schema: z.Schema<T>
): Promise<T> {
  try {
    let data: unknown

    // Parse request body based on content type
    const contentType = req.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      data = await req.json()
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData()
      data = Object.fromEntries(formData)
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      data = Object.fromEntries(formData)
    } else {
      throw new ValidationError('Unsupported content type')
    }

    // Validate the data against the schema
    const result = await schema.safeParseAsync(data)
    
    if (!result.success) {
      // Format Zod errors into a more readable structure
      const errors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
      
      throw new ValidationError(
        'Validation failed: ' + errors.map(e => `${e.path}: ${e.message}`).join(', ')
      )
    }

    return result.data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.message)
    }
    throw new ValidationError('Failed to parse request body')
  }
}

// Helper for validating query parameters
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.Schema<T>
): T {
  try {
    const queryObj = Object.fromEntries(searchParams.entries())
    const result = schema.safeParse(queryObj)

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
      
      throw new ValidationError(
        'Query validation failed: ' + errors.map(e => `${e.path}: ${e.message}`).join(', ')
      )
    }

    return result.data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.message)
    }
    throw new ValidationError('Failed to validate query parameters')
  }
}

// Helper for validating URL parameters
export function validateParams<T>(
  params: Record<string, string>,
  schema: z.Schema<T>
): T {
  try {
    const result = schema.safeParse(params)

    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
      
      throw new ValidationError(
        'Parameter validation failed: ' + errors.map(e => `${e.path}: ${e.message}`).join(', ')
      )
    }

    return result.data
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.message)
    }
    throw new ValidationError('Failed to validate URL parameters')
  }
} 