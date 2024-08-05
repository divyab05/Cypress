///<reference types="cypress" />
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

describe('Test Suite :: Admin User - SSO User Flows', () => {
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
  let randomSSOUser: string;
  let randomSSOUserPwd: string;
  let uniqueNum: string;
  let uniqueNum2: string;
  let randomOIDCUser: string;
  let randomOIDCUserPwd: string;

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
    randomOIDCUser = oidc_users[whichOIDCUser].username;
    randomOIDCUserPwd = oidc_users[whichOIDCUser].password;

    const lastSSOUser = sso_users.length - 1;
    randomSSOUser = sso_users[lastSSOUser].username;
    randomSSOUserPwd=sso_users[lastSSOUser].password;

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
      it(`<@promote_qa><@admin_reg_e2e><@sso_qa>TC001 - Verify Add SSO User Mapping and Login`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
        ssoUsersPage.addSSOUserMapping(randomSSOUser, 'enterprise', 'Test_Dash', 'D2-L2-Test');
        ssoUsersPage.switchToSSOUsersMappingsTab();
        ssoUsersPage.verifySSOUsersMappingsGrid(randomSSOUser, 'TEST_DASH', 'D2-L2-Test', 'Enterprise');
        loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        cy.wait(4000);
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.verifySSOUsersGrid(randomSSOUser, 'Test_Dash', 'D2-L2-Test', 'Enterprise');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@promote_qa><@admin_reg_e2e><@sso_qa>TC002 - Verify SSO User Login without having user mappings`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
        loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        cy.wait(4000);
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.verifySSOUsersGrid(randomSSOUser, 'Default', 'Default', 'User');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@promote_qa><@admin_reg_e2e><@sso_qa>TC003 - Verify Import SSO User Mapping and Login`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const importFilePath = 'src/fixtures/adminPortal/testData/user/import-sso-user.csv';
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
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
            uid: randomSSOUser,
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
          ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
          ssoUsersPage.generateSSOUserImportFileWithExistingLocation(
            'src/fixtures/adminPortal/testData/user/import-sso-user.csv', userMappingData);
          ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/import-sso-user.csv', 'enterprise');
          ssoUsersPage.switchToSSOUsersMappingsTab();
          ssoUsersPage.verifySSOUsersMappingsGrid(userMappingData.uid, 'ROLE1', userMappingData.locationName, 'Enterprise');
          loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
          helpers.loginAdminConsole(user.userEmail, user.password);
          cy.wait(4000);
          ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
          ssoUsersPage.verifySSOUsersGrid(userMappingData.uid, userMappingData.role, userMappingData.locationName, 'Enterprise');
          ssoUsersPage.deleteUser();
        });
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC004 - Verify Import SSO User Mapping and Login with a new location details`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        let accessLevel = 'user';
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        cy.wrap(adminCommands.getDivisionNameForSSOImport()).then((resolvedValues) => {
          const divName = resolvedValues;
          Helpers.log(`DivisionName: ${divName}`);
          cy.wrap(adminCommands.getSubscriptionRoleForSSOImport()).then((subRoleName) => {
            const roleName = subRoleName;
            Helpers.log(`roleName: ${roleName}`);
            const userMappingData = {
              uid: randomSSOUser,
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
            ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
            ssoUsersPage.generateSSOUserImportFileWithoutExistingLocation('src/fixtures/adminPortal/testData/user/import-sso-user-new-location.csv', userMappingData);
            ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/import-sso-user-new-location.csv', accessLevel);
            ssoUsersPage.switchToSSOUsersMappingsTab();
            ssoUsersPage.verifySSOUsersMappingsGrid(userMappingData.uid, userMappingData.role, userMappingData.locationName, 'User');
            loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
            helpers.loginAdminConsole(user.userEmail, user.password);
            cy.wait(4000);
            ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
            ssoUsersPage.verifiedSSOUserWithNewLocation(userMappingData, randomSSOUser, accessLevel);
            ssoUsersPage.deleteUser();
            ssoUsersPage.verifiedLocationAndDeleteIt(userMappingData);
          });
        });

      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC005 - Verify Non-SSO user and SSO user search in client console`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.checkIfNonSSOUserIsAlreadyCreatedAndDelete(nonSSOUser.ssoNonSSOUser);
        ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
        ssoUsersPage.addSSOUserMapping(randomSSOUser, 'enterprise', 'Test_Dash', 'D2-L2-Test');
        loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
        cy.wait(4000);
        ssoUsersPage.gotoUsersPage();
        ssoUsersPage.addNonSSOUser(nonSSOUser.ssoNonSSOUser, 'enterprise', 'Test_Dash', 'D2-L2-Test');
        ssoUsersPage.verifySSOUsersGridInClientConsole(randomSSOUser, 'Test_Dash', 'D2-L2-Test', 'Enterprise');
        ssoUsersPage.verifyNonSSOUsersGridInClientConsole(nonSSOUser.ssoNonSSOUser, 'Enterprise', 'Test_Dash', 'D2-L2-Test');
        ssoUsersPage.deleteUser();
      });
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC006 - Verify editing of Non-SSO and SSO user details in client console when logged-in with SSO client user`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.checkIfNonSSOUserIsAlreadyCreatedAndDelete(nonSSOUser.ssoNonSSOUser);
        ssoUsersPage.addNonSSOUser(nonSSOUser.ssoNonSSOUser, 'enterprise', 'Test_Dash', 'D1-L1');
        ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
        ssoUsersPage.addSSOUserMapping(randomSSOUser, 'enterprise', 'Support User', 'D2-L2-Test');
        cy.wait(4000);
        loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
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
      it(`<@admin_reg_e2e><@sso_qa>TC007 - Verify editing of Non-SSO and SSO user details in client console when logged-in with Non-SSO client user`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.checkIfNonSSOUserIsAlreadyCreatedAndDelete(nonSSOUsers.ssoNonSSOUser);
        ssoUsersPage.addNonSSOUser(nonSSOUser.ssoNonSSOUser, 'enterprise', 'Test_Dash', 'D1-L1');
        ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
        ssoUsersPage.addSSOUserMapping(randomSSOUser, 'enterprise', 'Support User', 'D2-L2-Test');
        loginPage.nonSSOUserLogin(nonSSOUsers.defaultNonSSOUser.email, nonSSOUsers.defaultNonSSOUser.password);
        ssoUsersPage.gotoUsersPage();
        cy.wait(4000);
        // ssoUsersPage.editAndVerifyNonSSOUserChanges(nonSSOUser.newNonSSOUser, 'user', 'Test_Dash', 'General User', 'D2-L2-Test'); //- we have logged defect for this - https://pbapps.atlassian.net/browse/SPSS-7449
        // ssoUsersPage.deleteUser();
        loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
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
      it(`<@admin_reg_e2e><@sso_qa>TC${tcNumber} - Verify setting default cost account in the import sso user mapping with ${accessLevel} access level,
       it should display default cost account value in its user mappings grid and once user login, default cost account should be set successfully.`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        Helpers.log('Which Access Level is used in this test case: ' + accessLevel);
        const userMappingData = {
          uid: randomSSOUser,
          role: 'Support User',
          divisionName: 'Default',
          bpn: '16726220',
          locationName: 'D2-L2-Test',
          company: 'Custom Location',
          address: '243 Hall Place',
          city: 'Longview',
          state: 'TX',
          country: 'US',
          zip: '75601',
          phone: '6666768712',
          defaultCostCentre: 'SSO Custom CA Test1',
        };
        ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
        ssoUsersPage.generateSSOUserImportFileWithCostAccount('src/fixtures/adminPortal/testData/user/default-cost-account-sso-user-mappings-qa.csv', userMappingData);
        ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/default-cost-account-sso-user-mappings-qa.csv', accessLevel, userMappingData);
        ssoUsersPage.switchToSSOUsersMappingsTab();
        ssoUsersPage.verifySSOUsersMappingsGrid(userMappingData.uid, userMappingData.role, userMappingData.locationName, accessLevel);
        ssoUsersPage.verifyCostAccountsInUsersMappingsPage(userMappingData);
        loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
        ssoUsersPage.checkIfAnyPopUpWindowIsVisible();
        ssoUsersPage.verifyDefaultCostAccountInShippingLabelPage(userMappingData, null, sso_enterprise);
        ssoUsersPage.verifyDefaultCostAccountInStamps(userMappingData, null, sso_enterprise);
        if (accessLevel === 'User') {
          Helpers.log("User Access Level doesn't have Users settings");
        } else {
          ssoUsersPage.gotoUsersPage();
          ssoUsersPage.verifyDefaultCostAccountInUsersTab(randomSSOUser, userMappingData, accessLevel);
        }
        helpers.loginAdminConsole(user.userEmail, user.password);
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.verifyDefaultCostAccountInUsersTab(randomSSOUser, userMappingData, accessLevel);
        ssoUsersPage.deleteUser();
      });
    }
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC012 - Verify updating of existing SSO user details is working correctly via manual import`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        let firstSSOUser = sso_users[0].username;
        let firstSSOUserPwd = sso_users[0].password;
        let secondSSOUser = sso_users[1].username;
        let secondSSOUserPwd = sso_users[1].password;
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.prepareSSOUser(firstSSOUser, sso_enterprise);
        ssoUsersPage.addSSOUserMapping(firstSSOUser, 'user', 'Test_Dash', 'Default', 'SSO Custom CA Test1');
        ssoUsersPage.prepareSSOUser(secondSSOUser, sso_enterprise);
        ssoUsersPage.addSSOUserMapping(secondSSOUser, 'user', 'ADMIN', 'Dothan', 'Test CA 001');
        ssoUsersPage.switchToSSOUsersMappingsTab();
        ssoUsersPage.verifySSOUsersMappingsGrid(firstSSOUser, 'Test_Dash', 'Default', 'User');
        ssoUsersPage.verifySSOUsersMappingsGrid(secondSSOUser, 'ADMIN', 'Dothan', 'User');
        loginPage.ssoUserLogin(firstSSOUser, firstSSOUserPwd, uniqueNum);
        cy.visit('/logout');
        loginPage.ssoUserLogin(secondSSOUser, secondSSOUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.importSSOUserMapping('adminPortal/testData/user/update-existing-SSO-user-details.csv', 'enterprise');
        /*
        There are two records (two users) in the imported file. In the first one, the Role, Division and DefaultCostCentre fields are updated.
        The second user has the Archive flag set to true, which means that this user is to be deleted.
        */
        ssoUsersPage.checkIfUserNotExist(secondSSOUser);
        ssoUsersPage.verifySSOUsersGrid(firstSSOUser, '912 audit role', '1019 loc edit', 'Enterprise');
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
        it(`<@admin_reg_e2e><@sso_qa>TC${tcNumber} - Verify setting default cost account in the Add sso user mapping dialog with ${accessLevel} access level,
       it should display default cost account value in its user mappings grid and once user login, default cost account should be set successfully`, () => {
          Helpers.log('------------------------------Test starts here-------------------------------');
          Helpers.log('Which Access Level is used in this test case: ' + accessLevel);
          let formattedAccessLevel = ssoUsersPage.formatAccessLevelName(accessLevel, false);
          ssoUsersPage.goToManageSignInSecurity(sso_enterprise);
          ssoUsersPage.clearAttributeMapping();
          ssoUsersPage.prepareSSOUser(randomSSOUser, sso_enterprise);
          ssoUsersPage.addSSOUserMapping(randomSSOUser, formattedAccessLevel, 'Test_Dash', 'Sohail Fremont Address', 'Test CA 001', 'TestD1');
          ssoUsersPage.switchToSSOUsersMappingsTab();
          ssoUsersPage.verifySSOUsersMappingsGrid(randomSSOUser, 'Test_Dash', 'Sohail Fremont Address', accessLevel);
          ssoUsersPage.verifyCostAccountsInUsersMappingsPage(null, 'Test CA 001');
          loginPage.ssoUserLogin(randomSSOUser, randomSSOUserPwd, uniqueNum);
          ssoUsersPage.verifyDefaultCostAccountInShippingLabelPage(null, 'Test CA 001', sso_enterprise);
          ssoUsersPage.verifyDefaultCostAccountInStamps(null, 'Test CA 001', sso_enterprise);

          if (accessLevel === 'User') {
            Helpers.log("User Access Level doesn't have Users settings");
          } else {
            ssoUsersPage.gotoUsersPage();
            ssoUsersPage.verifyDefaultCostAccountInUsersTab_notImport(randomSSOUser, 'Test_Dash', 'Sohail Fremont Address', accessLevel, 'Test CA 001');
          }
          helpers.loginAdminConsole(user.userEmail, user.password);
          ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
          ssoUsersPage.verifyDefaultCostAccountInUsersTab_notImport(randomSSOUser, 'Test_Dash', 'Sohail Fremont Address', accessLevel, 'Test CA 001');
          ssoUsersPage.deleteUser();
        });
      }
    }
  }

  if (Cypress.env('appEnv').includes('qa') === true) {
    if (Cypress.env('appEnv').includes('fed') === false) {
      it(`<@admin_reg_e2e><@sso_qa>TC017 - Verify through UI - JIT update when the setting - "Allow user update through JIT" is checked/enabled
      and its assigned role, location and default cost account field for an existing SAML SSO user is updated successfully for the test SSO user whose custom setup is done at the okta end.`, () => {
        Helpers.log('------------------------------Test starts here-------------------------------');
        let ssoUser = sso_users[0].username;
        let ssoUserPwd =  sso_users[0].password;
        Helpers.log(`This test scenario is using user: ${ssoUser}`);
        ssoUsersPage.goToManageSignInSecurity(sso_enterprise);
        ssoUsersPage.checkIfJITCheckboxIsEnabled();
        ssoUsersPage.verifyAttributeMapping("location", "role", "cost_center");
        loginPage.ssoUserLogin(ssoUser, ssoUserPwd, uniqueNum);
        helpers.loginAdminConsole(user.userEmail, user.password);
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.searchSSOUserEmail(ssoUser);
        ssoUsersPage.addDetailsToExistingSSOUser("Default", "D1-L1");
        loginPage.ssoUserLogin(ssoUser, ssoUserPwd, uniqueNum2);
        helpers.loginAdminConsole(user.userEmail, user.password);
        cy.wait(4000);
        ssoUsersPage.gotoManageSSOUsers(sso_enterprise);
        ssoUsersPage.searchSSOUserEmail(ssoUser);
        ssoUsersPage.verifyIfUsersCustomSetupIsCorrect('Test_Dash', 'D2-L2-Test');
        Helpers.log('TEST PASSED');
      });
    }
  }


});
