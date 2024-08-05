///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsAddDivisionLocation } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';
import { AdminApi } from "../../../support/adminPortal/adminApi";

describe('Test Suite :: Admin User - Add Division and Location', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();
    const enterprise = 'Plan Definition Automation';
    const doorKeeper = new DoorKeeperOnboarding();

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsSelectEnterprise();
        interceptsAddDivisionLocation();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC001 - Add Division`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueLocName = `AutoLoc${uuidGenerator()}`;
        const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
        const locationDetails = {
            locName: uniqueLocName,
            locAccountNumber: '0010516769',
            companyName: 'PBI',
            addressLine1: '44 Nostalgia Ave',
            email: uniqueLocName + '@mailinator.com',
            phone: '2034561234',
            state: 'California',
            city: 'Patterson',
            postalCode: '95363-8348'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageDivisionsAndLocations();
        adminCommands.addDivision(uniqueDivName);
        adminCommands.getDivisionIdFromAPI();
        cy.get('@divisionID').then(divisionID => {
        new AdminApi(user).deleteDivisionViaAPI(divisionID.toString());
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC002 - Add Location`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueLocName = `AutoLoc${uuidGenerator()}`;
        const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
        const locationDetails = {
            locName: uniqueLocName,
            locAccountNumber: '0010516768',
            companyName: 'PBI',
            addressLine1: '44 Nostalgia Ave',
            email: uniqueLocName + '@mailinator.com',
            phone: '2034561234',
            state: 'California',
            city: 'Patterson',
            postalCode: '95363-8348'
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageDivisionsAndLocations();
        adminCommands.addDivision(uniqueDivName);
        adminCommands.getDivisionIdFromAPI();
        adminCommands.addLocation(locationDetails, uniqueDivName);
        adminCommands.verifyCreatedLocationExist(locationDetails)
        adminCommands.clickOnDeleteIconInLocationSearchResults();
        cy.wait(1000);
        cy.get('@divisionID').then(divisionID => {
          new AdminApi(user).deleteDivisionViaAPI(divisionID.toString());
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC003 - Import Location`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueLocName = `AutoLoc${uuidGenerator()}`;
        const uniqueDivName = `01AutoDiv${uuidGenerator()}`;
        const locationDetails = {
            locName: uniqueLocName,
            locAccountNumber: '0010566829',
            companyName: 'PBI',
            addressLine1: '1100 1st Ave',
            email: uniqueLocName + '@mailinator.com',
            phone: '2034561234',
            state: 'Washington',
            city: 'Seattle',
            postalCode: '98101-2906'
        };

        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageDivisionsAndLocations();
        adminCommands.addDivision(uniqueDivName);
        adminCommands.createDataForImportFile('src/fixtures/adminPortal/testData/locations/location-import.csv', locationDetails);
        adminCommands.importLocation('adminPortal/testData/locations/location-import.csv');
        adminCommands.navigateToCostAccountSideLink();
        adminCommands.navigateToDivLocSideLink();
        adminCommands.verifyCreatedLocationExist(locationDetails)
        adminCommands.clickOnDeleteIconInLocationSearchResults();
        cy.wait(1000);
        cy.get('@divisionID').then(divisionID => {
          new AdminApi(user).deleteDivisionViaAPI(divisionID.toString());
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC004 - Export Location`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageDivisionsAndLocations();
        new AdminApi(user).locationsExport(enterprise.toString());
        adminCommands.verifyExportLocations();
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC005 - Download the Sample file in Division and Locations Page`, function () {
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageDivisionsAndLocations();
        adminCommands.downloadSampleFile_DivLoc(enterprise);
    });
});
