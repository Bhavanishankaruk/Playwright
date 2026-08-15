const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the login page', async function () {
  await this.loginPage.open(this.parameters.baseUrl);
});

When(
  'I log in with username {string} and password {string}',
  async function (username, password) {
    await this.loginPage.login(username, password);
  }
);

Then('the login outcome should be {string}', async function (outcome) {
  if (outcome === 'success') {
    await expect(this.page).toHaveURL(/\/secure$/);
    await expect(this.loginPage.secureAreaHeading).toBeVisible();
    await expect(this.loginPage.logoutLink).toBeVisible();
    return;
  }

  if (outcome === 'failure') {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.loginPage.loginButton).toBeVisible();
    return;
  }

  throw new Error(
    `Unknown outcome "${outcome}". Use "success" or "failure" in the Examples table.`
  );
});

Then('the login message should contain {string}', async function (message) {
  await expect(this.loginPage.flashMessage).toBeVisible();
  await expect(this.loginPage.flashMessage).toContainText(message);
});
