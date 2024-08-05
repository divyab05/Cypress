import { formControls } from '../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../.././support/helpers';
import { format } from 'util';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    //create .d.ts definitions file to get autocomplete.
    interface Chainable<Subject> {
      navigateToCostAccountPage(): void;
      addCostAccount(costAccount, optional?: boolean): void;
      clickOnScheduleImport(): void;
      clickOnAddConfigInALMScheduleImport(): void;
      clickOnEditConfigInALMScheduleImport(): void;
      searchCostAccount(costAccount): void;
      updateCostAccount(costAccount): void;
      deleteCostAccount(): void;
      saveCostAccount(): void;
      verifySearchCostAccount(newCostAccount: string): void;
      importCostAccount(filePath: any, accessLevel: string, divOrLocToSelect: string): void;
      exportCostAccount(): void;
      verifyCostAccountExport(): void;
      selectLocationCA(newCostAccount): void;
      selectDivisionCA(newCostAccount): void;
      addSubCostAccount(costAccount): void;
      addSubSubCostAccount(costAccount): void;
      editActiveToInactiveCostAccount(costAccount): void;
      activeToInactiveCostAccount(costAccount): void;
      verifyInactiveRadioBtnSelectedInEditCA(): void;
      searchInactiveCostAccount(costAccount): void;
      selectInactiveAccountsCheckBox(): void;
      addAndCloseInAddSubCostAccount(): void;
      addCostAccountAPI(): void;
      getCostAccountID(): void;
      deleteCostAccountViaAPI(): void;
      clickOnEditIconOfCostAccount(): void;
      clickOnLocationRadioButtonInCostAccountPopup(): void;
      getShareLevelAtTextInGrid(accessLevel): void;
      clickOnDivisionRadioButtonInCostAccountPopup(): void;
      clickOnEnterpriseRadioButtonInCostAccountPopup(): void;
      clickOnDivisionFilterInCAPage(divisionFilterValue: any): void;
      clickOnLocationFilterInCAPage(locationFilterValue: any): void;
      verifyInactiveCANotPresentInAddUser(inactiveCostAccountName: any): void;
      waitForimportStatusProcessed(aliasName, retries): void;
      validateDuplicateCostAccountErrorMessage(costAccount: any): void;
      validateDeleteCostAccountErrorMessage(): void;
      createDataForImportCAFile(filePath: string, newCostAccount: any): void;
      validateCAImportFailAlertMessage(): void;
      verifySearchCANotExist(costAccount: any): void;
      importDuplicateCostAccount(filePath: any);
      validateInactiveReferenceCostAccountErrorMessage(): void;
      clickOnAscendingOrDescendingIcon(iconToSelect: string, columnId: number): void;
      checkDataInAscendingOrderOrNot(columnToVerify: number): void;
      checkDataInDescendingOrderOrNot(columnToVerify: number): void;
      addCostAccountWithBillableAndPassword(costAccount: any): void;
      verifyBillableIconIsPresentOrNot(newCostAccount: string): void;
      verifyPasswordEnabledIconIsPresentOrNot(newCostAccount: string): void;
      deletePasswordEnabledCostAccount(): void;
      addSubCostAccountUnderPasswordEnabledParent(costAccount: any): void;
      addSubSubCostAccountUnderPasswordEnabledParent(costAccount: any): void;
      navigateToCostAccountOnSamePage(): void;
      clickOnEditIconOfSubCA(): void;
      clickOnEditIconOfSubSubCA(): void;
      updateDescirption(message: string): void;
      deleteSearchedAccountIfMoreThanOne(textToSearch: string): void;
      refreshCostAccount(): void;
      expandRowInGrid(): void;
      getJobIdForExportCostAccount(): void;
      getSub_UserId(): void;
      downloadSampleFile_CostAcc(): void;
      selectDropdownInJobStatus(status: string, textToSearch: string): void;
      downloadFileInsideJobStatusInCostAcc(optionToSelect: string, textToSearch: string): void;
      deleteAllCostAccountsViaAPI(): void;
      clickOnJobsStatusDrpdwn(): void;
      selectJobsHistoryDrpdwn(): void;
      selectExportHistoryDrpdwn(): void;
      searchJobInsideExportHistory(): void;
      selectJobIdFilterInExportHistory(): void;
      selectNameFilterInExportHistory(): void;
      downloadJobInsideExportHistory(): void;
      deleteJobInsideExportHistory(): void;
      searchNameInsideExportHistory(): void;
      addDivisionCostAccount(costAccount: any, optional?: boolean): void;
      verifySearchedCostAccountPresent(parentAcc: string, subAcc: string, subSubAcc: string): void;


      //Schedule Auto import
      clickAutoimportCostAccount(): void;
      enterSFTPDetails(fileDetails: any): void;
      configureAutoImport(fileDetails: any): void;
      selectTextDelimiter(selectTextDelimiter: any): void;
      saveConfiguration(): void;
      updateScheduleJob(fileDetails: any, textDelimiter: any): void;
      clickAutoimportList(): void;
      clickAutoConfigurationimportList(): void;
      clickHistoryimportList(): void;
      deleteAutoimportList(): void;
      deleteAllRecordsInHistoryTab(): void;
      deleteRecordInConfigTabViaAPI(scheduleJobIdToDelete: any): void;
      deleteAllRecordsInConfigTabViaAPI(): void;
      deleteAllRecordsInHistoryTabViaAPI(): void;
      deleteRecordInHistoryTabViaAPI(scheduleJobIdToDelete: any): void;
      verifyStatusOfJobInHistoryTab(): void;
      deleteConfigJobIfMoreThanOne(): void;
      navigateToCostAccountTab(): void;
      verifyImportSuccessToast(): void;
      verifyImportFailedToast(): void;
      verifyFailedJobInHistoryTab(): void;
      clickManualImportCostAccount(): void;

      createScheduleCostAccImportALMConfig(fileDetails: any): void;
      createScheduleCostAccImportALMConfigWithEmailId(fileDetails: any): void;
      verifALMScheduleImportGridHeaders(): void;
      verifALMScheduleImportGridContentsUsingJSON(fileDetails: any): void;
      verifALMScheduleImportGridContents(sftpFileLocation: string, frequency: string, lastExecution: string, nextExecution: string, accessLevelToCheckInGrid: string): void;
      selectFrequencyDrpdwn(optionToSelect: string): void;
      verifySelectedOptionInFrequencyDrpdwn(textToDisplay: string): void;
      clickOnContinueBtn(): void;
      clickOnSaveAndCloseBtn(): void;
      clickOnDeleteConfigInALMScheduleImport(): void;
      deleteScheduleImportJobIfMoreThanOne(): void;
    }
  }
}
export var costAccount_ID = null;
export var errorMessage_DuplicateCostAccount = 'Invalid request: Account Name or Code already exists';
export var errorMessage_DeleteCostAccount1 = 'Cost Account cannot be deleted as associated references found in User';
export var errorMessage_DeleteCostAccount2 = 'cannot be deleted as associated references found';
export var errorMessage_InactiveAssinedCostAccount1 = 'Cost Account with accountID [';
export var errorMessage_InactiveAssinedCostAccount2 = '] cannot be inactivated as associated references found';
export let flag = null;
export var jobResponse = null;
export var jobResponse_Export = null;

Cypress.Commands.add('deleteSearchedAccountIfMoreThanOne', (textToSearch: string) => {
  Helpers.log("***********Entering the method to delete more than one cost accounts present***************");
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.searchBox, { timeout: 40000 }).click().clear()
    .type(textToSearch).wait(3000).should('have.length', 1).then((_) => {
      cy.waitForSpinnerIcon();
      cy.wait(3000);
      cy.waitForSpinners();
      cy.refreshCostAccount();
      //Added Refresh cost accounts specifically for fedramp environment
      cy.get('body').then(($body) => {
        Helpers.log("***********Checking if No result found Text displaying or not***************");
        if ($body.find(formControls.noResultsFound).length) {
          Helpers.log("Searched Cost Account is not present")
        } else {
          Helpers.log("***********Checked that No result found Text not displayed***************");
          cy.get(formControls.tableGridRow, { timeout: 40000 }).each((item, index, list) => {
            cy.refreshCostAccount();
            cy.deleteCostAccount();
          });
        }
      });
    })
  cy.get(formControls.searchBox).click().clear();
});


