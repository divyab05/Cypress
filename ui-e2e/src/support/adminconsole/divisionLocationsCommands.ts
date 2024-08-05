import { formControls } from '../../fixtures/adminconsole/formControls.json';
import { format } from 'util';
import { Helpers } from '../helpers';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    //create .d.ts definitions file to get autocomplete.
    interface Chainable<Subject> {
      navigateToDivisionLocationOnSamePage(): void;
      navigateToDivLocPage(): void;
      addNewDivision(uniqueName: any): void;
      addNewDivisionWithId(uniqueName: any): void;
      setDivisionId(): void;
      deleteDivisionUI(): void;
      searchLocations(locationDetails: any): void;
      deleteSearchedLocPresentIfMoreThanOne(locationDetails: any): void;
      addNewLocation(locationDetails: any, uniqueDivName: any): void;
      createNewLocation(locationDetails: any, uniqueDivName: any): void;
      clickOnSaveLocationWithoutAPI(): void;
      verifyLocationAddedInGrid(uniqueName: any): void;
      importLocation(filePath: string): void;
      exportLocation(): void;
      verifyExportLocation(): void;
      createDataForImportFile(filePath: string, locdetail: any): void;
      callDeleteDivisionApi(): void;
      deleteLocationDivision(): void;
      verifyDeleteDivisionApi(): void;
      verifyAccNumberAndCountryNotEditableInEditLoc(): void;
      verifyDeleteDivisionAlertModal(uniqueDivName: any): void;
      verifyUseSameAddressForReturns(locationDetails: any, uniqueDivName: any, returnLocationDetails: any): void;
      deleteDivisionAndValidateErrorMessage(divisionName: string): void;
      addDivisionIdAPI(): any;
      getDivisionId(): any;
      deleteSearchedLocIfMoreThanOne(textToSearch: string);
      getJobIdForExport(): void;
      verifyLocationExport(): any;
      downloadSampleFile_DivLoc(): void;
      getEnterpriseId(): void;
      getSubId(): any;
      getUserId(): any;
      callDeleteDivisionApi1(): any;
      verifyDuplicateBpnErrorMessage(bpnNumber: string): void;
      verifyBPNExceeding15CharAlert(): void;
      verifyDownloadFailedRecordsFileAlert(): void;

    }
  }
}

export var subId = null;
export var enterprise_Id = null;
export var userId = null;
export var division_id = null;
export let expectedDivisionLinkedErrorMessage = " division can't be deleted because this division linked with locations.";
export let expectedDuplicateBPNAlertMessage = "Invalid request: Location with BPN [%s] already exists";


Cypress.Commands.add('navigateToDivLocPage', () => {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.get(formControls.settingsMenuItems).should('be.visible').click({ force: true });
  cy.get(formControls.divLocLink).contains('Divisions and Locations').click({ force: true }).wait(5000);
});

Cypress.Commands.add('navigateToDivisionLocationOnSamePage', () => {
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.divisionLocLink).click().wait(1000);
  cy.waitForSpinnerIcon();
  cy.waitForSpinners().wait(5000);//Added this wait as Div & Loc Page taking time to get load manaully too
});

Cypress.Commands.add('addNewDivision', (uniqueName: any) => {
  cy.get(formControls.addDivisionBtn).click().get(formControls.divisionNameTxtBox)
    .focus().clear().type(uniqueName).get(formControls.savenCloseBtn)
    .click();
  cy.waitForSpinnerIcon();
  cy.get(formControls.importToastTitle, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.importToastTitle, { timeout: 30000 })
    .contains('Success')
    .get(formControls.importToastMessage, { timeout: 30000 })
    .contains('Division created successfully');
  cy.get(formControls.importToastTitle, { timeout: 90000 }).should('have.length', 0);

});

Cypress.Commands.add('addNewDivisionWithId', (divisionDetails: any) => {
  cy.get(formControls.addDivisionBtn)
    .click()
    .get(formControls.divisionCustomIdChkBox)
    .should('not.be.visible')
    .check({ force: true })
    .should('be.checked')
    .get(formControls.divisionIdTxtBox)
    .focus()
    .clear()
    .type(divisionDetails.divCustomId)
    .get(formControls.divisionNameTxtBox)
    .focus()
    .clear()
    .type(divisionDetails.divName)
    .get(formControls.savenCloseBtn)
    .click();
});

