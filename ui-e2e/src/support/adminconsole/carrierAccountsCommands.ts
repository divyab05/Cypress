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
      navigateToCarrierAccounts(): void;
      clickAddCarrier(): void;
      addUPSCarrier(carrierDetails: any): void;
      addFedExCarrier(carrierDetails: any): void;
      searchCarrier(carrierName: any): void;
      deleteCarrier(): void;
      verifyUPSCarrierAdded(): void;
      verifyFedExCarrierAdded(): void;
      checkIfCarrierAlreadyAdded(carrierName: any): void;
      fillAddressDetailsCarrier(carrierDetails: any): void;
    }
  }
}

Cypress.Commands.add('navigateToCarrierAccounts', () => {
  cy.get(formControls.carrierAccountLink).click().wait('@getSubCarriers');
});


Cypress.Commands.add('clickAddCarrier', () => {
  cy.get(formControls.carrierAddBtn).click();
  //.wait('@getCarriers');
});

Cypress.Commands.add('addUPSCarrier', (carrierDetails: any) => {
  cy.get(formControls.carrierNameTxtBox).should('be.visible')
    .type(carrierDetails.nickname)
    .blur()
    .get(formControls.carrierSelectDropDwn)
    .click()
    .get(formControls.dropDownText)
    .contains('UPS')
    .click();
  if (Cypress.env('appEnv').includes('fed') === false) {
    cy.get(formControls.carrierUPSOption).should('be.visible')
      .click({ force: true });
  }
  cy.get(formControls.carrierUPSAccountNumber)
    .type(carrierDetails.accountNumber)
    .blur();
  if (Cypress.env('appEnv').includes('fed') === true) {
    cy.get(formControls.carrierUPSGCSPartnerID)
      .type(carrierDetails.gcsPartnerID)
      .blur();
  }
  cy.get(formControls.carrierUPSNewer90DaysChkBox)
    .check({ force: true })
    .should('be.checked');
  cy.fillAddressDetailsCarrier(carrierDetails);
  cy.get(formControls.carrierUPSAccept).should('be.visible')
    .click()
    .get(formControls.carrierAddSubmit)
    .click()
    .wait('@addSubCarrier');
});

Cypress.Commands.add('addFedExCarrier', (carrierDetails: any) => {
  cy.get(formControls.carrierNameTxtBox).should('be.visible')
    .type(carrierDetails.nickname)
    .blur()
    .get(formControls.carrierSelectDropDwn)
    .click()
    .get(formControls.dropDownText)
    .contains('FedEx')
    .click()
    .get(formControls.carrierFedExAccountNumber)
    .type(carrierDetails.accountNumber)
    .blur()
  if (Cypress.env('appEnv').includes('fed') === true) {
    cy.get(formControls.carrierFedExPartnerID)
      .type(carrierDetails.gcsPartnerID)
      .blur();
  }
  cy.fillAddressDetailsCarrier(carrierDetails);
  cy.get(formControls.carrierFedExAccept)
    .click()
    .get(formControls.carrierAddSubmit)
    .click()
    .wait('@addSubCarrier');
});

Cypress.Commands.add('fillAddressDetailsCarrier', (carrierDetails: any) => {
  cy.get(formControls.name)
    .type(carrierDetails.fullName)
    .blur()
    .get(formControls.companyName)
    .type(carrierDetails.companyName)
    .blur()
    .get(formControls.addressLine1)
    .type(carrierDetails.streetAddress1)
    .blur()
    .get(formControls.postalCode)
    .type(carrierDetails.postalCode)
    .blur()
    .get(formControls.city)
    .type(carrierDetails.city)
    .blur()
    .get(formControls.state)
    .select(carrierDetails.state)
    .get(formControls.email)
    .type(carrierDetails.email)
    .blur()
    .get(formControls.phone)
    .type(carrierDetails.phoneNumber)
    .blur();
});

Cypress.Commands.add('verifyUPSCarrierAdded', () => {
  cy.get(formControls.carrierUPSAvailable).should('be.visible');
});

Cypress.Commands.add('verifyFedExCarrierAdded', () => {
  cy.get(formControls.carrierfedExAvailable).should('be.visible');
});

Cypress.Commands.add('searchCarrier', (carrierName: any) => {
  //cy.waitForSpinnerIcon();
  cy.get(formControls.searchBox).type(carrierName).clear().type(carrierName).wait(3000);
});

Cypress.Commands.add('deleteCarrier', () => {
  cy.get(formControls.carrierDeleteBtn).click()
    .get(formControls.deleteModalConfirmBtn).click().wait(3000);
});

Cypress.Commands.add('checkIfCarrierAlreadyAdded', (carrierName: any) => {
  cy.searchCarrier(carrierName);
  adminConsoleHelpers.isThisElementVisible(formControls.carrierUPSAvailable).then((result) => {
    if (result) cy.deleteCarrier();
  });
});
