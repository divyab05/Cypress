///<reference types="cypress" />
import { interceptsNotifications } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Notifications', () => {
    beforeEach(() => {
        cy.getUsers().then((users) => {
            const { username, password } = users.noTrackingPlanUser;
            adminConsoleHelpers.loginViaUrl(username, password);
        });
        cy.navigateToNotificationsPage();
        interceptsNotifications();
    });

    afterEach(() => {
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@platform_e2e><@platform_ppd>TC001 - Add, Search and Delete Custom Notification - Enterprise`, function () {
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
        cy.callDeleteApi_Notification(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteNotification();
        //cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e><@platform_ppd>TC002 - Add, Search and Delete Custom Notification - Division`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `DeliveredDivNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Delivered',
            schedule: 'Send immediately',
            subject: 'Division - QA Automation Test for Notification',
            accessLevel: 'division'
        };
        cy.callDeleteApi_Notification(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();

        cy.deleteNotification();
        // cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e><@promote_qa> <@platform_ppd>TC003 - Add, Search and Delete Custom Notification - Location`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `DeliveredLocNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Delivered',
            schedule: 'Send immediately',
            subject: 'Location - QA Automation Test for Notification',
            accessLevel: 'location'
        };
        cy.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        //cy.callReceivingAPI();
        cy.deleteNotification();
        // cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e><@promote_qa><@platform_ppd>TC004 - Active/Inactive Custom Notification`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `InactiveNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Delivered',
            schedule: 'Send immediately',
            subject: 'Inactive notification',
            accessLevel: 'enterprise'
        };
        cy.deleteIfNotificationAlreadyExistOnSameCondition('InactiveNoti');
        cy.checkOrUncheckInactiveNotificationCheckbox();
        cy.deleteIfNotificationAlreadyExistOnSameCondition('InactiveNoti');
        cy.checkOrUncheckInactiveNotificationCheckbox();
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.inactiveNotification(notificationlDetails);
        //cy.callReceivingAPI();
        cy.deleteNotification();
    });

    it(`<@platform_e2e><@platform_ppd>TC005 - Edit default Notification`, function () {
        const notificationlDetails = {
            name: "Attempted Delivery",
            type: 'Receiving Notification',
            condition: 'Attempted Delivery',
            schedule: 'Send immediately',
            subject: 'Edit default notification',
            accessLevel: 'enterprise'
        };
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.editDefaultNotification(notificationlDetails);
        cy.callReceivingAPI();
    });
});

