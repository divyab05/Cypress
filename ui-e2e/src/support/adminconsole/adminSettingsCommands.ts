import { AnyNaptrRecord } from 'dns';
import { formControls } from '../../fixtures/adminconsole/formControls.json';
import { adminConsoleHelpers } from './adminConsoleHelpers';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    //create .d.ts definitions file to get autocomplete.
    interface Chainable<Subject> {
      checkAllAdminModules(): void;
      selectAdminModules(personalDetails: any, accessLevel: any): void;
      verifyUsersPage_NonSSO(): void;
      verifyUsersPage_SSO(): void;
    }
  }
}

Cypress.Commands.add('checkAllAdminModules', () => {
  cy.get(formControls.getStartedTab)
    .click()
    //.wait('@getSubscription')
    .get(formControls.getStartedDivision)
    .click()
    .wait('@getDivisions')
    .waitForSpinners();
  cy.selectAdminModules(formControls.addDivisionBtn, formControls.divisionLocLink);
  cy.navigateToHomePage();

  cy.get(formControls.getStartedTab)
    .should('be.visible')
    .click({ force: true })
    .get(formControls.getStartedCarrier)
    .click()
    .wait('@getUserProperties')
    .waitForSpinners();

  cy.selectAdminModules(formControls.searchBox, formControls.carrierAccountLink);
  cy.navigateToHomePage();

  cy.get(formControls.getStartedTab)
    .should('be.visible')
    .click({ force: true })
    .get(formControls.getStartedCostAcc)
    .click()
    .waitForSpinners()
    .wait('@getCostAccount');
  cy.selectAdminModules(formControls.costAccount_AddBtn, formControls.costAccountLink);
  cy.navigateToHomePage();

  cy.get(formControls.getStartedTab)
    .should('be.visible')
    .click({ force: true })
    .get(formControls.getStartedRoles)
    .click()
    .waitForSpinners()
    .wait('@getSubscriptionRoles');
  cy.selectAdminModules(formControls.addSubscriptionRoleBtn, formControls.rolesLink);
  cy.navigateToHomePage();

});

Cypress.Commands.add('selectAdminModules', (moduleBtn: any, moduleLink: any) => {
  cy.get(moduleBtn).should('be.visible').get(moduleLink).should('have.class', 'active');
});

Cypress.Commands.add('verifyUsersPage_NonSSO', () => {
  cy.get(formControls.getStartedTab)
    .should('be.visible')
    .click({ force: true })
    .get(formControls.getStartedUsers)
    .click()
    .waitForSpinners()
    .wait('@getUserByPermission');
  cy.selectAdminModules(formControls.addUserBtn, formControls.userAndAccessLink);
});

Cypress.Commands.add('verifyUsersPage_SSO', () => {
  cy.get(formControls.getStartedTab)
    .should('be.visible')
    .click({ force: true })
    .get(formControls.getStartedUsers)
    .click()
    .waitForSpinners()
    .wait('@federationMappingSSO');
  cy.wait('@getUserByPermissionSSO');
  cy.wait(1000);
  cy.xpath(formControls.addNonSSOUserButton).should('be.visible');
  cy.xpath(formControls.importNonSSOUsersButton).should('be.visible');
  cy.selectAdminModules(formControls.addUserBtn, formControls.userAndAccessLink);
});
