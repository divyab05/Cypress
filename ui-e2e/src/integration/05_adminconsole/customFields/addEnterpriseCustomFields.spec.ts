///<reference types="cypress" />
import { interceptsCustomFields } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Custom Fields', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.clientAdminUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        cy.navigateToCustomFieldPage();
        interceptsCustomFields();
        cy.deleteAllCustomFieldsViaAPI();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e><@promote_qa><@platform_ppd> TC001 : Add, Search and Delete Custom Field Enterprise level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoEntCF' + uniqueNum,
            customType: 'Text',
        };
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        //cy.deleteSearchedCFIfMoreThanOne('AutoEntCF');
        cy.addCustomFields(newCustomFields);
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });

    it(`<@platform_e2e><@platform_ppd> TC002 : Add, Search and Delete Custom Field Division level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoDivCF' + uniqueNum,
            customType: 'Text',
        };
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        //cy.deleteSearchedCFIfMoreThanOne('AutoDivCF');
        cy.addCustomFields(newCustomFields);
        cy.selectAccessLevelCustomField('division');
        cy.selectDivisionCF('division');
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });

    it(`<@platform_e2e><@platform_ppd> TC003 : Add, Search and Delete Custom Field Location level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoLocCF' + uniqueNum,
            customType: 'Text',
        };
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        //cy.deleteSearchedCFIfMoreThanOne('AutoLocCF');
        cy.addCustomFields(newCustomFields);
        cy.selectAccessLevelCustomField('location');
        cy.selectLocationCF('location');
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });

    it(`<@platform_e2e><@platform_ppd> TC004 - Verify created Custom Fields exists in Address Book`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoEntCF' + uniqueNum,
            customType: 'Text',
        };
        //we do not need to do this as I am deleting all the custom fields before test starts through API
        //cy.deleteSearchedCFIfMoreThanOne('AutoEntCF');
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        cy.addCustomFields(newCustomFields);
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);

        cy.navigateToAddressBook();
        cy.verifyCreatedCFInAddressBook(newCustomFields);

        cy.navigateToCustomFieldPage();
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });

    it(`<@platform_e2e><@platform_ppd> TC005: Active/Inactive Custom Fields`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoActiveCF' + uniqueNum,
            customType: 'Text',
        };
        //cy.deleteSearchedCFIfMoreThanOne('AutoActiveCF');
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        cy.addCustomFields(newCustomFields);
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.inactiveCustomField(newCustomFields);
        cy.deleteCustomField();
    });
});

