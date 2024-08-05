///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';

//Skipped the test case due to the existing bug - https://jira.pitneycloud.com/browse/SPSS-2825
describe.skip('Test Suite :: Support Console tests', () => {

  const clientUser = config[Cypress.env('appEnv')]['client_user'];
  const advancedUser = config[Cypress.env('appEnv')]['admin_user'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
    supportConsoleCommands.navigateToSupportTab();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
    Helpers.log('------------------------------Test ends here-------------------------------');
  });
  
  it(`<@supportconsole>TC001 - Fraud Alerts - Verify Fraud Alert Tab is visible for PSP users`, function () {
    supportConsoleCommands.selectSearchByDropdown('Email ID', clientUser.userEmail);
    supportConsoleCommands.verifyFraudAlertTabIsVisibleOrNot();
  });

});