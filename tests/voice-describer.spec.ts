import { test, Page } from "@playwright/test";
import GamePage from "./pages/game";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data/data";
import SettingsPage from "./pages/settings";

test.describe("3 player voice describer", () => {
  let player1: Page;
  let player2: Page;
  let player3: Page;

  test.beforeEach(async ({ browser }) => {
    const browserContext1 = await browser.newContext();
    await browserContext1.grantPermissions(["microphone"]);
    const browserContext2 = await browser.newContext();
    await browserContext2.grantPermissions(["microphone"]);
    const browserContext3 = await browser.newContext();
    await browserContext3.grantPermissions(["microphone"]);
    player1 = await browserContext1.newPage();
    player2 = await browserContext2.newPage();
    player3 = await browserContext3.newPage();
    await Promise.all([
      logInAndChooseSettings(
        player1,
        credentials.user1,
        getSetting("standard", "easy", "voice")
      ),
      logInAndChooseSettings(
        player2,
        credentials.user2,
        getSetting("standard", "easy", "voice")
      ),
      logInAndChooseSettings(
        player3,
        credentials.user3,
        getSetting("standard", "easy", "voice")
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

  test.afterEach(async () => {
    await player1.waitForURL("/dashboard");
    await player1.getByRole("button", { name: "Logout" }).click();
    await player2.waitForURL("/dashboard");
    await player2.getByRole("button", { name: "Logout" }).click();
    await player3.waitForURL("/dashboard");
    await player3.getByRole("button", { name: "Logout" }).click();
  });

  test("No player leaves", async () => {
    test.setTimeout(40000);
    await player1.waitForURL("/game-room");

    let confirmMessage = player3.getByText(/is speaking/);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    confirmMessage = player3.getByText(/is speaking/);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    confirmMessage = player2.getByText(/is speaking/);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForURL("/notes-room");
    await player1.waitForURL("/game-room");

    confirmMessage = player3.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    confirmMessage = player3.getByText(/is speaking/);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    confirmMessage = player3.getByText(/is speaking/);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    confirmMessage = player2.getByText(/is speaking/);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");
  });
});
