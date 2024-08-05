const {defineConfig} = require('cypress');

module.exports = defineConfig({
  watchForFileChanges: false,
  acceptSslCerts: true,
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 60000,
  responseTimeout: 60000,
  requestTimeout: 60000,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: '../dist/cypress/videos',
  screenshotsFolder: '../dist/cypress/screenshots',
  downloadsFolder: './src/downloads',
  chromeWebSecurity: true,
  scrollBehavior: 'center',
  reporter: '../../node_modules/cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  viewportWidth: 1280,
  viewportHeight: 768,
  retries: 1,
  projectId: 'txm61o',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/plugins/index.js')(on, config)
    },
    testIsolation: false,
    specPattern: './src/integration/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
  },
});