Cypress.Commands.add('setDivisionId', () => {
  cy.wait('@createDivision').then(async (interception) => {
    const res = JSON.parse(JSON.stringify(interception.response.body));
    return division_id = res.divisionID;
  });
});

Cypress.Commands.add('addNewLocation', (locationDetails: any, uniqueDivName: any) => {
  cy.createNewLocation(locationDetails, uniqueDivName);
  cy.get(formControls.locationSaveBtn)
    .click()
    .wait('@createLocation').its('response.statusCode').should('eq', 201);
  cy.wait(2000);
});

Cypress.Commands.add('clickOnSaveLocationWithoutAPI', () => {
  cy.get(formControls.locationSaveBtn)
    .click();
  cy.wait(2000);
});

Cypress.Commands.add('createNewLocation', (locationDetails: any, uniqueDivName: any) => {
  cy.get(formControls.addLocationBtn).click()
    .get(formControls.locationNameTxtBox).should('be.visible').clear().type(locationDetails.locName)
    .get(formControls.locationAddDivisionDrpDown).scrollIntoView().click({ force: true })
    .get(formControls.divisionDropdownInAddLocation, { timeout: 5000 }).should('be.visible').clear()
    .type(uniqueDivName)
    .get(formControls.dropDownText).contains(uniqueDivName).click()
    .get(formControls.locationAccountNumber).clear()
    .type(locationDetails.locAccountNumber)
    .get(formControls.companyName)
    .clear()
    .type(locationDetails.companyName)
    .get(formControls.addressLine1)
    .clear()
    .type(locationDetails.addressLine1)
    .get(formControls.email)
    .clear()
    .type(locationDetails.email)
    .get(formControls.phone)
    .clear()
    .type(locationDetails.phone)
    .get(formControls.state)
    .select(locationDetails.state)
    .get(formControls.city)
    .clear()
    .type(locationDetails.city)
    .get(formControls.postalCode)
    .clear()
    .type(locationDetails.postalCode)

});

Cypress.Commands.add('searchLocations', function (locationDetails: any) {
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.locationSearchTxtBox, { timeout: 8000 }).clear().wait(2000).type(locationDetails.locName).wait(`@getLocations`);
  cy.waitForSpinnerIcon();
  cy.wait(9000);
  cy.waitForSpinnerIcon();
  cy.waitForSpinners();
});

Cypress.Commands.add('deleteSearchedLocPresentIfMoreThanOne', (locationDetails: any) => {
  Helpers.log("***********Entering the method to delete more than one cost accounts present***************");
  cy.waitForSpinners();
  cy.waitForSpinnerIcon();
  cy.searchLocations(locationDetails);
  cy.get('body').then(($body) => {
    Helpers.log("***********Checked that No result found Text not displayed***************");
    cy.get(formControls.tableGridRow, { timeout: 40000 }).each((item, index, list) => {
      cy.wait(3000);
      cy.get(formControls.locationDeleteBtn, { timeout: 9000 }).click()
        .get(formControls.deleteModalConfirmBtn, { timeout: 9000 }).click({ force: true }).wait('@deleteLocation').its('response.statusCode').should('eq', 200);
      //cy.get(formControls.locationSearchTxtBox, { timeout: 9000 }).click().clear();
      cy.waitForSpinnerIcon();
      cy.get(formControls.importToastTitle, { timeout: 30000 }).should('be.visible');
      cy.get(formControls.importToastTitle, { timeout: 30000 })
        .contains('Success')
        .get(formControls.importToastMessage, { timeout: 30000 })
        .contains('Location deleted successfully');
      cy.get(formControls.importToastTitle, { timeout: 90000 }).should('have.length', 0);
    });
  });
  //cy.get(formControls.searchBox).click().clear();
});

Cypress.Commands.add('verifyLocationAddedInGrid', (uniqueName: any) => {
  cy.waitForSpinnerIcon();
  cy.wait(2000);
  cy.get(formControls.tableGridRow)
    .should('include.text', uniqueName);
});

