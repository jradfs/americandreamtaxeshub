import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => {
  // Start MSW server
  server.listen();
});

afterEach(() => {
  // Reset handlers between tests
  server.resetHandlers();
});

afterAll(() => {
  // Clean up
  server.close();
});
