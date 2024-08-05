///<reference types="cypress" />
import { Helpers } from '../../../support/helpers';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';
import { format } from 'util';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsCarrierAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';

describe('Test Suite :: Admin User - Add User', () => {

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    if (Cypress.env('appEnv').includes('fed') === true) {
      cy.getUsers().then((users) => {
        const { username, password } = users.enterpriseAdminUser_UserPersona;
        adminConsoleHelpers.loginViaUrl(username, password);
      });
    } else {
      cy.getUsers().then((users) => {
        const { username, password } = users.enterpriseAdminUser;
        adminConsoleHelpers.loginCC(username, password);
      });
    }
    cy.navigateToUserManagementPage();
    interceptsUserManagementApiCalls();

  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it('<@platform_e2e>TC001 -  Validate the Division, Location, Cost Account drop down options - Division Level Access', () => {

    cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "DivisionLevelAccess" }).then((rows) => {
      let rowLength: number = rows.length;
      Helpers.log(` Row length is ${rowLength}`)
      cy.clickAddUser();
      cy.selectRole();

      for (let rowCount = 0; rowCount < rowLength; rowCount++) {

        Helpers.log(`Iteration ${rowCount} starts`);

        //Fetch Division column Values from Excel and storing it in the "division" Array
        const division = rows[rowCount]["Division"].split("|");
        division.forEach(element => {
          Helpers.log(`Division value fetched from Excel ==> ${element}`)
        });

        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[rowCount]["Location"].split("|");
        location.forEach(element => {
          Helpers.log(`Location fetched from Excel ==> ${element}`)
        });

        //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
        const costAccount = rows[rowCount]["Cost Account"].split("|");
        costAccount.forEach(element => {
          Helpers.log(`Cost Account fetched from Excel ==> ${element}`);
        });

        cy.get('#' + 'division' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        //Click on Division Drop down
        cy.get(formControls.selectDivisionDrpDown).click();

        for (let i = 0; i < division.length; i++) {
          Helpers.log(`Division fetching from excel is ${division[i]}`);
          cy.xpath(format("//*/li/span[contains(text(), '%s')]", division[i])).click({ force: true });//This will check the specific Division
        }

        cy.get(formControls.selectDivisionDrpDown).click();
        //Select the Location from the dropdown
        cy.get(formControls.selectLocationDropdown).click();

        const locationToDisplay = rows[rowCount]["Location to Display"].split("|");
        locationToDisplay.forEach(element => {
          Helpers.log(`LocationToDisplay fetched from Excel ==> ${element}`);
        });

        //Checking the locations displayed in the dropdown should match with the Excel data
        cy.get("div[role='option'] div").each((item, index, list) => {
          const actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Location Option in UI ==> ${actualText}`)
          Helpers.log(`Expected Text of Location Option ==> ${locationToDisplay[index]}`)
          expect(locationToDisplay).to.include(actualText.trim())
        });

        cy.xpath(format("//*/div[contains(text(), '%s')]", location)).click({ force: true });

        //Select the Cost Account dropdown
        cy.get(formControls.selectCostAccount).click();

        for (let i = 0; i < costAccount.length; i++) {
          Helpers.log(`Cost Account fetching from excel is ${costAccount[i]}`);
        }

        //Checking the Cost Accounts displayed in the dropdown should match with the Excel data
        cy.get("div[role='option'] span").each((item, index, list) => {
          let actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Cost Account option in the Drop down is ${actualText}`)
          Helpers.log(`Expected Text of Cost Account option in the Drop down is ${costAccount[index]}`)
          expect(costAccount).to.include(actualText)
        });

        //cy.get('button[aria-label="Close"]').click();
        cy.get('#' + 'location' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} Ended`);
      }
    })
  })

  it.skip('<@platform_e2e>TC002 -  Validate the Division, Location, Cost Account drop down options - Location Level Access', () => {

    cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "LocationLevelAccess" }).then((rows) => {
      let rowLength: number = rows.length;
      Helpers.log(`Total Row length is ${rowLength}`)

      cy.clickAddUser();

      for (let rowCount = 0; rowCount < rowLength; rowCount++) {

        cy.get('#' + 'location' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} starts`);

        cy.get(formControls.selectAdminLocationDropdown).click();

        //Fetch Specific Division Values to select on the drop down
        const divisionToSelect = rows[rowCount]["Division to Select"].split("|");
        divisionToSelect.forEach(element => {
          Helpers.log(`Division value fetched from Excel ==> ${element}`)
        });

        for (let i = 0; i < divisionToSelect.length; i++) {
          Helpers.log(`Division to Select Value fetching from excel is ${divisionToSelect[i]}`);
          cy.xpath(format("//*/div[contains(text(), '%s')]", divisionToSelect[i])).click({ force: true });//This will check the specific Division
        }

        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[rowCount]["Location to Select"];
        Helpers.log(`Location fetched from Excel ==> ${location}`)

        //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
        const costAccount = rows[rowCount]["Cost Account"].split("|");
        costAccount.forEach(element => {
          Helpers.log(`Cost Account fetched from Excel ==> ${element}`);
        });

        cy.get('#admin-entity-location-list span[class="ng-arrow"]').click({ force: true });

        //Select the Location from the dropdown
        cy.get(formControls.selectLocationDropdown).click({ force: true });
        cy.get(formControls.selectLocationDropdown).click()

        const locationToDisplay = rows[rowCount]["Location to Display"].split("|");
        locationToDisplay.forEach(element => {
          Helpers.log(`Location To Display value fetched from Excel ==> ${element}`)
        });

        //Checking the locations displayed in the dropdown should match with the Excel data
        cy.get("div[role='option'] div").each((item, index, list) => {
          const actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Location Option in UI ${actualText}`)
          Helpers.log(`Expected Text of Location Option in UI ${locationToDisplay[index]}`)
          expect(locationToDisplay).to.include(actualText)
        });

        cy.xpath(format("//*/div[contains(text(), '%s')]", location)).click({ force: true });

        cy.get(formControls.selectCostAccount).click();
        //Checking the Cost Accounts displayed in the dropdown should match with the Excel data
        cy.get("div[role='option'] span").each((item, index, list) => {
          let actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Cost Account option in the Drop down is ${actualText}`)
          Helpers.log(`Expected Text of Cost Account option in the Drop down is ${costAccount[index]}`)
          expect(costAccount).to.include(actualText)
        });

        cy.get('#' + 'division' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} Ended`);

        if (rowCount == 10) {
          cy.get(formControls.addUserPopupCloseBtn).click();
          cy.navigateToDivisionLocationOnSamePage();
          cy.navigateToUserManagementPage();
          cy.clickAddUser();
        }

      }
    })
  })

  it('<@platform_e2e>TC003 -  Validate the Division, Location, Cost Account drop down options - Enterprise Level Access', () => {

    cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "EnterpriseLevelAccess" }).then((rows) => {
      let rowLength: number = rows.length;
      Helpers.log(`Total Row length is ${rowLength}`)

      cy.clickAddUser();
      cy.selectRole();

      for (let rowCount = 0; rowCount < rowLength; rowCount++) {

        cy.get('#' + 'enterprise' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} starts`);


        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[rowCount]["Location to Select"];
        Helpers.log(`Location fetched from Excel ==> ${location}`)

        //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
        const costAccount = rows[rowCount]["Cost Account to Display"].split("|");
        costAccount.forEach(element => {
          Helpers.log(`Cost Account fetched from Excel ==> ${element}`);
        });

        //Select the Location from the dropdown
        cy.get(formControls.selectLocationDropdown).click();
        cy.xpath(format("//*/div[contains(text(), '%s')]", location)).click({ force: true });

        cy.get(formControls.selectCostAccount).click();
        //Checking the Cost Accounts displayed in the dropdown should match with the Excel data
        cy.get("div[role='option'] span").each((item, index, list) => {
          let actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Cost Account option in the Drop down is ${actualText}`)
          Helpers.log(`Expected Text of Cost Account option in the Drop down is ${costAccount[index]}`)
          expect(costAccount).to.include(actualText)
        });

        cy.get('#' + 'division' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} Ended`);

      }
    })
  })

  it('<@platform_e2e>TC004 -  Validate the Division, Location, Cost Account drop down options - User Level Access', () => {

    cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "EnterpriseLevelAccess" }).then((rows) => {
      let rowLength: number = rows.length;
      Helpers.log(`Total Row length is ${rowLength}`)

      cy.clickAddUser();
      cy.selectRole();

      for (let rowCount = 0; rowCount < rowLength; rowCount++) {

        cy.get('#' + 'user' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} starts`);


        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[rowCount]["Location to Select"];
        Helpers.log(`Location fetched from Excel ==> ${location}`)

        //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
        const costAccount = rows[rowCount]["Cost Account to Display"].split("|");
        costAccount.forEach(element => {
          Helpers.log(`Cost Account fetched from Excel ==> ${element}`);
        });

        //Select the Location from the dropdown
        cy.get(formControls.selectLocationDropdown).click();
        cy.xpath(format("//*/div[contains(text(), '%s')]", location)).click({ force: true });

        cy.get(formControls.selectCostAccount).click();
        //Checking the Cost Accounts displayed in the dropdown should match with the Excel data
        cy.get("div[role='option'] span").each((item, index, list) => {
          let actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Cost Account option in the Drop down is ${actualText}`)
          Helpers.log(`Expected Text of Cost Account option in the Drop down is ${costAccount[index]}`)
          expect(costAccount).to.include(actualText)
        });

        cy.get('#' + 'division' + ' .mat-radio-input')
          .should('not.be.visible')
          .check({ force: true })
          .should('be.checked');

        Helpers.log(`Iteration ${rowCount} Ended`);

      }
    })
  })

  it(`<@platform_e2e>TC005 - Verify Email Fields is not Editable In Edit User Modal,
  Update User's Location from One Loc to Another in Edit Modal and Validate,
  Update User's Carrier Asisnment from One to Another in Edit Modal and Validate,
  Update User's Cost Account from One to Another in Edit Modal and Validate`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `2Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'pspro' + uniqueName + '@yopmail.com',
      password: 'Horizon#123'
    };
    cy.addNewUser(personalDetails);
    const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (!flag1) {
      cy.logoutUser();
      adminConsoleHelpers.loginCC(personalDetails.email, personalDetails.password);
      cy.verifyLocationAccessValidation();
      interceptsCostAccountApiCalls();
      cy.navigateToCostAccountOnSamePage();
      cy.verifySearchCostAccount('CaLocationAll');
      interceptsCarrierAccountApiCalls();
      cy.navigateToCarrierAccounts();
      cy.searchCarrier('UPS');
      cy.verifyUPSCarrierAdded();
      cy.verifyDeleteUser();
    } else {
      cy.searchUser(personalDetails);
      cy.clickDeleteUserFromGrid();
      cy.verifyIfDeleteUserPresent(personalDetails);
    }


  });

  if (Cypress.env('appEnv').includes('fed') === false) {
    it('<@platform_e2e>TC006 -  Validate the cost account hierarchies in Add User dropdown for Sending Enterprise Plan Users', () => {
      cy.getUsers().then((users) => {
        const { username, password } = users.pitneyshipEnterpriseUser;
        adminConsoleHelpers.loginViaUrl(username, password);
      });

      cy.navigateToUserManagementPage();
      interceptsUserManagementApiCalls();
      cy.clickAddUser();
      cy.selectRole();
      cy.selectLocation();
      cy.verifyCostAccHierarchyInUsersPage();
    })
  }

});



