// cypress/plugins/index.js
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const puppeteer = require('puppeteer');
const fs = require('fs');
const XLSX = require('xlsx');
const timeout = 30000;
const gmail = require("ui-e2e/src/support/gmail/gmailClientExtended.js");
const path = require("path");

const typeUsername = async function ({ page, options } = {}) {
  try {
    const fieldSelector = 'input#username';
    await page.waitForSelector(fieldSelector, { timeout });
    await page.type(fieldSelector, options.username);
  } catch (err) {
    await takeScreenshot(page, options, 'typeUsername');
    throw err;
  }
};

const typePassword = async function ({ page, options } = {}) {
  try {
    const fieldSelector = 'input#password';
    await page.waitForSelector(fieldSelector, { timeout });
    await page.type(fieldSelector, options.password);
  } catch (err) {
    await takeScreenshot(page, options, 'typePassword');
    throw err;
  }
};

const signIn = async function ({ page, options } = {}) {
  try {
    await typeUsername({ page, options });
    await typePassword({ page, options });
    const fieldSelector = '#signinButton';
    await page.waitForSelector(fieldSelector, { timeout });
    await page.click('#signinButton');
  } catch (err) {
    await takeScreenshot(page, options, 'signIn');
    throw err;
  }
};

const typeUsername_newWay = async function ({ page, options } = {}) {
  try {
    const fieldSelector = "[autocomplete=\"username\"]";
    const next = "[type=\"submit\"]";
    await page.waitForSelector(fieldSelector, { timeout });
    await page.type(fieldSelector, options.username);
    await page.click(next);
  } catch (err) {
    await takeScreenshot(page, options, "typeUsername");
    throw err;
  }
};



const typePassword_newWay = async function ({ page, options } = {}) {
  try {
    const fieldSelector = "[type=\"password\"]";
    await page.waitForSelector(fieldSelector, { timeout });
    await page.type(fieldSelector, options.password);
  } catch (err) {
    await takeScreenshot(page, options, "typePassword");
    throw err;
  }
};

const signIn_newWay = async function ({ page, options } = {}) {
  try {
    await typeUsername_newWay({ page, options });
    await typePassword_newWay({ page, options });
    const submitButton = "[type=\"submit\"]";
    await page.waitForSelector(submitButton, { timeout });
    await page.click(submitButton);
  } catch (err) {
    await takeScreenshot(page, options, "signIn");
    throw err;
  }
};

const getXSRFTokenFromPostCall = async function ({ page, options } = {}) {
  try {
    await page.goto(options.loginUrl + 'client-admin/users');
    //const addUserButton = '#add-user'
    //await page.waitForSelector(addUserButton, { timeout });
    await page.waitForTimeout(3000);
    await page.goto(options.loginUrl);
  } catch (err) {
    await takeScreenshot(page, options, 'getTokenFromPostCall');
    throw err;
  }
};


