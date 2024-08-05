///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { SupportConsoleApi } from '../../../support/adminSupportPortal/supportConsoleApi';

describe('Test Suite :: Support Console tests', () => {

  const err_user = config[Cypress.env('appEnv')]['err_user'];
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();
  const supportApi = new SupportConsoleApi(err_user);

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


  it.skip(`<@supportconsole>Sending- Proof of Delivery Report`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    var trackingNumber = supportApi.createERRLableAPI();
    supportConsoleCommands.searchByEmailID(err_user.userEmail);
    supportConsoleCommands.clickSendingTab();
    supportConsoleCommands.clickSendingReportsTab('Proof Of Delivery');
    supportConsoleCommands.verifyProofOfDeliveryTransaction(trackingNumber);
  });
});