import { Helpers } from '../helpers';
import { adminFormControls } from '../../fixtures/adminPortal/adminFormControls.json'
import { AdminChecker } from '../../support/adminPortal/adminChecker';
import { format } from 'util';
import { AdminTmp } from './adminTmp';
import {formControls} from "../../fixtures/adminconsole/formControls.json";
const helpers = new Helpers();
const adminChecker = new AdminChecker();

export var userResponse = null;
export var division_id = null;
export var expectedDuplicateUserCreationAlert = "Invalid request: User already exists";
var errorMessage_DuplicateSSOAdminUser = "AdminUserMapping with userID[pb.com_%s] already exists";
var errorMessage_InvalidSSOAdminUser = "UserID[pb.com_%s] is invalid";
export var expectedDomainErrorMsg = "Domain must be 'pb.com'";

export class AdminCommands extends Helpers {

  static readonly platformTabs = ['Carrier IDs', 'Plan Definition', 'Role Templates', 'Enterprises', 'Admin User', 'Integrators', 'Access Requests'];
  static readonly clientSetupTabs = ['Subscriptions', 'Integrations', 'Divisions and Locations', 'Carriers', 'Cost Accounts', 'Address Book', 'Roles', 'Users', 'Products', 'Business Rules', 'Notifications and Templates', 'Custom Fields'];

