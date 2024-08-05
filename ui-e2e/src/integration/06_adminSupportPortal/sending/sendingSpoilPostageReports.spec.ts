///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { SupportConsoleApi } from '../../../support/adminSupportPortal/supportConsoleApi';
import { supportInterceptApiCalls } from '../../../utils/adminSupport_portal/support_intercept_routes';

//Skipped due to Spoil is not present in Fedramp
if (Cypress.env('appEnv').includes('fed') === false) {
  describe('Test Suite :: Support Console tests', () => {

    const clientUser = config[Cypress.env('appEnv')]['client_user'];
    const user = config[Cypress.env('appEnv')]['admin_user'];
    const supportConsoleCommands = new SupportConsoleCommands();
    const helpers = new Helpers();
    const supportConsoleApi = new SupportConsoleApi(clientUser);
    var stampSheetNo;

    before(() => {
      stampSheetNo = supportConsoleApi.generateStampSheetNumber();
    });

    beforeEach(() => {
      helpers.loginAdminConsole(user.userEmail, user.password);
      Helpers.log('------------------------------Test is starting here-------------------------------');
      supportConsoleCommands.navigateToSupportTab();
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

    it(`<@supportconsole>Sending- USPS Spoiled postage Stamp Sheet Report`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      supportConsoleApi.getSubCarrierId('USPS');
      supportConsoleApi.stampStatus(stampSheetNo, 'single');
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('USPS Stamps');
      supportConsoleCommands.spoilStampTransaction();
    });

    it(`<@supportconsole>Sending- USPS Multiple Spoiled postage Stamp Sheet Report`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      supportConsoleApi.getSubCarrierId('USPS');
      supportConsoleApi.stampStatus(stampSheetNo, 'multi');
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('USPS Stamps');
      supportConsoleCommands.spoilMultiStampTransaction();
    });
  });
}