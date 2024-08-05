///<reference types="cypress" />
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsCustomFields } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsNotifications } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsSubscrionRolesApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsDivisionLocationApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { Helpers } from '../../../support/helpers';
import { SSOUsersPage } from "../../../support/adminPortal/pages/ssoUsersPage";
import { LoginPage } from "../../../support/adminPortal/pages/loginPage";

describe('Test Suite :: Smoke', () => {

    const ssoUsersPage = new SSOUsersPage();
    const loginPage = new LoginPage();
    let sessiondID: string;
    let sessionID2: string;

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it('<@smoke><@prod_sanity> SMOKETC001 - Add new subscription role', function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.enterpriseAdminUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        cy.navigateToCostAccountPage();
        interceptsSubscrionRolesApiCalls();
        cy.navigateToRolesPage();
        cy.wait(1000);
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueRoleName = `AutoRole${uuidGenerator()}`;
        cy.addSubscriptionRole(uniqueRoleName);
        cy.searchSubscriptionRole(uniqueRoleName);
        cy.verifyRoleAddedInGrid(uniqueRoleName);
        cy.deleteSubscriptionRole();
    });

    it(`<@smoke><@prod_sanity> SMOKETC002 - Add, Search and Delete Custom Field Enterprise level`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.enterpriseAdminUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        cy.navigateToCustomFieldPage();
        interceptsCustomFields();
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCustomFields = {
            name: 'AutoEntCF' + uniqueNum,
            customType: 'Text',
        };
        cy.selectCustomFieldsRadioButton('Use Custom Fields');
        cy.addCustomFields(newCustomFields);
        cy.saveCreatedCustomField();
        cy.verifyCreatedCustomFieldExist(newCustomFields);
        cy.deleteCustomField();
    });

    it(`<@smoke><@prod_sanity> SMOKETC003 - Add, Search and Delete Custom Notification - Enterprise`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.noTrackingPlanUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        cy.navigateToNotificationsPage();
        interceptsNotifications();
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `DeliveredEntNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Delivered',
            schedule: 'Send immediately',
            subject: 'Enterprise-QA Automation Test for Notification',
            accessLevel: 'enterprise'
        };
        cy.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteNotification();
    });

    it(`<@smoke><@prod_sanity>SMOKETC004 - Verify Export history modal display the exported cost acocunts jobs history`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.noTrackingPlanUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        interceptsCostAccountApiCalls();
        cy.navigateToCostAccountPage();
        cy.exportCostAccount();
        cy.clickOnJobsStatusDrpdwn();
        cy.selectExportHistoryDrpdwn();
        cy.searchJobInsideExportHistory();
        cy.searchNameInsideExportHistory();
    });

    it(`<@smoke><@prod_sanity>SMOKETC005 -  Verify Import location works successfully in Division and Locations Page`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.clientAdminUser;
                if (Cypress.env('appEnv').includes('fed') === true)
                    adminConsoleHelpers.loginViaUrl(username, password);
                else {
                    adminConsoleHelpers.loginCC(username, password);
                }
            });
        }
        cy.navigateToDivLocPage();
        interceptsDivisionLocationApiCalls();
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueLocName = `ImpAutoLoc${uuidGenerator()}`;
        const uniqueDivName = `ImpAutoDiv${uuidGenerator()}`;
        const uniqueBPN = `${uuidGenerator()}`;
        const locationDetails = {
            locName: uniqueLocName,
            locAccountNumber: uniqueBPN,
            companyName: 'PBI',
            addressLine1: '1100 1st Ave',
            email: uniqueLocName + '@mailinator.com',
            phone: '2034561234',
            state: 'Washington',
            city: 'Seattle',
            postalCode: '98101-2906'
        };
        cy.addNewDivision(uniqueDivName);
        cy.getDivisionId();
        cy.createDataForImportFile('src/fixtures/adminconsole/testData/locations/location-import.csv', locationDetails);
        cy.importLocation('adminconsole/testData/locations/location-import.csv');
        cy.navigateToCostAccountOnSamePage();
        cy.navigateToDivisionLocationOnSamePage();
        cy.searchLocations(locationDetails);
        cy.deleteLocationDivision();
    });

    it(`<@smoke><@prod_sanity>SMOKETC006 - Verify Import Hierachy Cost Accounts works successfully in cost account page`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.noTrackingPlanUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        interceptsCostAccountApiCalls();
        cy.navigateToCostAccountPage();
        cy.deleteSearchedAccountIfMoreThanOne('ImpAutoParentCA');
        cy.importCostAccount('adminconsole/testData/costaccount/Import_CostAccount_Hierarchy.csv', "enterprise", "");
        cy.searchCostAccount('ImpAutoSubSubAccCA');
        cy.verifySearchedCostAccountPresent('ImpAutoParentCA', 'ImpAutoSubAccCA', 'ImpAutoSubSubAccCA')
        cy.deleteCostAccount();
    });

    it(`<@smoke><@prod_sanity>SMOKETC007 - Verify Add SSO User Mapping and Login, Search and Delete`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            cy.getUsers().then((users) => {
                const uuidGenerator = () => Cypress._.random(0, 1e5);
                const { username, password } = users.ssoClientUser01;
                // @ts-ignore
                const { username2, password2 } = users.ssoClientUser02;
                sessiondID = `${uuidGenerator()}`;
                sessionID2 = `${uuidGenerator()}`;
                loginPage.ssoClientUserLoginProd(username, password, sessiondID);
                ssoUsersPage.searchAndDeleteClientUser(username2);
                ssoUsersPage.addSSOUserMapping(username2, 'enterprise', 'Test_Dash', 'Sohail Fremont Address', '0130 account');
                ssoUsersPage.switchToSSOUsersMappingsTab();
                ssoUsersPage.verifySSOUsersMappingsGrid(username2, 'TEST_DASH', 'Sohail Fremont Address', 'Enterprise');
                loginPage.ssoClientUserLoginProd(username2, password2, sessiondID);
                loginPage.ssoClientUserLoginProd(username, password, sessionID2);
                ssoUsersPage.verifyUserDetailsInUsersTab_clientConsole(username2, 'Test_Dash', 'Sohail Fremont Address', 'Enterprise', '0130 account');
                ssoUsersPage.deleteUser();
            });
        }
    });



});

