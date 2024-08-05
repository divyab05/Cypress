///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';

describe('Test Suite :: Cost Accounts', () => {

  beforeEach(() => {
    cy.getUsers().then((users) => {
      const { username, password } = users.clientAdminUser;
      adminConsoleHelpers.loginViaUrl(username, password);
    });
    interceptsCostAccountApiCalls();
    cy.navigateToCostAccountPage();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  const uuidGenerator = () => Cypress._.random(0, 1e5);
  const uniqueNum = `${uuidGenerator()}`;
  const newCostAccount = {
    name: 'AutoCA' + uniqueNum,
    code: 'AutoCC' + uniqueNum,
    description: 'desc text',
    shareLevel: 'Enterprise'
  };

  it(`<@promote_qa @platform_e2e><@platform_ppd>TC001 - Import Single Cost Account`, function () {
    cy.deleteSearchedAccountIfMoreThanOne('Auto_Admin_Single_CA');
    cy.importCostAccount('adminconsole/testData/costaccount/Import_CostAccount_Single.csv', "enterprise", "");
    cy.searchCostAccount('Auto_Admin_Single_CA');
    cy.deleteCostAccount();
  });

  it(`<@promote_qa @platform_e2e><@platform_ppd>Export Cost Account - Verifying in Jobs History to make sure old History download works or not`, function () {
    cy.exportCostAccount();
    cy.getJobIdForExportCostAccount();
    cy.verifyCostAccountExport();
  });

  it(`<@platform_e2e><@platform_ppd>TC003 - Import Hierachy Cost Accounts`, function () {
    cy.deleteSearchedAccountIfMoreThanOne('ImpAutoParentCA');
    cy.importCostAccount('adminconsole/testData/costaccount/Import_CostAccount_Hierarchy.csv', "enterprise", "");
    cy.searchCostAccount('ImpAutoSubSubAccCA');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'ImpAutoParentCA')
      .and('include.text', 'ImpAutoSubAccCA')
      .and('include.text', 'ImpAutoSubSubAccCA');
    cy.deleteCostAccount();
  });

  it(`<@platform_e2e><@platform_ppd>TC004 - Verify Cost Account import fails with Duplicate Account id`, function () {
    const newCostAccountWithDuplicateCode = {
      name: 'newCAWithDuplicateCode' + uniqueNum,
      code: 'AutoCA' + uniqueNum,
      description: 'desc text',
      shareLevel: 'enterprise',
      passwordEnabled: 'FALSE',
      passwordCode: 'FALSE',
      status: 'ACTIVE',
      parentName: '',
      nextParentName: '',
      billable: 'FALSE'
    };
    const newCostAccountWithDuplicateName = {
      name: 'AutoCA' + uniqueNum,
      code: 'newCAWithDuplicateName' + uniqueNum,
      description: 'desc text',
      shareLevel: 'enterprise',
      passwordEnabled: 'FALSE',
      passwordCode: 'FALSE',
      status: 'ACTIVE',
      parentName: '',
      nextParentName: '',
      billable: 'FALSE'
    };
    cy.deleteSearchedAccountIfMoreThanOne('AutoCA');
    cy.addCostAccount(newCostAccount);
    cy.saveCostAccount();
    cy.searchCostAccount(newCostAccount.name);
    cy.wait(5000);
    cy.createDataForImportCAFile('src/fixtures/adminconsole/testData/costaccount/Imp CA with Duplicate Account Id.csv', newCostAccountWithDuplicateCode);
    cy.importDuplicateCostAccount('adminconsole/testData/costaccount/Imp CA with Duplicate Account Id.csv');
    cy.validateCAImportFailAlertMessage();
    cy.verifySearchCANotExist(newCostAccountWithDuplicateCode.name);
    cy.createDataForImportCAFile('src/fixtures/adminconsole/testData/costaccount/Imp CA with Duplicate Account Id.csv', newCostAccountWithDuplicateName);
    cy.importDuplicateCostAccount('adminconsole/testData/costaccount/Imp CA with Duplicate Account Id.csv');
    cy.validateCAImportFailAlertMessage();
    cy.verifySearchCANotExist(newCostAccountWithDuplicateCode.name);
    cy.deleteSearchedAccountIfMoreThanOne('AutoCA');
  });

  it(`<@platform_e2e><@platform_ppd>TC005 - Import Hierachy Cost Accounts with division Access Level`, function () {
    cy.deleteSearchedAccountIfMoreThanOne('DivAccess_ImpAuto_Admin_Parent_CA');
    cy.importCostAccount('adminconsole/testData/costaccount/DivAccess_Import_CostAccount_Hierarchy.csv', "division", "Auto Division Import");
    cy.searchCostAccount('DivAccess_ImpAuto_Admin');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'DivAccess_ImpAuto_Admin_Parent_CA')
      .and('include.text', 'DivAccess_ImpAuto_Admin_SubAcc_CA')
      .and('include.text', 'DivAccess_ImpAuto_Admin_SubSubAcc_CA');
    cy.deleteCostAccount();
  });

  it(`<@platform_e2e><@platform_ppd>TC006 - Import Hierachy Cost Accounts with Location Access Level`, function () {
    cy.deleteSearchedAccountIfMoreThanOne('LocAccess_ImpAuto_Admin_Parent_CA');
    cy.importCostAccount('adminconsole/testData/costaccount/LocAccess_Import_CostAccount_Hierarchy.csv', "location", "Import Auto Location");
    cy.searchCostAccount('ImpAuto_Admin_SubSubAcc_CA');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'LocAccess_ImpAuto_Admin_Parent_CA')
      .and('include.text', 'LocAccess_ImpAuto_Admin_SubAcc_CA')
      .and('include.text', 'LocAccess_ImpAuto_Admin_SubSubAcc_CA');
    cy.deleteCostAccount();
  });

  it(`<@platform_e2e><@platform_ppd>TC007 - Verify update exisiting cost account Name should get failed`, function () {
    cy.deleteSearchedAccountIfMoreThanOne('ImportParentAutoCA');
    cy.importCostAccount('adminconsole/testData/costaccount/Import cost acc with Parent_Sub_Subsub.csv', "enterprise", "");
    cy.searchCostAccount('AccountName3');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'AccountName1')
      .and('include.text', 'AccountName2')
      .and('include.text', 'AccountName3');

    cy.importCostAccount('adminconsole/testData/costaccount/Update Exisitng Cost Acc Name.csv', "enterprise", "");
    cy.verifyImportFailedToast();
    cy.validateCAImportFailAlertMessage();
    cy.waitForSpinnerIcon();
    cy.searchCostAccount('AccountName3');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'AccountName1')
      .and('include.text', 'AccountName2')
      .and('include.text', 'AccountName3');
    cy.deleteCostAccount();
  });

  it(`<@platform_e2e><@platform_ppd>TC008 - Verify update exisiting cost account code should get failed`, function () {
    cy.deleteSearchedAccountIfMoreThanOne('ImportParentAutoCA');
    cy.importCostAccount('adminconsole/testData/costaccount/Import cost acc with Parent_Sub_Subsub.csv', "enterprise", "");
    cy.searchCostAccount('AccountName3');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'AccountName1')
      .and('include.text', 'AccountName2')
      .and('include.text', 'AccountName3');

    cy.importCostAccount('adminconsole/testData/costaccount/Update Exisitng Cost Acc Code.csv', "enterprise", "");
    cy.verifyImportFailedToast();
    cy.validateCAImportFailAlertMessage();
    cy.waitForSpinnerIcon();
    cy.searchCostAccount('AccountName3');
    cy.get(formControls.costAccounts_SearchResultRow1)
      .and('include.text', 'AccountName1')
      .and('include.text', 'AccountName2')
      .and('include.text', 'AccountName3');
    cy.deleteCostAccount();
  });

  it(`<@promote_qa @platform_e2e><@platform_ppd>TC009 - Verify Export history modal display the exported cost acocunts jobs history`, function () {
    cy.exportCostAccount();
    cy.clickOnJobsStatusDrpdwn();
    cy.selectExportHistoryDrpdwn();
    cy.searchJobInsideExportHistory();
    cy.searchNameInsideExportHistory();

  });

  it(`<@promote_qa @platform_e2e><@platform_ppd>TC010 - Verify download and delete jobs works in Export history modal`, function () {
    cy.exportCostAccount();
    cy.clickOnJobsStatusDrpdwn();
    cy.selectExportHistoryDrpdwn();
    cy.searchJobInsideExportHistory();
    cy.downloadJobInsideExportHistory();
    cy.clickOnJobsStatusDrpdwn();
    cy.selectExportHistoryDrpdwn();
    cy.searchJobInsideExportHistory();
    cy.deleteJobInsideExportHistory();
  });


});
