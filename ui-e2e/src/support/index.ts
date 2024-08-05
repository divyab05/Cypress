import './commands';

import './adminconsole/userManagementCommands';
import './adminconsole/adminSettingsCommands';
import './adminconsole/manageCostAccCommands';
import './adminconsole/divisionLocationsCommands';
import './adminconsole/rolesCommands';
import './adminconsole/carrierAccountsCommands';
import './adminconsole/businessRulesCommands';
import './adminconsole/notificationsCommands';
import './adminconsole/customFieldsCommands';
import 'cypress-real-events/support';
import 'cypress-mochawesome-reporter/register';
import addContext from 'mochawesome/addContext';
// require('cypress-terminal-report/src/installLogsCollector')();
require('cypress-xpath');
import 'cypress-file-upload';
import { Test } from 'mocha';
import { Helpers } from "./helpers";

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

const imageUrls = [];

Cypress.on('test:before:run', (test, runnable: any) => {
  const env = Cypress.env('appEnv');
  switch (env.toString().toLowerCase()) {
    case 'dev': {
      Cypress.config('baseUrl', 'https://spa-ui-dev.sendpro360.pitneycloud.com/');
      break;
    }
    case 'qa': {
      Cypress.config('baseUrl', 'https://spa-ui-qa.sendpro360.pitneycloud.com/');
      break;
    }
    case 'ppd': {
      Cypress.config('baseUrl', 'https://app-ppd.sendpro360.pitneybowes.com/');
      break;
    }
    case 'fed-dev': {
      Cypress.config('baseUrl', 'https://spa-ui-dev.fedramp.pitneycloud.com/');
      break;
    }
    case 'fed-qa': {
      Cypress.config('baseUrl', 'https://spa-ui-qa.fedramp.pitneycloud.com/');
      break;
    }
    case 'fed-ppd': {
      Cypress.config('baseUrl', 'https://app-ppd.sendpro360gov.pitneybowes.com/');
      break;
    }
    case 'admin-dev': {
      Cypress.config('baseUrl', 'https://spa-admin-ui-dev.sendpro360.pitneycloud.com/');
      break;
    }
    case 'admin-qa': {
      Cypress.config('baseUrl', 'https://spa-admin-ui-qa.sendpro360.pitneycloud.com/');
      break;
    }
    case 'admin-ppd': {
      Cypress.config('baseUrl', 'https://admin-ppd.sendpro360.pitneybowes.com/');
      break;
    }
    case 'fed-admin-dev': {
      Cypress.config('baseUrl', 'https://spa-admin-ui-dev.fedramp.pitneycloud.com/');
      break;
    }
    case 'fed-admin-qa': {
      Cypress.config('baseUrl', 'https://spa-admin-ui-qa.fedramp.pitneycloud.com/');
      break;
    }
    case 'fed-admin-ppd': {
      Cypress.config('baseUrl', 'https://spa-admin-ui-ppd.fedramp.pitneycloud.com/');
      break;
    }
    case 'prod': {
      Cypress.config('baseUrl', 'https://sendpro360.pitneybowes.com/');
      break;
    }
  }
});

Cypress.on('test:after:run', (test, runnable: any) => {
  if (test.state === 'failed') {
    let item = runnable;
    const nameParts: string[] = [runnable.title];
    while (item.parent) {
      nameParts.unshift(item.parent.title);
      item = item.parent;
    }
    // if (runnable.hookName) {
    //   nameParts.push(`${runnable.hookName} hook`);
    // }
    const fullTestName = nameParts.filter(Boolean).join(' -- ');
    if (test.currentRetry === 0) imageUrls[0] = `assets/${Cypress.spec.name}/${fullTestName} (failed).png`;
    else
      imageUrls[test.currentRetry] = `assets/${Cypress.spec.name}/${fullTestName} (failed) (attempt ${test.currentRetry + 1
        }).png`;
    if (test.currentRetry === test.retries)
      for (let i = 0; i <= test.retries; i++) {
        addContext({ test }, imageUrls[i].replace(/[:<>]/g, ''));
      }
  }
});

beforeEach(function () {
  const testSuite: string = Cypress.env('SUITE');
  Helpers.log(testSuite);
  if (!testSuite || testSuite === '%SUITE%') {
    return;
  }
  const testName = (Cypress as any).mocha.getRunner().test.fullTitle();
  if (!testName.includes(testSuite)) {
    this.skip();
  }
});
