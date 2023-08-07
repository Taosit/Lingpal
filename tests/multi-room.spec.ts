import { test, Page } from "@playwright/test";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data";
import SettingsPage from "./pages/settings";

test.describe("multi-room", () => {
  let player1: Page;
  let player2: Page;

  test.beforeEach(async ({ browser }) => {
    player1 = await (await browser.newContext()).newPage();
    player2 = await (await browser.newContext()).newPage();
    await Promise.all([
      logInAndChooseSettings(
        player1,
        credentials.user1,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player2,
        credentials.user2,
        getSetting("standard", "easy", "text")
      ),
    ]);
    const player1Settings = new SettingsPage(player1);
    await player1Settings.clickPlay();
    const player2Settings = new SettingsPage(player2);
    await player2Settings.clickPlay();
  });

  test("2 simultaneous games of the same setting", async ({ browser }) => {
    const player3 = await (await browser.newContext()).newPage();
    const player4 = await (await browser.newContext()).newPage();

    await Promise.all([
      logInAndChooseSettings(
        player3,
        credentials.user3,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player4,
        credentials.user4,
        getSetting("standard", "easy", "text")
      ),
    ]);
    const player3Settings = new SettingsPage(player3);
    await player3Settings.clickPlay();
    const player4Settings = new SettingsPage(player4);
    await player4Settings.clickPlay();

    await player1.getByRole("button", { name: "Ready" }).click();
    await player2.getByRole("button", { name: "Ready" }).click();

    await player3.getByRole("button", { name: "Ready" }).click();
    await player4.getByRole("button", { name: "Ready" }).click();

    await player1.waitForTimeout(15_000);
  });

  test("Simultaneous player joining in 2 simulteneous games of the same setting", async ({
    browser,
  }) => {
    const player3 = await (await browser.newContext()).newPage();
    const player4 = await (await browser.newContext()).newPage();
    const player5 = await (await browser.newContext()).newPage();
    const player6 = await (await browser.newContext()).newPage();
    const player7 = await (await browser.newContext()).newPage();
    const player8 = await (await browser.newContext()).newPage();

    await Promise.all([
      logInAndChooseSettings(
        player3,
        credentials.user3,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player4,
        credentials.user4,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player5,
        credentials.user5,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player6,
        credentials.user6,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player7,
        credentials.user7,
        getSetting("standard", "easy", "text")
      ),
      logInAndChooseSettings(
        player8,
        credentials.user8,
        getSetting("standard", "easy", "text")
      ),
    ]);
    const player3Settings = new SettingsPage(player3);
    await player3Settings.clickPlay();
    const player4Settings = new SettingsPage(player4);
    await player4Settings.clickPlay();

    const player5Settings = new SettingsPage(player5);
    await player5Settings.clickPlay();
    const player6Settings = new SettingsPage(player6);
    await player6Settings.clickPlay();

    const player7Settings = new SettingsPage(player7);
    await player7Settings.clickPlay();
    const player8Settings = new SettingsPage(player8);
    await player8Settings.clickPlay();

    await player1.waitForTimeout(15_000);
  });

  test("simultaneous games of different settings", async ({ browser }) => {
    const player3 = await (await browser.newContext()).newPage();
    const player4 = await (await browser.newContext()).newPage();
    const player5 = await (await browser.newContext()).newPage();
    const player6 = await (await browser.newContext()).newPage();

    await Promise.all([
      logInAndChooseSettings(
        player3,
        credentials.user3,
        getSetting("standard", "hard", "text")
      ),
      logInAndChooseSettings(
        player4,
        credentials.user4,
        getSetting("standard", "hard", "text")
      ),
      logInAndChooseSettings(
        player5,
        credentials.user5,
        getSetting("relaxed", "easy", "text")
      ),
      logInAndChooseSettings(
        player6,
        credentials.user6,
        getSetting("relaxed", "easy", "text")
      ),
    ]);
    const player3Settings = new SettingsPage(player3);
    await player3Settings.clickPlay();
    const player4Settings = new SettingsPage(player4);
    await player4Settings.clickPlay();

    const player5Settings = new SettingsPage(player5);
    await player5Settings.clickPlay();
    const player6Settings = new SettingsPage(player6);
    await player6Settings.clickPlay();

    await player1.getByRole("button", { name: "Ready" }).click();
    await player2.getByRole("button", { name: "Ready" }).click();

    await player3.getByRole("button", { name: "Ready" }).click();
    await player4.getByRole("button", { name: "Ready" }).click();

    await player5.getByRole("button", { name: "Ready" }).click();
    await player6.getByRole("button", { name: "Ready" }).click();

    await player1.waitForTimeout(15_000);
  });
});
