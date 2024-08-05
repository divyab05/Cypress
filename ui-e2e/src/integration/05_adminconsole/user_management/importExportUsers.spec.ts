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

  const userIds = ['00u1er0uvek2dlVNh0h8', '00u1er0wovvxW1XVf0h8', '00u1fi7dd1uX8vGmR0h8', '00u1fi766udNngpwq0h8', '00u1n4k4knukBW7fM0h8', '00u1n4k3kyuzJ1AXp0h8'];

  it(`<@platform_e2e><@platform_ppd>TC001 - Enterprise Admin - Import new user with Enterprise access level`, function () {
    const personalDetails = {
      firstName: 'Import Auto',
      lastName: 'lastname1',
      Role: 'ADMIN',
      Division: 'Import Auto Division',
      BPN: '123r4t56y',
      Location: 'Import Auto Location',
      email: 'importautopl005@yopmail.com',
      email2: 'importautopl006@yopmail.com',
      password: 'Horizon#123'
    };
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
    cy.importMultipleUsers('adminconsole/testData/UserImport/User_Import.csv', 'enterprise');
    cy.waitForImportUserToastMessage();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Enterprises');
    cy.waitForSpinners();
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
  });


  it(`<@platform_e2e><@platform_ppd>TC002 - Enterprise Admin - Import new user with User access level`, function () {
    const personalDetails = {
      firstName: 'Import Auto',
      lastName: 'lastname1',
      Role: 'ADMIN',
      Division: 'Import Auto Division',
      BPN: '123r4t56y',
      Location: 'Import Auto Location',
      email: 'importautopl005@yopmail.com',
      email2: 'importautopl006@yopmail.com',
      password: 'Horizon#123'
    };
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
    cy.importMultipleUsers('adminconsole/testData/UserImport/User_Import.csv', 'user');
    cy.waitForImportUserToastMessage();
    //cy.callAccountClaimAPIForImportUser(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');
    cy.waitForSpinners();
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
  });

  it(`<@promote_qa @platform_e2e><@platform_ppd>TC003 - Enterprise Admin - Import new user with Division access level`, function () {
    const personalDetails = {
      firstName: 'Import Auto',
      lastName: 'lastname',
      Role: 'ADMIN',
      Division: '001Auto Division Import',
      BPN: '123r4t56y',
      Location: 'Import Auto Location',
      email: 'importautopl005@yopmail.com',
      email2: 'importautopl006@yopmail.com',
      password: 'Horizon#123'
    };
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
    cy.clickOnImportUsersButton();
    cy.selectDivisionLevelInImportUsersPopup('division', personalDetails);
    cy.importUsersWithDivisionOrLocationAccessLevel('adminconsole/testData/UserImport/User_Import.csv');
    cy.waitForImportUserToastMessage();
    //cy.callAccountClaimAPIForImportUser(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Division');
    cy.waitForSpinners();
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
  });

  it(`<@platform_e2e><@platform_ppd>TC004 - Enterprise Admin - Import new user with Location access level`, function () {
    const personalDetails = {
      firstName: 'Import Auto',
      lastName: 'lastname1',
      Role: 'ADMIN',
      Division: '001Auto Division Import',
      BPN: '123r4t56y',
      Location: 'Import Auto Location',
      email: 'importautopl005@yopmail.com',
      email2: 'importautopl006@yopmail.com',
      password: 'Horizon#123'
    };
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
    cy.clickOnImportUsersButton();
    cy.selectLocationLevelInImportUsersPopup('location', personalDetails);
    cy.importUsersWithDivisionOrLocationAccessLevel('adminconsole/testData/UserImport/User_Import.csv');
    cy.waitForImportUserToastMessage();
    //cy.callAccountClaimAPIForImportUser(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Location');
    cy.waitForSpinners();
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
  });

  it.skip(`<@promote_qa @platform_e2e><@platform_ppd>TC005 - Enterprise Admin - Import new user with new location in Enterprise access level`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: 'Import Auto' + uniqueName,
      lastName: 'lastname1',
      Role: 'ADMIN',
      Division: 'Import Auto Division',
      BPN: 'AutoBPN' + uniqueName,
      Location: 'Import Auto Location' + uniqueName,
      email: uniqueName + '@mailinator.com',
      password: 'Horizon#123',
      company: 'Pitney Bowes',
      customerAddress: '265 12 ST',
      city: 'ONTARIO PLACE',
      zipCode: 'M8V 3Z6',
      country: 'Canada',
      email2: 'importautopl006@yopmail.com'
    };
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
    cy.createDataForImportUsersFile('adminconsole/testData/UserImport/User_Import_NewLocation.csv', personalDetails);
    cy.importMultipleUsers('adminconsole/testData/UserImport/User_Import_NewLocation.csv', 'enterprise');
    cy.waitForImportUserToastMessage();
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'Location');
    cy.waitForSpinners();
    cy.clickDeleteUserFromGrid();
    cy.verifyIfDeleteUserPresent(personalDetails);
    cy.deleteSearchedUserIfMoreThanOne(personalDetails.email2);
  });

  it(`<@promote_qa @platform_e2e><@platform_ppd>TC006 - Export users`, function () {
    //Search Email button present by default for Fedramp Users
    //Search Email button present only if enterprise has more than 900 users in Commercial
    if (Cypress.env('appEnv').includes('fed') === true) {
      cy.verifySearchEmailPresentInUsersPage();
    }
    cy.exportUser();
    cy.getJobIdForExportUser();
    cy.verifyUserExport();
  });

  it.skip(`<@platform_e2e>TC007 - Verify Search Email present if Enterprise has more than 900 users and Open search should present if it has less than 900 users in Commercial`, function () {
    cy.getUsers().then((users) => {
      if (Cypress.env('appEnv').includes('fed') === true) {
        const { username, password } = users.enterpriseAdminUser_UserPersona;
        adminConsoleHelpers.loginCC(username, password);
      }
    });
    interceptsUserManagementApiCalls();
    cy.navigateToUserManagementPage();
    cy.verifySearchEmailPresentInUsersPage();
    cy.logoutUser();

    if (Cypress.env('appEnv').includes('fed') === false) {
      cy.getUsers().then((users) => {
        const { username, password } = users.enterpriseAdminUser;
        adminConsoleHelpers.loginCC(username, password);
      });
      interceptsUserManagementApiCalls();
      cy.navigateToUserManagementPage();
      cy.verifySearchEmailNotPresentInUsersPage();
    }
  });

});
