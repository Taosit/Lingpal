import { describe, test } from "./fixures/base-game";
import GamePage from "./pages/game";
import NotesPage from "./pages/notes";

describe("2 player standard mode", () => {
  test("Player leaves notes room", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1.waitForTimeout(1000);
    await player1Notes.quit();
  });

  test("Player takes and edits notes", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1Notes.writeNote("This is a note");
    await player1Notes.writeNote("This is another note");
    await player1Notes.editNote("This is a note", "This is a new note");
    await player1.waitForTimeout(1000);
    await player1Notes.quit();
  });

  test("Describer leaves game room", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1.waitForTimeout(1000);
    await player1Game.quit();
  });

  test("Non describer leaves game room", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");
    const player2Game = new GamePage(player2);
    await player2.waitForTimeout(1000);
    await player2Game.quit();
  });

  test("Players exchange messages", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1Game.sendMessage("Message from player 1");
    await player1.waitForTimeout(1000);
    const player2Game = new GamePage(player2);
    await player2Game.sendMessage("Message from player 2");
    await player1.waitForTimeout(1000);
    await player1Game.sendMessage("Return message from player 1");
    await player1.waitForTimeout(1000);
    await player1Game.quit();
  });

  test("Describer chooses notes", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1Notes.writeNote("My note");
    await player1Notes.writeNote("My other note");
    await player1Notes.editNote("My note", "My new note");
    await player1.waitForURL("/game-room");
    const player1Game = new GamePage(player1);
    await player1Game.selectNote();
    await player1.waitForTimeout(1000);
    await player1Game.quit();
  });

  test("Player leaves notes room for round 2", async ({ player1, player2 }) => {
    await player1.bringToFront();
    await player2.waitForURL("/game-room");
    const player2Game = new GamePage(player2);
    await player1.waitForTimeout(1000);
    await player2Game.sendMessage("This is the correct answer for easy words.");
    const confirmMessage = player1.getByText(/is describing/);
    await confirmMessage.waitFor({ state: "visible" });
    const player1Game = new GamePage(player1);
    await player1Game.sendMessage("This is the correct answer for easy words.");
    await player1.waitForURL("/notes-room");
    const player1Notes = new NotesPage(player1);
    await player1.waitForTimeout(1000);
    await player1Notes.quit();
  });

  test.only("Playthrough", async ({ player1, player2 }) => {
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
  });
});
