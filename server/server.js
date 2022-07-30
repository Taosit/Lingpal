const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./dbconnect");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const refreshTokenRouter = require("./routes/refreshToken");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");

connectDb();

const app = express();
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
	app.listen("5000", () => {
		console.log("connected to port 5000");
	});
});
