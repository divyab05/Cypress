///<reference types="cypress" />
import { config } from '../../../fixtures/adminSupportPortal/adminSupportConfig.json';
import { SupportConsoleCommands } from '../../../support/adminSupportPortal/supportConsoleCommands';
import { Helpers } from '../../../support/helpers';
import { supportFormControls } from '../../../fixtures/adminSupportPortal/supportFormControls.json';
import { supportInterceptApiCalls } from '../../../utils/adminSupport_portal/support_intercept_routes';

describe('Test Suite :: Add Support User tests', () => {
  const user = config[Cypress.env('appEnv')]['admin_user_TeamRole'];
  const supportConsoleCommands = new SupportConsoleCommands();
  const helpers = new Helpers();

  beforeEach(() => {
    Helpers.log('------------------------------Test is starting here-------------------------------');
    helpers.loginAdminConsole(user.userEmail, user.password);
    supportConsoleCommands.navigateToSupportTab();
    supportConsoleCommands.clickManageUsers();
    supportInterceptApiCalls();
  });

  afterEach(() => {
    Helpers.log('------------------------------Test ends here-------------------------------');
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  });
  it(`<@supportconsole>TC001 - Add Product Support User - Advanced`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'Advance' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    supportConsoleCommands.addProductSupportUser();
    supportConsoleCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    supportConsoleCommands.clickSaveAndClose();
    supportConsoleCommands.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    supportConsoleCommands.deleteSupportUser();
  });

  it(`<@supportconsole>TC002 - Add Product Support User - Basic`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'basic' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    supportConsoleCommands.addProductSupportUser();
    supportConsoleCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    supportConsoleCommands.selectBasicSupportRole();
    supportConsoleCommands.clickSaveAndClose();
    supportConsoleCommands.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    supportConsoleCommands.deleteSupportUser();
  });

  it(`<@supportconsole>TC003 - Add Product Support User - Team Lead`, function () {
    const uuidGenerator = () => Cypress._.random(0, 1e5);
    const uniqueName = `Auto${uuidGenerator()}`;
    const personalDetails = {
      firstName: uniqueName,
      lastName: 'User',
      displayName: uniqueName,
      email: 'TL' + uniqueName + '@mailinator.com',
      password: 'Horizon#123'
    };
    Helpers.log('------------------------------Test starts here-------------------------------');
    supportConsoleCommands.addProductSupportUser();
    supportConsoleCommands.typeFirstNameLastNameAndEmail(
      personalDetails.firstName,
      personalDetails.lastName,
      personalDetails.email);
    supportConsoleCommands.selectTeamLeadSupportRole();
    supportConsoleCommands.clickSaveAndClose();
    supportConsoleCommands.sendTextAndConfirm(supportFormControls.inputs.placeholderSearch, `${personalDetails.firstName} ${personalDetails.lastName}`);
    supportConsoleCommands.deleteSupportUser();
  });
});
