import {config} from '../../../fixtures/adminPortal/adminConfig.json';
import {AdminCommands} from '../../../support/adminPortal/adminCommands';
import {Helpers} from '../../../support/helpers';
import {
  interceptsSelectEnterprise,
  interceptsUserManagementApiCalls,
} from '../../../utils/admin_portal/adminPortal_intercept_routes';
import {SSOUsersPage} from '../../../support/adminPortal/pages/ssoUsersPage';
import {nonSSOUsers} from '../../../fixtures/adminPortal/nonSSOUsers.json';
import {LoginPage} from "../../../support/adminPortal/pages/loginPage";

describe('Test Suite :: Admin User - OIDC User Flows', () => {
  let accessLevels = ['User', 'Enterprise', 'Division', 'Location'];
  const user = config[Cypress.env('appEnv')]['admin_user_for_sso_automation'];
  const sso_users = config[Cypress.env('appEnv')]['sso_users'];
  const oidc_users = config[Cypress.env('appEnv')]['oidc_users'];
  const adminCommands = new AdminCommands();
  const helpers = new Helpers();
  const ssoUsersPage = new SSOUsersPage();
  const loginPage = new LoginPage();
  const sso_enterprise = config[Cypress.env('appEnv')]['sso_enterprise'];
  const oidc_enterprise = config[Cypress.env('appEnv')]['oidc_enterprise'];
  const nonSSOUser = nonSSOUsers;
  let uniqueNum: string;
  let uniqueNum2: string;
  let oidcUser: string;
  let oidcUserPwd: string;

  beforeEach(() => {
    Helpers.log(
      '------------------------------Test is starting here-------------------------------'
    );
    if (Cypress.env('appEnv').includes('fed') === true)
      helpers.loginAdminConsole(user.userEmail, user.password);
    else helpers.loginAdminConsole(user.userEmail, user.password);
    interceptsSelectEnterprise();
    interceptsUserManagementApiCalls();

    const whichOIDCUser = oidc_users.length - 2;
    oidcUser = oidc_users[whichOIDCUser].username;
    oidcUserPwd = oidc_users[whichOIDCUser].password;

    const uuidGenerator = () => Cypress._.random(0, 1e5);
    uniqueNum = `${uuidGenerator()}`;
    uniqueNum2 = `${uuidGenerator()}`;
  });
  afterEach(() => {
    Helpers.log(
      '------------------------------Test ends here-------------------------------'
    );
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@promote_qa><@admin_reg_e2e><@sso_qa>TC001 - Verify Add OIDC User Mapping and Login`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
        ssoUsersPage.addSSOUserMapping(oidcUser, 'enterprise', 'Test_Dash', 'SPSS Loc');
        ssoUsersPage.switchToSSOUsersMappingsTab();
        ssoUsersPage.verifySSOUsersMappingsGrid(oidcUser, 'TEST_DASH', 'SPSS Loc', 'Enterprise');
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        cy.wait(4000);
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.verifySSOUsersGrid(oidcUser, 'Test_Dash', 'SPSS Loc', 'Enterprise');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@promote_qa><@admin_reg_e2e><@sso_qa>TC002 - Verify OIDC User Login without having user mappings`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        cy.wait(4000);
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.verifySSOUsersGrid(oidcUser, 'Default', 'Default', 'User');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@promote_qa><@admin_reg_e2e><@sso_qa>TC003 - Verify Import OIDC User Mapping and Login`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const importFilePath = 'src/fixtures/adminPortal/testData/user/import-sso-user.csv';
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        Promise.all([
          adminCommands.getDivisionAndLocationNameForSSOImport(),
          adminCommands.getSubscriptionRoleForSSOImport(),
        ]).then(([resolvedValues, subRoleName]) => {
          let [locName, divName] = resolvedValues;
          let roleName = subRoleName;
          Helpers.log(`DivisionName: ${divName}`);
          Helpers.log(`LocationName: ${locName}`);
          Helpers.log(`roleName: ${roleName}`);
          const userMappingData = {
            uid: oidcUser,
            role: String(roleName),
            divisionName: String(divName),
            bpn: '',
            locationName: String(locName),
            company: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            phone: '',
          };
          ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
          ssoUsersPage.generateSSOUserImportFileWithExistingLocation(
            'src/fixtures/adminPortal/testData/user/import-sso-user.csv', userMappingData);
          ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/import-sso-user.csv', 'enterprise');
          ssoUsersPage.switchToSSOUsersMappingsTab();
          ssoUsersPage.verifySSOUsersMappingsGrid(userMappingData.uid, 'ROLE1', userMappingData.locationName, 'Enterprise');
          loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
          helpers.loginAdminConsole(user.userEmail, user.password);
          cy.wait(4000);
          ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
          ssoUsersPage.verifySSOUsersGrid(userMappingData.uid, userMappingData.role, userMappingData.locationName, 'Enterprise');
          ssoUsersPage.deleteUser();
        });
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC004 - Verify Import OIDC User Mapping and Login with a new location details`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        let accessLevel = 'user';
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        cy.wrap(adminCommands.getDivisionNameForSSOImport()).then((resolvedValues) => {
          const divName = resolvedValues;
          Helpers.log(`DivisionName: ${divName}`);
          cy.wrap(adminCommands.getSubscriptionRoleForSSOImport()).then((subRoleName) => {
            const roleName = subRoleName;
            Helpers.log(`roleName: ${roleName}`);
            const userMappingData = {
              uid: oidcUser,
              role: String(roleName),
              divisionName: String(divName),
              bpn: '0076816543',
              locationName: 'Location Import Test' + uniqueNum,
              company: 'Pitney Bowes',
              address: '27 Waterview Dr',
              city: 'Shelton',
              state: 'CT',
              country: 'US',
              zip: '06484',
              phone: '8770814452',
            };
            ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
            ssoUsersPage.generateSSOUserImportFileWithoutExistingLocation('src/fixtures/adminPortal/testData/user/import-sso-user-new-location.csv', userMappingData);
            ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/import-sso-user-new-location.csv', accessLevel);
            ssoUsersPage.switchToSSOUsersMappingsTab();
            ssoUsersPage.verifySSOUsersMappingsGrid(userMappingData.uid, userMappingData.role, userMappingData.locationName, 'User');
            loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
            helpers.loginAdminConsole(user.userEmail, user.password);
            cy.wait(4000);
            ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
            ssoUsersPage.verifiedSSOUserWithNewLocation(userMappingData, oidcUser, accessLevel);
            ssoUsersPage.deleteUser();
            ssoUsersPage.verifiedLocationAndDeleteIt(userMappingData);
          });
        });

      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC005 - Verify Non-SSO user and OIDC user search in client console`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.checkIfNonSSOUserIsAlreadyCreatedAndDelete(nonSSOUser.oidcNonSSOUser);
        ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
        ssoUsersPage.addSSOUserMapping(oidcUser, 'enterprise', 'Test_Dash', 'SPSS Loc');
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
        cy.wait(4000);
        ssoUsersPage.gotoUsersPage();
        ssoUsersPage.addNonSSOUser(nonSSOUser.oidcNonSSOUser, 'enterprise', 'Test_Dash', 'SPSS Loc');
        ssoUsersPage.verifySSOUsersGridInClientConsole(oidcUser, 'Test_Dash', 'SPSS Loc', 'Enterprise');
        ssoUsersPage.verifyNonSSOUsersGridInClientConsole(nonSSOUser.oidcNonSSOUser, 'Enterprise', 'Test_Dash', 'SPSS Loc');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC006 - Verify editing of Non-SSO and OIDC user details in client console when logged-in with SSO client user`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.checkIfNonSSOUserIsAlreadyCreatedAndDelete(nonSSOUser.oidcNonSSOUser);
        ssoUsersPage.addNonSSOUser(nonSSOUser.oidcNonSSOUser, 'enterprise', 'Test_Dash', 'SPSS Loc');
        ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
        ssoUsersPage.addSSOUserMapping(oidcUser, 'enterprise', 'General User', 'SPSS Loc');
        cy.wait(4000);
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
        ssoUsersPage.gotoUsersPage();
        // ssoUsersPage.editAndVerifyNonSSOUserChanges(nonSSOUser.newNonSSOUser, 'user', 'Test_Dash', 'General User', 'D2-L2-Test'); //- we have logged defect for this - https://pbapps.atlassian.net/browse/SPSS-7449
        // ssoUsersPage.deleteUser();
        // ssoUsersPage.editAndVerifySSOUserChanges(randomSSOUser, 'General User', 'Test_Dash', 'Dothan'); //- once it is fixed, uncomment these lines
        // ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC007 - Verify editing of Non-SSO and OIDC user details in client console when logged-in with Non-SSO client user`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.checkIfNonSSOUserIsAlreadyCreatedAndDelete(nonSSOUser.oidcNonSSOUser);
        ssoUsersPage.addNonSSOUser(nonSSOUser.oidcNonSSOUser, 'enterprise', 'Test_Dash', 'SPSS Loc');
        ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
        ssoUsersPage.addSSOUserMapping(oidcUser, 'enterprise', 'General User', 'SPSS Loc');
        loginPage.nonSSOUserLogin(nonSSOUsers.defaultNonSSOUser.email, nonSSOUsers.defaultNonSSOUser.password);
        ssoUsersPage.gotoUsersPage();
        cy.wait(4000);
        // ssoUsersPage.editAndVerifyNonSSOUserChanges(nonSSOUser.newNonSSOUser, 'user', 'Test_Dash', 'General User', 'D2-L2-Test'); //- we have logged defect for this - https://pbapps.atlassian.net/browse/SPSS-7449
        // ssoUsersPage.deleteUser();
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
        ssoUsersPage.gotoUsersPage();
        // ssoUsersPage.editAndVerifySSOUserChanges(randomSSOUser, 'General User', 'Test_Dash', 'Dothan'); //- once it is fixed, uncomment these lines
        // ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      for (let accessLevel of accessLevels) {
        let index = accessLevels.indexOf(accessLevel);
        let tcNumber = (8 + index).toString().padStart(3, '0');
        it(`<@admin_reg_e2e><@sso_qa>TC${tcNumber} - Verify setting default cost account in the import oidc user mapping with ${accessLevel} access level,
       it should display default cost account value in its user mappings grid and once user login, default cost account should be set successfully.`, () => {
          Helpers.log('------------------------------Test starts here-------------------------------');
          Helpers.log('Which Access Level is used in this test case: ' + accessLevel);
          const userMappingData = {
            uid: oidcUser,
            role: 'General User',
            divisionName: 'Default',
            bpn: '16726220',
            locationName: 'Dothan',
            company: 'Custom Location',
            address: '243 Hall Place',
            city: 'Longview',
            state: 'TX',
            country: 'US',
            zip: '75601',
            phone: '6666768712',
            defaultCostCentre: 'SSO Custom CA Test1',
          };
          ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
          ssoUsersPage.generateSSOUserImportFileWithCostAccount('src/fixtures/adminPortal/testData/user/default-cost-account-sso-user-mappings-qa.csv', userMappingData);
          ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/default-cost-account-sso-user-mappings-qa.csv', accessLevel, userMappingData);
          ssoUsersPage.switchToSSOUsersMappingsTab();
          ssoUsersPage.verifySSOUsersMappingsGrid(userMappingData.uid, userMappingData.role, userMappingData.locationName, accessLevel);
          ssoUsersPage.verifyCostAccountsInUsersMappingsPage(userMappingData);
          loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
          ssoUsersPage.checkIfAnyPopUpWindowIsVisible();
          ssoUsersPage.verifyDefaultCostAccountInShippingLabelPage(userMappingData, null, oidc_enterprise);
          ssoUsersPage.verifyDefaultCostAccountInStamps(userMappingData, null, oidc_enterprise);
          if (accessLevel === 'User') {
            Helpers.log("User Access Level doesn't have Users settings");
          } else {
            ssoUsersPage.gotoUsersPage();
            ssoUsersPage.verifyDefaultCostAccountInUsersTab(oidcUser, userMappingData, accessLevel);
          }
          helpers.loginAdminConsole(user.userEmail, user.password);
          ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
          ssoUsersPage.verifyDefaultCostAccountInUsersTab(oidcUser, userMappingData, accessLevel);
          ssoUsersPage.deleteUser();
        });
      }
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC012 - Verify updating of existing OIDC user details is working correctly via manual import`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        let firstOIDCSUser = oidc_users[0].username;
        let firstOIDCUserPwd = oidc_users[0].password;
        let secondOIDCSUser = oidc_users[1].username;
        let secondOIDCUserPwd = oidc_users[1].password;
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.prepareSSOUser(firstOIDCSUser, oidc_enterprise);
        ssoUsersPage.addSSOUserMapping(firstOIDCSUser, 'user', 'Test_Dash', 'Default', 'SSO Custom CA Test1');
        ssoUsersPage.prepareSSOUser(secondOIDCSUser, oidc_enterprise);
        ssoUsersPage.addSSOUserMapping(secondOIDCSUser, 'user', 'ADMIN', 'Dothan', 'Test CA 001');
        ssoUsersPage.switchToSSOUsersMappingsTab();
        ssoUsersPage.verifySSOUsersMappingsGrid(firstOIDCSUser, 'Test_Dash', 'Default', 'User');
        ssoUsersPage.verifySSOUsersMappingsGrid(secondOIDCSUser, 'ADMIN', 'Dothan', 'User');
        loginPage.oidcUserLogin(firstOIDCSUser, firstOIDCUserPwd, uniqueNum);
        cy.visit('/logout');
        loginPage.oidcUserLogin(secondOIDCSUser, secondOIDCUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/update-existing-OIDC-user-details.csv', 'enterprise');
        /*
        There are two records (two users) in the imported file. In the first one, the Role, Division and DefaultCostCentre fields are updated.
        The second user has the Archive flag set to true, which means that this user is to be deleted.
        */
        ssoUsersPage.checkIfUserNotExist(secondOIDCSUser);
        ssoUsersPage.verifySSOUsersGrid(firstOIDCSUser, 'All Features', '1019 loc edit', 'Enterprise');
        ssoUsersPage.checkCostAccount('Test CA 001');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      for (let accessLevel of accessLevels) {
        let index = accessLevels.indexOf(accessLevel);
        let tcNumber = (13 + index).toString().padStart(3, '0');
        it(`<@admin_reg_e2e><@sso_qa>TC${tcNumber} - Verify setting default cost account in the Add OIDC user mapping dialog with ${accessLevel} access level,
       it should display default cost account value in its user mappings grid and once user login, default cost account should be set successfully`, () => {
          Helpers.log('------------------------------Test starts here-------------------------------');
          Helpers.log('Which Access Level is used in this test case: ' + accessLevel);
          let formattedAccessLevel = ssoUsersPage.formatAccessLevelName(accessLevel, false);
          ssoUsersPage.goToManageSignInSecurity(oidc_enterprise);
          ssoUsersPage.clearAttributeMapping();
          ssoUsersPage.prepareSSOUser(oidcUser, oidc_enterprise);
          ssoUsersPage.addSSOUserMapping(oidcUser, formattedAccessLevel, 'Test_Dash', 'Dothan', 'Audi AG', 'Default');
          ssoUsersPage.switchToSSOUsersMappingsTab();
          ssoUsersPage.verifySSOUsersMappingsGrid(oidcUser, 'Test_Dash', 'Dothan', accessLevel);
          ssoUsersPage.verifyCostAccountsInUsersMappingsPage(null, 'Audi AG');
          loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
          ssoUsersPage.verifyDefaultCostAccountInShippingLabelPage(null, 'Audi AG', oidc_enterprise);
          ssoUsersPage.verifyDefaultCostAccountInStamps(null, 'Audi AG', oidc_enterprise);

          if (accessLevel === 'User') {
            Helpers.log("User Access Level doesn't have Users settings");
          } else {
            ssoUsersPage.gotoUsersPage();
            ssoUsersPage.verifyDefaultCostAccountInUsersTab_notImport(oidcUser, 'Test_Dash', 'Dothan', accessLevel, 'Audi AG');
          }
          helpers.loginAdminConsole(user.userEmail, user.password);
          ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
          ssoUsersPage.verifyDefaultCostAccountInUsersTab_notImport(oidcUser, 'Test_Dash', 'Dothan', accessLevel, 'Audi AG');
          ssoUsersPage.deleteUser();
        });
      }
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC017 - Verify through UI - JIT update when the setting - "Allow user update through JIT" is checked/enabled
      and its assigned role, location and default cost account field for an existing OIDC user is updated successfully for the test OIDC user whose custom setup is done at the okta end.`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        let oidcUser = oidc_users[2].username;
        let oidcUserPwd =  oidc_users[2].password;
        Helpers.log(`This test scenario is using user: ${oidcUser}`);
        ssoUsersPage.goToManageSignInSecurity(oidc_enterprise);
        ssoUsersPage.checkIfJITCheckboxIsEnabled();
        ssoUsersPage.verifyAttributeMapping("sp360Location", "sp360Role", "sp360CostCenter");
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.searchSSOUserEmail(oidcUser);
        ssoUsersPage.addDetailsToExistingSSOUser("All Features", "Dothan");
        loginPage.oidcUserLogin(oidcUser, oidcUserPwd, uniqueNum2);
        helpers.loginAdminConsole(user.userEmail, user.password);
        cy.wait(4000);
        ssoUsersPage.gotoManageSSOUsers(oidc_enterprise);
        ssoUsersPage.searchSSOUserEmail(oidcUser);
        ssoUsersPage.verifyIfUsersCustomSetupIsCorrect('Test_Dash', 'Default');
        Helpers.log('TEST PASSED');
      });
    }
  }


});