const read = ({ file, sheet }) => {
  const buf = fs.readFileSync(file);
  const workbook = XLSX.read(buf, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  return rows
}

module.exports = (on, config) => {
  require('cypress-mochawesome-reporter/plugin')(on);
  // require('cypress-terminal-report/src/installLogsPrinter')(on);
  on('task', {
    async puppeteerLogin(options) {
      try {
        console.log('PUPPETEER:', `Logging into ${options.loginUrl} with ${options.username}`);
        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: true
        });
        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();
        page.on('console', (msg) => console.log('PUPPETEER:', msg.text()));
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(options.loginUrl);
        await signIn({ page, options });
        await page.waitForSelector('spa-root.site-root', { timeout });
        const cookies = await page.cookies();
        await context.close();
        await browser.close();
        return { cookies };
      } catch (e) {
        console.error(e);
        try {
          console.log('LOGIN FAILED!!!.  RETRY PUPPETEER LOGIN ================');
          const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
          });
          const context = await browser.createIncognitoBrowserContext();
          const page = await context.newPage();
          page.on('console', (msg) => console.log('PUPPETEER:', msg.text()));
          await page.setViewport({ width: 1280, height: 800 });
          await page.goto(options.loginUrl);
          await signIn({ page, options });
          await page.waitForSelector('spa-root.site-root', { timeout });
          const cookies = await page.cookies();
          await context.close();
          await browser.close();
          return { cookies };
        } catch (e) {
          console.error(e);
          return { cookies: null };
        }
      }
    },

    deleteFolder(folderName) {
      console.log('deleting folder %s', folderName);
      return new Promise((resolve, reject) => {
        fs.rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(null);
        });
      });
    },

    async ccLog(message) {
      console.log(message);
      return null;
    }
  });

  on('task', {
    'readXlsx': read,
    log(message) {
      console.log(message)
      return null
    }
  });

  on("task", {
    async puppeteerLogin_newWay(options) {
      try {
        console.log(
          "PUPPETEER:",
          `Logging into ${options.loginUrl} with ${options.username}`
        );
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          headless: true,
        });
        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();
        page.on("console", (msg) => console.log("PUPPETEER:", msg.text()));
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(options.loginUrl);
        await signIn_newWay({ page, options });
        await page.waitForSelector("spa-root.site-root", { timeout });
        await getXSRFTokenFromPostCall({ page, options });
        await page.waitForSelector('spa-root.site-root', { timeout });
        const cookies = await page.cookies();
        await context.close();
        await browser.close();
        return { cookies };
      } catch (e) {
        console.error(e);
        try {
          console.log(
            "LOGIN FAILED!!!. RETRY PUPPETEER LOGIN ================"
          );
          const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
          });
          const context = await browser.createIncognitoBrowserContext();
          const page = await context.newPage();
          page.on("console", (msg) => console.log("PUPPETEER:", msg.text()));
          await page.setViewport({ width: 1280, height: 800 });
          await page.goto(options.loginUrl);
          await signInFedQa_newWay({ page, options });
          await page.waitForSelector("spa-root.site-root", { timeout });
          const cookies = await page.cookies();
          await context.close();
          await browser.close();
          return { cookies };
        } catch (e) {
          console.error(e);
          return { cookies: null };
        }
      }
    },

    deleteFolder(folderName) {
      console.log("deleting folder %s", folderName);
      return new Promise((resolve, reject) => {
        fs.rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(null);
        });
      });
    },

    async ccLog(message) {
      console.log(message);
      return null;
    },
  });


  on("task", {
    "gmail:check": async (args) => {
      const { from, to, subject } = args;
      const email = await gmail.check_inbox(
        path.resolve(__dirname, "credentials.json"), // credentials.json is inside plugins/ directory.
        path.resolve(__dirname, "gmail_token.json"), // gmail_token.json is inside plugins/ directory.
        subject,
        from,
        to,
        5, // Poll interval (in seconds)
        10 // Maximum loops count. If reached, return null, indicating the completion of the task().
      );
      return email;
    },
  });

  on("task", {
    "gmail:get_messages": async (args) => {
      console.log("GMAIL:", `Get messages`);
      const { from, to, subject, text, after, before } = args;
      const email = await gmail.checkGoogleEmailWithMessage(
        path.resolve(__dirname, "credentials.json"), // credentials.json is inside plugins/ directory.
        path.resolve(__dirname, "gmail_token.json"), // gmail_token.json is inside plugins/ directory.
        subject,
        text,
        from,
        to,
        after,
        5, // Poll interval (in seconds)
        10 // Maximum loops count. If reached, return null, indicating the completion of the task().
      );
      return email;
    },
  });


  // return config;
  return require('@bahmutov/cypress-extends')(config.configFile);

};

function takeScreenshot(page, options, name = 'puppeteerLogin') {
  if (options.screenshotOnError) {
    const f = `${options.screenshotsFolder}/puppeteerLogin/`;
    if (!fs.existsSync(f)) {
      fs.mkdirSync(f, { recursive: true });
    }
    page.screenshot({ path: `${f}/${name}.png`, fullPage: true });
  }
}

// // export a function
// module.exports = (on, config) => {
//   // configure plugins here
// }
