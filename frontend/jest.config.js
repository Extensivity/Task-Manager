const nextJest = require('next/jest')
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: './',
})
 
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
}

module.exports = createJestConfig(config)
