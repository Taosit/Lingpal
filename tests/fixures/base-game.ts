import { Page, test as base } from "@playwright/test";
import { credentials } from "../data";
import { getSetting, logInAndChooseSettings } from "../utils/helpers";

type pages = {
  player1: Page;
  player2: Page;
  player3: Page;
  player4: Page;
  player5: Page;
  player6: Page;
  player7: Page;
  player8: Page;
};

export const test = base.extend<pages>({
  player1: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(100);
    logInAndChooseSettings(
      page,
      credentials.user1,
      getSetting("standard", "easy", "text")
    );
    await use(page);
  },
  player2: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(200);
    logInAndChooseSettings(
      page,
      credentials.user2,
      getSetting("standard", "easy", "text")
    );
    await use(page);
  },
  player3: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(300);
    logInAndChooseSettings(
      page,
      credentials.user3,
      getSetting("standard", "easy", "text")
    );
    await use(page);
  },
  player4: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(400);
    logInAndChooseSettings(
      page,
      credentials.user4,
      getSetting("standard", "easy", "text")
    );
    await use(page);
  },
  player5: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(500);
    logInAndChooseSettings(
      page,
      credentials.user5,
      getSetting("standard", "easy", "text")
    );
    await use(page);
  },
  player6: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(600);
    logInAndChooseSettings(
      page,
      credentials.user6,
      getSetting("standard", "easy", "text")
    );
    await use(page);
  },
  player7: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(700);
    logInAndChooseSettings(
      page,
      credentials.user7,
      getSetting("relaxed", "easy", "text")
    );
    await use(page);
  },
  player8: async ({ browser }, use) => {
    const page = await (await browser.newContext()).newPage();
    await page.waitForTimeout(800);
    logInAndChooseSettings(
      page,
      credentials.user8,
      getSetting("relaxed", "easy", "text")
    );
    await use(page);
  },
});

export const expect = base.expect;
export const describe = base.describe;
