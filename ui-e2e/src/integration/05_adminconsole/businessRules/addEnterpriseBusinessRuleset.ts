///<reference types="cypress" />
import { interceptsBusinessRuleset } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Business ruleset', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.enterpriseAdminUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        cy.navigateToBusinessRulesPage();
        interceptsBusinessRuleset();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e><@platform_ppd>TC001 - Add, Search and Delete Business Rules for UPS carrier`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `UPSRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for UPSAutoRule${uuidGenerator()}`,
            checkBox: "Create Ship Request",
            service: "Service",
            carrier: "UPS",
            serviceLevel: "UPS 2nd Day Air®",
        };
        cy.addBusinessRuleSet(businessRuleDetails);
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });

    it(`<@platform_e2e><@platform_ppd>TC002 - Add, Search and Delete Business Rules for USPS carrier`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `USPSRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for USPSAutoRule${uuidGenerator()}`,
            checkBox: "Create Shipping Label",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "Priority Mail Express™",
        };
        cy.addBusinessRuleSet(businessRuleDetails);
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });

    if (Cypress.env('appEnv').includes('fed') === true) {
        it(`<@platform_e2e><@platform_ppd>TC003 - Add, Search and Delete Business Rules for FedEx carrier`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `FedExRule${uuidGenerator()}`;
            const businessRuleDetails = {
                name: uniqueName,
                type: 'Rate Shop Group',
                code: `${uuidGenerator()}`,
                description: `Description for FedExAutoRule${uuidGenerator()}`,
                checkBox: "Manage Orders",
                service: "Service",
                carrier: "FedEx",
                serviceLevel: "FedEx Express Saver®",
            };
            cy.addBusinessRuleSet(businessRuleDetails);
            cy.addServiceLevelRuleSet(businessRuleDetails);
            cy.verifyCreatedRulesetExist(businessRuleDetails);
            cy.deleteBusinessRule();
        });
    }

    it(`<@platform_e2e><@platform_ppd>TC004 - Add Business Rules for USPS carrier - Division Level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `USPSDiv${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for USPSDivAutoRule${uuidGenerator()}`,
            checkBox: "Create Ship Request",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "Priority Mail®",
        };
        cy.addBusinessRuleSet(businessRuleDetails);
        cy.selectAccessLevelRuleSet("division");
        cy.selectDivisionBR("division");
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });

    it(`<@platform_e2e><@platform_ppd>TC005 - Add Business Rules for USPS carrier - Location Level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `USPSLoc${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for USPSLocAutoRule${uuidGenerator()}`,
            checkBox: "Manage Orders",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "First-Class Mail®",
        };
        cy.addBusinessRuleSet(businessRuleDetails);
        cy.selectAccessLevelRuleSet("location");
        cy.selectLocationBR("location");
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });

    it(`<@platform_e2e><@platform_ppd>TC006 - Inactive Business Rules for USPS carrier - Location Level`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `InactUSPSLoc${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for InactiveUSPSLocAutoRule${uuidGenerator()}`,
            checkBox: "Create Shipping Label",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "Library Mail®",
        };
        cy.addBusinessRuleSet(businessRuleDetails);
        cy.selectAccessLevelRuleSet("location");
        cy.selectLocationBR("location");
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.inactiveBusinessRule();
        cy.deleteBusinessRule();
    });

});

