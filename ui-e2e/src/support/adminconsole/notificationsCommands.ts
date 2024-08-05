import { formControls } from '../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../helpers';
import { ClientTmp } from '../../support/adminconsole/clientConsoleTmp'

const helpers = new Helpers();

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
    namespace Cypress {
        //create .d.ts definitions file to get autocomplete.
        interface Chainable<Subject> {
            navigateToNotificationsPage(): void;
            addNotification(notificationlDetails): void;
            verifyCreatedNotificationExist(notificationlDetails): void;
            callReceivingAPI(): void;
            deleteNotification(): void;
            selectNotificationVisibilityLevel(notificationlDetails): void;
            inactiveNotification(notificationlDetails): void;
            verifyAccessLevelNotVisible(accessLevel): void;
            selectSiteFilter(): void;
            editDefaultNotification(notificationlDetails): void;
            cloneNotification(): void;
            verifyNotificationVisibilityLevel(visibilityLevelToVerify: any): void;
            verifyAlertModalInsideCloneNotification(): void;
            verifyAlertMessageInsideCloneNotificationAlert(): void;
            deleteIfNotificationAlreadyExistOnSameCondition(conditionName: any): void;
            getFirstOptionTextInDropdown(notificationlDetails): void;
            clickOnSaveButton(): void;
            seletReceivingOptionInAllTypesFilter(): void;
            seletLockerOptionInAllTypesFilter(): void;
            verifyAllNotificationTypeInGridSameOrNot(notificationType: any): void;
            callDeleteApi_Notification(notificationName: string): void;
            getNotificationId(notificationName: string): any;
            switchToNotificationPrefTab(): void;
            deleteNotificationIfDeleteIconPresents(): void;
            checkOrUncheckInactiveNotificationCheckbox(): void;
            navigateToInAppNotificationsTab(): void;
            addInAppNotification(inAppNotificationDetails): void;
            verifyInAppNotificationOnHomePage(inAppNotificationDetails): void;
            verifyEditNotificationWhenStarted(editedInAppNotificationDetails): void;
            deleteAllInAppNotificationsViaAPI(): void;
            verifyCreatedNotificationNotExistsOnHomePage(): void;
            clickOnAddNotification(): void;
            verifyEditNotificationWhenNotStarted(editedInAppNotificationDetails): void;
            clickOnEditNotification(): void;
            inactivateAndVerifyInAppNotification(editedInAppNotificationDetails): void;
            dismissTheNotification(): void;
        }
    }
}

export let notificationId = null;

Cypress.Commands.add('navigateToNotificationsPage', () => {
    cy.waitForSpinners();
    cy.waitForSpinnerIcon();
    cy.wait(2000);
    cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
    //cy.wait(1000);
    cy.get(formControls.notificationsMenu, { timeout: 90000 })
        .click({ force: true })
        .get(formControls.addNotificationsBtn, { timeout: 90000 });
    cy.wait(2000);
});

Cypress.Commands.add('addNotification', (notificationlDetails: any) => {
    cy.get(formControls.addNotificationsBtn, { timeout: 90000 }).click();
    cy.get(formControls.nameField).type(notificationlDetails.name);
    cy.get(formControls.typeInAddNotification)
        .click()
        .type(notificationlDetails.type)
        .get(formControls.AddRuledropdownTextList)
        .contains(notificationlDetails.type)
        .click();
    //cy.get(formControls.emailCheckBoxInAddNotification).click({ force: true });
    cy.get(formControls.conditionInAddNotification)
        .click()
        .type(notificationlDetails.condition)
        .get(formControls.AddRuledropdownTextList)
        .contains(notificationlDetails.condition)
        .click();
    cy.get(formControls.scheduleInAddNotification)
        .click()
        .type(notificationlDetails.schedule)
        .get(formControls.AddRuledropdownTextList)
        .contains(notificationlDetails.schedule)
        .click();
    cy.selectNotificationVisibilityLevel(notificationlDetails);
    cy.get("#load-sample-message").click({ force: true });
    cy.wait(2000);
    cy.get(formControls.subjectInAddNotification).type(notificationlDetails.subject).blur();
    // cy.get("div[class='angular-editor-wrapper'] .angular-editor-textarea")
    // .should('include.text', 'We have delivered your package.');
    cy.get(formControls.saveAndCloseButton).click().wait('@addNotification').its('response.statusCode').should('eq', 201);
    cy.wait('@getNotifications', { timeout: 90000 }).its('response.statusCode').should('eq', 200);
    cy.wait(2000);
});

