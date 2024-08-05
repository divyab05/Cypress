///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../../../support/helpers';

describe('Test Suite :: Cost Accounts', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.almCAUser;
            adminConsoleHelpers.loginCC(username, password);
        });
        interceptsCostAccountApiCalls();
        cy.navigateToCostAccountPage();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    const costAccountAssignedToUser = 'Auto CA 1 Do Not Delete';


    it(`<@almCostAccounts>TC001 - Add Cost Account, Search by Name or Code and delete`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCostAccountToCreate = {
            name: 'AutoCA' + uniqueNum,
            code: 'AutoCC' + uniqueNum,
            description: 'desc text',
            shareLevel: 'enterprise'
        };
        cy.deleteSearchedAccountIfMoreThanOne('AutoCA');
        cy.addCostAccount(newCostAccountToCreate);
        cy.saveCostAccount();
        cy.searchCostAccount(newCostAccountToCreate.name);
        cy.deleteCostAccount();
    });

    it(`<@almCostAccounts>TC002 - Add Division Cost Account, Search by Name or Code and delete`, function () {
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
        cy.deleteCostAccount();
    });

    it(`<@almCostAccounts>TC003 - Add Location Cost Account, Search by Name or Code and delete`, function () {
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
        cy.deleteCostAccount();
    });

    it(`<@almCostAccounts>TC004 - Add Sub Cost Account and delete`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentCA' + uniqueNum,
            code: 'Auto_ParentCA' + uniqueNum,
            description: 'Auto_ParentCA',
            shareLevel: 'enterprise',
        };

        const subCostAccount = {
            name: 'Auto_SubCA' + uniqueNum,
            code: 'Auto_SubCA' + uniqueNum,
            description: 'Auto_SubCA',
            shareLevel: 'enterprise'
        };

        const subSubCostAccount = {
            name: 'Auto_SubSubCA' + uniqueNum,
            code: 'Auto_SubSubCA' + uniqueNum,
            description: 'Auto_SubSubCA',
            shareLevel: 'enterprise'
        };
        cy.deleteSearchedAccountIfMoreThanOne('Auto_ParentCA');
        cy.addCostAccount(parentCostAccount);
        cy.saveCostAccount();
        cy.wait(2000);
        cy.searchCostAccount(parentCostAccount.code);
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

    it(`<@almCostAccounts>TC005 - Create Active Cost account, change to Inactive and validate in the UI`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const activeToInactiveCostAccount = {
            name: 'Auto_activeToInactiveCA' + uniqueNum,
            code: 'Auto_activeToInactiveCA' + uniqueNum,
            description: 'Auto_activeToInactiveCA',
            shareLevel: 'enterprise',
            active: false
        };
        cy.deleteSearchedAccountIfMoreThanOne('Auto_activeToInactiveCA');
        cy.addCostAccount(activeToInactiveCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(activeToInactiveCostAccount.name);
        cy.editActiveToInactiveCostAccount(activeToInactiveCostAccount);
        cy.searchInactiveCostAccount(activeToInactiveCostAccount.name);
        cy.selectInactiveAccountsCheckBox();
        cy.searchCostAccount(activeToInactiveCostAccount.name);
        cy.deleteCostAccount();
    });

    it(`<@almCostAccounts>TC007 - Add Division Cost Account and change the Access level to Location level, Validated the entity level in the Grid`, function () {
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

    it(`<@almCostAccounts>TC008 - Add Location Cost Account and change the Access level to Division level, Validated the entity level in the Grid`, function () {
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

    //Skipped due to the bug - https://jira.pitneycloud.com/browse/SPSS-3632
    it.skip(`<@platform_e2e><@platform_ppd>TC009 - Verify Inactive cost account should not display in add user popup`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const activeToInactiveCostAccount = {
            name: 'Auto_activeToInactiveCA' + uniqueNum,
            code: 'Auto_activeToInactiveCA' + uniqueNum,
            description: 'Auto_activeToInactiveCA',
            shareLevel: 'enterprise',
            active: false
        };
        cy.addCostAccount(activeToInactiveCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(activeToInactiveCostAccount.name);
        cy.editActiveToInactiveCostAccount(activeToInactiveCostAccount);
        cy.navigateToUserManagementPage();
        cy.clickAddUser();
        cy.selectLocation();
        cy.verifyInactiveCANotPresentInAddUser(activeToInactiveCostAccount.name);
        cy.deleteCostAccountViaAPI();
    });

    if (Cypress.env('appEnv').includes('fed') === false) {
        it.skip(`<@almCostAccounts>TC006 - Enterprise level inactive cost account should not display for Division and Location level client`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueNum = `${uuidGenerator()}`;
            const activeToInactiveCostAccount = {
                name: 'Auto_activeToInactiveCA' + uniqueNum,
                code: 'Auto_activeToInactiveCA' + uniqueNum,
                description: 'Auto_activeToInactiveCA',
                shareLevel: 'enterprise',
                active: false
            };
            cy.deleteSearchedAccountIfMoreThanOne('Auto_activeToInactiveCA');
            cy.addCostAccount(activeToInactiveCostAccount);
            cy.saveCostAccount();
            cy.searchCostAccount(activeToInactiveCostAccount.name);
            cy.editActiveToInactiveCostAccount(activeToInactiveCostAccount);
            cy.searchInactiveCostAccount(activeToInactiveCostAccount.name);
            cy.selectInactiveAccountsCheckBox();
            cy.searchCostAccount(activeToInactiveCostAccount.name);
            cy.logoutUser();

            cy.getUsers().then((divisionAdminUser) => {
                const { username, password } = divisionAdminUser.divisionAdminUser;
                if (Cypress.env('appEnv').includes('fed') === true)
                    adminConsoleHelpers.loginViaUrl(username, password);
                else {
                    adminConsoleHelpers.loginCC(username, password);
                }
            });
            cy.navigateToCostAccountPage();
            cy.selectInactiveAccountsCheckBox();
            cy.searchCostAccount(activeToInactiveCostAccount.name);
            cy.logoutUser();

            cy.getUsers().then((locationAdminUser) => {
                const { username, password } = locationAdminUser.locationAdminUser;
                if (Cypress.env('appEnv').includes('fed') === true)
                    adminConsoleHelpers.loginViaUrl(username, password);
                else {
                    adminConsoleHelpers.loginCC(username, password);
                }
            });
            cy.navigateToCostAccountPage();
            cy.selectInactiveAccountsCheckBox();
            cy.searchCostAccount(activeToInactiveCostAccount.name);
            cy.logoutUser();
            cy.getUsers().then((users) => {
                const { username, password } = users.clientAdminUser;
                if (Cypress.env('appEnv').includes('fed') === true)
                    adminConsoleHelpers.loginViaUrl(username, password);
                else {
                    adminConsoleHelpers.loginCC(username, password);
                }
            });
            cy.deleteCostAccountViaAPI();
        });
    }

    it(`<@almCostAccounts>TC010 - Verify Cost Account should not be created with duplicate account id, Code`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCostAccountWithDuplicateCode = {
            name: 'CAWithDuplicateCode' + uniqueNum,
            code: 'AutoCA' + uniqueNum,
            description: 'desc text',
            shareLevel: 'enterprise'
        };
        const newCostAccountWithDuplicatename = {
            name: 'AutoCA' + uniqueNum,
            code: 'CAWithDuplicateCode' + uniqueNum,
            description: 'desc text',
            shareLevel: 'enterprise'
        };
        const newCostAccount = {
            name: 'AutoCA' + uniqueNum,
            code: 'AutoCC' + uniqueNum,
            description: 'desc text',
            shareLevel: 'enterprise'
        };
        cy.deleteSearchedAccountIfMoreThanOne('AutoCA');
        cy.addCostAccount(newCostAccount);
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

    it(`<@almCostAccounts>TC011 - Sorting in Cost Account Grid`, function () {
        //2 - Cost Account Name, 3 - Code, 5 - Share Level At, 6 - Share Level Entities Count
        //Note: No Sorting icon for Description column

        cy.clickOnAscendingOrDescendingIcon('Ascending', 2);
        cy.checkDataInAscendingOrderOrNot(2);
        cy.clickOnAscendingOrDescendingIcon('Descending', 2);
        cy.checkDataInDescendingOrderOrNot(2);

        cy.clickOnAscendingOrDescendingIcon('Ascending', 3);
        cy.checkDataInAscendingOrderOrNot(3);
        cy.clickOnAscendingOrDescendingIcon('Descending', 3);
        cy.checkDataInDescendingOrderOrNot(3);

        cy.clickOnAscendingOrDescendingIcon('Ascending', 5);
        cy.checkDataInAscendingOrderOrNot(5);
        cy.clickOnAscendingOrDescendingIcon('Descending', 5);
        cy.checkDataInDescendingOrderOrNot(5);

        cy.clickOnAscendingOrDescendingIcon('Ascending', 6);
        cy.checkDataInAscendingOrderOrNot(6);
        cy.clickOnAscendingOrDescendingIcon('Descending', 6);
        cy.checkDataInDescendingOrderOrNot(6);
    });

    it(`<@almCostAccounts>TC012 - Add Cost Account with Billable and Password Enabled`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentBillablePassword' + uniqueNum,
            code: 'Auto_ParentBillablePassword' + uniqueNum,
            description: 'Auto_ParentBillablePassword',
            shareLevel: 'enterprise',
        };

        const subCostAccount = {
            name: 'Auto_SubCA' + uniqueNum,
            code: 'Auto_SubCA' + uniqueNum,
            description: 'Auto_SubCA',
            shareLevel: 'enterprise'
        };

        const subSubCostAccount = {
            name: 'Auto_SubSubCA' + uniqueNum,
            code: 'Auto_SubSubCA' + uniqueNum,
            description: 'Auto_SubSubCA',
            shareLevel: 'enterprise'
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

    it(`<@almCostAccounts>TC013 - Edit Sub Cost Account Description and change the access level from enterprise to Division`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentCATC013' + uniqueNum,
            code: 'Auto_ParentCATC013' + uniqueNum,
            description: 'Auto_ParentCATC013',
            shareLevel: 'enterprise',
        };

        const subCostAccount = {
            name: 'Auto_SubCATC013' + uniqueNum,
            code: 'Auto_SubCATC013' + uniqueNum,
            description: 'Auto_SubCATC013',
            shareLevel: 'enterprise'
        };

        const subSubCostAccount = {
            name: 'Auto_SubSubCATC013' + uniqueNum,
            code: 'Auto_SubSubCATC013' + uniqueNum,
            description: 'Auto_SubSubCATC013',
            shareLevel: 'enterprise'
        };
        cy.addCostAccount(parentCostAccount);
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

    it(`<@almCostAccounts>TC014 - Edit Sub Sub Cost Account[Names should be same] by changing from Active to Inactive and vice versa`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const parentCostAccount = {
            name: 'Auto_ParentCATC014' + uniqueNum,
            code: 'Auto_ParentCATC014' + uniqueNum,
            description: 'Auto_ParentCATC014',
            shareLevel: 'enterprise',
            active: false
        };

        const subCostAccount = {
            name: 'Auto_ParentCATC014' + uniqueNum,
            code: 'Auto_ParentCATC014' + uniqueNum,
            description: 'Auto_ParentCATC014',
            shareLevel: 'enterprise',
            active: false
        };

        const subSubCostAccount = {
            name: 'Auto_ParentCATC014' + uniqueNum,
            code: 'Auto_ParentCATC014' + uniqueNum,
            description: 'Auto_ParentCATC014',
            shareLevel: 'enterprise',
            active: false
        };
        cy.addCostAccount(parentCostAccount);
        cy.saveCostAccount();

        cy.searchCostAccount(parentCostAccount.code);
        cy.addSubCostAccount(subCostAccount);
        cy.addAndCloseInAddSubCostAccount();

        cy.searchCostAccount(subCostAccount.name);
        cy.wait(1000);
        cy.addSubSubCostAccount(subSubCostAccount);
        cy.addAndCloseInAddSubCostAccount();

        cy.searchCostAccount(subSubCostAccount.code);
        cy.get(formControls.costAccounts_SearchResultRow1)
            .and('include.text', parentCostAccount.name)
            .and('include.text', subCostAccount.name)
            .and('include.text', subSubCostAccount.name);

        cy.clickOnEditIconOfSubCA();
        cy.updateDescirption("updateDesc");
        cy.clickSaveBtn();

        cy.searchCostAccount(subSubCostAccount.name);
        cy.clickOnEditIconOfSubSubCA();
        cy.activeToInactiveCostAccount(subSubCostAccount);
        cy.searchCostAccount(subSubCostAccount.name);
        cy.expandRowInGrid();
        cy.clickOnEditIconOfSubSubCA();
        cy.verifyInactiveRadioBtnSelectedInEditCA();
        cy.deleteCostAccountViaAPI();
    });
});
