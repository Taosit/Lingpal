import { Page } from "@playwright/test";

export default class GamePage {
  constructor(public page: Page) {}

  async selectNote() {
    await this.page.getByRole("button", { name: "Choose" }).first().click();
    await this.page.getByRole("button", { name: "Send" }).click();
  }

  async sendMessage(message: string) {
    await this.page.getByRole("textbox").click();
    await this.page.getByRole("textbox").fill(message);
    await this.page.getByRole("button", { name: "Send" }).click();
  }

  async quit() {
    await this.page.getByRole("button", { name: "Quit" }).click();
  }
}
