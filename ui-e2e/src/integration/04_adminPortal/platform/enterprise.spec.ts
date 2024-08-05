///<reference types="cypress" />

import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';
import { AdminApi } from '../../../support/adminPortal/adminApi';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { AdminChecker } from '../../../support/adminPortal/adminChecker';
import { Helpers } from '../../../support/helpers';
import { interceptsEditAdminUser } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';

describe('Test Suite :: Admin User - Create Enterprise', () => {
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const adminApi = new AdminApi(user);
  const adminCommands = new AdminCommands();
  const adminChecker = new AdminChecker();
  const helpers = new Helpers();
  const doorKeeper = new DoorKeeperOnboarding();
  let enterprise;

  beforeEach(() => {
    interceptsEditAdminUser();
    Helpers.log('------------------------------Test is starting here-------------------------------');
    //helpers.loginAdminConsole(user.userEmail, user.password);
    const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
    Helpers.log('To jest LoginURL: ' + loginUrl.toString());
    doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
    adminCommands.navigateToPlatformTab();
    adminCommands.navigateToManageEnterprises();
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    //adminApi.findAndDeleteEnterprise(enterprise);
    //adminCommands.callDeleteApiForEnterprise(enterprise);
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it.skip(`<@promote_qa><@promote_ppd>Enterprise - delete all enterprise`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    let enterprise = ['1_Automation_Enterprise50398', '1_Automation_Enterprise14360', '1_Automation_Enterprise55879', '1_Automation_Enterprise23095', '1_Automation_Enterprise56324', '1_Automation_Enterprise27237', '1_Automation_Enterprise9103']
    for (let a = 0; a < 10; a++) {
      adminApi.callDeleteApiForEnterprise(enterprise[a])
    }
  });

  it(`<@promote_qa><@promote_ppd><@admin_reg_e2e>TC001 - Enterprise - create enterprise and check`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    enterprise = `1_Automation_Enterprise${uuidGenerator()}`
    adminCommands.createNewEnterpriseClick();
    adminCommands.typeEnterpriseNameAndConfirm(enterprise);
    helpers.waitAndCloseToast();
    helpers.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, enterprise);
    adminChecker.checkIfEnterpriseExist(enterprise);
    adminApi.callDeleteApiForEnterprise(enterprise)
  });

  it(`<@promote_ppd><@admin_reg_e2e>TC002 - Enterprise - create enterprise with custom ID`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    enterprise = `1_Automation_Enterprise${uuidGenerator()}`
    adminCommands.createNewEnterpriseClick();
    helpers.selectCheckboxCy(adminFormControls.checkBox.allowCustomEnterpriseId);
    helpers.sendText(adminFormControls.inputs.enterpriseId, adminFormControls.testData.enterpriseId + `${uuidGenerator()}`)
    adminCommands.typeEnterpriseNameAndConfirm(enterprise);
    helpers.waitAndCloseToast();
    helpers.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, enterprise);
    adminChecker.checkIfEnterpriseExist(enterprise);
    adminApi.callDeleteApiForEnterprise(enterprise)
  });

  it(`<@promote_ppd><@admin_reg_e2e>TC003 - Enterprise - custom ID and name validation`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.createNewEnterpriseClick();
    adminChecker.checkEnterpriseNameValidationWhenEmpty();
    adminChecker.checkEnterpriseNameValidationWhenOneCharAndTwoChars();
    adminChecker.checkEnterpriseNameValidationForMoreThan50Chars();
    adminChecker.checkEnterpriseIdValidationWhenEmpty();
    adminChecker.checkCreatingEnterpriseAvailableAfterDeselectIdCheckbox();
    adminChecker.checkWhenEnterpriseIdAndNameAreFilled();
    adminChecker.checkWhenEnterpriseIdIsFilledButNameIsEmpty();
  });

  it(`TC004 - Create Enterprise and add Subscription to the created enterprise`, function () {
    Helpers.log('------------------------------Test starts here-------------------------------');
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    enterprise = `1_Automation_Enterprise${uuidGenerator()}`
    adminCommands.createNewEnterpriseClick();
    adminCommands.typeEnterpriseNameAndConfirm(enterprise);
    helpers.waitAndCloseToast();
    helpers.sendTextAndConfirm(adminFormControls.inputs.placeholderSearchByEmail, enterprise);
    adminChecker.checkIfEnterpriseExist(enterprise);

    adminCommands.navigateToPlatformTab();
    adminCommands.navigateToManageAdminUsers();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearchByEmail, user.userName);
    adminCommands.clickOnEditUserButton();
    adminCommands.assignEnterpriseWhileAddingUser(enterprise);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();

    adminCommands.navigateToClientSetupTab();
    adminCommands.selectNewlyCreatedEnterPriseInClientSetupTab(enterprise);
    adminCommands.clickOnManageSubscriptions();
    adminCommands.selectAvailablePlan('Sending Plan');
    adminCommands.selectCarrierCheckbox('United States Postal Service');
    adminCommands.selectCarrierCheckbox('United Parcel Service');
    adminCommands.selectCarrierCheckbox('Federal Express');
    adminCommands.selectOktaIDFromDropDown('idp-spa-users-qa');
    adminCommands.clickOnSaveButtonInSubscription();

    adminCommands.navigateToPlatformTab();
    adminCommands.navigateToManageAdminUsers();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearchByEmail, user.userName);
    adminCommands.clickOnEditUserButton();
    adminCommands.assignEnterpriseWhileAddingUser(enterprise);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();

  });


});
