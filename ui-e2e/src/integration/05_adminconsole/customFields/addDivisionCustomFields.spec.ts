///<reference types="cypress" />
import { interceptsCustomFields } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Custom Fields', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.divisionAdminUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        cy.navigateToCustomFieldPage();
        interceptsCustomFields();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e @platform_ppd>TC001 : Add, Search and Delete Custom Field Division level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoDivCF' + uniqueNum,
            customType: 'Text',
        };
        cy.addCustomFields(newCustomFields);
        cy.selectAccessLevelCustomField('division');
        cy.selectDivisionCF('division');
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });

    it(`<@platform_e2e @platform_ppd>TC002 : Add, Search and Delete Custom Field Location level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoLocCF' + uniqueNum,
            customType: 'Text',
        };
        cy.addCustomFields(newCustomFields);
        cy.selectAccessLevelCustomField('location');
        cy.selectLocationCF('location');
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });
});

