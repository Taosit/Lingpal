import { test, Page, expect } from "@playwright/test";
import GamePage from "./pages/game";
import { getSetting, logInAndChooseSettings } from "./utils/helpers";
import { credentials } from "./data/data";
import SettingsPage from "./pages/settings";
import DashboardPage from "./pages/dashboard";
import NotesPage from "./pages/notes";

test.describe("3 player relaxed mode", () => {
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

  test("Players leave notes room", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");

    const player1Notes = new NotesPage(player1);
    await player1Notes.quit();

    const player2Notes = new NotesPage(player2);
    await player2Notes.quit();

    await player2.waitForURL("/dashboard");
    await player2.waitForTimeout(1000);

    const player1Dashboard = new DashboardPage(player1);
    const player1Total = await player1Dashboard.getTotal();
    expect(player1Total).toBe(player1Stats.total);

    const player2Dashboard = new DashboardPage(player2);
    const player2Total = await player2Dashboard.getTotal();
    expect(player2Total).toBe(player2Stats.total);

    const player3Dashboard = new DashboardPage(player3);
    const player3Total = await player3Dashboard.getTotal();
    expect(player3Total).toBe(player3Stats.total);
  });

  test("Players leave game room", async () => {
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

    const player1Dashboard = new DashboardPage(player1);
    const player1Total = await player1Dashboard.getTotal();
    expect(player1Total).toBe(player1Stats.total);

    const player2Dashboard = new DashboardPage(player2);
    const player2Total = await player2Dashboard.getTotal();
    expect(player2Total).toBe(player2Stats.total);

    const player3Dashboard = new DashboardPage(player3);
    const player3Total = await player3Dashboard.getTotal();
    expect(player3Total).toBe(player3Stats.total);
  });

  test("Players give each other ratings and playthrough", async () => {
    test.setTimeout(80000);
    await player1.waitForURL("/game-room");

    let confirmMessage = player3.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player3Game = new GamePage(player3);
    await player3Game.sendMessage("This is the correct answer for easy words.");
    let star = player3.locator("css=.star-container").nth(3);
    await star.waitFor({ state: "visible" });
    await star.click();
    await player2.locator("css=.star-container").nth(1).click();
    let thirdStar = player1.locator("css=.star-container path").nth(2);
    let fourthStar = player1.locator("css=.star-container path").nth(3);
    expect(thirdStar).toHaveAttribute(
      "style",
      "fill: yellow; transition: fill 0.2s ease-in-out 0s;"
    );
    expect(fourthStar).toHaveAttribute(
      "style",
      "fill: rgb(203, 211, 227); transition: fill 0.2s ease-in-out 0s;"
    );

    confirmMessage = player3.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");
    await star.waitFor({ state: "visible" });
    await star.click();
    expect(thirdStar).toHaveAttribute(
      "style",
      "fill: yellow; transition: fill 0.2s ease-in-out 0s;"
    );

    confirmMessage = player2.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");
    star = player2.locator("css=.star-container").nth(4);
    await star.waitFor({ state: "visible" });
    await star.click();
    await player1.locator("css=.star-container").nth(3).click();
    const fifthStar = player3.locator("css=.star-container path").nth(4);
    expect(fifthStar).toHaveAttribute(
      "style",
      /^fill: url(.*); transition: fill 0.2s ease-in-out 0s;$/
    );

    confirmMessage = player3.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player3.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player3Game.sendMessage("This is the correct answer for easy words.");

    confirmMessage = player2.getByText(/is describing/).nth(3);
    await confirmMessage.waitFor({ state: "visible" });
    await player2Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    const player1Dashboard = new DashboardPage(player1);
    const player1Total = await player1Dashboard.getTotal();
    expect(player1Total).toBe(player1Stats.total);

    const player2Dashboard = new DashboardPage(player2);
    const player2Total = await player2Dashboard.getTotal();
    expect(player2Total).toBe(player2Stats.total);

    const player3Dashboard = new DashboardPage(player3);
    const player3Total = await player3Dashboard.getTotal();
    expect(player3Total).toBe(player3Stats.total);
  });
});
