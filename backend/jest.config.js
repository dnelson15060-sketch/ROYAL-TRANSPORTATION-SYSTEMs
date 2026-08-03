module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: ['src/**/*.js', '!src/config/firebase.js'],
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/**/*.test.js'],
};
