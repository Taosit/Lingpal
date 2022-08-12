const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) return res.sendStatus(400);

	try {
		const duplicate = await User.findOne({ username }).exec();
		if (duplicate) return res.sendStatus(409);
		const duplicateEmail = await User.findOne({ email }).exec();
		if (duplicateEmail) return res.sendStatus(410);
		const hashedPwd = await bcrypt.hash(password, 10);
		const user = await User.create({ username, email, password: hashedPwd });

		delete user.refreshToken;
		delete user.password;

		const accessToken = jwt.sign(
			{ email: email },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "2h" }
		);
		const refreshToken = jwt.sign(
			{ email: email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);
		await User.updateOne({ email }, { $set: { refreshToken } });
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			// sameSite: "None",
			// secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.status(200).json({ accessToken, user });
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

module.exports = router;
