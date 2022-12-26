const express = require("express");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./dbconnect");
const cookieParser = require("cookie-parser");
const { v4: uuid } = require("uuid");
const path = require("path");

const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const refreshTokenRouter = require("./routes/refreshToken");
const userRouter = require("./routes/user");

const { waitrooms, rooms } = require("./model/rooms");
const {
  setTimer,
  increasePlayerScore,
  updatePlayerNotes,
  checkGameStart,
  startGame,
  getNextTurn,
  calculateGameStats,
  flattenWaitroom,
} = require("./controllers/gameLogic");
const User = require("./model/User");

connectDb();
const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://lingpal.herokuapp.com:*"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const developmentUrl = "http://localhost:3000";
const productionUrl = "https://lingpal.herokuapp.com";

app.use(
  cors({
    origin: developmentUrl,
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/refresh-token", refreshTokenRouter);
app.use("/user", userRouter);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log("in production");
  app.use(express.static(path.resolve(__dirname1, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("App is running successfully");
  });
}

mongoose.connection.once("open", () => {
  io.on("connection", (socket) => {
    console.log("connected");
    socket.on("join-room", ({ settings, user }) => {
      const { mode, level, describer } = settings;
      let waitroom = waitrooms[mode][level][describer];
      if (!waitroom) {
        waitroom = { id: uuid(), players: {}, settings };
        waitrooms[mode][level][describer] = waitroom;
      }
      const userCopy = {
        ...user,
        order: Object.keys(waitroom.players).length,
        isReady: false,
        socketId: socket.id,
      };
      delete userCopy.refreshToken;
      waitroom.players[user._id] = userCopy;
      socket.join(waitroom.id);
      io.to(waitroom.id).emit("update-players", waitroom.players);
      if (Object.keys(waitroom.players).length === 4) {
        startGame(io, waitroom);
        waitrooms[mode][level][describer] = null;
      }
      return Object.keys(waitroom.players).length;
    });

    socket.on("player-ready", ({ user, settings, isReady }) => {
      const { mode, level, describer } = settings;
      const waitroom = waitrooms[mode][level][describer];
      waitroom.players[user._id].isReady = isReady;
      io.to(waitroom.id).emit("update-players", waitroom.players);
      if (checkGameStart(waitroom.players)) {
        startGame(io, waitroom);
        waitrooms[mode][level][describer] = null;
      }
    });

    socket.on("note-time", ({ roomId, time }) => {
      rooms[roomId].timer = setTimer(io, roomId, time);
    });

    socket.on("save-notes", ({ userId, roomId, notes }) => {
      const players = rooms[roomId].players;
      const updatedPlayers = updatePlayerNotes(players, userId, notes);
      rooms[roomId].players = updatedPlayers;
      io.to(roomId).emit("update-notes", updatedPlayers);
    });

    socket.on("turn-time", ({ roomId, time }) => {
      rooms[roomId].timer = setTimer(io, roomId, time);
    });

    socket.on("update-turn", ({ roomId, players }) => {
      const room = rooms[roomId];
      const { nextDesc, nextRound } = getNextTurn(room);

      if (nextRound === room.round) {
        rooms[roomId].describerIndex = nextDesc;
        io.to(roomId).emit("turn-updated", nextDesc);
      } else if (nextRound < 2) {
        rooms[roomId].round = nextRound;
        rooms[roomId].describerIndex = nextDesc;
        io.to(roomId).emit("round-updated", {
          nextRound,
          nextDesc,
        });
      } else {
        const playersWithStats = calculateGameStats(room.players);
        io.to(roomId).emit("game-over", playersWithStats);
      }
      if (players) {
        console.log({ timer: rooms[roomId].timer });
        rooms[roomId].timer = setTimer(io, roomId, 120);
        console.log({ timer: rooms[roomId].timer });
        rooms[roomId].players = players;
        io.to(roomId).emit("update-players", players);
      }
    });

    socket.on("send-message", ({ message, word, roomId }) => {
      const { sender, isDescriber, text } = message;
      const includesWord = text.toLowerCase().includes(word);
      if (includesWord && isDescriber) return;
      io.to(roomId).emit("receive-message", message);
      if (includesWord) {
        const confirmMessage = {
          sender: null,
          isBot: true,
          isDescriber: null,
        };
        socket.broadcast.to(roomId).emit("receive-message", {
          ...confirmMessage,
          text: `The correct word is ${word}. ${sender.username} got 2 points`,
        });
        socket.emit("receive-message", {
          ...confirmMessage,
          text: `The correct word is ${word}. Well done!`,
        });
        clearInterval(rooms[roomId].timer);
        const players = rooms[roomId].players;
        let updatedPlayers = increasePlayerScore(players, sender._id, 2);
        const describer = Object.values(players).find(
          (p) => p.order === rooms[roomId].describerIndex
        );
        updatedPlayers = increasePlayerScore(updatedPlayers, describer._id, 1);
        rooms[roomId].players = updatedPlayers;
        io.to(roomId).emit("correct-answer", updatedPlayers);
      }
    });

    socket.on("send-rating", ({ value, roomId }) => {
      rooms[roomId].ratings.push(value);
      const averageRating =
        rooms[roomId].ratings.reduce((total, rating) => total + rating) /
        rooms[roomId].ratings.length;
      io.to(roomId).emit("rating-update", averageRating);
    });

    socket.on("clear-ratings", (roomId) => {
      rooms[roomId].ratings = [];
    });

    socket.on("someone-left", ({ player, roomId }) => {
      delete rooms[roomId].players[player._id];
      if (Object.keys(rooms[roomId].players).length > 0) {
        socket.emit("player-left", player);
      } else {
        delete rooms[roomId];
      }
    });

    socket.on("disconnecting", async () => {
      console.log("disconnecting");
      const sockeRooms = [...socket.rooms];
      const roomId = sockeRooms.find((roomId) => roomId !== socket.id);
      if (!roomId) return;
      if (rooms[roomId]) {
        const disconnectingUser = Object.values(rooms[roomId].players).find(
          (p) => p.socketId === socket.id
        );
        await User.findByIdAndUpdate(disconnectingUser._id, {
          $inc: { total: 1 },
        });
        delete rooms[roomId].players[disconnectingUser._id];
        if (Object.keys(rooms[roomId].players).length > 0) {
          socket.broadcast.to(roomId).emit("player-left", disconnectingUser);
        } else {
          delete rooms[roomId];
        }
      } else {
        const waitroomArray = flattenWaitroom(waitrooms);
        const waitroom = waitroomArray.find(
          (waitroom) => waitroom.id === roomId
        );
        const disconnectingUser = Object.values(waitroom.players).find(
          (p) => p.socketId === socket.id
        );
        delete waitroom.players[disconnectingUser._id];
        const { mode, level, describer } = waitroom.settings;
        if (Object.keys(waitroom.players).length > 0) {
          waitrooms[mode][level][describer].players = waitroom.players;
          socket.broadcast.to(roomId).emit("update-players", waitroom.players);
        } else {
          waitrooms[mode][level][describer] = null;
        }
      }
    });

    socket.on("disconnect", () => {});
  });

  server.listen(PORT, () => {
    console.log("connected to port 5000");
  });
});
