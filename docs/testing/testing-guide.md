# Testing Guide

## Overview
This guide outlines our testing strategy, tools, and best practices for maintaining high-quality code in the American Dream Taxes Hub.

## Testing Stack
- **End-to-End Testing**: Playwright
- **Unit Testing**: Jest + React Testing Library
- **API Testing**: Supertest
- **Mock Service Worker**: For API mocking
- **Database Testing**: Supabase local testing

## Test Categories

### 1. End-to-End Tests
Located in `tests/e2e/*.spec.ts`

#### Key Workflows
- **Client Management**
  - Adding new clients
  - Viewing client details
  - Updating client information
  - Managing client documents

- **Project Management**
  - Creating projects from templates
  - Managing project tasks
  - Filtering and searching projects
  - Updating project status

- **Task Management**
  - Creating and assigning tasks
  - Updating task status
  - Managing task dependencies
  - Task comments and attachments

#### Running E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/client-workflows.spec.ts

# Run tests with UI
npx playwright test --ui

# Show test report
npx playwright show-report
```

### 2. Unit Tests
Located in `tests/__tests__/*.test.ts`

- Component testing
- Hook testing
- Utility function testing
- State management testing

#### Running Unit Tests
```bash
# Run all unit tests
npm run test

# Run specific test file
npm test -- client-card.test.ts

# Run tests in watch mode
npm test -- --watch
```

### 3. Integration Tests
Located in `tests/integration/*.spec.ts`

- API endpoint testing
- Database operations testing
- Authentication flow testing

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use clear, descriptive test names
- Follow the Arrange-Act-Assert pattern
- Keep tests focused and atomic

### 2. Test Data Management
- Use test fixtures for common data
- Clean up test data after tests
- Use unique identifiers for test data
- Avoid dependencies between tests

### 3. Authentication in Tests
```typescript
// Example of authentication setup
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
});
```

### 4. Selectors Best Practices
- Prefer role-based selectors
- Use data-testid for complex cases
- Follow accessibility best practices
- Keep selectors maintainable

```typescript
// Good selectors
await page.getByRole('button', { name: 'New Project' });
await page.getByLabel('Project Name');
await page.getByText('Project created successfully');

// Avoid
await page.locator('#submit-btn');
await page.locator('.form-input');
```

### 5. Error Handling
- Test error states
- Verify error messages
- Test form validation
- Handle loading states

```typescript
test('should handle API errors', async ({ page }) => {
  // Simulate error
  await page.route('**/api/projects**', (route) => 
    route.fulfill({ status: 500, body: 'Server error' })
  );
  
  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(page.getByText('Failed to refresh projects')).toBeVisible();
});
```

## Common Testing Patterns

### 1. Form Testing
```typescript
test('should create new project', async ({ page }) => {
  await page.getByRole('button', { name: 'New Project' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  
  // Fill form
  await page.getByLabel('Project Name').fill('Test Project');
  await page.getByLabel('Description').fill('Test Description');
  await page.getByRole('combobox', { name: 'Client' }).click();
  await page.getByRole('option').first().click();
  
  // Submit and verify
  await page.getByRole('button', { name: 'Create Project' }).click();
  await expect(page.getByText('Test Project')).toBeVisible();
});
```

### 2. List Operations
```typescript
test('should filter and sort list', async ({ page }) => {
  // Apply filters
  await page.getByRole('button', { name: 'Filter' }).click();
  await page.getByRole('combobox', { name: 'Status' }).click();
  await page.getByRole('option', { name: 'In Progress' }).click();
  
  // Sort
  await page.getByRole('button', { name: 'Sort by Date' }).click();
  
  // Verify results
  await expect(page.getByTestId('filtered-count')).toContainText('5 items');
});
```

### 3. Real-time Updates
```typescript
test('should update in real-time', async ({ page, context }) => {
  // Open second page
  const page2 = await context.newPage();
  await page2.goto('http://localhost:3000/projects');
  
  // Make change in first page
  await page.getByRole('button', { name: 'New Project' }).click();
  await page.getByLabel('Project Name').fill('Real-time Test');
  await page.getByRole('button', { name: 'Create Project' }).click();
  
  // Verify update in second page
  await expect(page2.getByText('Real-time Test')).toBeVisible();
});
```

## Debugging Tests

### 1. Visual Debugging
```bash
# Run with headed browser
npx playwright test --headed

# Debug specific test
npx playwright test -g "should create project" --debug
```

### 2. Screenshots and Videos
```typescript
test('complex workflow', async ({ page }) => {
  // Take screenshot at key points
  await page.screenshot({ path: 'tests/screenshots/before-action.png' });
  
  // After important action
  await page.screenshot({ path: 'tests/screenshots/after-action.png' });
});
```

### 3. Trace Viewer
```bash
# Record traces
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Continuous Integration
- Tests run on every pull request
- Required for merge approval
- Automated test reports
- Performance monitoring
