///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';

//Skipped due to the existing bug -https://jira.pitneycloud.com/browse/SPSS-2826
describe.skip('Test Suite :: Support Console tests', () => {

  const clientUser = config[Cypress.env('appEnv')]['client_user'];
  const advancedUser = config[Cypress.env('appEnv')]['admin_user'];
  const basicUser = config[Cypress.env('appEnv')]['adminBasicUser'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
    Helpers.log('------------------------------Test ends here-------------------------------');
  });

  it(`<@supportconsole>TC001 - Client Setup - Edit Division Icon should not be visible for Support Basic Admin `, function () {
    helpers.loginAdminConsole(basicUser.userEmail, basicUser.password);
    supportConsoleCommands.navigateToSupportTab();
    supportConsoleCommands.selectSearchByDropdown('Email ID', clientUser.userEmail);
    supportConsoleCommands.navigateToClientSetupTab();
    supportConsoleCommands.verifyDivisionAndLocationForSupportUsers(SupportConsoleCommands.BASIC_USER);
  });

  it(`<@supportconsole>TC002 - Client Setup- Edit Division Icon should be visible for Support Advanced Admin`, function () {
    helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
    supportConsoleCommands.navigateToSupportTab();
    supportConsoleCommands.selectSearchByDropdown('Email ID', clientUser.userEmail);
    supportConsoleCommands.navigateToClientSetupTab();
    supportConsoleCommands.verifyDivisionAndLocationForSupportUsers(SupportConsoleCommands.ADVANCED_USER);
  });

});