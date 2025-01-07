# American Dream Taxes Hub Development Guide

## Table of Contents
1. [Type System Status](#type-system-status)
2. [Development Workflow](#development-workflow)
3. [Type Generation and Management](#type-generation-and-management)
4. [Error Resolution Strategy](#error-resolution-strategy)
5. [Best Practices](#best-practices)

## Type System Status

### Current Implementation (March 2024)
- ✅ Database types auto-generation
- ✅ Basic type hierarchy
- ✅ Form validation schemas
- 🟡 JSON field typing (in progress)
- 🟡 Relationship types (in progress)
- ❌ Auth-related types (pending)

### Priority Areas
1. **Auth System**
   - Fix type issues in auth-layout.tsx
   - Implement proper auth state types
   - Add type-safe guards

2. **JSON Fields**
   - Implement strict typing for all JSON fields
   - Add runtime validation
   - Update form schemas

3. **Relationships**
   - Strengthen foreign key typing
   - Implement proper cascading
   - Document constraints

## Development Workflow

### 1. Type-First Development
1. Start with database types (`@/types/database.types.ts`)
2. Create derived types
3. Implement component logic
4. Add form handling
5. Test and validate

### 2. Type Update Process
```bash
# 1. Generate new types
$env:SUPABASE_ACCESS_TOKEN="sbp_829505ecb6492198977d14392b9272cf9723c08f"
npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg | 
Out-File -Encoding UTF8 src/types/database.types.ts

# 2. Run type checks
npm run type-check

# 3. Fix any issues
npm run build
```

### 3. Component Development
```typescript
// 1. Import base types
import { Database } from '@/types/database.types'

// 2. Define component types
type Props = {
  client: Database['public']['Tables']['clients']['Row']
  onUpdate: (id: string) => Promise<void>
}

// 3. Implement component
export const Component = ({ client, onUpdate }: Props) => {
  // Implementation
}
```

## Type Generation and Management

### Base Types
All types must be derived from `@/types/database.types.ts`:

```typescript
// Good
type Client = Database['public']['Tables']['clients']['Row']

// Bad
interface Client {
  id: string
  name: string
}
```

### JSON Field Types
```typescript
// Good
interface ContactInfo {
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
}

type Client = Omit<Database['public']['Tables']['clients']['Row'], 'contact_info'> & {
  contact_info: ContactInfo
}

// Bad
type Client = Database['public']['Tables']['clients']['Row'] & {
  contact_info: any
}
```

### Relationship Types
```typescript
// Good
interface ProjectWithRelations extends Database['public']['Tables']['projects']['Row'] {
  client?: Database['public']['Tables']['clients']['Row']
  tasks?: Database['public']['Tables']['tasks']['Row'][]
}

// Bad
interface ProjectWithRelations {
  // ... manual type definitions
}
```

## Error Resolution Strategy

### Type Error Categories
1. Database Type Mismatches
   - Check generated types
   - Verify field names and types
   - Update derived types

2. Component Type Issues
   - Verify prop types
   - Check generic constraints
   - Update form schemas

3. Runtime Type Issues
   - Add Zod validation
   - Implement type guards
   - Add error boundaries

## Best Practices

### 1. Type Safety
```typescript
// Good
const getClient = async (id: string): Promise<Database['public']['Tables']['clients']['Row']> => {
  // Implementation
}

// Bad
const getClient = async (id: any): Promise<any> => {
  // Implementation
}
```

### 2. Form Handling
```typescript
// Good
const schema = z.object({
  name: z.string(),
  status: z.enum(['active', 'inactive'])
})
type FormValues = z.infer<typeof schema>

// Bad
type FormValues = {
  name: string
  status: string
}
```

### 3. Error Handling
```typescript
// Good
type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Bad
type ApiError = any
```

## Testing & Validation

### Type Coverage
```bash
# Install type coverage tool
npm install --save-dev type-coverage

# Run coverage check
npx type-coverage --detail

# Set minimum coverage
npx type-coverage --detail --min 95
```

### Runtime Validation
1. Use Zod schemas
2. Implement type guards
3. Add error boundaries
4. Test edge cases

## Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Types](https://supabase.com/docs/reference/typescript-support)
- [Zod Documentation](https://zod.dev/)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Coverage Tool](https://github.com/plantain-00/type-coverage) 