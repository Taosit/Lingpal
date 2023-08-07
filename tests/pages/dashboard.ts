import { Page } from "@playwright/test";

export default class DashboardPage {
  constructor(public page: Page) {}

  async getTotal() {
    return parseInt(
      (await this.page.getByTestId("total").textContent()) as string
    );
  }

  async getWin() {
    return parseFloat(
      (await this.page.getByTestId("win").textContent()) as string
    );
  }
}
