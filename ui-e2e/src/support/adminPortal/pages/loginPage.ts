import { Helpers } from '../../helpers';
import { config } from '../../../fixtures/adminPortal/adminConfig.json';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';




export class LoginPage extends Helpers {

  public ssoUserLogin(username: string, password: string, sessionID) {
    const ssoLoginUrl = config[Cypress.env('appEnv')]['ssoLoginURL'];
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    cy.clearCookies();
    cy.clearCookie(sessionCookieName);
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    Helpers.log(`Logging with ${username}`);
    cy.session([username, password, sessionID], () => {
        cy.visit(ssoLoginUrl, {timeout: 90000});
        cy.waitForSpinners();
        Helpers.log(`Visited SSO login url`);
        this.type(adminFormControls.inputs.userName, username);
        this.click(adminFormControls.buttons.signInBtn).wait(5000);
        this.type(adminFormControls.inputs.ssoEmailInput, username);
        this.click(adminFormControls.buttons.ssoEmailNextBtn).wait(3000);
        this.type(adminFormControls.inputs.ssoPasswordInput, password);
        this.click(adminFormControls.buttons.ssoPasswordVerifyBtn).wait(5000);
        this.waitForSpinners();
        Helpers.log(`Logged as user: ${username}`);
    });
  }

  public ssoClientUserLoginProd(username: string, password: string, sessionID) {
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    const ssoLoginClientProdUrl = 'https://app.sendpro360.pitneybowes.com'
    cy.clearCookies();
    cy.clearCookie(sessionCookieName);
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    Helpers.log(`Logging with ${username}`);
    cy.session([username, password, sessionID], () => {
      cy.visit(ssoLoginClientProdUrl, {timeout: 90000});
      cy.waitForSpinners();
      Helpers.log(`Visited SSO login url`);
      this.type(adminFormControls.inputs.userName, username);
      this.click(adminFormControls.buttons.signInBtn).wait(15000);
      cy.realType(username);
      cy.realPress("Tab");
      cy.realPress("Enter");
      cy.wait(5000);
      cy.realType(password);
      cy.realPress("Tab");
      cy.realPress("Enter");
      cy.wait(5000);
      this.waitForSpinners();
      this.waitForSpinners();
      Helpers.log(`Logged as user: ${username}`);
    });
  }

  public oidcUserLogin(username: string, password: string, sessionID) {
    const ssoLoginUrl = config[Cypress.env('appEnv')]['ssoLoginURL'];
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    cy.clearCookies();
    cy.clearCookie(sessionCookieName);
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
    Helpers.log(`Logging with ${username}`);
    cy.session([username, password, sessionID], () => {
      cy.visit(ssoLoginUrl, {timeout: 150000});
      //cy.waitForSpinners();
      Helpers.log(`Visited SSO login url`);
      this.type(adminFormControls.inputs.userName, username);
      this.click(adminFormControls.buttons.signInBtn).wait(20000);
      cy.realType(username);
      cy.realPress("Tab");
      cy.realPress("Enter");
      cy.wait(5000);
      cy.realType(password);
      cy.realPress("Tab");
      cy.realPress("Enter");
      cy.wait(5000);
      this.waitForSpinners();
      Helpers.log(`Logged as user: ${username}`);
    });
  }

  public nonSSOUserLogin(username: string, password: string) {
    const nonSSOLoginUrl = config[Cypress.env('appEnv')]['clientURL'];
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid'
    cy.clearCookies();
    cy.clearCookie(sessionCookieName);
    cy.clearCookies();
    Helpers.log(`Logging with ${username}`);
    cy.session([username, password], () => {
      cy.visit(nonSSOLoginUrl, { timeout: 50000 });
      cy.waitForSpinners();
      Helpers.log(`Visited nonSSO login url`);
      this.type(adminFormControls.inputs.userName, username);
      this.click(adminFormControls.buttons.submitButton).wait(2000);
      this.type(adminFormControls.inputs.password, password);
      this.click(adminFormControls.buttons.submitButton).wait(2000);
      this.waitForSpinners();
      Helpers.log(`Logged as user: ${username}`);
    });
  }

}
