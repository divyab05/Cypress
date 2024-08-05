import { adminFormControls } from '../fixtures/adminPortal/adminFormControls.json';
import { config } from '../fixtures/adminPortal/adminConfig.json';
import Cookie = Cypress.Cookie;
import { format } from "util";
interface LoginTaskResponse {
  cookies: Cookie[];
}

export class Helpers {
  private cookies_: Cookie[];

  public static log(selectorOrMessage: string) {
    //cy.ccLog(`${new Date().toLocaleString()} -> ***${selectorOrMessage}***`);
    cy.log(`**${new Date().toLocaleString()} -> ${selectorOrMessage}**`);
  }

  public waitForSpinners() {
    cy.get('body').then(($body) => {
      if ($body.find('.loading-screen-spinner').length) {
        cy.get('.loading-screen-spinner', { timeout: 20000 }).should('have.length', 0);
      }
      if ($body.find('pbi-loader-circle').length) {
        cy.get('.pbi-loader-circle', { timeout: 20000 }).should('have.length', 0);
      }
      if ($body.find('spinner').length) {
        cy.xpath('spinner', { timeout: 20000 }).should('have.length', 0);
      }
      if ($body.find('loading').length) {
        cy.xpath('loading', { timeout: 20000 }).should('have.length', 0);
      }
    });
  }

  public waitForSpinnerIcon() {
    cy.get(adminFormControls.staticElements.spinnerIcon, { timeout: 90000 }).should('have.length', 0);
  }
  public checker(selector, condition, value, ...andOrSecondValue) {
    switch (condition) {
      case adminFormControls.condition.contains:
        Helpers.log(selector + ` --> should ${condition} : ${value}`);
        cy.xpath(selector, { timeout: 90000 }).contains(value);
        break;
      case adminFormControls.condition.isEmpty:
        Helpers.log(selector + ` --> should ${condition} : ${value}`);
        this.getText(selector).then(text => {
          expect(text).equals('');
        })
        break;
      case adminFormControls.condition.haveAttr:
        Helpers.log(selector + `--> should ${condition} : ${value} and ${andOrSecondValue[0]}, ${andOrSecondValue[1]}`);
        cy.xpath(selector, { timeout: 90000 }).should(condition, value)
          .and(andOrSecondValue[0], andOrSecondValue[1]);
        break;
      case adminFormControls.condition.stringEquals:
        if (value !== undefined) {
          Helpers.log(value + ` --> should ${condition} : ${andOrSecondValue[0]}`);
          expect(value).equals(andOrSecondValue[0]);
        }
        break;
      case adminFormControls.condition.stringNotEquals:
        Helpers.log(value + ` --> should ${condition} : ${andOrSecondValue[0]}`);
        expect(value).not.equals(andOrSecondValue[0]);
        break;
      case adminFormControls.condition.beDisabled:
        Helpers.log(value + ` --> should ${condition}`);
        cy.xpath(selector).should('be.disabled');
        break;
      case adminFormControls.condition.notBeDisabled:
        Helpers.log(value + ` --> should ${condition}`);
        cy.xpath(selector).should('not.be.disabled');
        break;
      case adminFormControls.condition.beVisible:
        Helpers.log(value + ` --> should ${condition}`);
        cy.xpath(selector).should('be.visible');
        break;
      case adminFormControls.condition.notExist:
        Helpers.log(value + ` --> should ${condition}`);
        cy.xpath(selector).should('not.exist', { timeout: 90000 });
        break;
      case adminFormControls.condition.unchecked:
        Helpers.log(value + ` --> should ${condition}`);
        cy.xpath(selector).should('not.be.checked', { timeout: 90000 });
        break;
      case adminFormControls.condition.checked:
        Helpers.log(value + ` --> should ${condition}`);
        cy.xpath(selector).should('be.checked', { timeout: 90000 });
        break;
      default:
        Helpers.log(selector + `--> should ${condition} : ${value}`);
        cy.xpath(selector, { timeout: 90000 }).should(condition, value);
        break;
    }
  }

  public click(selector: string, waitForSpinners?: boolean, howLongToWait?: number) {
    let spinnersTimeout = 15000
    if (howLongToWait !== null || undefined) spinnersTimeout = howLongToWait
    Helpers.log("Click on: " + selector);
    return this.getElement(selector).click({ force: true, multiple: true }).then(_ => {
      if (waitForSpinners === undefined) {
        this.waitForSpinners_2_0();
      } else if (waitForSpinners) {
        this.waitForSpinners_2_0(spinnersTimeout);
      }
    });
  }