Cypress.Commands.add('navigateToCostAccountPage', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
  cy.get(formControls.settingsMenu_ManageCostAccounts).contains('Cost Accounts').click({ force: true }).wait(5000);
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('navigateToCostAccountOnSamePage', () => {
  cy.wait(2000);
  cy.get(formControls.costAccountLink).click().wait(1000);
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('addCostAccount', function (costAccount: any, optional?: boolean) {
  cy.get(formControls.costAccount_AddBtn)
    .contains('Add Account')
    .click()
    .get(formControls.costAccounts_AddForm_Name)
    .type(costAccount.name)
    .blur()
    //.get(formControls.costAccounts_AddForm_Code)
    //.type(costAccount.code)
    //.blur()
    .get(formControls.costAccounts_AddForm_Description)
    .type(costAccount.description)
    .blur();
  if (optional) {
    cy.get(formControls.costAccounts_AddForm_Code).clear()
      .type(costAccount.code)
      .blur()
  }
});

Cypress.Commands.add('addDivisionCostAccount', function (costAccount: any, optional?: boolean) {
  cy.get(formControls.costAccount_AddBtn).contains('Add Account').click()
    .get(formControls.costAccounts_AddForm_Name).type(costAccount.name).blur()
    .get(formControls.costAccounts_AddForm_Description).type(costAccount.description).blur();
  if (optional) {
    cy.get(formControls.costAccounts_AddForm_Code).clear().type(costAccount.code).blur();
  }
  cy.clickOnDivisionRadioButtonInCostAccountPopup();
});

Cypress.Commands.add('clickOnScheduleImport', function () {
  cy.xpath(formControls.scheduleImportTab, { timeout: 40000 }).click();
  cy.waitForSpinnerIcon();
  cy.waitForSpinners();
  cy.get(formControls.addConfigInALMScheduleImport, { timeout: 40000 }).should('be.visible');

});

Cypress.Commands.add('saveCostAccount', () => {
  cy.get(formControls.costAccounts_AddForm_Save).scrollIntoView()
    .wait(1000)
    .click()
  //.wait(['@addCostAccount'], { timeout: 40000 });
  getCostAccountID();
  cy.waitForSpinnerIcon();
  //cy.wait(4000);
});

Cypress.Commands.add('searchCostAccount', function (costAccount: any) {
  cy.get(formControls.searchBox).focus().clear();
  cy.refreshCostAccount();
  cy.intercept('POST', 'api/cost-accounts/v1/costAccounts/advanceSearch?*query=' + costAccount).as('searchCostAc').wait(4000);
  cy.get(formControls.searchBox).focus().clear().type(costAccount).wait('@searchCostAc').its('response.statusCode').should('eq', 200)
  cy.waitForSpinnerIcon();
  if (Cypress.env('appEnv').includes('fed') === true)
    cy.wait(2000); //Specifically added this wait as it gets slower in fedramp environment
});

Cypress.Commands.add('verifySearchCostAccount', function (newCostAccount: string) {
  cy.get(formControls.searchBox).focus().clear().type(newCostAccount);
  cy.get(formControls.costAccounts_SearchResultRow1)
    .should('have.length', 1)
    .and('include.text', newCostAccount);
});

Cypress.Commands.add('updateCostAccount', function (costAccount: any) {
  cy.getElements('manageCostAccounts_Row1_EditBtn')
    .should('be.visible')
    .click()
    .getElements('manageCostAccounts_AddForm_Description')
    .should('be.visible')
    .focus()
    .clear()
    .type('{selectall}{backspace}{selectall}{backspace}')
    .type(costAccount.description)
    .blur();
  const button = costAccount.active
    ? 'manageCostAccounts_AddForm_ActiveRadioBtn'
    : 'manageCostAccounts_AddForm_InactiveRadioBtn';
  cy.getElements(button).click().getElements('manageCostAccounts_AddForm_Save').click();
  cy.waitForSpinnerIcon();
  cy.wait(2000);
});

Cypress.Commands.add('deleteCostAccount', () => {
  cy.refreshCostAccount();
  cy.waitForSpinnerIcon();
  cy.get(formControls.costAccount_deleteBtn, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
    .get(formControls.deleteModalConfirmBtn, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
    .wait('@deleteCostAccount').its('response.statusCode').should('eq', 200);
  cy.wait(1000);
  cy.waitForSpinnerIcon();
  cy.refreshCostAccount();
});

Cypress.Commands.add('clickManualImportCostAccount', () => {
  cy.wait(1000);
  cy.get(formControls.importTypeDropdown, { timeout: 5000 }).click()
    .wait(2000)
    .get(formControls.importManaulCostAccount, { timeout: 5000 }).click().wait(2000);
});

Cypress.Commands.add('importCostAccount', (filePath: any, accessLevel: string, divOrLocToSelect: string) => {
  cy.clickManualImportCostAccount();
  cy.get(format("#%s", accessLevel)).click().get(formControls.importFileInput, { timeout: 6000 }).attachFile(filePath);
  if (accessLevel === "division") {
    cy.waitForSpinnerIcon();
    cy.get(formControls.selectDivisionDrpDownInEditCA, { timeout: 6000 }).should('be.visible').click();
    cy.get(formControls.divDrpdwnSearchInImportCAModal).click().clear().type(divOrLocToSelect);
    cy.get(formControls.selectLocation, { timeout: 6000 }).first().click({ force: true });
    //cy.get(formControls.selectDivisionDrpDownInEditCA, { timeout: 6000 }).click();
  } else if (accessLevel === "location") {
    cy.waitForSpinnerIcon();
    cy.get(formControls.selectAdminLocationDropdown, { timeout: 6000 }).should('be.visible').click().wait(500);
    cy.get(formControls.locDrpdwnSearchInImportCAModal).click().clear().type(divOrLocToSelect);
    cy.get(formControls.selectLocation, { timeout: 6000 }).first().click({ force: true });
    //cy.get(formControls.selectAdminLocationDropdown, { timeout: 6000 }).click();
  }
  cy.get(formControls.continueButton, { timeout: 10000 }).should('be.visible').click();
  cy.get(formControls.locationImportSaveBtn, { timeout: 150000 }).should('be.visible').click();
  cy.get(formControls.importProgressBar, { timeout: 90000 }).should('have.length', 0).wait(2000);
  cy.waitForimportStatusProcessed('@importFileStatus', 30);
  //cy.get(formControls.closeButton).click();
  cy.get("i[class*='pbi-icon-mini pbi-loader-circle']", { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('waitForimportStatusProcessed', (aliasName, retries) => {
  cy.wait(aliasName).its('response.body').then(json => {
    if (json.status === "Processed") {
      Helpers.log("status is processed");
      return
    } else if (json.status === "ProcessingError") {
      Helpers.log("status is ProcessingError because imported file contains invalid data");
      return
    } else if (retries > 0) {
      cy.waitForimportStatusProcessed(aliasName, retries - 1);
    }
  });
});

Cypress.Commands.add('clickSaveBtn', () => {
  cy.wait(2000).get(formControls.saveCloseBtn, { timeout: 20000 }).click();
  cy.wait(3000);
});

Cypress.Commands.add('verifyImportedCostAccount', function (newCostAccount: any) {
  cy.get(formControls.importToastTitle)
    .contains('Success')
    .get(formControls.importToastMessage)
    .contains('Uploaded Records :1');
  cy.get(formControls.costAccounts_SearchResultRow1).should('have.length', 1).and('include.text', newCostAccount);
});

Cypress.Commands.add('verifyCostAccountExport', () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('downloads', downloadsFolder).then((before) => {
    // do the download
    cy.window()
      .document()
      .then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            doc.location.href = 'about:blank';
          }, 5000);
        });
        /* Make sure the file exists */
        cy.intercept('/', (req) => {
          req.reply((res) => {
            expect(res.statusCode).to.equal(200);
          });
        });
      });

    cy.task('downloads', downloadsFolder).then((after) => {
      expect(after.length).to.be.eq(before.length + 1);
    });
  });
});

Cypress.Commands.add('selectDivisionCA', function (newCostAccount: any) {
  cy.get('#' + newCostAccount.shareLevel + '-input').should('not.be.visible')
    .check({ force: true })
    .should('be.checked').waitForSpinnerIcon().wait(1000);
  cy.get('body').then((body) => {
    if (body.find(formControls.optionSelectedInDrpdwn).length > 0) {
      Helpers.log("Seems User having only 1 division and it got selected automatically");
    } else {
      cy.get('[formcontrolname=' + newCostAccount.shareLevel + 's] span span').click({ force: true })
      cy.waitForSpinnerIcon;
      cy.get(formControls.searchBoxInsideCostAccount).focus().clear()
        .type('div')
        .get(formControls.divisionDropdownOptionInCA).first().click({ force: true });
    }
  });
});

Cypress.Commands.add('selectLocationCA', function (newCostAccount: any) {
  cy.get('#' + newCostAccount.shareLevel + '-input').should('not.be.visible')
    .check({ force: true })
    .should('be.checked').wait(1000);
  cy.waitForSpinnerIcon;
  cy.get('body').then((body) => {
    if (body.find(formControls.optionSelectedInDrpdwn).length > 0) {
      Helpers.log("Seems User having only 1 division and it got selected automatically");
    } else {
      cy.get(formControls.caLocDrodpwn).click({ force: true })
        .get(formControls.selectLocation).first().click({ force: true });
    }
  });
});

Cypress.Commands.add('addSubCostAccount', function (costAccount: any) {
  cy.get(formControls.costAccount_subCostAccBtn, { timeout: 8000 }).should('be.visible')
    .click()
    .get(formControls.costAccounts_AddForm_Name)
    .type(costAccount.name)
    .blur()
    .get(formControls.costAccounts_AddForm_Code)
    .type(costAccount.code)
    .blur()
    .get(formControls.costAccounts_AddForm_Description)
    .type(costAccount.description)
    .blur();
  cy.waitForSpinnerIcon();
  cy.wait(4000);
});

Cypress.Commands.add('addSubSubCostAccount', function (costAccount: any) {
  cy.wait(3000);
  cy.get(formControls.costAccount_subSubCostAccBtn, { timeout: 8000 }).should('be.visible')
    .click()
    .get(formControls.costAccounts_AddForm_Name)
    .type(costAccount.name)
    .blur()
    .get(formControls.costAccounts_AddForm_Code)
    .type(costAccount.code)
    .blur()
    .get(formControls.costAccounts_AddForm_Description)
    .type(costAccount.description)
    .blur();
  cy.waitForSpinnerIcon();
  cy.wait(4000);
});

Cypress.Commands.add('editActiveToInactiveCostAccount', function (costAccount: any) {
  cy.get(formControls.costAccount_editBtn).click().wait(500);
  cy.activeToInactiveCostAccount(costAccount);
});

Cypress.Commands.add('activeToInactiveCostAccount', function (costAccount: any) {
  const button = costAccount.active
    ? 'manageCostAccounts_AddForm_ActiveRadioBtn'
    : 'manageCostAccounts_AddForm_InactiveRadioBtn';
  cy.getElements(button).click();
  cy.get(formControls.saveCloseBtn)
    .wait(1000)
    .click()
    .wait(['@updateCostAccount'], { timeout: 40000 }).its('response.statusCode').should('eq', 200);
  cy.wait(4000);
});

Cypress.Commands.add('verifyInactiveRadioBtnSelectedInEditCA', function () {
  cy.get(formControls.inactiveRadioBtnCheckedCA).should('exist');
  cy.get(formControls.activeRadioBtnCheckedCA).should('not.exist');
  cy.get(formControls.closeButton).click({ force: true });
});

Cypress.Commands.add('searchInactiveCostAccount', function (costAccount: any) {
  for (let i = 0; i < 3; i++) {
    cy.refreshCostAccount();
  }
  cy.intercept('POST', 'api/cost-accounts/v1/costAccounts/advanceSearch?*query=' + costAccount).as('searchCostAc');
  cy.get(formControls.searchBox).focus().clear().type(costAccount).wait('@searchCostAc').its('response.statusCode').should('eq', 200);
  cy.get(formControls.noCostAccountIcon).should('have.length', 1);
});

Cypress.Commands.add('selectInactiveAccountsCheckBox', function () {
  cy.waitForSpinnerIcon();
  cy.get(formControls.showInactiveAccountsCheckBox).click().waitForSpinnerIcon();
});

Cypress.Commands.add('refreshCostAccount', function () {
  cy.wait(2000);
  for (let i = 0; i < 3; i++) {
    cy.get(formControls.costAccRefreshBtn, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
    cy.waitForSpinners();
    cy.wait(2000);
  }
});

Cypress.Commands.add('expandRowInGrid', function () {
  cy.get(formControls.expandRow, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true }).wait(500);
});

Cypress.Commands.add('addAndCloseInAddSubCostAccount', () => {
  cy.get(formControls.addAndCloseButtoninAddSubCA)
    .wait(1000)
    .click()
    .wait(['@addCostAccount'], { timeout: 40000 }).wait(4000);
});

Cypress.Commands.add('deleteCostAccountViaAPI', () => {
  cy.get('@XSRFToken').then((token) => {
    cy.request({
      method: "PUT",
      url: 'api/cost-accounts/v2/costAccounts/' + costAccount_ID + '/archive',
      failOnStatusCode: true,
      retryOnNetworkFailure: true,
      headers: token
    })
  });
});

function addCostAccountAPI(): any {
  return cy.wait('@addCostAccount').then(function (response) {
    return response;
  });
}

function getCostAccountID() {
  addCostAccountAPI().then(async (interception) => {
    const res = JSON.parse(JSON.stringify(interception.response.body));
    const respStatus = interception.response.statusCode;
    expect(respStatus).to.eq(201);
    costAccount_ID = res.accountID;
    Helpers.log(costAccount_ID);
  });
}

Cypress.Commands.add('clickOnEditIconOfCostAccount', function () {
  cy.get(formControls.costAccount_editBtn).click().wait(500);
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('clickOnLocationRadioButtonInCostAccountPopup', function () {
  cy.get(formControls.locationAccessLevel).click().wait(500);
  cy.waitForSpinnerIcon();
  cy.get('body').then((body) => {
    if (body.find(formControls.optionSelectedInDrpdwn).length > 0) {
      Helpers.log("Seems User having only 1 Location and it got selected automatically");
    } else {
      cy.get(formControls.caLocDrodpwn).click();
      cy.get(formControls.dropDownText).first().click({ force: true });
    }
  });
});

Cypress.Commands.add('getShareLevelAtTextInGrid', function (accessLevel: any) {
  cy.get(formControls.shareLevelAtTextInGrid).contains(accessLevel);
});

Cypress.Commands.add('clickOnDivisionRadioButtonInCostAccountPopup', function () {
  cy.get(formControls.divisionAccessLevel).click({ force: true }).wait(500);
  cy.waitForSpinnerIcon();
  cy.get('body').then((body) => {
    if (body.find(formControls.optionSelectedInDrpdwn).length > 0) {
      Helpers.log("Seems User having only 1 division and it got selected automatically");
    } else {
      cy.get(formControls.selectDivisionDrpDownInEditCA).should('be.visible').click().wait(500);
      cy.get(formControls.divisionDropdownOptionInCA).first().click();
      cy.get(formControls.selectDivisionDrpDownInEditCA).click();
    }
  });
});

Cypress.Commands.add('clickOnEnterpriseRadioButtonInCostAccountPopup', function () {
  cy.wait(1000);
  cy.get(formControls.enterpriseAccessLevel).click({ force: true }).wait(500);
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('clickOnDivisionFilterInCAPage', function (divisionFilterValue: any) {
  cy.waitForSpinnerIcon();
  cy.get(formControls.costAccount_DivisionFilter, { timeout: 40000 }).should('be.visible').click().wait(2000);
  cy.get(formControls.CARoleTypeTxtBox, { timeout: 40000 }).should('be.visible').focus()
    .clear().type(divisionFilterValue)
    .get(formControls.selectRole).first().click({ force: true }).wait(1000);
  cy.get(formControls.costAccount_DivisionFilter, { timeout: 40000 }).click();
  cy.wait(3000); //Specifically added this wait as it gets slower in fedramp environment
});

Cypress.Commands.add('clickOnLocationFilterInCAPage', function (locationFilterValue: any) {
  cy.waitForSpinnerIcon();
  cy.get(formControls.costAccount_LocationFilter, { timeout: 40000 }).should('be.visible').click().wait(2000);
  cy.get(formControls.CARoleTypeTxtBox, { timeout: 40000 }).should('be.visible').focus()
    .clear().type(locationFilterValue)
    .get(formControls.selectRole).first().click({ force: true }).wait(1000);
  cy.get(formControls.costAccount_LocationFilter, { timeout: 40000 }).click();
  cy.wait(3000);//Specifically added this wait as it gets slower in fedramp environment
});

Cypress.Commands.add('verifyInactiveCANotPresentInAddUser', function (inactiveCostAccount) {
  cy.get(formControls.selectCostAccount).click();
  cy.get("div[role='option'] span").should('not.contain', inactiveCostAccount);
});

Cypress.Commands.add('validateDuplicateCostAccountErrorMessage', (costAccount: any) => {
  cy.get(formControls.costAccounts_AddForm_Save).wait(3000).click();
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.duplicateCostAccountErrorModal).invoke('text').then(actualCAErrorMessage => {
    assert.equal(errorMessage_DuplicateCostAccount, actualCAErrorMessage, 'Verified the Error Message');
  });
  cy.get(formControls.closeIconInAlertModal).click().wait(1000);
  cy.waitForSpinnerIcon();
  cy.get(formControls.closeButton).click({ force: true });
});

Cypress.Commands.add('validateDeleteCostAccountErrorMessage', () => {
  cy.get(formControls.costAccount_deleteBtn, { timeout: 10000 }).should('be.visible').click({ force: true }).wait(1000)
    .get(formControls.deleteModalConfirmBtn, { timeout: 10000 }).should('be.visible').click().wait(2000);
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.duplicateCostAccountErrorModal).invoke('text').then(actualCAErrorMessage => {
    expect(actualCAErrorMessage).to.have.string(errorMessage_DeleteCostAccount1);
  });
  cy.get(formControls.closeIconInAlertModal).click({ force: true });
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('validateCAImportFailAlertMessage', () => {
  cy.get(formControls.alertDialogMessage).should('be.visible').contains("Are you sure you want to download failed records file?");
  cy.get(formControls.deleteConfirm).should('be.visible');
  cy.get(formControls.cancelButtonInAlert).should('be.visible');
  cy.get(formControls.closeIconInAlertModal).should('be.visible').click();
});

Cypress.Commands.add('verifySearchCANotExist', function (costAccount: any) {
  cy.refreshCostAccount();
  cy.intercept('POST', 'api/cost-accounts/v1/costAccounts/advanceSearch?*query=' + costAccount).as('searchCostAc');
  cy.get(formControls.searchBox).focus().clear().type(costAccount).wait('@searchCostAc');
  cy.get(formControls.noCostAccountIcon).should('have.length', 1).wait(500);
});

Cypress.Commands.add('importDuplicateCostAccount', (filePath) => {
  cy.clickManualImportCostAccount();
  cy.wait(500)
    .get("#enterprise").click()
    .get(formControls.importFileInput)
    .attachFile(filePath);
  cy.get(formControls.continueButton, { timeout: 30000 })
    .should('be.visible')
    .click().wait(1000);
  cy.get(formControls.locationImportSaveBtn, { timeout: 30000 })
    .should('be.visible')
    .click();
  cy.get(formControls.importProgressBar, { timeout: 90000 }).should('have.length', 0).wait(2000);
  cy.waitForimportStatusProcessed('@importFileStatus', 30);
});

function generateImportFileForCAImport(filePath: string, newCostAccount: any) {
  cy.writeFile(filePath, 'Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable\n');
  cy.writeFile(filePath, newCostAccount.name + ',' + newCostAccount.code + ',' + newCostAccount.description + ',' + newCostAccount.passwordEnabled + ',' + newCostAccount.passwordCode + ',' + newCostAccount.status + ',' + '' + ',' + '' + ',' + newCostAccount.billable + ',\n', {
    flag: 'a+'
  });
}

Cypress.Commands.add('createDataForImportCAFile', (filePath: string, newCostAccount: any) => {
  generateImportFileForCAImport(filePath, newCostAccount);
});

Cypress.Commands.add('validateInactiveReferenceCostAccountErrorMessage', () => {
  cy.get(formControls.costAccount_editBtn).should('be.visible').click({ force: true }).wait(500);
  cy.get(formControls.manageCostAccounts_AddForm_InactiveRadioBtn).click();
  cy.get(formControls.costAccounts_AddForm_Save)
    .wait(1000)
    .click()
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.duplicateCostAccountErrorModal).invoke('text').then(actualCAErrorMessage => {
    expect(actualCAErrorMessage).to.have.string(errorMessage_InactiveAssinedCostAccount1);
    expect(actualCAErrorMessage).to.have.string(errorMessage_InactiveAssinedCostAccount2);
  });
  cy.get(formControls.closeIconInAlertModal).click({ force: true });
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('clickOnAscendingOrDescendingIcon', (iconToSelect: string, columnId: number) => {
  cy.waitForSpinnerIcon();
  if (iconToSelect === 'Ascending') {
    Helpers.log("Entering the Ascending loop");
    cy.get('body').then((body) => {
      if (body.find(format(formControls.sortingIcon, columnId)).length > 0) {
        cy.get(format(formControls.sortingIcon, columnId)).click();
      } else if (body.find("i[class*='pi-sort-amount-down']").length > 0) {
        cy.wait(2000).get(formControls.descendingIcon, { timeout: 20000 }).click({ force: true });
        Helpers.log("Clicked the Ascending Icon");
      } else {
        Helpers.log("Already Sorting is in Ascending State");
      }
    });
  } else if (iconToSelect === 'Descending') {
    Helpers.log("Entering the Descending loop");
    cy.get('body').then((body) => {
      if (body.find(format(formControls.sortingIcon, columnId)).length > 0) {
        cy.get(format(formControls.sortingIcon, columnId)).click();
      } else if (body.find("i[class*='pi-sort-amount-up']").length > 0) {
        cy.wait(2000).get(formControls.ascendingIcon, { timeout: 20000 }).click();
        Helpers.log("Clicked the Descending Icon");
      } else {
        Helpers.log("Already Sorting is in Descending State");
      }
    });
  }
});

Cypress.Commands.add('checkDataInAscendingOrderOrNot', (columnToVerify: number) => {
  //2 - Cost Account Name, 3 - Code, 5 - Share Level At, 6 - Share Level Entities Count
  //Note: No Sorting icon for Description column
  let actualArray = [];
  let expectedArray = [];
  cy.get(format(formControls.costAccountGridColumnValue, columnToVerify)).each((el, index, $list) => {
    let actualText = Cypress.$(el).text();
    actualArray.push(actualText); //Storing all the column values in the "actualArray"
    expectedArray.push(actualText); //Storing all the column values in the "expectedArray"
    Helpers.log(el.text());
  }).then(() => {
    let expectedArrayAfterSorted = expectedArray.sort(); //Sorting the values inside the "expectedArray"
    expect(JSON.stringify(expectedArrayAfterSorted)).to.be.eq(JSON.stringify(actualArray));
  })
});

Cypress.Commands.add('checkDataInDescendingOrderOrNot', (columnToVerify: number) => {
  //2 - Cost Account Name, 3 - Code, 5 - Share Level At, 6 - Share Level Entities Count
  //Note: No Sorting icon for Description column
  let actualArray = [];
  let expectedArray = [];
  cy.get(format(formControls.costAccountGridColumnValue, columnToVerify)).each((el, index, $list) => {
    let actualText = Cypress.$(el).text();
    actualArray.push(actualText); //Storing all the column values in the "actualArray"
    expectedArray.push(actualText); //Storing all the column values in the "expectedArray"
    Helpers.log(el.text());
  }).then(() => {
    let expectedArrayAfterSorted = expectedArray.sort(); //First,Sorting the values inside the "expectedArray"
    let expectedArrayAfterReverseSorted = expectedArrayAfterSorted.reverse(); //The, Reverse Sorting the values inside the "expectedArrayAfterSorted"
    expect(JSON.stringify(expectedArrayAfterReverseSorted)).to.be.eq(JSON.stringify(actualArray));
  })
});

Cypress.Commands.add('addCostAccountWithBillableAndPassword', function (costAccount: any) {
  cy.get(formControls.costAccount_AddBtn).contains('Add Account').click()
    .get(formControls.costAccounts_AddForm_Name).type(costAccount.name).blur()
    .get(formControls.costAccounts_AddForm_Description).type(costAccount.description).blur();
  cy.get(formControls.billableCheckBoxInCostAccountModal).click();
  cy.get(formControls.passwordEnabledCheckBoxInCAModal).click()
  cy.get(formControls.passwordTextBoxInCAModal).should('be.visible').click().type('test').blur;
  cy.get(formControls.confirmPasswordTextBoxInCAModal).should('be.visible').click().type('test').blur;
});

Cypress.Commands.add('verifyBillableIconIsPresentOrNot', function (newCostAccount: string) {
  cy.get(formControls.costAccounts_SearchResultRow1).should('have.length', 1).and('include.text', newCostAccount);
  cy.get(formControls.miniIconOfBillableInCAGrid).should('be.visible').and('have.length', 1);
});

Cypress.Commands.add('verifyPasswordEnabledIconIsPresentOrNot', function (newCostAccount: string) {
  cy.get(formControls.costAccounts_SearchResultRow1).should('have.length', 1).and('include.text', newCostAccount);
  cy.get(formControls.miniIconOfPasswordEnabledInCAGrid).should('be.visible').and('have.length', 1);
});

Cypress.Commands.add('deletePasswordEnabledCostAccount', function () {
  cy.wait(2000);
  cy.get(formControls.costAccount_deleteBtn, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.get(formControls.passwordTextBoxInCAModal, { timeout: 10000 }).should('be.visible').click().type('test').blur();
  cy.get(formControls.validateButton).click();
  cy.get(formControls.deleteModalConfirmBtn, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
    .wait('@deleteCostAccount').its('response.statusCode').should('eq', 200);
  cy.waitForSpinners();
  cy.wait(2000);
});

Cypress.Commands.add('addSubCostAccountUnderPasswordEnabledParent', function (costAccount: any) {
  cy.get(formControls.costAccount_subCostAccBtn, { timeout: 9000 }).should('be.visible').click();
  cy.get(formControls.passwordTextBoxInCAModal, { timeout: 10000 }).should('be.visible').click().type('test').blur();
  cy.get(formControls.validateButton).click();
  cy.wait(2000);//Specifically added this wait as it gets slower in fedramp environment
  cy.get(formControls.costAccounts_AddForm_Name, { timeout: 10000 }).type(costAccount.name).blur()
    .get(formControls.costAccounts_AddForm_Code).type(costAccount.code).blur()
    .get(formControls.costAccounts_AddForm_Description).type(costAccount.description).blur();
});

Cypress.Commands.add('addSubSubCostAccountUnderPasswordEnabledParent', function (costAccount: any) {
  cy.get(formControls.costAccount_subSubCostAccBtn, { timeout: 90000 }).should('be.visible').click();
  cy.get(formControls.passwordTextBoxInCAModal, { timeout: 10000 }).should('be.visible').click().type('test').blur();
  cy.get(formControls.validateButton).click();
  cy.wait(2000);//Specifically added this wait as it gets slower in fedramp environment
  cy.get(formControls.costAccounts_AddForm_Name, { timeout: 10000 }).type(costAccount.name).blur()
    .get(formControls.costAccounts_AddForm_Code).type(costAccount.code).blur()
    .get(formControls.costAccounts_AddForm_Description).type(costAccount.description).blur();
});

Cypress.Commands.add('clickOnEditIconOfSubCA', function () {
  cy.get(formControls.editSubCostAccountIcon, { timeout: 4000 }).click({ force: true }).wait(500);
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('clickOnEditIconOfSubSubCA', function () {
  cy.get(formControls.editSubSubCostAccountIcon, { timeout: 4000 }).click({ force: true }).wait(500);
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('updateDescirption', function (message: string) {
  cy.get(formControls.costAccounts_AddForm_Description).type(message).blur();
});

Cypress.Commands.add('exportCostAccount', () => {
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () { doc.location.reload() }, 5000)
    })
    cy.get(formControls.costAccount_exportBtn).should('be.visible').click();
  })
  cy.wait(3000);
  getDataFromExportJobAPI().then(async (interception) => {
    jobResponse_Export = JSON.parse(JSON.stringify(interception.response.body));
    cy.wait(12000);
    Helpers.log(jobResponse_Export);
  });

});

Cypress.Commands.add('getJobIdForExportCostAccount', () => {
  cy.request('GET', 'api/subscription-management/v1/userProperties').then(async (response) => {
    const responseDataSubId = response.body[0].subID;
    const responseDataUserId = response.body[0].userID;
    cy.request('/api/cost-accounts/v2/subscriptions/' + responseDataSubId + '/users/' + responseDataUserId + '/costAccounts/export?requireLogFile=true&excludeIDs=false&jobConfigID=COST_ACCOUNT_EXPORT&locale=en-US&capability=all').then((response) => {
      cy.wrap(response.body.jobId).as('jobId');
    });
  });
});

Cypress.Commands.add('verifyCostAccountExport', () => {
  Helpers.log("Entering the verifyCostAccountExport method");
  cy.get('@jobId').then(id => {
    Helpers.log(`job id is ${id}`);
    cy.request(`/api/cost-accounts/v2/costAccounts/jobs/${id}/status`).then((response) => {
      let res = response.body.status;
      Helpers.log(`status is ${res}`);
      if (response.body.status !== 'Processed') {
        Helpers.log("still status is not Processed. So calling this method again");
        cy.verifyCostAccountExport();
      } else {
        cy.wait(1000);
        const requestData = response.body.exportFileLocation;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(200);
          expect(data.body.toString())
            .includes("Name,AccountID,Code,ParentName,NextParentName,Description,Billable,PasswordEnabled,PasswordCode,Status");
        })
      }
    })
  });
});

Cypress.Commands.add('downloadFileInsideJobStatusInCostAcc', (optionToSelect: string, textToSearch: string) => {
  cy.wait(4000);
  cy.get(formControls.jobStatusBtnInCostAcc).click();
  cy.wait(2000);
  cy.get(formControls.jobsHistoryOptionInJobsStatusDrpdwn).click().wait(`@getCostAccJobs`, { timeout: 10000 });
  cy.selectDropdownInJobStatus(optionToSelect, textToSearch);
  cy.wait(1000);
  cy.get(formControls.jobIdColumnInJobStatus).invoke('text').then((jobIdInJobStatus) => {
    cy.get(formControls.downloadLinkInsideJobStatus_ErrorFile).first().click();
    cy.waitForSpinnerIcon();
    cy.wait(3000);
    cy.window().document().then(function (doc) {
      doc.addEventListener('click', () => {
        setTimeout(function () { doc.location.reload() }, 5000)
      })
      cy.xpath(formControls.downloadBtnInsideJobStatus).click();
    })
    cy.wait(3000);
    cy.waitForSpinnerIcon();
    cy.wait(3000);
    if (textToSearch == 'ProcessingError') {
      cy.request(`/api/cost-accounts/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=error`).then((response) => {
        const requestData = response.body.url;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(310);
          expect(data.body.toString())
            .includes("Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable,error");
        });
      });
    } else {
      cy.request(`/api/cost-accounts/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=output`).then((response) => {
        const requestData = response.body.url;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(310);
          expect(data.body.toString())
            .includes("Name,AccountID,Code,ParentName,NextParentName,Description,Billable,PasswordEnabled,PasswordCode,Status");
        });
      });
    }

  });
});

Cypress.Commands.add('selectDropdownInJobStatus', (status: string, textToSearch: string) => {
  cy.xpath(formControls.jobsHistory).click().wait(1000);
  cy.get(formControls.drpdwnInsideJobStatus).click().wait(1000);
  cy.get(formControls.drpdwnText).contains(status).click({ force: true }).wait(500);
  cy.get(formControls.searchBarInJobStatus).click().clear().type(textToSearch).wait(5000);

});

Cypress.Commands.add('downloadSampleFile_CostAcc', () => {
  cy.wait(4000);
  cy.clickManualImportCostAccount();
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () {
        // Below is needed to fool cypress waiting for new page load
        //doc.location.href = 'about:blank';
      }, 5000);
    })
    cy.get(formControls.downloadCostAccSampleFile).should('be.visible').click();
  })
  cy.request(`api/cost-accounts/v1/costAccounts/import/fieldsList?type=default`).then((response) => {
    let res = response.status;
    Helpers.log(`status is ${res}`);
    expect(response.body.toString())
      .includes("Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable");
  })
  cy.wait(3000);
  cy.get(formControls.btnCancel).click();
  cy.wait(1000);
});

