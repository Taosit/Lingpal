const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./dbconnect");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const refreshTokenRouter = require("./routes/refreshToken");
const cookieParser = require("cookie-parser");

connectDb();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const whitelist = ["http://localhost:3000", "http://127.0.0.1:5000"];

app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (whitelist.includes(origin)) {
		console.log("setting header");
		res.header("Access-Control-Allow-Credentials", true);
	}
	next();
});

const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			console.log({ header: res.header });
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};
app.use(
	cors({
		corsOptions,
	})
);

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/refresh-token", refreshTokenRouter);

mongoose.connection.once("open", () => {
	console.log("db connected");
	app.listen("5000", () => {
		console.log("connected to port 5000");
	});
});
