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
- Time tracking capabilities

### 3. Template System
- Pre-defined task templates for common tax procedures
- Customizable workflows
- Categories: Tax Preparation, Bookkeeping, Planning, etc.

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

### Authentication
- Supabase Auth
- Role-based access control
- Secure session management

## Development Guidelines

### 1. Code Organization
\`\`\`plaintext
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
\`\`\`

### 2. Coding Standards
- Use TypeScript for all new code
- Follow 'use client' directive for client components
- Use @/* path aliases (not src/*)
- Implement proper loading and error states
- Add proper TypeScript types for all data structures

### 3. Component Structure
\`\`\`typescript
// Example component structure
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type ComponentProps = {
  // Define prop types
}

export function ComponentName({ ...props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  )
}
\`\`\`

### 4. Database Access
- Always use Supabase client for database operations
- Implement proper error handling
- Use TypeScript types for database models
- Follow RLS policies

### 5. State Management
- Use React hooks for local state
- Leverage Supabase real-time for shared state
- Implement proper loading states
- Handle errors gracefully

## Getting Started

1. **Clone and Install**
\`\`\`bash
git clone [repository-url]
cd american-dream-taxes-hub
npm install
\`\`\`

2. **Environment Setup**
\`\`\`bash
# Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

3. **Development Server**
\`\`\`bash
npm run dev
\`\`\`

## Current Priority Tasks

1. **Client Management**
- Implement client creation dialog
- Add client editing functionality
- Add client search/filtering

2. **Task Management**
- Complete task creation workflow
- Implement task assignment
- Add task status updates

3. **Template System**
- Build template creation interface
- Implement template application

4. **Workspace Integration**
- Review existing workspace code
- Plan reintegration strategy
- Update UI/UX for workspace views

## Testing
- Manual testing for all features
- Focus on edge cases
- Test across different screen sizes
- Verify all database operations

## Deployment
- Deployment through Vercel
- Environment variable management
- Database backup procedures
- CI/CD pipeline considerations

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Communication Channels
- GitHub for code reviews and issues
- Discord for team communication
- Weekly sync meetings
- Daily standup updates

## Notes
- Keep code modular and reusable
- Focus on performance and user experience
- Regular commits with clear messages
- Document any major changes or decisions