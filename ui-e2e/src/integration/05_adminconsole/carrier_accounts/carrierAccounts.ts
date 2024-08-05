///<reference types="cypress" />
import { interceptsCarrierAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';

describe.skip('Test Suite :: Carrier Accounts', () => {
  beforeEach(() => {
    if (Cypress.env('appEnv').includes('fed') === true) {
      cy.getUsers().then((users) => {
        const { username, password } = users.noTrackingPlanUser;
        adminConsoleHelpers.loginViaUrl(username, password);
      });
    } else {
      cy.getUsers().then((users) => {
        const { username, password } = users.clientAdminUser;
        adminConsoleHelpers.loginViaUrl(username, password);
      });
    }
    cy.navigateToCostAccountPage();
    interceptsCarrierAccountApiCalls();
    cy.navigateToCarrierAccounts();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  const upsCarrierDetails = {
    accountNumber: '06xv25',
    gcsPartnerID: "516285970",
    nickname: "UPS",
    fullName: "Mara Graham",
    streetAddress1: "37 EXECUTIVE DR",
    city: "Danbury",
    state: "Connecticut",
    isoCountry: "US",
    postalCode: "06810",
    phoneNumber: "2037963166",
    email: "mara.graham@pb.com",
    companyName: "Pitney Bowes"
  };

  const fedExCarrierDetails = {
    accountNumber: '630001609',
    gcsPartnerID: "516285970",
    nickname: "FedEx",
    fullName: "Mara Graham",
    streetAddress1: "1100 S STATE ROAD 7 STE 103",
    city: "Margate",
    state: "Florida",
    isoCountry: "US",
    postalCode: "33068",
    phoneNumber: "2037963166",
    email: "mara.graham@pb.com",
    companyName: "Pitney Bowes"
  };

  it.skip('Add UPS Carrier account', function () {
    cy.checkIfCarrierAlreadyAdded(upsCarrierDetails.nickname);
    cy.clickAddCarrier();
    cy.addUPSCarrier(upsCarrierDetails);
    cy.searchCarrier(upsCarrierDetails.nickname);
    cy.verifyUPSCarrierAdded();
    cy.deleteCarrier();
  });

  it.skip('Add FedEx Carrier account', function () {
    // cy.checkIfCarrierAlreadyAdded(upsCarrierDetails.nickname);
    cy.clickAddCarrier();
    cy.addFedExCarrier(fedExCarrierDetails);
    cy.searchCarrier(fedExCarrierDetails.nickname);
    cy.verifyFedExCarrierAdded();
    cy.deleteCarrier();
  });

});
