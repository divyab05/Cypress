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
            navigateToCustomFieldPage(): void;
            selectCustomFieldsRadioButton(option): String;
            addCustomFields(newCustomFields): void;
            verifyCreatedCustomFieldExist(newCustomFields): void;
            deleteCustomField(): void;
            saveCreatedCustomField(): void;
            selectAccessLevelCustomField(newCustomFields): void;
            selectDivisionCF(newCustomFields): void;
            selectLocationCF(newCustomFields): void;
            verifyCreatedCFInAddressBook(newCustomFields): void;
            inactiveCustomField(newCustomFields): void;
            navigateToAddressBook(): void;
            deleteSearchedCFIfMoreThanOne(textToSearch: string): void;
            deleteAllCustomFieldsViaAPI(): void;
        }
    }
}

Cypress.Commands.add('deleteSearchedCFIfMoreThanOne', (textToSearch: string) => {
    cy.wait(2000);
    cy.get(formControls.searchBox).click().clear().type(textToSearch).wait(2000).should('have.length', 1);
    cy.get('body').then(($body) => {
        if ($body.find(formControls.noResultsFound).length) {
            Helpers.log("Searched custom field is not present")
        } else {
            cy.get(formControls.tableGridRow).each((item, index, list) => {
                cy.deleteCustomField();
            });
        }
    });
    cy.get(formControls.searchBox).click().clear();
});

Cypress.Commands.add('navigateToCustomFieldPage', () => {
    cy.waitForSpinners();
    cy.waitForSpinnerIcon();
    cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
    cy.get(formControls.manageCustomFields).contains('Custom Fields').click({ force: true }).wait(5000);
    cy.waitForSpinnerIcon();

});

Cypress.Commands.add('selectCustomFieldsRadioButton', function (option: string) {
    switch (option) {
        case 'Use Custom Fields':
            cy.get('span[class="mat-radio-label-content"]', { timeout: 90000 }).contains('Use Custom Fields').click({ force: true });
            cy.get(formControls.addCustomFieldsButton).should('be.visible');
            break;
        case "Don't Use Custom Fields":
            cy.get('span[class="mat-radio-label-content"]', { timeout: 90000 }).contains("Don't Use Custom Fields").click({ force: true });
            break;
    }
});

Cypress.Commands.add('addCustomFields', function (newCustomFields: any) {
    cy.get(formControls.addCustomFieldsButton, { timeout: 90000 }).should('be.visible').click({ force: true }).wait(1000);
    cy.get(formControls.nameField, { timeout: 90000 }).should('be.visible').click();
    cy.get(formControls.nameField).focus().clear().type(`${newCustomFields.name}`);
    cy.get(formControls.customTypeDropdown).click().wait(500);
    cy.get(formControls.customTypeDrpdoownText).contains(`${newCustomFields.customType}`).click({ force: true }).wait(500);
    cy.get('#CONTACTS_ADDRESS_BOOK-input').click({ force: true });
    cy.waitForSpinnerIcon();
});

Cypress.Commands.add('saveCreatedCustomField', () => {
    cy.get(formControls.addAndCloseButtoninAddSubCA).click().wait('@addCustomField').its('response.statusCode').should('eq', 201);
    cy.get(formControls.successMessageInCustomFields).should('be.visible');
    cy.get(formControls.successMessageInCustomFields, { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('verifyCreatedCustomFieldExist', (newCustomFields: any) => {
    cy.get(formControls.searchCustomField).type(newCustomFields.name).wait(2000);
    cy.get(formControls.tableGridRow)
        .should('include.text', newCustomFields.name).wait(1000);
});

Cypress.Commands.add('deleteCustomField', () => {
    cy.get(formControls.deleteCustomField).should('be.visible').click()
        .get(formControls.deleteModalConfirmBtn).click();
    cy.wait(1000);
});

Cypress.Commands.add('selectAccessLevelCustomField', (accessLevel: any) => {
    //cy.get('#' + accessLevel + '-button').check({ force: true }).should('be.checked');
    cy.get('#' + accessLevel + '-button').scrollIntoView().should('be.visible');
    cy.get('#' + accessLevel + '-button').click();
    cy.get('.' + accessLevel + '-filter', { timeout: 90000 }).click();
});

Cypress.Commands.add('selectDivisionCF', (accessLevel: any) => {
    cy.get(formControls.selectDivCF).first().click({ force: true });
    cy.get('.' + accessLevel + '-filter', { timeout: 90000 }).click();
    cy.get('#' + accessLevel + '-button').click();
});

Cypress.Commands.add('selectLocationCF', (accessLevel: any) => {
    cy.get(formControls.selectLocation).first().click({ force: true });
    cy.get('.' + accessLevel + '-filter', { timeout: 90000 }).click();
    cy.get('#' + accessLevel + '-button').click();
});

Cypress.Commands.add('verifyCreatedCFInAddressBook', (newCustomFields: any) => {
    cy.wait(3000);
    cy.get(formControls.addContactBtn, { timeout: 90000 }).click();
    cy.get('#recipient', { timeout: 90000 }).should('be.visible');
    cy.get(formControls.addAddressBtn).scrollIntoView().wait(2000);
    cy.get(formControls.customValueInAddressBook, { timeout: 90000 }).scrollIntoView().should('be.visible').contains(newCustomFields.name);
    cy.get(formControls.closePopup).click();
    cy.wait(1000);
});

Cypress.Commands.add('inactiveCustomField', (newCustomFields: any) => {
    cy.get(formControls.editCustomField, {timeout: 40000 }).click();
    cy.get('#status').scrollIntoView().click();
    //cy.get(formControls.inactiveCustomField).scrollIntoView().should('be.visible')
    //    .get(formControls.inactiveCustomField).click({force:true})
    cy.get(formControls.saveCloseBtn).click().wait(2000)
        .get(formControls.showInactiveCustomField, { timeout: 40000 }).click();
    cy.wait(2000);
    cy.get(formControls.tableGridRow)
        .should('include.text', newCustomFields.name).wait(1000);
});

Cypress.Commands.add('navigateToAddressBook', () => {
    cy.waitForSpinners();
    cy.waitForSpinnerIcon();
    cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
    cy.get(formControls.manageContacts, { timeout: 15000 }).contains('Address Book').click();
    cy.wait(5000);
});

Cypress.Commands.add('deleteAllCustomFieldsViaAPI', () => {
  Helpers.log("Entering the deleteAllCustomFieldsViaAPI method");
  //GET all the existing custom fields and delete them
  cy.get('@XSRFToken').then((token) => {
    cy.request({
      method: "GET",
      url: 'api/submeta/v2/manageCustomfields',
      failOnStatusCode: true,
      retryOnNetworkFailure: true,
      headers: token
    }).then(async (response) => {
      if (!(response.body.customFields === null) && (response.status === 200)) {
        let count = response.body.customFields.length;
        Helpers.log(count);
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            let customFieldIDToDelete = response.body.customFields[i].customFieldID;
            Helpers.log("customFieldIDToDelete To Delete the custom fields:");
            Helpers.log(customFieldIDToDelete);
            cy.request({
              method: "DELETE",
              url: `api/submeta/v1/customfields/` + customFieldIDToDelete,
              failOnStatusCode: false,
              retryOnNetworkFailure: true,
              headers: token
            }).then(async (response) => {
              expect(response.status).to.eq(200);
            })
          }
        } else {
          Helpers.log("No custom fields present");
        }
      }
    });
  });
});

