const {
  BeforeAll,
  Before,
  After,
  AfterAll,
  Status,
  setDefaultTimeout,
} = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

let browser;

setDefaultTimeout(30 * 1000);

BeforeAll(async function () {
  browser = await chromium.launch({
    // Use Chrome already installed on this macOS 13 machine.
    channel: 'chrome',
    headless: process.env.HEADLESS !== 'false',
  });
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