Cypress.Commands.add('clickAutoimportCostAccount', () => {
  cy.get(formControls.importTypeDropdown, { timeout: 5000 }).click()
    .get(formControls.importAutomatic, { timeout: 15000 }).click();
});

Cypress.Commands.add('enterSFTPDetails', (fileDetails) => {
  cy.get(formControls.autosImportSFTPFilePathId, { timeout: 15000 }).clear().type(fileDetails.sftpFileLocation)
    .get(formControls.autosImportSFTPServerUrl).clear().type(fileDetails.sftpServerURL)
    .get(formControls.autosImportSFTPUsername).clear().type(fileDetails.sftpUserName)
    .get(formControls.autosImportSFTPPassword).clear().type(fileDetails.sftpPassword)
    .wait(1000);
  for (let i = 0; i < 7; i++) {
    Helpers.log(` time is ${i}`);
    cy.get('body').then(($body) => {
      if ($body.find(formControls.autoSFTPConnectionSuccess).length === 0) {
        cy.get(formControls.autosImportSFTPTestAccessBtn).click().waitForSpinnerIcon();
        Helpers.log("SFTP connection is successfull");
        flag = true;
      } else if (i === 7) {
        throw new Error("Connection failed. Check your access details and try again");
      }
    });
    if (flag) break;
  }
  cy.wait('@validateSFTP');
});

