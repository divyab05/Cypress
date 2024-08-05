///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../../../support/helpers';

describe('Test Suite :: Cost Accounts by Division Level Users', () => {
    beforeEach(() => {
        if (Cypress.env('appEnv').includes('fed') === true) {
            cy.getUsers().then((users) => {
                const { username, password } = users.divisionAdminUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.divisionNotificationUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        interceptsCostAccountApiCalls();
        cy.navigateToCostAccountPage();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    const costAccountAssignedToUser = 'Auto CA 1 Do Not Delete';


    it(`<@platform_e2e><@platform_ppd>TC001 - Verify Division Level User can add Cost Account, Search by Name or Code and delete`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newDivCostAccount = {
            name: 'CADiv' + uniqueNum,
            code: 'CCDiv' + uniqueNum,
            description: 'desc text',
            shareLevel: 'division',
            shareLevelInGrid: 'Divisions'
        };
        cy.deleteSearchedAccountIfMoreThanOne('CADiv');
        cy.addDivisionCostAccount(newDivCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(newDivCostAccount.name);
        cy.getShareLevelAtTextInGrid(newDivCostAccount.shareLevelInGrid);
        cy.deleteCostAccount();

    });

    it(`<@platform_e2e><@platform_ppd>TC002 - Verify Division Level User can add Location Cost Account, Search by Name or Code and delete`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newLocCostAccount = {
            name: 'CALoc' + uniqueNum,
            code: 'CCLoc' + uniqueNum,
            description: 'desc text',
            shareLevel: 'location',
            shareLevelInGrid: 'Locations',
        };
        cy.deleteSearchedAccountIfMoreThanOne('CALoc');
        cy.addCostAccount(newLocCostAccount);
        cy.selectLocationCA(newLocCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(newLocCostAccount.name);
        cy.getShareLevelAtTextInGrid(newLocCostAccount.shareLevelInGrid);
        cy.deleteCostAccount();
    });

    it(`<@platform_e2e><@platform_ppd>TC003 - Verify Division Level user can add Parent, Sub and Sub Cost Account at Division Level and delete`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentCA' + uniqueNum,
            code: 'Auto_ParentCA' + uniqueNum,
            description: 'Auto_ParentCA',
            shareLevel: 'division',
            shareLevelInGrid: 'Divisions'
        };

        const subCostAccount = {
            name: 'Auto_SubCA' + uniqueNum,
            code: 'Auto_SubCA' + uniqueNum,
            description: 'Auto_SubCA',
            shareLevel: 'division',
            shareLevelInGrid: 'Divisions'
        };

        const subSubCostAccount = {
            name: 'Auto_SubSubCA' + uniqueNum,
            code: 'Auto_SubSubCA' + uniqueNum,
            description: 'Auto_SubSubCA',
            shareLevel: 'division',
            shareLevelInGrid: 'Divisions'
        };
        cy.deleteSearchedAccountIfMoreThanOne('Auto_ParentCA');
        cy.addDivisionCostAccount(parentCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(parentCostAccount.name);
        cy.getShareLevelAtTextInGrid(parentCostAccount.shareLevelInGrid);
        cy.wait(2000);
        cy.addSubCostAccount(subCostAccount);
        cy.addAndCloseInAddSubCostAccount();

        cy.searchCostAccount(subCostAccount.name);
        cy.wait(1000);
        cy.addSubSubCostAccount(subSubCostAccount);
        cy.addAndCloseInAddSubCostAccount();

        cy.searchCostAccount(subSubCostAccount.name);
        cy.get(formControls.costAccounts_SearchResultRow1)
            .and('include.text', parentCostAccount.name)
            .and('include.text', subCostAccount.name)
            .and('include.text', subSubCostAccount.name);
        cy.deleteCostAccountViaAPI();
    });

    it(`<@platform_e2e><@platform_ppd>TC004 - Verify Division Level User create Active Cost account, change to Inactive and validate in the UI`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const activeToInactiveCostAccount = {
            name: 'Auto_activeToInactiveCA' + uniqueNum,
            code: 'Auto_activeToInactiveCA' + uniqueNum,
            description: 'Auto_activeToInactiveCA',
            shareLevel: 'division',
            shareLevelInGrid: 'Divisions',
            active: false
        };
        cy.deleteSearchedAccountIfMoreThanOne('Auto_activeToInactiveCA');
        cy.addDivisionCostAccount(activeToInactiveCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(activeToInactiveCostAccount.name);
        cy.getShareLevelAtTextInGrid(activeToInactiveCostAccount.shareLevelInGrid);
        cy.editActiveToInactiveCostAccount(activeToInactiveCostAccount);
        cy.searchInactiveCostAccount(activeToInactiveCostAccount.name);
        cy.selectInactiveAccountsCheckBox();
        cy.searchCostAccount(activeToInactiveCostAccount.name);
        cy.getShareLevelAtTextInGrid(activeToInactiveCostAccount.shareLevelInGrid);
        cy.deleteCostAccount();
    });

    it(`<@platform_e2e><@platform_ppd>TC005 - Verify Div Level User can add Division Cost Account and change the Access level to Location level, Validated the entity level in the Grid`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newDivCostAccount = {
            name: 'CADiv' + uniqueNum,
            code: 'CCDiv' + uniqueNum,
            description: 'desc text',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };
        cy.deleteSearchedAccountIfMoreThanOne('CADiv');
        cy.addCostAccount(newDivCostAccount);
        cy.selectDivisionCA(newDivCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(newDivCostAccount.name);
        cy.getShareLevelAtTextInGrid(newDivCostAccount.shareLevel1);
        cy.clickOnEditIconOfCostAccount();
        cy.clickOnLocationRadioButtonInCostAccountPopup();
        cy.clickSaveBtn();
        cy.searchCostAccount(newDivCostAccount.name);
        cy.getShareLevelAtTextInGrid(newDivCostAccount.shareLevel2);
        cy.deleteCostAccountViaAPI();
    });

    it(`<@platform_e2e><@platform_ppd>TC006 - Verify Div Level User can add Location Cost Account and change the Access level to Division level, Validated the entity level in the Grid`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newLocCostAccount = {
            name: 'CALoc' + uniqueNum,
            code: 'CCLoc' + uniqueNum,
            description: 'desc text',
            shareLevel: 'location',
            shareLevel1: 'Locations',
            shareLevel2: 'Divisions'
        };
        cy.deleteSearchedAccountIfMoreThanOne('CALoc');
        cy.addCostAccount(newLocCostAccount);
        cy.selectLocationCA(newLocCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(newLocCostAccount.name);
        cy.getShareLevelAtTextInGrid(newLocCostAccount.shareLevel1);
        cy.clickOnEditIconOfCostAccount();
        cy.clickOnDivisionRadioButtonInCostAccountPopup();
        cy.clickSaveBtn();
        cy.searchCostAccount(newLocCostAccount.name);
        cy.getShareLevelAtTextInGrid(newLocCostAccount.shareLevel2);
        cy.deleteCostAccountViaAPI();
    });

    it(`<@platform_e2e><@platform_ppd>TC007 - Verify Cost Account should not be created with duplicate account id, Code by Div Level User`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCostAccountWithDuplicateCode = {
            name: 'CAWithDuplicateCode' + uniqueNum,
            code: 'AutoCA' + uniqueNum,
            description: 'desc text',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };
        const newCostAccountWithDuplicatename = {
            name: 'AutoCA' + uniqueNum,
            code: 'CAWithDuplicateCode' + uniqueNum,
            description: 'desc text',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };
        const newCostAccount = {
            name: 'AutoCA' + uniqueNum,
            code: 'AutoCC' + uniqueNum,
            description: 'desc text',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };
        cy.deleteSearchedAccountIfMoreThanOne('AutoCA');
        cy.addDivisionCostAccount(newCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(newCostAccount.name);
        Helpers.log("Cost Account is added successfully");
        cy.addCostAccount(newCostAccountWithDuplicateCode, true);
        cy.validateDuplicateCostAccountErrorMessage(newCostAccountWithDuplicateCode);
        Helpers.log("Validated Cost Account created with Duplicate Code Error Message successfully");
        cy.addCostAccount(newCostAccountWithDuplicatename, true);
        cy.validateDuplicateCostAccountErrorMessage(newCostAccountWithDuplicatename);
        Helpers.log("Validated Cost Account created with Duplicate Name Error Message successfully");
        cy.verifySearchCostAccount(costAccountAssignedToUser);
        cy.validateDeleteCostAccountErrorMessage();
        Helpers.log("Validated Delete Cost Account Error Message successfully if Cost Account assigned to Logged in USER");
        cy.verifySearchCostAccount(costAccountAssignedToUser);
        cy.validateInactiveReferenceCostAccountErrorMessage();
        Helpers.log("Validated Inactive Cost Account Error Message successfully if Cost Account assigned to Logged in USER");
        cy.deleteCostAccountViaAPI();
    });

    it(`<@platform_e2e><@platform_ppd>TC008 - Verify Div level user can add Cost Account with Billable and Password Enabled`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentBillablePassword' + uniqueNum,
            code: 'Auto_ParentBillablePassword' + uniqueNum,
            description: 'Auto_ParentBillablePassword',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };

        const subCostAccount = {
            name: 'Auto_SubCA' + uniqueNum,
            code: 'Auto_SubCA' + uniqueNum,
            description: 'Auto_SubCA',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };

        const subSubCostAccount = {
            name: 'Auto_SubSubCA' + uniqueNum,
            code: 'Auto_SubSubCA' + uniqueNum,
            description: 'Auto_SubSubCA',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };
        cy.addCostAccountWithBillableAndPassword(parentCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(parentCostAccount.name);
        cy.verifyBillableIconIsPresentOrNot(parentCostAccount.name);
        cy.verifyPasswordEnabledIconIsPresentOrNot(parentCostAccount.name);
        cy.addSubCostAccountUnderPasswordEnabledParent(subCostAccount);
        cy.addAndCloseInAddSubCostAccount();
        cy.searchCostAccount(subCostAccount.name);
        cy.addSubSubCostAccountUnderPasswordEnabledParent(subSubCostAccount);
        cy.addAndCloseInAddSubCostAccount();
        cy.deletePasswordEnabledCostAccount();
    });

    it(`<@platform_e2e><@platform_ppd>TC009 - Verify Div level user can edit Sub Cost Account Description and change the access level from Division to Location`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentCATC013' + uniqueNum,
            code: 'Auto_ParentCATC013' + uniqueNum,
            description: 'Auto_ParentCATC013',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };

        const subCostAccount = {
            name: 'Auto_SubCATC013' + uniqueNum,
            code: 'Auto_SubCATC013' + uniqueNum,
            description: 'Auto_SubCATC013',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };

        const subSubCostAccount = {
            name: 'Auto_SubSubCATC013' + uniqueNum,
            code: 'Auto_SubSubCATC013' + uniqueNum,
            description: 'Auto_SubSubCATC013',
            shareLevel: 'division',
            shareLevel1: 'Divisions',
            shareLevel2: 'Locations'
        };
        cy.addDivisionCostAccount(parentCostAccount);
        cy.saveCostAccount();

        cy.searchCostAccount(parentCostAccount.name);
        cy.searchCostAccount(parentCostAccount.code);
        cy.addSubCostAccount(subCostAccount);
        cy.addAndCloseInAddSubCostAccount();

        cy.searchCostAccount(subCostAccount.name);
        cy.wait(1000);
        cy.addSubSubCostAccount(subSubCostAccount);
        cy.addAndCloseInAddSubCostAccount();
        //cy.get("a[aria-label='Expand row']").click();

        cy.searchCostAccount(subSubCostAccount.name);
        cy.searchCostAccount(subSubCostAccount.code);
        cy.get(formControls.costAccounts_SearchResultRow1)
            .and('include.text', parentCostAccount.name)
            .and('include.text', subCostAccount.name)
            .and('include.text', subSubCostAccount.name);

        cy.clickOnEditIconOfSubCA();
        cy.updateDescirption("updateDesc");
        cy.clickSaveBtn();
        cy.deleteCostAccountViaAPI();
    });
});
