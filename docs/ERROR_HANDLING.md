# Error Handling Guide

## Overview

This guide covers the error handling strategies implemented in the task management system. The system uses a multi-layered approach to handle errors:

1. Error Boundaries for React component errors
2. Try-catch blocks for async operations
3. Sentry integration for error reporting
4. Toast notifications for user feedback
5. Fallback UI components
6. Error recovery mechanisms

## Error Boundaries

### Basic Usage

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

function TaskPage() {
  return (
    <ErrorBoundary>
      <TaskContainer />
    </ErrorBoundary>
  )
}
```

### Custom Fallback UI

```tsx
function CustomFallback({ error }: { error: Error }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  )
}

function TaskPage() {
  return (
    <ErrorBoundary fallback={<CustomFallback />}>
      <TaskContainer />
    </ErrorBoundary>
  )
}
```

## Error Reporting

### Setup

```typescript
// Initialize error reporting
import { initErrorReporting } from '@/lib/error-reporting'

initErrorReporting()
```

### Capturing Errors

```typescript
import { captureError, captureMessage } from '@/lib/error-reporting'

// Capture error with additional context
try {
  await createTask(data)
} catch (error) {
  captureError(error, {
    componentStack: 'TaskDialog > CreateTask',
    message: 'Failed to create task'
  })
}

// Capture informational message
captureMessage('User attempted to create invalid task', 'info')
```

### User Context

```typescript
import { setUserContext } from '@/lib/error-reporting'

// Set user context for better error tracking
setUserContext({
  id: 'user-123',
  email: 'user@example.com'
})
```

## Async Error Handling

### Component Level

```typescript
function TaskList() {
  const [error, setError] = useState<Error | null>(null)

  const handleCreate = async (data: TaskFormData) => {
    try {
      await createTask(data)
      toast({
        title: 'Success',
        description: 'Task created successfully'
      })
    } catch (error) {
      setError(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  return <TaskForm onSubmit={handleCreate} />
}
```

### Hook Level

```typescript
function useTasks() {
  const handleError = (error: Error) => {
    captureError(error)
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive'
    })
  }

  const mutation = useMutation({
    mutationFn: createTask,
    onError: handleError
  })

  return {
    createTask: mutation.mutateAsync,
    error: mutation.error
  }
}
```

## Form Validation Errors

### Zod Schema Validation

```typescript
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
})

function TaskForm() {
  const form = useForm({
    resolver: zodResolver(taskSchema)
  })

  return (
    <Form {...form}>
      <FormField
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                aria-invalid={!!form.formState.errors.title}
                aria-describedby="title-error"
              />
            </FormControl>
            <FormMessage id="title-error" role="alert" />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

## Network Error Handling

### API Calls

```typescript
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    captureError(error)
    throw new Error('Failed to fetch tasks. Please try again later.')
  }
}
```

### Supabase Error Handling

```typescript
async function createTask(data: TaskFormData) {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert(data)
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('A task with this title already exists')
    }
    throw error
  }

  return task
}
```

## Error Recovery

### Optimistic Updates

```typescript
const updateTaskMutation = useMutation({
  mutationFn: updateTask,
  onMutate: async (newTask) => {
    await queryClient.cancelQueries(['tasks'])
    const previousTasks = queryClient.getQueryData(['tasks'])
    
    queryClient.setQueryData(['tasks'], old => ({
      ...old,
      tasks: old.tasks.map(task =>
        task.id === newTask.id ? { ...task, ...newTask } : task
      )
    }))
    
    return { previousTasks }
  },
  onError: (err, newTask, context) => {
    queryClient.setQueryData(['tasks'], context.previousTasks)
    toast({
      title: 'Error',
      description: 'Failed to update task. Changes have been reverted.'
    })
  }
})
```

### Retry Logic

```typescript
const { data } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
})
```

## Best Practices

1. Always wrap top-level components with ErrorBoundary
2. Use proper error reporting with context
3. Implement proper form validation
4. Handle network errors gracefully
5. Provide clear error messages to users
6. Implement error recovery mechanisms
7. Use optimistic updates with proper rollback
8. Add retry logic for transient failures
9. Maintain proper error state management
10. Ensure proper accessibility for error messages 