///<reference types="cypress" />
import { interceptsNotifications } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Notifications', () => {
    beforeEach(() => {
        if (Cypress.env('appEnv').includes('fed') === true) {
            cy.getUsers().then((users) => {
                const { username, password } = users.divisionAdminUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.divisionNotificationUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        cy.navigateToNotificationsPage();
        interceptsNotifications();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e>TC001 - Add, Search and Delete Custom Notification - Division`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `CheckpointDivCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Checkpoint',
            schedule: 'Send immediately',
            subject: 'Division- Automation Notification',
            accessLevel: 'division'
        };
        cy.callDeleteApi_Notification(notificationlDetails.condition);
        cy.verifyAccessLevelNotVisible("enterprise");
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteNotification();
        //cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e>TC002 - Add, Search and Delete Custom Notification - Location`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `RefusedLocCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Refused',
            schedule: 'Send immediately',
            subject: 'Location - Automation Notification',
            accessLevel: 'location'
        };
        cy.callDeleteApi_Notification(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteNotification();
        //cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e>TC003 - Add, Search and Delete Custom Notification - Site`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `DeliveredSiteCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Delivered',
            schedule: 'Send immediately',
            subject: 'Site - Automation Notification',
            accessLevel: 'site'
        };
        cy.selectSiteFilter();
        cy.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.selectSiteFilter();
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteNotification();
        //cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e>TC004 - Clone Custom Notification - Division`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `CheckpointDivCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Checkpoint',
            schedule: 'Send immediately',
            subject: 'Division- Automation Notification',
            accessLevel: 'division',
            visibilityLevel: 'Division'
        };
        const notificationlDetails_Clone = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Checkpoint',
            schedule: 'Send immediately',
            subject: 'Location- Automation Notification',
            accessLevel: 'location',
            visibilityLevel: 'Location'
        };
        cy.selectSiteFilter();
        cy.deleteNotificationIfDeleteIconPresents();
        cy.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.cloneNotification();
        cy.verifyNotificationVisibilityLevel(notificationlDetails.visibilityLevel);
        cy.verifyAlertModalInsideCloneNotification();
        cy.verifyAlertMessageInsideCloneNotificationAlert();
        cy.getFirstOptionTextInDropdown(notificationlDetails_Clone);
        cy.clickOnSaveButton();
        cy.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
    });

    it(`<@platform_e2e>TC005 - Receiving notification in All Types Filter - Division`, function () {
        cy.seletReceivingOptionInAllTypesFilter();
        cy.verifyAllNotificationTypeInGridSameOrNot('Receiving Notification');
    });

    it(`<@platform_e2e>TC006 - Locker notification in All Types Filter - Division`, function () {
        cy.seletLockerOptionInAllTypesFilter();
        cy.verifyAllNotificationTypeInGridSameOrNot('Locker Notification');
    });
});


