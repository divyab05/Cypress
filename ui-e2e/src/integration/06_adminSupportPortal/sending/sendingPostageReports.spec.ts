///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { SupportConsoleApi } from '../../../support/adminSupportPortal/supportConsoleApi';

describe('Test Suite :: Support Console tests', () => {

  const clientUser = config[Cypress.env('appEnv')]['client_user'];
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();
  const supportConsoleApi = new SupportConsoleApi(clientUser);

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    helpers.loginAdminConsole(user.userEmail, user.password);
    supportConsoleCommands.navigateToSupportTab();
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    helpers.closeModal();
  });

  after(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });
  //skipped in Fedramp due to Add Postage is not supported
  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@supportconsole>Sending- Postage Report`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      var postageValue = supportConsoleCommands.generatePostageValue();
      supportConsoleApi.addPostageAPI(postageValue);
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('Postage');
      supportConsoleCommands.verifyPostageTransaction(postageValue);
    });
  }
});