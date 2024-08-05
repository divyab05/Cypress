import { formControls } from '../../fixtures/adminconsole/formControls.json';
import { format } from 'util';
import { Helpers } from '../helpers';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    //create .d.ts definitions file to get autocomplete.
    interface Chainable<Subject> {
      navigateToUserManagementPage(): void;
      clickAddUser(): void;
      addPersonalDetails(personalDetails: any, accessLevel: any): void;
      selectRole(): void;
      selectDivision(): void;
      selectLocation(): void;
      selectCostAccount(): void;
      selectAdminLocation(): void;
      clickSaveBtn(): void;
      searchUser(personalDetails: any): void;
      searchUserByName(personalDetails: any): void;
      verifySearchEmailPresentInUsersPage(): void;
      verifySearchEmailNotPresentInUsersPage(): void;
      verifyUserDetailsInGrid(UserStatus: any, UserType: any, Email?: any): void;
      callAccountClaimAPI(personalDetails: any): void;
      getNewUserAuthenticateAPI(personalDetails: any): void;
      verifyUserAccessValidation(): void;
      verifyEnterpriseAccessValidation(): void;
      verifyDivisionAccessValidation(): void;
      verifyLocationAccessValidation(): void;
      verifyDeleteUser(): void;
      clickDeleteUserFromGrid(): void;
      verifyIfDeleteUserPresent(personalDetails: any): void;
      logoutUser(): void;
      loginWithNewUser(personalDetails: any): void;
      clickOnSettingsButtonInCostAccount(): void;
      waitForSpinnerIcon(): void;
      importMultipleUsers(filePath: string, accessLevel): void;
      deleteUsersViaAPI(userids: any): void;
      waitForImportUserToastMessage(): void;
      callAccountClaimAPIForImportUser(personalDetails: any): void;
      createDivisionViaAPI(newdivision: string): void;
      getSubId(): void;
      getEnterpriseId(): void;
      clickOnImportUsersButton(): void;
      selectDivisionLevelInImportUsersPopup(accessLevel: string, personalDetails: any): void;
      importUsersWithDivisionOrLocationAccessLevel(filePath: string): void;
      createDataForImportUsersFile(filePath: string, locdetail: any): void;
      selectLocationLevelInImportUsersPopup(accessLevel: string, personalDetails: any): void;
      clickEditUserBtn(): void;
      inactiveUser(): void;
      activateUser(): void;
      clickResendEmailLink(): void;
      checkResendEmailLink(): void;
      clickAccessLevel(accessLevel): void;
      clickResetPasswordLink(): void;
      clickOnImportUserAndSelectAccessLevel(accessLevel: any): void;
      verifyFieldsAreNotEditableInClientSetupAddUser(): void;
      clickOnCloseIcon(): void;
      selectAdminLocationByPosition(position: string[]): void;
      verifyAccessLevelInGrid(accessLevel: any, count: any): void;
      ClickOnCarrierDropdownInAddUser(carrierName: string): void;
      selectOptionInCostAccountInAddUser(costAccountToSelect: string): void;
      validateCarrierOption(expectedCarrierName: string): void;
      validateCostAccountOption(expectedCostAccountName: string): void;
      selectRoleFromDropdown(roleToSelect: string): void;
      verifyRolesInUserDetailsGrid(userRole: any): void;
      addNewUser(personalDetails: any): void;
      validateDuplicateUserErrorMessage(personalDetails: any): void;
      deleteSearchedUserIfMoreThanOne(userName: string): void;
      navigateToUserManagementOnSamePage(): void;
      verifyCostAccHierarchyInUsersPage(): void;
      exportUser(): void;
      getJobIdForExportUser(): void;
      verifyUserExport(): void;
      downloadSampleFile_User(): void;
      downloadFileInsideJobStatusInUser(processingErrorOrProcessed: string): void;
    }
  }
}

export var userResponse = null;
export var subId = null;
export var enterprise_Id = null;
export var expectedDuplicateUserCreationAlert = "Invalid request: User already exists";

Cypress.Commands.add('validateDuplicateUserErrorMessage', (personalDetails: any) => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.duplicateCostAccountErrorModal).invoke('text').then(actualDuplicateUserErrorMessage => {
    assert.equal(expectedDuplicateUserCreationAlert, actualDuplicateUserErrorMessage, 'Verified the Error Message');
  });
  cy.get(formControls.closeIconInAlertModal).click().wait(1000);
  cy.waitForSpinnerIcon();
  cy.get(formControls.closeButton).click({ force: true });
});

Cypress.Commands.add('navigateToUserManagementPage', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
  cy.get(formControls.manageUsersLink).contains('Users').click({ force: true }).wait(5000);
});

Cypress.Commands.add('navigateToUserManagementOnSamePage', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.userAndAccessLink).click().wait(1000);
});

