module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/index.{ts,tsx}',
    '!**/__tests__/**',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
    '<rootDir>/__tests__/jest.setup.js',
  ],
};
