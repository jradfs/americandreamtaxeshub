# American Dream Taxes Hub - Development Guide

## Project Overview
American Dream Taxes Hub is a practice management tool designed specifically for tax professionals and accounting firms. The platform streamlines client management, task tracking, and tax preparation workflows in a single, unified interface.

## Core Features & Architecture

### 1. Client Management System
- Full client database with comprehensive tax information
- JSONB fields store flexible data structures for contact and tax info
- Client status tracking and history
- Built on Supabase with real-time capabilities

### 2. Task Management System
- Task creation and assignment
- Priority-based task organization
- Progress tracking
- Template-based task generation
- Real-time status updates

### 3. Template System
- Pre-defined task templates for common tax procedures
- Customizable workflows
- Categories: Tax Preparation, Bookkeeping, Planning, etc.
- Template-based project creation

## Technical Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons

### Backend
- Supabase
- PostgreSQL with JSONB support
- Real-time subscriptions
- Row Level Security (RLS)

### Testing
- Playwright for E2E testing
- Jest for unit testing
- MSW for API mocking
- Supertest for API testing

### Authentication
- Supabase Auth
- Role-based access control
- Secure session management

## Development Guidelines

### 1. Code Organization
```plaintext
src/
  ├── app/                    # Next.js app router pages
  ├── components/            
  │   ├── ui/                # Reusable UI components
  │   ├── clients/           # Client-related components
  │   ├── tasks/             # Task-related components
  │   └── templates/         # Template-related components
  ├── lib/                   # Utility functions and helpers
  ├── hooks/                 # Custom React hooks
  └── types/                 # TypeScript type definitions
tests/
  ├── e2e/                   # Playwright E2E tests
  ├── __tests__/            # Jest unit tests
  └── integration/          # API integration tests
```

### 2. Coding Standards
- Use TypeScript for all new code
- Follow 'use client' directive for client components
- Use @/* path aliases (not src/*)
- Implement proper loading and error states
- Add proper TypeScript types for all data structures
- Write tests for new features

### 3. Component Structure
```typescript
// Example component structure
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

type ComponentProps = {
  // Define prop types
}

export function ComponentName({ ...props }: ComponentProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Component logic with proper error handling
  const handleAction = async () => {
    try {
      setLoading(true)
      // Action logic
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    // JSX with loading states
  )
}
```

### 4. Database Access
- Always use Supabase client for database operations
- Implement proper error handling
- Use TypeScript types for database models
- Follow RLS policies
- Handle real-time updates properly

### 5. State Management
- Use React hooks for local state
- Leverage Supabase real-time for shared state
- Implement proper loading states
- Handle errors gracefully
- Use optimistic updates where appropriate

### 6. Testing
- Write E2E tests for critical workflows
- Add unit tests for complex logic
- Test error states and edge cases
- Follow testing best practices
- Maintain test documentation

## Getting Started

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

### 2. Development Workflow
1. Create feature branch
2. Implement changes
3. Add tests
4. Run test suite
5. Submit pull request

### 3. Testing
- Run tests before commits
- Add tests for new features
- Update existing tests as needed
- Check test coverage

### 4. Deployment
- Automated via GitHub Actions
- Requires passing tests
- Includes database migrations
- Updates documentation

## Additional Resources
- [Testing Guide](./docs/testing/testing-guide.md)
- [API Documentation](./docs/api/overview.md)
- [Database Schema](./docs/database/schema.md)
- [Component Library](./docs/components/overview.md)