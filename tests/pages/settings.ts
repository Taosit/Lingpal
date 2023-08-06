import { Page } from "@playwright/test";

type Settings = {
  mode: "standard" | "relaxed";
  difficulty: "easy" | "hard";
  describer: "text" | "voice";
};

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export default class SettingsPage {
  constructor(public page: Page) {}

  async selectMode(mode: Settings["mode"]) {
    await this.page.getByRole("button", { name: capitalize(mode) }).click();
  }

  async selectDifficulty(difficulty: Settings["difficulty"]) {
    await this.page
      .getByRole("button", { name: capitalize(difficulty) })
      .click();
  }

  async selectDescriber(describer: Settings["describer"]) {
    await this.page
      .getByRole("button", { name: capitalize(describer) })
      .click();
  }

  async clickPlay() {
    await this.page.getByRole("button", { name: ">> Play" }).click();
  }

  async setSettings(settings: Settings) {
    await this.selectMode(settings.mode);
    await this.selectDifficulty(settings.difficulty);
    await this.selectDescriber(settings.describer);
    await this.clickPlay();
  }
}
