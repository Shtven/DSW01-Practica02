const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
  },
  video: false,
  screenshotOnRunFailure: true,
  env: {
    apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:8080',
    username: process.env.CYPRESS_USERNAME || 'admin@example.com',
    password: process.env.CYPRESS_PASSWORD || 'admin123',
  },
});
