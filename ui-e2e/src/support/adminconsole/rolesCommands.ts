import { formControls } from '../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../helpers';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    //create .d.ts definitions file to get autocomplete.
    interface Chainable<Subject> {
      navigateToRolesPage(): void;
      addSubscriptionRole(uniqueName: any): void;
      verifyDivisionAddedInGrid(uniqueName: any): void;
      deleteSubscriptionRole(): void;
      searchSubscriptionRole(uniqueName: any): void;
      verifyRoleAddedInGrid(uniqueName: any): void;
      verifyDuplicateIconPresent(): void;
      verifyDuplicateIconNotPresent(): void;
      verifyOverviewIconPresent(): void;
      verifyOverviewIconNotPresent(): void;
      verifyDeleteIconNotPresent(): void;
      verifyEditIconNotPresent(): void;
      clickOnDuplicateIcon(): void;
      validateDuplicateSubscriptionRoleAlert(roleName: any): void;
      editRoleName(roleName: any): void;
      clickOnSaveAndCloseButtonInEditRole(): void;
      verifyHyphenErrorMessage(uniqueName: any): void;
      deleteSearchedRoleIfMoreThanOne(roleName: string): void;
    }
  }
}

let expectedHyphenErrorMessage = "Invalid character found in the display name. Like -";

Cypress.Commands.add('navigateToRolesPage', () => {
  cy.get(formControls.rolesLink).click();
});

Cypress.Commands.add('addSubscriptionRole', (uniqueRoleName: any) => {
  cy.get(formControls.addSubscriptionRoleBtn)
    .click().wait('@getRolesTemplate')
    .get(formControls.subscriptionRoleName)
    .focus()
    .type(uniqueRoleName)
    .get(formControls.roleSaveCloseBtn)
    .click()
    .wait('@createRole');
});

Cypress.Commands.add('deleteSubscriptionRole', () => {
  cy.get(formControls.roleDeleteBtn)
    .should('be.visible')
    .click()
    .xpath(formControls.deleteButton)
    .should('be.visible')
    .click().wait('@deleteRole');
});

Cypress.Commands.add('searchSubscriptionRole', function (uniqueRoleName: any) {
  cy.get(formControls.searchBox).focus().clear().type(uniqueRoleName).wait(2000);
});

Cypress.Commands.add('verifyRoleAddedInGrid', (uniqueName: any) => {
  cy.get(formControls.roleSearchGrid)
    .should('include.text', uniqueName);
});

Cypress.Commands.add('verifyDuplicateIconPresent', () => {
  cy.get(formControls.duplicateRoleIcon).should('be.visible');
});

Cypress.Commands.add('verifyDuplicateIconNotPresent', () => {
  cy.get(formControls.duplicateRoleIcon).should('not.exist');
});

Cypress.Commands.add('verifyOverviewIconPresent', () => {
  cy.get(formControls.overviewRoleIcon).should('be.visible');
});

Cypress.Commands.add('verifyOverviewIconNotPresent', () => {
  cy.get(formControls.overviewRoleIcon).should('not.exist');
});

Cypress.Commands.add('verifyDeleteIconNotPresent', () => {
  cy.get(formControls.roleDeleteBtn).should('not.exist');
});

Cypress.Commands.add('verifyEditIconNotPresent', () => {
  cy.get(formControls.roleEditBtn).should('not.exist');
});

Cypress.Commands.add('clickOnDuplicateIcon', () => {
  cy.get(formControls.duplicateRoleIcon).should('be.visible').click().waitForSpinnerIcon();
});

Cypress.Commands.add('validateDuplicateSubscriptionRoleAlert', (roleName: any) => {
  cy.get(formControls.roleSaveCloseBtn).click();
  cy.get(formControls.alertDialogMessage).should('be.visible').contains(roleName + " is already added to Subscription : ");
});

Cypress.Commands.add('editRoleName', (roleName: any) => {
  cy.get(formControls.subscriptionRoleName).focus().type(roleName);
});

Cypress.Commands.add('clickOnSaveAndCloseButtonInEditRole', () => {
  cy.get(formControls.roleSaveCloseBtn).click().wait('@createRole');
});


Cypress.Commands.add('verifyHyphenErrorMessage', (uniqueRoleName) => {
  cy.get(formControls.addSubscriptionRoleBtn).click().wait('@getRolesTemplate');
  cy.get(formControls.subscriptionRoleName).focus().type(uniqueRoleName);
  cy.get(formControls.roleTemplateDropDwn).first().click()
  cy.get(formControls.hyphenErrorMessageInRolesPage).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(expectedHyphenErrorMessage);
  });
});

Cypress.Commands.add('deleteSearchedRoleIfMoreThanOne', (roleName: string) => {
  cy.wait(2000);
  cy.get(formControls.searchBox).click().clear().type(roleName).wait(1000);
  cy.get('body').then(($body) => {
    if ($body.find(formControls.noResultsFound).length) {
      Helpers.log("Searched Role is not present")
    } else {
      cy.get(formControls.tableGridRow).each((item, index, list) => {
        cy.get(formControls.tableGridRow, { timeout: 10000 }).contains(roleName);
        cy.get(formControls.tableGridRow).should('include.text', roleName);
        cy.deleteSubscriptionRole();
        cy.wait(4000);
        cy.waitForSpinnerIcon();
      });
    }
  });
  cy.get(formControls.searchBox).click().clear();
});