Cypress.Commands.add('clickAddUser', () => {
  cy.get(formControls.addUserBtn).click().wait(1000);
});

Cypress.Commands.add('addPersonalDetails', function (personalDetails: any, accessLevel: any) {
  cy.get(formControls.firstName)
    .type(personalDetails.firstName)
    .get(formControls.lastName)
    .type(personalDetails.lastName)
    .get(formControls.emailId)
    .type(personalDetails.email);
  cy.get('#' + accessLevel + ' .mat-radio-input')
    .should('not.be.visible')
    .check({ force: true })
    .should('be.checked');
});

Cypress.Commands.add('clickAccessLevel', (accessLevel: any) => {
  cy.get('#' + accessLevel + ' .mat-radio-input')
    .should('not.be.visible')
    .check({ force: true })
    .should('be.checked');
});

Cypress.Commands.add('selectDivision', () => {
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.selectDivisionDrpDown, { timeout: 5000 })
    .click()
    .get(formControls.selectDivision, { timeout: 5000 })
    .click({ force: true })
    .wait(2000)
    .get(formControls.selectDivisionDrpDown, { timeout: 5000 }).should('be.visible')
    .click()
    .wait(1000);
});

Cypress.Commands.add('selectRole', () => {
  cy.wait(1000);
  cy.get(formControls.assignRole).scrollIntoView().should('be.visible');
  cy.get(formControls.assignRole)
    .click()
    .get(formControls.selectRole)
    .first()
    .click({ force: true })
    .get(formControls.assignRole)
    .click()
    .wait(1000);
});

Cypress.Commands.add('selectLocation', () => {
  cy.get(formControls.selectLocationDropdown).click().get(formControls.selectLocation).first().click({ force: true });
});

Cypress.Commands.add('selectAdminLocation', () => {
  cy.get(formControls.selectAdminLocationDropdown).click().get(formControls.selectAdminLocation).click({ force: true });
});

Cypress.Commands.add('selectCostAccount', () => {
  cy.get(formControls.selectCostAccount).click();
});

Cypress.Commands.add('clickSaveBtn', () => {
  cy.wait(2000).get(formControls.saveCloseBtn).click({ force: true });
  cy.waitForSpinnerIcon();
  cy.waitForSpinners();
  cy.wait(2000);//Added this Hard wait as we dont have Toast message - created bug -https://pbapps.atlassian.net/browse/SPSS-8729
});

Cypress.Commands.add('clickEditUserBtn', () => {
  cy.get(formControls.editUserLink).click();
});

Cypress.Commands.add('callAccountClaimAPI', function (personalDetails: any) {
  getDataFromUserByEmailAPI().then(async (interception) => {
    userResponse = JSON.parse(JSON.stringify(interception.response.body));
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd') || Cypress.env('appEnv').includes('prod');
    if (!flag) {
      verifyAccountClaim(userResponse.token);
      cy.wait(2000);
    }
  });
});

function getDataFromUserByEmailAPI(): any {
  return cy.wait('@addUser').then(function (response) {
    return response;
  });
  cy.wait('@addUser').then(async (interception) => {
    //const userResponse = JSON.parse(JSON.stringify(interception.response.body));
    //const userToken = userResponse.token;
    //const userId = userResponse.userID;
    //Helpers.log(userToken);
    return interception.response.body;
  });
}

Cypress.Commands.add('searchUser', function (personalDetails: any) {
  if (Cypress.env('appEnv').includes('fed') === true) {
    cy.verifySearchEmailPresentInUsersPage();
  }
  cy.get(formControls.searchUser, { timeout: 9000 }).clear().type(personalDetails.email).get(formControls.searchBtnUser).click();
});

Cypress.Commands.add('searchUserByName', function (personalDetails: any) {
  cy.get(formControls.searchUser, { timeout: 9000 }).clear().type(personalDetails.firstName).get(formControls.searchBtnUser).click();
});

Cypress.Commands.add('verifySearchEmailPresentInUsersPage', function () {
  cy.get(formControls.searchEmailPlaceholderText, { timeout: 9000 }).should('be.visible');
  cy.get(formControls.searchBtnUser, { timeout: 9000 }).should('be.visible').invoke('text').then((actualText) => {
    expect(actualText.trim()).to.be.equal('Search Email');
  })
});

Cypress.Commands.add('verifySearchEmailNotPresentInUsersPage', function () {
  cy.get(formControls.searchEmailPlaceholderText, { timeout: 9000 }).should('not.exist');
  cy.get(formControls.searchBtnUser, { timeout: 9000 }).should('be.visible').invoke('text').then((actualText) => {
    expect(actualText).to.be.equal('Search');
  })
});

