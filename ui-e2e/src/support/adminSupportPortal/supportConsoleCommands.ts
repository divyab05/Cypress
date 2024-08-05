import { Helpers } from '../helpers';
import { supportFormControls } from '../../fixtures/adminSupportPortal/supportFormControls.json'
import { format } from 'util';
import { AdminSupportTmp } from './adminSupportTemp';

export class SupportConsoleCommands extends Helpers {

  public static BASIC_USER: string = 'basic';
  public static ADVANCED_USER: string = 'advanced';
  public static CARRIERACCOUNTS: string = 'Carrier Accounts';
  public static COSTACCOUNTS: string = 'Cost Accounts';
  public static USERS: string = 'Users';
  public static PRODUCTS: string = 'Products';
  public static ROLES: string = 'Roles'

  public navigateToSupportTab() {
    this.forceClick(supportFormControls.buttons.navigateToSupportTab).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(supportFormControls.buttons.clientSetupTab)
    })
    Helpers.log("Successfully navigated to Support Tab");
  }

  public searchByEmailID(emailID: any) {
    this.sendText(supportFormControls.inputs.searchText, emailID);
    this.click(supportFormControls.buttons.searchBtn);
  }

  public verifysearchByEmailID(emailID: any) {
    cy.xpath(supportFormControls.inputs.personalInfoEmail).invoke('attr', 'placeholder')
      .then(placeHolderText => {
        Helpers.log(`Text fetched from the UI is ${placeHolderText}`);
        expect(emailID).to.be.eq(placeHolderText);
        Helpers.log(`Actual Text: ${placeHolderText}`);
        Helpers.log(`Expected Text: ${emailID}`);
      });
  }

  public verifysearchByOktaID(oktaID: any) {
    cy.xpath(supportFormControls.inputs.personalInfoOktaId).invoke('attr', 'placeholder')
      .then(placeHolderText => {
        Helpers.log(`Text fetched from the UI is ${placeHolderText}`);
        expect(oktaID).to.be.eq(placeHolderText);
        Helpers.log(`Actual Text: ${placeHolderText}`);
        Helpers.log(`Expected Text: ${oktaID}`);
      })
  }

  public verifysearchByBPNSubsc(BPN_Accountnumber: any) {
    cy.get(supportFormControls.inputs.bpnAccountNumber).invoke('attr', 'placeholder')
      .then(placeHolderText => {
        Helpers.log(`Text fetched from the UI is ${placeHolderText}`);
        expect(placeHolderText).includes(BPN_Accountnumber);
        Helpers.log(`Actual Text: ${placeHolderText}`);
        Helpers.log(`Expected Text: ${BPN_Accountnumber}`);
      });
  }

  public searchBy(searchByType: any, searcData: any) {
    //this.findAndSelectOption(supportFormControls.dropdown.searchByDropDown, searchByType);
    this.click(supportFormControls.dropdown.searchByDropDown);
    this.click(supportFormControls.buttons.userIdSearchBy);
    this.sendText(supportFormControls.inputs.searchText, searcData);
    this.click(supportFormControls.buttons.searchBtn);
    cy.wait(5000)
  }

  public clickSendingTab() {
    this.click(supportFormControls.buttons.sendingTab).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(supportFormControls.buttons.shipmentsTab)
    })
  }

  public clickSendingReportsTab(tabName: any) {
    this.click(`//*[contains(@id, 'ngb-nav') and text()='${tabName}']`);
    this.waitForSpinners();
  }

  public verifyStampTransaction(stampSheetName: any) {
    cy.xpath(`//*[contains(@id, 'toggle')]`).first().click({ multiple: true });
    this.getText(supportFormControls.text.stampTexts).then(text => {
      expect(text).includes(stampSheetName);
    });
  }

  public verifyMultiStampTransaction(stampSheetName: any) {
    this.getText(supportFormControls.text.spoilTexts).then(text => {
      expect(text).includes('Multiple');
    });
    cy.xpath(`//*[contains(@id, 'toggle')]`).first().click({ multiple: true });
    this.getText(supportFormControls.text.stampTexts).then(text => {
      expect(text).includes(stampSheetName);
    });
  }

  public spoilStampTransaction() {
    cy.xpath(`//*[contains(@id, 'toggle')]`).first().click({ multiple: true });
    this.click(supportFormControls.buttons.spoilStampBtn);
    cy.get(supportFormControls.buttons.selectSpoilCheckBox)
      .check({ force: true })
      .should('be.checked');
    this.click(supportFormControls.buttons.refundCloseBtn);
    cy.wait('@spoilageApi').should((xhr) => {
      const spoilTransaction = xhr.request.body.orgTrxID
      Helpers.log(`getSpoilTransaction ->${spoilTransaction}`);
      this.clickSendingReportsTab('Spoiled Postage');
      cy.wait(2000);
      this.getText(supportFormControls.text.spoilTexts).then(text => {
        expect(text).includes(spoilTransaction);
      });
    })
  }

  public spoilMultiStampTransaction() {
    cy.xpath(`//*[contains(@id, 'toggle')]`).first().click({ multiple: true });
    this.click(supportFormControls.buttons.spoilStampBtn);
    cy.get(supportFormControls.buttons.selectSpoilCheckBox).should('have.length', 3)
    cy.get(supportFormControls.buttons.selectSpoilCheckBox).should('not.be.visible')
      .check({ force: true })
      .should('be.checked');
    this.click(supportFormControls.buttons.refundCloseBtn);
    cy.wait('@spoilageApi').should((xhr) => {
      const spoilTransaction = xhr.request.body.orgTrxID
      Helpers.log(`getSpoilTransaction ->${spoilTransaction}`);
      this.clickSendingReportsTab('Spoiled Postage');
      cy.wait(2000);
      this.getText(supportFormControls.text.spoilTexts).then(text => {
        expect(text).includes(spoilTransaction);
      });
    })
  }

  public spoilPostageAPICall() {
    cy.wait('@spoilageApi').should((xhr) => {
      const body = xhr.request.body.orgTrxID
      Helpers.log(`getrequestBody ->${body}`);
    })

  }
  public generatePostageValue() {
    var min = Math.ceil(11);
    var max = Math.floor(99);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public verifyPostageTransaction(postageAmount) {
    this.getText(supportFormControls.text.reportTexts).then(text => {
      expect(text).includes('$' + postageAmount);
    });
  }

  public verifyShipmentTransaction(mailClass: any) {
    cy.wait('@getLabelTransaction');
    if (Cypress.env('appEnv').includes('fed') === true) {
      cy.xpath(`//*[contains(@title, 'Toggle Row')]`).first().click({ multiple: true });
    } else {
      cy.xpath(`//*[contains(@id, 'toggle-ship')]`).first().click({ multiple: true });
    }
    this.getText(supportFormControls.text.reportTexts).then(text => {
      expect(text).includes(mailClass);
    });
  }

  public submitRefund() {
    this.click(supportFormControls.buttons.refundShipmentBtn);
    this.click(supportFormControls.buttons.refundYesBtn);
    cy.get(supportFormControls.text.toastTitle, { timeout: 30000 })
      .contains('Success')
    cy.wait(3000);
    cy.xpath(supportFormControls.buttons.refundShipmentBtn).should('not.exist');
  }

  public verifyProofOfDeliveryTransaction(trackingId: any) {
    cy.xpath(`//*[contains(@id, 'toggle-proof')]`).first().click({ multiple: true });
    this.getText(supportFormControls.text.proofDeliveryText).then(text => {
      expect(text).includes(trackingId);
    });
  }

  public verifyFraudAlertTabIsVisibleOrNot() {
    cy.xpath(supportFormControls.buttons.fraudAlertsTab).should('not.exist');
  }

  public editAndSaveTrustScore(trustScore: number, comments: string) {
    cy.get(supportFormControls.buttons.editTrustScoreIcon).click().then(_ => {
      this.waitForSpinners();
      cy.get(supportFormControls.text.trustScoreInDropDown).invoke('text').then((text) => {
        AdminSupportTmp.oldTrustScore = text.replace(/\D/g, '');
      });
      cy.get(supportFormControls.dropdown.trustScoreDropDown).should('be.visible').click();
      cy.get(supportFormControls.text.trustScoreDropdownText).contains(trustScore).click();
      cy.get(supportFormControls.text.trustScoreInDropDown).contains(trustScore);
      cy.get(supportFormControls.inputs.commentsInputField).click().type(comments);
      cy.get(supportFormControls.buttons.updateAndCloseButton).click().wait('@editTrustScore');
    })
    Helpers.log("Successfully edited the trust score in Fraud Alerts Tab");
  }

  public selectSearchByDropdown(searchByType: string, searchData: any) {
    //this.findAndSelectOption(supportFormControls.dropdown.searchByDropDown, searchByType);
    cy.xpath(supportFormControls.dropdown.searchByDropDown).click();
    cy.xpath(format(supportFormControls.dropdown.searchByDropDownList, searchByType)).click();
    if (searchByType === 'Enterprise Name') {
      this.selectEnterpriseValueInDropdown(searchData);
    } else {
      this.sendText(supportFormControls.inputs.searchText, searchData);
    }

    if (searchByType === 'SSO User') {
      cy.get(supportFormControls.buttons.searchButtonCSS).click({ force: true });
      cy.wait(3000);
    } else {
      cy.get(supportFormControls.buttons.searchButtonCSS).click();
      cy.wait(2000);
    }

  }

  public selectEnterpriseValueInDropdown(enterpriseName: string) {
    cy.get(supportFormControls.dropdown.enterpriseDropdown).type(enterpriseName);
    cy.get(supportFormControls.dropdown.dropdownList).contains(enterpriseName).click();
  }

  public verifyEditTrustScoreIconForBasic() {
    cy.get(supportFormControls.buttons.editTrustScoreIcon).should('not.exist');
  }

  public verifyTrustScoreInHistory(oldTrustScore: number, newTrustScore: number) {
    cy.get(supportFormControls.buttons.historyTrustScoreIcon).click({ force: true }).then(_ => {
      this.waitForSpinners();
      cy.get(supportFormControls.text.oldTrustScoreScore).contains(oldTrustScore);
      cy.get(supportFormControls.text.newTrustScore).contains(newTrustScore);
    })
    Helpers.log("Successfully verified the trust score in the History Tab");
  }

  public navigateToClientSetupTab() {
    this.forceClick(supportFormControls.buttons.clientSetupTab).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(supportFormControls.buttons.divisionAndLocationTab);
    })
    Helpers.log("Successfully navigated to Client Setup Tab");
  }

  public verifyDivisionAndLocationForSupportUsers(type: string) {
    cy.get(supportFormControls.buttons.expandDivision).click();
    cy.wait(2000);
    switch (type) {
      case 'basic':
        cy.get(supportFormControls.buttons.editLocationIcon).should('not.exist');
        break;
      case 'advanced':
        cy.get(supportFormControls.buttons.editLocationIcon).scrollIntoView().should('be.visible');
        break;
    }

  }

  public verifySpoilStampVisibleOrNot() {
    cy.xpath(`//*[contains(@id, 'toggle')]`).first().click({ multiple: true });
    cy.wait(1000);
    this.waitForElementNotExist(supportFormControls.buttons.spoilStampBtn);
    Helpers.log("Successfully verified that Spoil Stamp button is not visible in the UI")
  }

  public verifyRefunButtonVisibleOrNot() {
    cy.xpath(supportFormControls.buttons.refundShipmentBtn).should('not.exist');
    cy.wait(300);
    Helpers.log("Successfully verified that Refund button is not visible in the UI")
  }

  public verifyTrackingBtnDisabled() {
    cy.xpath(supportFormControls.buttons.trackingBtn).should('not.exist');
  }

  public searchCarrierAccountsExist(carrierName: any) {
    this.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, carrierName);
    cy.get('body').then(($body) => {
      cy.get(supportFormControls.staticElements.tableGridRow).should('include.text', carrierName);
    });
  }

  public searchCostAccountsExist(costName: any) {
    this.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, costName);
    cy.get('body').then(($body) => {
      cy.get(supportFormControls.staticElements.tableGridRow).should('include.text', costName.substr(0, 10));
      Helpers.log("Successfully Searched the Cost Acocunt")
    });
  }

  public searchUsersExist(costName: any) {
    this.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, costName);
    cy.get('body').then(($body) => {
      cy.get(supportFormControls.staticElements.tableGridRow).should('include.text', costName.substr(0, 14));
      Helpers.log("Successfully Searched the Users")
    });
  }

  public searchRolesExist(roleName: any) {
    this.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, roleName);
    cy.get('body').then(($body) => {
      cy.get(supportFormControls.staticElements.tableGridRow).should('include.text', roleName);
      Helpers.log("Successfully Searched the Roles")
    });
  }

  public selectSubtabUnderClientSetup(tabName: string) {
    this.forceClick(format(supportFormControls.buttons.subTabInClientSetup, tabName)).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(supportFormControls.inputs.placeholderSearch)
    });
    Helpers.log(`Successfully navigated to SubTab ==>${tabName}`);
  }

  public verifySearchByEnterpriseName() {
    cy.get(supportFormControls.dropdown.usersDropdown).invoke('text').then((text) => {
      Helpers.log(`Text fetched from the UI is ${text}`);
      cy.xpath(supportFormControls.inputs.personalInfoEmail).invoke('attr', 'placeholder')
        .then(placeHolderText => {
          Helpers.log(`Text fetched from the UI is ${placeHolderText}`);
          expect(text).includes(placeHolderText);
          Helpers.log(`Actual Text: ${placeHolderText}`);
          Helpers.log(`Expected Text: ${text}`);
        });
    });
  }

  public getSubCarrierId(carrierName: string) {
    let subCarrierData;
    cy.request('GET', '/api/carrier-management/v1/subCarriers').then(async (response) => {
      expect(response.status).to.eq(200);
      subCarrierData = response.body.find(subCarrier => subCarrier.description === carrierName);
      if (subCarrierData !== undefined) {
        let subscriptionId = subCarrierData.subCarrierID;
        Helpers.log(`*******************Subscription id is==>${subscriptionId}`)
      }
    });
  }

  public verifySendingSubTabNotPresentInUI(tabName: string) {
    cy.xpath(`//*[contains(@id, 'ngb-nav') and text()='${tabName}']`).should('not.exist');
    this.waitForSpinners();
  }

  public clickManageUsers() {
    this.forceClick(supportFormControls.buttons.ManageSupportUsersLink).then(_ => {
      this.waitForSpinners();
      this.waitForElementIsVisible(supportFormControls.buttons.addProductUserLink)
    })
  }

  public typeFirstNameLastNameAndEmail(firstName: string, lastName: string, email: string) {
    this.sendText(supportFormControls.inputs.firstName, firstName);
    this.sendText(supportFormControls.inputs.lastName, lastName);
    this.sendText(supportFormControls.inputs.email, email);
  }

  public addProductSupportUser() {
    cy.xpath(supportFormControls.buttons.addProductUserLink).click();
  }

  public selectBasicSupportRole() {
    cy.get(supportFormControls.radio.basicRole).click();
  }

  public selectTeamLeadSupportRole() {
    cy.get(supportFormControls.radio.teamLeadRole).click();
  }

  public clickSaveAndClose() {
    cy.get(supportFormControls.buttons.saveCloseBtn).click();
    cy.wait('@addSupportUser');
  }

  public sendTextAndConfirm(selector: string, text: string) {
    Helpers.log(selector);
    return cy.xpath(selector).should('exist', { timeout: 9000 }).then(_ => {
      cy.xpath(selector).focus().clear().type(String(text)).type('{enter}').then(_ => {
        this.waitForSpinners();
      });
    });
  }

  public deleteSupportUser() {
    cy.get(supportFormControls.buttons.deleteUser).click();
    cy.xpath(supportFormControls.buttons.deleteConfirmButton).click();
  }

}
