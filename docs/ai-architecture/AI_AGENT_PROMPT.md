# AI Agent Implementation Guide

## Role and Context
You are an AI development agent working on the American Dream Taxes Hub, a Next.js application for tax practice automation. Your task is to implement features following the established architecture and best practices.

## Project Overview
- **Project**: American Dream Taxes Hub
- **Stack**: Next.js 15, React 18, TypeScript, Supabase
- **Documentation Path**: `/docs/ai-architecture/automation/`

## Implementation Guidelines

### 1. Before Starting
```typescript
// Always:
1. Review the feature requirements thoroughly
2. Check existing components and utilities
3. Follow TypeScript strict mode
4. Use React Server Components by default
5. Implement proper error handling
6. Add tests for new features
```

### 2. Code Standards
```typescript
// Follow these patterns:
1. Use TypeScript strict mode
2. Implement proper error boundaries
3. Add loading states
4. Include proper types
5. Add JSDoc comments
```

### 3. Component Structure
```typescript
// Example component structure
import { type FC } from 'react'
import { type ComponentProps } from '@/types'

interface Props extends ComponentProps {
  // Define specific props
}

export const Component: FC<Props> = ({ prop1, prop2 }) => {
  // Implementation
}
```

### 4. Error Handling
```typescript
try {
  // Implementation
} catch (error) {
  // 1. Log error
  console.error('Error in component:', error)
  // 2. Show user-friendly message
  toast.error('An error occurred')
  // 3. Retry if appropriate
  retry()
}
```

### 5. Testing Requirements
```typescript
// Add tests for:
1. Component rendering
2. User interactions
3. Error states
4. Loading states
5. Edge cases
```

## Step-by-Step Implementation

1. **Review Documentation**
   - Check relevant guide in `/docs/ai-architecture/automation/`
   - Review specifications
   - Understand requirements

2. **Implementation**
   - Follow TypeScript patterns
   - Add proper error handling
   - Include loading states
   - Add comprehensive tests

3. **Testing**
   - Write unit tests
   - Add integration tests
   - Test error cases
   - Verify performance

4. **Documentation**
   - Update implementation docs
   - Add code comments
   - Document edge cases
   - Note any limitations

## Common Tasks

### 1. Adding New Components
```typescript
// 1. Create component file
// src/components/tax/TaxReturnForm.tsx
'use client'

import { useState } from 'react'
import { type FormProps } from '@/types'

export function TaxReturnForm({ initialData }: FormProps) {
  // Implementation
}

// 2. Add tests
// src/__tests__/components/TaxReturnForm.test.tsx
import { render, screen } from '@testing-library/react'
import { TaxReturnForm } from '@/components/tax/TaxReturnForm'

describe('TaxReturnForm', () => {
  it('renders correctly', () => {
    render(<TaxReturnForm />)
    // Add assertions
  })
})

// 3. Add to exports
// src/components/index.ts
export * from './tax/TaxReturnForm'
```

### 2. Adding New Features
```typescript
// 1. Review requirements
// 2. Create implementation plan
// 3. Follow documentation guides
// 4. Add tests
// 5. Update documentation
```

## Communication Guidelines

1. **When Stuck**
   - Review relevant documentation
   - Check existing implementations
   - Ask for clarification
   - Explain what you've tried

2. **When Complete**
   - Document changes
   - List test coverage
   - Note any limitations
   - Suggest improvements

## Checklist Before Submitting

```typescript
// Verify:
1. TypeScript strict mode passes
2. All tests pass
3. Error handling implemented
4. Loading states added
5. Documentation updated
6. Performance checked
```

## Example Implementation

```typescript
// Example feature implementation
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

interface TaxReturnData {
  id: string
  year: number
  status: string
}

export function useTaxReturns(clientId: string) {
  // 1. Proper typing
  const { data, error, isLoading } = useQuery<TaxReturnData[]>({
    queryKey: ['taxReturns', clientId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/tax-returns/${clientId}`)
        if (!response.ok) throw new Error('Failed to fetch')
        return response.json()
      } catch (error) {
        // 2. Error handling
        console.error('Error fetching tax returns:', error)
        toast.error('Failed to load tax returns')
        throw error
      }
    }
  })

  // 3. Return loading state
  return { data, error, isLoading }
}
```

Remember:
1. Follow the documentation structure
2. Maintain code quality
3. Add proper tests
4. Update documentation
5. Consider edge cases