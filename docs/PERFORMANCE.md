# Performance Optimization Guide

## Overview

This guide covers the performance optimization strategies implemented in the task management system:

1. Query Result Caching
2. Pagination and Infinite Loading
3. Lazy Loading of Relationships
4. Optimistic Updates
5. Component Optimization
6. Database Query Optimization

## Query Result Caching

### Basic Caching

```typescript
const { data } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  staleTime: 1000 * 60, // Cache for 1 minute
  cacheTime: 1000 * 60 * 5 // Keep in cache for 5 minutes
})
```

### Selective Caching

```typescript
const { data } = useQuery({
  queryKey: ['tasks', projectId],
  queryFn: () => fetchProjectTasks(projectId),
  enabled: !!projectId,
  staleTime: projectId ? 1000 * 30 : 1000 * 60
})
```

## Pagination

### Server-Side Pagination

```typescript
function useTasks({ page = 1, perPage = 10 }) {
  return useQuery({
    queryKey: ['tasks', page, perPage],
    queryFn: async () => {
      const from = (page - 1) * perPage
      const to = from + perPage - 1

      const { data, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .range(from, to)

      return { tasks: data, totalPages: Math.ceil(count / perPage) }
    },
    keepPreviousData: true
  })
}
```

### Prefetching Next Page

```typescript
function TaskList() {
  const { data, prefetch } = useTasks({ page })

  useEffect(() => {
    if (data?.hasMore) {
      prefetch({ page: page + 1 })
    }
  }, [data, page, prefetch])

  return (
    <div>
      {data.tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
```

## Lazy Loading

### Relationship Loading

```typescript
function useTaskRelations({ taskId, enabled = true }) {
  const { data: project } = useQuery({
    queryKey: ['task', taskId, 'project'],
    queryFn: () => fetchProject(taskId),
    enabled: enabled && !!taskId
  })

  const { data: assignee } = useQuery({
    queryKey: ['task', taskId, 'assignee'],
    queryFn: () => fetchAssignee(taskId),
    enabled: enabled && !!taskId
  })

  return { project, assignee }
}
```

### Component Loading

```typescript
const TaskDialog = dynamic(() => import('./task-dialog'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})
```

## Optimistic Updates

### Basic Optimistic Update

```typescript
const mutation = useMutation({
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
  }
})
```

### Optimistic Creation

```typescript
const createTaskMutation = useMutation({
  mutationFn: createTask,
  onMutate: async (newTask) => {
    const optimisticTask = {
      id: 'temp-' + Date.now(),
      ...newTask,
      created_at: new Date().toISOString()
    }

    queryClient.setQueryData(['tasks'], old => ({
      ...old,
      tasks: [optimisticTask, ...old.tasks]
    }))

    return { optimisticTask }
  }
})
```

## Component Optimization

### Memoization

```typescript
const TaskItem = memo(function TaskItem({ task, onUpdate }) {
  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={() => onUpdate(task)}>Update</button>
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id &&
    prevProps.task.updated_at === nextProps.task.updated_at
})
```

### Callback Optimization

```typescript
function TaskList() {
  const handleUpdate = useCallback(async (task: Task) => {
    await updateTask(task)
  }, [])

  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}
```

## Database Optimization

### Indexes

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

### Efficient Queries

```typescript
// Fetch only needed fields
const { data } = await supabase
  .from('tasks')
  .select('id, title, status')
  .eq('project_id', projectId)

// Use count estimate for large tables
const { count } = await supabase
  .from('tasks')
  .select('*', { count: 'estimated' })
```

## Loading State Optimization

### Skeleton Loading

```typescript
function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <TaskItemSkeleton key={i} />
      ))}
    </div>
  )
}

function TaskList() {
  const { data, isLoading } = useTasks()

  if (isLoading) {
    return <TaskListSkeleton />
  }

  return (
    <div>
      {data.tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
```

### Progressive Loading

```typescript
function TaskItem({ task }) {
  const [showDetails, setShowDetails] = useState(false)
  const { data: details, isLoading } = useTaskDetails(task.id, {
    enabled: showDetails
  })

  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={() => setShowDetails(true)}>
        Show Details
      </button>
      {showDetails && (
        isLoading ? <DetailsSkeleton /> : <Details data={details} />
      )}
    </div>
  )
}
```

## Best Practices

1. Implement proper caching strategies
2. Use pagination for large lists
3. Lazy load related data
4. Implement optimistic updates
5. Memoize expensive components
6. Optimize database queries
7. Add proper indexes
8. Use skeleton loading
9. Implement progressive loading
10. Monitor performance metrics 