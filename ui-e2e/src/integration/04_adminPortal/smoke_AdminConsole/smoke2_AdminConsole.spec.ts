///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsNotification, interceptsAddDivisionLocation } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';
import { AdminApi } from "../../../support/adminPortal/adminApi";

describe('Admin Console - Smoke2', () => {

  const user = config[Cypress.env('appEnv')]['admin_user'];
  const adminCommands = new AdminCommands();
  const helpers = new Helpers();
  const doorKeeper = new DoorKeeperOnboarding();
  const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it(`<@smoke><@prod_sanity>TC005 - Add Location`, function () {
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
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    adminCommands.navigateToClientSetupTab();
    interceptsAddDivisionLocation();
    adminCommands.navigateToClientSetupTab();
    const enterprise = 'Plan Definition Automation';
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

  it(`<@smoke><@prod_sanity>TC006 - Import Location`, function () {
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
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    adminCommands.navigateToClientSetupTab();
    interceptsAddDivisionLocation();
    adminCommands.navigateToClientSetupTab();
    const enterprise = 'Plan Definition Automation';
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    adminCommands.navigateToManageDivisionsAndLocations();
    adminCommands.addDivision(uniqueDivName);
    adminCommands.createDataForImportFile('src/fixtures/adminPortal/testData/locations/location-import.csv', locationDetails);
    adminCommands.importLocation('adminPortal/testData/locations/location-import.csv');
    adminCommands.verifyCreatedLocationExist(locationDetails)
    adminCommands.clickOnDeleteIconInLocationSearchResults();
    cy.wait(1000);
    cy.get('@divisionID').then(divisionID => {
      new AdminApi(user).deleteDivisionViaAPI(divisionID.toString());
    });
  });

  it(`<@smoke><@prod_sanity>TC001 - Add, Search and Delete Notification - Enterprise`, function () {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    adminCommands.navigateToClientSetupTab();
    interceptsNotification();
    adminCommands.navigateToClientSetupTab();
    let enterprise;
    const flag: boolean = Cypress.env('appEnv').includes('prod');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      enterprise = 'Notification Automation Enterprise';
    } else {
      enterprise = 'Platform Testing';
    }
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    adminCommands.navigateToManageNotificationsAndTemplates();
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
    adminCommands.selectLocationFilter();
    adminCommands.deleteIfNotificationAlreadyExistOnSameCondition('EntCustNoti');
    adminCommands.addNotification(notificationlDetails);
    adminCommands.verifyCreatedNotificationExist(notificationlDetails);
    adminCommands.clickOnDeleteIconInNotificationSearchResults();
  });

});