Cypress.Commands.add('createDataForImportFile', (filePath: string, locdetail: any) => {
  generateImportFileForLocation(filePath, locdetail);
});

Cypress.Commands.add('importLocation', (filePath) => {
  cy.get(formControls.locationImportBtn)
    .contains('Import')
    .click()
    .wait(500)
    .get(formControls.importFileInput)
    .attachFile(filePath);
  cy.get(formControls.continueBtn).click()
    .wait('@importLocation1')
    .wait('@importLocation2');
  cy.get(formControls.importBtn, { timeout: 8000 }).click().wait('@importLocation3');
  cy.wait(5000);
  cy.get(formControls.closeBtn, { timeout: 6000 }).click();
  cy.wait(10000);
});

Cypress.Commands.add('verifyExportLocation', () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('downloads', downloadsFolder).then((before) => {
    // do the download
    cy.window()
      .document()
      .then(function (doc) {
        doc.addEventListener('click', () => {
          setTimeout(function () {
            doc.location.href = 'about:blank';
          }, 5000);
        });
        /* Make sure the file exists */
        cy.intercept('/', (req) => {
          req.reply((res) => {
            expect(res.statusCode).to.equal(200);
          });
        });
      });

    cy.task('downloads', downloadsFolder).then((after) => {
      expect(after.length).to.be.eq(before.length + 1);
    });
  });
});

Cypress.Commands.add('deleteLocationDivision', () => {
  cy.wait(3000);
  cy.get(formControls.locationDeleteBtn, { timeout: 9000 }).click()
    .get(formControls.deleteModalConfirmBtn, { timeout: 9000 }).click({ force: true }).wait('@deleteLocation').its('response.statusCode').should('eq', 200);
  cy.get(formControls.locationSearchTxtBox, { timeout: 9000 }).click().clear();
  cy.waitForSpinnerIcon();
  cy.get(formControls.importToastTitle, { timeout: 30000 }).should('be.visible');
  cy.get(formControls.importToastTitle, { timeout: 30000 })
    .contains('Success')
    .get(formControls.importToastMessage, { timeout: 30000 })
    .contains('Location deleted successfully');
  cy.get(formControls.importToastTitle, { timeout: 90000 }).should('have.length', 0);
  cy.callDeleteDivisionApi();
});

Cypress.Commands.add('deleteSearchedLocIfMoreThanOne', (textToSearch: string) => {
  cy.wait(2000);
  cy.get(formControls.searchBox).click().clear().type(textToSearch).wait(2000).should('have.length', 1);
  cy.get('body').then(($body) => {
    if ($body.find(formControls.tableGridRow).length) {
      cy.get(formControls.tableGridRow).each((item, index, list) => {
        cy.deleteLocationDivision();
      });
    } else {
      Helpers.log("Searched Location is not present")
    }
  });
  cy.get(formControls.searchBox).click().clear();
});

Cypress.Commands.add('verifyDeleteDivisionApi', () => {
  cy.callDeleteDivisionApi();
  cy.wait(1000);
});

Cypress.Commands.add('callDeleteDivisionApi', () => {
  cy.get('@divisionID').then((divId) => {
    cy.get('@XSRFToken').then((token) => {
      Helpers.log(`*******************Division id is==>${divId}`);
      cy.request({
        method: "DELETE",
        url: `api/client-management/v1/divisions/${divId}`,
        failOnStatusCode: true,
        retryOnNetworkFailure: true,
        headers: token
      })
    });
  });
});

Cypress.Commands.add('addDivisionIdAPI', () => {
  return cy.wait('@createDivision').then(function (response) {
    return response;
  });
});

Cypress.Commands.add('getDivisionId', () => {
  cy.addDivisionIdAPI().then(async (interception) => {
    const res = JSON.parse(JSON.stringify(interception.response.body));
    division_id = res.divisionID;
    cy.wrap(res.divisionID).as('divisionID');
    Helpers.log(`**********************division_id is =>${division_id}*****************`);
  });
});


