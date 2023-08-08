import { test, Page, expect } from "@playwright/test";
import GamePage from "./pages/game";
import NotesPage from "./pages/notes";
import { credentials } from "./data/data";
import {
  assertHasLost,
  assertHasWon,
  assertRank,
  getSetting,
  logInAndChooseSettings,
} from "./utils/helpers";
import SettingsPage from "./pages/settings";

test.describe("2 player standard mode", () => {
  let player1: Page;
  let player2: Page;

  let player1Stats: { total: number; win: number };
  let player2Stats: { total: number; win: number };

  test.beforeEach(async ({ browser }) => {
    player1 = await (await browser.newContext()).newPage();
    player2 = await (await browser.newContext()).newPage();
    const [stats1, stats2] = await Promise.all([
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
    player1Stats = stats1;
    player2Stats = stats2;

    const player1Settings = new SettingsPage(player1);
    await player1Settings.clickPlay();
    const player2Settings = new SettingsPage(player2);
    await player2Settings.clickPlay();
    await player1.getByRole("button", { name: "Ready" }).click();
    await player2.getByRole("button", { name: "Ready" }).click();
  });

  test("Player leaves notes room", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1.waitForTimeout(1000);
    await player1Notes.quit();

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
  });

  test("Player takes and edits notes", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1Notes.writeNote("This is a note");
    await player1Notes.writeNote("This is another note");
    await player1Notes.editNote("This is a note", "This is a new note");
    const note1 = player1.getByTestId("filled-note").first();
    expect(note1).toHaveText("This is a new note");
    const note2 = player1.getByTestId("filled-note").nth(1);
    expect(note2).toHaveText("This is another note");
    await player1.waitForTimeout(1000);
    await player1Notes.quit();
  });

  test("Describer leaves game room", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1.waitForTimeout(1000);
    let confirmMessage = player1.getByTestId("bot-message").first();
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toHaveText("You are describing");

    await player1Game.quit();
    confirmMessage = player2.getByTestId("bot-message").nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("The game is over");

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
  });

  test("Non describer leaves game room", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");
    const player2Game = new GamePage(player2);
    await player2.waitForTimeout(1000);
    await player2Game.quit();
    let botMessage = player1.getByTestId("bot-message").nth(1);
    await botMessage.waitFor({ state: "visible" });
    expect(botMessage).toContainText("The game is over");

    await player2.waitForURL("/dashboard");
    await player2.waitForTimeout(1000);

    await assertHasWon(player1, player1Stats);
    await assertHasLost(player2, player2Stats);
  });

  test("Players exchange messages", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1Game.sendMessage("Message from player 1");
    let message = player2.getByTestId("player-message").first();
    await message.waitFor({ state: "visible" });
    expect(message).toContainText("Message from player 1");

    await player1.waitForTimeout(1000);
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("Message from player 2");
    message = player1.getByTestId("player-message").nth(1);
    await message.waitFor({ state: "visible" });
    expect(message).toContainText("Message from player 2");

    await player1.waitForTimeout(1000);
    await player1Game.sendMessage("Return message from player 1");
    message = player2.getByTestId("player-message").nth(2);
    await message.waitFor({ state: "visible" });
    expect(message).toContainText("Return message from player 1");
    await player1.waitForTimeout(1000);
    await player1Game.quit();
  });

  test("Describer chooses notes", async () => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1Notes.writeNote("My note");
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1Game.selectNote();
    let message = player2.getByTestId("player-message").first();
    await message.waitFor({ state: "visible" });
    expect(message).toContainText("My note");
    message = player1.getByTestId("player-message").first();
    await message.waitFor({ state: "visible" });
    expect(message).toContainText("My note");

    await player1.waitForTimeout(1000);
    await player1Game.quit();
  });

  test("Player leaves notes room for round 2", async () => {
    await player1.bringToFront();
    await player2.waitForURL("/game-room");
    const player2Game = new GamePage(player2);
    await player1.waitForTimeout(1000);

    await player2Game.sendMessage("This is the correct answer for easy words.");
    let confirmMessage = player2.getByTestId("bot-message").nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("Well done!");

    confirmMessage = player1.getByTestId("bot-message").nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    expect(confirmMessage).toContainText("is describing");

    const player1Game = new GamePage(player1);
    await player1Game.sendMessage("This is the correct answer for easy words.");
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1.waitForTimeout(1000);
    await player1Notes.quit();

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasLost(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
  });

  test("Playthrough", async () => {
    test.setTimeout(40000);
    await player1.bringToFront();
    await player2.waitForURL("/game-room");
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("This is the correct answer for easy words.");
    let confirmMessage = player1.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player1Game = new GamePage(player1);
    await player1Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForURL("/notes-room");
    await player2.waitForURL("/game-room");
    await player2Game.sendMessage("This is the correct answer for easy words.");
    confirmMessage = player1.getByText(/is describing/).nth(1);
    await confirmMessage.waitFor({ state: "visible" });
    await player1Game.sendMessage("This is the correct answer for easy words.");

    await player1.waitForURL("/notes-room");
    await player2.waitForURL("/game-room");
    await player2Game.sendMessage("This is the correct answer for easy words.");
    confirmMessage = player1.getByText(/is describing/).nth(2);
    await confirmMessage.waitFor({ state: "visible" });
    await player1Game.sendMessage("This is the correct answer for easy words.");

    await assertRank(player1, 1);
    await assertRank(player2, 1);

    await player1.waitForURL("/dashboard");
    await player1.waitForTimeout(1000);

    await assertHasWon(player1, player1Stats);
    await assertHasWon(player2, player2Stats);
  });
});
