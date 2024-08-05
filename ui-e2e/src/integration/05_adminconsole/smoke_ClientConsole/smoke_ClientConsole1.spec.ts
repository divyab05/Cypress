///<reference types="cypress" />
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsDivisionLocationApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { Helpers } from '../../../support/helpers';
import {GmailCheckers} from "../../../support/gmail/gmailCheckers";

describe('Test Suite :: Smoke', () => {

    const gmailCheckers = new GmailCheckers();

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it('<@smoke><@prod_sanity> SMOKETC001 - Add new location', function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        if (Cypress.env('appEnv').includes('prod') === true) {
            const username = Cypress.env('clientAdminUserEmail');
            const password = Cypress.env('clientAdminUserPassword');
            adminConsoleHelpers.loginViaUrl(username, password);
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.clientAdminUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }

        cy.navigateToCostAccountPage();
        interceptsDivisionLocationApiCalls();
        cy.navigateToDivisionLocationOnSamePage();

        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueLocName = `AutoLoc${uuidGenerator()}`;
        const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
        const uniqueBPN = `${uuidGenerator()}`;
        const locationDetails = {
            locName: uniqueLocName,
            locAccountNumber: uniqueBPN,
            companyName: 'PBI',
            addressLine1: '44 Nostalgia Ave',
            email: uniqueLocName + '@mailinator.com',
            phone: '2034561234',
            state: 'California',
            city: 'Patterson',
            postalCode: '95363-8348'
        };
        cy.addNewDivision(uniqueDivName);
        cy.getDivisionId();
        cy.addNewLocation(locationDetails, uniqueDivName);
        cy.searchLocations(locationDetails);
        cy.verifyLocationAddedInGrid(locationDetails.locName);
        cy.deleteLocationDivision();
    });

    it(`<@smoke><@prod_sanity> SMOKETC002 - Add Cost Account, Search by Name or Code and delete`, function () {
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
        interceptsCostAccountApiCalls();
        cy.navigateToCostAccountPage();
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newCostAccount = {
            name: 'AutoCA' + uniqueNum,
            code: 'AutoCC' + uniqueNum,
            description: 'desc text',
            shareLevel: 'enterprise'
        };
        cy.addCostAccount(newCostAccount);
        cy.saveCostAccount();
        cy.searchCostAccount(newCostAccount.name);
        cy.deleteCostAccount();
    });

    it('<@smoke><@prod_sanity> SMOKETC003 - Enterprise Admin - Add new user with User access level and validate welcome email - Gmail', function () {
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
        interceptsUserManagementApiCalls();
        cy.navigateToUserManagementPage();
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `Auto${uuidGenerator()}`;
        const uniqueNumber = `${uuidGenerator()}`;
        const now = new Date().toISOString();
        const personalDetails = {
            firstName: uniqueName,
            lastName: 'User',
            displayName: uniqueName,
            email: `fedrampgcppdad+${uniqueNumber}@gmail.com`,
            password: 'Horizon#123'
        };
        cy.clickAddUser();
        cy.addPersonalDetails(personalDetails, 'user');
        cy.selectRole();
        cy.selectLocation();
        cy.clickSaveBtn();
        cy.callAccountClaimAPI(personalDetails);
        gmailCheckers.checkEmailAndValidate('clientsuccess@emails.pitneybowes.com',
        `${personalDetails.email}`,
        'Welcome to Shipping 360',
        now,//2024-06-21T11:51:42.935Z
        'See how easy it is to get started.');
        //cy.searchUser(personalDetails);
        cy.searchUserByName(personalDetails);
        cy.verifyUserDetailsInGrid('INVITED', 'User', personalDetails.email);
        const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd') || Cypress.env('appEnv').includes('prod');
        if (!flag) {
            cy.logoutUser();
            adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
            cy.verifyUserAccessValidation();
        }
        //cy.verifyDeleteUser();
        if (!flag)
            cy.logoutUser();
    });

    /*it(`<@smoke>SMOKETC004 - Add, Search and Delete Business Rules for UPS carrier - Enterprise`, function () {
        cy.getUsers().then((users) => {
            const { username, password } = users.enterpriseAdminUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        cy.navigateToBusinessRulesPage();
        interceptsBusinessRuleset();
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `UPSRule${uuidGenerator()}`;
        const businessRuleDetails = {
            name: uniqueName,
            type: 'Rate Shop Group',
            code: `${uuidGenerator()}`,
            description: `Description for UPSAutoRule${uuidGenerator()}`,
            checkBox: "Create Ship Request",
            service: "Service",
            carrier: "UPS",
            serviceLevel: "UPS 2nd Day Air®",
        };
        cy.addBusinessRuleSet(businessRuleDetails);
        cy.addServiceLevelRuleSet(businessRuleDetails);
        cy.verifyCreatedRulesetExist(businessRuleDetails);
        cy.deleteBusinessRule();
    });*/

    it(`<@smoke><@prod_sanity> SMOKETC005 - Verify Export Location is working fine or not in Division And Locations Page`, function () {
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
        cy.exportLocation();
        cy.verifyLocationExport();
    });

    it(`<@smoke><@prod_sanity> SMOKETC006 - Export users`, function () {
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
        interceptsUserManagementApiCalls();
        cy.navigateToUserManagementPage();
        cy.exportUser();
        cy.getJobIdForExportUser();
        cy.verifyUserExport();
    });

});

