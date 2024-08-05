const {
  defineConfig
} = require('cypress');

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
retries: 1,
projectId: 'sfva8t',
key: '3d8314b3-0287-43bb-be89-6b95f51696d4',
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
