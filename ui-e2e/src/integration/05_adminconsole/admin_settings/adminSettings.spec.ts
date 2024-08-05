///<reference types="cypress" />
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Admin Settings', () => {

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it('<@promote_qa> <@platform_e2e><@platform_ppd> Check all Admin modules from Get Started page', function () {
    cy.getUsers().then((users) => {
      const { username, password } = users.clientAdminUser;
      adminConsoleHelpers.loginViaUrl(username, password);
    });
    interceptsUserManagementApiCalls();
    cy.checkAllAdminModules();
    cy.verifyUsersPage_NonSSO();
  });

  if (Cypress.env('appEnv').includes('fed-qa') === true) {
    it.skip('<@platform_e2e>SSO User - Check all Admin modules from Get Started page', function () {
      cy.getUsers().then((users) => {
        const { username, password } = users.ssoClientUser;
        adminConsoleHelpers.ssoLogin(username, password);
      });
      interceptsUserManagementApiCalls();
      cy.checkAllAdminModules();
      cy.verifyUsersPage_SSO();
    });
  }

});
