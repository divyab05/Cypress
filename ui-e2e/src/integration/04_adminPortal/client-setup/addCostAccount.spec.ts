///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsAddCostAccount } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';

describe('Test Suite :: Admin User - Add Cost Account', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();
    const enterprise = 'Plan Definition Automation';
    const doorKeeper = new DoorKeeperOnboarding();

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsSelectEnterprise();
        interceptsAddCostAccount();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC001 - Add Cost Account`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCostAccount = {
            name: 'AutoCA' + uniqueNum,
            code: 'AutoCC' + uniqueNum,
            description: 'desc text',
            shareLevel: 'Enterprise'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageCostAccounts();
        adminCommands.addCostAccount(newCostAccount);
        adminCommands.verifyCreatedCostAccountExist(newCostAccount);
        adminCommands.clickOnDeleteIconInCostAccountSearchResults();
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC002 - Import Cost Account`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCostAccount = {
            name: 'AutoCA' + uniqueNum,
            code: 'AutoCC' + uniqueNum,
            description: 'desc text',
            shareLevel: 'Enterprise'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageCostAccounts();
        adminCommands.clickOnImportCostAccount('adminPortal/testData/costaccount/Import_CostAccount_Single.csv');
        adminCommands.verifyCreatedCostAccountExistAfterImport('Auto_Admin_Single_CA');
        adminCommands.clickOnDeleteIconInCostAccountSearchResults();
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC003 - Export Cost Account`, function () {
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageCostAccounts();
        adminCommands.exportCostAccount(enterprise);
        adminCommands.verifyExportCostAccount();
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC004 - Download the Sample file in Cost Account Page and Download the Processed and ProcessedError Files inside Job Status modal`, function () {
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab("Business Rule Automation");
        adminCommands.navigateToManageCostAccounts();
        adminCommands.downloadSampleFile_CostAcc();
        //adminCommands.downloadFileInsideJobStatusInCostAcc("Status", "ProcessingError");
        adminCommands.downloadFileInsideJobStatusInCostAcc("Status", "Processed", "Business Rule Automation");
    });

});
