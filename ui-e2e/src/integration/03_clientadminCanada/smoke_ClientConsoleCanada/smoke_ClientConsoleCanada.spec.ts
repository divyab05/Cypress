///<reference types="cypress" />
import { interceptsBusinessRuleset } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsDivisionLocationApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsSubscrionRolesApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsCustomFields } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsNotifications } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';

describe('Canada Test Suite :: Smoke', () => {

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it('<@promote_qa><@smoke>  Canada_SMOKETC001 - Add new location', function () {
        cy.getUsers().then((users) => {
            const { username, password } = users.canadaUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        cy.navigateToCostAccountPage();
        interceptsDivisionLocationApiCalls();
        cy.navigateToDivisionLocationOnSamePage();

        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueLocName = `AutoLoc${uuidGenerator()}`;
        const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
        const locationDetails = {
            locName: uniqueLocName,
            locAccountNumber: '0010516769',
            companyName: 'PBI',
            addressLine1: '5500 Explorer Dr',
            email: uniqueLocName + '@mailinator.com',
            phone: '2034561234',
            state: 'Ontario',
            city: 'Patterson',
            postalCode: 'L4W5C7'
        };
        cy.addNewDivision(uniqueDivName);
        cy.setDivisionId();
        cy.addNewLocation(locationDetails, uniqueDivName);
        cy.searchLocations(locationDetails);
        cy.verifyLocationAddedInGrid(locationDetails.locName);
        cy.deleteLocationDivision();
    });

    it(`<@smoke> <@promote_qa> Canada_SMOKETC002 - Add Cost Account, Search by Name or Code and delete`, function () {
        cy.getUsers().then((users) => {
            const { username, password } = users.canadaUser;
            adminConsoleHelpers.loginCC(username, password);
            
        });
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
        cy.deleteCostAccountViaAPI();
    });

    it.skip('<@smoke>SMOKETC003- Add new subscription role', function () {
        if (Cypress.env('appEnv').includes('fed') === true) {
            cy.getUsers().then((users) => {
                const { username, password } = users.canadaUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.canadaUser;
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

    it.skip(`<@smoke>SMOKETC004 - Add, Search and Delete Business Rules for UPS carrier - Enterprise`, function () {
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
    });

    it.skip(`<@smoke>SMOKETC005 - Add, Search and Delete Custom Field Enterprise level`, function () {
        cy.getUsers().then((users) => {
            const { username, password } = users.enterpriseAdminUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
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

    it.skip(`<@smoke>SMOKETC006 - Add, Search and Delete Custom Notification - Enterprise`, function () {
        cy.getUsers().then((users) => {
            const { username, password } = users.noTrackingPlanUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
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

    it.skip('<@smoke>SMOKETC007 - Enterprise Admin - Add new user with User access level', function () {
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
        cy.verifyDeleteUser();
        if (!flag)
            cy.logoutUser();
    });

});

