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
	initializePlayers,
	setTimer,
	increasePlayerScore,
	updatePlayerNotes,
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
		console.log("a user connected");

		socket.on("join-room", ({ settings, user }) => {
			const { mode, level, describer } = settings;
			let waitroom = waitrooms[mode][level][describer];
			if (!waitroom) {
				waitroom = { id: uuid(), players: {} };
				waitrooms[mode][level][describer] = waitroom;
			}
			const userCopy = { ...user, order: Object.keys(waitroom.players).length };
			delete userCopy.refreshToken;
			waitroom.players[user._id] = userCopy;
			socket.join(waitroom.id);
			io.to(waitroom.id).emit("update-players", waitroom.players);
			if (Object.keys(waitroom.players).length === 2) {
				console.log("emitted game-start");
				const newPlayers = initializePlayers(waitroom.players);
				io.to(waitroom.id).emit("game-start", {
					players: newPlayers,
					roomId: waitroom.id,
				});
				rooms[waitroom.id] = { players: newPlayers };
				waitroom = null;
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

		socket.on("start-round", ({ roomId, time }) => {
			const room = rooms[roomId];
			if (room.round === null || room.round === undefined) {
				room.round = 0;
			} else {
				room.round = room.round + 1;
			}
			console.log("setting describerIndex to 0");
			room.describerIndex = 0;
			room.timer = setTimer(io, roomId, time);
			rooms[roomId] = room;
			console.log("on start-round: ", { round: rooms[roomId].round });
		});

		socket.on("new-turn", ({ roomId, time }) => {
			console.log("incrementing describerIndex");
			rooms[roomId].describerIndex++;
			rooms[roomId].timer = setTimer(io, roomId, time);
		});

		socket.on("send-message", ({ message, word, roomId }) => {
			const { sender, isDescriber, text } = message;
			const includesWord = text.toLowerCase().includes(word);
			if (includesWord && isDescriber) return;
			socket.broadcast.to(roomId).emit("receive-message", message);
			socket.emit("receive-message", { ...message, sender: "You" });
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
				console.log("emitting turn-end: ", { round: rooms[roomId].round });
				io.to(roomId).emit("turn-end", [
					rooms[roomId].round,
					rooms[roomId].describerIndex,
				]);
				const players = rooms[roomId].players;
				let updatedPlayers = increasePlayerScore(players, sender._id, 2);
				console.log("describerIndex", rooms[roomId].describerIndex);
				const describer = Object.values(players).find(
					p => p.order === rooms[roomId].describerIndex
				);
				console.log(
					"sender",
					sender?.username,
					"describer",
					describer?.username
				);
				updatedPlayers = increasePlayerScore(updatedPlayers, describer._id, 1);
				io.to(roomId).emit("update-players", updatedPlayers);
			}
		});

		socket.on("leave-room", ({ settings, user }) => {
			const { mode, level, describer } = settings;
			let waitroom = waitrooms[mode][level][describer];
			console.log(user.username, "left room");
			if (!waitroom) return;
			const waitroomId = waitroom.id;
			delete waitroom.players[user_id];
			console.log({ players: Object.keys(waitroom.players).length });
			if (!Object.keys(waitroom.players).length) {
				waitrooms[mode][level][describer] = null;
			}
			io.to(waitroom.id).emit("update-players", newPlayers);
			socket.leave(waitroomId);
		});

		socket.on("quit-game", ({ user, roomId }) => {
			socket.leave(roomId);
			delete rooms[roomId].players[user._id];
			io.to(roomId).emit("player-left", rooms[roomId]);
		});

		socket.on("disconnect", () => {
			console.log("user disconnected");
		});
	});

	server.listen("5000", () => {
		console.log("connected to port 5000");
	});
});
