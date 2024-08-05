///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { sftpUserDetails } from '../../../fixtures/adminconsole/sfptcredentials.json';
import { Helpers } from 'ui-e2e/src/support/helpers';

describe('Test Suite :: ALM Cost Accounts - Schedule Import Flows', () => {
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

    it(`<@almCostAccounts>TC001 - Create a Scheduled Import Cost account job - Enterprise level on Daily Frequency and update to Div & Loc Level with Weekly Frequency`, function () {

        const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
        const sftpFileDetails = {
            sftpFileLocation: sftpData.sftpFileLocation,
            sftpServerURL: sftpData.sftpServerURL,
            sftpUserName: sftpData.sftpUserName,
            sftpPassword: sftpData.sftpPassword,
            emailIdForNotification: sftpData.emailIdForNotification,
            frequency: "Daily",
            accessLevelToCheckInGrid: "Enterprise",
            accessLevelToSelect: "Enterprise",
            frequencyToUpdate: "Weekly",
            accessLevelAfterUpdated1: "Division (1)",
            accessLevelAfterUpdated2: "Location (1)"
        };
        Helpers.log("Creating a job at Enterprise level with Daily Frequency");
        cy.clickOnScheduleImport();
        cy.deleteScheduleImportJobIfMoreThanOne();
        cy.clickOnAddConfigInALMScheduleImport();
        cy.createScheduleCostAccImportALMConfig(sftpFileDetails);
        cy.verifALMScheduleImportGridHeaders();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        Helpers.log("Updating a job from Enterprise to Division level with Weekly Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnDivisionRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation,
            sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelAfterUpdated1);

        Helpers.log("Updating a job from Division to Enterprise level with Daily Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnEnterpriseRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequency);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        Helpers.log("Updating a job from Enterprise to Location level with Daily Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnLocationRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequency);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation,
            sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelAfterUpdated2);

        Helpers.log("Updating a job from Location to Enterprise level with Daily Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnEnterpriseRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequency);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);
    });

    it(`<@almCostAccounts>TC002 - Create a Scheduled Import Cost account job - Division level on Daily Frequency and update to Loc and vice versa with Weekly Frequency`, function () {
        const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
        const sftpFileDetails = {
            sftpFileLocation: sftpData.sftpFileLocation,
            sftpServerURL: sftpData.sftpServerURL,
            sftpUserName: sftpData.sftpUserName,
            sftpPassword: sftpData.sftpPassword,
            emailIdForNotification: sftpData.emailIdForNotification,
            frequency: "Daily",
            accessLevelToCheckInGrid: "Division (1)",
            accessLevelToSelect: "Division",
            frequencyToUpdate: "Weekly",
            accessLevelAfterUpdated1: "Location (1)"
        };

        Helpers.log("Creating a job at Division level with Daily Frequency");
        cy.clickOnScheduleImport();
        cy.deleteScheduleImportJobIfMoreThanOne();
        cy.clickOnAddConfigInALMScheduleImport();
        cy.clickOnDivisionRadioButtonInCostAccountPopup();
        cy.createScheduleCostAccImportALMConfig(sftpFileDetails);
        cy.verifALMScheduleImportGridHeaders();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        Helpers.log("Updating a job from Division to Location level with Weekly Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnLocationRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation, sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelAfterUpdated1);

        Helpers.log("Updating a job from Location to Division level with Daily Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnDivisionRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequency);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

    });

    it(`<@almCostAccounts>TC003 - Create a Scheduled Import Cost account job - Location level on Daily Frequency and update to Div & Enterprise with Weekly Frequency`, function () {
        const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
        const sftpFileDetails = {
            sftpFileLocation: sftpData.sftpFileLocation,
            sftpServerURL: sftpData.sftpServerURL,
            sftpUserName: sftpData.sftpUserName,
            sftpPassword: sftpData.sftpPassword,
            emailIdForNotification: sftpData.emailIdForNotification,
            frequency: "Daily",
            accessLevelToCheckInGrid: "Location (1)",
            accessLevelToSelect: "Location",
            frequencyToUpdate: "Weekly",
            accessLevelAfterUpdated1: "Division (1)",
            accessLevelAfterUpdated2: "Enterprise"
        };
        Helpers.log("Creating a job at Location level with Daily Frequency");
        cy.clickOnScheduleImport();
        cy.deleteScheduleImportJobIfMoreThanOne();
        cy.clickOnAddConfigInALMScheduleImport();
        cy.clickOnLocationRadioButtonInCostAccountPopup();
        cy.createScheduleCostAccImportALMConfig(sftpFileDetails);
        cy.verifALMScheduleImportGridHeaders();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        Helpers.log("Updating a job from Location to Division level with Weekly Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnDivisionRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation,
            sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelAfterUpdated1);

        Helpers.log("Updating a job from Division to Enterprise level with Daily Frequency");
        cy.clickOnEditConfigInALMScheduleImport();
        cy.clickOnEnterpriseRadioButtonInCostAccountPopup();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequency);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation,
            sftpFileDetails.frequency, "", "", sftpFileDetails.accessLevelAfterUpdated2);

    });

    it(`<@almCostAccounts>TC004 - Create a Scheduled Import Cost account job - Enterprise level on Weekly Frequency and update to Daily Frequency`, function () {

        const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
        const sftpFileDetails = {
            sftpFileLocation: sftpData.sftpFileLocation,
            sftpServerURL: sftpData.sftpServerURL,
            sftpUserName: sftpData.sftpUserName,
            sftpPassword: sftpData.sftpPassword,
            emailIdForNotification: sftpData.emailIdForNotification,
            frequency: "Weekly",
            accessLevelToCheckInGrid: "Enterprise",
            accessLevelToSelect: "Enterprise",
            frequencyToUpdate: "Daily"
        };
        cy.clickOnScheduleImport();
        cy.deleteScheduleImportJobIfMoreThanOne();
        cy.clickOnAddConfigInALMScheduleImport();
        cy.createScheduleCostAccImportALMConfig(sftpFileDetails);
        cy.verifALMScheduleImportGridHeaders();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        cy.clickOnEditConfigInALMScheduleImport();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation, sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelToCheckInGrid);

    });

    it(`<@almCostAccounts>TC005 - Create a Scheduled Import Cost account job - Division level on Weekly Frequency and update to Daily Frequency`, function () {

        const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
        const sftpFileDetails = {
            sftpFileLocation: sftpData.sftpFileLocation,
            sftpServerURL: sftpData.sftpServerURL,
            sftpUserName: sftpData.sftpUserName,
            sftpPassword: sftpData.sftpPassword,
            emailIdForNotification: sftpData.emailIdForNotification,
            frequency: "Weekly",
            accessLevelToCheckInGrid: "Division (1)",
            accessLevelToSelect: "Division",
            frequencyToUpdate: "Daily"
        };
        cy.clickOnScheduleImport();
        cy.deleteScheduleImportJobIfMoreThanOne();
        cy.clickOnAddConfigInALMScheduleImport();
        cy.clickOnDivisionRadioButtonInCostAccountPopup();
        cy.createScheduleCostAccImportALMConfig(sftpFileDetails);
        cy.verifALMScheduleImportGridHeaders();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        cy.clickOnEditConfigInALMScheduleImport();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation, sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelToCheckInGrid);

    });

    it(`<@almCostAccounts>TC006 - Create a Scheduled Import Cost account job - Location level on Weekly Frequency and update to Daily Frequency`, function () {
        const sftpData = sftpUserDetails['sftpFile_CACommaSymbol'];
        const sftpFileDetails = {
            sftpFileLocation: sftpData.sftpFileLocation,
            sftpServerURL: sftpData.sftpServerURL,
            sftpUserName: sftpData.sftpUserName,
            sftpPassword: sftpData.sftpPassword,
            emailIdForNotification: sftpData.emailIdForNotification,
            frequency: "Weekly",
            accessLevelToCheckInGrid: "Location (1)",
            accessLevelToSelect: "Location",
            frequencyToUpdate: "Daily"
        };
        cy.clickOnScheduleImport();
        cy.deleteScheduleImportJobIfMoreThanOne();
        cy.clickOnAddConfigInALMScheduleImport();
        cy.clickOnLocationRadioButtonInCostAccountPopup();
        cy.createScheduleCostAccImportALMConfigWithEmailId(sftpFileDetails);
        cy.verifALMScheduleImportGridHeaders();
        cy.verifALMScheduleImportGridContentsUsingJSON(sftpFileDetails);

        cy.clickOnEditConfigInALMScheduleImport();
        cy.selectFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
        cy.clickOnContinueBtn();
        cy.clickOnSaveAndCloseBtn();
        cy.verifALMScheduleImportGridContents(sftpFileDetails.sftpFileLocation, sftpFileDetails.frequencyToUpdate, "", "", sftpFileDetails.accessLevelToCheckInGrid);

        cy.clickOnEditConfigInALMScheduleImport();
        cy.verifySelectedOptionInFrequencyDrpdwn(sftpFileDetails.frequencyToUpdate);
    });


});