Cypress.Commands.add('verifyCreatedNotificationExist', (notificationlDetails: any) => {
    cy.get(formControls.searchNotifications).clear().type(notificationlDetails.name).wait(2000);
    cy.get(formControls.tableGridRow)
    .should('have.length', 1)
    cy.get(formControls.tableGridRow)
        .should('include.text', notificationlDetails.name).wait(1000);
});

Cypress.Commands.add('selectNotificationVisibilityLevel', (notificationlDetails: any) => {
    if (notificationlDetails.accessLevel.includes('enterprise') === false) {
        cy.get('#' + notificationlDetails.accessLevel + '-button').click();
        cy.get('ng-select[formcontrolname=' + notificationlDetails.accessLevel + 'ID] input[aria-autocomplete="list"]').last().click();
        cy.get(formControls.selectDivloclist).first().click({ multiple: true, force: true });
    }
});

Cypress.Commands.add('inactiveNotification', (notificationlDetails: any) => {
    cy.get(formControls.editNotification).click().wait(2000)
        .get(formControls.inactiveId).click()
        .get(formControls.saveAndCloseButton).click().wait('@inactiveNotifications').its('response.statusCode').should('eq', 200)
        .get(formControls.showInactiveNotifications, { timeout: 40000 }).click();
    //cy.get(formControls.searchNotifications).type(notificationlDetails.name).wait(2000);
    cy.get(formControls.tableGridRow)
        .should('include.text', notificationlDetails.name).should('include.text', 'Inactive').wait(1000);
});

Cypress.Commands.add('callReceivingAPI', function () {
    cy.get('@XSRFToken').then((token) => {
        cy.request({
            method: "GET",
            url: '/api/receiving-new/v1/assets/newtracking?type=',
            failOnStatusCode: true,
            retryOnNetworkFailure: true,
            headers: token
        }).then((response) => {
            expect(response.status).to.eq(200);
            const trackNumber = response.body.trackingNumber;
            Helpers.log(trackNumber);
            cy.request({
                method: "POST",
                url: 'api/receiving-new/v1/assets',
                failOnStatusCode: true,
                retryOnNetworkFailure: true,
                headers: token,
                body: { "asset": { "trackingNumber": trackNumber, "assetType": "PACKAGE", "archived": false, "damaged": false, "timezone": -330, "customFields": [], "receiver": { "contactID": "632da6e99d6011d0bb4bdd7c", "name": "Nikunja Kale", "addressLine1": "33 Eastbrook Rd", "city": "Ronks", "state": "PA", "postalCode": "17572-9769", "countryCode": "US", "email": "nikunja.kale@pb.com", "phone": "8778785448", "isDepartment": false, "accessibility": false, "notificationAll": true, "personalID": "546456434" }, "accountRef": { "moreAccounting": false }, "currentLocation": { "id": "mv6WEmp6pq1", "name": "site1", "type": "site", "ancestorList": [], "locationHierarchy": "site1", "toptier": { "name": "site1", "id": "mv6WEmp6pq1" } } }, "activity": { "status": "DELIVERED", "location": { "id": "mv6WEmp6pq1", "name": "site1", "type": "site", "ancestorList": [], "locationHierarchy": "site1", "toptier": { "name": "site1", "id": "mv6WEmp6pq1" } } }, "images": [] }
            }).then(async (response) => {
                expect(response.status).to.eq(201);
            });
        });
    });
});

Cypress.Commands.add('deleteNotification', () => {
    cy.get(formControls.deleteNotification).should('be.visible').click()
        .get(formControls.deleteConfirm).click().wait('@deleteNotification').its('response.statusCode').should('eq', 200);
    cy.wait(1000);
});

Cypress.Commands.add('verifyAccessLevelNotVisible', (accessLevel: any) => {
    cy.get(formControls.addNotificationsBtn, { timeout: 90000 }).click();
    cy.get('#' + accessLevel + '-button').should('not.exist');
    cy.get(formControls.closePopup).should('be.visible').click();
});

Cypress.Commands.add('selectSiteFilter', () => {
    cy.get(formControls.siteFilter).should('be.visible').click()
        .get(formControls.selectDivloclist).first().click({ multiple: true, force: true });
    cy.wait(1000);
});