function verifyAccountClaim(tokenId: string) {
  cy.request({
    method: 'POST',
    url: 'https://login2-api-stg.saase2e.pitneycloud.com/loginServices/v2/account/claim', // baseUrl is prepend to URL
    form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
    headers: {
      Origin: 'https://login2-stg.saase2e.pitneycloud.com',
      'Content-type': 'application/json'
    },
    body: {
      password: 'Horizon#123',
      passwordConfirmation: 'Horizon#123',
      token: tokenId
    }
  }).then((response) => {
    // response.body is automatically serialized into JSON
    expect(response.status).to.eq(200);
    const userStatus = response.body.userInformation.status;
    if (userStatus === 'ACTIVE') {
      Helpers.log('User is invited successfully');
    } else {
      Helpers.log('User invitivation is failed: Account claim api is failed');
    }
  });
}

function loginRegistration(user_name: string, pwd: string) {
  cy.request({
    method: 'OPTIONS',
    url: 'https://login2-api-stg.saase2e.pitneycloud.com/loginServices/v2/account/login', // baseUrl is prepend to URL
    form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
    headers: {
      Origin: 'https://login2-stg.saase2e.pitneycloud.com',
      'Content-type': 'application/json'
    },
    body: {
      username: user_name,
      password: pwd
    }
  }).then((response) => {
    // response.body is automatically serialized into JSON
    expect(response.status).to.eq(200);

    const userStatus = response.body.status;
    Helpers.log(userStatus);
    if (userStatus == 'SUCCESS') {
      Helpers.log('User login REGISTRATION is successfully');
    } else {
      Helpers.log('User registration is failed: User login registration api is failed');
    }
  });
}

function generate_session_token(user_name: string, pwd: string) {
  const body = {
    username: user_name,
    password: pwd
  };
  return cy
    .request({
      method: 'POST',
      url: 'https://pitneybowes.oktapreview.com/api/v1/authn',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(async (data) => {
      if (data.status === 200) {
        const sessionToken = data.body.sessionToken;
        Helpers.log(`sessionToken -> ${sessionToken}`);
        return sessionToken;
      }
    });
}

function getUserAuthenticate(user_name: string, pwd: string) {
  const env = Cypress.env('appEnv');
  //const session_token = generate_session_token(user_name, pwd);
  generate_session_token(user_name, pwd).then((session_token) => {
    var authentication_url = '';
    if (env == 'qa') {
      cy.wait(5000);
      authentication_url =
        'https://pitneybowes.oktapreview.com/oauth2/austlb7mc40Fgj6ik0h7/v1/authorize?client_id=0oatl86njpT7nJLEX0h7&scope=openid%20profile%20email%20address%20phone%20offline_access%20spa%20anx%20adm%20pbadm&response_type=token%20id_token&redirect_uri=http://localhost:8081/auth&nonce=875234875&state=1324&response_mode=form_post&sessionToken=' +
        session_token;
    } else if (env == 'dev') {
      cy.wait(20000);
      authentication_url =
        'https://pitneybowes.oktapreview.com/oauth2/austlb7mc40Fgj6ik0h7/v1/authorize?client_id=0oatl86njpT7nJLEX0h7&scope=openid%20profile%20email%20address%20phone%20offline_access%20spa%20anx%20adm%20pbadm&response_type=token%20id_token&redirect_uri=http://localhost:8081/auth&nonce=875234875&state=1324&response_mode=form_post&sessionToken=' +
        session_token;
    }
    Helpers.log(`url -> ${authentication_url}`);
    cy.request({
      method: 'GET',
      url: authentication_url, // baseUrl is prepend to URL
      form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
      headers: {
        'Content-type': 'application/json'
      }
    }).then((response) => {
      //expect(response.status).to.eq(302);
      return response.body;
    });
  });
}

Cypress.Commands.add('getNewUserAuthenticateAPI', (personalDetails: any) => {
  loginRegistration(personalDetails.email, personalDetails.password);
  getUserAuthenticate(personalDetails.email, personalDetails.password);
});

function callDeleteApi(userId: string) {
  cy.get('@XSRFToken').then((token) => {
    cy.request({
      method: "DELETE",
      url: `api/subscription-management/v1/users/${userId}`,
      failOnStatusCode: false,
      retryOnNetworkFailure: true,
      headers: token
    })
  });
}

Cypress.Commands.add('verifyDeleteUser', () => {
  callDeleteApi(userResponse.userID);
});

Cypress.Commands.add('clickDeleteUserFromGrid', () => {
  cy.get(formControls.deleteUserLink).click().get(formControls.deleteConfirmLink).click();
  cy.get(formControls.userDeletionToastSuccess, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.userDeletionToastSuccess, { timeout: 30000 })
    .contains('Success')
    .get(formControls.userDeletionToastSuccessContent, { timeout: 30000 })
    .contains('User deleted successfully.');
  cy.get(formControls.userDeletionToastSuccessContent, { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('verifyIfDeleteUserPresent', (personalDetails: any) => {
  cy.get(formControls.tableGridRow).contains(personalDetails.firstName).should('not.exist');
});

Cypress.Commands.add('verifyUserAccessValidation', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true })
    .get(formControls.manageUsersLink)
    .should('not.exist')
    .get(formControls.divLocLink)
    .should('not.exist')
    .get(formControls.settingsMenu_ManageCostAccounts)
    .should('not.exist')
    .get(formControls.manageCustomFields)
    .should('not.exist')
    .get(formControls.manageBusinessRules)
    .should('not.exist')
    .get(formControls.notificationsMenu)
    .should('not.exist')
    .get(formControls.manageContacts)
    .contains('Address Book')
    .click();
});

Cypress.Commands.add('verifyEnterpriseAccessValidation', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true })
    .get(formControls.manageUsersLink)
    .should('exist')
    .get(formControls.manageContacts)
    .contains('Address Book')
    .click();
});

