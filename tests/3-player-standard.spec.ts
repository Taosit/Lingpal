import { test, Page } from "@playwright/test";
import GamePage from "./pages/game";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data";
import SettingsPage from "./pages/settings";

test.describe("3 player standard mode", () => {
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

  test("Describers leave game room", async () => {
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1.waitForTimeout(1000);
    await player1Game.quit();

    const confirmMessage = player2.getByText(/You are describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2.waitForTimeout(1000);
    await player2Game.quit();
  });

  test("Non describers leave game room", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");

    const player2Game = new GamePage(player2);
    await player2.waitForTimeout(1000);
    await player2Game.quit();

    const confirmMessage = player3.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3.waitForTimeout(1000);
    await player3Game.quit();
  });

  test("Describer leaves notes room and playthrough", async () => {
    await player1.waitForURL("/notes-room");
    const player1Game = new GamePage(player1);
    await player1.waitForTimeout(1000);
    await player1Game.quit();

    await player3.waitForURL("/game-room");
    let confirmMessage = player3.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player3.waitForURL("/notes-room");
    await player3.waitForURL("/game-room");

    confirmMessage = player3.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");
  });

  test("Describer leaves game room and playthrough", async () => {
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1.waitForTimeout(1000);
    await player1Game.quit();

    let confirmMessage = player3.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForURL("/notes-room");
    await player1.waitForURL("/game-room");

    confirmMessage = player3.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(4);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");
  });

  test("Last describer leaves game room to end the game", async () => {
    test.setTimeout(40000);
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

    await player1.waitForURL("/notes-room");
    await player1.waitForURL("/game-room");

    confirmMessage = player3.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/You are describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.quit();

    await player1.waitForTimeout(3000);
    await player2.waitForTimeout(3000);
  });

  test("No player leaves", async () => {
    test.setTimeout(40000);
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

    await player1.waitForURL("/notes-room");
    await player1.waitForURL("/game-room");

    confirmMessage = player3.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForTimeout(3000);
    await player2.waitForTimeout(3000);
    await player3.waitForTimeout(3000);
  });
});