Cypress.Commands.add('editDefaultNotification', (notificationlDetails: any) => {
    cy.get(formControls.notificationCopyLink).should('be.visible').click({ force: true })
        //.wait('@EditSystemNotifications')
        .get(formControls.typeInAddNotification).should('be.disabled')
        .get(formControls.conditionInAddNotification).should('be.disabled')
        .get(formControls.subjectInAddNotification).clear().type(notificationlDetails.subject).blur()
        .get(formControls.saveAndCloseButton).click().wait('@addNotification').its('response.statusCode').should('eq', 201)
        .get(formControls.notificationCloneLink).should('be.visible');
    cy.deleteNotification();
    cy.get(formControls.notificationCloneLink).should('not.exist')
        .get(formControls.deleteNotification).should('not.exist')
});

Cypress.Commands.add('cloneNotification', () => {
    cy.get(formControls.notificationCloneLink).should('be.visible').click()
        .get(formControls.nameField, { timeout: 1000 });
});

Cypress.Commands.add('verifyNotificationVisibilityLevel', (visibilityLevelToVerify: any) => {
    cy.get(formControls.selectedVisiblityOption).should('have.length', 1).and('include.text', visibilityLevelToVerify);
});

Cypress.Commands.add('verifyAlertModalInsideCloneNotification', () => {
    cy.get(formControls.saveAndCloseButton).click()
        .get(formControls.closeButtonInCloneNotificationAlert).should('be.visible');
});

Cypress.Commands.add('verifyAlertMessageInsideCloneNotificationAlert', () => {
    cy.get(formControls.alertMessageInCloneNotificationAlert).should('be.visible');
    cy.get(formControls.alertMessageInCloneNotificationAlert).should('have.text',
        'This Notification Condition is already customized for the selected Visibility criteria. Please make changes under the customized notification only.');
    cy.get(formControls.closeButtonInCloneNotificationAlert).click();
    cy.wait(1000);
});

Cypress.Commands.add('deleteIfNotificationAlreadyExistOnSameCondition', (conditionName: any) => {
    cy.get(formControls.searchNotifications).clear().type(conditionName).wait(2000);
    cy.get('body')
        .then($body => {
            if (($body.find(formControls.tableGridRow).length > 0)) {
                if (($body.find(formControls.deleteNotification).length > 0)) {
                    cy.get(formControls.deleteNotification).should('be.visible').click()
                        .get(formControls.deleteConfirm).click();
                    cy.wait(5000);
                }
            } else {
                Helpers.log("No Search results found");
            }
        })
    cy.get(formControls.searchNotifications).clear();
    cy.wait(1000);
});

Cypress.Commands.add('getFirstOptionTextInDropdown', (notificationlDetails: any) => {
    if (notificationlDetails.accessLevel.includes('enterprise') === false) {
        cy.get('#' + notificationlDetails.accessLevel + '-button').click();
        cy.get('ng-select[formcontrolname=' + notificationlDetails.accessLevel + 'ID] input[aria-autocomplete="list"]').last().click();
        cy.get(formControls.firstOptionTextInDropdown).then(elem => {
            ClientTmp.dropdownValueInNotification = Cypress.$(elem).text;
        })
            .click({ force: true });
    }
});

Cypress.Commands.add('clickOnSaveButton', () => {
    cy.get(formControls.saveAndCloseButton).click().wait('@addNotification');
});

Cypress.Commands.add('seletReceivingOptionInAllTypesFilter', () => {
    cy.get(formControls.allTypeContactFilterCheck).click()
        .xpath(formControls.receivingNotificationInFilter).click();
});

Cypress.Commands.add('seletLockerOptionInAllTypesFilter', () => {
    cy.get(formControls.allTypeContactFilterCheck).click()
        .xpath(formControls.lockerNotificationInFilter).click();
});

Cypress.Commands.add('verifyAllNotificationTypeInGridSameOrNot', (notificationType: any) => {
    cy.get(formControls.notificationTypeInGrid)
        .each((el, index, $lis) => {
            let actualNotificationTypeText = Cypress.$(el).text().trim();
            expect(actualNotificationTypeText).to.be.eq(notificationType);
        })
});