Cypress.Commands.add('verifyDivisionAccessValidation', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true })
    .get(formControls.manageUsersLink)
    .contains('Users')
    .should('be.visible')
    .click()
    .clickAddUser();
  cy.get('#enterprise')
    .should('not.exist')
    .get(formControls.addUserPopupCloseBtn)
    .click()
    .get(formControls.divisionLocLink)
    .click()
    .get(formControls.addDivisionBtn)
    .should('be.disabled');
  //.get((formControls.addLocationBtn)).should('not.be.disabled');
});

Cypress.Commands.add('verifyLocationAccessValidation', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.navigateToUserManagementPage();
  cy.clickAddUser();
  cy.get('#enterprise')
    .should('not.exist')
    .get('#division')
    .should('not.exist')
    .get(formControls.addUserPopupCloseBtn)
    .click()
    .get(formControls.divisionLocLink)
    .click()
    .get(formControls.addLocationBtn)
    .should('be.disabled');
});

Cypress.Commands.add('logoutUser', () => {
  const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
  cy.visit(loginUrl + '/logout');
  cy.get("input[name='username']", { timeout: 40000 }).should('be.visible');
  //cy.wait(15000);
});

Cypress.Commands.add('verifyUserDetailsInGrid', (UserStatus: any, UserType: any, Email?: any) => {
  cy.waitForSpinnerIcon();
  cy.get(formControls.tableGridRow, { timeout: 10000 }).contains(UserStatus).get(formControls.tableGridRow).contains(UserType);
  if (Email) {
    cy.get(formControls.tableGridRow, { timeout: 10000 }).contains(Email);
  }
});

Cypress.Commands.add('loginWithNewUser', (personalDetails: any) => {
  cy.logoutUser();
  cy.clearCookies();
  const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
  cy.clearCookie(sessionCookieName);
  cy.clearLocalStorage();
  cy.loginCC(personalDetails.email, personalDetails.password);
});