Cypress.Commands.add('configureAutoImport', (fileDetails) => {
  cy.get(formControls.autosImportSFTPNotificationHeader, { timeout: 5000 }).click()
    .get(formControls.emailId).clear().type(fileDetails.emailIdForNotification)
    .get(formControls.autosImportScheduleHeader).click()
    .get(formControls.autoImportScheduleSelectDays).click()
    .get(formControls.autoImportScheduleDefaultDays).click()
    .get(formControls.autoImportScheduleSelectTime).click()
    .get(formControls.dropDownText).first().click();
});

Cypress.Commands.add('saveConfiguration', () => {
  cy.get(formControls.autoImportButtonContinue).click()
    .waitForSpinnerIcon();
  cy.wait(3000);
  cy.get(formControls.autoImportButtonSaveConfiguration, { timeout: 5000 }).should('be.visible').click();
});

Cypress.Commands.add('selectTextDelimiter', (selectTextDelimiter: any) => {
  cy.get(formControls.autosImportTextDelimiter, { timeout: 5000 }).should('be.visible').click();
  cy.xpath(format(formControls.textDelimiterOptions, selectTextDelimiter)).should('be.visible').click({ force: true });
  cy.waitForSpinnerIcon();
  cy.wait(5000);
});

Cypress.Commands.add('verifyImportSuccessToast', () => {
  cy.get(formControls.importToastTitle, { timeout: 30000 })
    .contains('Success')
    .get(formControls.importToastTitle, { timeout: 30000 })
    //.contains('Uploaded Records')
    .should('not.have.text', 'Failed Records');
});

