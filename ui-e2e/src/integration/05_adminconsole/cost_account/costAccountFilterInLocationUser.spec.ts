///<reference types="cypress" />
import { interceptsCostAccountApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { adminConsoleHelpers } from 'ui-e2e/src/support/adminconsole/adminConsoleHelpers';
import { formControls } from '../../../fixtures/adminconsole/formControls.json';
import { Helpers } from '../../../support/helpers';

describe('Test Suite :: Cost Accounts', () => {
  beforeEach(() => {
    if (Cypress.env('appEnv').includes('fed') === true) {
      cy.getUsers().then((users) => {
        const { username, password } = users.locationAdminUse_UserPersona;
        if (Cypress.env('appEnv').includes('fed') === true)
          adminConsoleHelpers.loginViaUrl(username, password);
        else {
          adminConsoleHelpers.loginCC(username, password);
        }
      });
    } else {
      cy.getUsers().then((users) => {
        const { username, password } = users.locationAdminUser;
        if (Cypress.env('appEnv').includes('fed') === true)
          adminConsoleHelpers.loginViaUrl(username, password);
        else {
          adminConsoleHelpers.loginCC(username, password);
        }
      });
    }
    interceptsCostAccountApiCalls();
    cy.navigateToCostAccountPage();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  const uuidGenerator = () => Cypress._.random(0, 1e5);
  const uniqueNum = `${uuidGenerator()}`;
  const newCostAccount = {
    name: 'AutoCA' + uniqueNum,
    code: 'AutoCC' + uniqueNum,
    description: 'desc text',
    shareLevel: 'enterprise'
  };

  it(`<@platform_e2e><@filtercase>TC001 - Location Admin-Selecting Location filter in Cost Account`, function () {

    cy.task('readXlsx', { file: 'src/fixtures/adminconsole/userManagementTestData.xlsx', sheet: "CostAccountFilter" }).then((rows) => {
      let rowLength: number = rows.length;
      Helpers.log(` Row length is ${rowLength}`)

      for (let rowCount = 7; rowCount < 14; rowCount++) {

        Helpers.log(`Iteration ${rowCount} starts`);

        //Fetch Location column Values from Excel and storing it in the "location" Array
        const location = rows[rowCount]["LocationFilterValues"].split("|");
        location.forEach(element => {
          Helpers.log(`Location fetched from Excel ==> ${element}`)
        });

        //Fetch Cost Account column Values from Excel and storing it in the "costAccount" Array
        const costAccount = rows[rowCount]["CostAccountToValidate"].split("|");
        costAccount.forEach(element => {
          Helpers.log(`Cost Account fetched from Excel ==> ${element}`);
        });

        for (let i = 0; i < location.length; i++) {
          Helpers.log(`Location fetching from excel is ${location[i]}`);
          cy.clickOnLocationFilterInCAPage(location[i]);
        }
        cy.wait(3000);

        cy.get('td[class="td-name ng-star-inserted"] div b').each((item, index, list) => {
          Helpers.log(`Index is ${index}`)
          expect(item).to.contain(costAccount[index])
          let actualText = Cypress.$(item).text();
          Helpers.log(`Actual Text of Cost Account option is ${actualText}`)
          Helpers.log(`Expected Text of Cost Account option is ${costAccount[index]}`)
          //expect(costAccount).to.include(actualText)
        });

        cy.get(formControls.rolesLink).contains('Roles').click({ force: true }).wait(1000);
        cy.get(formControls.settingsMenu_ManageCostAccounts).contains('Cost Accounts').click({ force: true }).waitForSpinnerIcon();


      }
    });

  });
});