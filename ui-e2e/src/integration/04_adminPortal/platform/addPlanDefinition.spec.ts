///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';
import { AdminApi } from '../../../support/adminPortal/adminApi';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { AdminChecker } from '../../../support/adminPortal/adminChecker';
import { Helpers } from '../../../support/helpers';
import { interceptsAddPlanDefinition } from '../../../utils/admin_portal/adminPortal_intercept_routes';
//As per the new implementation, we have hided the Add, Edit plan functionality.
//Herafter, we will see only View and Delete icon. 
//We will not see Add, Edit, Duplicate icon
describe.skip('Test Suite :: Admin User - Create Plan Definition', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminApi = new AdminApi(user);
    const adminCommands = new AdminCommands();
    const adminChecker = new AdminChecker();
    const helpers = new Helpers();
    let planName: string;
    const enterprise = 'Plan Definition Automation';

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        helpers.loginAdminConsole(user.userEmail, user.password);
        interceptsAddPlanDefinition();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_qa>TC001 - Admin user - Create and Delete Plan Definition`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const personalDetails = {
            displayName: `PlanDef${uuidGenerator()}`,
            description: `PlanDef${uuidGenerator()}` + 'description'
        };
        Helpers.log('------------------------------Test starts here-------------------------------');
        adminCommands.navigateToPlatformTab();
        adminCommands.navigateToManagePlanDefinition();
        adminCommands.createPlanDefinition(personalDetails);
        adminCommands.verifyCreatedPlanExist(personalDetails);
        adminCommands.clickOnDeleteIconInPlanDefinitionSearchResults();

    });

    it.skip(`<@promote_ppd><@promote_qa>TC002 - Admin user - Create and Assign Plan to the Subscription`, function () {
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const personalDetails = {
            displayName: `PlanDef${uuidGenerator()}`,
            description: `PlanDef${uuidGenerator()}` + 'description'
        };
        Helpers.log('------------------------------Test starts here-------------------------------');
        adminCommands.navigateToPlatformTab();
        adminCommands.navigateToManagePlanDefinition();
        adminCommands.createPlanDefinition(personalDetails);
        adminCommands.verifyCreatedPlanExist(personalDetails);
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise);
        adminCommands.clickOnManageSubscriptions();
        adminCommands.selectPlanInSubscription('PlanDef87915')
        adminCommands.navigateToPlatformTab();
        adminCommands.navigateToManagePlanDefinition();
        //adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, `${personalDetails.displayName}`);
        adminCommands.sendTextAndConfirm(adminFormControls.inputs.placeholderSearch, 'PlanDef87915');
        adminCommands.checkForDuplicateEditDeleteIconInPlanDefinition();
        adminCommands.clickOnDeleteIconInPlanDefinitionSearchResults();
    });

});
