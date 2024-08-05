import { OktaAuth } from '@okta/okta-auth-js';
import { formControls } from '../fixtures/shipping/formControls.json';
import 'cypress-localstorage-commands';
const crypto = require('crypto');
import { Helpers } from '../support/helpers';
import { config } from '../fixtures/adminPortal/adminConfig.json';

//import { waitForUser } from './app.po';

// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    //create .d.ts definitions file to get autocomplete.
    interface Chainable<Subject> {
      navigateToHomePage(): void;
      getUsers(): Chainable<AppUsers>;
      login(username: string, password: string): void;
      loginCC(username: string, password: string, ...args): any;
      loginSSTO(username: string, password: string, ...args): any;
      visitSSTOLanding(): any;
      getByInputPlaceHolder(selector: string): Chainable<string>;
      forceClick(): any;
      getElements(query: String, options?: any): any;
      waitForSpinners(): any;
      findChildElement(query: String): any;
      isElementPresent(query: String): any;
      isElementVisible(query: String): any;
      isElementHidden(query: String): any;
      isElementDisabled(query: String): any;
      isElementEnabled(query: String): any;
      checkIfCorrectUser_reLogIfNot(username: string, password: string, user: any): any;
      preserveSessionCookie(): void;
      waitForLocalStorage(key: string): any;
      ccLog(message: any): any;
      encrypt(text: String): any;
      decrypt(text: String): any;

    }
  }
}

interface Cookie {
  name: string;
  value: string;
  domain: string;
  expires: number;
  httpOnly: boolean;
  path: string;
  secure: boolean;
}

interface LoginTaskResponse {
  cookies: Cookie[];
}

Cypress.Commands.add('navigateToHomePage', () => {
  cy.visit('/');
  cy.waitForSpinners();
  cy.get('#create_shipping_label', { timeout: 10000 }).should('be.visible');
  cy.get('button[aria-label="Settings"]', { timeout: 10000 }).should('be.visible');
  cy.waitForSpinners();
});
//
// -- This is a parent command --
Cypress.Commands.add('login', (username, password) => {
  // Login via puppeteer
  const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
  const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
  const screenshotsFolder = Cypress.config('screenshotsFolder');
  Helpers.log(`Logging into ${loginUrl} with ${username}`);
  cy.task(
    'puppeteerLogin_newWay',
    { username, password, loginUrl, screenshotsFolder, screenshotOnError: true },
    { timeout: 90000 }
  ).then(({ cookies }: LoginTaskResponse) => {
    const cookie = cookies?.filter((cookie) => cookie.name === sessionCookieName).pop();
    if (cookie) {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure
        });
      })

    } else {
      throw new Error('User was unable to login');
    }
  });
  cy.navigateToHomePage();
});

//Function for log in by using UI login page without external framework
Cypress.Commands.add('loginCC', (username, password, ...args) => {
  const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
  const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';

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
      cy.wait(2000);
      cy.waitForSpinners();
      cy.wait(5000);
      cy.waitForSpinners();
      //When we visit LOGIN URL we expect that we will see LOGIN screen ... but sometimes we already logged  in ...
      //Because of that we have to be sure where we are .... by checking... because we could be on LOGIN PAGE or HOME PAGE

      //Here we get all body and ....
      cy.get('body').then(($body) => {
        //check if #create_shipping_label is in the DOM...
        if ($body.find('#create_shipping_label').length) {
          //If shipping label is visible after visit main page means, that user is already logged
          Helpers.log(`Logged as user: ${username}`);

          //But when label is not visible... it means that for some reason we are not in the home page... so that we check
          //if password is in the DOM...
        } else if ($body.find('#password').length) {
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
                  cy.get("a[aria-label='PitneyShip Pro']", { timeout: 10000 }).should('be.visible');
                  cy.waitForSpinners();
                  Helpers.log(`Logged as user: ${username}`);
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
      cy.waitForSpinners();
      cy.get('body').then(($body) => {
        //Again we get body and check that username is visible (just to be sure)
        if ($body.find('#username').length) {
          cy.get('#username').type(username); // set the data....
          cy.get('#password').type(password, { log: false });
          cy.get('#signinButton')
            .click() // click and wait...
            .then((_) => {
              cy.xpath("//*[contains(@class,'loading-screen')]", { timeout: 10000 }).should('have.length', 0);
              // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
              //cy.xpath("//*/a[contains(text(), 'SendPro')]", { timeout: 10000 }).should('be.visible');
              cy.get("a[aria-label='PitneyShip Pro']", { timeout: 10000 }).should('be.visible');
              cy.waitForSpinners();
              cy.log(`Logged as user: ${username}`);
            });
        }
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
  }
  //Here we are totally sure that we are in!
});

Cypress.Commands.add('visitSSTOLanding', (username, password, ...args) => {
  cy.visit('https://spa-ssto2-ui-dev.sendpro360.pitneycloud.com/receiving');
  // cy.get('spa-root.site-root', { timeout: 80000 }).should('exist').should('be.visible');
  // cy.get("a[aria-label='PitneyShip Pro']", { timeout: 10000 }).should('be.visible');
  // cy.get("spa-header-logged-in", { timeout: 50000 }).should('be.visible');
  cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 }).should('be.visible');
  cy.contains('Receive Packages').should('be.visible');
});

Cypress.Commands.add('preserveSessionCookie', () => {
  // const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
  // Cypress.Cookies.preserveOnce(sessionCookieName);
});

Cypress.Commands.add('waitForLocalStorage', (key: string) => {
  cy.getLocalStorage('enterpriseID').then(($id) => {
    if ($id) return cy.wrap(true);
    else cy.wait(3000);
    return cy.wrap(false);
  });
});


Cypress.Commands.add('getUsers', () => {
  const env = Cypress.env('appEnv') || 'dev';
  console.log('getUsers', env);
  return cy.fixture(`users/${env}/users`);
});

// -- This is a parent command --
Cypress.Commands.add('loginx', (username, password) => {
  cy.request({
    method: 'POST',
    url: Cypress.env('authnUrl'),
    failOnStatusCode: false,
    retryOnNetworkFailure: true,
    body: {
      username,
      password
    }
  }).then(({ body }) => {
    const config = {
      issuer: Cypress.env('authIssuer'),
      clientId: Cypress.env('authClientId'),
      redirectUri: Cypress.env('authRedirectUri'),
      scope: Cypress.env('authScope').split(' ')
    };

    const authClient = new OktaAuth(config);

    return authClient.token.getWithoutPrompt({ sessionToken: body.sessionToken }).then(() => {
      cy.request({
        url: Cypress.env('authRedirectUri'),
        failOnStatusCode: false,
        retryOnNetworkFailure: true
      }).then(() => {
        cy.visit('/sending').contains('SendPro');
      });
    });
  });
});

Cypress.Commands.add('getByInputPlaceHolder', (selector, ...args) => {
  return cy.get(`input[placeholder=${selector}]`, ...args);
});

Cypress.Commands.add('forceClick', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click({ force: true });
});

Cypress.Commands.add('getElements', (query, options?) => {
  return cy.get(formControls[query], options);
});

Cypress.Commands.add('findChildElement', { prevSubject: true }, (subject, key: any) => {
  return cy.wrap(subject).find(formControls[key]);
});

Cypress.Commands.add('getElement', (selector) => {
  return cy.get(selector);
});

Cypress.Commands.add('waitForSpinners', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.loading-screen-spinner').length) {
      cy.get('.loading-screen-spinner', { timeout: 30000 }).should('have.length', 0);
    }
    if ($body.find('pbi-loader-circle').length) {
      cy.get('.pbi-loader-circle', { timeout: 20000 }).should('have.length', 0);
    }
    if ($body.find('spinner').length) {
      cy.xpath('spinner', { timeout: 20000 }).should('have.length', 0);
    }
    if ($body.find('spinner').length) {
      cy.xpath('loading', { timeout: 20000 }).should('have.length', 0);
    }
  });
});

