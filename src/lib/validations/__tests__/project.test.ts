import { projectSchema } from '../project'
import { z } from 'zod'

describe('Project Schema Validation', () => {
  it('validates a valid project', () => {
    const validProject = {
      name: 'Test Project',
      description: 'Test Description',
      client_id: 'client123',
      service_type: 'tax_return',
      priority: 'high',
      due_date: '2024-12-31',
      tax_info: {
        return_type: '1040',
        tax_year: 2023
      }
    }

    const result = projectSchema.safeParse(validProject)
    expect(result.success).toBe(true)
  })

  it('validates required fields', () => {
    const invalidProject = {
      description: 'Test Description',
      priority: 'high'
    }

    const result = projectSchema.safeParse(invalidProject)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['name'],
            message: 'Required'
          }),
          expect.objectContaining({
            path: ['client_id'],
            message: 'Required'
          }),
          expect.objectContaining({
            path: ['service_type'],
            message: 'Required'
          })
        ])
      )
    }
  })

  it('validates service type values', () => {
    const invalidProject = {
      name: 'Test Project',
      client_id: 'client123',
      service_type: 'invalid_service',
      priority: 'high'
    }

    const result = projectSchema.safeParse(invalidProject)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['service_type'],
            message: expect.stringContaining('Invalid enum value')
          })
        ])
      )
    }
  })

  it('validates priority values', () => {
    const invalidProject = {
      name: 'Test Project',
      client_id: 'client123',
      service_type: 'tax_return',
      priority: 'invalid_priority'
    }

    const result = projectSchema.safeParse(invalidProject)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['priority'],
            message: expect.stringContaining('Invalid enum value')
          })
        ])
      )
    }
  })

  it('validates tax info for tax return service type', () => {
    const invalidProject = {
      name: 'Test Project',
      client_id: 'client123',
      service_type: 'tax_return',
      priority: 'high',
      tax_info: {
        // Missing required fields
      }
    }

    const result = projectSchema.safeParse(invalidProject)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['tax_info', 'return_type'],
            message: 'Required'
          }),
          expect.objectContaining({
            path: ['tax_info', 'tax_year'],
            message: 'Required'
          })
        ])
      )
    }
  })
})
