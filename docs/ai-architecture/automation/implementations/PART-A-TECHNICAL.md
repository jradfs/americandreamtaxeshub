# Part A: Technical Implementation Guide

## Overview
This guide covers the technical implementation of the American Dream Taxes Hub, focusing on the core architecture and components needed to support the firm's SOPs.

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [Database Implementation](#database-implementation)
3. [Component Structure](#component-structure)
4. [API Routes](#api-routes)
5. [Testing Framework](#testing-framework)

## Core Architecture

### Project Structure
```bash
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── clients/
│   │   ├── documents/
│   │   ├── projects/
│   │   └── tax-returns/
│   └── api/
├── components/
│   ├── clients/
│   ├── documents/
│   ├── projects/
│   ├── tax-returns/
│   └── ui/
├── hooks/
├── lib/
└── types/
```

### Key Technologies
- Next.js 14 with App Router
- Supabase (Database & Auth)
- TanStack Query for data fetching
- Zod for validation
- Tailwind CSS for styling
- Jest & Testing Library for testing

## Component Implementation

### 1. Client Management

#### Client Dashboard Component
```typescript
// src/app/(dashboard)/clients/page.tsx
import { Suspense } from 'react'
import { ClientList } from '@/components/clients/client-list'
import { ClientFilters } from '@/components/clients/client-filters'
import { ClientStats } from '@/components/clients/client-stats'
import { LoadingSpinner } from '@/components/ui/loading'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <ClientStats />
      <ClientFilters />
      <Suspense fallback={<LoadingSpinner />}>
        <ClientList />
      </Suspense>
    </div>
  )
}
```

#### Client List with Real-time Updates
```typescript
// src/components/clients/client-list.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '@/hooks/use-supabase'
import { ClientCard } from './client-card'
import type { Client } from '@/types/database.types'

export function ClientList() {
  const { supabase } = useSupabase()
  
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          tax_returns(count),
          documents(count)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Client[]
    }
  })

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clients?.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}
```

### 2. Document Processing

#### Document Upload Component
```typescript
// src/components/documents/document-upload.tsx
'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSupabase } from '@/hooks/use-supabase'
import { useDocuments } from '@/hooks/use-documents'
import { processDocument } from '@/lib/ai/document-processor'

export function DocumentUpload({ clientId }: { clientId: string }) {
  const { uploadDocument } = useDocuments(clientId)
  
  const onDrop = useCallback(async (files: File[]) => {
    for (const file of files) {
      // 1. Process with AI
      const analysis = await processDocument(file)
      
      // 2. Upload file and create record
      await uploadDocument.mutateAsync({
        file,
        metadata: {
          clientId,
          category: analysis.documentType,
          extractedData: analysis.data
        }
      })
    }
  }, [clientId, uploadDocument])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
      `}
    >
      <input {...getInputProps()} />
      <p>Drag and drop files here or click to select</p>
    </div>
  )
}
```

### 3. Project Management

#### Project Dashboard
```typescript
// src/components/projects/dashboard.tsx
'use client'

import { useState } from 'react'
import { ProjectList } from './project-list'
import { ProjectFilters } from './project-filters'
import { ProjectStats } from './project-stats'
import { ProjectSort } from './project-sort'
import type { Project } from '@/types/database.types'

const sortOptions = {
  'due-date': (a: Project, b: Project) => 
    new Date(a.due_date) - new Date(b.due_date),
  'priority': (a: Project, b: Project) =>
    priorityWeight[b.priority] - priorityWeight[a.priority]
}

export function ProjectDashboard() {
  const [sortBy, setSortBy] = useState('due-date')
  const [filters, setFilters] = useState({})

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <ProjectFilters onChange={setFilters} />
        <ProjectSort value={sortBy} onChange={setSortBy} />
      </div>
      <ProjectStats />
      <ProjectList sortBy={sortBy} filters={filters} />
    </div>
  )
}
```

### 4. Tax Return Processing

#### Tax Return Workspace
```typescript
// src/components/tax-returns/workspace.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '@/hooks/use-supabase'
import { DocumentList } from './document-list'
import { WorkflowStatus } from './workflow-status'
import { ReturnDetails } from './return-details'
import type { TaxReturn } from '@/types/database.types'

export function TaxReturnWorkspace({ 
  returnId 
}: { 
  returnId: string 
}) {
  const { supabase } = useSupabase()
  
  const { data: taxReturn } = useQuery({
    queryKey: ['tax-returns', returnId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_returns')
        .select(`
          *,
          client:clients(*),
          documents:documents(*),
          tasks:tasks(*)
        `)
        .eq('id', returnId)
        .single()
      
      if (error) throw error
      return data as TaxReturn
    }
  })

  if (!taxReturn) return null

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <ReturnDetails taxReturn={taxReturn} />
        <DocumentList documents={taxReturn.documents} />
      </div>
      <div className="col-span-4">
        <WorkflowStatus
          status={taxReturn.status}
          tasks={taxReturn.tasks}
        />
      </div>
    </div>
  )
}
```

## API Routes

### 1. Document Processing API
```typescript
// src/app/api/documents/process/route.ts
import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  try {
    // 1. Process with AI
    const extractedData = await processDocumentWithAI(file)
    
    // 2. Store results
    const { data, error } = await supabase
      .from('documents')
      .insert({
        file_name: file.name,
        extracted_data: extractedData,
        processing_status: 'completed'
      })
      .select()
      .single()
      
    if (error) throw error
    
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### 2. Tax Return Analysis API
```typescript
// src/app/api/tax-returns/analyze/route.ts
import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { returnId } = await request.json()
  
  try {
    // 1. Get tax return data
    const { data: taxReturn } = await supabase
      .from('tax_returns')
      .select(`
        *,
        documents(*)
      `)
      .eq('id', returnId)
      .single()
    
    // 2. Analyze with AI
    const analysis = await analyzeTaxReturnWithAI(taxReturn)
    
    // 3. Store results
    const { data, error } = await supabase
      .from('tax_returns')
      .update({
        ai_analysis: analysis,
        analysis_status: 'completed',
        last_analyzed_at: new Date().toISOString()
      })
      .eq('id', returnId)
      .select()
      .single()
    
    if (error) throw error
    
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

## Testing Framework

### 1. Component Testing
```typescript
// src/components/documents/__tests__/document-upload.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { DocumentUpload } from '../document-upload'
import { useDocuments } from '@/hooks/use-documents'

jest.mock('@/hooks/use-documents')

describe('DocumentUpload', () => {
  it('handles file uploads correctly', async () => {
    const mockUpload = jest.fn()
    ;(useDocuments as jest.Mock).mockReturnValue({
      uploadDocument: {
        mutateAsync: mockUpload
      }
    })

    render(<DocumentUpload clientId="123" />)
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByRole('button')
    
    await fireEvent.drop(input, {
      dataTransfer: {
        files: [file]
      }
    })
    
    expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining({
      file,
      metadata: expect.any(Object)
    }))
  })
})
```

### 2. API Route Testing
```typescript
// src/app/api/__tests__/documents.test.ts
import { createRouteHandlerClient } from '@supabase/ssr'
import { POST } from '../documents/process/route'