Cypress.Commands.add('isElementPresent', (query, timeout = 5000) => {
  cy.get('body').then(($body) => {
    if ($body.find(formControls[query]).length) return cy.wrap(true);
    else {
      cy.wait(timeout);
      cy.get('body').then(($body) => {
        if ($body.find(formControls[query]).length) return cy.wrap(true);
        else {
          Helpers.log(`Element ${query} not Present in DOM`);
          return cy.wrap(false);
        }
      });
    }
  });
});

Cypress.Commands.add('isChildElementPresent', { prevSubject: true }, (subject, query) => {
  cy.wrap(subject).then(($body) => {
    if ($body.find(formControls[query]).length) return cy.wrap(true);
    else {
      Helpers.log(`Element ${query} not Present in DOM`);
      return cy.wrap(false);
    }
  });
});

Cypress.Commands.add('isElementVisible', (query, timeout = 3000) => {
  cy.get('body').then(($body) => {
    if ($body.find(formControls[query]).is(':visible')) return cy.wrap(true);
    else {
      cy.wait(timeout);
      cy.get('body').then(($body) => {
        if ($body.find(formControls[query]).is(':visible')) return cy.wrap(true);
        else {
          Helpers.log(`Element ${formControls[query]} not Visible in DOM`);
          return cy.wrap(false);
        }
      });
    }
  });
});

Cypress.Commands.add('isChildElementVisible', { prevSubject: true }, (subject, query: any) => {
  cy.wrap(subject).then(($body) => {
    if ($body.find(formControls[query]).length) {
      cy.wrap(subject)
        .find(formControls[query])
        .then(($body) => {
          if ($body.is(':visible')) {
            Helpers.log(`Element ${query} visible in DOM`);
            return cy.wrap(true);
          } else {
            Helpers.log(`Element ${query} not Visible in DOM`);
            return cy.wrap(false);
          }
        });
    } else {
      return cy.wrap(false);
    }
  });
});

Cypress.Commands.add('isElementHidden', (query) => {
  cy.get('body').then(($body) => {
    if ($body.find(formControls[query]).is(':hidden')) return cy.wrap(true);
    else {
      Helpers.log(`Element ${query} not Hidden in DOM`);
      return cy.wrap(false);
    }
  });
});

Cypress.Commands.add('isElementEnabled', (query) => {
  cy.get('body').then(($body) => {
    if ($body.find(formControls[query]).is(':enabled')) return cy.wrap(true);
    else {
      Helpers.log(`Element ${query} not Hidden in DOM`);
      return cy.wrap(false);
    }
  });
});

Cypress.Commands.add('isElementDisabled', (query) => {
  cy.get('body').then(($body) => {
    if ($body.find(formControls[query]).is(':disabled')) return cy.wrap(true);
    else {
      Helpers.log(`Element ${query} not Hidden in DOM`);
      return cy.wrap(false);
    }
  });
});

Cypress.Commands.add('ccLog', (message) => {
  cy.task('ccLog', message);
});

Cypress.Commands.add('encrypt', (text) => {
  const IV = crypto.randomBytes(8).toString('hex');
  let cipher = crypto.createCipheriv('aes-256-cbc', Cypress.env('appKey'), IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return IV + encrypted;
});

Cypress.Commands.add('decrypt', (encText) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Cypress.env('appKey'), encText.substring(0, 16));
  let decrypted = decipher.update(encText.substring(16), 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});

