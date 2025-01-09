# Task Management System API Documentation

## Core Components

### 1. Task Types and Schemas

```typescript
// Task Status and Priority Types
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// Base Task Interface
interface TaskFormData {
  title: string
  description?: string
  status: TaskStatus
  priority?: TaskPriority
  project_id?: string | null
  assignee_id?: string | null
}

// Task with Relations
interface TaskWithRelations extends TaskFormData {
  id: string
  created_at: string
  updated_at: string
  completed_at: string | null
  project?: { id: string; name: string } | null
  assignee?: { id: string; email: string; full_name?: string } | null
  parent_task?: { id: string; title: string } | null
  checklist_items?: Array<{ id: string; title: string; completed: boolean }>
  activity_log_entries?: Array<{ id: string; action: string; created_at: string }>
}
```

### 2. Task Management Hook (useTasks)

```typescript
interface UseTasksOptions {
  projectId?: string
  enabled?: boolean
  page?: number
  perPage?: number
  includeRelations?: boolean
}

function useTasks(options: UseTasksOptions) {
  return {
    tasks: TaskWithRelations[]
    totalTasks: number
    currentPage: number
    totalPages: number
    isLoading: boolean
    error: Error | null
    createTask: (data: TaskFormData) => Promise<void>
    updateTask: (task: Partial<TaskWithRelations>) => Promise<void>
    deleteTask: (taskId: string) => Promise<void>
    isCreating: boolean
    isUpdating: boolean
    isDeleting: boolean
    prefetchNextPage: () => Promise<void>
  }
}
```

### 3. Task Components

#### TaskContainer
```typescript
interface TaskContainerProps {
  projectId?: string
}

function TaskContainer(props: TaskContainerProps): JSX.Element
```

#### TaskItem
```typescript
interface TaskItemProps {
  task: TaskWithRelations
  onUpdate: (task: Partial<TaskWithRelations>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  showDetails?: boolean
}

function TaskItem(props: TaskItemProps): JSX.Element
```

#### TaskDialog
```typescript
interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormData) => Promise<void>
  taskData?: TaskWithRelations
  projectId?: string
}

function TaskDialog(props: TaskDialogProps): JSX.Element
```

## Error Handling

### ErrorBoundary Component
```typescript
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps>
```

### Error Reporting
```typescript
function captureError(error: Error, errorInfo?: ErrorInfo): void
function captureMessage(message: string, level?: SeverityLevel): void
function setUserContext(user: { id: string; email?: string }): void
```

## Theme Management

### ThemeProvider
```typescript
type Theme = 'light' | 'dark' | 'high-contrast'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element
function useTheme(): ThemeContextValue
```

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

## Usage Examples

### Basic Task List
```typescript
function TaskList() {
  const { tasks, isLoading } = useTasks()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
```

### Creating a Task
```typescript
function CreateTask() {
  const { createTask } = useTasks()
  
  const handleCreate = async (data: TaskFormData) => {
    try {
      await createTask(data)
    } catch (error) {
      // Handle error
    }
  }
  
  return <TaskDialog onSubmit={handleCreate} />
}
```

### Project Tasks with Pagination
```typescript
function ProjectTasks({ projectId }: { projectId: string }) {
  const {
    tasks,
    totalPages,
    currentPage,
    isLoading,
    prefetchNextPage
  } = useTasks({
    projectId,
    page: 1,
    perPage: 10
  })
  
  return (
    <div>
      <TaskContainer projectId={projectId} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={prefetchNextPage}
        />
      )}
    </div>
  )
}
```

## Error Handling Examples

### Using Error Boundary
```typescript
function TaskApp() {
  return (
    <ErrorBoundary>
      <TaskContainer />
    </ErrorBoundary>
  )
}
```

### Custom Error Handling
```typescript
function handleError(error: Error) {
  captureError(error)
  toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive'
  })
}
```

## Theme Usage

### Theme Toggle
```typescript
function ThemeControl() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  )
}
```

## Best Practices

1. Always wrap task components with ErrorBoundary
2. Use proper type annotations for all props and state
3. Handle loading and error states appropriately
4. Implement proper accessibility attributes
5. Use optimistic updates for better UX
6. Implement proper form validation
7. Use proper error reporting
8. Support high contrast mode
9. Ensure keyboard navigation
10. Maintain proper focus management 