function generateImportFileForLocation(filePath: string, locdetail: any) {
  cy.get('@divisionID').then(divID => {
    cy.writeFile(filePath, 'DivisionID,LocationID,Name,Company,Phone,AddressLine1,AddressLine2,AddressLine3,City,State,CountryCode,PostalCode,RCName,ReturnAddressLine1,ReturnAddressLine2,ReturnAddressLine3,ReturnCity,ReturnState,ReturnCountryCode,ReturnPostalCode,ISReturnAddressSame,ShipToBPN,CostAccountsEnabled,CostAccountRequiredForMailingLabel,CostAccountRequiredForShippingLabel,Email,ReturnPhone,ReturnEmail,ReturnCompany\n');
    cy.writeFile(filePath, divID + ',' + '' + ',' + locdetail.locName + ',' + locdetail.companyName + ',' + locdetail.phone + ',' + locdetail.addressLine1 + ',' + 'Test,' + 'Test,' + locdetail.city + ',' + locdetail.state + ',' + 'US,' + locdetail.postalCode + ',' + 'rc test,' + '144-154 W Lawrence St,' + 'Test,' + 'Test,' + 'Albany,' + 'NY,' + 'US,' + '12180,' + 'FALSE,' + locdetail.locAccountNumber + ',' + 'TRUE,' + 'TRUE,' + 'TRUE,' + ',' + ',' + ',\n', {
      flag: 'a+'
    });
  });
}

Cypress.Commands.add('verifyAccNumberAndCountryNotEditableInEditLoc', () => {
  cy.get(formControls.locationEditBtn).click();
  cy.get(formControls.locationAccountNumber).should('not.have.attr', 'readonly', 'readonly');
  cy.get(formControls.countryDropdownInEditLocation).should('be.disabled');
  cy.get(formControls.closeButton).click({ force: true });
});

Cypress.Commands.add('verifyDeleteDivisionAlertModal', (uniqueDivName: any) => {
  cy.get(formControls.locationSearchTxtBox).clear().wait(2000);
  cy.xpath(format(formControls.divisionDeleteIcon, uniqueDivName)).click();
  cy.wait(1000);
  cy.get(formControls.alertDialogInDivAndLocPage).should('be.visible')
    .contains(uniqueDivName + " division can't be deleted because this division linked with locations.");
  cy.get(formControls.closeButtonInDivandLocAlert).click();
  cy.wait(2000);
  cy.waitForSpinners();
});

Cypress.Commands.add('verifyUseSameAddressForReturns', (locationDetails: any, uniqueDivName: any, returnLocationDetails: any) => {
  cy.get(formControls.addLocationBtn).click()
    .get(formControls.locationNameTxtBox).should('be.visible').clear().type(locationDetails.locName)
    .get(formControls.locationAddDivisionDrpDown).scrollIntoView().click({ force: true })
    .get(formControls.divisionDropdownInAddLocation, { timeout: 5000 }).should('be.visible').clear().type(uniqueDivName)
    .get(formControls.dropDownText).contains(uniqueDivName).click().get(formControls.locationAccountNumber).clear()
    .type(locationDetails.locAccountNumber).get(formControls.companyName).clear().type(locationDetails.companyName)
    .get(formControls.addressLine1).clear().type(locationDetails.addressLine1)
    .get(formControls.email).clear().type(locationDetails.email)
    .get(formControls.phone).clear().type(locationDetails.phone)
    .get(formControls.state).select(locationDetails.state).get(formControls.city).clear().type(locationDetails.city)
    .get(formControls.postalCode).clear().type(locationDetails.postalCode);
  cy.wait(1000);
  cy.get(formControls.chkbox_Usesameaddressforreturns).scrollIntoView().should('be.visible').click();
  cy.get(formControls.nameInReturnLocation).scrollIntoView().should('be.visible').clear().type(returnLocationDetails.locName);
  cy.get(formControls.companyInReturnLocation).clear().type(returnLocationDetails.companyName);
  cy.get(formControls.addressLine1InReturnLocation).clear().type(returnLocationDetails.addressLine1);
  cy.xpath(formControls.stateInReturnLocation).focus().select(returnLocationDetails.state);
  cy.get(formControls.cityInreturnlocation).clear().type(returnLocationDetails.city)
  cy.get(formControls.postalCodeInreturnlocation).clear().type(returnLocationDetails.postalCode)
  cy.get(formControls.locationSaveBtn).click()
});

