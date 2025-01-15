# Data Layer Implementation

## Overview
Implementation guide for the data layer, focusing on tax practice management and automation.

## Database Schema

### Core Tables
```sql
-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_id TEXT,
  contact_info JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Returns
CREATE TABLE tax_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  tax_year INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tax_return_id UUID REFERENCES tax_returns(id),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  processed_by_ai BOOLEAN DEFAULT false,
  content_extracted JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Data Fetching Hooks

### Client Management
```typescript
// src/hooks/useClients.ts
export function useClients() {
  const queryClient = useQueryClient()
  
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
      if (error) throw error
      return data
    }
  })
}
```

### Tax Return Management
```typescript
// src/hooks/useTaxReturns.ts
export function useTaxReturns(clientId: string) {
  return useQuery({
    queryKey: ['taxReturns', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_returns')
        .select(`
          *,
          client:clients(name),
          assigned:profiles(name)
        `)
        .eq('client_id', clientId)
      if (error) throw error
      return data
    }
  })
}
```

## AI Integration
```typescript
// src/lib/ai/document-processing.ts
export async function processDocument(
  document: File,
  taxReturnId: string
) {
  // Document processing implementation
  // 1. Upload document
  // 2. Extract information
  // 3. Update database
}
```

## Files to Create/Update

1. Database:
   - `supabase/migrations/[timestamp]_initial_schema.sql`
   - `supabase/migrations/[timestamp]_add_ai_processing.sql`

2. Hooks:
   - `src/hooks/useClients.ts`
   - `src/hooks/useTaxReturns.ts`
   - `src/hooks/useDocuments.ts`

3. AI Processing:
   - `src/lib/ai/document-processing.ts`
   - `src/lib/ai/tax-analysis.ts`

## Testing

```typescript
// src/__tests__/hooks/useTaxReturns.test.ts
describe('useTaxReturns', () => {
  it('fetches tax returns for client', async () => {
    // Test implementation
  })
})
```

## Next Steps
After implementing the data layer:
1. Move to [UI Component Implementation](./03-UI.md)
2. Set up real-time updates
3. Add data validation