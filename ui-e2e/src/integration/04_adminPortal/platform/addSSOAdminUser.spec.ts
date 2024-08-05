///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsAddAdminApiCalls } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { interceptsUserManagementApiCalls } from '../../../utils/admin_console/admin_intercept_routes';
import { AdminApi } from '../../../support/adminPortal/adminApi';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';

if (!Cypress.env('appEnv').includes('fed')) {
    describe('Test Suite :: Admin User - Create SSO Admin Users', () => {

        const user = config[Cypress.env('appEnv')]['admin_user'];
        const adminCommands = new AdminCommands();
        const helpers = new Helpers();
        const enterprise = '2_Automation_Enterprise';
        const adminApi = new AdminApi(user);
        const ssoAdminUser1 = config[Cypress.env('appEnv')]['ssoAdmin_user1'];
        const ssoAdminUser2 = config[Cypress.env('appEnv')]['ssoAdmin_user2'];
        const doorKeeper = new DoorKeeperOnboarding();

        beforeEach(() => {
            Helpers.log('------------------------------Test starts here-------------------------------');
            //helpers.loginAdminConsole(ssoAdminUser1.userEmail, ssoAdminUser1.password);
            // helpers.loginAdminConsole(user.userEmail, user.password);
            const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
            doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
            interceptsUserManagementApiCalls();
            interceptsAddAdminApiCalls();
            adminCommands.navigateToPlatformTab();
            adminCommands.navigateToManageAdminUsers();
        });

        afterEach(() => {
            Helpers.log('------------------------------Test ends here-------------------------------');
            cy.window().then((win) => {
                win.location.href = 'about:blank';
            });
        });

        it.skip(`<@admin_reg_e2e><@promote_ppd>TC001 - SSO Admin user - create SSO Admin User Mapping and check the Invited Status -PLATFORM,CLIENT SETUP[ENTERPRISE],PRODUCT SUPPORT,SANDBOX `, function () {
            var rolesOfSSOAdmin = new Array("PB_OPERATOR", "PB_SUPPORT_ADVANCED", "PB_SERVICE", "CLIENT_SANDBOX_ADVANCED");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminApi.callDeleteApi_SSOInvitedUser(ssoAdminUser2.userEmail);
            adminCommands.addSSOAdminUserMapping(ssoAdminUser2.userEmail);
            adminCommands.switchPlatform('ON');
            adminCommands.switchClientSetup('ON');
            adminCommands.assignEnterpriseWhileAddingUser(enterprise);
            adminCommands.switchProductSupport('ON');
            adminCommands.switchClientSandbox('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoAdminUser2.userEmail, 'pb.com_' + ssoAdminUser2.userEmail, 'ACTIVE', rolesOfSSOAdmin, 'Enterprise (1)');
            adminApi.callDeleteApi_SSOInvitedUser(ssoAdminUser2.userEmail);
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC002 - SSO Admin user - Add Active,Invited,Invalid EmailId[emailId with underscore],Non-PB Domain SSO Admin User Mapping and verify Error Message`, function () {
            const activeSSOEmailId = 'hamsa.nachimuthu@pb.com';
            const invalidSSOEmailId = 'hamsa_nachimuthu@pb.com';
            const invalidDomainName = ['hamsa.nachimuthu@gmail.com', 'hamsa.nachimuthu@yopmail.com', 'hamsa.nachimuthu@mailinator.com'];

            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoplatform${uuidGenerator()}`;
            const invitedSSOEmailId = uniqueName + '@pb.com';

            Helpers.log('------------------------------Test starts here-------------------------------');
            Helpers.log('--------------------Adding Active Status SSO Admin USer-------------------------------');
            adminCommands.addSSOAdminUserMapping(activeSSOEmailId);
            adminCommands.switchPlatform('ON');
            adminCommands.switchClientSetup('ON');
            adminCommands.assignEnterpriseWhileAddingUser(enterprise);
            adminCommands.switchProductSupport('ON');
            adminCommands.switchClientSandbox('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            adminCommands.verifyDuplicateSSOAdminError(activeSSOEmailId);
            helpers.waitForSpinners();
            //Verifying Edit icon should be enabled for Active User
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(activeSSOEmailId, 'pb.com_' + activeSSOEmailId, 'ACTIVE');

            Helpers.log('--------------------Adding Invited Status SSO Admin USer-------------------------------');
            adminCommands.switchToUsersTab();
            adminCommands.addSSOAdminUserMapping(invitedSSOEmailId);
            adminCommands.switchPlatform('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();

            adminCommands.addSSOAdminUserMapping(invitedSSOEmailId);
            adminCommands.switchPlatform('ON');
            adminCommands.switchClientSetup('ON');
            adminCommands.assignEnterpriseWhileAddingUser(enterprise);
            adminCommands.switchProductSupport('ON');
            adminCommands.switchClientSandbox('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            adminCommands.verifyDuplicateSSOAdminError(invitedSSOEmailId);
            helpers.waitForSpinners();

            Helpers.log('--------------------Adding Invalid Email Id SSO Admin USer-------------------------------');
            adminCommands.addSSOAdminUserMapping(invalidSSOEmailId);
            adminCommands.switchPlatform('ON');
            adminCommands.switchClientSetup('ON');
            adminCommands.assignEnterpriseWhileAddingUser(enterprise);
            adminCommands.switchProductSupport('ON');
            adminCommands.switchClientSandbox('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            adminCommands.verifyInvalidSSOAdminError(invalidSSOEmailId);
            helpers.waitForSpinners();

            for (let i = 0; i < invalidDomainName.length; i++) {
                Helpers.log('--------------------Adding Invalid Domain Like Gmail, yopmail SSO Admin USer-------------------------------');
                adminCommands.addSSOAdminUserMapping(invalidDomainName[i]);
                adminCommands.switchPlatform('ON');
                adminCommands.switchClientSetup('ON');
                adminCommands.assignEnterpriseWhileAddingUser(enterprise);
                adminCommands.switchProductSupport('ON');
                adminCommands.switchClientSandbox('ON');
                adminCommands.validateDomainErrorMessage();
                helpers.waitForSpinners();
            }
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC003 - SSO Admin user - Add Admin user with PLATFORM role`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoplatform${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_OPERATOR");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchPlatform('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
            adminApi.callDeleteApi_SSOInvitedUser(ssoEmailId);
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC004 - SSO Admin user - Add Admin user with CLIENT SETUP role with Installer`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoinstaller${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SERVICE_INSTALLER");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchClientSetup('ON');
            adminCommands.clickOnInstallerCheckbox();
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
            adminApi.callDeleteApi_SSOInvitedUser(ssoEmailId);
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC005 - SSO Admin user - Add Admin user with CLIENT SETUP role without Installer`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoinstaller${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SERVICE");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchClientSetup('ON');
            adminCommands.assignEnterpriseWhileAddingUser(enterprise);
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (1)');
            adminApi.callDeleteApi_SSOInvitedUser(ssoEmailId);
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC006 - SSO Admin user - Add Admin user with Product Support role with Advanced`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautosupport.advanced${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SUPPORT_ADVANCED");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchProductSupport('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
            adminApi.callDeleteApi_SSOInvitedUser(ssoEmailId);
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC007 - SSO Admin user - Add Admin user with Product Support role with Basic`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautosupport.basics${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SUPPORT_BASIC");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchProductSupport('ON');
            adminCommands.selectBasicSupportRole();
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC008 - SSO Admin user - Add Admin user with Product Support role with Team Lead`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautosupport.team.lead${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SUPPORT_TEAM_LEAD");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchProductSupport('ON');
            adminCommands.selectTeamLeadSupportRole();
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC009 - SSO Admin user - Add Admin user with Client Sandbox role - Advanced`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautosandbox.advanced${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("CLIENT_SANDBOX_ADVANCED");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchClientSandbox('ON');
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
        });

        it.skip(`<@admin_reg_e2e><@promote_ppd>TC010 - SSO Admin user - Add Admin user with Client Sandbox role - Basic`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautosandbox.basic${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("CLIENT_SANDBOX_BASIC");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchClientSandbox('ON');
            adminCommands.selectClientSandboxBasic(enterprise);
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (1)');
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC011 - SSO Admin user - Add Admin user with Product Support role with Advanced and Installer`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoinstaller.advanced${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SERVICE_INSTALLER,PB_SUPPORT_ADVANCED");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchProductSupport('ON');
            adminCommands.switchClientSetup('ON');
            adminCommands.clickOnInstallerCheckbox();
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
        });

        it(`<@admin_reg_e2e><@promote_ppd>TC012 - SSO Admin user - Edit Admin user with Product Support role with Advanced and Installer`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoinstaller.advanced${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SERVICE_INSTALLER,PB_SUPPORT_ADVANCED");
            var rolesOfSSOAdmin1 = new Array("PB_SUPPORT_ADVANCED");
            var rolesOfSSOAdmin2 = new Array("PB_SERVICE_INSTALLER");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.addSSOAdminUserMapping(ssoEmailId);
            adminCommands.switchProductSupport('ON');
            adminCommands.switchClientSetup('ON');
            adminCommands.clickOnInstallerCheckbox();
            adminCommands.saveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin, 'Enterprise (0)');
            Helpers.log('--------------Editing by removing the Client setup role----------------');
            //Editing by removing the Client setup role
            adminCommands.editIconInSSOUserMappingTab();
            adminCommands.switchClientSetup('OFF');
            adminCommands.editsaveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin1, 'Enterprise (0)');
            Helpers.log('--------------Editing by removing the Product Support Advanced Role and Adding the client Setup installer role---------------');
            //Editing by removing the Product Support Advanced Role and Adding the client Setup installer role
            adminCommands.editIconInSSOUserMappingTab();
            adminCommands.switchClientSetup('ON');
            adminCommands.clickOnInstallerCheckbox();
            adminCommands.switchProductSupport('OFF');
            adminCommands.editsaveAndCloseSSOAdminMapping();
            helpers.waitForSpinners();
            adminCommands.switchToSSOUserMappingTabAndVerifyGrid(ssoEmailId, 'pb.com_' + ssoEmailId, 'INVITED', rolesOfSSOAdmin2, 'Enterprise (0)');
        });

        it.skip(`<@admin_reg_e2e><@promote_ppd>TC013 - SSO Admin user - Add Admin user with Product Support role with Advanced and Installer`, function () {
            const uuidGenerator = () => Cypress._.random(0, 1e5);
            const uniqueName = `ssoautoinstaller.advanced${uuidGenerator()}`;
            const ssoEmailId = uniqueName + '@pb.com';
            var rolesOfSSOAdmin = new Array("PB_SERVICE_INSTALLER,PB_SUPPORT_ADVANCED");
            Helpers.log('------------------------------Test starts here-------------------------------');
            adminCommands.switchToSSOUserMappingTab();
            for (let i = 0; i < 30; i++) {
                adminApi.getInvitedSSOUserID();
                adminApi.callDeleteApi_SSOInvitedUser(ssoEmailId);
            }
        });


    });
}
