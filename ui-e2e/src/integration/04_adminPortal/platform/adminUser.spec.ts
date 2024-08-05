///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';
import { AdminApi } from '../../../support/adminPortal/adminApi';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsAddAdminApiCalls } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { AdminTmp } from 'ui-e2e/src/support/adminPortal/adminTmp';

describe.skip('Test Suite :: Admin User - Create Admin Users', () => {
  //TODO it looks like we have some issue here - go back to this case later!!!
  /*
  Issue is: When we add active user and delete it . Then add it again with INACTIVE flag -> it will be active
  When we add inactive user and detele it by API. Then add it again -> it will be active
https://jira.pitneycloud.com/browse/SPSS-1989
  **/
  const user = config[Cypress.env('appEnv')]['admin_user'];
  const adminApi = new AdminApi(user);
  const adminCommands = new AdminCommands();
  const helpers = new Helpers();
  const enterprise = '2_Automation_Enterprise';

  beforeEach(() => {
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (flag)
      helpers.loginAdminConsole(user.userEmail, user.password);
    else
      helpers.loginAdminConsole(user.userEmail, user.password);
    Helpers.log('------------------------------Test is starting here-------------------------------');
    interceptsUserManagementApiCalls();
    interceptsAddAdminApiCalls();
    adminCommands.navigateToPlatformTab();
    adminCommands.navigateToManageAdminUsers();
    adminCommands.addUserClick();
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  it(`<@promote_ppd><@promote_qa>TC001 - Admin user - create active user - Platform`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Platform${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('PB Operator', personalDetails.email);

    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();
  });

  it(`<@promote_ppd><@promote_qa>TC002 - Admin user - create active user for Assigned Enterprise - Client Setup`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Client${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchClientSetup('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbService);
    adminCommands.assignEnterpriseWhileAddingUser(enterprise);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners()
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_1);
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      adminCommands.verifyAdminTabs('PB Service', personalDetails.email);
      //adminCommands.selectEnterPriseInClientSetupTab(enterprise)
      //adminCommands.clickOnManageSubscriptions();
      //adminCommands.verifyClientSetupPagesLoadedOrNot(AdminCommands.clientSetupTabs[0]);
      //helpers.waitForSpinners();

    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();
  });

  it(`<@promote_ppd><@promote_qa>TC003 - Admin user - create active user with Installer Role - Client Setup`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `InstRole${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchClientSetup('ON');
    adminCommands.clickOnInstallerCheckbox();
    helpers.click(adminFormControls.radio.active);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners()
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('Installer Role', personalDetails.email);
      helpers.waitForElementNotExist(adminFormControls.text.availablePlanText)
      helpers.waitForElementNotExist(adminFormControls.buttons.addIntegrationsInClientSetup);

    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();

  });

  it(`<@promote_ppd><@promote_qa>TC004 - Admin user - create active user with 3 Roles - Platform,Client Setup,Product Support`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `All${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'Auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    adminCommands.switchClientSetup('ON');
    adminCommands.switchProductSupport('ON');
    helpers.click(adminFormControls.radio.active);
    adminCommands.assignEnterpriseWhileAddingUser(enterprise);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners()
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_1);
    adminCommands.clickOnEditUserButton();
    adminCommands.verifyFieldsAreNotEditableInAdminAddUser();
    adminCommands.clickOnCloseIcon();
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('all', personalDetails.email);

    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();

  });

  //Skipped due to the Client Sandbox icon is not present in theUI. Development is in progress
  it.skip(`<@promote_ppd><@promote_qa>TC005 - Admin user - create active user - Client Sandbox`, function () {
    if (Cypress.env('appEnv').includes('fed') === false) {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `Sandbox${uuidGenerator()}`;
      const personalDetails = {
        firstName: uniqueName,
        lastName: 'User',
        displayName: uniqueName,
        email: 'auto' + uniqueName + '@mailinator.com',
        password: 'Horizon#123'
      };
      Helpers.log('------------------------------Test starts here-------------------------------');
      adminCommands.typeFirstNameLastNameAndEmail(
        personalDetails.firstName,
        personalDetails.lastName,
        personalDetails.email);
      adminCommands.switchClientSandbox('ON');
      helpers.click(adminFormControls.radio.active);
      //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
      adminCommands.saveAndCloseWhenAddingEnterpriseUser();
      adminCommands.callAccountClaimAPI(personalDetails);
      helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
      helpers.waitForSpinners();
      adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName}`);
      adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
      const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
      Helpers.log(`Flag value is ${flag}`);
      if (!flag) {
        helpers.logoutUser();
        helpers.loginCC(personalDetails.email, personalDetails.password);
        helpers.waitForSpinners();
        adminCommands.verifyAdminTabs('Client Sandbox', personalDetails.email);
      }
      cy.get('body').then(($body) => {
        Helpers.log(`user id is ${AdminTmp.userID}`)
        adminApi.deleteAdminUser(AdminTmp.userID);
      });
      if (!flag)
        helpers.logoutUser();
    }
  });

  it(`<@promote_ppd><@promote_qa>TC006 - Admin user - create active user - Product Support Advanced`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Support${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'Adv',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchProductSupport('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbSupport);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('PB Support', personalDetails.email);
      adminCommands.navigateToSupportTab();
      adminCommands.verifyManageSupportUsersLinkNotVisible();
    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();
  });

  it(`<@promote_ppd><@promote_qa>TC007 - Admin user - create active user - Product Support Basic`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Support${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'Basic',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchProductSupport('ON');
    helpers.click(adminFormControls.radio.active);
    adminCommands.selectBasicSupportRole();
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('PB Support', personalDetails.email);
      adminCommands.navigateToSupportTab();
      adminCommands.verifyManageSupportUsersLinkNotVisible();
    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();
  });

  it(`<@promote_ppd><@promote_qa>TC008 - Admin user - create active user - Product Support Team Lead`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Support${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'TL',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchProductSupport('ON');
    helpers.click(adminFormControls.radio.active);
    adminCommands.selectTeamLeadSupportRole();
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    const flag: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag}`);
    if (!flag) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('PB Support', personalDetails.email)
      adminCommands.navigateToSupportTab();
      adminCommands.verifyManageSupportUsersLinkVisible();
    }
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    if (!flag)
      helpers.logoutUser();
  });

  if (Cypress.env('appEnv').includes('fed')) {
    it(`<@promote_ppd><@promote_qa>TC009 - Admin user - Reset password link verification`, function () {
      const uuidGenerator = () => Cypress._.random(0, 1e5);
      const uniqueName = `PlatReset${uuidGenerator()}`;
      const personalDetails = {
        firstName: uniqueName,
        lastName: 'User',
        displayName: uniqueName,
        email: 'auto' + uniqueName + '@mailinator.com',
        password: 'Horizon#123'
      };
      Helpers.log('------------------------------Test starts here-------------------------------');
      adminCommands.typeFirstNameLastNameAndEmail(
        personalDetails.firstName,
        personalDetails.lastName,
        personalDetails.email);
      adminCommands.switchPlatform('ON');
      helpers.click(adminFormControls.radio.active);
      adminCommands.saveAndCloseWhenAddingEnterpriseUser();
      adminCommands.callAccountClaimAPI(personalDetails);
      helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
      helpers.waitForSpinners();
      adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
      adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
      adminCommands.clickResetPassword();
      cy.get('body').then(($body) => {
        Helpers.log(`user id is ${AdminTmp.userID}`)
        adminApi.deleteAdminUser(AdminTmp.userID);
      });
    });
  }

  // // inactive users are not done because of issue!!!!!
  // it(`<@admin><@lockers>Admin user - create inactive user for an enterprise`, function () {
  //   Helpers.log('------------------------------Test starts here-------------------------------');
  //   adminCommands.navigateToPlatformTab();
  //   adminCommands.navigateToManageAdminUsers();
  //   adminCommands.addUserClick();
  //   adminCommands.typeFirstNameLastNameAndEmail(
  //     adminFormControls.testData.adminUserActive.firstName,
  //     adminFormControls.testData.adminUserActive.lastName,
  //     adminFormControls.testData.adminUserActive.email);
  //   helpers.click(adminFormControls.radio.inActive);
  //   helpers.selectCheckboxCy(adminFormControls.values.pbService);
  //   adminCommands.assignEnterpriseWhileAddingUser(adminFormControls.testData.enterpriseName);
  //   adminCommands.saveAndCloseWhenAddingEnterpriseUser();
  //   helpers.unSelectCheckboxCy(adminFormControls.checkBox.activeUsers);
  //   helpers.waitForMultiSpinners();
  //   helpers.waitForMultiSpinners();
  //   adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${adminFormControls.testData.adminUserActive.firstName} ${adminFormControls.testData.adminUserActive.lastName}`);
  //   adminChecker.checkIfInActiveEnterpriseUserExist();
  // });
  //
  // it(`<@admin><@lockers>Admin user - create user for PB support`, function () {
  //   Helpers.log('------------------------------Test starts here-------------------------------');
  //   adminCommands.navigateToPlatformTab();
  //   adminCommands.navigateToManageAdminUsers();
  //   adminCommands.addUserClick();
  //   adminCommands.typeFirstNameLastNameAndEmail(
  //     adminFormControls.testData.adminUser.firstName,
  //     adminFormControls.testData.adminUser.lastName,
  //     adminFormControls.testData.adminUser.email);
  //   helpers.click(adminFormControls.radio.active);
  //   helpers.selectCheckbox(adminFormControls.values.pbService);
  //   adminCommands.assignEnterpriseWhileAddingUser(adminFormControls.testData.enterpriseName);
  //   adminCommands.saveAndCloseWhenAddingEnterpriseUser();
  //   adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${adminFormControls.testData.adminUser.firstName} ${adminFormControls.testData.adminUser.lastName}`);
  //   adminChecker.checkIfEnterpriseUserExist();
  // });

  it(`<@promote_qa>TC010 - Admin User - Invited status =>New user with same email id should not get created`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Client${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchClientSetup('ON');
    helpers.click(adminFormControls.radio.active);
    adminCommands.assignEnterpriseWhileAddingUser(enterprise);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.getUserIDWhileCreatingNewUser();
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners()
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_1);


    adminCommands.addUserClick();
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchClientSetup('ON');
    helpers.click(adminFormControls.radio.active);
    adminCommands.assignEnterpriseWhileAddingUser(enterprise);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.validateDuplicateUserErrorMessage(personalDetails.email);
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
  });

  it(`<@promote_qa>TC011 - Admin User - Active status =>New user with same email id should not get created`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Platform${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    const flag1: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    Helpers.log(`Flag value is ${flag1}`);
    if (!flag1) {
      helpers.logoutUser();
      helpers.loginCC(personalDetails.email, personalDetails.password);
      helpers.waitForSpinners();
      adminCommands.verifyAdminTabs('PB Operator', personalDetails.email);

    }

    if (!flag1)
      helpers.logoutUser();

    const flag2: boolean = Cypress.env('appEnv').includes('fed') || Cypress.env('appEnv').includes('ppd');
    if (flag2)
      helpers.loginAdminConsole(user.userEmail, user.password);
    else
      helpers.loginCC(user.userEmail, user.password);
    Helpers.log('------------------------------Test is starting here-------------------------------');
    interceptsUserManagementApiCalls();
    interceptsAddAdminApiCalls();
    adminCommands.navigateToPlatformTab();
    adminCommands.navigateToManageAdminUsers();
    adminCommands.addUserClick();

    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.validateDuplicateUserErrorMessage(personalDetails.email);
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
  });

  it(`<@promote_qa>TC012 - Admin User - Inactive status    New user with same email id should not get created`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Platform${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    adminCommands.clickOnEditUserButton();
    adminCommands.changeActiveToInactiveAdminUser();
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();

    adminCommands.addUserClick();
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.validateDuplicateUserErrorMessage(personalDetails.email);
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
  });

  it(`<@promote_qa>TC013 - Admin User - Deleted status    New user with same email id should get created and Login should work`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Platform${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'auto' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.callAccountClaimAPI(personalDetails);
    helpers.selectCheckboxCy(adminFormControls.checkBox.activeUsers);
    helpers.waitForSpinners();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
    cy.get('body').then(($body) => {
      Helpers.log(`user id is ${AdminTmp.userID}`)
      adminApi.deleteAdminUser(AdminTmp.userID);
    });
    adminCommands.addUserClick();
    adminCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    adminCommands.switchPlatform('ON');
    helpers.click(adminFormControls.radio.active);
    //helpers.selectCheckboxCy(adminFormControls.checkBox.pbOperator);
    adminCommands.saveAndCloseWhenAddingEnterpriseUser();
    adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    adminCommands.verifyAdminUserGrid(personalDetails.firstName, personalDetails.lastName, personalDetails.email, adminFormControls.values.active, adminFormControls.values.assignedEnterprises_0);
  });
});
