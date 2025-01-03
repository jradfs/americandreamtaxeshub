import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      message: () => `expected ${received} to be in the document`,
      pass,
    };
  },
});

// Mock the window.fetch function
global.fetch = jest.fn();