Cypress.Commands.add('callDeleteApi_Notification', (notificationName: string) => {
    cy.getNotificationId(notificationName).then((_) => {
        Helpers.log(`*******************NotificationId is==>${notificationId}`);
        cy.request({
            method: 'DELETE',
            url: 'api/notificationsvc/v1/customNotificationConfigurations/' + notificationId,
            failOnStatusCode: false
        });
    });
});

Cypress.Commands.add('getNotificationId', (notificationName: string) => {
    cy.request('GET', 'api/notificationsvc/v2/manageCustomNotificationConfigurations?skip=0&limit=50&status=ACTIVE').then(async (response) => {
        let count1 = response.body.NotificationConfigs.length;
        Helpers.log(count1)
        if (count1 > 0) {
            for (let i = 0; i < count1; i++) {
                expect(response.status).to.eq(200);
                let name = response.body.NotificationConfigs[i].name;
                let resp = response.body.NotificationConfigs[i];
                if (name.includes(notificationName) && resp.hasOwnProperty('isEditable')) {
                    notificationId = response.body.NotificationConfigs[i].customNotificationConfigId;
                    Helpers.log(`*******************notificationId is==>${notificationId}`)
                }
            }
        }
    });

});

Cypress.Commands.add('switchToNotificationPrefTab', () => {
    cy.xpath(formControls.notificationPrefTab).click();
    cy.xpath(formControls.notificationTab).click();
});

Cypress.Commands.add('deleteNotificationIfDeleteIconPresents', () => {
    cy.get('body')
        .then($body => {
            if (($body.find(formControls.deleteNotification).length > 0)) {
                cy.get(formControls.deleteNotification).should('be.visible').click()
                    .get(formControls.deleteConfirm).click();
                cy.wait(5000);
            } else {
                Helpers.log("No Delete Icon found");
            }
        })
    cy.wait(1000);
});

Cypress.Commands.add('checkOrUncheckInactiveNotificationCheckbox', () => {
    cy.get(formControls.showInactiveNotifications, { timeout: 40000 }).click();
});

Cypress.Commands.add('navigateToInAppNotificationsTab', () => {
  helpers.click(formControls.inAppTab);
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
});

Cypress.Commands.add('clickOnAddNotification', () => {
  //click on InApp notifications add button
  helpers.click(formControls.addNotificationsBtn);
});
Cypress.Commands.add('addInAppNotification', (inAppNotificationDetails: any) => {
  helpers.type(formControls.nameField, inAppNotificationDetails.name);
  // Check if 'start date' field exists in inAppNotificationDetails
  if ('startDate' in inAppNotificationDetails) {
    selectDateFromCalendar(inAppNotificationDetails.startDate, 'Start Date');
  }
  if ('endDate' in inAppNotificationDetails) {
    selectDateFromCalendar(inAppNotificationDetails.endDate, 'End Date');
  }
  if (inAppNotificationDetails.status === 'Active') helpers.click(formControls.inAppActiveStatus);
  else helpers.click(formControls.inAppInActiveStatus);

  if('audience' in inAppNotificationDetails) {
    // Click the element containing category
    cy.contains(formControls.audienceCategory, inAppNotificationDetails.audience.category).click();
    cy.contains(formControls.audienceCategory, inAppNotificationDetails.audience.category)
      .parents('.card').first()
      .find(formControls.audienceDropdown) // find the audience category dropdown
      .type(inAppNotificationDetails.audience.value+'{enter}') // select the value form dropdown'
    cy.wait(500);
  }
  cy.get(formControls.styleDropdown)
    .select(inAppNotificationDetails.displayStyle);
  if (inAppNotificationDetails.isDismissible === true)
    helpers.click(formControls.dismissibleCheckbox);
  helpers.click(formControls.messageContentButton);
  helpers.type(formControls.messageContentTextbox, inAppNotificationDetails.messageContent);
  // Verifying the InApp notification message that was set in preview section
  cy.get(formControls.previewBanner)
    .should('have.class', inAppNotificationDetails.displayStyle);
  cy.get(formControls.previewBanner)
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.equal(inAppNotificationDetails.messageContent);
    });
  if (inAppNotificationDetails.isDismissible === true)
    cy.get(formControls.previewDismissible)
      .should('exist');
  else cy.get(formControls.previewDismissible)
    .should('not.exist');
  helpers.click(formControls.saveAndCloseButton);
  cy.wait(500);
});

