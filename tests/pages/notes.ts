import { Page } from "@playwright/test";

export default class NotesPage {
  constructor(public page: Page) {}

  async writeNote(note: string) {
    await this.page.getByRole("button", { name: "+" }).first().click();
    await this.page.getByRole("textbox").click();
    await this.page.getByRole("textbox").fill(note);
    await this.page.getByRole("button", { name: "OK" }).click();
  }

  async editNote(oldNote: string, newNote: string) {
    await this.page.getByRole("button", { name: oldNote }).click();
    await this.page.getByText(oldNote).click();
    await this.page.getByText(oldNote).fill(newNote);
    await this.page.getByRole("button", { name: "OK" }).click();
  }

  async quit() {
    await this.page.getByRole("button", { name: "Quit" }).click();
  }
}
