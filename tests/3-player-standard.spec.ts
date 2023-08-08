import { test, Page, expect } from "@playwright/test";
import GamePage from "./pages/game";
import {
  assertHasLost,
  assertHasWon,
  assertRank,
  getSetting,
  logInAndChooseSettings,
} from "./utils/helpers";
import { credentials } from "./data/data";
import SettingsPage from "./pages/settings";

test.describe("3 player standard mode", () => {
  let player1: Page;
  let player2: Page;
  let player3: Page;

  let player1Stats: { total: number; win: number };
  let player2Stats: { total: number; win: number };
  let player3Stats: { total: number; win: number };

  test.beforeEach(async ({ browser }) => {
    player1 = await (await browser.newContext()).newPage();
    player2 = await (await browser.newContext()).newPage();
    player3 = await (await browser.newContext()).newPage();
    const [stats1, stats2, stats3] = await Promise.all([
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
    player1Stats = stats1;
    player2Stats = stats2;
    player3Stats = stats3;

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
    let confirmMessage = player1.getByTestId("bot-message").first();
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toHaveText("You are describing");
    await player1Game.quit();

    confirmMessage = player2.getByTestId("bot-message").nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("left the game");
    confirmMessage = player2.getByTestId("bot-message").nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toHaveText("You are describing");
    const player2Game = new GamePage(player2);
    await player2.waitForTimeout(1000);
    await player2Game.quit();

    confirmMessage = player3.getByTestId("bot-message").nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("The game is over");

    await player3.waitForURL("/dashboard");
    await player3.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasLost(player2, player2Stats);
    await assertHasWon(player3, player3Stats);
  });

  test("Non describers leave game room", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");

    const player2Game = new GamePage(player2);
    let confirmMessage = player2.getByTestId("bot-message").first();
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("is describing");
    await player2Game.quit();

    confirmMessage = player3.getByTestId("bot-message").nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("left the game");

    const player3Game = new GamePage(player3);
    await player3Game.quit();

    confirmMessage = player1.getByTestId("bot-message").nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("The game is over");

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasWon(player1, player1Stats);
    await assertHasLost(player2, player2Stats);
    await assertHasLost(player3, player3Stats);
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

    await player2.waitForURL("/dashboard");
    await player2.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
    await assertHasWon(player3, player3Stats);
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

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
    await assertHasLost(player3, player3Stats);
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

    await assertRank(player1, 3);
    await assertRank(player2, 2);
    await assertRank(player3, 1);

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
    await assertHasWon(player3, player3Stats);
  });
});
