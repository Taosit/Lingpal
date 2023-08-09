import { test, Page, expect } from "@playwright/test";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data/data";
import SettingsPage from "./pages/settings";
import GamePage from "./pages/game";

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

  test.afterEach(async () => {
    await player1.waitForURL("/dashboard");
    await player1.getByRole("button", { name: "Logout" }).click();
    await player2.waitForURL("/dashboard");
    await player2.getByRole("button", { name: "Logout" }).click();
  });

  test("2 simultaneous games of the same setting", async ({ browser }) => {
    await player1.getByRole("button", { name: "Ready" }).click();
    await player2.getByRole("button", { name: "Ready" }).click();
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

    await player3.getByRole("button", { name: "Ready" }).click();
    await player4.getByRole("button", { name: "Ready" }).click();

    await player1.waitForURL("/game-room");
    const firstGroup = await player1.getByTestId("player-avatar").all();
    expect(firstGroup.length).toBe(2);

    await player3.waitForURL("/game-room");
    const secondGroup = await player3.getByTestId("player-avatar").all();
    expect(secondGroup.length).toBe(2);

    const player1Game = new GamePage(player1);
    const player3Game = new GamePage(player3);

    await player1Game.quit();
    await player3Game.quit();

    await player3.waitForURL("/dashboard");
    await player3.getByRole("button", { name: "Logout" }).click();
    await player4.waitForURL("/dashboard");
    await player4.getByRole("button", { name: "Logout" }).click();
  });

  test("Players Simultaneously join in 2 games of the same setting", async ({
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

    await player1.waitForURL("/game-room");
    const firstGroup = await player1.getByTestId("player-avatar").all();
    expect(firstGroup.length).toBe(4);

    await player5.waitForURL("/game-room");
    const secondGroup = await player5.getByTestId("player-avatar").all();
    expect(secondGroup.length).toBe(4);

    const player1Game = new GamePage(player1);
    const player2Game = new GamePage(player2);
    const player3Game = new GamePage(player3);
    const player5Game = new GamePage(player5);
    const player6Game = new GamePage(player6);
    const player7Game = new GamePage(player7);

    await player1Game.quit();
    await player2Game.quit();
    await player3Game.quit();
    await player5Game.quit();
    await player6Game.quit();
    await player7Game.quit();

    await player3.waitForURL("/dashboard");
    await player3.getByRole("button", { name: "Logout" }).click();
    await player4.waitForURL("/dashboard");
    await player4.getByRole("button", { name: "Logout" }).click();
    await player5.waitForURL("/dashboard");
    await player5.getByRole("button", { name: "Logout" }).click();
    await player6.waitForURL("/dashboard");
    await player6.getByRole("button", { name: "Logout" }).click();
    await player7.waitForURL("/dashboard");
    await player7.getByRole("button", { name: "Logout" }).click();
    await player8.waitForURL("/dashboard");
    await player8.getByRole("button", { name: "Logout" }).click();
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

    await player1.waitForURL("/game-room");
    const firstGroup = await player1.getByTestId("player-avatar").all();
    expect(firstGroup.length).toBe(2);

    await player3.waitForURL("/game-room");
    const secondGroup = await player3.getByTestId("player-avatar").all();
    expect(secondGroup.length).toBe(2);

    await player5.waitForURL("/game-room");
    const thirdGroup = await player5.getByTestId("player-avatar").all();
    expect(thirdGroup.length).toBe(2);

    const player1Game = new GamePage(player1);
    const player3Game = new GamePage(player3);
    const player5Game = new GamePage(player5);

    await player1Game.quit();
    await player3Game.quit();
    await player5Game.quit();

    await player3.waitForURL("/dashboard");
    await player3.getByRole("button", { name: "Logout" }).click();
    await player4.waitForURL("/dashboard");
    await player4.getByRole("button", { name: "Logout" }).click();
    await player5.waitForURL("/dashboard");
    await player5.getByRole("button", { name: "Logout" }).click();
    await player6.waitForURL("/dashboard");
    await player6.getByRole("button", { name: "Logout" }).click();
  });
});