Cypress.Commands.add('verifyInAppNotificationOnHomePage', (inAppNotificationDetails: any) => {
  cy.visit('/sending');
  helpers.waitForSpinners();
  cy.navigateToHomePage();
  cy.get(formControls.inAppNotificationBannerText)
    .invoke('text')
    .then((text) => {
      expect(text.trim()).to.equal(inAppNotificationDetails.messageContent);
    });
  if (inAppNotificationDetails.isDismissible === true)
    cy.get(formControls.inAppNotificationBannerClose)
      .should('exist');
  else cy.get(formControls.inAppNotificationBannerClose)
    .should('not.exist');
  let displayStyleClass = 'spa-in-app-notification .global-alert-' + inAppNotificationDetails.displayStyle;
  cy.get(displayStyleClass).should('exist');
});

Cypress.Commands.add('verifyEditNotificationWhenStarted', (editedInAppNotificationDetails: any) => {
  helpers.click(formControls.editNotification);
  helpers.getElement(formControls.startDateCalendarTextBox).should('have.attr', 'readonly');
  helpers.getElement(formControls.dateCalendarIcon). first().should('be.disabled');
  selectDateFromCalendar(editedInAppNotificationDetails.endDate, 'End Date');
  helpers.getElement(formControls.messageContentTextbox).should('have.attr','contenteditable', 'false');
  helpers.click(formControls.saveAndCloseButton);
  cy.wait(500);
});

Cypress.Commands.add('clickOnEditNotification', () => {
  helpers.click(formControls.editNotification);
});
Cypress.Commands.add('verifyEditNotificationWhenNotStarted', (editedInAppNotificationDetails: any) => {
  cy.clickOnEditNotification();
  cy.addInAppNotification(editedInAppNotificationDetails);
});
Cypress.Commands.add('deleteAllInAppNotificationsViaAPI', () => {
  Helpers.log("Entering the deleteAllInAppNotificationsViaAPI method");
  //GET all the existing notifications and delete them
  cy.get('@XSRFToken').then((token) => {
    cy.request({
      method: "GET",
      url: 'api/notificationsvc/v1/notificationResources?skip=0&limit=1000',
      failOnStatusCode: true,
      retryOnNetworkFailure: true,
      headers: token
    }).then(async (response) => {
      if (!(response.body.notificationResources === null) && (response.status === 200)) {
        let count = response.body.notificationResources.length;
        Helpers.log(count);
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            let configIdToDelete = response.body.notificationResources[i].configId;
            Helpers.log("configId To Delete the InApp Notification::");
            Helpers.log(configIdToDelete);
            cy.request({
              method: "DELETE",
              url: `api/notificationsvc/v1/notificationResources/` + configIdToDelete,
              failOnStatusCode: false,
              retryOnNetworkFailure: true,
              headers: token
            }).then(async (response) => {
              expect(response.status).to.eq(200);
            })
          }
        } else {
          Helpers.log("No In App Notifications present");
        }
      }
    });
  });
});

Cypress.Commands.add('verifyCreatedNotificationNotExistsOnHomePage', () => {
  cy.visit('/sending');
  helpers.waitForSpinners();
  cy.navigateToHomePage();
  cy.get(formControls.inAppNotificationBannerText).should('not.exist');
});

Cypress.Commands.add('dismissTheNotification', () => {
  helpers.click(formControls.inAppNotificationBannerClose);
});

Cypress.Commands.add('inactivateAndVerifyInAppNotification', (inAppNotificationDetails: any) => {
  cy.clickOnEditNotification();
  helpers.click(formControls.inAppInActiveStatus);
  helpers.click(formControls.saveAndCloseButton);
  cy.wait(500);
  helpers.click(formControls.allUserLink)
    .get('.dropdown-item').contains('Inactive')
    .click();
  cy.get(formControls.tableGridRow)
    .should('include.text', inAppNotificationDetails.name).should('include.text', 'Inactive').wait(1000);
});
function selectDateFromCalendar(endDate, dateType: string) {
  //get and format the date eg: Sunday, February 25, 2024
  const formattedDate = helpers.getFormattedDate(endDate);
  if (dateType === 'Start Date')
    //click the start date calendar
    helpers.getElement(formControls.dateCalendarIcon).eq(0).click();
  else if(dateType === 'End Date')
    //click the end date calendar
    helpers.getElement(formControls.dateCalendarIcon).eq(1).click();
  //locating the date in the date picker and click on it
  cy.get(`[aria-label="${formattedDate}"]`)
    .click();
}

