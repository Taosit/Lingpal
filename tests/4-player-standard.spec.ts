import { Page } from "@playwright/test";
import { describe, test } from "./fixures/base-game";
import GamePage from "./pages/game";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data";
import SettingsPage from "./pages/settings";

describe("4 player standard mode", () => {
  let player1: Page;
  let player2: Page;
  let player3: Page;
  let player4: Page;

  test.beforeEach(async ({ browser }) => {
    player1 = await (await browser.newContext()).newPage();
    player2 = await (await browser.newContext()).newPage();
    player3 = await (await browser.newContext()).newPage();
    player4 = await (await browser.newContext()).newPage();
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
    const player1Settings = new SettingsPage(player1);
    await player1Settings.clickPlay();
    const player2Settings = new SettingsPage(player2);
    await player2Settings.clickPlay();
    const player3Settings = new SettingsPage(player3);
    await player3Settings.clickPlay();
    const player4Settings = new SettingsPage(player4);
    await player4Settings.clickPlay();
    await player1.getByRole("button", { name: "Ready" }).click();
    await player2.getByRole("button", { name: "Ready" }).click();
    await player3.getByRole("button", { name: "Ready" }).click();
    await player4.getByRole("button", { name: "Ready" }).click();
  });

  test("No player leaves", async () => {
    test.setTimeout(60000);
    await player1.waitForURL("/game-room");

    let confirmMessage = player3.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForURL("/notes-room");
    await player1.waitForURL("/game-room");

    confirmMessage = player3.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(4);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(4);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(5);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForTimeout(3000);
    await player2.waitForTimeout(3000);
    await player3.waitForTimeout(3000);
    await player4.waitForTimeout(3000);
  });
});
