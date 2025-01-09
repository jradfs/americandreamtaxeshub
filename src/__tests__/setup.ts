import '@testing-library/jest-dom'
import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { setupTestAuth, cleanupTestData } from './test-env'

// Extend Vitest's expect method
expect.extend(matchers)

// Set up authentication before all tests
beforeAll(async () => {
  await setupTestAuth()
})

// Clean up after each test
afterEach(async () => {
  cleanup()
  await cleanupTestData()
})

// Clean up after all tests
afterAll(async () => {
  await cleanupTestData()
}) 