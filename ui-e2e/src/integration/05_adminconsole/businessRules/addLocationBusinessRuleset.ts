///<reference types="cypress" />
import { interceptsBusinessRuleset } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Business ruleset', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.locationAdminUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        //cy.navigateToCostAccountPage();
        cy.navigateToBusinessRulesPage();
        interceptsBusinessRuleset();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e><@platform_ppd>TC001 - Add, Search and Delete Business Rules for UPS carrier- Location Level`, function () {
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
        cy.selectAccessLevelRuleSet("location");
        cy.selectLocationBR("location");
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });

    it.skip(`<@platform_e2e><@platform_ppd>TC002 - Add, Search and Delete Business Rules for FedEx carrier- Location Level`, function () {
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
        cy.selectAccessLevelRuleSet("location");
        cy.selectLocationBR("location");
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });

    it.skip(`<@promote_ppd><@platform_ppd>TC003 - Add Business Rules for USPS carrier - Location Level`, function () {
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
});

