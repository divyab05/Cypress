///<reference types="cypress" />
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';

describe('Test Suite :: User Management', () => {

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

  it('<@platform_e2e>TC001 - Enterprise Admin - Add new user with User access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psuser' + uniqueName + '@yopmail.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'user');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyUserAccessValidation();
    }
    //cy.verifyDeleteUser();We will fix this later once we find the solution for USER ACCESS LEVEL.
    if (!flag)
      cy.logoutUser();
  });

  it('<@platform_e2e>TC002 - Enterprise Admin - Add new user with Division access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psDiv' + uniqueName + '@mailinator.com',
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
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyDivisionAccessValidation();
    }
    cy.verifyDeleteUser();
    if (!flag)
      cy.logoutUser();
  });

  it('<@promote_qa @platform_e2e>TC003 - Enterprise Admin - Add new user with Enterprise access level', function () {
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
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyEnterpriseAccessValidation();
    }
    cy.verifyDeleteUser();
    if (!flag)
      cy.logoutUser();
  });

  it('<@platform_e2e>TC004 - Enterprise Admin - Add new user with Location access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psloc' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'location');
    cy.selectRole();
    cy.selectAdminLocation();
    cy.get('body').click(700, 147);//Adding this command for temp. Will fix it later
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Locations');
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyLocationAccessValidation();
    }
    cy.verifyDeleteUser();
    if (!flag)
      cy.logoutUser();
  });

});
