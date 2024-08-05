import { formControls } from '../../fixtures/adminconsole/formControls.json';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
    namespace Cypress {
        //create .d.ts definitions file to get autocomplete.
        interface Chainable<Subject> {
            navigateToBusinessRulesPage(): void;
            addBusinessRuleSet(businessRuleDetails): void;
            addServiceLevelRuleSet(businessRuleDetails): void;
            selectAccessLevelRuleSet(accessLevel): void;
            selectDivisionBR(accessLevel): void;
            selectLocationBR(accessLevel): void;
            verifyCreatedRulesetExist(businessRuleDetails): void;
            deleteBusinessRule(): void;
            inactiveBusinessRule(): void;
        }
    }
}

Cypress.Commands.add('navigateToBusinessRulesPage', () => {
    cy.waitForSpinners();
    cy.waitForSpinnerIcon();
    cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
    cy.get(formControls.manageBusinessRules).contains('Business Rules').click({ force: true }).wait(5000);

});

Cypress.Commands.add('addBusinessRuleSet', function (businessRuleDetails: any) {
    cy.get(formControls.AddRuleSetBtn)
        .click()
        .get(formControls.AddRuletypeDropdownIn)
        .click()
        .type(businessRuleDetails.type)
        .get(formControls.AddRuledropdownTextList)
        .contains(businessRuleDetails.type)
        .click()
        .get(formControls.inputRecipientName).type(businessRuleDetails.name)
        .get(formControls.AddRulesetCode).type(businessRuleDetails.code)
        .get(formControls.AddRulesetDescriptionInput).type(businessRuleDetails.description)
        .get('span[class="mat-checkbox-label"]').contains(businessRuleDetails.checkBox).click();
});

Cypress.Commands.add('addServiceLevelRuleSet', function (businessRuleDetails: any) {
    cy.get(formControls.continueButton).click({ force: true })
        .get(formControls.AddRuletypeDropdownIn).should('be.visible')
        .click()
        .get(formControls.AddRuledropdownTextList).contains(businessRuleDetails.service)
        .click({ force: true })
        .get(formControls.AddRulesetCarrierDropdown)
        .click()
        .type(businessRuleDetails.carrier)
        .get(formControls.AddRuledropdownTextList)
        .contains(businessRuleDetails.carrier)
        .click()
        .get(formControls.AddRulesetServiceLevel, { timeout: 10000 })
        .click()
        .type(businessRuleDetails.serviceLevel)
        .get(formControls.AddRuledropdownTextList)
        .contains(businessRuleDetails.serviceLevel)
        .click();
    cy.get(formControls.carrierAddSubmit).click().then(_ => {
        cy.wait('@addBusinessruleSet');
    })
});

Cypress.Commands.add('selectAccessLevelRuleSet', (accessLevel: any) => {
    cy.get('#accessLevel-' + accessLevel + '-input').check({ force: true }).should('be.checked');
    cy.wait(1000);
    cy.get('#accessLevel-' + accessLevel + '-dropdown', { timeout: 15000 }).click();
});

Cypress.Commands.add('selectDivisionBR', (accessLevel: any) => {
    cy.get(formControls.selectRole, { timeout: 15000 }).should('be.visible').first().click({ force: true });
    cy.get('#accessLevel-' + accessLevel + '-dropdown').click();
});

Cypress.Commands.add('selectLocationBR', (accessLevel: any) => {
    cy.get(formControls.selectLocation, { timeout: 15000 }).should('be.visible').first().click({ force: true });
    cy.get('#accessLevel-' + accessLevel + '-dropdown').click();
});

Cypress.Commands.add('verifyCreatedRulesetExist', (businessRuleDetails: any) => {
    cy.get(formControls.searchRuleSet).type(businessRuleDetails.name).wait(2000);
    cy.get(formControls.tableGridRow)
        .should('include.text', businessRuleDetails.name).wait(1000);
});

Cypress.Commands.add('deleteBusinessRule', () => {
    cy.get(formControls.deleteRuleset).should('be.visible').click()
        .get(formControls.deleteModalConfirmBtn).click();
    cy.wait(1000);
});

Cypress.Commands.add('inactiveBusinessRule', () => {
    cy.get(formControls.editRuleset).click().
        get(formControls.editDetailsBtn).click()
        .get(formControls.inactiveRuleset).scrollIntoView().should('be.visible')
        .get(formControls.inactiveRuleset).click()
        .get(formControls.carrierAddSubmit).click({ force: true })
        .get(formControls.carrierAddSubmit, { timeout: 10000 }).should('be.visible').click({ force: true })
        .get(formControls.showInactiveCheckBox, { timeout: 10000 }).should('be.visible').click();
});
