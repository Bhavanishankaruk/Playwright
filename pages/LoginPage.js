class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
    this.secureAreaHeading = page.getByRole('heading', {
      name: 'Secure Area',
      exact: true,
    });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async open(baseUrl) {
    await this.page.goto(baseUrl);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
