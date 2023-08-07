import { test, Page } from "@playwright/test";
import GamePage from "./pages/game";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data";
import SettingsPage from "./pages/settings";

test.describe("3 player relaxed mode", () => {
  let player1: Page;
  let player2: Page;
  let player3: Page;

  test.beforeEach(async ({ browser }) => {
    player1 = await (await browser.newContext()).newPage();
    player2 = await (await browser.newContext()).newPage();
    player3 = await (await browser.newContext()).newPage();
    await Promise.all([
      logInAndChooseSettings(
        player1,
        credentials.user1,
        getSetting("relaxed", "easy", "text")
      ),
      logInAndChooseSettings(
        player2,
        credentials.user2,
        getSetting("relaxed", "easy", "text")
      ),
      logInAndChooseSettings(
        player3,
        credentials.user3,
        getSetting("relaxed", "easy", "text")
      ),
    ]);
    const player1Settings = new SettingsPage(player1);
    await player1Settings.clickPlay();
    const player2Settings = new SettingsPage(player2);
    await player2Settings.clickPlay();
    const player3Settings = new SettingsPage(player3);
    await player3Settings.clickPlay();
    await player1.getByRole("button", { name: "Ready" }).click();
    await player2.getByRole("button", { name: "Ready" }).click();
    await player3.getByRole("button", { name: "Ready" }).click();
  });

  test("Players give each other ratings", async () => {
    await player1.waitForURL("/game-room");

    let confirmMessage = player3.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3Game.sendMessage("This is the correct answer for easy words.");
    let star = player3.locator("css=.star-container").nth(3);
    await star.waitFor({ state: "visible" });
    await star.click();
    await player2.locator("css=.star-container").nth(1).click();

    confirmMessage = player3.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");
    await star.waitFor({ state: "visible" });
    await star.click();

    confirmMessage = player2.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");
    star = player2.locator("css=.star-container").nth(4);
    await star.waitFor({ state: "visible" });
    await star.click();
    await player1.locator("css=.star-container").nth(3).click();

    await player1.waitForTimeout(3000);
    await player2Game.quit();
    await player3Game.quit();
  });
});
