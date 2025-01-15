# Testing Implementation Guide

## Overview
Comprehensive testing strategy for the tax practice automation system.

## Test Structure

```typescript
tests/
├── unit/                 # Unit tests
│   ├── hooks/
│   ├── components/
│   └── utils/
├── integration/          # Integration tests
│   ├── api/
│   ├── workflows/
│   └── ai/
└── e2e/                 # End-to-end tests
    ├── auth/
    ├── tax-returns/
    └── documents/
```

## Unit Tests

### Hook Testing
```typescript
// tests/unit/hooks/useTaxReturns.test.ts
import { renderHook } from '@testing-library/react'
import { useTaxReturns } from '@/hooks/useTaxReturns'

describe('useTaxReturns', () => {
  it('fetches tax returns for client', async () => {
    const { result } = renderHook(() => 
      useTaxReturns('client-id')
    )
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })

  it('handles errors correctly', async () => {
    // Mock error state
    server.use(
      rest.get('/api/tax-returns', (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    const { result } = renderHook(() => 
      useTaxReturns('client-id')
    )
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
  })
})
```

### Component Testing
```typescript
// tests/unit/components/TaxReturnList.test.tsx
import { render, screen } from '@testing-library/react'
import { TaxReturnList } from '@/components/tax/TaxReturnList'

describe('TaxReturnList', () => {
  const mockData = [
    { id: 1, year: 2023, status: 'pending' },
    { id: 2, year: 2022, status: 'completed' }
  ]

  it('renders tax returns correctly', () => {
    render(<TaxReturnList data={mockData} />)
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('handles empty state', () => {
    render(<TaxReturnList data={[]} />)
    expect(screen.getByText(/no tax returns/i)).toBeInTheDocument()
  })
})
```

## Integration Tests

### API Testing
```typescript
// tests/integration/api/tax-returns.test.ts
import { createServer } from '@/test-utils/server'

describe('Tax Returns API', () => {
  let server: any

  beforeAll(() => {
    server = createServer()
  })

  afterAll(() => {
    server.close()
  })

  it('creates tax return successfully', async () => {
    const response = await fetch('/api/tax-returns', {
      method: 'POST',
      body: JSON.stringify({
        clientId: 'test-client',
        year: 2023
      })
    })

    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.year).toBe(2023)
  })
})
```

### Workflow Testing
```typescript
// tests/integration/workflows/tax-return-workflow.test.ts
describe('Tax Return Workflow', () => {
  it('completes full tax return process', async () => {
    // 1. Create client
    const client = await createTestClient()
    
    // 2. Create tax return
    const taxReturn = await createTaxReturn(client.id)
    
    // 3. Upload documents
    const docs = await uploadDocuments(taxReturn.id)
    
    // 4. Process documents with AI
    await processDocuments(docs)
    
    // 5. Review and submit
    const submission = await submitTaxReturn(taxReturn.id)
    
    expect(submission.status).toBe('completed')
  })
})
```

## E2E Testing

### Playwright Tests
```typescript
// tests/e2e/tax-returns/create-tax-return.spec.ts
import { test, expect } from '@playwright/test'

test('create new tax return', async ({ page }) => {
  // 1. Login
  await loginUser(page)
  
  // 2. Navigate to create tax return
  await page.click('text=New Tax Return')
  
  // 3. Fill form
  await page.fill('[name="year"]', '2023')
  await page.selectOption('[name="type"]', 'individual')
  
  // 4. Submit
  await page.click('button:text("Create")')
  
  // 5. Verify
  await expect(page.locator('.status')).toHaveText('Draft')
})
```

## Performance Testing

### Load Testing
```typescript
// tests/performance/api-load.test.ts
import { check } from 'k6'
import http from 'k6/http'

export const options = {
  vus: 10,
  duration: '30s',
}

export default function() {
  const res = http.get('http://localhost:3000/api/tax-returns')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200
  })
}
```

## Security Testing

### Auth Tests
```typescript
// tests/security/auth.test.ts
describe('Authentication Security', () => {
  it('prevents unauthorized access', async () => {
    const res = await fetch('/api/protected')
    expect(res.status).toBe(401)
  })

  it('validates JWT tokens', async () => {
    const invalidToken = 'invalid.token.here'
    const res = await fetch('/api/protected', {
      headers: {
        Authorization: `Bearer ${invalidToken}`
      }
    })
    expect(res.status).toBe(401)
  })
})
```

## Test Scripts

Add to package.json:
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run src/__tests__/components",
    "test:integration": "vitest run src/__tests__/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:security": "vitest run src/__tests__/security",
    "test:performance": "k6 run tests/performance/**/*.ts"
  }
}
```

## Next Steps
After implementing testing:
1. Move to [Deployment Implementation](./05-DEPLOYMENT.md)
2. Set up CI/CD pipelines
3. Configure monitoring and alerts