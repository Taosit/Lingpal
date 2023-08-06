import { Page } from "@playwright/test";

export default class LoginPage {
  constructor(public page: Page) {}

  async enterEmail(email: string) {
    await this.page.getByLabel("Email").fill(email);
  }

  async enterPassword(password: string) {
    await this.page.getByLabel("Password").fill(password);
  }

  async clickLogin() {
    await this.page
      .locator("form")
      .getByRole("button", { name: "Log In" })
      .click();
  }

  async login({ email, password }: { email: string; password: string }) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