Cypress.Commands.add('verifyImportFailedToast', () => {
  cy.get(formControls.importToastTitle, { timeout: 30000 }).contains('Failed')
    .should('not.have.text', 'Success')
  cy.get(formControls.importToastMessage, { timeout: 30000 }).contains("Total Records: 3 Failed Records 3");
});

function getDataFromScheduleJobAPI(): any {
  return cy.wait('@addScheduleJob').then(function (response) {
    return response;
  });
}

function getDataFromExportJobAPI(): any {
  return cy.wait('@getExportJobId').then(function (response) {
    return response;
  });
}

Cypress.Commands.add('updateScheduleJob', (fileDetails, textDelimiter) => {
  getDataFromScheduleJobAPI().then(async (interception) => {
    jobResponse = JSON.parse(JSON.stringify(interception.response.body));
    cy.get('@XSRFToken').then((xsrfToken) => {
      cy.request({
        method: 'PUT',
        url: 'api/job-management/v1/scheduledJobs/' + jobResponse.scheduledJobID,
        failOnStatusCode: false,
        headers: xsrfToken,
        body:
        {
          "scheduledJobID": jobResponse.scheduledJobID,
          "name": jobResponse.name,
          "subID": jobResponse.subID,
          "jobConfigID": "COST_ACCOUNT_IMPORT",
          "jobSource": "COST_ACCOUNT_MANAGEMENT",
          "textDelimiter": textDelimiter,
          "type": "Import",
          "cron": "*/1 * * * *",
          "parameters": {
            "additionalEmailIds": [
              fileDetails.emailIdForNotification
            ],
          },
          "lastRunTimeStamp": "0001-01-01T00:00:00Z",
          "integrationDetails": {
            "integrationType": "SFTP",
            "sftpTDetails": {
              "sftpServerURL": fileDetails.sftpServerURL,
              "sftpUserName": fileDetails.sftpUserName,
              "sftpPassword": fileDetails.sftpPassword,
              "sftpFileLocation": fileDetails.sftpFileLocation
            }
          },
          "archived": false,
          "fieldMapping": jobResponse.fieldMapping,
          "permission": {
            "permissionByEntity": "E",
            "permissionByValue": [
              "xMQZ9Dney6Q"
            ]
          }
        }
      });
    });
  });

  if (Cypress.env('appEnv').includes('fed') === true) {
    cy.wait(80000);
    cy.deleteAllRecordsInConfigTabViaAPI();
  } else {
    cy.wait(80000);
    cy.clickAutoConfigurationimportList();
    cy.deleteAutoimportList();
  }
});

