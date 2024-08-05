///<reference types="cypress" />
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../../../support/helpers';
import { interceptsCarrierAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';

describe('Test Suite :: User Management', () => {

  beforeEach(() => {
    cy.getUsers().then((users) => {

      if (Cypress.env('appEnv').includes('fed-qa') === true) {
        const { username, password } = users.locationAdminUse_UserPersona;
        adminConsoleHelpers.loginViaUrl(username, password);
      }
      else {
        const { username, password } = users.locationAdminUser;
        adminConsoleHelpers.loginCC(username, password);
      }
    });
    interceptsUserManagementApiCalls();
    cy.navigateToUserManagementPage();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it('<@promote_qa @platform_e2e>TC001 -  Location Admin - Add new user with User access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psuser' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    cy.clickAddUser();
    cy.addPersonalDetails(personalDetails, 'user');
    cy.selectRole();
    cy.selectLocation();
    cy.clickSaveBtn();
    cy.callAccountClaimAPI(personalDetails);
    cy.searchUser(personalDetails);
    cy.verifyUserDetailsInGrid('INVITED', 'User');
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyUserAccessValidation();
    }
    //cy.verifyDeleteUser();We will fix this later once we find the solution for USER ACCESS LEVEL.
    if (!flag)
      cy.logoutUser();
  });

  it('<@platform_e2e>TC002 - Location Admin - Add new user with Location access level', function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `CNUULAuto2${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'psloc' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };

    cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "LocationLevelUserAccess" }).then((rows) => {
      let rowLength: number = rows.length;
      Helpers.log(` Row length is ${rowLength}`);

      //Fetch Division column Values from Excel and storing it in the "division" Array
      const division = rows[0]["Division To Display"].split("|");
      division.forEach(element => {
        Helpers.log(`Division value fetched from Excel ==> ${element}`)
      });

      //Fetch Location column Values from Excel and storing it in the "location" Array
      const location = rows[0]["Location To Display"].split("|");
      location.forEach(element => {
        Helpers.log(`Location fetched from Excel ==> ${element}`)
      });

      //Fetch Location column Values from Excel and storing it in the "locationInCostAccountSettings" Array
      const locationInCostAccountSettings = rows[0]["Locations Inside the Cost Account Settings"].split("|");
      locationInCostAccountSettings.forEach(element => {
        Helpers.log(`Locations Inside the Cost Account Settings fetched from Excel ==> ${element}`)
      });

      //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
      const costAccount = rows[0]["Cost Account To Display"].split("|");
      costAccount.forEach(element => {
        Helpers.log(`Cost Account fetched from Excel ==> ${element}`);
      });
      cy.deleteSearchedUserIfMoreThanOne('CNUULAuto2');
      cy.clickAddUser();
      cy.addPersonalDetails(personalDetails, 'location');
      cy.selectRole();
      cy.selectAdminLocation();
      //Select the Location from the dropdown
      cy.get(formControls.selectLocationDropdown).click({ force: true });
      cy.get(formControls.selectLocationDropdown).click()
      cy.selectLocation();
      cy.clickSaveBtn();
      cy.callAccountClaimAPI(personalDetails);
      cy.searchUser(personalDetails);
      cy.verifyUserDetailsInGrid('INVITED', 'Locations');

      cy.navigateToDivisionLocationOnSamePage();
      cy.wait(2000);

      //Expand all the Rows in Division and Location Page
      cy.get("tr:nth-child(1) a[aria-label='Expand row']").should('be.visible').click({ force: true });
      //Veirfying the Locations present in Division and Location page should match with Excel data
      cy.get("td[class='td-name']").each((item, index, list) => {
        cy.wait(1000);
        let actualLocText = Cypress.$(item).text().trim();
        cy.log("Actual Text of Location iIn Division and Location Page is", actualLocText);
        expect(location[index]).to.include(actualLocText)
      });

      cy.wait(500);
      cy.get("tr:nth-child(3) a[aria-label='Expand row']").click({ force: true });
      //Veirfying the Locations present in Division and Location page should match with Excel data
      cy.get("td[class='td-name']").each((item, index, list) => {
        cy.wait(1000);
        let actualLocText = Cypress.$(item).text().trim();
        cy.log("Actual Text of Location iIn Division and Location Page is", actualLocText);
        expect(location[index]).to.include(actualLocText)
      });

      /*//Veirfying the Locations present in Cost Account Settings dropdown should match with Excel data
      cy.navigateToCostAccountOnSamePage();
      cy.clickOnSettingsButtonInCostAccount();
      cy.get(formControls.dropdownInCostAccountSettings).click();
      cy.get(formControls.dropDownText)
        .each((item, index, list) => {
          let actualLocInCostAccSettings = Cypress.$(item).text().trim();
          cy.log("Actual Text of Location inside the settings dropdown is", actualLocInCostAccSettings);
          expect(locationInCostAccountSettings).to.include(actualLocInCostAccSettings)
        });
      cy.get(formControls.closeButton).should('be.visible').click().wait(1000);*/

      //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
      //Commented the cost account code becuase text is appeneded wit 3 dots at the edn in the UI. So, 
      //once get confirmation from developer, then will start fix this code.
      cy.navigateToCostAccountOnSamePage();
      cy.get('td[class="td-name ng-star-inserted"] div b')
        .each((item, index, list) => {
          let actualTextOfCostAccount = Cypress.$(item).text();
          cy.log("Actual Text of Cost Account is", actualTextOfCostAccount);
          expect(costAccount).to.include(actualTextOfCostAccount);
        });

      const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
      if (!flag) {
        cy.logoutUser();
        adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
        cy.verifyLocationAccessValidation();
        cy.wait(2000)

        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[1]["Location To Display"].split("|");
        location.forEach(element => {
          Helpers.log(`Location fetched from Excel ==> ${element}`)
        });

        cy.navigateToDivisionLocationOnSamePage();
        //Expand all the Rows in Division and Location Page
        cy.get("a[aria-label='Expand row']").each((item, index, list) => {
          cy.get("a[aria-label='Expand row']").click();
        });

        cy.wait(1000);

        //Veirfying the Locations present in Division and Location page should match with Excel data
        cy.get("td[class='td-name']").each((item, index, list) => {
          let actualLocText = Cypress.$(item).text().trim();
          cy.log("Actual Text of Location iIn Division and Location Page is", actualLocText);
          expect(location).to.include(actualLocText)
        });

        //Fetch Location column Values from Excel and storing it in the "locationInCostAccountSettings" Array
        const locationInCostAccountSettings = rows[1]["Locations Inside the Cost Account Settings"].split("|");
        locationInCostAccountSettings.forEach(element => {
          Helpers.log(`Locations Inside the Cost Account Settings fetched from Excel ==> ${element}`)
        });

        /*//Veirfying the Locations present in Cost Account Settings dropdown should match with Excel data
        cy.navigateToCostAccountOnSamePage();
        cy.clickOnSettingsButtonInCostAccount();
        cy.get(formControls.dropdownInCostAccountSettings).click();
        cy.get(formControls.dropDownText)
          .each((item, index, list) => {
            let actualLocInCostAccSettings = Cypress.$(item).text().trim();
            cy.log("Actual Text of Location inside the settings dropdown is", actualLocInCostAccSettings);
            expect(locationInCostAccountSettings).to.include(actualLocInCostAccSettings)
          });*/
      }
      //cy.verifyDeleteUser();
      cy.log("test case is over");
      cy.wait(6000);
      if (!flag)
        cy.logoutUser();
    });
  });

  it('<@platform_e2e>TC003 - Location Admin - Validate Division,Location in Add Carrier Page',
    function () {
      cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "LocationLevelUserAccess" }).then((rows) => {
        let rowLength: number = rows.length;
        Helpers.log(` Row length is ${rowLength}`);

        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[0]["Location To Display"].split("|");
        location.forEach(element => {
          Helpers.log(`Location fetched from Excel ==> ${element}`)
        });

        //Fetch Location column Values from Excel and storing it in the "locationInCostAccountSettings" Array
        const locationInAddCarrier = rows[0]["Locations Inside the Add Carrier"].split("|");
        locationInAddCarrier.forEach(element => {
          Helpers.log(`Locations Inside the Add Carriers fetched from Excel ==> ${element}`)
        });

        //Fetch Location column Values from Excel and storing it in the "locationInCostAccountSettings" Array
        const locationInAddRuleSet = rows[0]["Locations Inside the Add Ruleset"].split("|");
        locationInAddRuleSet.forEach(element => {
          Helpers.log(`Locations Inside the Add Ruleset fetched from Excel ==> ${element}`)
        });


        const fedExCarrierDetails = {
          nickname: "FedEx",
        };

        interceptsCarrierAccountApiCalls();
        cy.navigateToCarrierAccounts();
        cy.clickAddCarrier();
        cy.get(formControls.carrierNameTxtBox).should('be.visible').type(fedExCarrierDetails.nickname).blur()
          .get(formControls.carrierSelectDropDwn).click().get(formControls.dropDownText)
          .contains('FedEx').click()

        cy.get(formControls.carrierLocationRadioButton).click();
        cy.wait(1000);
        cy.get(formControls.selectLocationDropdown).click();
        cy.get(formControls.carrierLocationDropdownOptions)
          .each((item, index, list) => {
            let actualLocationTextInDropdown = Cypress.$(item).text().trim();
            cy.log("Actual Text of location inside the dropdown is", actualLocationTextInDropdown);
            expect(locationInAddCarrier).to.include(actualLocationTextInDropdown)
          });

        cy.get(formControls.closeButton).click();

        cy.navigateToBusinessRulesPage();
        cy.get(formControls.AddRuleSetBtn).click();
        cy.selectAccessLevelRuleSet("location");
        cy.get(formControls.selectLocation)
          .each((item, index, list) => {
            let actualLocationTextInAddRulesetDropdown = Cypress.$(item).text().trim();
            cy.log("Actual Text of location inside the dropdown is", actualLocationTextInAddRulesetDropdown);
            expect(locationInAddRuleSet).to.include(actualLocationTextInAddRulesetDropdown)
          });

      });
    });

});
