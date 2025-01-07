# American Dream Taxes Hub - Type System Guide

## Current Type System Architecture

### Core Type Files
1. `database.types.ts` - Auto-generated Supabase types
2. `clients.ts` - Client-related type definitions
3. `projects.ts` - Project and template types
4. `tasks.ts` - Task and workflow types
5. `hooks.ts` - Custom hook type definitions

### Type Hierarchy
```
database.types.ts (base)
├── clients.ts
│   ├── Client
│   ├── ClientWithRelations
│   └── ClientFormValues
├── projects.ts
│   ├── Project
│   ├── ProjectWithRelations
│   └── ProjectFormValues
├── tasks.ts
│   ├── Task
│   ├── TaskWithRelations
│   └── TaskFormData
└── hooks.ts
    └── Custom hook types
```

## Current Priority Areas

### 1. Client Type System
```typescript
// Current pattern for client types
export type Client = Omit<Database['public']['Tables']['clients']['Row'], 'contact_info'> & {
  contact_info: ContactInfo;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}
```

#### Known Issues
- JSON field handling in forms
- Contact info type validation
- Relationship handling with projects

### 2. Project Type System
```typescript
export type Project = Database['public']['Tables']['projects']['Row']

export type ProjectWithRelations = Project & {
  client?: ClientWithRelations | null
  tasks?: TaskWithAssignee[]
  team_members?: Database['public']['Tables']['project_team_members']['Row'][]
}
```

#### Known Issues
- Template relationship handling
- Task assignee type mismatches
- JSON field validation for service-specific info

### 3. Task Type System
```typescript
export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project_id?: string
  assignee_id?: string
  // ... other fields
}

export type TaskWithRelations = Task & {
  project?: Project
  assignee?: Client
}
```

#### Known Issues
- Dependency cycle handling
- Assignee relationship types
- Status transition validation

## Type Conversion Patterns

### 1. JSON Field Handling
```typescript
// Pattern for handling JSON fields
interface ServiceInfo {
  type: string;
  details: Record<string, unknown>;
  config?: Record<string, unknown>;
}

type ProjectWithServiceInfo = Omit<Project, 'service_info'> & {
  service_info: ServiceInfo;
}
```

### 2. Relationship Handling
```typescript
// Pattern for handling relationships
interface WithRelations<T, R> {
  data: T;
  relations: R;
}

type ProjectWithClient = WithRelations<Project, {
  client: Client;
  tasks: Task[];
}>
```

### 3. Form Data Types
```typescript
// Pattern for form data types
type FormData<T> = Omit<T, 'id' | 'created_at' | 'updated_at'> & {
  [K in keyof T]?: T[K] extends object ? string : T[K];
}
```

## Type Safety Best Practices

### 1. Database Operations
```typescript
// Type-safe database operations
const getProject = async (id: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select<typeof Project>()
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}
```

### 2. Component Props
```typescript
// Type-safe component props
interface ProjectCardProps {
  project: ProjectWithRelations;
  onUpdate: (updates: Partial<Project>) => Promise<void>;
}
```

### 3. Form Handling
```typescript
// Type-safe form handling
interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
}
```

## Immediate Action Items

### 1. Client Dialog Types
- [ ] Create proper type definitions for contact_info JSON
- [ ] Implement validation for client form data
- [ ] Fix relationship handling with projects

### 2. Project Template Types
- [ ] Resolve template task relationship issues
- [ ] Implement proper type checking for service-specific info
- [ ] Add validation for template application

### 3. Task Assignment Types
- [ ] Fix assignee relationship types
- [ ] Implement proper status transition types
- [ ] Add validation for task dependencies

## Type Generation Process

### 1. Database Type Updates
```powershell
# Generate updated types
$env:SUPABASE_ACCESS_TOKEN="sbp_829505ecb6492198977d14392b9272cf9723c08f"; 
npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg | 
Out-File -Encoding UTF8 src/types/database.types.ts
```

### 2. Type Update Order
1. Update `database.types.ts`
2. Update `clients.ts`
3. Update `projects.ts`
4. Update `tasks.ts`
5. Update `hooks.ts`

## Database Changes and Type Updates

### Important: Database Modification Process
All database schema changes must be made through the Supabase dashboard by the database administrator. This includes:
- Adding or modifying tables
- Changing column types
- Adding or removing constraints
- Modifying enums
- Adding or updating functions

### Database Change Request Process
1. Document the proposed changes:
   ```sql
   -- Example format for requesting changes
   -- Table: clients
   -- Change: Add new column for tax_year
   ALTER TABLE clients
   ADD COLUMN tax_year INTEGER;
   
   -- Change: Modify enum
   ALTER TYPE client_status
   ADD VALUE 'pending_review';
   ```

2. Provide justification for changes:
   - Why the change is needed
   - Impact on existing data
   - Impact on application functionality

3. Wait for administrator approval and implementation

4. After changes are applied, request new type generation:
   ```powershell
   # Only run after database administrator confirms changes
   $env:SUPABASE_ACCESS_TOKEN="sbp_829505ecb6492198977d14392b9272cf9723c08f"; 
   npx supabase gen types typescript --project-id fnjkkmwmpxqvezqextxg | 
   Out-File -Encoding UTF8 src/types/database.types.ts
   ```

### Type Update Process After Database Changes
1. Wait for confirmation that database changes are complete
2. Generate new types using the provided command
3. Review generated types in `database.types.ts`
4. Update dependent type files in order:
   - `src/types/clients.ts`
   - `src/types/projects.ts`
   - `src/types/tasks.ts`
   - `src/types/hooks.ts`

## Testing Type Safety

### 1. Build Time Checks
```bash
# Run type checks
npm run type-check

# Build project
npm run build
```

### 2. Runtime Validation
```typescript
// Example validation
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string(),
  status: z.enum(['active', 'completed']),
  // ... other fields
});

type ValidatedProject = z.infer<typeof projectSchema>;
```

## Resources

### Documentation
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Supabase Type System](https://supabase.com/docs/reference/typescript-support)
- [Zod Schema Validation](https://github.com/colinhacks/zod)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Coverage Tool](https://github.com/plantain-00/type-coverage) 

## Updated Type Definitions

- **Client Type (`clients.ts`):**
  ```typescript:src/types/clients.ts
  // Updated Client and EnhancedClient types
  ```
- **Project Type (`projects.ts`):**
  ```typescript:src/types/projects.ts
  // Updated Project types
  ```
- **Database Types (`database.types.ts`):**
  ```typescript:src/types/database.types.ts
  // Ensure all tables and relations are accurately defined
  ```

## Type Generation Process

1. After updating the database schema, regenerate the types:
   ```bash
   npm run supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
   ```
2. Verify that all custom types are correctly integrated into your application.
3. Run the build process to ensure type consistency:
   ```bash
   npm run build
   ``` 