import { test } from "./fixures/base-game";
import GamePage from "./pages/game";
import NotesPage from "./pages/notes";

test.only("2 player basic", async ({ player1, player2 }) => {
  await player1.bringToFront();
  await player1.waitForURL("/notes-room");
  const player1Notes = new NotesPage(player1);
  await player1Notes.writeNote("This is a note");
  await player1Notes.writeNote("This is another note");
  await player1Notes.editNote("This is a note", "This is a new note");
  //   await player1Notes.quit();
  await player1.waitForURL("/game-room");
  const player1Game = new GamePage(player1);
  await player1Game.selectNote();
  await player1Game.sendMessage("This is a message");
  await player1.waitForTimeout(1000);
  const player2Game = new GamePage(player2);
  await player2Game.sendMessage("This is a message from player 2");
  await player1.waitForTimeout(1000);
  await player1Game.quit();
  await player2.pause();
});