Cypress.Commands.add('clickAutoimportList', () => {
  cy.xpath(formControls.automaticImportList, { timeout: 5000 }).click();
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('clickAutoConfigurationimportList', () => {
  cy.xpath(formControls.automaticConfigurationList, { timeout: 5000 }).click();
  cy.get('body').then(($body) => {
    if ($body.find('table[role=grid] tbody tr').length === 1) {
      cy.get(formControls.tableGridRow)
        .should('include.text', 'CostAccount').wait(3000);
    }
  });
  cy.wait(2000);
});

Cypress.Commands.add('clickHistoryimportList', () => {
  cy.xpath(formControls.automaticHistoryList, { timeout: 5000 }).click();
  cy.get('body').then(($body) => {
    if ($body.find('table[role=grid] tbody tr').length) {
      cy.get(formControls.tableGridRow)
        .should('include.text', 'CostAccount').wait(2000);
    }
  });
  cy.waitForSpinnerIcon();
  cy.waitForSpinners();
});

Cypress.Commands.add('deleteAutoimportList', () => {
  cy.get(formControls.autoConfigDeleteBtn, { timeout: 10000 }).click()
  cy.get(formControls.deleteConfirmLink, { timeout: 10000 }).click()
    .wait('@delScheduleConfig');
});

Cypress.Commands.add('deleteAllRecordsInHistoryTab', () => {
  Helpers.log("Entering deleteAllRecordsInHistoryTab method");
  cy.wait(1000);
  cy.get('body').then(($body) => {
    if ($body.find(formControls.noContactText).length) {
      Helpers.log("No Jobs found")
    } else {
      cy.get(formControls.tableGridRow).each((item, index, list) => {
        cy.get(formControls.autoConfigDeleteBtn, { timeout: 10000 }).click()
        cy.get(formControls.deleteConfirmLink, { timeout: 10000 }).click();
        cy.get(formControls.importUser_ToastMessage, { timeout: 90000 }).should('have.length', 1);
        cy.wait('@deleteHistory');
        cy.wait(1000);
      });
    }
  });
});


Cypress.Commands.add('deleteAllRecordsInConfigTabViaAPI', () => {
  Helpers.log("Entering the deleteAllRecordsInConfigTabViaAPI method");
  cy.request({
    method: "GET",
    url: '/api/job-management/v1/scheduledJobs?skip=0&limit=1000&sortBy=insertTimestamp:desc&jobSource=COST_ACCOUNT_MANAGEMENT',
    failOnStatusCode: false,
    retryOnNetworkFailure: true,
  }).then(async (response) => {
    if (!(response.body.data === null) && (response.status === 200)) {
      let count1 = response.body.data.length;
      Helpers.log(count1);
      if (count1 > 0) {
        for (let i = 0; i < count1; i++) {
          let jobIdToDelete = response.body.data[i].scheduledJobID;
          let scheduleJobId = JSON.stringify(jobIdToDelete);
          Helpers.log(scheduleJobId);
          cy.deleteRecordInConfigTabViaAPI(jobIdToDelete);
        }
      }
    } else {
      Helpers.log("No configurations jobs present");
    }
  });
});

Cypress.Commands.add('deleteRecordInConfigTabViaAPI', (scheduleJobIdToDelete: any) => {
  callDeleteConfigJobsApi(scheduleJobIdToDelete);
});

function callDeleteConfigJobsApi(scheduleJobId: any) {
  cy.get('@XSRFToken').then((xsrfToken) => {
    Helpers.log("Entering the callDeleteConfigJobsApi method")
    cy.request({
      method: "DELETE",
      url: `api/job-management/v1/scheduledJobs/` + scheduleJobId + `/archive`,
      failOnStatusCode: false,
      retryOnNetworkFailure: true,
      headers: xsrfToken
    }).then(async (response) => {
      expect(response.status).to.eq(200);
    })

  });
}

Cypress.Commands.add('deleteAllRecordsInHistoryTabViaAPI', () => {
  Helpers.log("Entering the deleteAllRecordsInHistoryTabViaAPI method")
  cy.request({
    method: "GET",
    url: '/api/job-management/v1/jobs?skip=0&limit=1000&sortBy=insertTimestamp:desc&source=COST_ACCOUNT_MANAGEMENT',
    failOnStatusCode: false,
    retryOnNetworkFailure: true,
  }).then(async (response) => {
    if (!(response.body.data === null) && (response.status === 200)) {
      let count1 = response.body.data.length;
      Helpers.log(count1);
      if (count1 > 0) {
        for (let i = 0; i < count1; i++) {
          let jobIdToDelete = response.body.data[i].jobID;
          let historyJobId = JSON.stringify(jobIdToDelete);
          Helpers.log(historyJobId);
          cy.deleteRecordInHistoryTabViaAPI(jobIdToDelete);
        }
      }
    } else {
      Helpers.log("No History jobs present");
    }
  });
});

Cypress.Commands.add('deleteRecordInHistoryTabViaAPI', (scheduleJobIdToDelete: any) => {
  callDeleteHistoryJobsApi(scheduleJobIdToDelete);
});

function callDeleteHistoryJobsApi(scheduleJobId: any) {
  cy.get('@XSRFToken').then((xsrfToken) => {
    Helpers.log("Entering the callDeleteHistoryJobsApi method")
    cy.request({
      method: "DELETE",
      url: `api/job-management/v1/jobs/` + scheduleJobId + `/archive`,
      failOnStatusCode: false,
      retryOnNetworkFailure: true,
      headers: xsrfToken
    }).then(async (response) => {
      expect(response.status).to.eq(200);
    })

  });
}


Cypress.Commands.add('verifyStatusOfJobInHistoryTab', () => {
  cy.wait(2000);
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  Helpers.log("Entering verifyStatusOfJobInHistoryTab method");
  let expectedStatusMessage = 'Completed';
  cy.get(formControls.tableGridRow, { timeout: 9000 }).invoke('text').then((actualStatusMessage) => {
    Helpers.log(`Actual status message is ${actualStatusMessage}`);
    if ((actualStatusMessage).includes(expectedStatusMessage)) {
      Helpers.log("Entering if Loop");
      expect(actualStatusMessage.trim()).to.be.include(expectedStatusMessage);
    } else if ((actualStatusMessage).includes('Processing')) {
      Helpers.log("Entering else if Loop");
      cy.wait(20000).then((_) => {
        cy.clickAutoConfigurationimportList();
        cy.wait(3000);
        cy.clickHistoryimportList();
        cy.wait(3000);
        cy.get(formControls.tableGridRow, { timeout: 9000 }).invoke('text').then((actualStatusMessage) => {
          if ((actualStatusMessage).includes('Processing')) {
            cy.wait(20000);
          }
        });
        cy.get(formControls.tableGridRow, { timeout: 9000 }).invoke('text').then((actualStatusMessage) => {
          expect(actualStatusMessage.trim()).to.be.include(expectedStatusMessage);
        });
      })
    } else {
      expect(actualStatusMessage.trim()).to.be.include(expectedStatusMessage);
    }
  });
  cy.wait(1000);
});


Cypress.Commands.add('deleteConfigJobIfMoreThanOne', () => {
  Helpers.log("Entering deleteConfigJobIfMoreThanOne method");
  cy.wait(2000);
  cy.get('body').then(($body) => {
    if ($body.find(formControls.noContactText).length) {
      Helpers.log("No Config jobs present")
    } else {
      cy.get(formControls.tableGridRow).each((item, index, list) => {
        cy.get(formControls.autoConfigDeleteBtn, { timeout: 6000 }).should('be.visible').click({ force: true }).wait(1000);
        cy.xpath(formControls.deleteBtnInsideConfigConfirmModal, { timeout: 6000 }).should('be.visible').click();
        cy.get(formControls.importUser_ToastMessage, { timeout: 90000 }).should('have.length', 1);
        cy.wait('@delScheduleConfig');
        cy.wait(1000);
      });
    }
  });
});

Cypress.Commands.add('navigateToCostAccountTab', function () {
  cy.waitForSpinnerIcon();
  cy.xpath(formControls.costAccountTab)
    .click();
  cy.wait(1000);
});

Cypress.Commands.add('deleteAllCostAccountsViaAPI', () => {
  Helpers.log("Entering the deleteAllCostAccountsViaAPI method")
  cy.request({
    method: "GET",
    url: 'api/cost-accounts/v1/costAccounts/advanceSearch?skip=0&limit=1000&status=true',
    failOnStatusCode: false,
    retryOnNetworkFailure: true,
  }).then(async (response) => {
    if (!(response.body === null) && (response.status === 200)) {
      let count1 = response.body.accounts.length;
      Helpers.log(count1);
      if (count1 > 0) {
        for (let i = 0; i < count1; i++) {
          let jobIdToDelete = response.body.accounts[i].accountID;
          let costAccJobId = JSON.stringify(jobIdToDelete);
          Helpers.log(costAccJobId);
          callDeleteCostAccApi(jobIdToDelete);
        }
      }
    } else {
      Helpers.log("No History jobs present");
    }
  });
});

function callDeleteCostAccApi(jobIdToDelete: any) {
  cy.get('@XSRFToken').then((xsrfToken) => {
    Helpers.log("Entering the callDeleteCostAccApi method");
    cy.request({
      method: "PUT",
      url: '/api/cost-accounts/v2/costAccounts/' + jobIdToDelete + '/archive',
      failOnStatusCode: false,
      retryOnNetworkFailure: true,
      headers: token
    })
  });
}

Cypress.Commands.add('verifyFailedJobInHistoryTab', () => {
  cy.wait(4000);
  Helpers.log("Entering verifyFailedJobInHistoryTab method");
  let expectedStatusMessage = 'Failed';
  cy.get(formControls.tableGridRow, { timeout: 9000 }).invoke('text').then((actualStatusMessage) => {
    Helpers.log(`Actual status message is ${actualStatusMessage}`);
    if ((actualStatusMessage).includes(expectedStatusMessage)) {
      Helpers.log("Entering if Loop");
      expect(actualStatusMessage.trim()).to.be.include(expectedStatusMessage);
    } else if ((actualStatusMessage).includes('Processing')) {
      Helpers.log("Entering else if Loop");
      cy.wait(20000).then((_) => {
        cy.clickAutoConfigurationimportList();
        cy.wait(3000);
        cy.clickHistoryimportList();
        cy.wait(3000);
        cy.get(formControls.tableGridRow, { timeout: 9000 }).invoke('text').then((actualStatusMessage) => {
          expect(actualStatusMessage.trim()).to.be.include(expectedStatusMessage);
        });
      })
    } else {
      expect(actualStatusMessage.trim()).to.be.include(expectedStatusMessage);
    }
  });
  cy.wait(1000);
});

Cypress.Commands.add('clickOnAddConfigInALMScheduleImport', () => {
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.addConfigInALMScheduleImport, { timeout: 30000 }).click({ force: true });
  cy.wait(1000);
});

Cypress.Commands.add('clickOnEditConfigInALMScheduleImport', () => {
  cy.get(formControls.editIconInALMScheduleImportPage).click();
  cy.wait(1000);
  cy.wait('@fieldList');
  //cy.wait('@getDivisionAPIInsideScheduleImportEdit');
  //cy.wait('@getLocationAPIInsideScheduleImportEdit');
  cy.wait('@getSftpUserConfigs');
});

Cypress.Commands.add('clickOnDeleteConfigInALMScheduleImport', () => {
  cy.get(formControls.deleteIconInALMScheduleImportPage).click();
  cy.wait(1000);
  //cy.wait('@fieldList');
  //cy.wait('@getDivisionAPIInsideScheduleImportEdit');
  //cy.wait('@getLocationAPIInsideScheduleImportEdit');
  //cy.wait('@getSftpUserConfigs');
  cy.get(formControls.deleteModalTitleALMScheduleImport).should('be.visible').contains("Delete SFTP User Config");
  cy.get(formControls.alertDialogMessage).should('be.visible').contains("Are you sure you want to delete");
  cy.get(formControls.cancelButtonInAlert).should('be.visible');
  cy.get(formControls.closeIconInAlertModal).should('be.visible');
  cy.get(formControls.deleteConfirm).should('be.visible').click();
  cy.wait('@deleteSftpUserConfigs');
  cy.get(formControls.toastTitle, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.toastTitle, { timeout: 30000 })
    .contains('Success')
    .get(formControls.toastMessage, { timeout: 30000 })
    .contains(' Schedule Cost Account Import Delete Successfully');
  cy.get(formControls.toastTitle, { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('selectFrequencyDrpdwn', (optionToSelect: string) => {
  cy.get(formControls.drpdwnFrequencyInALMScheduleImport, { timeout: 30000 }).click().type(optionToSelect).get(formControls.drpdwnText).click();
  cy.wait(1000);
});

Cypress.Commands.add('verifySelectedOptionInFrequencyDrpdwn', (textToDisplay: string) => {
  cy.get(formControls.optionSelectedInFrequencyDrpdwn, { timeout: 30000 }).contains(textToDisplay);
  cy.wait(1000);
});

Cypress.Commands.add('clickOnContinueBtn', () => {
  cy.get(formControls.btnContinue, { timeout: 30000 }).click();
  cy.wait('@validateSFTPInALMScheduleImport');
  cy.waitForSpinnerIcon();
  cy.waitForSpinners();
  cy.wait(1000);
});

Cypress.Commands.add('clickOnSaveAndCloseBtn', () => {
  cy.waitForSpinnerIcon();
  cy.get(formControls.saveCloseBtn, { timeout: 30000 }).click();
  cy.wait('@getSftpUserConfigs');
  cy.get(formControls.toastTitle, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.toastTitle, { timeout: 30000 })
    .contains('Success')
    .get(formControls.toastMessage, { timeout: 30000 })
    .contains('Schedule Cost Account Import Successfully');
  cy.get(formControls.toastTitle, { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('createScheduleCostAccImportALMConfig', (fileDetails) => {
  cy.get(formControls.autosImportSFTPFilePathId, { timeout: 15000 }).clear().type(fileDetails.sftpFileLocation);
  cy.get(formControls.autosImportSFTPServerUrl, { timeout: 30000 }).clear().type(fileDetails.sftpServerURL)
    .get(formControls.autosImportSFTPUsername, { timeout: 30000 }).clear().type(fileDetails.sftpUserName)
    .get(formControls.autosImportSFTPPassword, { timeout: 30000 }).clear().type(fileDetails.sftpPassword)
    .wait(1000)
    .get(formControls.drpdwnFrequencyInALMScheduleImport, { timeout: 30000 }).click().type(fileDetails.frequency).get(formControls.drpdwnText).click();
  cy.clickOnContinueBtn();
  cy.clickOnSaveAndCloseBtn();
});

Cypress.Commands.add('createScheduleCostAccImportALMConfigWithEmailId', (fileDetails) => {
  cy.get(formControls.autosImportSFTPFilePathId, { timeout: 15000 }).clear().type(fileDetails.sftpFileLocation);
  cy.get(formControls.autosImportSFTPServerUrl, { timeout: 30000 }).clear().type(fileDetails.sftpServerURL)
    .get(formControls.autosImportSFTPUsername, { timeout: 30000 }).clear().type(fileDetails.sftpUserName)
    .get(formControls.autosImportSFTPPassword, { timeout: 30000 }).clear().type(fileDetails.sftpPassword)
    .get(formControls.emailId, { timeout: 30000 }).clear().type(fileDetails.emailIdForNotification)
    .wait(1000)
    .get(formControls.drpdwnFrequencyInALMScheduleImport, { timeout: 30000 }).click().type(fileDetails.frequency).get(formControls.drpdwnText).click();
  cy.clickOnContinueBtn();
  cy.clickOnSaveAndCloseBtn();
});

Cypress.Commands.add('verifALMScheduleImportGridHeaders', () => {
  cy.get(formControls.almScheduleImpGrid_SFTPPATH, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.almScheduleImpGrid_FREQUENCY, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.almScheduleImpGrid_LASTEXECUTIONTIME, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.almScheduleImpGrid_NEXTEXECUTIONTIME, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.almScheduleImpGrid_ACCESSLEVEL, { timeout: 30000 }).should('be.visible');
});

Cypress.Commands.add('verifALMScheduleImportGridContents', (sftpFileLocation: string, frequency: string, lastExecution: string, nextExecution: string, accessLevelToCheckInGrid: string) => {
  cy.get(formControls.almScheduleImpGrid_SFTPPATH_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(sftpFileLocation);
  });
  cy.get(formControls.almScheduleImpGrid_FREQUENCY_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(frequency);
  });
  cy.get(formControls.almScheduleImpGrid_LASTEXECUTIONTIME_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq("");
  });
  cy.get(formControls.almScheduleImpGrid_NEXTEXECUTIONTIME_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq("");
  });
  cy.get(formControls.almScheduleImpGrid_ACCESSLEVEL_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(accessLevelToCheckInGrid);
  });
});

Cypress.Commands.add('verifALMScheduleImportGridContentsUsingJSON', (fileDetails: any) => {
  cy.get(formControls.almScheduleImpGrid_SFTPPATH_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(fileDetails.sftpFileLocation);
  });
  cy.get(formControls.almScheduleImpGrid_FREQUENCY_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(fileDetails.frequency);
  });
  cy.get(formControls.almScheduleImpGrid_LASTEXECUTIONTIME_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq("");
  });
  cy.get(formControls.almScheduleImpGrid_NEXTEXECUTIONTIME_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq("");
  });
  cy.get(formControls.almScheduleImpGrid_ACCESSLEVEL_Value, { timeout: 30000 }).invoke('text').then((text) => {
    expect(text.trim()).to.be.eq(fileDetails.accessLevelToCheckInGrid);
  });

  cy.get(formControls.editIconInALMScheduleImportPage, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.deleteIconInALMScheduleImportPage, { timeout: 30000 }).should('be.visible');
});

