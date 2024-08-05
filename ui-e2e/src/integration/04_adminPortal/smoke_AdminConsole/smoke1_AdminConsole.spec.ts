///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';
import { interceptsSelectEnterprise, interceptsAddCostAccount, interceptsCustomFields, interceptsUserManagementApiCalls } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';
import { AdminApi } from "../../../support/adminPortal/adminApi";
import {GmailCheckers} from "../../../support/gmail/gmailCheckers";

describe('Admin Console - Smoke1', () => {
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const adminCommands = new AdminCommands();
  const helpers = new Helpers();
  const doorKeeper = new DoorKeeperOnboarding();
  const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
  const gmailCheckers = new GmailCheckers();

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it(`<@smoke><@prod_sanity>TC007 - Add new user with User access level and validate welcome email - Gmail`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    interceptsUserManagementApiCalls();
    const now = new Date().toISOString();
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `1Auto${uuidGenerator()}`;
    const uniqueNumber = `${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: `fedrampgcppdad+${uniqueNumber}@gmail.com`,
      password: 'Horizon#123'
    };
    Helpers.log(`Current date and time in ISO format is: ${now}`);
    adminCommands.navigateToClientSetupTab();
    const enterprise = 'Plan Definition Automation';
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    adminCommands.navigateToManageUsers();
    adminCommands.addUsers(personalDetails, 'user');
    adminCommands.selectRoleFromAssignRoleDropDown();
    adminCommands.selectLocationFromDropDown();
    adminCommands.clickOnSaveAndCloseInAddUserModal();
    gmailCheckers.checkEmailAndValidate('clientsuccess@emails.pitneybowes.com',
      `${personalDetails.email}`,
      'Welcome to Shipping 360',
      now,//2024-06-21T11:51:42.935Z
      'See how easy it is to get started.');
    adminCommands.callAccountClaimAPI_ClientUser();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, personalDetails.firstName);
    adminCommands.verifyClientUserGrid(personalDetails.firstName, personalDetails.email, 'INVITED');
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('admin-ppd') || Cypress.env('appEnv').includes('admin-prod');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.loginInToClientConsole(personalDetails.email, personalDetails.password);
      adminCommands.verifyUserAccessValidation();
      helpers.logoutUser();
      helpers.loginAdminConsole(user.userEmail, user.password);
    }
    cy.get('@userID').then(userID => {
      new AdminApi(user).verifyDeleteUser_ClientSetup(userID, enterprise);
    });
  });

  it(`<@smoke><@prod_sanity>TC002 - Add Cost Account`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueNum = `${uuidGenerator()}`;
    const newCostAccount = {
      name: 'AutoCA' + uniqueNum,
      code: 'AutoCC' + uniqueNum,
      description: 'desc text',
      shareLevel: 'Enterprise'
    };
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    adminCommands.navigateToClientSetupTab();
    interceptsAddCostAccount();
    adminCommands.navigateToClientSetupTab();
    const enterprise = 'Plan Definition Automation';
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    adminCommands.navigateToManageCostAccounts();
    adminCommands.addCostAccount(newCostAccount);
    adminCommands.verifyCreatedCostAccountExist(newCostAccount);
    adminCommands.clickOnDeleteIconInCostAccountSearchResults();
  });

  it(`<@smoke><@prod_sanity>TC003 - Import Cost Account`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    adminCommands.navigateToClientSetupTab();
    interceptsAddCostAccount();
    adminCommands.navigateToClientSetupTab();
    const enterprise = 'Plan Definition Automation';
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    adminCommands.navigateToManageCostAccounts();
    adminCommands.clickOnImportCostAccount('adminPortal/testData/costaccount/Import_CostAccount_Single.csv');
    adminCommands.verifyCreatedCostAccountExistAfterImport('Auto_Admin_Single_CA');
    adminCommands.clickOnDeleteIconInCostAccountSearchResults();
  });

  it(`<@smoke><@prod_sanity>TC004 - Add, Search and Delete Custom Fields - Text `, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');

    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueNum = `${uuidGenerator()}`;

    const newCustomFields = {
      name: 'AutoCustomFields' + uniqueNum,
      customType: 'Text',
    };
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    interceptsSelectEnterprise();
    adminCommands.navigateToClientSetupTab();
    interceptsCustomFields();
    adminCommands.navigateToClientSetupTab();
    const enterprise = 'Plan Definition Automation';
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    adminCommands.navigateToManageCustomFields();
    adminCommands.selectCustomFieldsRadioButton('Use Custom Fields');
    adminCommands.addCustomFields(newCustomFields);
    adminCommands.verifyCreatedCustomFieldExist(newCustomFields);
    adminCommands.clickOnDeleteIconInCustomFieldSearchResults();
  });
});
