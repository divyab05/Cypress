///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsBusinessRuleset } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';


describe('Test Suite :: Admin User - Add Business ruleset', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();
    const enterprise = 'Plan Definition Automation';
    const doorKeeper = new DoorKeeperOnboarding();

    let notificationName;

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        // helpers.loginAdminConsole(user.userEmail, user.password);
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsSelectEnterprise();
        interceptsBusinessRuleset();
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageBusinessRules();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });
    if (Cypress.env('appEnv').includes('ppd') === false){
        it(`<@promote_ppd><@admin_reg_e2e>TC001 - Add, Search and Delete Business Rules for UPS carrier`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `UPSAutoRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for UPSAutoRule${uuidGenerator()}`,
            checkBox: "Create Ship Request",
            service: "Service",
            carrier: "UPS",
            serviceLevel: "UPS Next Day Air",
        };
        notificationName = uniqueName;
        adminCommands.addBusinessRuleSet(businessRuleDetails);
        adminCommands.addServiceLevelRuleSet(businessRuleDetails);
        adminCommands.verifyCreatedRulesetExist(businessRuleDetails);
        adminCommands.clickOnDeleteIconInRulesetSearchResults();
        //adminCommands.callDeleteApi_BusinessRuleSet(enterprise,businessRuleDetails.name)
    });
}

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC002 - Add, Search and Delete Business Rules for USPS carrier`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `USPSAutoRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for USPSAutoRule${uuidGenerator()}`,
            checkBox: "Create Shipping Label",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "Priority Mail®",
        };
        notificationName = uniqueName;
        adminCommands.addBusinessRuleSet(businessRuleDetails);
        adminCommands.addServiceLevelRuleSet(businessRuleDetails);
        adminCommands.verifyCreatedRulesetExist(businessRuleDetails);
        adminCommands.clickOnDeleteIconInRulesetSearchResults();
        //adminCommands.callDeleteApi_BusinessRuleSet(enterprise,businessRuleDetails.name)
    });

    if (Cypress.env('appEnv').includes('ppd') === false){
        it(`<@promote_ppd><@admin_reg_e2e>TC003 - Add, Search and Delete Business Rules for FedEx carrier`, function () {
            Helpers.log('------------------------------Test starts here-------------------------------');
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `FedExAutoRule${uuidGenerator()}`;
            const businessRuleDetails = {
                name: uniqueName,
                type: 'Rate Shop Group',
                code: `${uuidGenerator()}`,
                description: `Description for FedExAutoRule${uuidGenerator()}`,
                checkBox: "Manage Orders",
                service: "Service",
                carrier: "FedEx",
                serviceLevel: "FedEx 2Day®",
            };
            notificationName = uniqueName;
            adminCommands.addBusinessRuleSet(businessRuleDetails);
            adminCommands.addServiceLevelRuleSet(businessRuleDetails);
            adminCommands.verifyCreatedRulesetExist(businessRuleDetails);
            adminCommands.clickOnDeleteIconInRulesetSearchResults();
            //adminCommands.callDeleteApi_BusinessRuleSet(enterprise,businessRuleDetails.name)
        });
    }

    it(`<@promote_ppd><@admin_reg_e2e>TC004 - Add Business Rules for USPS carrier - Division Level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `USPSDivAutoRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for USPSDivAutoRule${uuidGenerator()}`,
            checkBox: "Create Ship Request",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "Priority Mail Express™",
        };
        notificationName = uniqueName;
        adminCommands.addBusinessRuleSet(businessRuleDetails);
        adminCommands.selectAccessLevelRuleSet("division");
        adminCommands.selectDivisionBR("division");
        adminCommands.addServiceLevelRuleSet(businessRuleDetails);
        adminCommands.verifyCreatedRulesetExist(businessRuleDetails);
        adminCommands.clickOnDeleteIconInRulesetSearchResults();
        //adminCommands.callDeleteApi_BusinessRuleSet(enterprise,businessRuleDetails.name)
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC005 - Add Business Rules for USPS carrier - Location Level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `USPSLocAutoRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for USPSLocAutoRule${uuidGenerator()}`,
            checkBox: "Manage Orders",
            service: "Service",
            carrier: "USPS",
            serviceLevel: "Library Mail®",
        };
        notificationName = uniqueName;
        adminCommands.addBusinessRuleSet(businessRuleDetails);
        adminCommands.selectAccessLevelRuleSet("location");
        adminCommands.selectLocationBR("location");
        adminCommands.addServiceLevelRuleSet(businessRuleDetails);
        adminCommands.verifyCreatedRulesetExist(businessRuleDetails);
        adminCommands.clickOnDeleteIconInRulesetSearchResults();
        //adminCommands.callDeleteApi_BusinessRuleSet(enterprise,businessRuleDetails.name)
    });

});