Cypress.Commands.add('deleteScheduleImportJobIfMoreThanOne', () => {
  Helpers.log("***********Entering the method to delete more than one cost accounts Jobs present***************");
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get('body').then(($body) => {
    Helpers.log("***********Checking if No result found Text displaying or not***************");
    if ($body.find(formControls.noResultsFound).length) {
      cy.get(formControls.noResultsFound).invoke('text').then((text) => {
        expect(text.trim()).to.be.eq("schedule import not found");
      });
      Helpers.log("No Jobs present")
    } else {
      Helpers.log("***********Checked that No jobs found Text not displayed***************");
      cy.get(formControls.tableGridRow, { timeout: 40000 }).each((item, index, list) => {
        cy.clickOnDeleteConfigInALMScheduleImport();
      });
    }
  });
});

Cypress.Commands.add('clickOnJobsStatusDrpdwn', () => {
  cy.wait(4000);
  cy.get(formControls.jobStatusBtnInCostAcc).click();
  cy.wait(2000);
});

Cypress.Commands.add('selectJobsHistoryDrpdwn', () => {
  cy.get(formControls.jobsHistoryOptionInJobsStatusDrpdwn).click().wait(`@getCostAccJobs`, { timeout: 10000 });
  cy.wait(1000);
});

Cypress.Commands.add('selectExportHistoryDrpdwn', () => {
  cy.get(formControls.exportHistoryOptionInJobsStatusDrpdwn).click().wait(`@getExportHistory`, { timeout: 10000 });
  cy.wait(1000);
});

