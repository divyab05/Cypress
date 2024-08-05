import {adminConsoleHelpers} from "../../../support/adminconsole/adminConsoleHelpers";
import {interceptsNotifications} from "../../../utils/admin_console/admin_intercept_routes";

describe('Test Suite :: InApp Notifications', () => {
  let username: string, password: string;
  before(() => {
    cy.getUsers().then((users) => {
      username = users.pitneyshipEnterpriseUser.username;
      password = users.pitneyshipEnterpriseUser.password;
    });
  });

  beforeEach(() => {
    adminConsoleHelpers.loginViaUrl(username, password);
    cy.navigateToNotificationsPage();
    cy.navigateToInAppNotificationsTab();
    interceptsNotifications();
    //Delete any existing in app notifications via API before tests starts
    cy.deleteAllInAppNotificationsViaAPI();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@platform_e2e>TC001 - Add and Edit InApp Notification at Enterprise level and verify it from division user and also delete the In app notification from Enteprise and verify from division user`, function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `InAppEntNoti${uuidGenerator()}`;

      const inAppNotificationDetails = {
        name: uniqueName,
        displayStyle: 'error',
        isDismissible: true,
        messageContent: 'In app Notification message set from enterprise user',
        status: 'Active'
      };
      cy.clickOnAddNotification();
      cy.addInAppNotification(inAppNotificationDetails);
      cy.verifyInAppNotificationOnHomePage(inAppNotificationDetails);
      cy.navigateToNotificationsPage();
      cy.navigateToInAppNotificationsTab();
      cy.verifyCreatedNotificationExist(inAppNotificationDetails);

      // Get the current date
      const currentDate = new Date();
      // Add 2 days to the current date
      const twoDaysAfter = new Date(currentDate);
      twoDaysAfter.setDate(currentDate.getDate() + 2);

      const editedInAppNotificationDetails = {
        name: 'edited' + uniqueName,
        startDate: currentDate,
        endDate: twoDaysAfter
      };
      //click on Edit and verify the editable and non-editable fields
      //if the notification is active(already started) then only name,end date and Audience can be updated
      cy.verifyEditNotificationWhenStarted(editedInAppNotificationDetails);
      //login with division level user to verify the notification
      adminConsoleHelpers.loginViaUrl('div1.user2@yopmail.com', 'Horizon#123');
      cy.verifyInAppNotificationOnHomePage(inAppNotificationDetails);
      //delete the in app notification from Enterprise and verify from division user that it is deleted
      adminConsoleHelpers.loginViaUrl(username, password);
      cy.navigateToNotificationsPage();
      cy.navigateToInAppNotificationsTab();
      cy.verifyCreatedNotificationExist(inAppNotificationDetails);
      cy.deleteNotification();
      //login with division level user to verify the notification is not there
      adminConsoleHelpers.loginViaUrl('div1.user2@yopmail.com', 'Horizon#123');
      cy.verifyCreatedNotificationNotExistsOnHomePage();
    });
  }

  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@platform_e2e>TC002 - Add future InApp Notification and make it inactive and verify it `, function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `InAppEntNoti${uuidGenerator()}`;
      // Get the current date
      const today = new Date();
      // Get tomorrow's date
      let tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      // Get the day after tomorrow's date
      let dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      const inAppNotificationDetails = {
        name: uniqueName,
        displayStyle: 'warning',
        isDismissible: false,
        messageContent: 'In app Notification future message set from enterprise user',
        status: 'Active',
        startDate: tomorrow,
        endDate: dayAfterTomorrow
      };
      cy.clickOnAddNotification();
      cy.addInAppNotification(inAppNotificationDetails);
      //notification banner will not appear as we set this for tomorrow
      cy.verifyCreatedNotificationNotExistsOnHomePage();
      cy.navigateToNotificationsPage();
      cy.navigateToInAppNotificationsTab();
      cy.verifyCreatedNotificationExist(inAppNotificationDetails);

      const editedInAppNotificationDetails = {
        name: 'edited' + uniqueName,
        displayStyle: 'info',
        isDismissible: true,
        messageContent: 'In app Notification future edited message set from enterprise user',
        status: 'Active',
        startDate: today,
        endDate: tomorrow
      };
      //click on Edit and verify the editable and non-editable fields
      //if the notification is not started then name,status, start date, end date, Audience, style and message content can be updated - need to make sure this is right expectation
      cy.verifyEditNotificationWhenNotStarted(editedInAppNotificationDetails);
      //login with location level user to verify the notification
      adminConsoleHelpers.loginViaUrl('div2.loc1@yopmail.com', 'Horizon#123');
      cy.verifyInAppNotificationOnHomePage(editedInAppNotificationDetails);
      //inactivate the inApp notification from Enterprise and verify from location level user that it is not appeared anymore
      adminConsoleHelpers.loginViaUrl(username, password);
      cy.navigateToNotificationsPage();
      cy.navigateToInAppNotificationsTab();
      cy.verifyCreatedNotificationExist(editedInAppNotificationDetails);
      cy.inactivateAndVerifyInAppNotification(editedInAppNotificationDetails);
      //login with location level user to verify the inactivated notification doesn't appear anymore
      //login with division level user to verify the notification
      adminConsoleHelpers.loginViaUrl('div2.loc1@yopmail.com', 'Horizon#123');
      cy.verifyCreatedNotificationNotExistsOnHomePage();
    });
  }

  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@platform_e2e>TC003 - Add InApp Notification to audience at Division level and verify it `, function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `InAppEntNoti${uuidGenerator()}`;
      const inAppNotificationDetails = {
        name: uniqueName,
        displayStyle: 'warning',
        isDismissible: false,
        messageContent: 'In app Notification future message set from enterprise user',
        status: 'Active',
        audience: {category: "Division", value: "Division2"}
      };
      cy.clickOnAddNotification();
      cy.addInAppNotification(inAppNotificationDetails);
      //we set this notification at Division2 level so enterprise user won't see this on homepage
      cy.verifyCreatedNotificationNotExistsOnHomePage();
      cy.navigateToNotificationsPage();
      cy.navigateToInAppNotificationsTab();
      cy.verifyCreatedNotificationExist(inAppNotificationDetails);
      //login with Division2 user to verify the notification
      adminConsoleHelpers.loginViaUrl('division2.user1@yopmail.com', 'Horizon#123');
      cy.verifyInAppNotificationOnHomePage(inAppNotificationDetails);
      cy.wait(2000);
      //login with Division2 Location1 user to verify the notification
      adminConsoleHelpers.loginViaUrl('div2.loc1@yopmail.com', 'Horizon#123');
      cy.verifyInAppNotificationOnHomePage(inAppNotificationDetails);
      cy.wait(2000);
      //login with division1 user to verify the notification doesn't exist
      adminConsoleHelpers.loginViaUrl('div1.user2@yopmail.com', 'Horizon#123');
      cy.wait(2000);
      cy.verifyCreatedNotificationNotExistsOnHomePage();
    });
  }

  if (Cypress.env('appEnv').includes('fed') === false) {
    it(`<@platform_e2e>TC004 - Dismiss the notification and verify it doesn't appear anymore for that user`, function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `InAppEntNoti${uuidGenerator()}`;

      const inAppNotificationDetails = {
        name: uniqueName,
        displayStyle: 'info',
        isDismissible: true,
        messageContent: 'In app Notification message set from enterprise user',
        status: 'Active'
      };
      cy.clickOnAddNotification();
      cy.addInAppNotification(inAppNotificationDetails);
      cy.verifyInAppNotificationOnHomePage(inAppNotificationDetails);
      cy.dismissTheNotification();
      cy.verifyCreatedNotificationNotExistsOnHomePage();
    });
  }
});