Cypress.Commands.add('clickOnSettingsButtonInCostAccount', () => {
  cy.waitForSpinnerIcon();
  cy.wait(1000);
  cy.get(formControls.settingsInCostAccount).click({ force: true });
  cy.waitForSpinnerIcon();
  cy.get(formControls.useCostAccountRadioButton).click({ force: true });
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('waitForSpinnerIcon', () => {
  cy.waitForSpinners();
  cy.get(formControls.spinnerIconInCostAccountSettings, { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('clickOnImportUsersButton', () => {
  cy.waitForSpinners();
  cy.get(formControls.importUserButton)
    .contains('Import')
    .click()
    .wait(500);
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('selectDivisionLevelInImportUsersPopup', (accessLevel, personalDetails: any) => {
  cy.waitForSpinnerIcon();
  cy.get("#" + accessLevel).click();
  cy.wait(2000);
  cy.waitForSpinnerIcon();
  cy.get(formControls.selectDivisionDrpDown, { timeout: 10000 }).click();
  cy.wait(2000);
  cy.get(formControls.divisionSearchInAddUser, { timeout: 10000 }).click().clear().type(personalDetails.Division);
  cy.wait(2000);
  cy.get(formControls.divisionDropdownOptionInImportUser, { timeout: 10000 }).contains(personalDetails.Division).click({ force: true })
  cy.get(formControls.selectDivisionDrpDown, { timeout: 10000 }).click().wait(1000);
});

Cypress.Commands.add('selectLocationLevelInImportUsersPopup', (accessLevel, personalDetails: any) => {
  cy.waitForSpinnerIcon();
  cy.get("#" + accessLevel).click();
  cy.wait(1000);
  cy.get(formControls.selectAdminLocationDropdown, { timeout: 10000 })
    .click()
    .get(formControls.selectLocation, { timeout: 10000 })
    .contains(personalDetails.Division)
    //.contains("Import Auto Division - Import Auto Location")
    .click({ force: true })
    .get(formControls.selectAdminLocationDropdown, { timeout: 10000 })
    .click()
    .wait(1000);
  cy.get("#" + accessLevel).click();
});

Cypress.Commands.add('importUsersWithDivisionOrLocationAccessLevel', (filePath) => {
  cy.get(formControls.importFileInput)
    .attachFile(filePath);
  cy.get(formControls.continueButton, { timeout: 10000 })
    .should('be.visible')
    .click()
    .wait(1000);
  cy.get(formControls.importButtonInImportMultipleUsersPopup, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });
  cy.get("i[class*='pbi-icon-mini pbi-loader-circle']", { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('importMultipleUsers', (filePath, accessLevel) => {
  cy.get(formControls.importUserButton)
    .contains('Import')
    .click()
    .wait(500)
    .get("#" + accessLevel).click()
    .get(formControls.importFileInput)
    .attachFile(filePath);
  cy.get(formControls.continueButton, { timeout: 10000 })
    .should('be.visible')
    .click();
  cy.get(formControls.importButtonInImportMultipleUsersPopup, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });
  //cy.wait('@importFileStatus');
  cy.get("i[class*='pbi-icon-mini pbi-loader-circle']", { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('waitForImportUserToastMessage', function () {
  cy.get(formControls.importUser_ToastMessage)
    .contains('Success')
    .get(formControls.importToastMessage)
    .contains('Uploaded Records :2'); cy.wait('@getUserByPermission');
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('deleteUsersViaAPI', (userids: any) => {

  for (let i = 0; i < userids.length; i++) {
    cy.getCookie("XSRF-TOKEN").then((xsrfToken) => {
      cy.request({
        method: 'DELETE',
        url: 'api/subscription-management/v1/users/' + userids[i],
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          "X-XSRF-TOKEN": xsrfToken.value
        },
      })
    });
  }
});

function getDataFromUserByPermissionsAPI(): any {
  return cy.wait('@getUserByPermission').then(function (response) {
    return response;
  });
}

Cypress.Commands.add('callAccountClaimAPIForImportUser', function (personalDetails: any) {
  getDataFromUserByPermissionsAPI().then(async (interception) => {
    userResponse = JSON.parse(JSON.stringify(interception.response.body));
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag) {
      verifyAccountClaim(userResponse.token);
      cy.wait(2000);
    }
  });
});

Cypress.Commands.add('createDivisionViaAPI', (newdivision) => {
  cy.getEnterpriseId();
  cy.request({
    method: 'POST',
    url: 'api/client-management/v1/enterprises/' + enterprise_Id + '/divisions',
    failOnStatusCode: false,
    body: {
      "customDivisionIdChecked": false,
      "name": newdivision,
      "divisionID": "",
      "enterpriseID": enterprise_Id,
      "subID": subId
    }
  });
});

Cypress.Commands.add('getSubId', () => {
  cy.request('GET', 'api/subscription-management/v1/userProperties').then(async (response) => {
    const responseData = response.body[0].subID;
    subId = responseData;
  });
});

Cypress.Commands.add('getEnterpriseId', () => {
  cy.getSubId();
  cy.request('GET', 'api/subscription-management/v1/subscriptions/' + subId).then(async (response) => {
    const responseData = response.body.enterpriseID;
    enterprise_Id = responseData;
    Helpers.log(enterprise_Id)
  });
});

Cypress.Commands.add('createDataForImportUsersFile', (filePath: string, personalDetails: any) => {
  generateImportFileForLocation(filePath, personalDetails);
});

function generateImportFileForLocation(filePath: string, personalDetails: any) {
  cy.writeFile(filePath, 'First Name,Last Name,E-Mail,Role,Division,BPN,Location,Company Name,Customer Address,City,State,Country,Zip,Phone,Default Cost Account\n');
  cy.writeFile(filePath, personalDetails.firstName + ',' + personalDetails.lastName + ',' + personalDetails.email + ',' +
    personalDetails.Role + ',' + personalDetails.Division + ',' + personalDetails.BPN + ',' + personalDetails.Location +
    personalDetails.company + personalDetails.customerAddress + ',' + personalDetails.city + ',' + 'ON,' + 'CA,' + personalDetails.zipCode + ',' + '1234567890' + '' + ',\n', {
    flag: 'a+'
  });
}

Cypress.Commands.add('inactiveUser', () => {
  cy.get(formControls.inactiveRadioBtn)
    .should('not.be.visible')
    .check({ force: true })
    .should('be.checked')
    .get(formControls.saveCloseBtn)
    .click()
    .wait('@userCreated')
    .get(formControls.allUserLink)
    .click()
    .get('.dropdown-item').contains('Inactive Users')
    .click();
});

Cypress.Commands.add('activateUser', () => {
  cy.get(formControls.activateUserLink).should('be.visible')
    .click({ force: true })
    .get(formControls.deleteConfirm)
    .click()
    .get(formControls.allUserLink, { timeout: 10000 })
    .click()
    .get('.dropdown-item').contains('All Users')
    .click();
});

Cypress.Commands.add('clickResendEmailLink', () => {
  cy.get(formControls.resendEmailLink).should('be.visible')
    .click({ force: true })
    .get(formControls.deleteConfirm)
    .click()
    .get(formControls.resendEmailLink).should('be.visible')
    .wait('@resendEmailLink').then(async (interception) => {
      userResponse = JSON.parse(JSON.stringify(interception.response.body));
      verifyAccountClaim(userResponse.token);
      cy.wait(2000);
    });
});

Cypress.Commands.add('clickResetPasswordLink', () => {
  cy.get(formControls.resetPasswordLink).should('be.visible')
    .click({ force: true })
    .wait('@resetPassword')
});

Cypress.Commands.add('checkResendEmailLink', () => {
  cy.get(formControls.resendEmailLink).should('not.exist');
});

Cypress.Commands.add('clickOnImportUserAndSelectAccessLevel', (accessLevel: any) => {
  cy.get(formControls.importUserButton)
    .contains('Import')
    .click()
    .wait(500)
    .get("#" + accessLevel).click();
});

Cypress.Commands.add('verifyFieldsAreNotEditableInClientSetupAddUser', () => {
  cy.get(formControls.emailId).should('have.attr', 'readonly', 'readonly');
});

Cypress.Commands.add('clickOnCloseIcon', () => {
  cy.get(formControls.addUserPopupCloseBtn).click();
});

Cypress.Commands.add('selectAdminLocationByPosition', (position: string[]) => {
  cy.get(formControls.selectAdminLocationDropdown).click();
  for (var i = 0; i < position.length; i++) {
    cy.get(format(formControls.selectAdminLocationByPosition, position[i])).click({ force: true });
  }
});

Cypress.Commands.add('verifyAccessLevelInGrid', (accessLevel: any, count: any) => {
  cy.waitForSpinnerIcon();
  cy.get(formControls.accessLevelEntitiesCountInUserGrid, { timeout: 10000 }).should('be.visible').invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(accessLevel + " (" + count + ")");
  });
});

Cypress.Commands.add('ClickOnCarrierDropdownInAddUser', (carrierName: string) => {
  cy.get(formControls.selectCarrierDropdown).click();
  cy.get(format(formControls.carrierDropdownOption, carrierName)).click({ force: true });
});

Cypress.Commands.add('selectOptionInCostAccountInAddUser', (costAccountToSelect: string) => {
  cy.get(formControls.selectDivCF).contains(costAccountToSelect).click({ force: true });
});

Cypress.Commands.add('validateCarrierOption', (expectedCarrierName: string) => {
  cy.waitForSpinnerIcon();
  cy.get(formControls.selectCarrierDropdown, { timeout: 10000 }).scrollIntoView().should('be.visible').invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(expectedCarrierName);
  });
});

Cypress.Commands.add('validateCostAccountOption', (expectedCostAccountName: string) => {
  cy.waitForSpinnerIcon();
  cy.get(formControls.optionSelectedInCostAccountDropdown, { timeout: 10000 }).should('be.visible').invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(expectedCostAccountName);
  });
});


Cypress.Commands.add('selectRoleFromDropdown', (roleToSelect: string) => {
  cy.get(formControls.assignRole).scrollIntoView().should('be.visible');
  cy.get(formControls.assignRole).click().get(formControls.selectAllCheckboxInsideDropdown).click();
  cy.get(format(formControls.selectRoleOptionInDropdown, roleToSelect)).click({ force: true })
    .get(formControls.assignRole).click();
});

Cypress.Commands.add('verifyRolesInUserDetailsGrid', (userRoles: any) => {
  cy.waitForSpinnerIcon();
  cy.get(formControls.tableGridRow, { timeout: 10000 }).contains(userRoles);
});

Cypress.Commands.add('addNewUser', (personalDetails: any) => {
  cy.clickAddUser();
  cy.addPersonalDetails(personalDetails, 'location');
  cy.selectRole();
  cy.selectAdminLocation();
  cy.get('body').click(700, 147);//Adding this command for temp. Will fix it later
  cy.selectLocation();
  cy.ClickOnCarrierDropdownInAddUser('USPS');
  cy.selectCostAccount();
  cy.selectOptionInCostAccountInAddUser('CaDivisionAll');
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
    cy.verifyUserDetailsInGrid('ACTIVE', 'Locations');
  else
    cy.verifyUserDetailsInGrid('INVITED', 'Locations');
  cy.clickEditUserBtn();
  cy.verifyFieldsAreNotEditableInClientSetupAddUser();
  cy.clickOnCloseIcon();
  cy.clickEditUserBtn();
  cy.selectAdminLocationByPosition(new Array("2", "3"));
  //cy.get('body').click(700, 147);//Adding this command for temp. Will fix it later
  //cy.get('#admin-entity-location-list span[class="ng-arrow"]').click({ force: true });
  cy.get('#location').scrollIntoView().should('be.visible').click({ force: true });
  cy.selectLocation();
  cy.clickSaveBtn();
  cy.searchUser(personalDetails);
  cy.verifyAccessLevelInGrid('Locations', '3');
  cy.clickEditUserBtn();
  //cy.selectRoleFromDropdown('USER'); //Commented out as it needs some fixe inside the method
  cy.ClickOnCarrierDropdownInAddUser('UPS');
  cy.selectCostAccount();
  cy.selectOptionInCostAccountInAddUser('CaLocationAll');
  cy.clickSaveBtn();
  cy.searchUser(personalDetails);
  //cy.verifyRolesInUserDetailsGrid('USER');
  cy.clickEditUserBtn();
  cy.validateCarrierOption('UPS');
  cy.validateCostAccountOption('CaLocationAll');
  cy.clickOnCloseIcon();
});

Cypress.Commands.add('deleteSearchedUserIfMoreThanOne', (userName: string) => {
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.searchUser).click().clear().type(userName).get(formControls.searchBtnUser).click().wait(5000);
  cy.get('body').then(($body) => {
    if ($body.find(formControls.noResultsFound).length) {
      Helpers.log("Searched User is not present")
    } else {
      cy.get(formControls.tableGridRow).each((item, index, list) => {
        cy.get(formControls.tableGridRow, { timeout: 10000 }).contains(userName);
        cy.get(formControls.tableGridRow).should('include.text', userName);
        cy.get(formControls.deleteUserLink).should('be.visible').click().wait(500);
        cy.get(formControls.deleteConfirmLink).click().wait('@deleteUser').its('response.statusCode').should('eq', 200);
        cy.wait(4000);
        cy.waitForSpinnerIcon();
      });
    }
  });
  cy.get(formControls.searchUser).click().clear();
});

Cypress.Commands.add('verifyCostAccHierarchyInUsersPage', () => {
  const parentCostAccount = ["Parent1", "Parent2"];
  const parent1_SubCostAccount = ["Sub1", "Sub2"];
  const parent2_SubCostAccount = ["Sub1", "Sub2"];
  const parent1_SubSubCostAccount = ["Sub sub1", "Sub sub2"];
  const parent2_SubSubCostAccount = ["Sub sub1", "Sub sub2"];
  /*cy.get(formControls.selectCostAccount).scrollIntoView().click();
  cy.get("div[role='option'] span").each((item, index, list) => {
    let actualText = Cypress.$(item).text();
    Helpers.log(`Actual Text of Cost Account option in the Drop down is ${actualText}`);
    expect(parentCostAccount).to.include(actualText);

  });
  for (let i = 0; i < parent1_SubCostAccount.length; i++) {
    cy.get(formControls.selectCostAccount).clear().type(parent1_SubCostAccount[i]).then((_) => {
      cy.get(formControls.noItemsFoundMessage).should('be.visible').invoke('text').then((actualMessage) => {
        assert.equal('No items found', actualMessage, 'Verified the Message when searching the sub cost accounts');
      });
    });
  }
  for (let i = 0; i < parent2_SubSubCostAccount.length; i++) {
    cy.get(formControls.selectCostAccount).clear().type(parent2_SubSubCostAccount[i]).then((_) => {
      cy.get(formControls.noItemsFoundMessage).should('be.visible').invoke('text').then((actualMessage) => {
        assert.equal('No items found', actualMessage, 'Verified the Message when searching the sub sub cost accounts');
      });
    });
  }*/

  cy.get(formControls.defaultCostAccDropdown).scrollIntoView().click();
  cy.get("div[role='option'] div div").each((item, index, list) => {
    let actualText = Cypress.$(item).text().trim();
    Helpers.log(`Actual Text of Cost Account option in the Drop down is ${actualText}`);
    expect(parentCostAccount).to.include(actualText);
  });

  for (let i = 0; i < parent1_SubCostAccount.length; i++) {
    cy.get(formControls.defaultCostAccDropdown).clear().type(parent1_SubCostAccount[i]).then((_) => {
      cy.get(formControls.noItemsFoundMessage).should('be.visible').invoke('text').then((actualMessage) => {
        assert.equal('No items found', actualMessage, 'Verified the Message when searching the sub cost accounts');
      });
    });
  }
  for (let i = 0; i < parent2_SubSubCostAccount.length; i++) {
    cy.get(formControls.defaultCostAccDropdown).clear().type(parent2_SubSubCostAccount[i]).then((_) => {
      cy.get(formControls.noItemsFoundMessage).should('be.visible').invoke('text').then((actualMessage) => {
        assert.equal('No items found', actualMessage, 'Verified the Message when searching the sub sub cost accounts');
      });
    });
  }

  cy.get(formControls.defaultCostAccDropdown).clear().type(parentCostAccount[0]).get(formControls.divisionDropdownOptionInCA).first().click({ force: true });
  cy.wait(5000);
  cy.get(formControls.defaultCostAccDropdown).type(parent1_SubCostAccount[0]).get(formControls.divisionDropdownOptionInCA).first().click({ force: true });
  cy.wait(5000);
  cy.get(formControls.defaultCostAccDropdown).type(parent1_SubSubCostAccount[0]).get(formControls.divisionDropdownOptionInCA).first().click({ force: true });
  cy.wait(5000);

});

Cypress.Commands.add('exportUser', () => {
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () { doc.location.reload() }, 5000)
    })
    cy.get(formControls.exportUser).click();
  })
  cy.wait(3000);
});

Cypress.Commands.add('getJobIdForExportUser', () => {
  cy.request('/api/subscription-management/v1/exportUser?archive=false&jobConfigId=USER_EXPORT&locale=en-US&capability=non_sso_export').then((response) => {
    cy.wrap(response.body.jobId).as('jobId');

  });
});

Cypress.Commands.add('verifyUserExport', () => {
  Helpers.log("Entering the verifyUserExport method");
  cy.get('@jobId').then(id => {
    Helpers.log(`job id is ${id}`);
    cy.request(`/api/subscription-management/v1/users/jobs/${id}/status`).then((response) => {
      let res = response.body.status;
      Helpers.log(`status is ${res}`);
      if (response.body.status !== 'Processed') {
        Helpers.log("still status is not Processed. So calling this method again");
        cy.verifyUserExport();
      } else {
        cy.wait(1000);
        const requestData = response.body.exportFileLocation;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(100);
        })
      }
    })
  });
});

