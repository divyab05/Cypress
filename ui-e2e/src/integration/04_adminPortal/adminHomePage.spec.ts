///<reference types="cypress" />
import { config } from '../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../support/adminPortal/adminCommands';
import { AdminChecker } from '../../support/adminPortal/adminChecker';
import { Helpers } from '../../support/helpers';
import { interceptsAddRoleTemplate, interceptsSelectEnterprise } from '../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../support/doorKeeper';

describe('Test Suite :: Admin User - Verify the Home Page of Platform and ClientSetup Tab', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const adminChecker = new AdminChecker();
    const helpers = new Helpers();
    const enterprise = 'Plan Definition Automation';
    const doorKeeper = new DoorKeeperOnboarding();

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsAddRoleTemplate();
        interceptsSelectEnterprise();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC001 - Verification of all Links in Platform HomePage`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        //adminCommands.navigateToPlatformTab();
        //adminCommands.navigateToManagePlanDefinition();
        //adminCommands.verifyPlatformPagesLoadedOrNot(AdminCommands.platformTabs[1]);
        //adminCommands.navigateToPlatformTab();
        //adminCommands.navigateToManageRoleTemplates();
        //adminCommands.verifyPlatformPagesLoadedOrNot(AdminCommands.platformTabs[2]);
        adminCommands.navigateToPlatformTab();
        adminCommands.navigateToManageEnterprises();
        adminCommands.verifyPlatformPagesLoadedOrNot(AdminCommands.platformTabs[3]);
        adminCommands.navigateToPlatformTab();
        //adminCommands.navigateToManageAdminUsers();
        //adminCommands.verifyPlatformPagesLoadedOrNot(AdminCommands.platformTabs[4]);
        //adminCommands.navigateToPlatformTab();
        adminCommands.navigateToManageIntegrators();
        adminCommands.verifyPlatformPagesLoadedOrNot(AdminCommands.platformTabs[5]);
        if (Cypress.env('appEnv').includes('fed') === false) {
            adminCommands.navigateToPlatformTab();
            adminCommands.navigateToManageAccessRequests();
            adminCommands.verifyPlatformPagesLoadedOrNot(AdminCommands.platformTabs[6]);
        }
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC002 - Verification of all Links in Client Setup HomePage`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        adminCommands.navigateToClientSetupTab();
        adminChecker.checkHomePageElementsAreDisplayedWhenNoEnterpriseIsSelected();

        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.clickOnManageSubscriptions();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[0]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageIntegrations();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[1]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageDivisionsAndLocations();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[2]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageCarriers();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[3]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageCostAccounts();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[4]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageAddressBook();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[5]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageRoles();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[6]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[7]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageProducts();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[8]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageBusinessRules();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[9]);

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)

        adminCommands.navigateToManageNotificationsAndTemplates();
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[10]);

        adminCommands.navigateToClientSetupTab()
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageCustomFields()
        adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[11]);
    });
});
