import { Page, test as base } from "@playwright/test";
import LoginPage from "../pages/login";
import SettingsPage from "../pages/settings";
import { credentials } from "../data";

type pages = {
  player1: Page;
  player2: Page;
  player3: Page;
  player4: Page;
};

const logInAndChooseSettings = async (
  page: Page,
  user: {
    email: string;
    password: string;
  }
) => {
  await page.goto("/login");

  const login = new LoginPage(page);
  await login.login(user);

  await page.getByRole("button", { name: "Play" }).click();

  const settings = new SettingsPage(page);
  await settings.setSettings({
    mode: "standard",
    difficulty: "easy",
    describer: "text",
  });
  const readyButton = page.getByRole("button", { name: "Ready" });
  await readyButton.waitFor({ state: "visible" });
  await readyButton.click();
};

export const test = base.extend<pages>({
  player1: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    logInAndChooseSettings(page, credentials.user1);
    // await page.getByRole("button", { name: "Ready" }).click();
    await use(page);
  },
  player2: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    logInAndChooseSettings(page, credentials.user2);
    await use(page);
  },
  player3: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    logInAndChooseSettings(page, credentials.user3);
    await use(page);
  },
  player4: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    logInAndChooseSettings(page, credentials.user4);
    await use(page);
  },
});

export const expect = base.expect;
