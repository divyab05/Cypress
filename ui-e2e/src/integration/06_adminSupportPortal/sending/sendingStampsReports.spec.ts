///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { SupportConsoleApi } from '../../../support/adminSupportPortal/supportConsoleApi';
import { supportInterceptApiCalls } from '../../../utils/adminSupport_portal/support_intercept_routes';

describe('Test Suite :: Support Console tests', () => {

  const clientUser = config[Cypress.env('appEnv')]['client_user'];
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const advancedUser = config[Cypress.env('appEnv')]['admin_user'];
  const basicUser = config[Cypress.env('appEnv')]['adminBasicUser'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();
  const supportConsoleApi = new SupportConsoleApi(clientUser);
  var stampSheetNo;

  before(() => {
    stampSheetNo = supportConsoleApi.generateStampSheetNumber();
  });

  beforeEach(() => {

    Helpers.log('------------------------------Test is starting here-------------------------------');
    supportInterceptApiCalls();
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    helpers.closeModal();
  });

  after(() => {
    supportConsoleApi.deleteStampSheet(stampSheetNo);
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it(`<@supportconsole>TC001 - Sending- USPS Stamp Sheet Report`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    supportConsoleApi.getSubCarrierId('USPS');
    helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
    supportConsoleCommands.navigateToSupportTab();
    supportConsoleApi.stampStatus(stampSheetNo, 'single');
    supportConsoleCommands.searchByEmailID(clientUser.userEmail);
    supportConsoleCommands.clickSendingTab();
    supportConsoleCommands.clickSendingReportsTab('USPS Stamps');
    supportConsoleCommands.verifyStampTransaction(stampSheetNo);
  });

  it(`<@supportconsole>TC002 - Sending- USPS Multiple Stamp Sheet Report`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    supportConsoleApi.getSubCarrierId('USPS');
    helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
    supportConsoleCommands.navigateToSupportTab();
    supportConsoleApi.stampStatus(stampSheetNo, 'multi');
    supportConsoleCommands.searchByEmailID(clientUser.userEmail);
    supportConsoleCommands.clickSendingTab();
    supportConsoleCommands.clickSendingReportsTab('USPS Stamps');
    supportConsoleCommands.verifyMultiStampTransaction(stampSheetNo);
  });

  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@supportconsole>TC003 - Sending- Spoil Stamp button should not be visible for Basic Admin`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      supportConsoleApi.getSubCarrierId('USPS');
      helpers.loginAdminConsole(basicUser.userEmail, basicUser.password);
      supportConsoleCommands.navigateToSupportTab();
      supportConsoleApi.stampStatus(stampSheetNo, 'single');
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('USPS Stamps');
      supportConsoleCommands.verifySpoilStampVisibleOrNot();
    });
  }
});