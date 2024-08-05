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

  it(`<@platform_e2e @platform_ppd>TC001 -  Import a location`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `ImpAutoLoc${uuidGenerator()}`;
    const uniqueDivName = `ImpAutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails = {
      locName: uniqueLocName,
      locAccountNumber: uniqueBPN,
      companyName: 'PBI',
      addressLine1: '1100 1st Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'Washington',
      city: 'Seattle',
      postalCode: '98101-2906'
    };
    //cy.deleteDivisionUI();
    //cy.deleteSearchedLocIfMoreThanOne('ImpAutoLoc');
    //cy.navigateToCostAccountOnSamePage();
    //cy.navigateToDivisionLocationOnSamePage();
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();
    cy.createDataForImportFile('src/fixtures/adminconsole/testData/locations/location-import.csv', locationDetails);
    cy.importLocation('adminconsole/testData/locations/location-import.csv');
    cy.navigateToCostAccountOnSamePage();
    cy.navigateToDivisionLocationOnSamePage();
    cy.searchLocations(locationDetails);
    cy.deleteLocationDivision();
  });

  it(`<@platform_e2e @platform_ppd>TC002 - Verify Import location with BPN exceeding 15 character length should get failed and Error file should displayed`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueLocName = `ImpAutoLoc${uuidGenerator()}`;
    const uniqueDivName = `ImpAutoDiv${uuidGenerator()}`;
    const uniqueBPN = `${uuidGenerator()}`;
    const locationDetails = {
      locName: uniqueLocName,
      locAccountNumber: 1234567890123456,
      companyName: 'PBI',
      addressLine1: '1100 1st Ave',
      email: uniqueLocName + '@mailinator.com',
      phone: '2034561234',
      state: 'Washington',
      city: 'Seattle',
      postalCode: '98101-2906'
    };
    cy.deleteDivisionUI();
    cy.deleteSearchedLocIfMoreThanOne('ImpAutoLoc');
    cy.addNewDivision(uniqueDivName);
    cy.getDivisionId();
    cy.createDataForImportFile('src/fixtures/adminconsole/testData/locations/location-import.csv', locationDetails);
    cy.importLocation('adminconsole/testData/locations/location-import.csv');
    cy.verifyDownloadFailedRecordsFileAlert();
    //cy.searchLocations(locationDetails);
    cy.callDeleteDivisionApi();
  });

  it(`<@promote_qa @platform_e2e @platform_ppd> Export location`, function () {
    cy.exportLocation();
    cy.verifyLocationExport();
  });
});
