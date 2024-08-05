///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsAddRoleTemplate } from '../../../utils/admin_portal/adminPortal_intercept_routes';
//Add role option is removed from Admin console
describe.skip('Test Suite :: Admin User - Create Role Template', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        helpers.loginAdminConsole(user.userEmail, user.password);
        interceptsAddRoleTemplate();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_ppd><@promote_qa><@admin_reg_e2e>TC001 - Admin user - Add Role Template`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const personalDetails = {
            displayName: `RoleTemp${uuidGenerator()}`
        };
        Helpers.log('------------------------------Test starts here-------------------------------');
        adminCommands.navigateToPlatformTab();
        adminCommands.navigateToManageRoleTemplates();
        adminCommands.createRoleTemplate(personalDetails);
        adminCommands.verifyCreatedRoleTemplateExist(personalDetails);
        adminCommands.clickOnDeleteIconInRoleTemplateSearchResults();
    });
});
