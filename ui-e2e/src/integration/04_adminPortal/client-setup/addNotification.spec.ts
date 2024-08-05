///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsNotification } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';

describe('Test Suite :: Admin User - Notification', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();
    const enterprise = 'Notification Automation Enterprise';
    const doorKeeper = new DoorKeeperOnboarding();

    let notificationName;

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsSelectEnterprise();
        interceptsNotification();
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageNotificationsAndTemplates();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        //adminCommands.callDeleteApi_Notification(enterprise, notificationName);
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC001 - Add, Search and Delete Notification - Enterprise`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `EntCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Checkpoint',
            schedule: 'Send immediately',
            subject: 'QA Automation Test for Notification',
            accessLevel: 'enterprise',
            text: 'The current location of your package is'
        };
        notificationName = uniqueName;
        adminCommands.selectLocationFilter();
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('EntCustNoti');
        adminCommands.addNotification(notificationlDetails);
        adminCommands.verifyCreatedNotificationExist(notificationlDetails);
        adminCommands.clickOnDeleteIconInNotificationSearchResults();
        //adminCommands.callDeleteApi_Notification(enterprise,notificationlDetails.name);
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC002 - Add, Search and Delete Custom Notification - Division`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `DivCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Delivered',
            schedule: 'Send immediately',
            subject: 'Division - QA Automation Test for Notification',
            accessLevel: 'division',
            text: 'We have delivered your package.'
        };
        adminCommands.selectLocationFilter();
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('DivCustNoti');
        adminCommands.addNotification(notificationlDetails);
        adminCommands.verifyCreatedNotificationExist(notificationlDetails);
        adminCommands.clickOnDeleteIconInNotificationSearchResults();
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC003 - Add, Search and Delete Custom Notification - Location`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `LocCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Reclaimed from Locker',
            schedule: 'Send immediately',
            subject: 'Location - QA Automation Test for Notification',
            accessLevel: 'location',
            text: 'Your package has been removed from the locker. Please go to the mailroom to retrieve your package.'
        };
        adminCommands.selectLocationFilter();
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('LocCustNoti');
        adminCommands.addNotification(notificationlDetails);
        adminCommands.selectLocationFilter();
        adminCommands.verifyCreatedNotificationExist(notificationlDetails);
        adminCommands.clickOnDeleteIconInNotificationSearchResults();
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC004 - Active/Inactive Custom Notification`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `InactiveNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Pickup',
            schedule: 'Send immediately',
            subject: 'Inactive notification',
            accessLevel: 'enterprise',
            text: 'You have picked up a package'
        };

        adminCommands.selectLocationFilter();
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('InactiveNoti');
        adminCommands.checkOrUncheckInactiveNotificationCheckbox();
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('InactiveNoti');
        adminCommands.checkOrUncheckInactiveNotificationCheckbox();
        adminCommands.addNotification(notificationlDetails);
        adminCommands.verifyCreatedNotificationExist(notificationlDetails);
        adminCommands.inactiveNotification(notificationlDetails);
        adminCommands.clickOnDeleteIconInNotificationSearchResults();
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC005 - Edit default Notification`, function () {
        const notificationlDetails = {
            name: "Attempted Delivery",
            type: 'Receiving Notification',
            condition: 'Attempted Delivery',
            schedule: 'Send immediately',
            subject: 'Edit default notification',
            accessLevel: 'enterprise',
            text: 'We tried to deliver your package today. We still have it and will try to deliver it again.'
        };
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        adminCommands.verifyCreatedNotificationExist(notificationlDetails, true);
        adminCommands.editDefaultNotification(notificationlDetails);
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC006 - Active/Inactive system Notification When notification isolation = OFF`, function () {
        const notificationlDetails = {
            name: "Attempted Delivery",
            type: 'Receiving Notification',
            condition: 'Attempted Delivery',
            schedule: 'Send immediately',
            subject: 'Edit default notification',
            accessLevel: 'enterprise',
            text: 'We tried to deliver your package today. We still have it and will try to deliver it again.'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab('Business Rule Automation');
        adminCommands.navigateToManageNotificationsAndTemplates();
        adminCommands.verifyCreatedNotificationExist(notificationlDetails, true);
        adminCommands.inactiveNotification(notificationlDetails);
        adminCommands.activeNotification();
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC007 - Turn off the notification in subscription page and create,search and delete notification - Enterprise`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `EntCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Checkpoint',
            schedule: 'Send immediately',
            subject: 'QA Automation Test for Notification',
            accessLevel: 'enterprise',
            text: 'The current location of your package is'
        };
        notificationName = uniqueName;
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab('Business Rule Automation');
        adminCommands.clickOnManageSubscriptions();
        adminCommands.selectNotificationIsolationRadioBtnInSubscriptionsPage(false);
        adminCommands.clickOnSaveButtonInSubscription();

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab('Business Rule Automation');
        adminCommands.navigateToManageNotificationsAndTemplates();
        adminCommands.verifyFilterNotExistInNotificationPage(false);
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('EntCustNoti');
        adminCommands.addNotification(notificationlDetails);
        adminCommands.verifyCreatedNotificationExist(notificationlDetails);
        adminCommands.clickOnEditNotificationIcon();
        adminCommands.verifyVisibilitySectionNotExistInNotificationPage(false);
        adminCommands.clickOnDeleteIconInNotificationSearchResults();
        //adminCommands.callDeleteApi_Notification(enterprise,notificationlDetails.name);
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC008 - Turn On the notification in subscription page and create,search and delete notification - Enterprise`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueName = `MultipleReceiveSameRecipientEntCustNoti${uuidGenerator()}`;
        const notificationlDetails = {
            name: uniqueName,
            type: 'Receiving Notification',
            condition: 'Multiple Receive Same Recipient',
            schedule: 'Send immediately',
            subject: 'QA Automation Test for Notification',
            accessLevel: 'enterprise',
            text: 'Your packages will be handled the same way your business usually handles packages'
        };
        notificationName = uniqueName;
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise);
        adminCommands.clickOnManageSubscriptions();
        adminCommands.selectNotificationIsolationRadioBtnInSubscriptionsPage(true);
        adminCommands.clickOnSaveButtonInSubscription();

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise);
        adminCommands.navigateToManageNotificationsAndTemplates();
        adminCommands.selectLocationFilter();
        adminCommands.deleteIfNotificationAlreadyExistOnSameCondition(notificationlDetails.condition);
        adminCommands.verifyFilterNotExistInNotificationPage(true);
        adminCommands.addNotification(notificationlDetails);
        adminCommands.verifyCreatedNotificationExist(notificationlDetails);
        adminCommands.clickOnEditNotificationIcon();
        adminCommands.verifyVisibilitySectionNotExistInNotificationPage(true);
        adminCommands.clickOnDeleteIconInNotificationSearchResults();
    });

});
