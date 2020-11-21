module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@vesselize/(.*?)$': '<rootDir>/packages/$1/src',
    vesselize: '<rootDir>/packages/vesselize/src',
  },
  testMatch: ['<rootDir>/packages/**/tests/**/*spec.[jt]s?(x)'],
};
