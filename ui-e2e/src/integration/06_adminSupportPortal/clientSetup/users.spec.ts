///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';

describe('Test Suite :: Support Console tests', () => {

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

  it(`<@supportconsole>TC001 - Client Setup - Search and Verify Users`, function () {
    helpers.loginAdminConsole(basicUser.userEmail, basicUser.password);
    supportConsoleCommands.navigateToSupportTab();
    supportConsoleCommands.selectSearchByDropdown('Email ID', clientUser.userEmail);
    supportConsoleCommands.navigateToClientSetupTab();
    supportConsoleCommands.selectSubtabUnderClientSetup(SupportConsoleCommands.USERS);
    supportConsoleCommands.searchUsersExist(clientUser.userName);
  });

});