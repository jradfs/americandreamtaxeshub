# Component Usage Guide

## Task Management Components

### TaskContainer

The `TaskContainer` is the main component for displaying and managing tasks. It handles task creation, updates, and deletion.

```tsx
// Basic usage
<TaskContainer />

// With project filtering
<TaskContainer projectId="project-123" />
```

Features:
- Displays a list of tasks with pagination
- Provides task creation functionality
- Handles task updates and deletions
- Supports showing/hiding task details
- Includes loading and error states
- Implements keyboard navigation
- Supports high contrast mode

### TaskItem

The `TaskItem` component displays individual task information and provides task management actions.

```tsx
// Basic usage
<TaskItem
  task={task}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>

// With details view
<TaskItem
  task={task}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  showDetails={true}
/>
```

Features:
- Displays task title and description
- Shows task status and priority
- Provides quick status toggle
- Includes edit and delete actions
- Shows task relationships when details are enabled
- Supports keyboard navigation
- Implements proper ARIA labels

### TaskDialog

The `TaskDialog` component provides a form for creating and editing tasks.

```tsx
// Create task dialog
<TaskDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleCreate}
/>

// Edit task dialog
<TaskDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleUpdate}
  taskData={existingTask}
/>

// With project context
<TaskDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleCreate}
  projectId="project-123"
/>
```

Features:
- Form validation with Zod
- Proper error handling
- Accessible form controls
- Support for keyboard navigation
- Loading state handling
- Error state handling
- Focus management

## Error Handling Components

### ErrorBoundary

The `ErrorBoundary` component catches JavaScript errors and displays a fallback UI.

```tsx
// Basic usage
<ErrorBoundary>
  <TaskContainer />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={<CustomErrorComponent />}
>
  <TaskContainer />
</ErrorBoundary>
```

Features:
- Catches JavaScript errors
- Prevents app crashes
- Reports errors to Sentry
- Provides error recovery
- Supports custom fallback UI

## Theme Components

### ThemeProvider

The `ThemeProvider` component manages the application theme state.

```tsx
// Basic usage
<ThemeProvider>
  <App />
</ThemeProvider>
```

Features:
- Manages theme state
- Supports light/dark modes
- Implements high contrast mode
- Persists theme preference
- Respects system preferences

### ThemeToggle

The `ThemeToggle` component provides a button to switch between themes.

```tsx
// Basic usage
<ThemeToggle />
```

Features:
- Toggles between themes
- Shows current theme
- Provides keyboard support
- Includes proper ARIA labels
- Supports high contrast mode

## Best Practices

### Error Handling

Always wrap components that can throw errors with ErrorBoundary:

```tsx
function TaskPage() {
  return (
    <ErrorBoundary>
      <TaskContainer />
    </ErrorBoundary>
  )
}
```

### Loading States

Handle loading states appropriately:

```tsx
function TaskList() {
  const { tasks, isLoading } = useTasks()

  if (isLoading) {
    return <TaskItemSkeleton count={3} />
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
```

### Error States

Handle error states properly:

```tsx
function TaskList() {
  const { tasks, error } = useTasks()

  if (error) {
    return (
      <Alert variant="destructive">
        Failed to load tasks: {error.message}
      </Alert>
    )
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
```

### Accessibility

Ensure proper accessibility attributes:

```tsx
function TaskAction({ task }) {
  return (
    <Button
      onClick={handleAction}
      aria-label={`Complete task: ${task.title}`}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? 'Processing...' : 'Complete'}
    </Button>
  )
}
```

### Theme Support

Support all theme modes:

```tsx
function CustomComponent() {
  const { theme } = useTheme()

  return (
    <div className={theme === 'high-contrast' ? 'high-contrast-styles' : ''}>
      {/* Component content */}
    </div>
  )
}
```

### Form Validation

Implement proper form validation:

```tsx
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
            <FormMessage id="title-error" />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### Keyboard Navigation

Support keyboard navigation:

```tsx
function TaskItem() {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAction()
    }
  }

  return (
    <div
      role="listitem"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Item content */}
    </div>
  )
}
``` 