  public waitForSpinners_2_0(timeout: number = 15000) {
    Helpers.log(`Wait for spinners`);
    const spinners = ['.loading-screen-spinner', '.pbi-loader-circle', 'spinner', 'loading', '.scale-spinner', '.ng-spinner-loader', '.input-autocomplete-loader'];
    cy.get("body").then(($body) => {
      spinners.forEach(spinner => {
        if ($body.find(spinner).length !== 0) {
          cy.get(spinner).should('have.lengthOf.lessThan', 1, { timeout: timeout });
        }
      });
    })
  }

  public getValue(selector: string) {
    Helpers.log(selector);
    return cy.xpath(selector).should('be.visible', { timeout: 9000 }).then(_ => {
      return cy.xpath(selector).invoke('val').then((val) => {
      });
    });
  }

  public getText(selector: string) {
    Helpers.log(selector);
    return cy.xpath(selector).should('be.visible', { timeout: 9000 }).then(_ => {
      return cy.xpath(selector).invoke('text').then((val) => {
      });
    });
  }

  public clear(selector: string) {
    Helpers.log(selector);
    return cy.xpath(selector).focus().clear();
  }

  public dbClick(selector: string) {
    Helpers.log(selector);
    return cy.xpath(selector).should('be.visible', { timeout: 9000 }).then(_ => {
      cy.xpath(selector).dblclick();
    });
  }

  public forceClick(selector: string) {
    Helpers.log(selector);
    return cy.xpath(selector).should('be.visible', { timeout: 9000 }).then(_ => {
      cy.xpath(selector).click({ force: true });
    });
  }

  public sendText(selector: string, text: string) {
    Helpers.log(selector);
    return cy.xpath(selector).should('exist', { timeout: 9000 }).then(_ => {
      cy.xpath(selector).focus().clear().type(text);
    });
  }

  // public sendTextAndConfirm(selector: string, text: string) {
  //   Helpers.log(selector);
  //   return cy.xpath(selector).should('exist', { timeout: 9000 }).then(_ => {
  //     cy.xpath(selector).focus().clear().type(String(text)).type('{enter}').then(_ => {
  //       this.waitForSpinners();
  //     });
  //   });
  // }

  public sendTextAndConfirm(selector: string, text: string, useXPath: boolean = true) {
    this.getElement(selector).focus().clear().wait(1000).type(String(text)).type('{enter}').then(_ => {
      this.waitForSpinners();
    });
  }

  public sortActivityLogTimeByDescending(timeColumn: number) {
    cy.get('body').then(($body) => {
      if ($body.find('thead > tr > th:nth-child(2)[aria-sort=\'descending\']').length) {
        cy.get(`thead > tr > th:nth-child(${timeColumn})`).click().then(_ => {
          this.sortActivityLogTimeByDescending(timeColumn);
        });
      } else if (!$body.find('thead > tr > th:nth-child(2)[aria-sort=\'descending\']').length) {
        cy.get(`thead > tr > th:nth-child(${timeColumn})`).click();
      }
    });
    cy.wait(500);
  }


