# Authentication & Security Implementation

## Overview
This document outlines the authentication and security implementation for the tax practice automation system.

## Prerequisites
```bash
npm install @supabase/ssr@0.5.2 sonner@1.7.1
```

## Core Files Structure
```
src/
├── lib/
│   └── supabase/
│       ├── server.ts      # Server-side Supabase client
│       └── browser.ts     # Browser-side Supabase client
├── hooks/
│   └── use-auth.ts        # Authentication hook
├── components/
│   ├── auth/
│   │   └── login-form.tsx # Login form component
│   └── role-guard.tsx     # Role-based access control
└── middleware.ts          # Authentication middleware
```

## Security Requirements
- Role-based access control (RBAC)
- Secure session management
- Row Level Security (RLS)
- API route protection
- Environment variable protection

## Implementation Steps

### 1. Server Client Setup
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### 2. Browser Client Setup
```typescript
// src/lib/supabase/browser.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3. Authentication Hook
```typescript
// src/hooks/use-auth.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ... rest of implementation
}
```

### 4. Role Guard Component
```typescript
// src/components/role-guard.tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { ReactNode } from 'react'

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}) {
  // ... implementation
}
```

## Database Security

### Row Level Security Policies
```sql
-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view assigned clients"
  ON clients FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM client_assignments WHERE client_id = id
  ));
```

## Testing

### Unit Tests
```typescript
// src/__tests__/hooks/use-auth.test.tsx
import { renderHook } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'

describe('useAuth', () => {
  // ... test cases
})
```

### Security Tests
- Session management
- Role-based access
- API route protection
- SQL injection prevention
- XSS protection

## Validation Steps
1. Verify authentication flow
2. Test role-based access
3. Check error handling
4. Run test suite
5. Verify security headers
6. Test API route protection

## Rollback Procedure
1. Revert to previous implementation
2. Remove new dependencies
3. Restore original configuration
4. Verify security policies

## Common Issues
1. Module not found errors
   - Check import paths
   - Verify dependencies installed
2. Configuration warnings
   - Review Next.js version compatibility
   - Update experimental features
3. Authentication errors
   - Check environment variables
   - Verify Supabase project setup

## Security Best Practices
1. Always use HTTPS
2. Implement proper CORS policies
3. Use secure session cookies
4. Implement rate limiting
5. Regular security audits
6. Keep dependencies updated