Cypress.Commands.add('downloadSampleFile_User', () => {
  cy.wait(4000);
  cy.get(formControls.importUserButton).should('be.visible').click();
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () {
        // Below is needed to fool cypress waiting for new page load
        //doc.location.href = 'about:blank';
      }, 5000);
    })
    cy.get(formControls.downloadCostAccSampleFile).should('be.visible').click();
  })
  cy.request(`api/subscription-management/v1/fieldList?userType=normalUser`).then((response) => {
    let res = response.status;
    Helpers.log(`status is ${res}`);
    expect(response.body.toString())
      .includes("FirstName,LastName,Email,Role,Division,BPN,Location,CompanyName,Address,City,State,Country,Zip,Phone,DefaultCostAcct");
  })
  cy.get(formControls.btnCancel).click();
  cy.wait(3000);
});

Cypress.Commands.add('downloadFileInsideJobStatusInUser', (processingErrorOrProcessed: string) => {
  cy.wait(4000);
  cy.get(formControls.jobStatusInUsersPage).click().wait(`@getUserJob`, { timeout: 10000 });
  cy.wait(1000);
  cy.xpath(formControls.jobIdColumnInJobStatusInUsersPage).invoke('text').then((jobIdInJobStatus) => {
    cy.wait(2000);
    cy.xpath(formControls.exportFileDownloadInUserJobStatus).first().scrollIntoView().click();
    cy.wait(3000);
    cy.window().document().then(function (doc) {
      doc.addEventListener('click', () => {
        setTimeout(function () { doc.location.reload() }, 5000)
      })
      cy.xpath(formControls.downloadBtnInsideJobStatus).click();
    })
    cy.wait(3000);
    if (processingErrorOrProcessed == 'ProcessingError') {
      cy.request(`/api/subscription-management/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=input`).then((response) => {
        const requestData = response.body.url;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(210);
          expect(data.body.toString())
            .includes("Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable,error");
        });
      });
    } else {
      cy.request(`/api/subscription-management/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=output`).then((response) => {
        const requestData = response.body.url;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(210);
          if (Cypress.env('appEnv').includes('fed-ppd') === true) {
            expect(data.body.toString()).includes("First Name,Last Name,Location Name,Role,Status,BPN,Display Name,E-Mail");
          } else if (Cypress.env('appEnv').includes('fed') === true) {
            expect(data.body.toString()).includes("Display Name,E-Mail,First Name,Last Name,Location Name,Role,Status,BPN");
          } else {
            expect(data.body.toString()).includes("First Name,Last Name,Display Name,Email,Location Name,Role,BPN,Status");
          }
        });
      });
    }

  });
});






