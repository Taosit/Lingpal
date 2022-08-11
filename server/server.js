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
				rooms[waitroom.id] = {
					players: newPlayers,
					round: 0,
					describerIndex: 0,
				};
				waitroom = null;
			}
		});

		socket.on("note-time", ({ roomId, time }) => {
			console.log("setting note time");
			rooms[roomId].timer = setTimer(io, roomId, time);
		});

		socket.on("save-notes", ({ userId, roomId, notes }) => {
			const players = rooms[roomId].players;
			const updatedPlayers = updatePlayerNotes(players, userId, notes);
			rooms[roomId].players = updatedPlayers;
			io.to(roomId).emit("update-notes", updatedPlayers);
		});

		socket.on("turn-time", ({ roomId, time }) => {
			console.log("setting turn time");
			rooms[roomId].timer = setTimer(io, roomId, time);
		});

		socket.on("update-turn", roomId => {
			const playerNumber = 2;
			const roundNumber = 2;
			const room = rooms[roomId];
			if (room.describerIndex < playerNumber - 1) {
				const newDescriberIndex = room.describerIndex + 1;
				rooms[roomId].describerIndex = newDescriberIndex;
				io.to(roomId).emit("turn-updated", {
					newRound: room.round,
					newDescriberIndex,
				});
			} else if (room.round < roundNumber - 1) {
				const newRound = room.round + 1;
				rooms[roomId].round = newRound;
				rooms[roomId].describerIndex = 0;
				io.to(roomId).emit("round-updated", {
					newRound,
					newDescriberIndex: 0,
				});
			}
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
				console.log("clearing turn interval");
				clearInterval(rooms[roomId].timer);
				const players = rooms[roomId].players;
				let updatedPlayers = increasePlayerScore(players, sender._id, 2);
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
				console.log("emiting correct-answer");
				io.to(roomId).emit("correct-answer", updatedPlayers);
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