Cypress.Commands.add('selectJobIdFilterInExportHistory', () => {
  cy.get(formControls.filterInsideExportHistory).click();
  cy.wait(1000);
  cy.get(formControls.jobIdFilterInExportHistory).click().wait(1000);
});

Cypress.Commands.add('selectNameFilterInExportHistory', () => {
  cy.get(formControls.filterInsideExportHistory).click();
  cy.wait(1000);
  cy.get(formControls.nameFilterInExportHistory).click().wait(1000);
});

Cypress.Commands.add('downloadJobInsideExportHistory', () => {
  cy.get(formControls.downloadIconInExportHistory).click();
  cy.wait(1000);
  cy.get(formControls.alertTitle).invoke('text').then((actualText) => {
    assert.equal("Alert", actualText.trim(), 'Verified that Download Modal header title is Alert');
  });
  cy.get(formControls.alertMessage).invoke('text').then((actualText) => {
    expect(actualText.trim()).contains("Are you sure you want to download the");
    expect(true, 'Verified that Download Modal confirmation message').to.be.true;
  });
  cy.waitForSpinnerIcon();
  cy.wait(3000);
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () { doc.location.reload() }, 5000)
    })
    cy.get(formControls.alertConfirm).click();
  })
  cy.wait(3000);
  cy.waitForSpinnerIcon();
  cy.wait(3000);
});

Cypress.Commands.add('deleteJobInsideExportHistory', () => {
  cy.get(formControls.deleteIconInExportHistory).click();
  cy.wait(1000);
  cy.wait(1000);
  cy.get(formControls.alertTitle).invoke('text').then((actualText) => {
    assert.equal("Delete Jobs Status", actualText.trim(), 'Verified that Delete Modal header title');
  });
  cy.get(formControls.alertMessage).invoke('text').then((actualText) => {
    expect(actualText.trim()).contains("Are you sure you want to delete the Jobs Status");
    expect(true, 'Verified that Delete Modal confirmation message').to.be.true;
  });
  cy.get(formControls.alertConfirm).click();
  cy.get(formControls.toastTitle, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.toastTitle, { timeout: 30000 })
    .contains('Success')
    .get(formControls.toastMessage, { timeout: 30000 })
    .contains('CostAccount-Export-')
    .contains('deleted successfully.');
  cy.get(formControls.toastTitle, { timeout: 90000 }).should('have.length', 0);
});

Cypress.Commands.add('searchJobInsideExportHistory', () => {
  cy.selectJobIdFilterInExportHistory();
  cy.wait(2000);
  cy.get(formControls.searchBarInJobStatus).click().type(jobResponse_Export.jobID);
  cy.wait(2000);
  cy.get(formControls.nameColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Name", actualText.trim(), 'Verified that Name column header is present inside the Export History modal');
  });
  cy.get(formControls.jobIdColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Job Id", actualText.trim(), 'Verified that Job Id column header is present inside the Export History modal');
  });
  cy.get(formControls.createdColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Created", actualText.trim(), 'Verified that Created column header is present inside the Export History modal');
  });
  cy.get(formControls.statusColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Status", actualText.trim(), 'Verified that Status column header is present inside the Export History modal');
  });
  cy.get(formControls.detailsColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Details", actualText.trim(), 'Verified that Details column header is present inside the Export History modal');
  });
  cy.get(formControls.actionsColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Actions", actualText.trim(), 'Verified that Actions column header is present inside the Export History modal');
  });
});

Cypress.Commands.add('searchNameInsideExportHistory', () => {
  cy.selectNameFilterInExportHistory();
  cy.wait(2000);
  cy.get(formControls.searchBarInJobStatus).click().clear().type(jobResponse_Export.name);
  cy.wait(2000);
  cy.get(formControls.nameColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Name", actualText.trim(), 'Verified that Name column header is present inside the Export History modal');
  });
  cy.get(formControls.jobIdColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Job Id", actualText.trim(), 'Verified that Job Id column header is present inside the Export History modal');
  });
  cy.get(formControls.createdColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Created", actualText.trim(), 'Verified that Created column header is present inside the Export History modal');
  });
  cy.get(formControls.statusColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Status", actualText.trim(), 'Verified that Status column header is present inside the Export History modal');
  });
  cy.get(formControls.detailsColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Details", actualText.trim(), 'Verified that Details column header is present inside the Export History modal');
  });
  cy.get(formControls.actionsColumnInExportHistory).invoke('text').then(actualText => {
    assert.equal("Actions", actualText.trim(), 'Verified that Actions column header is present inside the Export History modal');
  });

});

Cypress.Commands.add('verifySearchedCostAccountPresent', function (parentAcc: string, subAcc: string, subSubAcc: string) {
  cy.get(formControls.costAccounts_SearchResultRow1)
    .and('include.text', parentAcc)
    .and('include.text', subAcc)
    .and('include.text', subSubAcc);
});
