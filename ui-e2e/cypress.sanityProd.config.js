const { defineConfig } = require('cypress')
const baseConfig = require('ui-e2e/cypress.config.js');

module.exports = defineConfig({
  extends: './cypress.config.js',
  projectId: "k2uu5b",
  key: "0ff04977-ca76-41c0-88cf-b8193f10eaad",
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/plugins/index.js')(on, config)
    },
    testIsolation: false,
    specPattern: './src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
  },
})
