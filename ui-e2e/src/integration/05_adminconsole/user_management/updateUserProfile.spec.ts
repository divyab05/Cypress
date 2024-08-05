///<reference types="cypress" />
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../../../support/helpers';

describe('Test Suite :: User Management', () => {
  let username;
  beforeEach(() => {
    cy.getUsers().then((users) => {
      const { username, password } = users.clientAdminUser;
      if (Cypress.env('appEnv').includes('fed') === true)
        adminConsoleHelpers.loginViaUrl(username, password);
      else {
        adminConsoleHelpers.loginCC(username, password);
      }
    });
    interceptsUserManagementApiCalls();
    cy.navigateToUserManagementPage();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  if (Cypress.env('appEnv').includes('fed') === false) {
    it('<@platform_e2e>TC001 - Inactive and activate enterprise user', function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `Auto${uuidGenerator()}`;
      const personalDetails = {
        firstName: uniqueName,
        lastName: 'User',
        displayName: uniqueName,
        email: 'psp' + uniqueName + '@mailinator.com',
        password: 'Horizon#123'
      };
      cy.clickAddUser();
      cy.addPersonalDetails(personalDetails, 'enterprise');
      cy.selectRole();
      cy.selectLocation();
      cy.clickSaveBtn();
      cy.callAccountClaimAPI(personalDetails);
      cy.getNewUserAuthenticateAPI(personalDetails);
      cy.reload();
      cy.searchUser(personalDetails);
      cy.clickEditUserBtn();
      cy.inactiveUser();
      cy.verifyUserDetailsInGrid('INACTIVE', 'Enterprises');
      cy.activateUser();
      cy.clickDeleteUserFromGrid();
      cy.verifyIfDeleteUserPresent(personalDetails);
    });
  }

  it('<@platform_e2e>TC002- Update and delete active division user details', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'pspro' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'division');
    cy.selectDivision();
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Divisions');
    let flag = Cypress.env('appEnv').includes('fed') === false || Cypress.env('appEnv').includes('ppd') === false
    if (!flag) {
      cy.callAccountClaimAPI(personalDetails);
      cy.getNewUserAuthenticateAPI(personalDetails);
      cy.reload();
      cy.searchUser(personalDetails);
      cy.verifyUserDetailsInGrid('ACTIVE', 'Divisions');
    }
    cy.clickEditUserBtn();
    cy.clickAccessLevel('location');
    cy.selectAdminLocation();
    cy.get("#false").click();
    cy.get("#true").click();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.wait(3000);
    cy.searchUser(personalDetails);
    if (!flag)
      cy.verifyUserDetailsInGrid('ACTIVE', 'Locations');
    else
      cy.verifyUserDetailsInGrid('INVITED', 'Locations');
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
  });

  it('<@platform_e2e>TC003 - Resend link verification', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'pspro' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'user');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');

    if (Cypress.env('appEnv').includes('fed') === false) {
      cy.clickResendEmailLink();
      // cy.callAccountClaimAPI(personalDetails);
      cy.getNewUserAuthenticateAPI(personalDetails);
      cy.reload();
      cy.searchUser(personalDetails);
      cy.verifyUserDetailsInGrid('ACTIVE', 'User');
      cy.checkResendEmailLink();
    } else {
      cy.clickResetPasswordLink();
    }
  });

  it('<@platform_e2e>TC004 - Enterprise Admin - Add new user with Enterprise access level and update to User Access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psent' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'enterprise');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');
    //Editing Access level from Enterprise to User
    cy.clickEditUserBtn();
    cy.clickAccessLevel('user');
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');
    const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag1) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyUserAccessValidation();
    }
    //cy.verifyDeleteUser();We will fix this later once we find the solution for USER ACCESS LEVEL.
  });

  it('<@platform_e2e>TC005 - Enterprise Admin - Add new user with Division access level and update to User Access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psent' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'division');
    cy.selectDivision();
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Divisions');
    //Editing Access level from Division to User
    cy.clickEditUserBtn();
    cy.clickAccessLevel('user');
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');
    const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag1) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyUserAccessValidation();
    }
    //cy.verifyDeleteUser(); We will fix this later once we find the solution for USER ACCESS LEVEL.
  });

  it('<@platform_e2e>TC006 - Enterprise Admin - Add new user with Location access level and update to User Access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psent' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'location');
    cy.selectRole();
    cy.selectAdminLocation();
    //Select the Location from the dropdown
    cy.get(formControls.selectLocationDropdown).click({ force: true });
    cy.get(formControls.selectLocationDropdown).click()
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Locations');
    //Editing Access level from Enterprise to User
    cy.clickEditUserBtn();
    cy.clickAccessLevel('user');
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');
    const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag1) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyUserAccessValidation();
    }
    //cy.verifyDeleteUser(); We will fix this later once we find the solution for USER ACCESS LEVEL.
  });

  it('<@platform_e2e>TC007 - Client user - Active status =>New client user with same email id should not get created', function () {
    cy.getUsers().then((users) => {
      if (Cypress.env('appEnv').includes('fed') === true)
        username = users.divisionAdminUser_UserPersona.username;
      else {
        username = users.divisionNotificationUser.username;
      }
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `Auto${uuidGenerator()}`;
      const personalDetails = {
        firstName: uniqueName,
        lastName: 'User',
        displayName: uniqueName,
        email: username,
        password: 'Horizon#123'
      };

      cy.clickAddUser();
      cy.addPersonalDetails(personalDetails, 'enterprise');
      cy.selectRole();
      cy.selectLocation();
      cy.clickSaveBtn();
      cy.validateDuplicateUserErrorMessage(personalDetails);
    });
  });

  if (!Cypress.env('appEnv').includes('fed-qa') === true) {
    it('<@platform_e2e>TC008 - Client user - Inactive status =>New user with same email id should not get created', function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `Auto${uuidGenerator()}`;
      const personalDetails = {
        firstName: uniqueName,
        lastName: 'User',
        displayName: uniqueName,
        email: 'TC008' + uniqueName + '@mailinator.com',
        password: 'Horizon#123'
      };

      cy.clickAddUser();
      cy.addPersonalDetails(personalDetails, 'enterprise');
      cy.selectRole();
      cy.selectLocation();
      cy.clickSaveBtn();
      cy.waitForSpinnerIcon();
      const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
      if (!flag1) {
        cy.callAccountClaimAPI(personalDetails);
        cy.getNewUserAuthenticateAPI(personalDetails);
        cy.navigateToCostAccountOnSamePage();
        cy.navigateToUserManagementOnSamePage();
      }
      cy.searchUser(personalDetails);
      if (!flag1)
        cy.verifyUserDetailsInGrid('ACTIVE', 'Enterprises');
      else
        cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');
      cy.searchUser(personalDetails);
      cy.clickEditUserBtn();
      cy.inactiveUser();
      cy.verifyUserDetailsInGrid('INACTIVE', 'Enterprises');
      cy.clickAddUser();
      cy.addPersonalDetails(personalDetails, 'enterprise');
      cy.selectRole();
      cy.selectLocation();
      cy.clickSaveBtn();
      cy.validateDuplicateUserErrorMessage(personalDetails);
      cy.activateUser();
      cy.clickDeleteUserFromGrid();
      cy.verifyIfDeleteUserPresent(personalDetails);
    });
  }

  it('<@platform_e2e>TC009 - Client user - Invited status =>New user with same email id should not get created', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'TC008' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };

    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'enterprise');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.waitForSpinnerIcon();

    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');

    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'enterprise');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.validateDuplicateUserErrorMessage(personalDetails);

    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
  });

  it.skip('<@platform_e2e>TC010 - Client user - Deleted =>New user with same email id should  get created and Login should work', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'TC008' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };

    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'enterprise');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');
    const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag1) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyEnterpriseAccessValidation();
    }
    cy.verifyDeleteUser();
    if (!flag1) {
      cy.logoutUser();
      Helpers.log("Users gets deleted successfully");
      cy.getUsers().then((users) => {
        const { username, password } = users.clientAdminUser;
        adminConsoleHelpers.loginCC(username, password);
      });
      interceptsUserManagementApiCalls();
      cy.navigateToUserManagementPage();
    }
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'enterprise');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');
    const flag2: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag2) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyEnterpriseAccessValidation();
    }

  });
});


