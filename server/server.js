const express = require("express");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./dbconnect");
const cookieParser = require("cookie-parser");
const { v4: uuid } = require("uuid");

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
} = require("./controllers/gameLogic");

connectDb();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/refresh-token", refreshTokenRouter);
app.use("/user", userRouter);

mongoose.connection.once("open", () => {
	console.log("db connected");

	io.on("connection", socket => {
		socket.on("join-room", ({ settings, user }) => {
			const { mode, level, describer } = settings;
			let waitroom = waitrooms[mode][level][describer];
			if (!waitroom) {
				waitroom = { id: uuid(), players: {} };
				waitrooms[mode][level][describer] = waitroom;
			}
			const userCopy = {
				...user,
				order: Object.keys(waitroom.players).length,
				isReady: false,
			};
			console.log({ players: Object.keys(waitroom.players).length });
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

		socket.on("update-turn", roomId => {
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
					text: `The correct word is ${word}. ${sender.username} got 1 point`,
				});
				socket.emit("receive-message", {
					...confirmMessage,
					text: `The correct word is ${word}. Well done!`,
				});
				clearInterval(rooms[roomId].timer);
				const players = rooms[roomId].players;
				let updatedPlayers = increasePlayerScore(players, sender._id, 2);
				const describer = Object.values(players).find(
					p => p.order === rooms[roomId].describerIndex
				);
				updatedPlayers = increasePlayerScore(updatedPlayers, describer._id, 1);
				rooms[roomId].players = updatedPlayers;
				io.to(roomId).emit("correct-answer", updatedPlayers);
			}
		});

		socket.on("leave-room", ({ settings, user }) => {
			const { mode, level, describer } = settings;
			let waitroom = waitrooms[mode][level][describer];
			console.log(user.username, "left room");
			if (!waitroom) return;
			const waitroomId = waitroom.id;
			delete waitroom.players[user._id];
			console.log({ players: Object.keys(waitroom.players).length });
			if (!Object.keys(waitroom.players).length) {
				waitrooms[mode][level][describer] = null;
			}
			socket.broadcast.to(waitroomId).emit("update-players", waitroom.players);
			socket.leave(waitroomId);
		});

		socket.on("quit-game", ({ user, roomId }) => {
			console.log(user.username, "quits game in", { room: rooms[roomId] });
			delete rooms[roomId].players[user._id];
			io.to(roomId).emit("player-left", rooms[roomId], user);
			socket.leave(roomId);
		});

		socket.on("disconnect", () => {
			console.log("user disconnected");
		});
	});

	server.listen("5000", () => {
		console.log("connected to port 5000");
	});
});