  public closeModal() {
    Helpers.log('***Close modal start***');
    this.waitForSpinners();
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.find(adminFormControls.buttons.dismissModalCssId).length) {
        Helpers.log(adminFormControls.buttons.dismissModalCssId);
        cy.get(adminFormControls.buttons.dismissModalCssId).dblclick({ force: true });
      } else if ($body.find(adminFormControls.buttons.closeModalButtonCss).length) {
        Helpers.log(adminFormControls.buttons.closeModalButtonCss);
        cy.get(adminFormControls.buttons.closeModalButtonCss).dblclick({ force: true });
      } else if ($body.find(adminFormControls.buttons.closeModalButtonCss_2).length) {
        Helpers.log(adminFormControls.buttons.closeModalButtonCss_2);
        cy.get(adminFormControls.buttons.closeModalButtonCss_2).dblclick({ force: true });
      }
    });
    Helpers.log('***Close modal end***');
  }

  public selectCheckboxCy(xpath: string) {
    cy.wait(500);
    this.waitForElementExist(xpath);
    cy.xpath(xpath).check({ force: true })
  }

  public unSelectCheckboxCy(xpath: string) {
    this.waitForElementExist(xpath);
    cy.xpath(xpath).uncheck({ force: true })
  }

  public waitForElementNotExist(xpath: string) {
    cy.wait(100);
    this.checker(xpath, adminFormControls.condition.notExist, '');
  }

  public waitForElementIsVisible(xpath: string) {
    cy.wait(100);
    cy.xpath(xpath).should('be.visible', { timeout: 9000 });
  }

  public waitForElementExist(xpath: string) {
    cy.wait(100);
    cy.xpath(xpath).should('exist', { timeout: 9000 });
  }

  public waitForElementIsNotVisible(xpath: string) {
    cy.wait(100);
    cy.xpath(xpath).should('not.be.visible', { timeout: 9000 });
  }

  public waitAndCloseToast() {
    this.checker(adminFormControls.staticElements.toast, adminFormControls.condition.beVisible, '');
    cy.get('body').then(($body) => {
      if ($body.find(adminFormControls.buttons.dismissModalCssId).length) {
        cy.get('#toast-container').click({ force: true });
      }
    });
    this.checker(adminFormControls.staticElements.toast, adminFormControls.condition.notBeVisible, 1);
  }

  private loginAdminPpd(username, password, loginUrl) {
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    const screenshotsFolder = Cypress.config('screenshotsFolder');
    cy.log(`Logging into ${loginUrl} with ${username}`);
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
            expiry: cookie.expiry,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure
          });
        })

      } else {
        throw new Error('User was unable to login');
      }
    });
    this.navigateToHomePage(loginUrl);
  }

  public navigateToHomePage(loginUrl) {
    Helpers.log(`Navigating to Home Page`);
    cy.visit(loginUrl);
    this.waitForSpinners();
    cy.xpath('//*[contains(@class,\'loading-screen\')]', { timeout: 10000 }).should('have.length', 0);
    if (Cypress.env('appEnv').includes('fed'))
      cy.get('body').then(($body) => {
        if ($body.find(("button:contains('Agree')")).length) {
          cy.xpath('//*/mat-dialog-container//*/button[contains(text(),\'Agree\')]').forceClick();
        }
      });
    // cy.xpath("//*/a[contains(text(), 'Lockers')]", { timeout: 10000 }).should('be.visible');
    cy.xpath('//*[contains(@class,\'navbar-brand\')]', { timeout: 10000 }).should('be.visible');
    this.waitForSpinners();
  }

  public logoutUser() {
    Helpers.log("Logging out")
    const loginUrl = config[Cypress.env('appEnv')]['URL'];
    //const loginUrl = Cypress.config('baseUrl') || 'http://localhost:4200';
    cy.visit(loginUrl + '/logout');
    cy.get('#username', { timeout: 40000 }).should('be.visible');
    //cy.wait(12000);
  }

  //Function for log in by using UI login page without external framework
  public loginCC(username: string, password: string, ...args) {
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    const loginUrl = config[Cypress.env('appEnv')]['URL'] || 'http://localhost:4200';

    //If appEnv is ppd -> we have to use puppeteer
    if (Cypress.env('appEnv') === 'ppd') {
      this.loginAdminPpd(username, password, loginUrl);
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
          if ($body.find('#Account').length) {
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
                    cy.xpath("//*[contains(text(),'360 Admin')]", { timeout: 10000 }).should('be.visible');
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
                cy.xpath("//*[contains(text(),'360 Admin')]", { timeout: 10000 }).should('be.visible');
                cy.waitForSpinners();
                Helpers.log(`Logged as user: ${username}`);
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
          cy.preserveSessionCookie();
        }
      });
    }
    //Here we are totally sure that we are in!
  }

  public loginViaUrl(username, password) {
    const loginUrl = config[Cypress.env('appEnv')]['URL'];
    // cy.visit(loginUrl);
    const sessionCookieName = Cypress.env('sessionCookieName') || 'connect.sid';
    const screenshotsFolder = Cypress.config('screenshotsFolder');
    Helpers.log(`Logging into ${loginUrl} with ${username}`);
    cy.session([username, password], () => {
      cy.task(
        'puppeteerLogin',
        { username, password, loginUrl, screenshotsFolder, screenshotOnError: true },
        { timeout: 90000 }
      ).then(({ cookies }) => {
        const cookie = cookies?.filter((cookie) => cookie.name === sessionCookieName).pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure
          });
        } else {
          throw new Error('User was unable to login');
        }
      });
    });
    this.navigateToHomePage(loginUrl);
  }

  public loginAdminConsole(username, password) {
    const loginUrl = config[Cypress.env('appEnv')]['URL'];
    Helpers.log(`Logging with ${username}`);
    //If appEnv is ppd -> we have to use puppeteer
    if (Cypress.env('appEnv').includes('ppd')) {
      this.loginAdminPpd(username, password, loginUrl)
    }
    else {
      cy.session([username, password], () => {
        cy.visit(loginUrl, { timeout: 50000 });
        cy.waitForSpinners();
        Helpers.log(`Visited login url`);
        // and wait for all spinners disappear...
        if (Cypress.env('appEnv').includes('fed')) {
          cy.get('#idp-discovery-username', { timeout: 10000 }).type(username).wait(500);
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
          cy.xpath('//*[contains(@class,\'navbar-brand\')]', { timeout: 10000 }).should('be.visible');
          this.waitForSpinners();
        } else {
          cy.wait(3000);

          cy.get('#nextButton', { timeout: 50000 }).should('be.visible');
          cy.get('#username').type(username); // set username
          cy.get('#nextButton').click()
          cy.get('#password', { timeout: 50000 }).should('be.visible');
          cy.get('#password').type(password, { log: false }); // set password and hide value
          // cy.get('#signinButton') // click signIn button...
          //   .click()
          //   .then((_) => {
          //     // and wait.....
          //     this.waitForSpinners();
          //     cy.xpath('//*[contains(@class,\'loading-screen\')]', { timeout: 10000 }).should('have.length', 0);
          //     cy.xpath('//*[contains(@class,\'navbar-brand\')]', { timeout: 10000 }).should('be.visible');
          //     this.waitForSpinners();
          //     Helpers.log(`Logged as user: ${username}`);
          //   });
          this.click('#signinButton');
          cy.wait(2000);
          this.waitForSpinners();
          cy.xpath('//*[contains(@class,\'loading-screen\')]', { timeout: 10000 }).should('have.length', 0);
          cy.xpath('//*[contains(@class,\'navbar-brand\')]', { timeout: 10000 }).should('be.visible');
          this.waitForSpinners();
          Helpers.log(`Logged as user: ${username}`);
        }
      });
    }
    this.navigateToHomePage(loginUrl);
  }

  public loginInToClientConsole(username, password) {
    const loginUrl = config[Cypress.env('appEnv')]['clientURL'];
    if (loginUrl.includes('ppd') || loginUrl.includes('localhost')) {
      cy.login(username, password);
    } else {
      cy.session([username, password], () => {
        cy.visit(loginUrl);
        // and wait for all spinners disappear...
        cy.waitForSpinners();
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
            cy.get('#password', { timeout: 50000 }).should('be.visible');
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
      });
    }
    cy.visit(loginUrl);
    cy.waitForSpinners();
    cy.get('spa-page-home spa-nav-tabs', { timeout: 90000 })
      .should('exist');
    cy.waitForSpinnerIcon();
    cy.wait(6000);
    cy.get('body').then(($body) => {
      if ($body.find('#pendo-guide-container').length) {
        cy.get('#pendo-guide-container div:nth-child(3) button', { timeout: 20000 }).should('be.visible').
          click({ force: true });
      }
    });
    cy.get('button[aria-label="Settings"]', { timeout: 30000 }).should('be.visible');
    cy.waitForSpinners();
  }

  public getElement(selector, timeout: number = 9000) {
    Helpers.log(`Get element -> ${selector}`);
    if (selector.includes('//')) {
      cy.xpath(selector).should("exist", { timeout: timeout });
      return cy.xpath(selector);
    } else {
      cy.get(selector).should("exist", { timeout: timeout });
      return cy.get(selector);
    }
  }

  public selectDropdown(selector, value: string, containsText?, clear?) {
    Helpers.log(`Choose dropdown -> ${selector}`);
    this.click(selector, false);
    if (clear === false) {
      this.getElement(selector).type(value);
    } else {
      this.type(selector, value);
    }
    if (containsText === true) {
      this.click(format(`//*[contains(@class,'ng-option')]//*[contains(text(), '${value}')]`), false);
    } else {
      this.click(format(`//*[contains(@class,'ng-option')]//*[text()='${value}']`), false);
    }
  }

  public type(selector: string, value: string) {
    Helpers.log((`Type into ${selector} -> ${value}`));
    this.getElement(selector).clear().type(value);
  }

  public selectRadioButton(selector: string, option?: string, extraParam?: string) {
    Helpers.log(`Select radio button ${selector}`);
    if (extraParam !== undefined) {
      const select = selector + `/span[contains(text(),'${extraParam}')]`;
      if (option !== undefined) {
        //@ts-ignore
        this.getElement(select).click(option);
      } else {
        this.getElement(select).click();
      }
    } else {
      if (option !== undefined) {
        //@ts-ignore
        this.getElement(selector).click(option);
      } else {
        this.getElement(selector).click();
      }
    }
  }

  public checkConditionOnElement(selector: string, condition: string, value: string) {
    Helpers.log(`Check if -> ${selector} meets condition -> ${condition} with given value -> ${value}`);
    this.getElement(selector).should(condition, value);
  }

  // this method returns the formatted date eg: Sunday, February 25, 2024
  public getFormattedDate(inputDate: Date) {
    // Define arrays for days and months to use in formatting
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Extract day, month, and year from the current date
    const dayOfWeek = daysOfWeek[inputDate.getDay()];
    const month = monthsOfYear[inputDate.getMonth()];
    const dayOfMonth = inputDate.getDate();
    const year = inputDate.getFullYear();

    // Format the date string
    const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;

    // Log or use the formatted date
    cy.log('Formatted Date:', formattedDate);

    return formattedDate;
  }
  public loginAsSSOAdmin(username, password) {
    const loginUrl = config[Cypress.env('appEnv')]['URL'];
    Helpers.log(`Logging with ${username}`);
    const args = { username, password };
    //If appEnv is ppd -> we have to use puppeteer
    if (Cypress.env('appEnv').includes('ppd')) {
      this.loginAdminPpd(username, password, loginUrl)
    }
    else {

      cy.visit(loginUrl, { timeout: 50000 });
      cy.waitForSpinners();
      Helpers.log(`Visited login url`);
      // and wait for all spinners disappear...
      if (Cypress.env('appEnv').includes('fed')) {
        cy.get('#idp-discovery-username', { timeout: 10000 }).type(username).wait(500);
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
        cy.xpath('//*[contains(@class,\'navbar-brand\')]', { timeout: 10000 }).should('be.visible');
        this.waitForSpinners();
      } else {
        cy.wait(3000);

        cy.get('#nextButton', { timeout: 50000 }).should('be.visible');
        cy.get('#username').type(username); // set username
        cy.get('#nextButton').click();
        cy.wait(5000);
        /*cy.origin('', () => {
          cy.wait(5000);
          cy.get('#password', { timeout: 10000 }).should('be.visible');
        });*/
        cy.session([username, password], () => {
          cy.origin("https://login.microsoftonline.com", { args }, ({ username, password }) => {
            //cy.visit("/login"); //Do something on the second domain; log in as an example
            cy.wait(5000);
            cy.get('input[type="button"]').click({ force: true });
            cy.get('input[type="button"]').click({ force: true });
            cy.get("#otherTileText").click();
            cy.get("input[type='email']", { timeout: 10000 }).should('be.visible');
            cy.get("input[type='email']").click().focus().type(username); // set username
            cy.get("input[type='submit']").click();
            cy.get("input[type='password']").click().focus().type(password);
            cy.get("input[type='submit']").click();
          });

          cy.get('#password').type(password, { log: false }); // set password and hide value
          cy.get('#signinButton') // click signIn button...
            .click()
            .then((_) => {
              // and wait.....
              this.waitForSpinners();
              cy.xpath('//*[contains(@class,\'loading-screen\')]', { timeout: 10000 }).should('have.length', 0);
              cy.xpath('//*[contains(@class,\'navbar-brand\')]', { timeout: 10000 }).should('be.visible');
              this.waitForSpinners();
              Helpers.log(`Logged as user: ${username}`);
            });
        });
      }
    }
    this.navigateToHomePage(loginUrl);
  }

  public findElementInBody(cssSelector: string, text?) {
    Helpers.log(`Find element in body: ${cssSelector}, text: ${text}`);
    if (text === undefined) {
      return cy.get("body").then(($body) => {
        return $body.find(cssSelector).length !== 0;
      });
    } else {
      return cy.get("body").then(($body) => {
        return $body.find(cssSelector).css("innerText", text).length !== 0;
      });
    }
  }

  public sendTextForLogin(selector: string, text: string) {
    Helpers.log(`Send text - ${text} to:  ${selector}`);
    return this.getElement(selector).focus().type(text).then(_ => {
      this.waitForSpinners_2_0();
    });
  }


}