  public navigateHome() {
    this.click(adminFormControls.buttons.companyLogo).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.dropdown.selectEnterprise);
      this.waitForElementIsVisible(adminFormControls.buttons.navigateToPlatformTab);
    })
  }

  public navigateToPlatformTab() {
    cy.wait(2000)
    this.forceClick(adminFormControls.buttons.navigateToPlatformTab).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.manageEnterprises)
    })
  }

  public navigateToManageEnterprises() {
    this.forceClick(adminFormControls.buttons.manageEnterprises).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.createNewEnterprise)
    })
  }

  public navigateToManageAdminUsers() {
    this.forceClick(adminFormControls.buttons.manageAdminUsers).then(_ => {
      this.waitForSpinners();
      //this.waitForElementIsVisible(adminFormControls.buttons.addUser)
    })
  }

  public createNewEnterpriseClick() {
    this.click(adminFormControls.buttons.createNewEnterprise).then(_ => {
      this.waitForElementIsVisible(adminFormControls.staticElements.modal);
      this.waitForElementIsVisible(adminFormControls.inputs.enterpriseName);
    })
  }

  public addUserClick() {
    this.click(adminFormControls.buttons.addUser).then(_ => {
      this.waitForElementIsVisible(adminFormControls.staticElements.modal);
      this.waitForElementIsVisible(adminFormControls.inputs.firstName);
    })
  }

  public typeFirstNameLastNameAndEmail(firstName: string, lastName: string, email: string) {
    this.sendText(adminFormControls.inputs.firstName, firstName);
    this.sendText(adminFormControls.inputs.lastName, lastName);
    this.sendText(adminFormControls.inputs.email, email);
  }

  public typeEnterpriseNameAndConfirm(enterpriseName: string) {
    this.sendText(adminFormControls.inputs.enterpriseName, enterpriseName).then(_ => {
      this.click(adminFormControls.buttons.saveAndCloseInModal);
    });
  }

  public assignEnterpriseWhileAddingUser(enterprise: string) {
    cy.wait(500);
    cy.xpath(adminFormControls.dropdown.assignEnterprisesInput).focus();
    cy.wait(500);
    cy.waitForSpinnerIcon();
    cy.xpath(adminFormControls.dropdown.assignEnterprises).click();
    cy.waitForSpinnerIcon();
    cy.wait(2000);
    cy.wait(3000);
    cy.xpath(adminFormControls.inputs.searchEnterprisePlaceholder, {timeout: 15000}).click({force: true})
      .type(enterprise, {force: true})
      .should('have.value', enterprise)
    cy.xpath(format(adminFormControls.checkBox.searchEnterpriseCheckBox, enterprise)).click({force: true});
    cy.wait(500);
  }

  public saveAndCloseWhenAddingEnterpriseUser() {
    this.click(adminFormControls.buttons.saveAndCloseInModal).then(_ => {
      //cy.wait('@subscriptionmanagement');
      this.waitForSpinnerIcon();
    })
  }

  public waitForSpinnerIcon() {
    cy.get(adminFormControls.staticElements.spinnerIcon, { timeout: 90000 }).should('have.length', 0);
  }

  public callAccountClaimAPI(personalDetails: any) {
    this.getDataFromSubscriptionManagementAPI().then(async (interception) => {
      userResponse = JSON.parse(JSON.stringify(interception.response.body));
      AdminTmp.userID = userResponse.userID;
      const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
      if (!flag)//Skip if env is Fedramp or PPD
        this.verifyAccountClaim(userResponse.token);
    });
    cy.wait(2000);
  }

  public getDataFromSubscriptionManagementAPI(): any {
    return cy.wait('@subscriptionmanagement').then(function (response) {
      return response;
    });
  }

  public verifyAccountClaim(tokenId: string) {
    cy.request({
      method: 'POST',
      url: 'https://login2-api-stg.saase2e.pitneycloud.com/loginServices/v2/account/claim', // baseUrl is prepend to URL
      form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
      headers: {
        Origin: 'https://login2-stg.saase2e.pitneycloud.com',
        'Content-type': 'application/json'
      },
      body: {
        password: 'Horizon#123',
        passwordConfirmation: 'Horizon#123',
        token: tokenId
      }
    }).then((response) => {
      // response.body is automatically serialized into JSON
      expect(response.status).to.eq(200);
      const userStatus = response.body.userInformation.status;
      if (userStatus === 'ACTIVE') {
        Helpers.log('User is invited successfully');
      } else {
        Helpers.log('User invitivation is failed: Account claim api is failed');
      }
    });
  }

  public callDeleteApi(userId: string) {
    cy.request('DELETE', 'api/subscription-management/v1/subscriptions/users/' + userId).then(async (response) => {
      expect(response.status).to.eq(200);
    });
  }

  public verifyAdminTabs(tabName: string, username: string) {

    Helpers.log(` Verifying only ${tabName} tab should be display for the ${username} User`);
    switch (tabName) {
      case 'PB Service':
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToPlatformTab);
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToClientSetupTab);
        //helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToOnboardingTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToSupportTab);
        break;
      case 'PB Operator':
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToPlatformTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToClientSetupTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToOnboardingTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToSupportTab);
        break;
      case 'PB Support':
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToPlatformTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToClientSetupTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToOnboardingTab);
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToSupportTab);
        break;
      case 'all':
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToPlatformTab);
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToClientSetupTab);
        //helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToOnboardingTab);
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToSupportTab);
        break;
      case 'Installer Role':
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToPlatformTab);
        helpers.waitForElementIsVisible(adminFormControls.buttons.navigateToClientSetupTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToOnboardingTab);
        helpers.waitForElementNotExist(adminFormControls.buttons.navigateToSupportTab);
        break;
    }

  }

  public navigateToManageRoleTemplates() {
    Helpers.log("Navigating to Manage Role Templates Page")
    this.forceClick(adminFormControls.buttons.manageRoleTemplates).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addRoleTemplate)
      Helpers.log("Successfully Navigated to Manage Role Tmeplates Page")
    })
  }

  public clickOnAddRoleTemplate() {
    Helpers.log("Clicking on Add role Templates button")
    this.click(adminFormControls.buttons.addRoleTemplate).then(_ => {
      this.waitForElementIsVisible(adminFormControls.staticElements.modal);
      this.waitForElementIsVisible(adminFormControls.inputs.displayName);
    })
    Helpers.log("Successfully clicked on Add Role Tmeplates")
  }

  public enterDisplayNameInAddRoleTemplate(displayName: string) {
    Helpers.log("Method to enter the Display name in the Add role Template Modal")
    this.sendText(adminFormControls.inputs.displayName, displayName);
    Helpers.log("Successfully entered the Display name in the Add role Template Modal")
  }

  public clickOnSubTabsUnderAddRoleTemplate(tabName: string) {
    Helpers.log(`Clicking on subtab ${tabName}in Role Template Modal`)
    this.forceClick(format(adminFormControls.tabToSelect.addRoleTemplateSubTabs, tabName)).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.checkBox.selectAllInRoleTemplate);
    })
    Helpers.log(`Successfully clicked on subtab ${tabName}in Role Template Modal`)
  }

  public selectAllCheckboxUnderAddRoleTemplate() {
    Helpers.log(`Method to select all checkboxes under subtabs in Add Role Template Modal`)
    this.forceClick(adminFormControls.checkBox.selectAllInRoleTemplate).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.checkBox.selectedCheckboxes);
    })
    Helpers.log(`Succssfully Selected all checkboxes under subtabs in Add Role Template Modal`)
  }

  public clickOnSaveAndCloseInRoleTemplateModal() {
    this.click(adminFormControls.buttons.saveAndCloseInModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@addRoletemplate');
    })
    Helpers.log(`Succssfully clicked on Save and Close button in Add Role Template Modal`)
  }

  public getTotalCountOfSelectedCheckbox() {
    let initialCount = 0;
    let finalCount = 0;
    let countText;
    cy.xpath(adminFormControls.buttons.totalCountOfRoletemplate).each((item, index, list) => {
      let headerText = Cypress.$(item).text().trim();
      countText = headerText.replace(/(^.*\(|\).*$)/g, "").trim();
      finalCount = finalCount + parseInt(countText);
      Helpers.log(`Count is ==>${finalCount}`);
      AdminTmp.addRoleTemplateTotalCount = finalCount;
      AdminTmp.addPlanDefinitionTotalSelectedCheckboxCount = finalCount;
    })
  }

  public checkForDuplicateEditDeleteIconInRoleTemplate() {
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.duplicateRoleTemplateIcon);
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.editRoleTemplateIcon);
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.deleteRoleTemplateIcon);
  }

  public navigateToManagePlanDefinition() {
    this.forceClick(adminFormControls.buttons.managePlanDefinition).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addPlanDefinition)
    })
  }

  public clickOnAddPlanInPlanDefinition() {
    this.click(adminFormControls.buttons.addPlanDefinition).then(_ => {
      this.waitForElementIsVisible(adminFormControls.staticElements.modal);
      this.waitForElementIsVisible(adminFormControls.inputs.displayName);
    })
  }

  public enterDisplayNameAndDescriptionInAddPlanDefnintion(displayName: string, description: string) {
    this.sendText(adminFormControls.inputs.displayName, displayName);
    this.sendText(adminFormControls.inputs.description, description);
  }

  public clickOnSaveAndCloseInPlanDefinitionModal() {
    this.click(adminFormControls.buttons.saveAndCloseInModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@addPlanDefinition');
    })
  }

  public checkForDuplicateEditDeleteIconInPlanDefinition() {
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.duplicatePlanIcon);
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.editPlanIcon);
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.deletePlanIcon);
  }

  public clickOnDeleteIconInPlanDefinitionSearchResults() {
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.deletePlanIcon);
    this.click(adminFormControls.miniIcons.deletePlanIcon).then(_ => {
      this.waitForSpinnerIcon();
      this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
    })
    this.click(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteCreatedPlan');
    })
  }

  public navigateToClientSetupTab() {
    cy.wait(2000);
    this.forceClick(adminFormControls.buttons.navigateToClientSetupTab).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.dropdown.selectEnterprise)
    })
  }

  public selectEnterPriseInClientSetupTab(enterpriseName: string) {
    cy.xpath(adminFormControls.inputs.selectEnterPriseInClientSetup)
      .click()
      .type(enterpriseName)
      .get(adminFormControls.dropdown.dropdownText)
      .contains(enterpriseName)
      .click();
    //cy.wait('@selectEnterprise');
    cy.wait('@subscription');
    cy.wait('@userSubscriptionManagement');
    cy.wait(1000)
    this.waitForElementIsVisible(adminFormControls.buttons.manageSubscriptions);
  }

  public clickOnManageSubscriptions() {
    cy.xpath(adminFormControls.buttons.manageSubscriptions).click();
    this.waitForSpinners();
    this.waitForElementIsVisible(adminFormControls.text.availablePlanText);
  }

  public selectPlanInSubscription(planName: string) {
    cy.get(adminFormControls.dropdown.selectPlanInSubscription)
      .click()
      .get(adminFormControls.dropdown.dropDownTextOfSelectPlanDropdown)
      .contains(planName)
      .click()
      .wait(100)
      .get('p[class="text-break"]').should('be.visible');
    cy.get(adminFormControls.dropdown.selectPlanInSubscription).click();
    cy.wait(200);
  }

  public clickOnDeleteIconInRoleTemplateSearchResults() {
    helpers.waitForElementIsVisible(adminFormControls.miniIcons.deleteRoleTemplateIcon);
    this.click(adminFormControls.miniIcons.deleteRoleTemplateIcon).then(_ => {
      this.waitForSpinnerIcon();
      this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
    })
    this.click(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteCreatedRoleTemplate');
    })
  }

  public verifyPlatformPagesLoadedOrNot(tabName: string) {
    switch (tabName) {
      case 'Plan Definition':
        this.waitForElementIsVisible(adminFormControls.buttons.addPlanDefinition)
        break;
      case 'Role Templates':
        this.waitForElementIsVisible(adminFormControls.buttons.addRoleTemplate);
        break;
      case 'Enterprises':
        this.waitForElementIsVisible(adminFormControls.buttons.createNewEnterprise)
        break;
      case 'Admin User':
        this.waitForElementIsVisible(adminFormControls.buttons.addUser)
        break;
      case 'Integrators':
        this.waitForElementIsVisible(adminFormControls.buttons.addIntegrator)
        break;
      case 'Access Requests':
        this.waitForElementIsVisible(adminFormControls.staticElements.emailAccessRequests);
        this.waitForElementIsVisible(adminFormControls.staticElements.raisedOnAccessRequests)
        break;
    }
  }

  public navigateToManageIntegrators() {
    this.forceClick(adminFormControls.buttons.manageIntegrators).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addIntegrator);
    });
  }

  public navigateToManageAccessRequests() {
    cy.xpath(adminFormControls.buttons.manageAccessRequests).scrollIntoView();
    this.forceClick(adminFormControls.buttons.manageAccessRequests).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.staticElements.emailAccessRequests);
    });
  }

  public createPlanDefinition(personalDetails: any) {
    this.clickOnAddPlanInPlanDefinition();
    this.enterDisplayNameAndDescriptionInAddPlanDefnintion(personalDetails.displayName, personalDetails.description);
    helpers.click(adminFormControls.radio.active);
    this.clickOnSubTabsUnderAddRoleTemplate('ADMIN');
    this.selectAllCheckboxUnderAddRoleTemplate();
    //this.clickOnSubTabsUnderAddRoleTemplate('SENDING');
    //this.selectAllCheckboxUnderAddRoleTemplate();
    //this.clickOnSubTabsUnderAddRoleTemplate('Custom Features');
    //this.selectAllCheckboxUnderAddRoleTemplate();
    this.getTotalCountOfSelectedCheckbox();
    this.clickOnSaveAndCloseInPlanDefinitionModal();
  }

  public verifyCreatedPlanExist(personalDetails: any) {
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.displayName}`);
    cy.get('body').then(($body) => {
      Helpers.log(`Total count is ${AdminTmp.addPlanDefinitionTotalSelectedCheckboxCount}`);
      adminChecker.checkAddedPlanDefinitionExist(`${personalDetails.displayName}`, AdminTmp.addPlanDefinitionTotalSelectedCheckboxCount, `${personalDetails.description}`, 'ACTIVE');;
      this.checkForDuplicateEditDeleteIconInPlanDefinition();
    });
  }

  public createRoleTemplate(personalDetails: any) {
    this.clickOnAddRoleTemplate();
    this.enterDisplayNameInAddRoleTemplate(personalDetails.displayName);
    this.selectAllCheckboxUnderAddRoleTemplate();
    this.getTotalCountOfSelectedCheckbox();
    this.clickOnSaveAndCloseInRoleTemplateModal();
  }

  public verifyCreatedRoleTemplateExist(personalDetails: any) {
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.displayName}`);
    cy.get('body').then(($body) => {
      Helpers.log(`Total count is ${AdminTmp.addRoleTemplateTotalCount}`);
      adminChecker.checkAddedRoleTemplateExist(`${personalDetails.displayName}`, AdminTmp.addRoleTemplateTotalCount);
      this.checkForDuplicateEditDeleteIconInRoleTemplate();
    });
  }


  public navigateToManageIntegrations() {
    this.forceClick(adminFormControls.buttons.manageIntegrations).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addIntegrationsInClientSetup)
    })
  }

  public navigateToManageDivisionsAndLocations() {
    this.forceClick(adminFormControls.buttons.manageDivisionsAndLocations).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addDivisionInClientSetup)
    })
  }

  public navigateToManageCarriers() {
    this.forceClick(adminFormControls.buttons.manageCarriers).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addCarrierInClientSetup)
    })
  }

  public navigateToManageCostAccounts() {
    this.forceClick(adminFormControls.buttons.manageCostAccounts).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addCostAccountsInClientSetup)
    })
  }

  public navigateToManageAddressBook() {
    this.forceClick(adminFormControls.buttons.manageAddressBook).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addAddressBookInClientSetup)
    })
  }

  public navigateToManageRoles() {
    cy.wait(3000);
    this.forceClick(adminFormControls.buttons.manageRoles).then(_ => {
      this.waitForSpinners();
      cy.wait(2000);
      this.waitForElementIsVisible(adminFormControls.buttons.addRolesInClientSetup)
    })
  }

  public navigateToManageUsers() {
    this.forceClick(adminFormControls.buttons.manageUsers).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addUsersInClientSetup)
    })
  }

  public navigateToManageProducts() {
    this.forceClick(adminFormControls.buttons.manageProducts).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addProductsInClientSetup)
    })
  }

  public navigateToManageBusinessRules() {
    this.forceClick(adminFormControls.buttons.manageBusinessRules).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addBusinessRulesInClientSetup)
    })
  }

  public navigateToManageNotificationsAndTemplates() {
    cy.xpath(adminFormControls.buttons.manageNotificationsAndTemplates).click();
    this.waitForSpinners();
    this.waitForElementIsVisible(adminFormControls.buttons.addNotificationInClientSetup)
  }

  public navigateToManageCustomFields() {
    this.forceClick(adminFormControls.buttons.manageCustomFields).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addCustomFieldsInClientSetup)
    });
    this.waitForSpinners();
  }

  public verifyClientSetupPagesLoadedOrNot(tabName: string) {
    switch (tabName) {
      case 'Subscriptions':
        this.waitForElementIsVisible(adminFormControls.text.availablePlanText)
        break;
      case 'Integrations':
        this.waitForElementIsVisible(adminFormControls.buttons.addIntegrationsInClientSetup);
        break;
      case 'Divisions and Locations':
        this.waitForElementIsVisible(adminFormControls.buttons.addDivisionInClientSetup)
        break;
      case 'Carriers':
        this.waitForElementIsVisible(adminFormControls.buttons.addCarrierInClientSetup)
        break;
      case 'Cost Accounts':
        this.waitForElementIsVisible(adminFormControls.buttons.addCostAccountsInClientSetup)
        break;
      case 'Address Book':
        this.waitForElementIsVisible(adminFormControls.buttons.addAddressBookInClientSetup)
        break;
      case 'Roles':
        this.waitForElementIsVisible(adminFormControls.buttons.addRolesInClientSetup)
        break;
      case 'Users':
        this.waitForElementIsVisible(adminFormControls.buttons.addUsersInClientSetup);
        break;
      case 'Products':
        this.waitForElementIsVisible(adminFormControls.buttons.addProductsInClientSetup)
        break;
      case 'Business Rules':
        this.waitForElementIsVisible(adminFormControls.buttons.addBusinessRulesInClientSetup)
        break;
      case 'Notifications and Templates':
        this.waitForElementIsVisible(adminFormControls.buttons.addNotificationInClientSetup)
        break;
      case 'Custom Fields':
        this.waitForElementIsVisible(adminFormControls.buttons.addCustomFieldsInClientSetup);
        break;
    }
  }

  public addDivision(divisionName: string) {
    cy.xpath(adminFormControls.buttons.addDivisionInClientSetup).click();
    cy.get(adminFormControls.inputs.divisionNameTxtBox).focus().clear().type(divisionName);
    cy.xpath(adminFormControls.buttons.saveAndCloseInModal).click()
    //cy.wait('@addDivision');
    cy.wait('@enterpriseDivision');
    //cy.wait('@getDivision');
  }

  public addLocation(locationDetails: any, divisionName: string) {
    cy.get(adminFormControls.buttons.addLocationInClientSetup).click();
    cy.get(adminFormControls.buttons.locationNameTxtBox).focus().clear().type(locationDetails.locName);
    cy.get(adminFormControls.dropdown.locationAddDivisionDrpDown).click().get(adminFormControls.dropdown.dropdownText)
      .contains(divisionName).click();
    cy.get(adminFormControls.inputs.locationAccountNumber).clear().type(locationDetails.locAccountNumber)
    cy.get(adminFormControls.inputs.companyName).clear().type(locationDetails.companyName)
    cy.get(adminFormControls.inputs.addressLine1).clear().type(locationDetails.addressLine1)
    //cy.get(adminFormControls.inputs.email).clear().type(locationDetails.email)
    cy.get(adminFormControls.inputs.phone).clear().type(locationDetails.phone)
    cy.get(adminFormControls.inputs.state).select(locationDetails.state)
    cy.get(adminFormControls.inputs.city).clear().type(locationDetails.city)
    cy.get(adminFormControls.inputs.postalCode).clear().type(locationDetails.postalCode)
    cy.get(adminFormControls.buttons.saveLocationButtonInModal).click();
    this.waitForSpinnerIcon();
    cy.wait('@addLocation');
    cy.wait('@enterpriseLocation');
    //cy.wait('@getDivision');
  }

  public switchPlatform(option: string) {
    switch (option) {
      case 'ON':
        cy.xpath(adminFormControls.toggleSwitch.platformON).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
      case 'OFF':
        cy.xpath(adminFormControls.toggleSwitch.platformOFF).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
    }

  }

  public switchClientSetup(option: string) {
    switch (option) {
      case 'ON':
        cy.xpath(adminFormControls.toggleSwitch.clientSetupON).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
      case 'OFF':
        cy.xpath(adminFormControls.toggleSwitch.clientSetupOFF).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
    }

  }

  public switchProductSupport(option: string) {
    switch (option) {
      case 'ON':
        cy.xpath(adminFormControls.toggleSwitch.productSupportON).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
      case 'OFF':
        cy.xpath(adminFormControls.toggleSwitch.productSupportOFF).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
    }
  }

  public switchClientSandbox(option: string) {
    switch (option) {
      case 'ON':
        cy.xpath(adminFormControls.toggleSwitch.clientSandboxON).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
      case 'OFF':
        cy.xpath(adminFormControls.toggleSwitch.clientSandboxOFF).scrollIntoView().should('be.visible').click({ force: true }).then((_) => {
          cy.waitForSpinners();
        })
        break;
    }
  }

  public verifyCreatedLocationExist(locationDetails: any) {
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${locationDetails.locName}`);
    cy.get('body').then(($body) => {
      cy.get(adminFormControls.staticElements.tableGridRow).should('include.text', `${locationDetails.locName}`);
      //this.checkForEditDeleteIconInLocation();
    });
  }
  public clickOnDeleteIconInLocationSearchResults() {
    cy.get(adminFormControls.miniIcons.deleteLocationIcon).should('be.visible').click({ force: true })
      .then(_ => {
        this.waitForSpinnerIcon();
        this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
      })
    this.click(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteLocation');
    })
  }

  public clickOnInstallerCheckbox() {
    cy.get(adminFormControls.checkBox.installerCheckbox).click({ force: true }).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.staticElements.alertModalInInstaller);
      this.waitForElementIsVisible(adminFormControls.text.alertText);
    });
    cy.xpath(adminFormControls.buttons.okButtonInInstallerModal).click();
  }

  public checkForEditDeleteIconInLocation() {
    cy.get(adminFormControls.miniIcons.editLocationIcon).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteLocationIcon).should('be.visible');
  }

  public verifyAdminUserGrid(firstName: string, lastName: string, email: string, status: string, assignedEnterprises: string, groupEnterprise?: string) {
    cy.xpath(format(adminFormControls.adminUsersGrid.namePath, 1)).should('include.text', firstName);
    cy.xpath(format(adminFormControls.adminUsersGrid.namePath, 1)).should('include.text', lastName);
    cy.xpath(format(adminFormControls.adminUsersGrid.emailPath, 1)).should('include.text', email.substr(0, 15));
    cy.xpath(format(adminFormControls.adminUsersGrid.statusPath, 1)).should('include.text', status);
    cy.xpath(format(adminFormControls.adminUsersGrid.assignedEnterprises, 1)).should('include.text', assignedEnterprises);
    Helpers.log('Succussfully verified user details in grid');
  }

  public clickResetPassword() {
    cy.get(adminFormControls.buttons.resetPasswordLink).should('be.visible')
      .click({ force: true })
      .wait('@resetPassword')
      .get(adminFormControls.staticElements.passwordResetToastMsg).should('be.visible');
  }

  public addCostAccount(costAccount: any) {
    cy.xpath(adminFormControls.buttons.addCostAccountsInClientSetup).click();
    cy.get(adminFormControls.inputs.costAccounts_AddForm_Name).clear().type(costAccount.name);
    cy.get(adminFormControls.inputs.costAccounts_AddForm_Code).clear().type(costAccount.code).blur();
    cy.get(adminFormControls.inputs.costAccounts_AddForm_Description).clear().type(costAccount.description).blur();
    cy.get(adminFormControls.buttons.costAccounts_AddForm_Save).wait(1000).click();
    cy.wait('@addCostAccount_ClientSetup').its('response.statusCode').should('eq', 201);
    this.waitForSpinnerIcon();
    cy.wait(4000);
    this.clickOnCostAccRefresh();
    cy.wait(3000);
  }

  public editCostAccount(costAccount: any) {
    cy.xpath(adminFormControls.miniIcons.editAccountIcon).click();
    cy.get(adminFormControls.inputs.costAccounts_AddForm_Description).clear().type(costAccount.description + " Edit/Update").blur();
    cy.get(adminFormControls.buttons.costAccounts_AddForm_Save).wait(1000).click();
    cy.wait('@editCostAccount_ClientSetup').its('response.statusCode').should('eq', 200);
    this.waitForSpinnerIcon();
  }

  public verifyCreatedCostAccountExist(costAccountDetails: any) {
    this.clickOnCostAccRefresh();
    this.waitForSpinnerIcon();
    cy.wait('@advancedSearchAPI').its('response.statusCode').should('eq', 200);
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${costAccountDetails.name}`);
    cy.get('body').then(($body) => {
      cy.get(adminFormControls.staticElements.tableGridRow).should('include.text', `${costAccountDetails.name}`);
      this.checkForAddEditDeleteIconInCostAccount();
    });
  }

  public verifyCreatedCostAccountExistAfterImport(costAccountName: string) {
    this.clickOnCostAccRefresh();
    this.waitForSpinnerIcon();
    cy.wait('@advancedSearchAPI').its('response.statusCode').should('eq', 200);
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, costAccountName);
    cy.get('body').then(($body) => {
      cy.get(adminFormControls.staticElements.tableGridRow).should('include.text', costAccountName.substr(0, 11));
      this.checkForAddEditDeleteIconInCostAccount();
    });
  }

  public checkForAddEditDeleteIconInCostAccount() {
    cy.get(adminFormControls.miniIcons.addAccountIcon).should('be.visible');
    cy.get(adminFormControls.miniIcons.editAccountIcon).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteAccountIcon).should('be.visible');
  }

  public clickOnDeleteIconInCostAccountSearchResults() {
    this.clickOnCostAccRefresh();
    cy.get(adminFormControls.miniIcons.deleteAccountIcon).should('be.visible').click({ force: true })
      .then(_ => {
        this.waitForSpinnerIcon();
        this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
      })
    this.click(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteCostAccount_ClientSetup').its('response.statusCode').should('eq', 200);
      cy.wait(1000);
    })
  }

  public addContact(addressDetails: any, option: string) {
    cy.xpath(adminFormControls.buttons.addAddressBookInClientSetup).click();
    switch (option) {
      case 'Receipient':
        cy.get('#recipient').click();
        break;
      case 'Sender':
        cy.get('#sender').click();
        break;
    }
    cy.get(adminFormControls.inputs.nameInAddContact).type(addressDetails.name);
    cy.get(adminFormControls.inputs.companyInAddContact).type(addressDetails.companyName).blur();
    cy.get(adminFormControls.inputs.emailInAddContact).type(addressDetails.email).blur();
    cy.get(adminFormControls.inputs.phoneInAddContact).type(addressDetails.phone).blur();
    cy.get(adminFormControls.inputs.address1InAddContact).click().type(addressDetails.addressLine1);
    // .get(adminFormControls.dropdown.addressLine1DropDownText).contains(addressDetails.addressLine1).click();
    cy.get(adminFormControls.inputs.zipCode).click().type(addressDetails.postalCode);
    cy.get(adminFormControls.inputs.city).click().type(addressDetails.city);
    cy.get('ng-select').select(addressDetails.state);
    cy.get(adminFormControls.buttons.saveAndCloseButtonInAddContact).wait(1000).click();
    cy.wait('@addContact_ClientSetup');
    this.waitForSpinnerIcon();
  }

  public verifyCreatedContactExist(addressDetails: any) {
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${addressDetails.name}`);
    cy.get('body').then(($body) => {
      cy.get(adminFormControls.staticElements.tableGridRow).should('include.text', `${addressDetails.name}`);
      this.checkForEditDeleteIconInContact();
    });
  }

  public clickOnDeleteIconInContactSearchResults() {
    cy.get(adminFormControls.miniIcons.deleteContactIcon).should('be.visible').click({ force: true })
      .then(_ => {
        this.waitForSpinnerIcon();
        this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
      })
    this.click(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteContact_ClientSetup');
      cy.wait(1000);
    })
  }

  public checkForEditDeleteIconInContact() {
    cy.get(adminFormControls.miniIcons.editContactIcon).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteContactIcon).should('be.visible');
  }

  public addUsers(personalDetails: any, accessLevel: any) {
    cy.xpath(adminFormControls.buttons.addUsersInClientSetup).click().then((_) => {
      cy.wait(500);
    })
    cy.xpath(adminFormControls.inputs.firstName).type(personalDetails.firstName);
    cy.xpath(adminFormControls.inputs.lastName).type(personalDetails.lastName).blur();
    cy.xpath(adminFormControls.inputs.email).type(personalDetails.email).blur();
    cy.get('#' + accessLevel + ' .mat-radio-input').should('not.be.visible').check({ force: true }).should('be.checked');
  }

  public selectRoleFromAssignRoleDropDown() {
    this.click(adminFormControls.staticElements.modal);
    this.click(adminFormControls.dropdown.assignRoleDropdown);
    cy.wait(1000);
    cy.get(adminFormControls.dropdown.selectRole).first().click({ force: true });
    cy.wait(1000);
    this.click(adminFormControls.dropdown.assignRole);
  }

  public selectLocationFromDropDown() {
    this.click(adminFormControls.dropdown.selectLocationDrpDown);
    cy.get(adminFormControls.dropdown.selectLocation).first().click({ force: true });
  }

  public clickOnSaveAndCloseInAddUserModal() {
    this.click(adminFormControls.buttons.saveAndCloseInModal).then(_ => {
      this.waitForSpinnerIcon();
      //cy.wait('@addUser_ClientSetup');
    })
    Helpers.log(`Successfully clicked on Save and Close button in Add User Template Modal`)
  }

  public callAccountClaimAPI_ClientUser() {
    this.getDataFromUserByEmailAPI().then(async (interception) => {
      userResponse = JSON.parse(JSON.stringify(interception.response.body));
      AdminTmp.userID = userResponse.userID;
      Helpers.log(`user id is ${AdminTmp.userID}`);
      cy.wrap(userResponse.userID).as('userID');
      const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd') || Cypress.env('appEnv').includes('admin-prod');
      Helpers.log(`Flag value is ${flag}`);
      if (!flag)
        this.verifyAccountClaim(userResponse.token);
      cy.wait(2000);
    });
  }

  public getDataFromUserByEmailAPI() {
    return cy.wait('@addUser_ClientSetup').then(function (response) {
      return response;
    });
  }

  public verifyClientUserGrid(firstName: string, email: string, status: string) {
    cy.xpath(format(adminFormControls.clientUsersGrid.namePath, 1)).should('include.text', firstName.substr(0, 9));
    cy.xpath(format(adminFormControls.clientUsersGrid.emailPath, 1)).should('include.text', email.substr(0, 9));
    cy.xpath(format(adminFormControls.clientUsersGrid.statusPath, 1)).should('include.text', status);
  }

  public verifyUserAccessValidation() {
    cy.waitForSpinners();
    cy.get(adminFormControls.buttons.settingsMenuItems).click();
    cy.get(adminFormControls.buttons.manageUsersLink).should('not.exist');
    cy.get(adminFormControls.buttons.manageContacts).contains('Address Book').click();
  }

  public verifyEnterpriseAccessValidation() {
    cy.waitForSpinners();
    cy.get(adminFormControls.buttons.settingsMenuItems).click();
    cy.get(adminFormControls.buttons.manageUsersLink).should('exist');
    cy.get(adminFormControls.buttons.manageContacts).contains('Address Book').click();
  }

  public verifyDivisionAccessValidation() {
    cy.waitForSpinners();
    cy.get(adminFormControls.buttons.settingsMenuItems).click();
    cy.get(adminFormControls.buttons.manageUsersLink).contains('Users').should('be.visible').click();
    this.clickAddUser();
    cy.wait(2000);
    cy.get('#enterprise').should('not.exist');
    cy.get(adminFormControls.buttons.addUserPopupCloseBtn).click();
    cy.get(adminFormControls.buttons.divisionLocLink).click()
    cy.get(adminFormControls.buttons.addDivisionBtn).should('be.disabled');
  }

  public verifyLocationAccessValidation() {
    cy.waitForSpinners();
    cy.get(adminFormControls.buttons.settingsMenuItems).click();
    cy.get(adminFormControls.buttons.manageUsersLink).contains('Users').should('be.visible').click();
    this.clickAddUser();
    cy.get('#enterprise').should('not.exist');
    cy.get('#division').should('not.exist');
    cy.get(adminFormControls.buttons.addUserPopupCloseBtn).click();
    cy.get(adminFormControls.buttons.divisionLocLink).click()
    cy.get(adminFormControls.buttons.addLocationBtn).should('be.disabled');
  }

  public clickAddUser() {
    cy.get(adminFormControls.buttons.addUserBtn).click().wait(1000);
  }

  public clickOnExportLocation() {
    /*cy.get(adminFormControls.buttons.exportLocation).click();
    this.getResponseOfExportLocationAPI().then(async (interception) => {
      const response = JSON.parse(JSON.stringify(interception.response.body));
      let expectedStatus = response.status;
      Helpers.log(`***** status is==>${expectedStatus}`);
      expect(response.status).to.eq(200);
    });*/

    Helpers.log("Clicking on Export button");
    cy.get(adminFormControls.buttons.exportLocation).forceClick();
    cy.window()
      .document()
      .then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            // Below is needed to fool cypress waiting for new page load
            //doc.location.href = 'about:blank';
          }, 5000);
        });
        /* Make sure the file exists */
        cy.intercept('/', (req) => {
          req.reply((res) => {
            expect(res.statusCode).to.equal(200);
          });
        });

        Helpers.log("Successfully clicked on the export button")
        cy.wait(6000);
      });
  }

  public getResponseOfExportLocationAPI(): any {
    return cy.wait('@exportLocation').then(function (response) {
      Helpers.log(`response is===>${response}`)
      return response;
    });
  }

  public selectDivision() {
    cy.get(adminFormControls.dropdown.selectDivisionDrpDown).click()
    cy.get(adminFormControls.dropdown.selectDivision).click({ force: true })
    cy.get(adminFormControls.dropdown.selectDivisionDrpDown).click();
    //cy.get("[formcontrolname='adminLevelEntity'] span[class*='pi-caret-down']").click();
  }

  public selectAdminLocation() {
    cy.get(adminFormControls.dropdown.selectAdminLocationDropdown).click();
    cy.get(adminFormControls.dropdown.selectAdminLocation).click();
    cy.wait(2000);
    cy.get("#admin-entity-location-list span[class='ng-arrow-wrapper']").click({ force: true });
    cy.wait(2000);
    //cy.get('#' + 'location' + ' .mat-radio-input').should('not.be.visible').check({ force: true }).should('be.checked');
    //cy.get('body').click(0,0);

  }

  public callDeleteApiForEnterprise(enterpriseName: string) {
    this.getEnterpriseID(enterpriseName).then((enterprisedate) => {
      Helpers.log(`*******************Enterprise id is==>${AdminTmp.enterpriseId}`)
      cy.request('DELETE', '/api/client-management/v1/enterprises/' + AdminTmp.enterpriseId).then(async (response) => {
        expect(response.status).to.eq(200);
      });
    })

  }

  public getEnterpriseID(enterpriseName: string) {
    let enterpriseData;
    return cy.request('GET', '/api/client-management/v1/enterprises').then(async (response) => {
      Helpers.log(`*******************Enterprise id is==>${response.body}`)
      enterpriseData = response.body.find(enterprise => enterprise.name === enterpriseName);
      if (enterpriseData !== undefined) {
        AdminTmp.enterpriseId = enterpriseData.enterpriseID;
        Helpers.log(`*******************Enterprise id is==>${AdminTmp.enterpriseId}`)
      }
    });
  }

  public deleteDivisionViaAPI() {
    cy.get('body').then((_) => {
      Helpers.log(`*******************Division id is==>${AdminTmp.divisionID}`);
      cy.request('DELETE', 'api/client-management/v1/divisions/' + AdminTmp.divisionID).then(async (response) => {
        expect(response.status).to.eq(200);
        cy.wait(1000);
      });
    })
  }

  public createDataForImportFile(filePath: string, locdetail: any) {
    this.generateImportFileForLocation(filePath, locdetail);
  }

  public generateImportFileForLocation(filePath: string, locdetail: any) {
    Helpers.log(`*********Generate Import File For location method started************`);
    this.addDivisionIdAPI().then(async (interception) => {
      const uuidGenerator = () => Cypress._.random(0, 1e9);
      const bpnNumber = uuidGenerator();
      const res = JSON.parse(JSON.stringify(interception.response.body));
      division_id = res.divisionID;
      AdminTmp.divisionID = res.divisionID;
      cy.wrap(res.divisionID).as('divisionID');
      Helpers.log(`**********************division_id is =>${division_id}*****************`);
      cy.writeFile(filePath, 'DivisionID,LocationID,Name,Company,Phone,AddressLine1,AddressLine2,AddressLine3,City,State,CountryCode,PostalCode,RCName,ReturnAddressLine1,ReturnAddressLine2,ReturnAddressLine3,ReturnCity,ReturnState,ReturnCountryCode,ReturnPostalCode,ISReturnAddressSame,ShipToBPN,CostAccountsEnabled,CostAccountRequiredForMailingLabel,CostAccountRequiredForShippingLabel,Email,ReturnPhone,ReturnEmail,ReturnCompany\n');
      cy.writeFile(filePath, division_id + ',' + '' + ',' + locdetail.locName + ',' + locdetail.companyName + ',' + locdetail.phone + ',' + locdetail.addressLine1 + ',' + 'Test,' + 'Test,' + locdetail.city + ',' + locdetail.state + ',' + 'US,' + locdetail.postalCode + ',' + 'rc test,' + '144-154 W Lawrence St,' + 'Test,' + 'Test,' + 'Albany,' + 'NY,' + 'US,' + '12180,' + 'FALSE,' + bpnNumber + ',' + 'TRUE,' + 'TRUE,' + 'TRUE,' + ',' + ',' + ',\n', {
        flag: 'a+'
      });
    });
    Helpers.log(`*********Successfully generated Import File For location method started************`);
  }

  public addDivisionIdAPI() {
    return cy.wait('@addDivision').then(function (response) {
      return response;
    });
  }

  public importLocation(filePath) {
    cy.get(adminFormControls.buttons.importLocation).contains('Import').click().wait(500);
    cy.get(adminFormControls.inputs.importFileInput).attachFile(filePath);
    cy.get(adminFormControls.buttons.continueLocButton).click()
      .get(adminFormControls.buttons.progressBar, { timeout: 6000 })
      .wait('@importLocation1')
      .wait('@importLocation2');
    cy.get(adminFormControls.buttons.locationImportSaveBtn, { timeout: 8000 }).click()
      .get(adminFormControls.buttons.importProgressBar, { timeout: 8000 })
      .wait('@importLocation3')
    cy.wait(9000);
    cy.get(adminFormControls.buttons.closeBtn, { timeout: 6000 }).click();
    cy.wait(15000);
  }

  public getDivisionIdFromAPI() {
    this.addDivisionIdAPI().then(async (interception) => {
      const res = JSON.parse(JSON.stringify(interception.response.body));
      division_id = res.divisionID;
      AdminTmp.divisionID = res.divisionID;
      cy.wrap(res.divisionID).as('divisionID');
      Helpers.log(`**********************division_id is =>${division_id}*****************`);
    });
  }

  public clickOnCostAccountManualImport() {
    cy.wait(1000);
    if (Cypress.env('appEnv').includes('fed') === false) {
      cy.get(adminFormControls.dropdown.importTypeDropdown, { timeout: 5000 }).click()
        .wait(2000)
        .get(adminFormControls.dropdown.importManaulCostAccount, { timeout: 5000 }).click().wait(2000);
    } else {
      cy.get(adminFormControls.dropdown.costAccount_importBtn).contains('Import').click().wait(500);
    }
  }

  public clickOnImportCostAccount(filePath) {
    //cy.get(adminFormControls.buttons.importAccountButton).contains('Import').click().wait(500);
    this.clickOnCostAccountManualImport();
    cy.xpath(adminFormControls.inputs.enterpriseName).click();
    cy.get(adminFormControls.inputs.importFileInput).attachFile(filePath);
    cy.get(adminFormControls.buttons.continueButton, { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get(adminFormControls.buttons.costAccImportBtn, { timeout: 10000 })
      .should('be.visible')
      .click();
    this.waitForimportStatusProcessed('@importFileStatus', 30);
    this.waitForSpinnerIcon();


  }

  public waitForimportStatusProcessed(aliasName, retries) {
    cy.wait(aliasName).its('response.body').then(json => {
      if (json.status === "Processed") {
        Helpers.log("status is processed");
        return
      }
      else if (retries > 0) {
        this.waitForimportStatusProcessed(aliasName, retries - 1);
      }
    });
  }

  public selectAvailablePlan(planName: string) {
    cy.get(adminFormControls.dropdown.availablePlanListDropdown)
      .click()
      .get('input[role="textbox"]').focus()
      .type(planName)
      .get(adminFormControls.dropdown.availablePlanDropdownText)
      .contains(planName)
      .click();
    cy.get(adminFormControls.dropdown.availablePlanListDropdown).click();
    cy.wait(1000)
    cy.get(adminFormControls.staticElements.seletedPlansUnderDropdown).should('be.visible')
    cy.get(adminFormControls.staticElements.seletedPlansUnderDropdown).contains(planName);
  }

  public selectCarrierCheckbox(carrierName: string) {
    cy.get(adminFormControls.checkBox.carrierCheckbox).contains(carrierName).click();
    cy.wait(1000)
  }

  public selectOktaIDFromDropDown(oktaID: string) {
    cy.get(adminFormControls.dropdown.oktaIdDropdown)
      .click()
      .type(oktaID)
      .get(adminFormControls.dropdown.oktadropdownText)
      .contains(oktaID)
      .click();
    cy.wait(1000)
  }

  public clickOnSaveButtonInSubscription() {
    cy.get(adminFormControls.buttons.saveSubscriptionButton).should('be.visible').click();
    cy.get(adminFormControls.staticElements.successToastMessage).should('be.visible');
    cy.get(adminFormControls.staticElements.successToastMessage, { timeout: 90000 }).should('have.length', 0);
    cy.wait(1000)
  }

  public clickOnEditUserButton() {
    cy.wait(5000);
    cy.get(adminFormControls.buttons.editUserInAdminUserSearchPage).click({ force: true });
    //cy.wait('@editUser');
    cy.wait(5000);
    this.waitForElementIsVisible(adminFormControls.inputs.firstName);
  }

  public selectNewlyCreatedEnterPriseInClientSetupTab(enterpriseName: string) {
    cy.xpath(adminFormControls.inputs.selectEnterPriseInClientSetup)
      .click()
      .type(enterpriseName)
      .get(adminFormControls.dropdown.dropdownText)
      .contains(enterpriseName)
      .click();
    //cy.wait('@selectEnterprise');
    //cy.wait('@subscription');
    cy.wait(5000)
    this.waitForElementIsVisible(adminFormControls.buttons.manageSubscriptions);
  }

  public selectCustomFieldsRadioButton(option: string) {
    switch (option) {
      case 'Use Custom Fields':
        cy.get('span[class="mat-radio-label-content"]').contains('Use Custom Fields').click({ force: true });
        cy.get(adminFormControls.buttons.addCustomFieldsButton).should('be.visible');
        break;
      case "Don't Use Custom Fields":
        cy.get('span[class="mat-radio-label-content"]').contains("Don't Use Custom Fields").click({ force: true });
        break;
    }

  }

  public addCustomFields(newCustomFields: any) {
    this.waitForSpinners();
    cy.wait(2000);
    cy.get(adminFormControls.buttons.addCustomFieldsButton, { timeout: 90000 }).should('be.visible').click({ force: true });
    cy.get(adminFormControls.inputs.nameField, { timeout: 90000 }).should('be.visible').click();
    cy.get(adminFormControls.inputs.nameField).focus().clear().type(`${newCustomFields.name}`);
    cy.get(adminFormControls.dropdown.customTypeDropdown).click().wait(500);
    cy.get(adminFormControls.dropdown.customTypeDrpdoownText).contains(`${newCustomFields.customType}`).click({ force: true }).wait(500);
    cy.get('#CONTACTS_ADDRESS_BOOK-input').click({ force: true });
    cy.get(adminFormControls.buttons.addCustomFields_SaveButton).click().wait('@addCustomField');
    cy.get(adminFormControls.staticElements.successMessageInCustomFields).should('be.visible');
    cy.get(adminFormControls.staticElements.successMessageInCustomFields, { timeout: 90000 }).should('have.length', 0);
  }

  public verifyCreatedCustomFieldExist(newCustomFields: any) {
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${newCustomFields.name}`);
    cy.wait(2000);
    cy.get('body').then(($body) => {
      cy.get(adminFormControls.staticElements.tableGridRow).should('include.text', `${newCustomFields.name}`);
      this.checkForEditDeleteIconInCsutomField();
    });
  }

  public checkForEditDeleteIconInCsutomField() {
    cy.get(adminFormControls.miniIcons.editCustomField).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteCustomField).should('be.visible');
  }

  public clickOnDeleteIconInCustomFieldSearchResults() {
      this.forceClick(adminFormControls.miniIcons.deleteCustomFieldXpath).then(_ => {
      this.waitForSpinnerIcon();
      this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
    })
      this.forceClick(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteCustomField');
      cy.wait(1000);
    });
  }

  public verifyCreatedCustomFieldInAddressBook(newCustomFields: any) {
    cy.xpath(adminFormControls.buttons.addAddressBookInClientSetup).click();
    cy.get('#recipient', { timeout: 90000 }).should('be.visible');
    cy.get('#add-address-btn').scrollIntoView({ duration: 2000 }).should('be.visible');
    cy.get(adminFormControls.dropdown.customFieldHeaderInAddressBook).contains(newCustomFields.name).scrollIntoView();
    cy.get(adminFormControls.dropdown.customFieldHeaderInAddressBook).should('be.visible').contains(newCustomFields.name);
    cy.get(adminFormControls.inputs.customFieldInputInAddressBook).type("Entering text inside the Custom field input box");
    cy.get('button[aria-label="Close"]').click();
    cy.wait(1000);
  }

  public clickOnImportContact(filePath) {
    cy.get(adminFormControls.buttons.importContact).click().wait(2000);
    cy.get(adminFormControls.inputs.importFileInput, { timeout: 10000 }).attachFile(filePath).wait(2000);
    cy.get(adminFormControls.buttons.submitButton).click({ force: true }).wait(2000);
    cy.get(adminFormControls.buttons.submitButton, { timeout: 30000 }).click().wait(['@importContact_ClientSetup2', '@getImportedAddresses']);
    cy.get(adminFormControls.staticElements.successMessageInImportContact).should('be.visible');
    cy.get(adminFormControls.staticElements.successMessageInImportContact, { timeout: 90000 }).should('have.length', 0);
    cy.wait(1000)

    /*cy.getElements('contactsImportButton').contains('Import').click().wait(2000);
    cy.getElements('contactsImportFileInput', { timeout: 10000 }).attachFile(filePath);
    cy.getElements('contactsImportContinueBtn').click().wait(5000);
    cy.getElements('contactsImportConfirmBtn', { timeout: 30000 }).click().wait(['@processAddressbookImport', '@getImportedAddresses']);
    cy.wait('@getContacts', { timeout: 15000 });*/
  }

  public addNotification(notificationlDetails: any) {
    cy.xpath(adminFormControls.buttons.addNotificationInClientSetup, { timeout: 90000 }).should('be.visible').click().then((_) => {
      cy.wait(500);
    })
    cy.get(adminFormControls.inputs.nameField).type(notificationlDetails.name);
    cy.get(adminFormControls.inputs.typeInAddNotification)
      .click()
      .type(notificationlDetails.type)
      .get(adminFormControls.dropdown.dropdownTextList)
      .contains(notificationlDetails.type)
      .click();
    //Commented Below line because as per new implementation, Send Via Email check is selected by default now.
    //cy.get(adminFormControls.checkBox.emailCheckBoxInAddNotification).click({ force: true });
    cy.get(adminFormControls.inputs.conditionInAddNotification)
      .click()
      .type(notificationlDetails.condition)
      .get(adminFormControls.dropdown.dropdownTextList)
      .contains(notificationlDetails.condition)
      .click();
    cy.get(adminFormControls.inputs.scheduleInAddNotification)
      .click()
      .type(notificationlDetails.schedule)
      .get(adminFormControls.dropdown.dropdownTextList)
      .contains(notificationlDetails.schedule)
      .click();
    this.selectNotificationVisibilityLevel(notificationlDetails);
    cy.get("#load-sample-message").click({ force: true });
    cy.get(adminFormControls.inputs.subjectInAddNotification).type(notificationlDetails.subject).blur();
    cy.wait(2000);
    cy.get("div[class='angular-editor-wrapper'] .angular-editor-textarea")
      .should('include.text', notificationlDetails.text);
    cy.get(adminFormControls.buttons.saveAndCloseButton).click({ force: true }).wait('@addNotification').its('response.statusCode').should('eq', 201);
    cy.get(adminFormControls.staticElements.successMessageInNotification).should('be.visible');
    cy.get(adminFormControls.staticElements.successMessageInNotification, { timeout: 90000 }).should('have.length', 0);
    cy.wait(1000)
  }

  public verifyCreatedNotificationExist(notificationlDetails: any, defaultNotification?: boolean) {
    this.waitForElementIsVisible(adminFormControls.inputs.placeholderSearch)
    this.waitForSpinnerIcon();
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${notificationlDetails.name}`);
    cy.get('body').then(($body) => {
      cy.xpath(adminFormControls.staticElements.notificationGrid)
        .should('include.text', `${notificationlDetails.name}`.substr(0, 9));
      if (defaultNotification) {
        cy.get(adminFormControls.miniIcons.editNotification).should('be.visible');
        cy.get(adminFormControls.miniIcons.deleteNotification).should('not.exist');
        cy.get(adminFormControls.miniIcons.notificationCloneLink).should('not.exist');
      } else
        this.checkForEditDeleteIconInNotification();
    });
  }

  public deleteIfNotificationAlreadyExistOnSameCondition(conditionName: any) {
    cy.xpath(adminFormControls.inputs.placeholderSearch).type(conditionName).wait(2000);
    cy.get('body')
      .then($body => {
        if (($body.find(adminFormControls.staticElements.tableGridRow).length > 0)) {
          if (($body.find(adminFormControls.miniIcons.deleteNotification).length > 0)) {
            cy.get(adminFormControls.miniIcons.deleteNotification).should('be.visible').click()
              .get(adminFormControls.buttons.deleteConfirm).click();
            cy.wait(5000);
          } else {
            Helpers.log(conditionName + " is System/Default notification. So, Delete Icon not present");
          }
        } else {
          Helpers.log("No Search results found");
        }
      })
    cy.xpath(adminFormControls.inputs.placeholderSearch).clear();
    cy.wait(1000);
  }

  public selectNotificationVisibilityLevel(notificationlDetails: any) {
    if (notificationlDetails.accessLevel !== 'enterprise') {
      cy.get('#' + notificationlDetails.accessLevel + '-button').click();
      cy.get('ng-select[formcontrolname=' + notificationlDetails.accessLevel + 'ID] input[aria-autocomplete="list"]').last().click();
      cy.get(adminFormControls.dropdown.selectDivloclist).click({ multiple: true, force: true });
    }
  }

  public inactiveNotification(notificationlDetails: any) {
    cy.get(adminFormControls.miniIcons.editNotification).click({ force: true }).wait(5000);
    cy.get(adminFormControls.radio.inactiveId).click({ force: true }).wait(3000);
    cy.get('body').then(($body) => {
      if ($body.find(adminFormControls.radio.checkInactiveRadioBtncheckedOrNot)) {
        Helpers.log("Inactive button is checked");
      } else {
        cy.get(adminFormControls.radio.inactiveId).click({ force: true }).wait(3000);
      }
      cy.wait(2000);
    });
    cy.get(adminFormControls.buttons.saveAndCloseButton).click().wait('@inactiveNotification').wait(2000)
      .get(adminFormControls.checkBox.showInactiveNotifications).should('be.visible').click({ force: true })
    cy.xpath(adminFormControls.staticElements.notificationGrid)
      .should('include.text', notificationlDetails.name);
    cy.xpath(adminFormControls.staticElements.notificationStatusInGrid).should('include.text', 'Inactive');
  }

  public activeNotification() {
    cy.get(adminFormControls.miniIcons.editNotification).should('be.visible').click({ force: true }).wait('@editSystemNotifications')
      .wait(4000).get(adminFormControls.radio.activeId)
      .click()
      .get(adminFormControls.buttons.saveAndCloseButton).click().wait('@inactiveNotification').wait(2000)
      //.get(adminFormControls.checkBox.showInactiveNotifications).should('be.visible').click({ force: true }).wait(2000)
      .get(adminFormControls.staticElements.emptyList).should('be.visible')
  }

  public editDefaultNotification(notificationlDetails: any) {
    cy.get(adminFormControls.miniIcons.editNotification).should('be.visible').click({ force: true }).wait(1000)
      .get(adminFormControls.inputs.typeInAddNotification).should('be.disabled')
      .get(adminFormControls.inputs.conditionInAddNotification).should('be.disabled')
      .get(adminFormControls.inputs.subjectInAddNotification).clear().type(notificationlDetails.subject).blur()
      .get(adminFormControls.buttons.saveAndCloseButton).click().wait('@addNotification')
      .get(adminFormControls.miniIcons.notificationCloneLink).should('be.visible');
    this.clickOnDeleteIconInNotificationSearchResults();
    cy.get(adminFormControls.miniIcons.notificationCloneLink).should('not.exist')
      .get(adminFormControls.miniIcons.deleteNotification).should('not.exist')
  }

  public selectSiteFilter() {
    cy.get(adminFormControls.dropdown.siteFilter, { timeout: 40000 }).click();
    cy.get(adminFormControls.dropdown.selectLocation).click({ force: true });
    cy.wait(2000);
  }

  public selectLocationFilter() {
    cy.get(adminFormControls.dropdown.locationFilterInNotification, { timeout: 40000 }).click();
    cy.get(adminFormControls.dropdown.selectLocation).click({ multiple: true, force: true });
    cy.wait(2000);
  }

  public checkForEditDeleteIconInNotification() {
    cy.get(adminFormControls.miniIcons.editNotification).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteNotification).should('be.visible');
  }

  public clickOnDeleteIconInNotificationSearchResults() {
    Helpers.log(`********Entering clickOnDeleteIconInNotificationSearchResults Method***********`);
    cy.wait(2000);
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.miniIcons.deleteNotification, { timeout: 15000 }).should('be.visible').click()
      .then(_ => {
        this.waitForSpinnerIcon();
        this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
      })
    cy.xpath(adminFormControls.buttons.deleteButtonInsideModal).should('be.visible').click({ force: true }).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteNotification').its('response.statusCode').should('eq', 200);
      cy.wait(1000);
    })
  }

  public callDeleteApi_Notification(enterpriseName: string, notificationName: string) {
    this.getNotificationId(enterpriseName, notificationName).then((_) => {
      Helpers.log(`*******************Subscription id is==>${AdminTmp.subscriptionId}`)
      cy.request('DELETE', 'api/notificationsvc/v1/subscription/' + AdminTmp.subscriptionId + '/customNotificationConfigurations/' + AdminTmp.notificationId).then(async (response) => {
        expect(response.status).to.eq(200);
      });
    });
  }

  public getSubscriptionId(enterpriseName: string) {
    let subscriptionData;
    return this.getEnterpriseID(enterpriseName).then((enterprisedate) => {
      Helpers.log(`*******************Enterprise id is==>${AdminTmp.enterpriseId}`)
      cy.request('GET', '/api/subscription-management/v1/enterprises/' + AdminTmp.enterpriseId + '/subscriptions').then(async (response) => {
        expect(response.status).to.eq(200);
        subscriptionData = response.body.find(subscription => subscription.enterpriseID === AdminTmp.enterpriseId);
        if (subscriptionData !== undefined) {
          AdminTmp.subscriptionId = subscriptionData.subID;
          cy.wrap(subscriptionData.subID).as('subscriptionId');
          Helpers.log(`*******************Subscription id is==>${AdminTmp.subscriptionId}`)
        }
      });

    });
  }



  public getNotificationId(enterpriseName: string, notificationName: string) {
    let notificationData;
    return this.getSubscriptionId(enterpriseName).then((enterprisedate) => {
      cy.request('GET', '/api/notificationsvc/v1/subscription/' + AdminTmp.subscriptionId + '/notificationConfigurations').then(async (response) => {
        expect(response.status).to.eq(200);
        notificationData = response.body.find(notification => notification.name === notificationName);
        if (notificationData !== undefined) {
          AdminTmp.notificationId = notificationData.customNotificationConfigId;
          Helpers.log(`*******************notificationId is==>${AdminTmp.notificationId}`)
        }
      });

    });
  }


  public addBusinessRuleSet(businessRuleDetails: any) {
    cy.xpath(adminFormControls.buttons.addBusinessRulesInClientSetup).click().then((_) => {
      cy.wait(500);
    });
    cy.get(adminFormControls.dropdown.typeDropdownInAddRule)
      .click()
      .type(businessRuleDetails.type)
      .get(adminFormControls.dropdown.dropdownTextList)
      .contains(businessRuleDetails.type)
      .click();
    cy.get(adminFormControls.inputs.nameField).type(businessRuleDetails.name);
    cy.get(adminFormControls.inputs.codeInAddRuleset).type(businessRuleDetails.code);
    cy.get(adminFormControls.inputs.descriptionInput).type(businessRuleDetails.description);

    cy.get('span[class="mat-checkbox-label"]').contains(businessRuleDetails.checkBox).click();
  }

  public addServiceLevelRuleSet(businessRuleDetails: any) {
    cy.get(adminFormControls.buttons.continueButton).click({ force: true });
    cy.wait(3000);
    cy.get(adminFormControls.dropdown.typeDropdownInAddRule)
      .click()
    //.type(businessRuleDetails.service)
    //.get(adminFormControls.dropdown.selectServiceDropdownText)
    //.contains(businessRuleDetails.service)
    cy.get(adminFormControls.dropdown.dropdownTextList).contains(businessRuleDetails.service)
      .click({ force: true });

    cy.get(adminFormControls.dropdown.carrierDropdownInAddRuleset)
      .click()
      .type(businessRuleDetails.carrier)
      .get(adminFormControls.dropdown.dropdownTextList)
      .contains(businessRuleDetails.carrier)
      .click();
    this.waitForSpinnerIcon();
    cy.get(adminFormControls.dropdown.serviceLevelInAddRuleset)
      .click()
      .type(businessRuleDetails.serviceLevel)
      .get(adminFormControls.dropdown.dropdownTextList)
      .contains(businessRuleDetails.serviceLevel)
      .click();
    cy.get(adminFormControls.buttons.saveAndCloseButton1).click().then(_ => {
      cy.wait('@addBusinessruleSet');
    })
  }

  public selectAccessLevelRuleSet(accessLevel: any) {
    cy.get('#accessLevel-' + accessLevel + '-input').check({ force: true }).should('be.checked');
    cy.get('#accessLevel-' + accessLevel + '-dropdown').click();
  }

  public selectDivisionBR(accessLevel: any) {
    cy.get(adminFormControls.dropdown.selectRole).first().click({ force: true });
    cy.get('#accessLevel-' + accessLevel + '-dropdown').click();
  }

  public selectLocationBR(accessLevel: any) {
    cy.get(adminFormControls.dropdown.selectLocation).first().click({ force: true });
    cy.get('#accessLevel-' + accessLevel + '-dropdown').click();
  }

  public callDeleteApi_BusinessRuleSet(enterpriseName: string, ruleName: string) {
    this.getBusinessRuleId(enterpriseName, ruleName).then((_) => {
      Helpers.log(`*******************Subscription id is==>${AdminTmp.subscriptionId}`)
      cy.request('DELETE', 'api/submeta/v1/subscriptions/' + AdminTmp.subscriptionId + '/ruleSets/' + AdminTmp.ruleSetId).then(async (response) => {
        expect(response.status).to.eq(200);
      });
    });
  }

  public getBusinessRuleId(enterpriseName: string, ruleName: string) {
    Helpers.log(`Method to get the ruleId for the rule***${ruleName}`);
    let businessRuleData;
    return this.getSubscriptionId(enterpriseName).then((enterprisedate) => {
      cy.request('GET', '/api/submeta/v1/subscriptions/' + AdminTmp.subscriptionId + '/ruleSets')
        .then(async (response) => {
          Helpers.log(`response is ${response.body}`)
          expect(response.status).to.eq(200);
          let body = JSON.parse(JSON.stringify(response));
          Helpers.log(`responsebody is ${body}`)
          let body1 = JSON.stringify(response);
          Helpers.log(`responsebody1 is ${body1}`)
          var json = JSON.parse(body1);

          for (var i = 0; i < json.COLUMNS.length; i++) {
            var date = json.COLUMNS[i].rulesets;
            Helpers.log(`data is is ${date}`)
          }
          /*businessRuleData = response.body.find(rulesets => rulesets.name === ruleName);
          Helpers.log(`businessRuleData is ${businessRuleData}`)
          if (businessRuleData !== undefined) {
            AdminTmp.ruleSetId = businessRuleData.rulesetID;
            Helpers.log(`*******************ruleSetId is==>${AdminTmp.ruleSetId}`)
          }*/
        });

    });
  }

  public verifyCreatedRulesetExist(businessRuleDetails: any) {
    this.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${businessRuleDetails.name}`);
    cy.get('body').then(($body) => {
      cy.xpath(adminFormControls.staticElements.ruleSetGrid)
        .should('include.text', `${businessRuleDetails.name}`.substr(0, 9));
      this.checkForEditDeleteIconInBusinessRuleset();
    });
  }

  public checkForEditDeleteIconInBusinessRuleset() {
    cy.get(adminFormControls.miniIcons.editRuleset).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteRuleset).should('be.visible');
  }

  public clickOnDeleteIconInRulesetSearchResults() {
    cy.get(adminFormControls.miniIcons.deleteRuleset).should('be.visible').click({ force: true })
      .then(_ => {
        this.waitForSpinnerIcon();
        this.waitForElementIsVisible(adminFormControls.buttons.deleteButtonInsideModal);
      })

    this.click(adminFormControls.buttons.deleteButtonInsideModal).then(_ => {
      this.waitForSpinnerIcon();
      cy.wait('@deleteRuleset');
      cy.wait(1000);
    })
  }

  public selectBasicSupportRole() {
    cy.get(adminFormControls.radio.basicSupportrole).click();
  }
  public selectTeamLeadSupportRole() {
    cy.xpath(adminFormControls.radio.teamLeadSupportrole).check({ force: true }).should('be.checked');
  }

  public navigateToSupportTab() {
    this.forceClick(adminFormControls.buttons.navigateToSupportTab).then(_ => {
      this.waitForSpinners();
      //this.waitForElementIsVisible(adminFormControls.buttons.clientSetupTab)
    })
    Helpers.log("Successfully navigated to Support Tab");
  }

  public verifyManageSupportUsersLinkVisible() {
    cy.get(adminFormControls.buttons.ManageSupportUsersLink).should('be.visible').click();
    cy.get(adminFormControls.buttons.addProductUserLink).should('be.visible');
  }

  public verifyManageSupportUsersLinkNotVisible() {
    helpers.waitForElementNotExist(adminFormControls.buttons.ManageSupportUsersLink);
  }

  public navigateToManageSubscriptions() {
    this.forceClick(adminFormControls.buttons.manageSubscriptions).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(adminFormControls.buttons.addCarrierInClientSetup)
    })
  }

  public selectNotificationIsolationRadioBtnInSubscriptionsPage(selectYesOrNo: any) {
    if (selectYesOrNo)
      cy.get(adminFormControls.radio.notificationIsolation_YesRadioBtn).should('be.visible').click();
    else {
      cy.get(adminFormControls.radio.notificationIsolation_NoRadioBtn).should('be.visible').click();
      cy.get('body')
        .then($body => {
          if (($body.find(adminFormControls.buttons.btn_YesInNotificationIsolationAlert).length > 0)) {
            cy.get(adminFormControls.buttons.btn_YesInNotificationIsolationAlert).should('be.visible').click()
            cy.wait(1000);
          } else {
            Helpers.log("No Alert found");
          }
        })
    }
  }

  public verifyFilterNotExistInNotificationPage(conditionToCheck: boolean) {
    if (conditionToCheck) {
      cy.get(adminFormControls.dropdown.divisionFilterInNotification).should('be.visible');
      cy.get(adminFormControls.dropdown.locationFilterInNotification).should('be.visible');
    } else {
      cy.get(adminFormControls.dropdown.divisionFilterInNotification).should('not.exist');
      cy.get(adminFormControls.dropdown.locationFilterInNotification).should('not.exist');
    }
  }

  public clickOnEditNotificationIcon() {
    cy.get(adminFormControls.miniIcons.editNotification).click();
    cy.wait(1000);
  }

  public verifyVisibilitySectionNotExistInNotificationPage(conditionToCheck: boolean) {
    if (conditionToCheck) {
      cy.get(adminFormControls.staticElements.visibilitySectionInNotification).scrollIntoView().should('be.visible');
    } else {
      cy.get(adminFormControls.staticElements.visibilitySectionInNotification).should('not.exist');
    }
    cy.get(adminFormControls.buttons.btn_CloseInNotification).click();
  }

  public verifyFieldsAreNotEditableInAdminAddUser() {
    cy.get(adminFormControls.inputs.emailInAddUser).should('have.attr', 'readonly', 'readonly');
    cy.xpath(adminFormControls.inputs.firstName).should('have.attr', 'readonly', 'readonly');
    cy.xpath(adminFormControls.inputs.lastName).should('have.attr', 'readonly', 'readonly');
    cy.get(adminFormControls.inputs.displayNameInAdminAddUser).should('have.attr', 'readonly', 'readonly');
  }

  public verifyFieldsAreNotEditableInClientSetupAddUser() {
    cy.get(adminFormControls.inputs.emailInAddUser).should('have.attr', 'readonly', 'readonly');
  }

  public clickOnCloseIcon() {
    cy.get(adminFormControls.buttons.addUserPopupCloseBtn).click();
  }
  public deleteAdminUserOnUI() {
    cy.get(adminFormControls.inputs.emailInAddUser).should('have.attr', 'readonly', 'readonly');
    cy.xpath(adminFormControls.inputs.firstName).should('have.attr', 'readonly', 'readonly');
    cy.xpath(adminFormControls.inputs.lastName).should('have.attr', 'readonly', 'readonly');
    cy.get(adminFormControls.inputs.displayNameInAdminAddUser).should('have.attr', 'readonly', 'readonly');
  }

  public validateDuplicateUserErrorMessage(email: string) {
    cy.waitForSpinners();
    cy.waitForSpinnerIcon();
    //let expectederrorMessage = format(expectedDuplicateUserCreationAlert, email);
    cy.get(adminFormControls.staticElements.duplicateCostAccountErrorModal).invoke('text').then(actualDuplicateUserErrorMessage => {
      assert.equal(expectedDuplicateUserCreationAlert, actualDuplicateUserErrorMessage, 'Verified the Error Message');
    });
    cy.get(adminFormControls.buttons.closeIconInAlertModal).click().wait(1000);
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.buttons.closeButton).click({ force: true });
  }

  public getUserIDWhileCreatingNewUser() {
    this.getDataFromSubscriptionManagementAPI().then(async (interception) => {
      userResponse = JSON.parse(JSON.stringify(interception.response.body));
      AdminTmp.userID = userResponse.userID;
      cy.wait(2000);
    });
  }

  public changeActiveToInactiveAdminUser() {
    cy.get(adminFormControls.radio.inactiveRadioBtnInEditAdminUser).scrollIntoView().should('be.visible').click();
  }

  public clickDeleteUserFromGrid() {
    cy.get(adminFormControls.buttons.deleteUserLink).click().get(adminFormControls.buttons.deleteConfirmLink).click({ force: true });
    cy.wait(2000);
  }

  public verifyIfDeleteUserPresent(personalDetails: any) {
    cy.wait(3000);
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.staticElements.tableGridRow).should('not.exist');
  }

  public addProduct(productName: any) {
    cy.get(adminFormControls.buttons.addProductsId, { timeout: 90000 }).click().wait(1000);
    cy.get(adminFormControls.buttons.productTypeId, { timeout: 90000 }).click()
      .type(productName)
      .get(adminFormControls.dropdown.dropdownText, { timeout: 90000 })
      .contains(productName)
      .click();
  }

  public enterDeviceHubProductDetails(newDeviceHub: any) {
    cy.viewport(1280, 720);
    cy.get(adminFormControls.buttons.selectLocId).should('be.visible').click()
      .get(adminFormControls.dropdown.dropdownText)
      .first().click()
      .get(adminFormControls.inputs.nameField)
      .type(newDeviceHub.name)
      .get(adminFormControls.inputs.serialNo)
      .type(newDeviceHub.deviceId)
      .get(adminFormControls.buttons.buttonSave)
      .click({ force: true })
      .wait(['@addDeviceHub']);
  }

  public checkForProductsGetAddedd() {
    //cy.get(adminFormControls.staticElements.tableGridRow).should('include.text', `${costAccountDetails.name}`);
    cy.waitForSpinnerIcon();
    cy.wait(2000);
    cy.viewport(1450, 800);
    //cy.xpath(adminFormControls.buttons.expandRow, { timeout: 40000 }).should('be.visible').click({ force: true });
    cy.xpath(adminFormControls.buttons.expandRow, { timeout: 40000 }).should('be.visible').click({ multiple: true });
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.miniIcons.editProductIcon).should('be.visible');
    cy.get(adminFormControls.miniIcons.deleteProductIcon).should('be.visible');
  }

  public deleteProduct() {
    cy.get(adminFormControls.miniIcons.deleteProductIcon).click()
      .get(adminFormControls.buttons.deleteConfirmLink).click({ force: true })
      .wait(['@deleteDeviceHub']).wait(1000);
  }

  public checkOrUncheckInactiveNotificationCheckbox() {
    cy.get(adminFormControls.checkBox.showInactiveNotifications, { timeout: 40000 }).scrollIntoView().should('be.visible').click({ force: true });
  }

  public navigateToCostAccountSideLink() {
    cy.get(adminFormControls.buttons.CostAccSideLink, { timeout: 40000 }).should('be.visible').click({ force: true });
    cy.wait(3000);
  }

  public navigateToDivLocSideLink() {
    cy.get(adminFormControls.buttons.divisionLocSideLink, { timeout: 40000 }).should('be.visible').click({ force: true });
    cy.wait(3000)
  }

  public exportCostAccount(enterpriseName: string) {
    this.getSubscriptionId(enterpriseName).then((enterprisedate) => {
      cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () { doc.location.reload() }, 5000)
        })
        cy.get(adminFormControls.buttons.costAccount_exportBtn).should('be.visible').click();

        cy.request('/api/cost-accounts/v2/subscriptions/' + AdminTmp.subscriptionId + '/costAccounts/export?requireLogFile=true&excludeIDs=false&jobConfigID=COST_ACCOUNT_EXPORT&locale=en-US&capability=all').then((response) => {
          cy.wrap(response.body.jobId).as('jobId');
        });
      });
    })
    cy.wait(3000);
  }

  public verifyExportCostAccount() {
    Helpers.log("Entering the verifyCostAccountExport method");
    cy.get('@jobId').then(id => {
      Helpers.log(`job id is ${id}`);
      cy.request('/api/cost-accounts/v2/subscriptions/' + AdminTmp.subscriptionId + '/costAccounts/jobs/' + id + '/status').then((response) => {
        let res = response.body.status;
        Helpers.log(`status is ${res}`);
        if (response.body.status !== 'Processed') {
          Helpers.log("still status is not Processed. So calling this method again");
          this.verifyExportCostAccount();
        } else {
          cy.wait(1000);
          const requestData = response.body.exportFileLocation;
          const buff = atob(requestData);
          cy.request(buff).then(data => {
            expect(data.status.toString()).includes('200');
            expect(data.body.toString().length).greaterThan(100);
            expect(data.body.toString())
              .includes("Name,AccountID,Code,ParentName,NextParentName,Description,Billable,PasswordEnabled,PasswordCode,Status");
          })
        }
      })
    });
  }

  public locationsExport(enterpriseName: string) {
    this.getSubscriptionId(enterpriseName).then(() => {
      cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () { doc.location.reload() }, 5000)
        })
        cy.get(adminFormControls.buttons.locationExportBtn).should('be.visible').click();

        cy.wait('@fieldList').then((responsee) => {
          cy.request('POST', '/api/client-management/v1/subscriptions/' + AdminTmp.subscriptionId + '/location/export?locale=en-US', responsee).then((response) => {
            cy.wrap(response.body.jobId).as('jobId');
          });
        });
      })
      cy.wait(3000);
    });
  }

  public verifyExportLocations() {
    Helpers.log("Entering the verifyLocExport method");
    cy.get('@jobId').then(id => {
      Helpers.log(`job id is ${id}`);
      cy.request('/api/client-management/v1/subscriptions/' + AdminTmp.subscriptionId + '/location/' + id + '/status').then((response) => {
        let res = response.body.status;
        Helpers.log(`status is ${res}`);
        if (response.body.status !== 'Processed') {
          Helpers.log("still status is not Processed. So calling this method again");
          cy.wait(1000);
          this.verifyExportLocations();
        } else {
          cy.wait(1000);
          const requestData = response.body.exportFileLocation;
          const buff = atob(requestData);
          cy.request(buff).then(data => {
            expect(data.status.toString()).includes('200');
            expect(data.body.toString().length).greaterThan(100);
          })
        }
      })
    });
  }

  public usersExport(enterpriseName: string) {
    this.getSubscriptionId(enterpriseName).then(() => {
      cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () { doc.location.reload() }, 5000)
        })
        cy.get(adminFormControls.buttons.exportUser).click();
        cy.request('/api/subscription-management/v1/subscriptions/' + AdminTmp.subscriptionId + '/exportUser?archive=false&jobConfigId=USER_EXPORT&locale=en-US&capability=non_sso_export').then((response) => {
          cy.wrap(response.body.jobId).as('jobId');

        });
      })
      cy.wait(3000);
    });
  }

  public verifyExportUsers() {
    Helpers.log("Entering the verifyUserExport method");
    cy.get('@jobId').then(id => {
      Helpers.log(`job id is ${id}`);
      cy.request('/api/subscription-management/v1/subscriptions/' + AdminTmp.subscriptionId + '/users/jobs/' + id + '/status').then((response) => {
        let res = response.body.status;
        Helpers.log(`status is ${res}`);
        if (response.body.status !== 'Processed') {
          Helpers.log("still status is not Processed. So calling this method again");
          this.verifyExportUsers();
        } else {
          cy.wait(1000);
          const requestData = response.body.exportFileLocation;
          const buff = atob(requestData);
          cy.request(buff).then(data => {
            expect(data.status.toString()).includes('200');
            expect(data.body.toString().length).greaterThan(100);
          })
        }
      })
    });
  }

  public clickOnCostAccRefresh() {
    for (let i = 0; i < 3; i++) {
      cy.get(adminFormControls.buttons.costAccRefreshBtn, { timeout: 10000 })
        .should('be.visible')
        .click();
      this.waitForSpinnerIcon();
    }
  }

  public downloadSampleFile_DivLoc(enterpriseName) {
    this.getSubscriptionId(enterpriseName).then(() => {
      cy.wait(4000);
      cy.get(adminFormControls.buttons.importLocation).contains('Import').click().wait(500);
      cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () { doc.location.reload() }, 5000)
        })
        cy.get(adminFormControls.buttons.downloadSampleFileLink).should('be.visible').click();
      })
      cy.request(`api/client-management/v1/location/sampleFile?jobConfigID=LOCATION_IMPORT&locale=en-US&capability=pitney_track,lockers,sending&subID=` + AdminTmp.subscriptionId).then((response) => {
        let res = response.status;
        Helpers.log(`status is ${res}`);
        expect(response.body.toString())
          .includes("DivisionID,LocationID,Customer LocationID,Name,Company,Phone,AddressLine1,AddressLine2,AddressLine3,CityTownArea,StateProvinceRegion,CountryCode,PostalCode,RCName,ReturnAddressLine1,ReturnAddressLine2,ReturnAddressLine3,ReturnCityTownArea,ReturnStateProvinceRegion,ReturnCountryCode,ReturnPostalCode,ISReturnAddressSame,ShipToBPN,Email,ReturnPhone,ReturnEmail,ReturnCompany");
      })
      cy.wait(3000);

    });
  }

  public downloadSampleFile_User() {
    cy.wait(4000);
    cy.get(adminFormControls.buttons.importUserBtn).contains('Import').click().wait(500);
    cy.window().document().then(function (doc) {
      doc.addEventListener('click', () => {
        setTimeout(function () {
          // Below is needed to fool cypress waiting for new page load
          //doc.location.href = 'about:blank';
        }, 5000);
      })
      cy.get(adminFormControls.buttons.downloadSampleFileLink).should('be.visible').click();
    })
    cy.request(`api/subscription-management/v1/fieldList?userType=normalUser`).then((response) => {
      let res = response.status;
      Helpers.log(`status is ${res}`);
      expect(response.body.toString())
        .includes("FirstName,LastName,Email,Role,Division,BPN,Location,CompanyName,Address,City,State,Country,Zip,Phone,DefaultCostAcct");
    })
    cy.get(adminFormControls.buttons.btnCancel).click();
    cy.wait(3000);
  }

  public downloadFileInsideJobStatusInUser(processingErrorOrProcessed, enterpriseName) {
    this.getSubscriptionId(enterpriseName).then(() => {
      cy.wait(4000);
      cy.get(adminFormControls.buttons.jobStatusInUsersPage).click();
      cy.wait(1000);
      cy.xpath(adminFormControls.buttons.jobIdColumnInJobStatusInUsersPage).invoke('text').then((jobIdInJobStatus) => {
        cy.wait(2000);
        cy.xpath(adminFormControls.buttons.exportFileDownloadInUserJobStatus).scrollIntoView().first().click();
        cy.wait(3000);
        cy.window().document().then(function (doc) {
          doc.addEventListener('click', () => {
            setTimeout(function () { doc.location.reload() }, 5000)
          })
          cy.get(adminFormControls.buttons.downloadBtnInsideJobStatus).click();
        })
        cy.wait(3000);
        if (processingErrorOrProcessed == 'ProcessingError') {
          cy.request(`/api/subscription-management/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=input`).then((response) => {
            const requestData = response.body.url;
            const buff = atob(requestData);
            cy.request(buff).then(data => {
              expect(data.status.toString()).includes('200');
              expect(data.body.toString().length).greaterThan(210);
              expect(data.body.toString())
                .includes("Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable,error");
            });
          });
        } else {
          cy.request(`/api/subscription-management/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=output`).then((response) => {
            const requestData = response.body.url;
            const buff = atob(requestData);
            cy.request(buff).then(data => {
              expect(data.status.toString()).includes('200');
              expect(data.body.toString().length).greaterThan(165);
              if (Cypress.env('appEnv').includes('fed') === true) {
                expect(data.body.toString()).includes("Display Name,E-Mail,First Name,Last Name,Location Name,Role,Status,BPN");
              } else if (Cypress.env('appEnv').includes('qa') === true) {
                expect(data.body.toString()).includes("Role,Status,BPN,Display Name,E-Mail,First Name,Last Name,Location Name");
              } else if (Cypress.env('appEnv').includes('ppd') === true) {
                expect(data.body.toString()).includes("E-Mail,First Name,Last Name,Location Name,Role,Status,BPN,Display Name");
              } else {
                expect(data.body.toString()).includes("Location Name,Role,Status,BPN,Display Name,E-Mail,First Name,Last Name");
              }
            });
          });
        }

      });
    });
  }

  public downloadSampleFile_CostAcc() {
    cy.wait(4000);
    //cy.get(adminFormControls.buttons.importAccountButton).should('be.visible').click();
    this.clickOnCostAccountManualImport();
    cy.window().document().then(function (doc) {
      doc.addEventListener('click', () => {
        setTimeout(function () {
          // Below is needed to fool cypress waiting for new page load
          //doc.location.href = 'about:blank';
        }, 5000);
      })
      cy.get(adminFormControls.buttons.downloadCostAccSampleFile).should('be.visible').click();
    })
    cy.request(`api/cost-accounts/v1/costAccounts/import/fieldsList?type=default`).then((response) => {
      let res = response.status;
      Helpers.log(`status is ${res}`);
      expect(response.body.toString())
        .includes("Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable");
    })
    cy.wait(3000);
    cy.get(adminFormControls.buttons.btnCancel).click();
    cy.wait(1000);
  }

  public downloadFileInsideJobStatusInCostAcc(optionToSelect, textToSearch, enterpriseName) {
    this.getSubscriptionId(enterpriseName).then(() => {
      cy.wait(4000);
      cy.get(adminFormControls.buttons.jobStatusBtnInCostAcc).click();
      cy.wait(6000);
      this.selectDrpDownInJobStatus(optionToSelect, textToSearch);
      cy.wait(1000);
      cy.get(adminFormControls.buttons.jobIdColumnInJobStatus).invoke('text').then((jobIdInJobStatus) => {
        cy.get(adminFormControls.buttons.downloadLinkInsideJobStatus_ErrorFile).first().click();
        cy.wait(3000);
        cy.window().document().then(function (doc) {
          doc.addEventListener('click', () => {
            setTimeout(function () { doc.location.reload() }, 5000)
          })
          cy.get(adminFormControls.buttons.downloadBtnInsideJobStatus).click();
        })
        cy.wait(3000);
        if (textToSearch == 'ProcessingError') {
          cy.request(`/api/cost-accounts/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=error`).then((response) => {
            const requestData = response.body.url;
            const buff = atob(requestData);
            cy.request(buff).then(data => {
              expect(data.status.toString()).includes('200');
              expect(data.body.toString().length).greaterThan(310);
              expect(data.body.toString())
                .includes("Name,Code,Description,PasswordEnabled,PasswordCode,Status,ParentName,NextParentName,Billable,error");
            });
          });
        } else {
          //api/cost-accounts/v1/jobs/eqEqmNaepDo/downloadUrl?fileType=output&subId=nK0KLqllokY
          cy.request(`/api/cost-accounts/v1/jobs/` + jobIdInJobStatus + `/downloadUrl?fileType=output&subId=` + AdminTmp.subscriptionId).then((response) => {
            const requestData = response.body.url;
            const buff = atob(requestData);
            cy.request(buff).then(data => {
              expect(data.status.toString()).includes('200');
              expect(data.body.toString().length).greaterThan(145);
              expect(data.body.toString())
                .includes("Name,AccountID,Code,ParentName,NextParentName,Description,Billable,PasswordEnabled,PasswordCode,Status");
            });
          });
        }

      });
    });
  }

  public selectDropdownInJobStatus(status, textToSearch) {
    cy.get(adminFormControls.buttons.drpdwnInsideJobStatus).click().wait(1000);
    cy.get(adminFormControls.buttons.drpdwnText).contains(status).click({ force: true }).wait(500);
    cy.get(adminFormControls.buttons.searchBarInJobStatus).click().clear().type(textToSearch).wait(5000);

  }

  public addSSOAdminUserMapping(ssoAdminEmailId) {
    this.click(adminFormControls.buttons.addSSOUserMapping).wait(1000);
    cy.get(adminFormControls.inputs.ssoEmailId).click().clear().type(ssoAdminEmailId).wait(5000);

  }

  public saveAndCloseSSOAdminMapping() {
    cy.wait(2000);
    this.click(adminFormControls.buttons.saveAndCloseInModal).then(_ => {
      cy.wait('@addSSOAdminUserMapping');
      this.waitForSpinnerIcon();
    })
  }

  public switchToSSOUserMappingTabAndVerifyGrid(ssoAdminEmailId, domainWithSSOEmail, status, roles?: string[], accessLevel?: string) {
    cy.xpath(adminFormControls.buttons.tabSSOUserMappings, { timeout: 5000 }).click({ force: true }).wait(1000);
    cy.get(adminFormControls.inputs.searchByEmailFieldInSSOUSerMappingTab, { timeout: 5000 }).click().clear().type(ssoAdminEmailId).wait(5000);
    cy.xpath(adminFormControls.buttons.searchByEmailbtn).click({ force: true });
    cy.wait('@getSSOAdminUserMapping');
    cy.wait(2000);
    cy.xpath(adminFormControls.adminUsersGrid.ssoAdminUserGrid_UID).contains(domainWithSSOEmail);
    cy.xpath(adminFormControls.adminUsersGrid.ssoAdminPlatformGrid_Status).contains(status);
    if (accessLevel) {
      cy.xpath(adminFormControls.adminUsersGrid.ssoAdminPlatformGrid_AccessLevel).contains(accessLevel);
    }
    if (roles) {
      for (var i = 0; i < roles.length; i++) {
        console.log(roles[i]);
        cy.xpath(adminFormControls.adminUsersGrid.ssoAdminPlatformGrid_Role).contains(roles[i]);
      }
    }
    this.editIconForInvited_ActiveSSOMapping(status);
  }

  public verifyDuplicateSSOAdminError(existingSSOAdminEmailId) {
    var expectedErrorMessage = format(errorMessage_DuplicateSSOAdminUser, existingSSOAdminEmailId);
    cy.get(adminFormControls.staticElements.errorModal).invoke('text').then(actualCAErrorMessage => {
      assert.equal(expectedErrorMessage, actualCAErrorMessage, 'Verified the Error Message');
    });
    cy.get(adminFormControls.buttons.btnOK).click().wait(1000);
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.buttons.adminUserMappingClosebtn).click({ force: true });
  }

  public selectClientSandboxBasic(enterprise) {
    cy.wait(2000);
    cy.get(adminFormControls.radio.basicClientSandboxRole).click();
    cy.wait(1000);
    cy.get(adminFormControls.buttons.saveAndCloseButton1).should('be.disabled');
    cy.xpath(adminFormControls.dropdown.selectEnterpriseInSandboxBasic).then(_ => {
      this.click(adminFormControls.dropdown.selectEnterpriseInSandboxBasic)
      cy.wait(2000)
        .then((_) => {
          cy.wait(500);
          cy.xpath(adminFormControls.inputs.searchEnterprisePlaceholder).scrollIntoView().click({ force: true })
            .type(enterprise, { force: true })
            .should('have.value', enterprise)
          cy.xpath(format(adminFormControls.checkBox.searchEnterpriseCheckBox, enterprise)).click({ force: true });
        });
    });
    cy.wait(500);
  }

  public verifyInvalidSSOAdminError(invitedSSOAdminEmailId) {
    var expectedErrorMessage = format(errorMessage_InvalidSSOAdminUser, invitedSSOAdminEmailId);
    cy.get(adminFormControls.staticElements.errorModal).invoke('text').then(actualCAErrorMessage => {
      assert.equal(expectedErrorMessage, actualCAErrorMessage, 'Verified the Error Message');
    });
    cy.get(adminFormControls.buttons.btnOK).click().wait(1000);
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.buttons.adminUserMappingClosebtn).click({ force: true });
  }

  public validateDomainErrorMessage() {
    cy.waitForSpinners();
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.staticElements.domainErrorMessage).invoke('text').then(actualDuplicateUserErrorMessage => {
      assert.equal(expectedDomainErrorMsg, actualDuplicateUserErrorMessage, 'Verified the Error Message');
    });
    cy.wait(1000);
    cy.get(adminFormControls.buttons.saveAndCloseButton1).should('be.disabled');
    cy.waitForSpinnerIcon();
    cy.get(adminFormControls.buttons.adminUserMappingClosebtn).click({ force: true });
  }

  public editIconForInvited_ActiveSSOMapping(invitedOrActive) {
    cy.wait(2000);
    if (invitedOrActive === 'ACTIVE') {
      cy.get(adminFormControls.buttons.editUserInAdminUserSearchPage).should('be.disabled');
    } else {
      cy.get(adminFormControls.buttons.editUserInAdminUserSearchPage).should('be.enabled');
    }
  }

  public switchToSSOUserMappingTab() {
    cy.xpath(adminFormControls.buttons.tabSSOUserMappings, { timeout: 5000 }).click({ force: true }).wait(1000);
  }
  public getDivisionAndLocationNameForSSOImport(): Promise<[string, string]> {
    let locationName = '';
    let divisionName = '';
    let foundNames = false;
    this.navigateHome();
    cy.wait(2000);

    return new Promise((resolve, reject) => {
      this.navigateToManageDivisionsAndLocations();
      cy.wait(2000);
      cy.get(adminFormControls.arrow.divisionArrow).find('i').each(($el) => {
        if (!foundNames) {
          cy.wrap($el).click();
          cy.get(adminFormControls.text.locationNameList).each(($li) => {
            if (!$li.text().toLowerCase().includes('default')) {
              locationName = $li.text();
              cy.get(adminFormControls.text.divisionNameList).each(($elem) => {
                const elementText = $elem.text();
                const divisionText = elementText.split(' (')[0];
                divisionName = divisionText.trim();
                if (locationName != '' && divisionName != '') {
                  foundNames = true;
                  resolve([locationName, divisionName]);
                  return false;
                }
              });
              return false;
            }
          });
        }
      });
    });
  }

  public getSubscriptionRoleForSSOImport(): Promise<string> {
    let roleName = '';
    this.navigateHome();
    cy.wait(2000);
    this.navigateToManageRoles();
    cy.wait(2000);
    return new Promise((resolve, reject) => {
      cy.get(adminFormControls.text.subsRoleNameList).each(($el) => {
        const eleText = $el.text().trim();
        if (!eleText.includes('ADMIN')) {
          if (!eleText.includes('Default')) {
            roleName = eleText;
            resolve(roleName);
            return false;
          }
        }
      });
    });
  }

  public getDivisionNameForSSOImport(): Promise<string> {
    let divisionName = '';
    let foundName = false;

    this.navigateHome();
    cy.wait(2000);

    return new Promise((resolve, reject) => {
      this.navigateToManageDivisionsAndLocations();
      cy.wait(2000);

      cy.get(adminFormControls.arrow.divisionArrow).find('i').each(($el) => {
        if (!foundName) {
          cy.wrap($el).click();
          cy.get(adminFormControls.text.divisionNameList).each(($elem) => {
            const elementText = $elem.text();
            const divisionText = elementText.split(' (')[0];
            divisionName = divisionText.trim();
            if (divisionName !== '') {
              foundName = true;
              resolve(divisionName);
              return false;
            }
          });
        }
      });
    });
  }

  public switchToUsersTab() {
    cy.xpath(adminFormControls.buttons.tabUsers, { timeout: 5000 }).click({ force: true }).wait(1000);
  }

  public editIconInSSOUserMappingTab() {
    cy.get(adminFormControls.buttons.editUserInAdminUserSearchPage, { timeout: 5000 }).click({ force: true }).wait(1000);
  }

  public editsaveAndCloseSSOAdminMapping() {
    cy.waitForSpinnerIcon();
    cy.wait(2000);
    this.click(adminFormControls.buttons.saveAndCloseInModal).then(_ => {
      cy.wait('@editSSOAdminUserMapping');
      this.waitForSpinnerIcon();
    })
  }

  public searchAndDeleteUserInAdminUserTab(email) {
    this.click(adminFormControls.tabToSelect.divisionsLocationsTab);
    cy.wait(2000);
    this.switchToUsersTab();
    this.type(adminFormControls.inputs.searchUser, email + '{enter}');
    cy.wait('@searchUser_ClientSetup');
    this.click(adminFormControls.buttons.deleteUserLink);
    this.click(adminFormControls.buttons.deleteConfirmLink);
    this.waitAndCloseToast();
  }

  public deleteUserIfEmailExists(email: string) {
    this.type(adminFormControls.inputs.searchUser, email + '{enter}');
    cy.wait('@searchUser_ClientSetup');
    cy.wait(3000);
    cy.get('body').then(($body) => {
      if ($body.find('.table.ng-star-inserted').length) {
        Helpers.log('User not found');
      } else if ($body.find('.p-datatable.p-component').length) {
        this.click(adminFormControls.buttons.deleteUserLink, false, 1000);
        this.click(adminFormControls.buttons.deleteConfirmLink);
        cy.wait(1000);
        this.waitAndCloseToast();
      }
    });
  }

  public selectDrpDownInJobStatus(status: string, textToSearch: string) {
    this.click(adminFormControls.dropdown.jobsHistory).wait(1000);
    this.selectDropdown(adminFormControls.dropdown.dropdownInsideJobStatus, status);
    cy.wait(500);
    this.type(adminFormControls.inputs.searchBarInJobStatus, textToSearch);
    cy.wait(5000);
  }



}


