///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsUserManagementApiCalls } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';
import { AdminApi } from "../../../support/adminPortal/adminApi";

describe('Test Suite :: Admin User - Add User', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const clientUser = config[Cypress.env('appEnv')]['client_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();
    const enterprise = 'Plan Definition Automation';
    const doorKeeper = new DoorKeeperOnboarding();

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsSelectEnterprise();
        interceptsUserManagementApiCalls();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueNum = `${uuidGenerator()}`;

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC001 - Add new user with User access level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `1Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'pspro' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'user');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('admin-ppd');
        Helpers.log(`Flag value is ${flag}`);
        if (!flag) {
            helpers.loginInToClientConsole(personalDetails.email, personalDetails.password);
            adminCommands.verifyUserAccessValidation();
            helpers.logoutUser();
            helpers.loginAdminConsole(user.userEmail, user.password);
        }
        cy.get('@userID').then(userID => {
        new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
        });
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC002 - Add new user with Enterprise access level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `2Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'pspro' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'enterprise');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
        Helpers.log(`Flag value is ${flag}`);
        if (!flag) {
            helpers.loginInToClientConsole(personalDetails.email, personalDetails.password);
            adminCommands.verifyEnterpriseAccessValidation();
            helpers.logoutUser();
            helpers.loginAdminConsole(user.userEmail, user.password);
        }
      cy.get('@userID').then(userID => {
        new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
      });
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC003 - Add new user with Division access level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `2Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'pspro' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'division');
        adminCommands.selectDivision();
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
        Helpers.log(`Flag value is ${flag}`);
        if (!flag) {
            helpers.loginInToClientConsole(personalDetails.email, personalDetails.password);
            adminCommands.verifyDivisionAccessValidation();
            helpers.logoutUser();
            helpers.loginAdminConsole(user.userEmail, user.password);
        }
        cy.get('@userID').then(userID => {
          new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
      });
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC004 - Add new user with Location access level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `2Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'pspro' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'location');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectAdminLocation();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
        Helpers.log(`Flag value is ${flag}`);
        if (!flag) {
            helpers.loginInToClientConsole(personalDetails.email, personalDetails.password);
            adminCommands.verifyLocationAccessValidation();
            helpers.logoutUser();
            helpers.loginAdminConsole(user.userEmail, user.password);
        }
        cy.get('@userID').then(userID => {
          new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
      });

    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC005 -  Export users`, function () {
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.usersExport(enterprise);
        adminCommands.verifyExportUsers();
    });

    it.skip(`<@promote_ppd><@admin_reg_e2e>TC006 - Verify Email Fields is not Editable In Edit User Modal,
                                            Update User's Location from One Loc to Another in Edit Modal and Validate,
                                            Update User's Carrier Asisnment from One to Another in Edit Modal and Validate,
                                            Update User's Cost Account from One to Another in Edit Modal and Validate`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `2Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'pspro' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'location');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectAdminLocation();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        adminCommands.clickOnEditUserButton();
        adminCommands.verifyFieldsAreNotEditableInClientSetupAddUser();
        adminCommands.clickOnCloseIcon();
        adminCommands.clickOnEditUserButton();
        adminCommands.selectAdminLocation();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        cy.get('@userID').then(userID => {
          new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
        });
    });

    it('<@admin_reg_e2e>TC007 - Client User - Invited status =>New user with same email id should not get created', function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `2Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'TC006' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'enterprise');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'enterprise');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.validateDuplicateUserErrorMessage(personalDetails.email);
        cy.get('@userID').then(userID => {
          new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
        });
    });

    it('<@admin_reg_e2e>TC008 - Client User - Active status =>New user with same email id should not get created', function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `2Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: clientUser.userEmail,
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'enterprise');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.validateDuplicateUserErrorMessage(personalDetails.email);
    });

    it('<@admin_reg_e2e>TC009 - Inactive status-New user with same email id should not get created', function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `1Auto${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'pspro' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'user');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        adminCommands.clickOnEditUserButton();
        adminCommands.changeActiveToInactiveAdminUser();
        adminCommands.saveAndCloseWhenAddingEnterpriseUser();

        adminCommands.addUsers(personalDetails, 'user');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.validateDuplicateUserErrorMessage(personalDetails.email);
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.clickDeleteUserFromGrid();
        adminCommands.verifyIfDeleteUserPresent(personalDetails);
    });

    it(`<@admin_reg_e2e>TC010 - Client User - Deleted status    New user with same email id should get created and Login should work`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `Platform${uuidGenerator()}`;
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: 'auto' + uniqueName + '@mailinator.com',
            password: 'Horizon#123'
        };
        Helpers.log('------------------------------Test starts here-------------------------------');
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'user');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.clickDeleteUserFromGrid();
        adminCommands.verifyIfDeleteUserPresent(personalDetails);
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageUsers();
        adminCommands.addUsers(personalDetails, 'user');
        adminCommands.selectRoleFromAssignRoleDropDown();
        adminCommands.selectLocationFromDropDown();
        adminCommands.clickOnSaveAndCloseInAddUserModal();
        adminCommands.callAccountClaimAPI_ClientUser();
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.searchUser, personalDetails.email);
        adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC011 - Download the Sample file in Users Page and Download the Processed and ProcessedError Files inside Job Status modal`, function () {
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab("Business Rule Automation")
        adminCommands.navigateToManageUsers();
        adminCommands.downloadSampleFile_User();
        adminCommands.downloadFileInsideJobStatusInUser("Processed", "Business Rule Automation");
    });
});
