///<reference types="cypress" />

import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsCustomFields, interceptsSelectEnterprise } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';

describe('Test Suite :: Admin - Custom Fields Tests', () => {
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const adminCommands = new AdminCommands();
  const helpers = new Helpers();
  const enterprise = 'Plan Definition Automation';
  const doorKeeper = new DoorKeeperOnboarding();

  beforeEach(() => {
    interceptsCustomFields();
    interceptsSelectEnterprise();
    Helpers.log('------------------------------Test is starting here-------------------------------');
    const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });
  it(`<@promote_qa><@promote_ppd><@admin_reg_e2e>TC001 - Add, Search and Delete Custom Fields - Text `, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');

    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueNum = `${uuidGenerator()}`;

    const newCustomFields = {
        name: 'AutoCustomFields' + uniqueNum,
        customType: 'Text',
      };

    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    adminCommands.navigateToManageCustomFields();
    adminCommands.selectCustomFieldsRadioButton('Use Custom Fields');
    adminCommands.addCustomFields(newCustomFields);
    adminCommands.verifyCreatedCustomFieldExist(newCustomFields);
    adminCommands.clickOnDeleteIconInCustomFieldSearchResults();
  });

  it(`<@admin_reg_e2e><@promote_ppd>TC002 - Verify created Custom Fields exists in Address Book`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');

    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueNum = `${uuidGenerator()}`;

    const newCustomFields = {
        name: 'AutoCustomFields' + uniqueNum,
        customType: 'Text',
      };

    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    adminCommands.navigateToManageCustomFields();
    adminCommands.selectCustomFieldsRadioButton('Use Custom Fields');
    adminCommands.addCustomFields(newCustomFields);
    adminCommands.verifyCreatedCustomFieldExist(newCustomFields);

    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    adminCommands.navigateToManageAddressBook();
    adminCommands.verifyCreatedCustomFieldInAddressBook(newCustomFields);

    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    adminCommands.navigateToManageCustomFields();
    adminCommands.selectCustomFieldsRadioButton('Use Custom Fields');
    adminCommands.verifyCreatedCustomFieldExist(newCustomFields);
    adminCommands.clickOnDeleteIconInCustomFieldSearchResults();
  });


});
