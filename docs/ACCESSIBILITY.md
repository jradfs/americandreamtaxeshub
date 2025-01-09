# Accessibility Guide

## Overview

This guide covers the accessibility features and best practices implemented in the task management system. The application follows WCAG 2.1 guidelines and supports:

1. Keyboard Navigation
2. Screen Readers
3. High Contrast Mode
4. Focus Management
5. ARIA Labels
6. Semantic HTML

## Keyboard Navigation

### Focus Management

```typescript
function TaskItem() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Restore focus after action
  const handleAction = async () => {
    await performAction()
    buttonRef.current?.focus()
  }

  return (
    <div
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleAction()
      }}
    >
      <button ref={buttonRef}>Action</button>
    </div>
  )
}
```

### Keyboard Shortcuts

```typescript
function TaskList() {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        openCreateDialog()
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [])

  return <div>/* Component content */</div>
}
```

## Screen Reader Support

### ARIA Labels

```typescript
function TaskItem({ task }) {
  return (
    <div
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      <button
        onClick={handleComplete}
        aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
      >
        {task.completed ? 'Completed' : 'Complete'}
      </button>
    </div>
  )
}
```

### Live Regions

```typescript
function TaskList() {
  return (
    <div>
      <div aria-live="polite" role="status">
        {isLoading ? 'Loading tasks...' : `${tasks.length} tasks found`}
      </div>
      {/* Task list */}
    </div>
  )
}
```

## High Contrast Mode

### Theme Support

```typescript
function App() {
  const { theme } = useTheme()

  return (
    <div data-theme={theme}>
      <ThemeProvider>
        <TaskList />
      </ThemeProvider>
    </div>
  )
}
```

### Color Contrast

```css
[data-theme="high-contrast"] {
  --background: #000000;
  --foreground: #ffffff;
  --primary: #ffff00;
  --error: #ff0000;
  --success: #00ff00;
}

[data-theme="high-contrast"] .button {
  background-color: var(--foreground);
  color: var(--background);
  border: 2px solid var(--foreground);
}
```

## Form Accessibility

### Form Labels

```typescript
function TaskForm() {
  return (
    <form aria-label="Create task form">
      <div>
        <label htmlFor="title" className="sr-only">
          Task title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
        />
        {errors.title && (
          <div id="title-error" role="alert">
            {errors.title.message}
          </div>
        )}
      </div>
    </form>
  )
}
```

### Error Messages

```typescript
function FormField({ name, label, error }) {
  const id = `${name}-input`
  const errorId = `${name}-error`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <div id={errorId} role="alert" className="error">
          {error.message}
        </div>
      )}
    </div>
  )
}
```

## Dialog Accessibility

### Modal Dialogs

```typescript
function TaskDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <h2 id="dialog-title">Create Task</h2>
      <p id="dialog-description">
        Fill out the form below to create a new task.
      </p>
      <form>
        {/* Form fields */}
      </form>
    </Dialog>
  )
}
```

### Focus Trap

```typescript
function TaskDialog() {
  const [open, setOpen] = useState(false)
  const initialFocusRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      initialFocus={initialFocusRef}
    >
      <input ref={initialFocusRef} />
      {/* Dialog content */}
    </Dialog>
  )
}
```

## Loading States

### Loading Indicators

```typescript
function TaskList() {
  return (
    <div>
      {isLoading ? (
        <div
          role="status"
          aria-label="Loading tasks"
        >
          <Spinner aria-hidden="true" />
          <span className="sr-only">Loading tasks...</span>
        </div>
      ) : (
        <div role="list">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Progress Updates

```typescript
function TaskProgress({ progress }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

## Best Practices

### Semantic HTML

```typescript
function TaskLayout() {
  return (
    <main>
      <header>
        <h1>Task Management</h1>
        <nav aria-label="Main navigation">
          {/* Navigation items */}
        </nav>
      </header>
      <section aria-label="Task list">
        <TaskList />
      </section>
      <aside aria-label="Task details">
        <TaskDetails />
      </aside>
      <footer>
        {/* Footer content */}
      </footer>
    </main>
  )
}
```

### Skip Links

```typescript
function Layout() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      <header>{/* Header content */}</header>
      <main id="main-content" tabIndex={-1}>
        {/* Main content */}
      </main>
    </>
  )
}
```

### Focus Styles

```css
/* Never hide focus styles */
:focus {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

/* High contrast focus styles */
[data-theme="high-contrast"] :focus {
  outline: 3px solid var(--focus-color);
  outline-offset: 3px;
}

/* Focus visible only */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

## Testing

### Accessibility Testing

```typescript
describe('TaskList', () => {
  it('should be navigable by keyboard', () => {
    cy.mount(<TaskList />)
    cy.findByRole('list').should('exist')
    cy.findAllByRole('listitem').first().focus()
    cy.realPress('Tab')
    cy.focused().should('have.attr', 'aria-label')
  })

  it('should announce status changes', () => {
    cy.mount(<TaskList />)
    cy.findByRole('status').should('contain', 'Loading tasks')
    cy.findByRole('status').should('contain', '5 tasks found')
  })
})
```

## Checklist

1. Ensure proper heading hierarchy
2. Add alt text to all images
3. Use semantic HTML elements
4. Implement keyboard navigation
5. Add ARIA labels where needed
6. Support screen readers
7. Maintain focus management
8. Provide error feedback
9. Support high contrast mode
10. Test with accessibility tools 