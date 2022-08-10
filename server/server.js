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
const { initializePlayers, setTimer } = require("./controllers/gameLogic");

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
			console.log("join-room");
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
				console.log("note-time");
				const newPlayers = initializePlayers(waitroom.players);
				io.to(waitroom.id).emit("note-time", {
					players: newPlayers,
					roomId: waitroom.id,
				});
				rooms[waitroom.id] = waitroom.players;
				waitroom = null;
			}
		});

		socket.on("set-timer", (roomId, time) => {
			setTimer(io, roomId, time);
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
			delete rooms[roomId][user._id];
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
