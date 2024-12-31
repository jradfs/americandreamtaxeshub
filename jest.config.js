import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

export default createJestConfig(customJestConfig);
