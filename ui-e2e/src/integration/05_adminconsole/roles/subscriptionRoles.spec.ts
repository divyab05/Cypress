///<reference types="cypress" />
import { interceptsSubscrionRolesApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Roles', () => {
  beforeEach(() => {
    if (Cypress.env('appEnv').includes('fed') === true) {
      cy.getUsers().then((users) => {
        const { username, password } = users.noTrackingPlanUser;
        adminConsoleHelpers.loginViaUrl(username, password);
      });
    } else {
      cy.getUsers().then((users) => {
        const { username, password } = users.allPlanUser;
        adminConsoleHelpers.loginViaUrl(username, password);
      });
    }
    cy.navigateToCostAccountPage();
    interceptsSubscrionRolesApiCalls();
    cy.navigateToRolesPage();
    cy.wait(1000);
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it('<@promote_qa @platform_e2e><@platform_ppd>Tc001- Add new subscription role', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueRoleName = `AutoRole${uuidGenerator()}`;
    cy.deleteSearchedRoleIfMoreThanOne("AutoRole");
    cy.addSubscriptionRole(uniqueRoleName);
    cy.searchSubscriptionRole(uniqueRoleName);
    cy.verifyRoleAddedInGrid(uniqueRoleName);
    cy.deleteSubscriptionRole();
  });

  it('<@platform_e2e><@platform_ppd>TC002 - Validate ADMIN and USER ROLE should not have edit and delete icon', function () {
    cy.searchSubscriptionRole('ADMIN');
    cy.verifyDuplicateIconPresent();
    cy.verifyOverviewIconPresent();
    cy.verifyEditIconNotPresent();
    cy.verifyDeleteIconNotPresent();
    cy.searchSubscriptionRole('USER');
    cy.verifyDuplicateIconPresent();
    cy.verifyOverviewIconPresent();
    //cy.verifyEditIconNotPresent();
    cy.verifyDeleteIconNotPresent();
  });

  it('<@platform_e2e>TC003 - Verify whether user can create duplicate role by clicking on duplicate icon without changing the name', function () {
    cy.searchSubscriptionRole('ADMIN');
    cy.clickOnDuplicateIcon();
    cy.validateDuplicateSubscriptionRoleAlert('ADMIN');
  });

  //Skipped due to the existing bug - https://jira.pitneycloud.com/browse/SPSS-3327
  it.skip('<@platform_e2e>TC004 - Verify whether user can create duplicate role by clicking on duplicate icon by chaning the name', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    cy.searchSubscriptionRole('ADMIN');
    cy.clickOnDuplicateIcon();
    cy.editRoleName(uniqueName);
    cy.clickOnSaveAndCloseButtonInEditRole();
  });

});