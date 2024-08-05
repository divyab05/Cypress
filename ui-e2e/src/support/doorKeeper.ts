//import {usersData} from "ui-e2e/src/fixtures/onboarding/users.json";
import { config } from "../fixtures/adminPortal/adminConfig.json";
import { adminFormControls } from "../fixtures/adminPortal/adminFormControls.json";
import { Helpers } from "ui-e2e/src/support/helpers";

export class DoorKeeperClient {
  private helpers = new Helpers();

  public loginClient(username, password, extra?) {
    if(Cypress.env('appEnv') === 'prod') {
      username = Cypress.env('prodUser'); //user_prod_us@yopmail.com
      password = Cypress.env('prodPass');
    }
    const sessionCookieName = Cypress.env("sessionCookieName") || "connect.sid";
    const xsrf_token = "XSRF-TOKEN";
    const loginUrl = `${config[Cypress.env('appEnv')]['baseUrl']}`;
    cy.log(`Logging into ${loginUrl}`);
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    const env = Cypress.env("appEnv");
    Helpers.log(`Base URL: ${loginUrl}`);
    switch (env) {
      case "qa":
        this.loginByPuppeteerNewWay(username, password, loginUrl);
        // if(goHome) {
        this.helpers.navigateToHomePage(loginUrl);
        // }
        break;
      case "ppd":
        this.loginByPuppeteerNewWay(username, password, loginUrl);
        break;
      case "prod":
        this.loginByPuppeteerNewWay(username, password, loginUrl);
        break;
      case "cappd":
        this.loginByPuppeteerNewWay(username, password, loginUrl);
        break;
      case "fedppd":
        this.loginUsByUI(username, password,loginUrl);
        break;
      case "feddev":
        this.loginUsByUI(username, password,loginUrl);
        break;
      case "dev":
        this.loginUsByUI(username, password,loginUrl);
        break;
      case "fedqa":
        this.loginUsByUI(username, password, loginUrl);
        break;
      default:
        this.loginByPuppeteerNewWay(username, password, loginUrl);
        break;
    }
    // this.helpers.navigateToHomePage(loginUrl);
    cy.getCookies().then((cookies) => {
      const cookie = cookies
        ?.filter((cookie) => cookie.name === sessionCookieName)
        .pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
          log: false,
        });
      }
      const xsrf_cookie = cookies
        ?.filter((cookie) => cookie.name === xsrf_token)
        .pop();
      if (xsrf_cookie) {
        cy.setCookie(
          xsrf_cookie.name,
          xsrf_cookie.value, {
            domain: xsrf_cookie.domain,
            httpOnly: xsrf_cookie.httpOnly,
            path: xsrf_cookie.path,
            secure: xsrf_cookie.secure,
            log: false
          });
      }
      cy.preserveSessionCookie();
    });
  }

  // private loginUsByUI(username, password,loginUrl, ...args){
  //     cy.visit(loginUrl); // Navigate to main page and wait - waits are because page are reloaded few times...
  //     cy.wait(500);
  //     this.helpers.waitForSpinners_2_0();
  //     cy.wait(2500);
  //     this.helpers.waitForSpinners_2_0();
  //
  //     this.helpers.findElementInBody('#password').then(found => {
  //         if(found){
  //             this.loginByUI_oldWay(loginUrl, username, password, ...args);
  //         } else {
  //             this.loginByUI_newWay(loginUrl, username, password, ...args);
  //         }
  //     })
  // }

  public loginUsByUI(username, password, loginUrl) {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    // cy.visit('/api/auth/logout?issuer=OKTA_SSO')      // logout and login every spec
    cy.visit(loginUrl); // Navigate to main page and wait - waits are because page are reloaded few times...
    cy.wait(500);
    this.helpers.waitForSpinners_2_0();
    cy.wait(2500);
    this.helpers.waitForSpinners_2_0();

    this.helpers.sendTextForLogin("//*[@autocomplete=\"username\"]", username).then((_) => {
      'tu byl cy.wait(500)';
      this.helpers.click("//*[@type=\"submit\"]").then((_) => {
        'tu byl cy.wait(500)';
        this.helpers.sendTextForLogin("//*[@type=\"password\"]", password).then((_) => {
          'tu byl cy.wait(500)';
          this.helpers.click("//*[@type='submit']");
        });
      });
    });
    // and wait.....
    cy.wait(1500);
    // this.helpers.getElement("//*[contains(@class,'loading-screen')]").should("have.length", 0);
    // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
    // cy.xpath("//*[contains(@class,'navbar-brand')]", { timeout: 10000 }).should('be.visible');
    Helpers.log(`Logged as user: ${username}`);
    cy.wait(3000);
    this.helpers.findElementInBody(".mat-dialog-actions .btn-page-secondary").then(
      (found) => {
        if (found) {
          this.helpers.forceClick(adminFormControls.buttons.agree);
        }
      }
    );
  }

  public logoutUser() {
    // Helpers.log("Logging out");
    // const loginUrl = Cypress.config("baseUrl");
    // //const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
    // cy.visit(loginUrl + '/logout');
    // if (Cypress.env("appEnv").includes("fedppd")) {
    //   cy.wait(15000);
    // } else {
    //   cy.wait(5000);
    // }
  }

  private loginByPuppeteerNewWay(username, password, loginUrl) {
    const sessionCookieName = Cypress.env("sessionCookieName") || "connect.sid";
    const xsrf_token = "XSRF-TOKEN";
    const screenshotsFolder = Cypress.config("screenshotsFolder");
    cy.log(`Logging into ${loginUrl} with ${username}`);
    cy.task(
      "puppeteerLogin_newWay",
      {
        username,
        password,
        loginUrl,
        screenshotsFolder,
        screenshotOnError: true,
      },
      { timeout: 90000 }
    ).then(({ cookies }) => {
      const session_cookie = cookies
        ?.filter((cookie) => cookie.name === sessionCookieName)
        .pop();
      if (session_cookie) {
        cy.setCookie(session_cookie.name, session_cookie.value, {
          domain: session_cookie.domain,
          expiry: session_cookie.expires,
          httpOnly: session_cookie.httpOnly,
          path: session_cookie.path,
          secure: session_cookie.secure,
        });
        const xsrf_cookie = cookies
          ?.filter((cookie) => cookie.name === xsrf_token)
          .pop();
        if (xsrf_cookie) {
          cy.setCookie(
            xsrf_cookie.name,
            xsrf_cookie.value, {
              domain: xsrf_cookie.domain,
              httpOnly: xsrf_cookie.httpOnly,
              path: xsrf_cookie.path,
              secure: xsrf_cookie.secure,
              log: false
            });
        }

        // Cypress.Cookies.defaults({
        //     preserve: sessionCookieName,
        // });
        cy.preserveSessionCookie();

      }

      const xsrf_cookie = cookies
        ?.filter((cookie) => cookie.name === xsrf_token)
        .pop();
      if (xsrf_cookie) {
        cy.setCookie(
          xsrf_cookie.name,
          xsrf_cookie.value, {
            domain: xsrf_cookie.domain,
            expiry: xsrf_cookie.expires,
            httpOnly: xsrf_cookie.httpOnly,
            path: xsrf_cookie.path,
            secure: xsrf_cookie.secure,
          });

        // Cypress.Cookies.defaults({
        //     preserve: xsrf_cookie,
        // });
      } else {
        throw new Error("User was unable to login");
      }
    });
    // this.helpers.navigateToHomePage(loginUrl);
  }

}