jest.mock('@supabase/ssr')

describe('Document Processing API', () => {
  it('processes documents correctly', async () => {
    const mockInsert = jest.fn().mockResolvedValue({
      data: { id: '123' },
      error: null
    })
    
    ;(createRouteHandlerClient as jest.Mock).mockReturnValue({
      from: () => ({
        insert: mockInsert,
        select: () => ({
          single: () => mockInsert()
        })
      })
    })

    const formData = new FormData()
    formData.append('file', new File(['test'], 'test.pdf'))
    
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: formData
    }))
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('id')
  })
})
```

### 3. Integration Testing
```typescript
// src/tests/integration/tax-workflow.test.ts
import { test, expect } from '@playwright/test'

test.describe('Tax Return Workflow', () => {
  test('complete tax return workflow', async ({ page }) => {
    // 1. Create new tax return
    await page.goto('/tax-returns/new')
    await page.fill('[name="client_id"]', 'test-client')
    await page.fill('[name="tax_year"]', '2024')
    await page.click('button[type="submit"]')
    
    // 2. Upload documents
    await page.setInputFiles('input[type="file"]', 'test-docs/w2.pdf')
    await expect(page.getByText('Processing...')).toBeVisible()
    await expect(page.getByText('Completed')).toBeVisible()
    
    // 3. Verify workflow progress
    await expect(page.getByText('Documents Received')).toHaveClass(/completed/)
    
    // 4. Complete review
    await page.click('[data-testid="complete-review"]')
    await expect(page.getByText('Ready for Filing')).toBeVisible()
  })
})
```

## AI Integration Points

### 1. Document Analysis
```typescript
// src/lib/ai/document-analysis.ts
import { type AnalysisResult } from '@/types/ai'

export async function analyzeDocument(
  document: File
): Promise<AnalysisResult> {
  // 1. Convert document to text/data
  const documentData = await prepareDocumentData(document)
  
  // 2. Send to AI service
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ documentData })
  })
  
  // 3. Process and validate results
  const result = await response.json()
  return validateAnalysisResult(result)
}

function validateAnalysisResult(
  result: unknown
): asserts result is AnalysisResult {
  // Add validation logic here
}
```

### 2. Tax Return Automation
```typescript
// src/lib/ai/tax-automation.ts
import { type TaxReturn, type AIRecommendation } from '@/types/tax'

export async function generateTaxRecommendations(
  taxReturn: TaxReturn
): Promise<AIRecommendation[]> {
  // 1. Gather all relevant data
  const data = await aggregateTaxData(taxReturn)
  
  // 2. Generate recommendations
  const recommendations = await fetch('/api/ai/tax-recommendations', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json())
  
  // 3. Validate and process recommendations
  return processTaxRecommendations(recommendations)
}
```

## Real-time Features

### 1. Task Updates
```typescript
// src/hooks/use-real-time-tasks.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSupabase } from './use-supabase'

export function useRealTimeTasks(projectId: string) {
  const { supabase } = useSupabase()
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          queryClient.invalidateQueries(['tasks', projectId])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase, queryClient])
}
```

### 2. Document Status Updates
```typescript
// src/hooks/use-real-time-documents.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSupabase } from './use-supabase'

export function useRealTimeDocuments(clientId: string) {
  const { supabase } = useSupabase()
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`client-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          queryClient.invalidateQueries(['documents', clientId])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clientId, supabase, queryClient])
}
```

## Deployment Configuration

### 1. Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Service Configuration
AI_SERVICE_URL=your-ai-service-url
AI_SERVICE_KEY=your-ai-service-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-url.com
NODE_ENV=production
```

### 2. Build Configuration
```json
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponents: true,
  },
  images: {
    domains: ['your-storage-domain.com'],
  },
}

module.exports = nextConfig
```

## Security Considerations

### 1. Authentication Middleware
```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/*).*)',
  ],
}
```

### 2. API Rate Limiting
```typescript
// src/lib/rate-limit.ts
import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

## Next Steps for Technical Implementation

1. Complete component implementation
2. Add comprehensive error handling
3. Implement all real-time features
4. Add full test coverage
5. Configure CI/CD pipeline

---

See [Part B: SOP Implementation](./PART-B.md) for business process implementation details.