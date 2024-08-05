///<reference types="cypress" />

import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { supportInterceptApiCalls } from '../../../utils/adminSupport_portal/support_intercept_routes';

describe('Test Suite :: Support Console tests', () => {

  const clientUser = config[Cypress.env('appEnv')]['client_user'];
  const userProfileTestData = config[Cypress.env('appEnv')]['userProfile_TestData'];
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    helpers.loginAdminConsole(user.userEmail, user.password);
    supportConsoleCommands.navigateToSupportTab();
    supportInterceptApiCalls();
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
  });

  after(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it(`<@supportconsole>User Profile - Search By All types`, function () {
    supportConsoleCommands.selectSearchByDropdown('User ID', userProfileTestData.userId);
    supportConsoleCommands.verifysearchByOktaID(userProfileTestData.userId);

    supportConsoleCommands.selectSearchByDropdown('Email ID', userProfileTestData.emailId);
    supportConsoleCommands.verifysearchByEmailID(userProfileTestData.emailId);

    supportConsoleCommands.selectSearchByDropdown('Enterprise Name', userProfileTestData.enterpriseName);
    supportConsoleCommands.verifySearchByEnterpriseName();

    supportConsoleCommands.selectSearchByDropdown('Subscription ID', userProfileTestData.subscriptionId);
    supportConsoleCommands.verifysearchByBPNSubsc(userProfileTestData.bPN);
    supportConsoleCommands.verifysearchByEmailID(userProfileTestData.emailId);

    supportConsoleCommands.selectSearchByDropdown('BPN', userProfileTestData.bPN);
    supportConsoleCommands.verifysearchByBPNSubsc(userProfileTestData.bPN);
    supportConsoleCommands.verifysearchByEmailID(userProfileTestData.bpnUserId);
    
    supportConsoleCommands.selectSearchByDropdown('Device ID', userProfileTestData.deviceId);
    supportConsoleCommands.verifysearchByEmailID(userProfileTestData.deviceIdOwner);
    
  });

  if (Cypress.env('appEnv').includes('fed') === true){
  it(`<@supportconsole>SendPro Mailstation, Postage and Spoiled Postage Tabs should not be present in Fedramp`, function () {
    supportConsoleCommands.selectSearchByDropdown('Email ID', userProfileTestData.emailId);
    supportConsoleCommands.verifysearchByEmailID(userProfileTestData.emailId);
    supportConsoleCommands.clickSendingTab();
    supportConsoleCommands.verifySendingSubTabNotPresentInUI('SendPro Mailstation');
    supportConsoleCommands.verifySendingSubTabNotPresentInUI('Postage');
    supportConsoleCommands.verifySendingSubTabNotPresentInUI('Spoiled Postage');
    cy.get('a[role="tab"]').should('have.length', 3);
    supportConsoleCommands.verifyFraudAlertTabIsVisibleOrNot();
  });
}

  it(`<@supportconsole>Verify Subtabs under Sending are loading fine in UI`, function () {
    supportConsoleCommands.selectSearchByDropdown('Email ID', userProfileTestData.emailId);
    supportConsoleCommands.verifysearchByEmailID(userProfileTestData.emailId);
    supportConsoleCommands.clickSendingTab();
    if (Cypress.env('appEnv').includes('fed') === false){
    supportConsoleCommands.clickSendingReportsTab('SendPro Mailstation');
    cy.get('#daterange-button').should('be.visible');
    cy.get('span[class="sbl-circ"]').should('have.length', 0);
    supportConsoleCommands.clickSendingReportsTab('Postage');
    cy.get('#daterange-button').should('be.visible');
    cy.get('span[class="sbl-circ"]').should('have.length', 0);
    supportConsoleCommands.clickSendingReportsTab('Spoiled Postage');
    cy.get('#daterange-button').should('be.visible');
    cy.get('span[class="sbl-circ"]').should('have.length', 0);
    }
    supportConsoleCommands.clickSendingReportsTab('Shipments');
    cy.get('#daterange-button').should('be.visible');
    cy.get('span[class="sbl-circ"]').should('have.length', 0);
    supportConsoleCommands.clickSendingReportsTab('Proof Of Delivery');
    cy.get('#daterange-button').should('be.visible');
    cy.get('span[class="sbl-circ"]').should('have.length', 0);
    supportConsoleCommands.clickSendingReportsTab('USPS Stamps');
    cy.get('#daterange-button').should('be.visible');
    cy.get('span[class="sbl-circ"]').should('have.length', 0);
    
    
  });

});