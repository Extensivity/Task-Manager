const nextJest = require('next/jest');
const path = require('path');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: './',
});

const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': path.resolve(__dirname, './src/$1'),
  }
};

module.exports = createJestConfig(config);
