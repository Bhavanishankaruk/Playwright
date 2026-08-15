const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

async function saveResponse(world, response) {
  world.apiResponse = response;
  world.responseBody = null;

  if (response.status() !== 204) {
    world.responseBody = await response.json();
  }
}

When('I request ReqRes users from page {int}', async function (pageNumber) {
  await saveResponse(this, await this.reqresApi.getUsers(pageNumber));
});

When(
  'I create a user with name {string} and job {string}',
  async function (name, job) {
    await saveResponse(this, await this.reqresApi.createUser({ name, job }));
  }
);

When(
  'I replace user {int} with name {string} and job {string}',
  async function (userId, name, job) {
    await saveResponse(
      this,
      await this.reqresApi.replaceUser(userId, { name, job })
    );
  }
);

When(
  'I update user {int} job to {string}',
  async function (userId, job) {
    await saveResponse(
      this,
      await this.reqresApi.updateUser(userId, { job })
    );
  }
);

When('I delete user {int}', async function (userId) {
  await saveResponse(this, await this.reqresApi.deleteUser(userId));
});

Then('the API status code should be {int}', async function (statusCode) {
  const actualStatus = this.apiResponse.status();

  if (actualStatus === 401 || actualStatus === 403) {
    throw new Error(
      `ReqRes authentication failed with status ${actualStatus}. ` +
        'Check that REQRES_API_KEY in your .env file is a current key from https://app.reqres.in. ' +
        `Response: ${JSON.stringify(this.responseBody)}`
    );
  }

  expect(actualStatus).toBe(statusCode);
});

Then('the response should contain a non-empty user list', async function () {
  expect(Array.isArray(this.responseBody.data)).toBeTruthy();
  expect(this.responseBody.data.length).toBeGreaterThan(0);

  for (const user of this.responseBody.data) {
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
      })
    );
  }
});

Then(
  'the response field {string} should equal {string}',
  async function (field, expectedValue) {
    expect(this.responseBody[field]).toBe(expectedValue);
  }
);

Then('the response should contain field {string}', async function (field) {
  expect(this.responseBody).toHaveProperty(field);
  expect(this.responseBody[field]).toBeTruthy();
});

Then('the API response body should be empty', async function () {
  expect(await this.apiResponse.body()).toHaveLength(0);
});
