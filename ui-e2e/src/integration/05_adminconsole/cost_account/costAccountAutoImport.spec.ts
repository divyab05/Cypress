///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { sftpUserDetails } from '../../../fixtures/adminconsole/sfptcredentials.json';

describe('Test Suite :: Auto Import Cost Accounts', () => {

  beforeEach(() => {
    cy.getUsers().then((users) => {

      if (Cypress.env('appEnv').includes('fed') === true) {
        const { username, password } = users.noTrackingPlanUser;
        adminConsoleHelpers.loginViaUrl(username, password);
      } else {
        const { username, password } = users.pitneyshipEnterpriseUser;
        adminConsoleHelpers.loginCC(username, password);
      }
      interceptsCostAccountApiCalls();
      cy.navigateToCostAccountPage();
      cy.wait(5000);
      cy.deleteAllRecordsInConfigTabViaAPI();
      cy.deleteAllRecordsInHistoryTabViaAPI();
    });
  });

  afterEach(() => {
    cy.deleteAllRecordsInConfigTabViaAPI();
    cy.deleteAllRecordsInHistoryTabViaAPI();
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });


  it(`<@deleteAutoImportJobs>Delete Auto Import Configurations`, function () {
    for (let i = 0; i < 50; i++) {
      cy.deleteAllRecordsInHistoryTabViaAPI();
    }
  });

  it(`<@autoImportCA>TC001 - Auto Import- Add Cost Account, Search by Name and delete`, function () {

    const newCostAccountToCreate = {
      name: 'AutoImportCA100',
      code: 'A1009',
      description: 'Parent A',
      shareLevel: 'enterprise'
    };
    const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
    const sftpFileDetails = {
      sftpFileLocation: sftpData.sftpFileLocation,
      sftpServerURL: sftpData.sftpServerURL,
      sftpUserName: sftpData.sftpUserName,
      sftpPassword: sftpData.sftpPassword,
      emailIdForNotification: sftpData.emailIdForNotification
    };
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails);
    cy.configureAutoImport(sftpFileDetails);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.deleteCostAccount();
  });

  it(`<@autoImportCA>TC002 - Auto Import Cost Acc - Enterprise Level`, function () {

    const newCostAccountToCreate = {
      name: 'Pitney1',
      code: 'Pitney1',
      description: 'Pitney1',
      shareLevel: 'Enterprise'
    };
    const sftpData = sftpUserDetails['sftpFile_CAComma_Enterprise'];
    const sftpFileDetails = {
      sftpFileLocation: sftpData.sftpFileLocation,
      sftpServerURL: sftpData.sftpServerURL,
      sftpUserName: sftpData.sftpUserName,
      sftpPassword: sftpData.sftpPassword,
      emailIdForNotification: sftpData.emailIdForNotification
    };
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails);
    cy.configureAutoImport(sftpFileDetails);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.deleteAllRecordsInHistoryTabViaAPI();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);
    cy.deleteCostAccount();
  });

  it(`<@autoImportCA>TC003 - Auto Import Cost Acc - Division Level & verify account code cannot be updated for the existing cost accounts`, function () {

    const newCostAccountToCreate = {
      name: 'Bowes1',
      code: 'Bowes1',
      description: 'Bowes1',
      shareLevel: 'Divisions'
    };
    const sftpData = sftpUserDetails['sftpFile_CAComma_Division'];
    const sftpFileDetails = {
      sftpFileLocation: sftpData.sftpFileLocation,
      sftpServerURL: sftpData.sftpServerURL,
      sftpUserName: sftpData.sftpUserName,
      sftpPassword: sftpData.sftpPassword,
      emailIdForNotification: sftpData.emailIdForNotification
    };

    const sftpData1 = sftpUserDetails['sftpFile_CAComma_Loc_SamenameDiffcode'];
    const sftpFileDetails1 = {
      sftpFileLocation: sftpData1.sftpFileLocation,
      sftpServerURL: sftpData1.sftpServerURL,
      sftpUserName: sftpData1.sftpUserName,
      sftpPassword: sftpData1.sftpPassword,
      emailIdForNotification: sftpData1.emailIdForNotification
    };

    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails);
    cy.configureAutoImport(sftpFileDetails);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);


    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails1);
    cy.configureAutoImport(sftpFileDetails1);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails1, ",");
    cy.clickHistoryimportList();
    cy.verifyFailedJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);
    cy.deleteCostAccount();
  });

  it(`<@autoImportCA>TC004 - Auto Import Cost Acc-Location Level-Single Location & updating to Enterprise Access level`, function () {

    const newCostAccountToCreate = {
      name: 'PB1',
      code: 'PB1',
      description: 'PB1',
      shareLevel: 'Locations'
    };
    const sftpData = sftpUserDetails['sftpFile_CAComma_Location'];
    const sftpFileDetails = {
      sftpFileLocation: sftpData.sftpFileLocation,
      sftpServerURL: sftpData.sftpServerURL,
      sftpUserName: sftpData.sftpUserName,
      sftpPassword: sftpData.sftpPassword,
      emailIdForNotification: sftpData.emailIdForNotification
    };

    const sftpData1 = sftpUserDetails['sftpFile_CAComma_LocToEnterprise'];
    const sftpFileDetails2 = {
      sftpFileLocation: sftpData1.sftpFileLocation,
      sftpServerURL: sftpData1.sftpServerURL,
      sftpUserName: sftpData1.sftpUserName,
      sftpPassword: sftpData1.sftpPassword,
      emailIdForNotification: sftpData1.emailIdForNotification
    };
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails);
    cy.configureAutoImport(sftpFileDetails);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);

    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails2);
    cy.configureAutoImport(sftpFileDetails2);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails2, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid("Enterprise");
    cy.deleteCostAccount();
  });

  it(`<@autoImportCA>TC005 - Auto Import Cost Acc-Location Level-Multiple locations & verify account name cannot be updated for the existing cost accounts`, function () {

    const newCostAccountToCreate = {
      name: 'multipleloc1',
      code: 'multipleloc1',
      description: 'multipleloc1',
      shareLevel: 'Locations (2)'
    };
    const sftpData = sftpUserDetails['sftpFile_CAComma_MultiLocation'];
    const sftpFileDetails = {
      sftpFileLocation: sftpData.sftpFileLocation,
      sftpServerURL: sftpData.sftpServerURL,
      sftpUserName: sftpData.sftpUserName,
      sftpPassword: sftpData.sftpPassword,
      emailIdForNotification: sftpData.emailIdForNotification
    };

    const sftpData1 = sftpUserDetails['sftpFile_CAComma_Loc_SamecodeDiffname'];
    const sftpFileDetails1 = {
      sftpFileLocation: sftpData1.sftpFileLocation,
      sftpServerURL: sftpData1.sftpServerURL,
      sftpUserName: sftpData1.sftpUserName,
      sftpPassword: sftpData1.sftpPassword,
      emailIdForNotification: sftpData1.emailIdForNotification
    };

    const deleteIfCostAccountsAlreadyPresent = {
      name: 'multipleloc1',
      code: 'multipleloc1',
      description: 'multipleloc1',
      shareLevel: 'Locations (2)'
    };
    cy.deleteSearchedAccountIfMoreThanOne(deleteIfCostAccountsAlreadyPresent.name);
    cy.searchCostAccount(deleteIfCostAccountsAlreadyPresent.name);
    cy.deleteSearchedAccountIfMoreThanOne(deleteIfCostAccountsAlreadyPresent.name);
    cy.log("***********Completed deleting the cost accounts if already present***************");
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails);
    cy.configureAutoImport(sftpFileDetails);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);

    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails1);
    cy.configureAutoImport(sftpFileDetails1);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails1, ",");
    cy.clickHistoryimportList();
    cy.verifyFailedJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);
    cy.deleteCostAccount();
  });

  it(`<@autoImportCA>TC006 - Auto Import Cost Acc-Enterprise Level-Active to Inactive and vice versa`, function () {

    const newCostAccountToCreate = {
      name: 'activecost3',
      code: 'activecost3',
      description: 'activecost3',
      shareLevel: 'Enterprise'
    };
    const sftpData1 = sftpUserDetails['sftpFile_CAComma_Active'];
    const sftpFileDetails1 = {
      sftpFileLocation: sftpData1.sftpFileLocation,
      sftpServerURL: sftpData1.sftpServerURL,
      sftpUserName: sftpData1.sftpUserName,
      sftpPassword: sftpData1.sftpPassword,
      emailIdForNotification: sftpData1.emailIdForNotification
    };
    const sftpData2 = sftpUserDetails['sftpFile_CAComma_Inactive'];
    const sftpFileDetails2 = {
      sftpFileLocation: sftpData2.sftpFileLocation,
      sftpServerURL: sftpData2.sftpServerURL,
      sftpUserName: sftpData2.sftpUserName,
      sftpPassword: sftpData2.sftpPassword,
      emailIdForNotification: sftpData2.emailIdForNotification
    };
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.deleteSearchedAccountIfMoreThanOne(newCostAccountToCreate.name);
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails1);
    cy.configureAutoImport(sftpFileDetails1);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails1, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);

    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails2);
    cy.configureAutoImport(sftpFileDetails2);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails2, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.clickHistoryimportList();
    cy.deleteAllRecordsInHistoryTab();
    cy.navigateToCostAccountTab();
    cy.verifySearchCANotExist(newCostAccountToCreate.name);
    cy.selectInactiveAccountsCheckBox();
    cy.searchCostAccount(newCostAccountToCreate.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate.shareLevel);

  });

  it(`<@autoImportCA>TC007 - Auto Import Cost Acc-Location Level-Multiple locations & verify Auto update locations like Loc1,Loc2 to Loc1`, function () {

    const newCostAccountToCreate1 = {
      name: 'multipleloc3',
      code: 'multipleloc3',
      description: 'multipleloc3',
      shareLevel: 'Locations (2)'
    };

    const newCostAccountToCreate2 = {
      name: 'multipleloc3',
      code: 'multipleloc3',
      description: 'multipleloc3',
      shareLevel: 'Locations (1)'
    };

    const deleteIfCostAccountsAlreadyPresent = {
      name: 'multipleloc1',
      code: 'multipleloc1',
      description: 'multipleloc1',
      shareLevel: 'Locations (2)'
    };
    const sftpData = sftpUserDetails['sftpFile_CAComma_MultiLocation'];
    const sftpFileDetails = {
      sftpFileLocation: sftpData.sftpFileLocation,
      sftpServerURL: sftpData.sftpServerURL,
      sftpUserName: sftpData.sftpUserName,
      sftpPassword: sftpData.sftpPassword,
      emailIdForNotification: sftpData.emailIdForNotification
    };

    const sftpData1 = sftpUserDetails['sftpFile_CAComma_MultiLocation_Loc1ToLoc2'];
    const sftpFileDetails1 = {
      sftpFileLocation: sftpData1.sftpFileLocation,
      sftpServerURL: sftpData1.sftpServerURL,
      sftpUserName: sftpData1.sftpUserName,
      sftpPassword: sftpData1.sftpPassword,
      emailIdForNotification: sftpData1.emailIdForNotification
    };
    cy.deleteSearchedAccountIfMoreThanOne(deleteIfCostAccountsAlreadyPresent.name);
    cy.searchCostAccount(deleteIfCostAccountsAlreadyPresent.name);
    cy.deleteSearchedAccountIfMoreThanOne(deleteIfCostAccountsAlreadyPresent.name);
    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails);
    cy.configureAutoImport(sftpFileDetails);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.deleteAllRecordsInHistoryTabViaAPI();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate1.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate1.shareLevel);

    cy.clickAutoimportCostAccount();
    cy.enterSFTPDetails(sftpFileDetails1);
    cy.configureAutoImport(sftpFileDetails1);
    cy.saveConfiguration();
    cy.verifyImportSuccessToast();
    cy.clickAutoimportList();
    cy.clickAutoConfigurationimportList();
    cy.updateScheduleJob(sftpFileDetails1, ",");
    cy.clickHistoryimportList();
    cy.verifyStatusOfJobInHistoryTab();
    cy.deleteAllRecordsInHistoryTabViaAPI();
    cy.navigateToCostAccountTab();
    cy.searchCostAccount(newCostAccountToCreate2.name);
    cy.getShareLevelAtTextInGrid(newCostAccountToCreate2.shareLevel);
    cy.deleteCostAccount();
  });
});

