const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const router = express.Router();

router.post("/", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.sendStatus(400);
	const user = await User.findOne({ email });
	if (!user) return res.sendStatus(401);
	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.sendStatus(401);

	const {refreshToken, password:databasePassword, ...userCopy} = user._doc;
	console.log({userCopy})

	const accessToken = jwt.sign(
		{ email: email },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "2h" }
	);
	const newRefreshToken = jwt.sign(
		{ email: email },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "1d" }
	);
	await User.updateOne({ email }, { $set: { newRefreshToken } });
	res.cookie("jwt", newRefreshToken, {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.status(200).json({ accessToken, user: userCopy });
});

module.exports = router;
