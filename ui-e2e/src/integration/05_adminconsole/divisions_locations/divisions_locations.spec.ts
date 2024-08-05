///<reference types="cypress" />
import { interceptsDivisionLocationApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe('Test Suite :: Divisions and Locations', () => {
  beforeEach(() => {
    cy.getUsers().then((users) => {
      const { username, password } = users.clientAdminUser;
      adminConsoleHelpers.loginViaUrl(username, password);
    });
    cy.navigateToDivLocPage();
    interceptsDivisionLocationApiCalls();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it('<@promote_qa @platform_e2e @platform_ppd>TC001 - Add new location', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `AutoLoc${uuidGenerator()}`;
    const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();
    cy.addNewLocation(locationDetails, uniqueDivName);
    cy.navigateToCostAccountOnSamePage();
    cy.navigateToDivisionLocationOnSamePage();
    cy.searchLocations(locationDetails);
    cy.verifyLocationAddedInGrid(locationDetails.locName);
    cy.deleteLocationDivision();
  });

  it('<@platform_e2e @platform_ppd>TC002 -  Add new division with custom id', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const divName = `01AutoDiv${uuidGenerator()}`;
    const divCustomId = `01AutoId${uuidGenerator()}`;
    const divisionDetails = {
      divName: divName,
      divCustomId: divCustomId,
    };
    cy.addNewDivisionWithId(divisionDetails);
    cy.getDivisionId();
    cy.verifyDeleteDivisionApi();
  });

  it('<@platform_e2e @platform_ppd>TC003 - Verify DIVISION, ACCOUNT NUMBER and COUNTRY should not editable and validate the alert popup when deleting the  division which contains location', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `AutoLoc${uuidGenerator()}`;
    const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };

    //cy.deleteSearchedLocPresentIfMoreThanOne(locationDetails1);
    cy.deleteSearchedLocIfMoreThanOne('autoloc');
    cy.deleteDivisionUI();
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();
    cy.addNewLocation(locationDetails, uniqueDivName);
    cy.searchLocations(locationDetails);
    cy.verifyLocationAddedInGrid(locationDetails.locName);
    cy.verifyAccNumberAndCountryNotEditableInEditLoc();
    cy.verifyDeleteDivisionAlertModal(uniqueDivName);
    cy.searchLocations(locationDetails);
    cy.verifyLocationAddedInGrid(locationDetails.locName);
    cy.deleteLocationDivision();
  });

  it('<@platform_e2e @platform_ppd>TC004 - Verify Add return address while adding location and validate in the Grid', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `AutoLoc${uuidGenerator()}`;
    const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    const returnLocationDetails = {
      locName: 'returnLoc' + uniqueLocName,
      companyName: 'returnLoc PBI',
      addressLine1: '44 Nostalgia Ave',
      email: 'returnLoc' + uniqueLocName + '@mailinator.com',
      phone: '2034500001',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-00001'
    };
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();
    cy.verifyUseSameAddressForReturns(locationDetails, uniqueDivName, returnLocationDetails);
    cy.searchLocations(locationDetails);
    cy.verifyLocationAddedInGrid(locationDetails.locName);
    cy.verifyLocationAddedInGrid(locationDetails.postalCode);
    cy.verifyLocationAddedInGrid(returnLocationDetails.postalCode);
    cy.deleteLocationDivision();
  });

  it('<@platform_e2e>TC005 - Validate the message while deleting the Division which has locations.', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `AutoLoc${uuidGenerator()}`;
    const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();
    cy.addNewLocation(locationDetails, uniqueDivName);
    cy.deleteDivisionAndValidateErrorMessage(uniqueDivName);
    cy.searchLocations(locationDetails);
    cy.verifyLocationAddedInGrid(locationDetails.locName);
    cy.deleteLocationDivision();
  });

  it('<@platform_e2e>TC006 - Verify existing Locations BPN should not be used for new locations created under same division and same enterprise and TC007 - Verify Alert message if BPN field exceeded 15 character length', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `AutoLoc${uuidGenerator()}`;
    const uniqueLocName2 = `AutoLoc2${uuidGenerator()}`;
    const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails1 = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };

    const bpnExceeding15CharSize = {
      locName: uniqueLocName,
      locAccountNumber: "12345678910111213",
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    const locationDetails2 = {
      locName: uniqueLocName2,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName2 + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();

    cy.createNewLocation(bpnExceeding15CharSize, uniqueDivName);
    cy.verifyBPNExceeding15CharAlert();

    cy.addNewLocation(locationDetails1, uniqueDivName);
    cy.searchLocations(locationDetails1);
    cy.verifyLocationAddedInGrid(locationDetails1.locName);

    cy.createNewLocation(locationDetails2, uniqueDivName);
    cy.clickOnSaveLocationWithoutAPI();
    cy.verifyDuplicateBpnErrorMessage(uniqueBPN);
    cy.deleteLocationDivision();
  });

  it('<@platform_e2e>TC008 - Verify existing Locations BPN under Division1 should not be used for new locations created under Division2 within same enterprise', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `AutoLoc${uuidGenerator()}`;
    const uniqueLocName2 = `AutoLoc2${uuidGenerator()}`;
    const uniqueDivName1 = `01AutoDiv${uuidGenerator()}`;
    const uniqueDivName2 = `02AutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails1 = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    const locationDetails2 = {
      locName: uniqueLocName2,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '44 Nostalgia Ave',
      email: uniqueLocName2 + '@mailinator.com',
      phone: '2034561234',
      state: 'California',
      city: 'Patterson',
      postalCode: '95363-8348'
    };
    cy.addNewDivision(uniqueDivName1);
    cy.getDivisionId();
    cy.addNewLocation(locationDetails1, uniqueDivName1);
    cy.searchLocations(locationDetails1);
    cy.verifyLocationAddedInGrid(locationDetails1.locName);

    cy.addNewDivision(uniqueDivName2);
    cy.getDivisionId();
    cy.createNewLocation(locationDetails2, uniqueDivName2);
    cy.clickOnSaveLocationWithoutAPI();
    cy.verifyDuplicateBpnErrorMessage(uniqueBPN);
    cy.deleteLocationDivision();
  });
});
