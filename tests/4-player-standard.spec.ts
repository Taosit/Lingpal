import { test, Page } from "@playwright/test";
import GamePage from "./pages/game";
import {
  assertHasLost,
  assertHasWon,
  assertRank,
  getSetting,
  logInAndChooseSettings,
} from "./utils/helpers";
import { credentials } from "./data";
import SettingsPage from "./pages/settings";

test.describe("4 player standard mode", () => {
  let player1: Page;
  let player2: Page;
  let player3: Page;
  let player4: Page;

  let player1Stats: { total: number; win: number };
  let player2Stats: { total: number; win: number };
  let player3Stats: { total: number; win: number };
  let player4Stats: { total: number; win: number };

  test.beforeEach(async ({ browser }) => {
    player1 = await (await browser.newContext()).newPage();
    player2 = await (await browser.newContext()).newPage();
    player3 = await (await browser.newContext()).newPage();
    player4 = await (await browser.newContext()).newPage();
    const [stats1, stats2, stats3, stats4] = await Promise.all([
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
    player1Stats = stats1;
    player2Stats = stats2;
    player3Stats = stats3;
    player4Stats = stats4;

    const player1Settings = new SettingsPage(player1);
    await player1Settings.clickPlay();
    const player2Settings = new SettingsPage(player2);
    await player2Settings.clickPlay();
    const player3Settings = new SettingsPage(player3);
    await player3Settings.clickPlay();
    const player4Settings = new SettingsPage(player4);
    await player4Settings.clickPlay();
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

    await assertRank(player1, 3);
    await assertRank(player2, 1);
    await assertRank(player3, 1);
    await assertRank(player4, 3);

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
    await assertHasWon(player3, player3Stats);
    await assertHasLost(player4, player4Stats);
  });
});
