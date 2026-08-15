// Locally, prefer the current key saved in the Git-ignored .env file over a
// stale value that may still be exported in the VS Code terminal.
require('dotenv').config({ quiet: true, override: true });

const {
  Before,
  After,
  AfterAll,
  Status,
  setDefaultTimeout,
} = require('@cucumber/cucumber');
const { chromium, request } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ReqresApi } = require('../../api/ReqresApi');

let browser;

setDefaultTimeout(30 * 1000);

Before({ tags: 'not @api' }, async function () {
  if (!browser) {
    const launchOptions = {
      headless: process.env.HEADLESS !== 'false',
    };

    // Local macOS 13 uses installed Chrome. CI uses bundled Chromium.
    if (!process.env.CI) {
      launchOptions.channel = 'chrome';
    }

    browser = await chromium.launch(launchOptions);
  }

  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

Before({ tags: '@api' }, async function () {
  const apiKey = process.env.REQRES_API_KEY;

  if (!apiKey) {
    throw new Error(
      'REQRES_API_KEY is missing. Create a free key at https://app.reqres.in and set it as an environment variable.'
    );
  }

  this.apiContext = await request.newContext({
    baseURL: this.parameters.apiBaseUrl,
    extraHTTPHeaders: {
      'x-api-key': apiKey,
      'X-Reqres-Env': 'prod',
      Accept: 'application/json',
    },
  });
  this.reqresApi = new ReqresApi(this.apiContext);
});

After({ tags: 'not @api' }, async function (scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  await this.page?.close();
  await this.context?.close();
});

After({ tags: '@api' }, async function () {
  await this.apiContext?.dispose();
});

AfterAll(async function () {
  await browser?.close();
});