Cypress.Commands.add('deleteDivisionAndValidateErrorMessage', (divisionName: string) => {
  cy.xpath(format(formControls.deleteDivisionAndValidateErrorModal, divisionName)).scrollIntoView().click();
  cy.get(formControls.duplicateCostAccountErrorModal, { timeout: 9000 }).invoke('text').then(actualCAErrorMessage => {
    expect(actualCAErrorMessage.trim()).to.be.eq(divisionName + expectedDivisionLinkedErrorMessage);
  });
  cy.get(formControls.deleteConfirm, { timeout: 9000 }).click().wait(1000);

});

Cypress.Commands.add('deleteDivisionUI', () => {
  cy.wait(2000);
  cy.get('body').then(($body) => {
    if ($body.find(formControls.tableGridRow).length < 0) {
      Helpers.log("No Division is present")
    } else {
      cy.get(formControls.deleteDivisionIcon2).each((item, index, list) => {
        cy.wait(2000);
        Helpers.log(`index is ${index}`);
        Helpers.log(`list is ${list.length}`);
        let v = list.length;
        cy.get(format(formControls.deleteDivisionIcon1, (v - index))).click({ force: true }).wait(1000)
          .get("button[id='close-2'] span span").invoke('text').then((text) => {
            Helpers.log(text);
            if (text.includes('OK')) {
              cy.get(formControls.closeButtonInDivandLocAlert).click();
              cy.wait(2000);
            } else {
              cy.get(formControls.deleteConfirm).click({ force: true }).wait('@deleteDivision')
              cy.wait(2000);
            }
          });
      });
    }
  });
});

Cypress.Commands.add('exportLocation', () => {
  cy.get('@XSRFToken').then((token) => {
    cy.window().document().then(function (doc) {
      doc.addEventListener('click', () => {
        setTimeout(function () { doc.location.reload() }, 5000)
      })
      cy.get(formControls.locationExportBtn).should('be.visible').click();
      cy.wait('@fieldList').then(function (responsee) {
        Helpers.log("Entering the exportLocation method")
        cy.request({
          method: "POST",
          url: `/api/client-management/v1/location/export?locale=en-US`,
          failOnStatusCode: false,
          retryOnNetworkFailure: true,
          headers: token,
          body: {
            responsee
          }
        }).then(async (response) => {
          expect(response.status).to.eq(200);
          cy.wrap(response.body.jobId).as('jobId');
        })
      });
    });
  });
  cy.wait(3000);
});

Cypress.Commands.add('verifyLocationExport', () => {
  Helpers.log("Entering the verifyLocExport method");
  cy.get('@jobId').then(id => {
    Helpers.log(`job id is ${id}`);
    cy.request(`/api/client-management/v1/location/${id}/status`).then((response) => {
      let res = response.body.status;
      Helpers.log(`status is ${res}`);
      if (response.body.status !== 'Processed') {
        Helpers.log("still status is not Processed. So calling this method again");
        cy.wait(1000);
        cy.verifyLocationExport();
      } else {
        cy.wait(1000);
        const requestData = response.body.exportFileLocation;
        const buff = atob(requestData);
        cy.request(buff).then(data => {
          expect(data.status.toString()).includes('200');
          expect(data.body.toString().length).greaterThan(392);
        })
      }
    })
  });
});

