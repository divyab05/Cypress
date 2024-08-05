///<reference types="cypress" />
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { Helpers } from '../../../support/helpers';
import { interceptsSelectEnterprise, interceptsProducts } from '../../../utils/admin_portal/adminPortal_intercept_routes';
import { DoorKeeperOnboarding } from '../../../support/doorKeeper';

describe('Test Suite :: Admin User - Add Products', () => {

    const user = config[Cypress.env('appEnv')]['admin_user'];
    const adminCommands = new AdminCommands();
    const helpers = new Helpers();
    const enterprise = 'Plan Definition Automation';
    const doorKeeper = new DoorKeeperOnboarding();

    beforeEach(() => {
        Helpers.log('------------------------------Test is starting here-------------------------------');
        const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
        doorKeeper.loginAdmin(user.userEmail, user.password, loginUrl);
        interceptsSelectEnterprise();
        interceptsProducts();
    });

    afterEach(() => {
        Helpers.log('------------------------------Test ends here-------------------------------');
        cy.window().then((win) => {
            win.location.href = 'about:blank';
        });
    });

    it(`<@promote_ppd><@admin_reg_e2e>TC001 - Add and delete Device hub product`, function () {
        Helpers.log('------------------------------Test starts here-------------------------------');
        const uuidGenerator = () => Cypress._.random(0, 1e5);
        const uniqueNum = `${uuidGenerator()}`;
        const newDeviceHub = {
            name: 'AutoDeviceHub' + uniqueNum,
            deviceId: 'AutoDeviceHub22' + uniqueNum
        };
        adminCommands.navigateToClientSetupTab();
        adminCommands.selectEnterPriseInClientSetupTab(enterprise)
        adminCommands.navigateToManageProducts();
        adminCommands.addProduct("DeviceHub");
        adminCommands.enterDeviceHubProductDetails(newDeviceHub);
        adminCommands.checkForProductsGetAddedd();
        adminCommands.deleteProduct();
    });
});
