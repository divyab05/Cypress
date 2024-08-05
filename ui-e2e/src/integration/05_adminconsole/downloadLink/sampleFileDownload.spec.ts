///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsDivisionLocationApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';

describe('Test Suite :: Sample File Download', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.noTrackingPlanUser;
            if (Cypress.env('appEnv').includes('fed') === true)
                adminConsoleHelpers.loginViaUrl(username, password);
            else {
                adminConsoleHelpers.loginCC(username, password);
            }
        });

    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e><@platform_ppd>TC001 - Download the Sample file in Cost Account Page and Download the Processed and ProcessedError Files inside Job Status modal`, function () {
        interceptsCostAccountApiCalls();
        cy.navigateToCostAccountPage();
        cy.downloadSampleFile_CostAcc();
        cy.downloadFileInsideJobStatusInCostAcc("Status", "ProcessingError");
        //cy.downloadFileInsideJobStatusInCostAcc("Status", "Processed");
    });

    it(`<@platform_e2e><@platform_ppd>TC002 - Download the Sample file in Division and Locations Page`, function () {
        cy.navigateToDivLocPage();
        interceptsDivisionLocationApiCalls();
        cy.downloadSampleFile_DivLoc();
    });

    it(`<@platform_e2e><@platform_ppd>TC003 - Download the Sample file in Users Page and Download the Processed and ProcessedError Files inside Job Status modal`, function () {
        interceptsUserManagementApiCalls();
        cy.navigateToCostAccountPage();
        cy.navigateToUserManagementOnSamePage();
        cy.downloadSampleFile_User();
        cy.downloadFileInsideJobStatusInUser("Processed");
    });

});
