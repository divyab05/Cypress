///<reference types="cypress" />
import { interceptsNotifications } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Notifications', () => {
    beforeEach(() => {

        if (Cypress.env('appEnv').includes('fed') === true) {
            cy.getUsers().then((users) => {
                const { username, password } = users.locationAdminUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        } else {
            cy.getUsers().then((users) => {
                const { username, password } = users.locationNotificationUser;
                adminConsoleHelpers.loginViaUrl(username, password);
            });
        }
        cy.navigateToNotificationsPage();
        interceptsNotifications();
    });

    it(`<@platform_e2e>TC001 - Add, Search and Delete Custom Notification - Location`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `RefusedLocNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Refused',
            schedule: 'Send immediately',
            subject: 'Location - Automation Notification',
            accessLevel: 'location'
        };
        cy.callDeleteApi_Notification(notificationlDetails.condition);
        cy.verifyAccessLevelNotVisible("enterprise");
        cy.verifyAccessLevelNotVisible("division");
        cy.addNotification(notificationlDetails);
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteNotification();
        //cy.callDeleteApi_Notification(notificationlDetails.condition);
    });

    it(`<@platform_e2e>TC002 - Add, Search and Delete Custom Notification - Site`, function () {
        const uniqueName = `ReturnedSiteNoti`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Returned to Mailroom',
            schedule: 'Send immediately',
            subject: 'Site - Automation Notification',
            accessLevel: 'site'
        };
        cy.selectSiteFilter();
        cy.deleteIfNotificationAlreadyExistOnSameCondition(uniqueName);
        cy.addNotification(notificationlDetails);
        cy.selectSiteFilter();
        cy.verifyCreatedNotificationExist(notificationlDetails);
        cy.callReceivingAPI();
        cy.deleteIfNotificationAlreadyExistOnSameCondition(uniqueName);
    });
});