export class DoorKeeperOnboarding {
  private helpers = new Helpers();

  //Function for log in by using UI login page without external framework
  public loginAdmin(username, password, loginUrl) {
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    //const loginUrl = usersData[Cypress.env('appEnv')]['URL'];
    //const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200'
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    this.loginByPuppeteerNewWay(username, password, loginUrl);

    // switch (Cypress.env('appEnv')) {
    //     case 'fedqa':
    //         this.loginByPuppeteerNewWay(username, password, loginUrl);
    //         break;
    //     default:
    //         this.loginByPuppeteerNewWay(username, password, loginUrl);
    //         break;
    // }
    cy.wait(5000)
    //Here we are totally sure that we are in!
  }

  public logByUsingUI(username: string, password: string, ...args) {
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    // const loginUrl =
    //   usersData[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';
    const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';

    // Clear data to be sure that there are only clear browser
    cy.log(`Logging into ${loginUrl} with ${username}`);
    cy.clearCookies();
    cy.clearCookie(sessionCookieName);
    cy.clearLocalStorage();
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();


    //Just after click RUN we expect that this will be first try to log in to the application...
    //That's why first step on each Before tests is just:     cy.login(user.username, user.password);
    if (args[0] === undefined) {
      cy.visit(loginUrl); // Navigate to main page and wait - waits are because page are reloaded few times...
      cy.wait(2000);
      this.helpers.waitForSpinners_2_0();
      cy.wait(5000);
      this.helpers.waitForSpinners_2_0();
      //When we visit LOGIN URL we expect that we will see LOGIN screen ... but sometimes we already logged  in ...
      //Because of that we have to be sure where we are .... by checking... because we could be on LOGIN PAGE or HOME PAGE

      //Here we get all body and ....
      cy.get('body').then(($body) => {
        //check if #create_shipping_label is in the DOM...
        if ($body.find('#Account').length) {
          //If shipping label is visible after visit main page means, that user is already logged
          cy.log(`Logged as user: ${username}`);

          //But when label is not visible... it means that for some reason we are not in the home page... so that we check
          //if password is in the DOM...
        } else if ($body.find('#password').length) {
          // We wait for this password....
          cy.get('#password', { timeout: 10000 }).should('exist');
          // and wait for all spinners disappear...
          this.helpers.waitForSpinners_2_0();
          //Here we are sure that password is visible....
          cy.get('body').then(($body) => {
            //So we check if username input is also visible.. and if yes we are put the data ...
            if ($body.find('#username').length) {
              cy.get('#username').type(username); // set username
              cy.get('#password').type(password, { log: false }); // set password and hide value
              cy.get('#signinButton') // click signIn button...
                .click()
                .then((_) => {
                  // and wait.....
                  cy.wait(1500);
                  // this.helpers.getElement("//*[contains(@class,'loading-screen')]").should('have.length', 0);
                  // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('exist');
                  this.helpers.getElement("//*[contains(text(),'360 Admin')]").should('exist');
                  this.helpers.waitForSpinners_2_0();
                  cy.log(`Logged as user: ${username}`);
                });
            }
            //After this we are sure, that we are in the application.....
          });
        }
      });
      //BUT ... as I mentioned .... cypress run application and user is already logged... so we have to check it by using
      //checkIfCorrectUser_reLogIfNot function....

      //We check and it looks we have to log again in 100%
    } else if (args[0] !== undefined) {
      this.helpers.waitForSpinners_2_0();
      cy.get('body').then(($body) => {
        //Again we get body and check that username is visible (just to be sure)
        if ($body.find('#username').length) {
          cy.get('#username').type(username); // set the data....
          cy.get('#password').type(password, { log: false });
          cy.get('#signinButton')
            .click() // click and wait...
            .then((_) => {
              cy.wait(1500)
              // this.helpers.getElement("//*[contains(@class,'loading-screen')]").should('have.length', 0);
              // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('exist');
              //cy.xpath("//*/a[contains(text(), 'SendPro')]", { timeout: 10000 }).should('exist');
              this.helpers.getElement("//*[contains(text(),'360 Admin')]").should('exist');
              this.helpers.waitForSpinners_2_0();
              cy.log(`Logged as user: ${username}`);
            });
        }
      });
    }
    //Here we set session coookie to be sure that after first IT user will be still in the application... by default it will be restarted and user
    //will be logout...
    cy.getCookies().then((cookies) => {
      const cookie = cookies
        ?.filter((cookie) => cookie.name === sessionCookieName)
        .pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
          log: false,
        });
        cy.preserveSessionCookie();
      }
    });
  }

  private loginAdminPpd(username, password, loginUrl) {
    const sessionCookieName = Cypress.env("sessionCookieName") || "connect.sid";
    const screenshotsFolder = Cypress.config("screenshotsFolder");
    const xsrf_token = "XSRF-TOKEN";

    cy.log(`Logging into ${loginUrl} with ${username}`);
    cy.task(
      "puppeteerLogin",
      {
        username,
        password,
        loginUrl,
        screenshotsFolder,
        screenshotOnError: true,
      },
      { timeout: 90000 }
    ).then(({ cookies }) => {
      const cookie = cookies
        ?.filter((cookie) => cookie.name === sessionCookieName)
        .pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        });

        // Cypress.Cookies.defaults({
        //     preserve: sessionCookieName,
        // });
      } else {
        throw new Error("User was unable to login");
      }
      const xsrf_cookie = cookies
        ?.filter((cookie) => cookie.name === xsrf_token)
        .pop();
      if (xsrf_cookie) {
        cy.setCookie(
          xsrf_cookie.name,
          xsrf_cookie.value, {
            domain: xsrf_cookie.domain,
            httpOnly: xsrf_cookie.httpOnly,
            path: xsrf_cookie.path,
            secure: xsrf_cookie.secure,
            log: false
          });
      }

    });
    this.helpers.navigateToHomePage(loginUrl);
  }

  public loginAdminFedQa(username, password, loginUrl) {
    const sessionCookieName = Cypress.env("sessionCookieName") || "connect.sid";
    const screenshotsFolder = Cypress.config("screenshotsFolder");
    const xsrf_token = "XSRF-TOKEN";

    cy.log(`Logging into ${loginUrl} with ${username}`);
    cy.task(
      "puppeteerLogin_newWay",
      {
        username,
        password,
        loginUrl,
        screenshotsFolder,
        screenshotOnError: true,
      },
      { timeout: 90000 }
    ).then(({ cookies }) => {
      const cookie = cookies
        ?.filter((cookie) => cookie.name === sessionCookieName)
        .pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        });

        // Cypress.Cookies.defaults({
        //     preserve: sessionCookieName,
        // });
      } else {
        throw new Error("User was unable to login");
      }
      const xsrf_cookie = cookies
        ?.filter((cookie) => cookie.name === xsrf_token)
        .pop();

      if (xsrf_cookie) {
        cy.setCookie(
          xsrf_cookie.name,
          xsrf_cookie.value, {
            domain: xsrf_cookie.domain,
            httpOnly: xsrf_cookie.httpOnly,
            path: xsrf_cookie.path,
            secure: xsrf_cookie.secure,
            log: false
          });
      }

    });
    this.helpers.navigateToHomePage(loginUrl);
  }

  public logoutAdminUser() {
    Helpers.log("Logging out")
    // const loginUrl = usersData[Cypress.env('appEnv')]['URL'];
    // //const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
    // cy.visit(loginUrl + 'logout');
    // cy.wait(30000);
    // cy.get('#username', { timeout: 40000 }).should('be.visible');
    // //cy.wait(12000);

    this.helpers.click('//*[contains(text(),\'Admin Vendor\')]').then(_ => {
      this.helpers.click('//*[contains(@href,\'logout\')]');
      cy.wait(30000);
    })
  }

  public loginByUI_newWay(loginUrl, username, password, ...args) {
    this.helpers.waitForSpinners_2_0();
    this.helpers.sendTextForLogin("//*[@autocomplete=\"username\"]", username).then((_) => {
      'tu byl cy.wait(500)';
      this.helpers.click("//*[@type=\"submit\"]").then((_) => {
        'tu byl cy.wait(500)';
        this.helpers.sendTextForLogin("//*[@type=\"password\"]", password).then((_) => {
          'tu byl cy.wait(500)';
          this.helpers.click("//*[@type='submit']");
        });
      });
    });
    // and wait.....
    cy.wait(1500);
    // this.helpers.getElement("//*[contains(@class,'loading-screen')]").should("have.length", 0);
    // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
    // cy.xpath("//*[contains(@class,'navbar-brand')]", { timeout: 10000 }).should('be.visible');
    Helpers.log(`Logged as user: ${username}`);
    cy.wait(3000);
    this.helpers.findElementInBody(".mat-dialog-actions .btn-page-secondary").then(
      (found) => {
        if (found) {
          this.helpers.forceClick(adminFormControls.buttons.agree);
        }
      }
    );
  }

  private loginByPuppeteerNewWay(username, password, loginUrl) {
    const sessionCookieName = Cypress.env("sessionCookieName") || "connect.sid";
    const xsrf_token = "XSRF-TOKEN";
    const screenshotsFolder = Cypress.config("screenshotsFolder");
    cy.log(`Logging into ${loginUrl} with ${username}`);
    cy.task(
      "puppeteerLogin_newWay",
      {
        username,
        password,
        loginUrl,
        screenshotsFolder,
        screenshotOnError: true,
      },
      { timeout: 90000 }
    ).then(({ cookies }) => {
      const session_cookie = cookies
        ?.filter((cookie) => cookie.name === sessionCookieName)
        .pop();
      if (session_cookie) {
        cy.setCookie(session_cookie.name, session_cookie.value, {
          domain: session_cookie.domain,
          expiry: session_cookie.expires,
          httpOnly: session_cookie.httpOnly,
          path: session_cookie.path,
          secure: session_cookie.secure,
        });
      }
      const xsrf_cookie = cookies
        ?.filter((cookie) => cookie.name === xsrf_token)
        .pop();
      if (xsrf_cookie) {
        cy.setCookie(
          xsrf_cookie.name,
          xsrf_cookie.value, {
            domain: xsrf_cookie.domain,
            httpOnly: xsrf_cookie.httpOnly,
            path: xsrf_cookie.path,
            secure: xsrf_cookie.secure,
            log: false
          });
      }
    });

        // Cypress.Cookies.defaults({
        //     preserve: sessionCookieName,
        // });
        // cy.preserveSessionCookie();


        // Cypress.Cookies.defaults({
        //     preserve: xsrf_cookie,
        // });
    this.helpers.navigateToHomePage(loginUrl);
  }


  public loginUsByUI_cc(username, password, loginUrl, ...args) {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    // cy.visit('/api/auth/logout?issuer=OKTA_SSO')      // logout and login every spec
    cy.visit(loginUrl); // Navigate to main page and wait - waits are because page are reloaded few times...
    cy.wait(500);
    this.helpers.waitForSpinners_2_0();
    cy.wait(2500);
    this.helpers.waitForSpinners_2_0();

    this.helpers.sendTextForLogin("//*[@autocomplete=\"username\"]", username).then((_) => {
      'tu byl cy.wait(500)';
      this.helpers.click("//*[@type=\"submit\"]").then((_) => {
        'tu byl cy.wait(500)';
        this.helpers.sendTextForLogin("//*[@type=\"password\"]", password).then((_) => {
          'tu byl cy.wait(500)';
          this.helpers.click("//*[@type='submit']");
        });
      });
    });
    // and wait.....
    cy.wait(1500);
    // this.helpers.getElement("//*[contains(@class,'loading-screen')]").should("have.length", 0);
    // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
    // cy.xpath("//*[contains(@class,'navbar-brand')]", { timeout: 10000 }).should('be.visible');
    Helpers.log(`Logged as user: ${username}`);
    cy.wait(3000);
    this.helpers.findElementInBody(".mat-dialog-actions .btn-page-secondary").then(
      (found) => {
        if (found) {
          this.helpers.forceClick(adminFormControls.buttons.agree);
        }
      }
    );
  }




}
