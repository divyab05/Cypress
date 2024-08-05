///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { SupportConsoleApi } from '../../../support/adminSupportPortal/supportConsoleApi';
import { supportInterceptApiCalls } from '../../../utils/adminSupport_portal/support_intercept_routes';

describe('Test Suite :: Support Console tests', () => {

  const clientUser = config[Cypress.env('appEnv')]['client_user'];
  const advancedUser = config[Cypress.env('appEnv')]['admin_user'];
  const basicUser = config[Cypress.env('appEnv')]['adminBasicUser'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();
  const adminSupportApi = new SupportConsoleApi(clientUser);

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    supportInterceptApiCalls();
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

  it(`<@supportconsole> Sending- Domestic USPS Shipment Report`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminSupportApi.getSubCarrierId('USPS');
    helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
    supportConsoleCommands.navigateToSupportTab();
    adminSupportApi.createDomUSPSLableAPI();
    supportConsoleCommands.searchByEmailID(clientUser.userEmail);
    supportConsoleCommands.clickSendingTab();
    supportConsoleCommands.clickSendingReportsTab('Shipments');
    supportConsoleCommands.verifyShipmentTransaction('Priority Mail');
  });

  //skipped in Fedramp due to UPS carrier is not working
  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@supportconsole> Sending- Domestic UPS Shipment Report`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      adminSupportApi.getSubCarrierId('UPS');
      helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
      supportConsoleCommands.navigateToSupportTab();
      adminSupportApi.createDomUPSLableAPI();
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('Shipments');
      supportConsoleCommands.verifyShipmentTransaction('UPS 2nd Day Air');
    });
  }

  //skipped in Fedramp due to Fedex carrier is not working
  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@supportconsole> Sending- Domestic FedEx Shipment Report`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      adminSupportApi.getSubCarrierId('FEDEX');
      helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
      supportConsoleCommands.navigateToSupportTab();
      adminSupportApi.createDomFedExLableAPI();
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('Shipments');
      supportConsoleCommands.verifyShipmentTransaction('FedEx 2Day');
    });
  }

  //skipped in Fedramp due to Shipment Refund is not supported
  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@supportconsole> Sending- Domestic USPS Shipment Refund`, function () {
      Helpers.log('------------------------------Test starts here-------------------------------');
      adminSupportApi.getSubCarrierId('USPS');
      helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
      supportConsoleCommands.navigateToSupportTab();
      adminSupportApi.createDomUSPSLableAPI();
      adminSupportApi.refundUSPSLableAPI();
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('Shipments');
      supportConsoleCommands.verifyShipmentTransaction('Refund Requested');
      supportConsoleCommands.submitRefund();
      supportConsoleCommands.verifyShipmentTransaction('Refund Approved');
    });
  }

  it(`<@supportconsole> Sending- Domestic USPS Non trackable Shipment Report`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminSupportApi.getSubCarrierId('USPS');
    helpers.loginAdminConsole(advancedUser.userEmail, advancedUser.password);
    supportConsoleCommands.navigateToSupportTab();
    adminSupportApi.nonTrackableUSPSLableAPI();
    supportConsoleCommands.searchByEmailID(clientUser.userEmail);
    supportConsoleCommands.clickSendingTab();
    supportConsoleCommands.clickSendingReportsTab('Shipments');
    supportConsoleCommands.verifyShipmentTransaction('First-Class Mail');
    supportConsoleCommands.verifyTrackingBtnDisabled();
  });

  it(`<@supportconsole> Sending- Refund buttom should not be visible for Basic user`, function () {
    if (Cypress.env('appEnv').includes('fed') === false) {
      Helpers.log('------------------------------Test starts here-------------------------------');
      adminSupportApi.getSubCarrierId('USPS');
      helpers.loginAdminConsole(basicUser.userEmail, basicUser.password);
      supportConsoleCommands.navigateToSupportTab();
      adminSupportApi.createDomUSPSLableAPI();
      adminSupportApi.refundUSPSLableAPI();
      supportConsoleCommands.searchByEmailID(clientUser.userEmail);
      supportConsoleCommands.clickSendingTab();
      supportConsoleCommands.clickSendingReportsTab('Shipments');
      supportConsoleCommands.verifyShipmentTransaction('Refund Requested');
      supportConsoleCommands.verifyRefunButtonVisibleOrNot();
    }
  });
});