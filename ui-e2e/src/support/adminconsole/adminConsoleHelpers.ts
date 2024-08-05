import { Helpers } from "../helpers";
export var apiHeader = null;

export class adminConsoleHelpers {

  public static isThisElementPresent(query, timeout = 3000) {
    return new Cypress.Promise((resolve, reject) => {
      cy.get('body').then(($body) => {
        if ($body.find(query).length) resolve(true);
        else {
          cy.wait(timeout);
          cy.get('body').then(($body) => {
            if ($body.find(query).length) resolve(true);
            else {
              Helpers.log(`Element ${query} not Present in DOM`);
              resolve(false);
            }
          });
        }
      });
    });
  }

  public static isThisElementVisible(query, timeout = 3000) {
    return new Cypress.Promise((resolve, reject) => {
      cy.get('body').then(($body) => {
        if ($body.find(query).is(':visible')) resolve(true);
        else {
          cy.wait(timeout);
          cy.get('body').then(($body) => {
            if ($body.find(query).is(':visible')) resolve(true);
            else {
              Helpers.log(`Element ${query} not Visible in DOM`);
              resolve(false);
            }
          });
        }
      });
    });
  }

  public static ssoLogin(username, password) {
    const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
    if (loginUrl.includes('ppd') || loginUrl.includes('localhost')) {
      cy.login(username, password);
    } else {
      cy.session([username, password], () => {
        cy.visit(loginUrl, { timeout: 40000 });
        Helpers.log(`Visited the login url`);
        cy.waitForSpinners();
        // and wait for all spinners disappear...
        if (Cypress.env('appEnv').includes('fed')) {
          cy.get('#idp-discovery-username').type(username).wait(500);
          cy.get('#idp-discovery-submit').click().wait(500);
          //cy.get('#okta-signin-username').type(username).wait(500);
          cy.get('#okta-signin-submit').click().wait(500);
          cy.get("input[name='password']").type(password).wait(500);
          cy.get("input[type='submit']").click().wait(500);
          cy.wait(5000);
          cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
          cy.wait(2000);
          cy.get('body').then(($body) => {
            if ($body.find(("button:contains('Agree')")).length) {
              cy.xpath("//*/mat-dialog-actions//button[contains(text(),'Agree')]").forceClick();
            }
          });
          cy.get("a[aria-label='SendPro Three Sixty']", { timeout: 10000 }).should('be.visible');
          Helpers.log(`Logged as user: ${username}`);
        } else {
          cy.wait(3000);
          cy.get('body').then(($body) => {
            if ($body.find(('#password')).length) {
              cy.get('#username').type(username); // set username
              cy.get('#password').type(password, { log: false }); // set password and hide value
              cy.get('#signinButton') // click signIn button...
                .click()
                .then((_) => {
                  // and wait.....
                  cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
                  cy.waitForSpinners();
                  cy.get("a[href='/sending'].navbar-brand", { timeout: 50000 }).should('be.visible');
                  cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 })
                    .should('exist')
                  Helpers.log(`Logged as user: ${username}`);
                });
            } else {
              cy.get('#nextButton', { timeout: 50000 }).should('be.visible');
              cy.get('#username').type(username); // set username
              cy.get('#nextButton').click()
              cy.get('#password', { timeout: 10000 }).should('be.visible');
              cy.get('#password').type(password, { log: false }); // set password and hide value
              cy.get('#signinButton') // click signIn button...
                .click()
                .then((_) => {
                  // and wait.....
                  cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
                  cy.waitForSpinners();
                  cy.get("a[href='/sending'].navbar-brand", { timeout: 50000 }).should('be.visible');
                  cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 })
                    .should('exist')
                  Helpers.log(`Logged as user: ${username}`);
                });

            }
          });
        }
      });
    }
    cy.visit('/');
    cy.wait(6000);
    if (Cypress.env('appEnv').includes('fed'))
      cy.get('body').then(($body) => {
        if ($body.find(("button:contains('Agree')")).length) {
          cy.xpath('//*/mat-dialog-container//*/button[contains(text(),\'Agree\')]').forceClick();
        }
      });
    cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 })
      .should('exist');
    cy.get('button[aria-label="Settings"]', { timeout: 30000 }).should('be.visible');
    cy.waitForSpinners();
  }

  public static loginNonFed(username, password) {
    cy.get('body').then(($body) => {
      //check if #create_shipping_label is in the DOM...
      if ($body.find('#create_shipping_label').length) {
        //If shipping label is visible after visit main page means, that user is already logged
        Helpers.log(`Logged as user: ${username}`);

        //But when label is not visible... it means that for some reason we are not in the home page... so that we check
        //if password is in the DOM...
      } else if ($body.find('#username').length) {
        cy.get('#username', { timeout: 10000 }).should('be.visible');
        // and wait for all spinners disappear...
        cy.waitForSpinners();
        //Here we are sure that password is visible....
        cy.get('body').then(($body) => {
          //So we check if username input is also visible.. and if yes we are put the data ...
          if ($body.find('#nextButton').length) {
            cy.get('#username').type(username);
            cy.get('#nextButton')
              .click() // click and wait...
              .then((_) => {
                //if ($body.find('#username').length) {
                //cy.get('#username').type(username); // set username
                cy.get('#password', { timeout: 100000 }).should('be.visible');
                cy.get('#password').type(password, { log: false }); // set password and hide value
                cy.get('#signinButton') // click signIn button...
                  .click()
                  .then((_) => {
                    // and wait.....
                    cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
                    // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
                    cy.get("a[href='/sending'].navbar-brand", { timeout: 50000 }).should('be.visible');
                    cy.waitForSpinners();
                    Helpers.log(`Logged as user: ${username}`);
                  });

                //After this we are sure, that we are in the application.....
              });
          } else {
            // We wait for this password....
            cy.get('#password', { timeout: 10000 }).should('be.visible');
            // and wait for all spinners disappear...
            cy.waitForSpinners();
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
                    cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
                    // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
                    cy.get("a[href='/sending'].navbar-brand", { timeout: 50000 }).should('be.visible');
                    cy.waitForSpinners();
                    Helpers.log(`Logged as user: ${username}`);
                  });
              }
              //After this we are sure, that we are in the application.....
            });

          }
        });
      }
    });
  }

  //Function for log in by using UI login page without external framework
  public static loginCC(username: string, password: string, ...args) {
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    //If appEnv is ppd -> we have to use puppeteer
    if (Cypress.env('appEnv') === 'ppd') {
      cy.login(username, password);
    } else {
      // Clear data to be sure that there are only clear browser
      Helpers.log(`Logging into ${loginUrl} with ${username}`);
      cy.clearCookies();
      cy.clearCookie(sessionCookieName);
      cy.clearLocalStorage();

      //Just after click RUN we expect that this will be first try to log in to the application...
      //That's why first step on each Before tests is just:     cy.login(user.username, user.password);
      if (args[0] === undefined) {
        cy.visit(loginUrl); // Navigate to main page and wait - waits are because page are reloaded few times...
        cy.wait(5000);
        cy.waitForSpinners();
        //When we visit LOGIN URL we expect that we will see LOGIN screen ... but sometimes we already logged  in ...
        //Because of that we have to be sure where we are .... by checking... because we could be on LOGIN PAGE or HOME PAGE
        //Here we get all body and ....
        adminConsoleHelpers.loginNonFed(username, password);

        //BUT ... as I mentioned .... cypress run application and user is already logged... so we have to check it by using
        //checkIfCorrectUser_reLogIfNot function....
        //We check and it looks we have to log again in 100%
      } else if (args[0] !== undefined) {
        cy.waitForSpinners();
        //Again we get body and check that username is visible (just to be sure)
        cy.wait(3000);
        cy.get('#nextButton', { timeout: 50000 }).should('be.visible');
        cy.get('#username').type(username); // set username
        cy.get('#nextButton').click().wait(2000);
        cy.get('#password', { timeout: 100000 }).should('be.visible');
        cy.get('#password').type(password, { log: false }); // set password and hide value
        cy.get('#signinButton') // click signIn button...
          .click()
          .then((_) => {
            // and wait.....
            cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
            cy.waitForSpinners();
            cy.get("a[href='/sending'].navbar-brand", { timeout: 50000 }).should('be.visible');
            Helpers.log(`Logged as user: ${username}`);
          });
      }
      //Here we set session coookie to be sure that after first IT user will be still in the application... by default it will be restarted and user
      //will be logout...
      cy.getCookies().then((cookies) => {
        const cookie = cookies?.filter((cookie) => cookie.name === sessionCookieName).pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
            log: false
          });
        }
      });

      cy.waitForSpinnerIcon();
      cy.wait(6000);
      cy.get('body').then(($body) => {
        if ($body.find('#pendo-guide-container div:nth-child(3) button').length) {
          cy.get('#pendo-guide-container div:nth-child(3) button', { timeout: 20000 }).should('be.visible').
            click({ force: true });
        } else if ($body.find('button[aria-label="Close"]').length) {
          cy.get("button[aria-label='Close']").click({ force: true });
        }
      });
      //Here we are totally sure that we are in!
    }

    //XSRF token has been implemented only for Commercial. So, For fedramp, we are passing null.
    if (Cypress.env('appEnv').includes('fed')) {
      apiHeader = null;
      cy.wrap(apiHeader).as('XSRFToken');
    } else {
      cy.getCookie("XSRF-TOKEN").then((xsrfToken) => {
        apiHeader = {
          "X-XSRF-TOKEN": xsrfToken.value
        }
        Helpers.log(`API Header - XSRF Token is ${apiHeader}`);
        cy.wrap(apiHeader).as('XSRFToken');
      });
    }

  }

  public static loginViaUrl(username, password) {
    const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
    if ((loginUrl.includes('ppd') && !(loginUrl.includes('ppd.sendpro360gov'))) || loginUrl.includes('localhost')) {
      cy.login(username, password);
    } else {
      const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid'
      cy.clearCookies();
      cy.clearCookie(sessionCookieName);
      cy.clearCookies();
      Helpers.log(`Logging with ${username}`);
      cy.session([username, password], () => {
        cy.visit(loginUrl, { timeout: 40000 });
        Helpers.log(`Puppetter Visited the login url ==> ${loginUrl}`);
        cy.waitForSpinners();
        // and wait for all spinners disappear...
        if (Cypress.env('appEnv').includes('fed')) {
          cy.get('#idp-discovery-username').type(username).wait(500);
          cy.get('#idp-discovery-submit').click().wait(500);
          cy.get('#okta-signin-password').type(password).wait(500);
          cy.get('#okta-signin-submit').click().wait(500);
          cy.wait(5000);
          cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
          cy.get('body').then(($body) => {
            if ($body.find(("button:contains('Agree')")).length) {
              cy.xpath('//*/mat-dialog-container//*/button[contains(text(),\'Agree\')]').forceClick();
            }
          });
          cy.get("a[class='navbar-brand ng-star-inserted']", { timeout: 10000 }).should('be.visible');
          Helpers.log(`Logged as user: ${username}`);
        } else {
          cy.wait(3000);

          cy.get('#nextButton', { timeout: 50000 }).should('be.visible');
          cy.get('#username').type(username); // set username
          cy.get('#nextButton').click()
          cy.get('#password', { timeout: 100000 }).should('be.visible');
          cy.get('#password').type(password, { log: false }); // set password and hide value
          cy.get('#signinButton') // click signIn button...
            .click()
            .then((_) => {
              // and wait.....
              cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
              cy.waitForSpinners();
              cy.get("a[href='/sending'].navbar-brand", { timeout: 50000 }).should('be.visible');
              cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 })
                .should('exist')
              Helpers.log(`Logged as user: ${username}`);
            });
        }
      });
    }
    cy.visit('/');
    cy.wait(6000);
    if (Cypress.env('appEnv').includes('fed'))
      cy.get('body').then(($body) => {
        if ($body.find(("button:contains('Agree')")).length) {
          cy.xpath('//*/mat-dialog-container//*/button[contains(text(),\'Agree\')]').forceClick();
        }
      });
    cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 })
      .should('exist');
    cy.get('button[aria-label="Settings"]', { timeout: 30000 }).should('be.visible');
    cy.waitForSpinners();

    //XSRF token has been implemented only for Commercial. So, For fedramp, we are passing null.
    if (Cypress.env('appEnv').includes('fed')) {
      apiHeader = null;
      cy.wrap(apiHeader).as('XSRFToken');
    } else {
      cy.getCookie("XSRF-TOKEN").then((xsrfToken) => {
        apiHeader = {
          "X-XSRF-TOKEN": xsrfToken.value
        }
        Helpers.log(`API Header - XSRF Token is ${apiHeader}`);
        cy.wrap(apiHeader).as('XSRFToken');
      });
    }
  }

}
