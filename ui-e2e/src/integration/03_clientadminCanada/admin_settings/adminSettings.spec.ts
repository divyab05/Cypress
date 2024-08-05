///<reference types="cypress" />
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Admin Settings', () => {
  beforeEach(() => {
    cy.getUsers().then((users) => {
      const { username, password } = users.canadaUser;
      adminConsoleHelpers.loginViaUrl(username, password);
    });
    interceptsUserManagementApiCalls();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it('<@platform_e2e><@platform_ppd> Check all Admin modules from Get Started page', function () {
    cy.checkAllAdminModules();
  });
});