Cypress.Commands.add('downloadSampleFile_DivLoc', () => {
  cy.wait(4000);
  cy.get(formControls.locationImportBtn).should('be.visible').click();
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () { doc.location.reload() }, 5000)
    })
    cy.get(formControls.downloadCostAccSampleFile).should('be.visible').click();
  })
  cy.request(`api/client-management/v1/location/sampleFile?jobConfigID=LOCATION_IMPORT&locale=en-US&capability=pitney_track,lockers,sending`).then((response) => {
    let res = response.status;
    Helpers.log(`status is ${res}`);
    expect(response.body.toString())
      .includes("DivisionID,LocationID,Customer LocationID,Name,Company,Phone,AddressLine1,AddressLine2,AddressLine3,CityTownArea,StateProvinceRegion,CountryCode,PostalCode,RCName,ReturnAddressLine1,ReturnAddressLine2,ReturnAddressLine3,ReturnCityTownArea,ReturnStateProvinceRegion,ReturnCountryCode,ReturnPostalCode,ISReturnAddressSame,ShipToBPN,Email,ReturnPhone,ReturnEmail,ReturnCompany");
  })
  cy.wait(3000);
});

Cypress.Commands.add('callDeleteDivisionApi1', () => {
  cy.get('@XSRFToken').then((token) => {
    cy.getSubId().then((_) => {
      cy.getUserId().then((_) => {
        cy.request(`api/client-management/v1/subscriptions/` + subId + `/users/` + userId + `/divisions?skip=0&limit=50`).then((response) => {
          let res = response.status;
          Helpers.log(`status is ${res}`);
          var test = response.body.pageInfo.totalCount;
          let count = parseInt(test);
          Helpers.log(`count1 is ${test}`)
          Helpers.log(`count2 is ${count}`)

          for (let i = 0; i < 50; i++) {
            if (response.body.divisions[i].locations[i]) {

            } else {
              const responseData = response.body.divisions[i].divisionID;
              Helpers.log(`responseData is ${responseData}`);

              Helpers.log(`*******************Division id is==>${responseData}`);
              cy.request({
                method: "DELETE",
                url: `api/client-management/v1/divisions/${responseData}`,
                failOnStatusCode: true,
                retryOnNetworkFailure: true,
                headers: token
              })
            }


          }
        })
      });
      cy.wait(3000);
    });
  });
});

Cypress.Commands.add('getUserId', () => {
  cy.request('GET', 'api/subscription-management/v1/userProperties').then(async (response) => {
    const responseData = response.body[0].userID;
    userId = responseData;
  });
});

Cypress.Commands.add('getSubId', () => {
  cy.request('GET', 'api/subscription-management/v1/userProperties').then(async (response) => {
    const responseData = response.body[0].subID;
    subId = responseData;
  });
});

Cypress.Commands.add('getEnterpriseId', () => {
  cy.getSubId();
  cy.request('GET', 'api/subscription-management/v1/subscriptions/' + subId).then(async (response) => {
    const responseData = response.body.enterpriseID;
    enterprise_Id = responseData;
    Helpers.log(enterprise_Id)
  });
});

Cypress.Commands.add('verifyDuplicateBpnErrorMessage', (bpnNumber: string) => {
  cy.get(formControls.alertTitle).invoke('text').then((actualText) => {
    assert.equal("Alert", actualText.trim(), 'Verified that Duplicate BPN ALert modal header title');
  });
  cy.get(formControls.alertMessage).invoke('text').then((actualText) => {
    let expectederrorMessage = format(expectedDuplicateBPNAlertMessage, bpnNumber);
    Helpers.log(`actual is ${actualText}`);
    Helpers.log(`expected is ${expectederrorMessage}`);
    assert.equal(expectederrorMessage, actualText.trim(), 'Verified that Duplicate BPN ALert modal header title');
  });
  cy.get(formControls.alertConfirm).click().wait(500);
  cy.get(formControls.closeButton).click({ force: true });
});

Cypress.Commands.add('verifyBPNExceeding15CharAlert', () => {
  cy.get(formControls.bpnExceedingLengthAlert).invoke('text').then(actualBPNErrorMessage => {
    expect(actualBPNErrorMessage.trim()).to.be.eq('Account Number should be max 15 characters long.');
  });
  cy.get(formControls.closeButton).click({ force: true });
});

Cypress.Commands.add('verifyDownloadFailedRecordsFileAlert', () => {
  cy.get(formControls.alertDialogInDivAndLocPage).invoke('text').then(actualErrorMessage => {
    expect(actualErrorMessage.trim()).to.be.eq('Are you sure you want to download failed records file?');
  });
  cy.get(formControls.cancelButtonInAlert).click({ force: true });
});
